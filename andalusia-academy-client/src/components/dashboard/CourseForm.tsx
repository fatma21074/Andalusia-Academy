import { useState, type FormEvent } from "react";
import { COURSE_STATUSES, type CourseAdminInput } from "../../services/admin";
import type { AdminInstructor, CatalogStatus, Category, CourseDetail } from "../../types";
import { onlyProblems, requiredProblem } from "../../utils/validation";
import Button from "../Button";
import FormField from "../FormField";
import FormSelect from "../FormSelect";
import FormTextArea from "../FormTextArea";

interface CourseFormProps {
  categories: Category[];
  /** `undefined` while the instructors endpoint is unavailable: the form then asks for a typed Instructor ID. */
  instructors?: AdminInstructor[];
  /** When set, the form edits this course instead of creating a new one. */
  course?: CourseDetail;
  submitting: boolean;
  onSubmit: (input: CourseAdminInput) => Promise<boolean>;
  onCancel?: () => void;
}

function initialValues(course?: CourseDetail) {
  return {
    title: course?.title ?? "",
    price: String(course?.price ?? 0),
    categoryId: course ? String(course.categoryId) : "",
    instructorId: course ? String(course.instructorId) : "",
    duration: course?.duration ?? "",
    location: course?.location ?? "",
    shortDescription: course?.shortDescription ?? "",
    imageUrl: course?.imageUrl ?? "",
    fullDescription: course?.fullDescription ?? "",
    status: (course?.status ?? "draft") as CatalogStatus,
  };
}

export default function CourseForm({
  categories,
  instructors,
  course,
  submitting,
  onSubmit,
  onCancel,
}: CourseFormProps) {
  const [values, setValues] = useState(() => initialValues(course));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const editing = course !== undefined;

  function set<K extends keyof typeof values>(key: K) {
    return (value: (typeof values)[K]) => setValues((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const price = Number(values.price);
    const problems = onlyProblems({
      title: requiredProblem(values.title, "Title"),
      price: values.price.trim() === "" || !Number.isFinite(price) || price < 0 ? "Enter a price of 0 or more." : null,
      categoryId: requiredProblem(values.categoryId, "Category"),
      instructorId: requiredProblem(values.instructorId, "Instructor"),
    });
    setErrors(problems);
    if (Object.keys(problems).length > 0) return;

    const saved = await onSubmit({
      title: values.title.trim(),
      shortDescription: values.shortDescription.trim(),
      fullDescription: values.fullDescription.trim(),
      imageUrl: values.imageUrl.trim(),
      duration: values.duration.trim(),
      location: values.location.trim(),
      price,
      categoryId: Number(values.categoryId),
      instructorId: Number(values.instructorId),
      status: values.status,
    });
    if (saved && !editing) setValues(initialValues());
  }

  return (
    <form className="dashboard-form dashboard-form--grid" onSubmit={handleSubmit} noValidate>
      <FormField
        id="course-title"
        label="Course title"
        maxLength={200}
        value={values.title}
        onChange={set("title")}
        error={errors.title}
      />
      <FormField
        id="course-price"
        label="Price"
        type="number"
        min={0}
        step="0.01"
        value={values.price}
        onChange={set("price")}
        error={errors.price}
      />
      <FormSelect
        id="course-category"
        label="Category"
        placeholder="Select category"
        value={values.categoryId}
        options={categories.map((c) => ({ value: String(c.id), label: c.name }))}
        onChange={set("categoryId")}
        error={errors.categoryId}
      />
      {instructors ? (
        <FormSelect
          id="course-instructor"
          label="Instructor"
          placeholder="Select instructor"
          value={values.instructorId}
          options={instructors.map((i) => ({
            value: String(i.instructorId),
            label: `${i.firstName} ${i.lastName} (${i.email})`,
          }))}
          onChange={set("instructorId")}
          error={errors.instructorId}
        />
      ) : (
        <FormField
          id="course-instructor"
          label="Instructor ID"
          type="number"
          min={1}
          value={values.instructorId}
          onChange={set("instructorId")}
          error={errors.instructorId}
        />
      )}
      <FormField
        id="course-duration"
        label="Duration"
        optional
        placeholder="e.g. 8 weeks"
        value={values.duration}
        onChange={set("duration")}
      />
      <FormField id="course-location" label="Location" optional value={values.location} onChange={set("location")} />
      <FormField
        id="course-short"
        label="Short description"
        optional
        maxLength={300}
        value={values.shortDescription}
        onChange={set("shortDescription")}
      />
      <FormField
        id="course-image"
        label="Image URL"
        optional
        type="url"
        value={values.imageUrl}
        onChange={set("imageUrl")}
      />
      {editing && (
        <FormSelect
          id="course-status"
          label="Status"
          value={values.status}
          options={COURSE_STATUSES}
          onChange={(v) => set("status")(v as CatalogStatus)}
        />
      )}
      <div className="dashboard-form__wide">
        <FormTextArea
          id="course-full"
          label="Full description"
          optional
          rows={4}
          value={values.fullDescription}
          onChange={set("fullDescription")}
        />
      </div>
      {!editing && (
        <p className="dashboard__muted dashboard-form__wide">
          New courses start as a draft. Edit the course to publish it.
        </p>
      )}
      <div className="dashboard-form__wide dashboard-form__actions">
        <Button type="submit" disabled={submitting || categories.length === 0}>
          {submitting ? "Saving…" : editing ? "Save changes" : "Create course"}
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" disabled={submitting} onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
