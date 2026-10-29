import { useState, type FormEvent } from "react";
import { useActionRunner } from "../../hooks/useActionRunner";
import { useApi } from "../../hooks/useApi";
import { adminUsersUrl } from "../../services/admin";
import { adminTestimonials, type TestimonialInput } from "../../services/cms";
import type { AdminUser, Testimonial } from "../../types";
import { onlyProblems, requiredProblem } from "../../utils/validation";
import Button from "../Button";
import AsyncView from "../dashboard/AsyncView";
import StatusMessages from "../dashboard/StatusMessages";
import FormSelect from "../FormSelect";
import FormField from "../FormField";
import FormTextArea from "../FormTextArea";
import { PUBLISH_OPTIONS } from "./publishOptions";
import RowActions from "./RowActions";

interface TestimonialFormProps {
  testimonial?: Testimonial;
  users: AdminUser[];
  submitting: boolean;
  onSubmit: (input: TestimonialInput) => Promise<boolean>;
  onCancel?: () => void;
}

function TestimonialForm({
  testimonial,
  users,
  submitting,
  onSubmit,
  onCancel,
}: TestimonialFormProps) {
  // The API only returns the author's name, so match it against the users list to pre-select them.
  const author = users.find(
    (u) => `${u.firstName} ${u.lastName}` === testimonial?.authorName,
  );
  const [userId, setUserId] = useState(author ? String(author.userId) : "");
  const [quote, setQuote] = useState(testimonial?.quote ?? "");
  const [role, setRole] = useState(testimonial?.displayRole ?? "");
  const [published, setPublished] = useState(
    String(testimonial?.isPublished ?? true),
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const problems = onlyProblems({
      userId: requiredProblem(userId, "Author"),
      quote: requiredProblem(quote, "Quote"),
    });
    setErrors(problems);
    if (Object.keys(problems).length > 0) return;

    const saved = await onSubmit({
      userId: Number(userId),
      quote: quote.trim(),
      displayRole: role.trim(),
      isPublished: published === "true",
    });
    if (saved && !testimonial) {
      setUserId("");
      setQuote("");
      setRole("");
    }
  }

  return (
    <form
      className="dashboard-form dashboard-form--grid"
      onSubmit={handleSubmit}
      noValidate
    >
      <FormSelect
        id="testimonial-author"
        label="Author"
        placeholder="Select a user"
        value={userId}
        options={users.map((u) => ({
          value: String(u.userId),
          label: `${u.firstName} ${u.lastName} (${u.email})`,
        }))}
        onChange={setUserId}
        error={errors.userId}
      />
      <FormField
        id="testimonial-role"
        label="Role shown"
        optional
        placeholder="e.g. Graduate, Data Track"
        value={role}
        onChange={setRole}
      />
      <div className="dashboard-form__wide">
        <FormTextArea
          id="testimonial-quote"
          label="Quote"
          rows={3}
          value={quote}
          onChange={setQuote}
          error={errors.quote}
        />
      </div>
      <FormSelect
        id="testimonial-published"
        label="Visibility"
        value={published}
        options={PUBLISH_OPTIONS}
        onChange={setPublished}
      />
      <div className="dashboard-form__wide dashboard-form__actions">
        <Button type="submit" disabled={submitting}>
          {submitting
            ? "Saving…"
            : testimonial
              ? "Save changes"
              : "Add testimonial"}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            disabled={submitting}
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}

export default function TestimonialsPanel() {
  const testimonials = useApi<Testimonial[]>(adminTestimonials.url());
  const users = useApi<AdminUser[]>(adminUsersUrl());
  const [editing, setEditing] = useState<Testimonial | undefined>();
  const { saving, error, notice, run } = useActionRunner();

  function save(input: TestimonialInput) {
    const target = editing;
    return run(
      async () => {
        if (target) await adminTestimonials.update(target.id, input);
        else await adminTestimonials.create(input);
        setEditing(undefined);
        testimonials.reload();
      },
      target ? "Testimonial updated." : "Testimonial added.",
      "Could not save the testimonial.",
    );
  }

  function remove(testimonial: Testimonial) {
    void run(
      async () => {
        await adminTestimonials.remove(testimonial.id);
        testimonials.reload();
      },
      "Testimonial deleted.",
      "Could not delete the testimonial.",
    );
  }

  return (
    <div className="dashboard">
      <StatusMessages error={error} notice={notice} />
      <section
        className="dashboard__panel"
        aria-labelledby="testimonial-form-heading"
      >
        <h2 id="testimonial-form-heading">
          {editing ? "Edit testimonial" : "Add a testimonial"}
        </h2>
        <AsyncView
          query={users}
          loadingLabel="Loading users…"
          empty={{ title: "No users available" }}
        >
          {(userList) => (
            <TestimonialForm
              key={editing?.id ?? "new"}
              testimonial={editing}
              users={userList}
              submitting={saving}
              onSubmit={save}
              onCancel={editing ? () => setEditing(undefined) : undefined}
            />
          )}
        </AsyncView>
      </section>
      <section
        className="dashboard__panel"
        aria-labelledby="testimonial-list-heading"
      >
        <h2 id="testimonial-list-heading">Testimonials</h2>
        <AsyncView
          query={testimonials}
          loadingLabel="Loading testimonials…"
          empty={{ title: "No testimonials yet" }}
        >
          {(list) => (
            <div className="table-wrap">
              <table className="data-table">
                <caption className="sr-only">Graduate testimonials</caption>
                <thead>
                  <tr>
                    <th scope="col">Author</th>
                    <th scope="col">Quote</th>
                    <th scope="col">Visibility</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((t) => (
                    <tr key={t.id}>
                      <td data-label="Author">
                        {t.authorName}
                        {t.displayRole && (
                          <small className="cell-note">{t.displayRole}</small>
                        )}
                      </td>
                      <td data-label="Quote">{t.quote}</td>
                      <td data-label="Visibility">
                        {t.isPublished ? "Published" : "Hidden"}
                      </td>
                      <td data-label="Actions">
                        <RowActions
                          label={t.authorName}
                          busy={saving}
                          onEdit={() => setEditing(t)}
                          onDelete={() => remove(t)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </AsyncView>
      </section>
    </div>
  );
}
