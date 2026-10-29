import { useState, type FormEvent } from "react";
import { useActionRunner } from "../../hooks/useActionRunner";
import { useApi } from "../../hooks/useApi";
import { adminPartners, type PartnerInput } from "../../services/cms";
import type { Partner } from "../../types";
import { onlyProblems, requiredProblem } from "../../utils/validation";
import Button from "../Button";
import AsyncView from "../dashboard/AsyncView";
import StatusMessages from "../dashboard/StatusMessages";
import FormField from "../FormField";
import FormSelect from "../FormSelect";
import { PUBLISH_OPTIONS } from "./publishOptions";
import RowActions from "./RowActions";

interface PartnerFormProps {
  partner?: Partner;
  submitting: boolean;
  onSubmit: (input: PartnerInput) => Promise<boolean>;
  onCancel?: () => void;
}

function PartnerForm({
  partner,
  submitting,
  onSubmit,
  onCancel,
}: PartnerFormProps) {
  const [name, setName] = useState(partner?.name ?? "");
  const [logoUrl, setLogoUrl] = useState(partner?.logoUrl ?? "");
  const [websiteUrl, setWebsiteUrl] = useState(partner?.websiteUrl ?? "");
  const [published, setPublished] = useState(
    String(partner?.isPublished ?? true),
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const problems = onlyProblems({
      name: requiredProblem(name, "Name"),
      logoUrl: requiredProblem(logoUrl, "Logo URL"),
    });
    setErrors(problems);
    if (Object.keys(problems).length > 0) return;

    const saved = await onSubmit({
      name: name.trim(),
      logoUrl: logoUrl.trim(),
      websiteUrl: websiteUrl.trim(),
      isPublished: published === "true",
    });
    if (saved && !partner) {
      setName("");
      setLogoUrl("");
      setWebsiteUrl("");
    }
  }

  return (
    <form
      className="dashboard-form dashboard-form--grid"
      onSubmit={handleSubmit}
      noValidate
    >
      <FormField
        id="partner-name"
        label="Name"
        value={name}
        onChange={setName}
        error={errors.name}
      />
      <FormField
        id="partner-logo"
        label="Logo URL"
        placeholder="/img/partner.png or https://…"
        value={logoUrl}
        onChange={setLogoUrl}
        error={errors.logoUrl}
      />
      <FormField
        id="partner-site"
        label="Website"
        optional
        type="url"
        value={websiteUrl}
        onChange={setWebsiteUrl}
      />
      <FormSelect
        id="partner-published"
        label="Visibility"
        value={published}
        options={PUBLISH_OPTIONS}
        onChange={setPublished}
      />
      <div className="dashboard-form__wide dashboard-form__actions">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving…" : partner ? "Save changes" : "Add partner"}
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

export default function PartnersPanel() {
  const partners = useApi<Partner[]>(adminPartners.url());
  const [editing, setEditing] = useState<Partner | undefined>();
  const { saving, error, notice, run } = useActionRunner();

  function save(input: PartnerInput) {
    const target = editing;
    return run(
      async () => {
        if (target) await adminPartners.update(target.id, input);
        else await adminPartners.create(input);
        setEditing(undefined);
        partners.reload();
      },
      target ? "Partner updated." : "Partner added.",
      "Could not save the partner.",
    );
  }

  function remove(partner: Partner) {
    void run(
      async () => {
        await adminPartners.remove(partner.id);
        partners.reload();
      },
      "Partner deleted.",
      "Could not delete the partner.",
    );
  }

  return (
    <div className="dashboard">
      <StatusMessages error={error} notice={notice} />
      <section
        className="dashboard__panel"
        aria-labelledby="partner-form-heading"
      >
        <h2 id="partner-form-heading">
          {editing ? `Edit ${editing.name}` : "Add a partner"}
        </h2>
        <PartnerForm
          key={editing?.id ?? "new"}
          partner={editing}
          submitting={saving}
          onSubmit={save}
          onCancel={editing ? () => setEditing(undefined) : undefined}
        />
      </section>
      <section
        className="dashboard__panel"
        aria-labelledby="partner-list-heading"
      >
        <h2 id="partner-list-heading">Partners</h2>
        <AsyncView
          query={partners}
          loadingLabel="Loading partners…"
          empty={{ title: "No partners yet" }}
        >
          {(list) => (
            <div className="table-wrap">
              <table className="data-table">
                <caption className="sr-only">Partners and sponsors</caption>
                <thead>
                  <tr>
                    <th scope="col">Logo</th>
                    <th scope="col">Name</th>
                    <th scope="col">Visibility</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((partner) => (
                    <tr key={partner.id}>
                      <td data-label="Logo">
                        <img
                          src={partner.logoUrl}
                          alt=""
                          className="cell-logo"
                        />
                      </td>
                      <td data-label="Name">{partner.name}</td>
                      <td data-label="Visibility">
                        {partner.isPublished ? "Published" : "Hidden"}
                      </td>
                      <td data-label="Actions">
                        <RowActions
                          label={partner.name}
                          busy={saving}
                          onEdit={() => setEditing(partner)}
                          onDelete={() => remove(partner)}
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
