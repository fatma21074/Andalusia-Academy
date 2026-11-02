import { useState, type FormEvent } from "react";
import { useApi } from "../../hooks/useApi";
import { ApiError, resolveApiUrl } from "../../services/api";
import { downloadFile } from "../../services/fileDownload";
import {
  addInstructorMaterialLink,
  deleteInstructorMaterial,
  instructorMaterialsUrl,
  uploadInstructorMaterial,
} from "../../services/instructor";
import type { InstructorMaterial } from "../../types";
import Button from "../Button";
import FormField from "../FormField";
import AsyncView from "./AsyncView";

interface InstructorCourseToolsProps {
  courseId: number;
}

export default function InstructorCourseTools({
  courseId,
}: InstructorCourseToolsProps) {
  const materials = useApi<InstructorMaterial[]>(
    instructorMaterialsUrl(courseId),
  );

  const [linkTitle, setLinkTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [fileTitle, setFileTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [saving, setSaving] = useState(false);
  const [downloadingMaterialId, setDownloadingMaterialId] = useState<
    number | null
  >(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function run(
    action: () => Promise<void>,
    success: string,
    fallback: string,
  ): Promise<boolean> {
    setSaving(true);
    setError("");
    setNotice("");
    try {
      await action();
      setNotice(success);
      return true;
    } catch (e) {
      setError(e instanceof ApiError ? e.message : fallback);
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function handleAddLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const saved = await run(
      async () => {
        await addInstructorMaterialLink(courseId, {
          title: linkTitle.trim(),
          url: linkUrl.trim(),
        });
        materials.reload();
      },
      "Link added.",
      "Could not add the link.",
    );
    if (saved) {
      setLinkTitle("");
      setLinkUrl("");
    }
  }

  async function handleUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");
    if (!file) {
      setError("Choose a file to upload.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("The file is too large. Maximum file size is 10 MB.");
      return;
    }
    const uploaded = await run(
      async () => {
        await uploadInstructorMaterial(courseId, file, fileTitle);
        materials.reload();
      },
      "File uploaded.",
      "Could not upload the file.",
    );
    if (uploaded) {
      setFile(null);
      setFileTitle("");
      setFileInputKey((key) => key + 1);
    }
  }

  async function downloadMaterial(material: InstructorMaterial) {
    setDownloadingMaterialId(material.id);
    setError("");
    setNotice("");

    try {
      await downloadFile(material.url, material.title);
    } catch (e) {
      setError(
        e instanceof ApiError ? e.message : "Could not download this file.",
      );
    } finally {
      setDownloadingMaterialId(null);
    }
  }

  function removeMaterial(material: InstructorMaterial) {
    if (!window.confirm(`Delete "${material.title}"?`)) return;
    void run(
      async () => {
        await deleteInstructorMaterial(material.id);
        materials.reload();
      },
      "Material deleted.",
      "Could not delete the material.",
    );
  }

  return (
    <>
      <section className="dashboard__panel" aria-labelledby="materials-heading">
        <h2 id="materials-heading">Course materials</h2>
        {(error || notice) && (
          <p
            className={
              error
                ? "dashboard__feedback dashboard__feedback--error"
                : "dashboard__feedback"
            }
            role="status"
          >
            {error || notice}
          </p>
        )}
        <div className="dashboard-tools__layout">
          <div>
            <h3>Existing materials</h3>
            <AsyncView
              query={materials}
              loadingLabel="Loading materials…"
              empty={{
                title: "No materials yet",
                message: "Add a link or upload a file for this course.",
              }}
            >
              {(list) => (
                <ul className="dashboard-tools__materials">
                  {list.map((material) => (
                    <li key={material.id}>
                      <div>
                        <strong>{material.title}</strong>
                        <span>{material.type}</span>
                      </div>
                      <div className="dashboard__actions">
                        {material.type === "file" ? (
                          <Button
                            type="button"
                            variant="ghost"
                            disabled={saving || downloadingMaterialId !== null}
                            aria-busy={downloadingMaterialId === material.id}
                            onClick={() => void downloadMaterial(material)}
                          >
                            {downloadingMaterialId === material.id
                              ? "Downloading…"
                              : "Download"}
                          </Button>
                        ) : (
                          <a
                            className="btn btn--ghost"
                            href={resolveApiUrl(material.url)}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Open
                          </a>
                        )}
                        <Button
                          type="button"
                          variant="ghost"
                          disabled={saving}
                          onClick={() => removeMaterial(material)}
                        >
                          Delete
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </AsyncView>
          </div>
          <div className="dashboard-tools__forms">
            <form className="dashboard-form" onSubmit={handleAddLink}>
              <h3>Add a link</h3>
              <FormField
                id={`material-title-${courseId}`}
                label="Title"
                required
                maxLength={200}
                value={linkTitle}
                onChange={setLinkTitle}
              />
              <FormField
                id={`material-url-${courseId}`}
                label="URL"
                type="url"
                required
                value={linkUrl}
                onChange={setLinkUrl}
              />
              <Button type="submit" disabled={saving}>
                {saving ? "Saving…" : "Add link"}
              </Button>
            </form>
            <form className="dashboard-form" onSubmit={handleUpload}>
              <h3>Upload a file</h3>
              <FormField
                id={`material-file-title-${courseId}`}
                label="Title"
                optional
                maxLength={200}
                value={fileTitle}
                onChange={setFileTitle}
              />
              <div className="form-field">
                <label htmlFor={`material-file-${courseId}`}>File</label>
                <input
                  key={fileInputKey}
                  id={`material-file-${courseId}`}
                  type="file"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.zip,.png,.jpg,.jpeg"
                  required
                  onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                />
                <small>
                  Maximum 10 MB. PDF, Office, text, ZIP, PNG, or JPEG.
                </small>
              </div>
              <Button type="submit" disabled={saving}>
                {saving ? "Uploading…" : "Upload file"}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
