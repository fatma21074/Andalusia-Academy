import { useState, type FormEvent } from "react";
import { useActionRunner } from "../../hooks/useActionRunner";
import { useApi } from "../../hooks/useApi";
import { adminFaqs, type FaqInput } from "../../services/cms";
import type { Faq } from "../../types";
import { onlyProblems, requiredProblem } from "../../utils/validation";
import Button from "../Button";
import AsyncView from "../dashboard/AsyncView";
import StatusMessages from "../dashboard/StatusMessages";
import FormField from "../FormField";
import FormSelect from "../FormSelect";
import FormTextArea from "../FormTextArea";
import { PUBLISH_OPTIONS } from "./publishOptions";
import RowActions from "./RowActions";

interface FaqFormProps {
  faq?: Faq;
  submitting: boolean;
  onSubmit: (input: FaqInput) => Promise<boolean>;
  onCancel?: () => void;
}

function FaqForm({ faq, submitting, onSubmit, onCancel }: FaqFormProps) {
  const [question, setQuestion] = useState(faq?.question ?? "");
  const [answer, setAnswer] = useState(faq?.answer ?? "");
  const [order, setOrder] = useState(String(faq?.displayOrder ?? 0));
  const [published, setPublished] = useState(String(faq?.isPublished ?? true));
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const problems = onlyProblems({
      question: requiredProblem(question, "Question"),
      answer: requiredProblem(answer, "Answer"),
      order:
        Number.isInteger(Number(order)) && order.trim() !== ""
          ? null
          : "Enter a whole number.",
    });
    setErrors(problems);
    if (Object.keys(problems).length > 0) return;

    const saved = await onSubmit({
      question: question.trim(),
      answer: answer.trim(),
      displayOrder: Number(order),
      isPublished: published === "true",
    });
    if (saved && !faq) {
      setQuestion("");
      setAnswer("");
      setOrder("0");
    }
  }

  return (
    <form
      className="dashboard-form dashboard-form--grid"
      onSubmit={handleSubmit}
      noValidate
    >
      <div className="dashboard-form__wide">
        <FormField
          id="faq-question"
          label="Question"
          value={question}
          onChange={setQuestion}
          error={errors.question}
        />
      </div>
      <div className="dashboard-form__wide">
        <FormTextArea
          id="faq-answer"
          label="Answer"
          rows={4}
          value={answer}
          onChange={setAnswer}
          error={errors.answer}
        />
      </div>
      <FormField
        id="faq-order"
        label="Display order"
        type="number"
        value={order}
        onChange={setOrder}
        error={errors.order}
      />
      <FormSelect
        id="faq-published"
        label="Visibility"
        value={published}
        options={PUBLISH_OPTIONS}
        onChange={setPublished}
      />
      <div className="dashboard-form__wide dashboard-form__actions">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving…" : faq ? "Save changes" : "Add question"}
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

export default function FaqsPanel() {
  const faqs = useApi<Faq[]>(adminFaqs.url());
  const [editing, setEditing] = useState<Faq | undefined>();
  const { saving, error, notice, run } = useActionRunner();

  function save(input: FaqInput) {
    const target = editing;
    return run(
      async () => {
        if (target) await adminFaqs.update(target.id, input);
        else await adminFaqs.create(input);
        setEditing(undefined);
        faqs.reload();
      },
      target ? "Question updated." : "Question added.",
      "Could not save the question.",
    );
  }

  function remove(faq: Faq) {
    void run(
      async () => {
        await adminFaqs.remove(faq.id);
        faqs.reload();
      },
      "Question deleted.",
      "Could not delete the question.",
    );
  }

  return (
    <div className="dashboard">
      <StatusMessages error={error} notice={notice} />
      <section className="dashboard__panel" aria-labelledby="faq-form-heading">
        <h2 id="faq-form-heading">
          {editing ? "Edit question" : "Add a question"}
        </h2>
        <FaqForm
          key={editing?.id ?? "new"}
          faq={editing}
          submitting={saving}
          onSubmit={save}
          onCancel={editing ? () => setEditing(undefined) : undefined}
        />
      </section>
      <section className="dashboard__panel" aria-labelledby="faq-list-heading">
        <h2 id="faq-list-heading">Questions</h2>
        <AsyncView
          query={faqs}
          loadingLabel="Loading questions…"
          empty={{ title: "No questions yet" }}
        >
          {(list) => (
            <div className="table-wrap">
              <table className="data-table">
                <caption className="sr-only">
                  Frequently asked questions
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Order</th>
                    <th scope="col">Question</th>
                    <th scope="col">Visibility</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[...list]
                    .sort((a, b) => a.displayOrder - b.displayOrder)
                    .map((faq) => (
                      <tr key={faq.id}>
                        <td data-label="Order">{faq.displayOrder}</td>
                        <td data-label="Question">{faq.question}</td>
                        <td data-label="Visibility">
                          {faq.isPublished ? "Published" : "Hidden"}
                        </td>
                        <td data-label="Actions">
                          <RowActions
                            label={faq.question}
                            busy={saving}
                            onEdit={() => setEditing(faq)}
                            onDelete={() => remove(faq)}
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
