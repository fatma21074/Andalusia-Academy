import { useState } from "react";
import { ApiError, resolveApiUrl } from "../../services/api";
import { downloadFile } from "../../services/fileDownload";
import type { MaterialInfo } from "../../types";
import Badge from "../Badge";
import Button from "../Button";
import "./learning.css";

function storedFilename(url: string): string {
  const filename = new URL(resolveApiUrl(url)).pathname.split("/").pop() ?? "";
  try {
    return decodeURIComponent(filename);
  } catch {
    return filename;
  }
}

function fileType(filename: string): string {
  const extension = filename.match(/\.([^.]+)$/)?.[1];
  return extension ? extension.toUpperCase() : "File";
}

function uploadDate(value: string): string | null {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
    date,
  );
}

export default function MaterialList({
  materials,
}: {
  materials: MaterialInfo[];
}) {
  const [downloadingMaterialId, setDownloadingMaterialId] = useState<
    number | null
  >(null);
  const [error, setError] = useState("");

  if (materials.length === 0)
    return (
      <p className="learning-muted">
        Your instructor hasn't added materials yet.
      </p>
    );

  async function handleDownload(material: MaterialInfo) {
    setDownloadingMaterialId(material.id);
    setError("");
    try {
      await downloadFile(material.url, material.title);
    } catch (downloadError) {
      setError(
        downloadError instanceof ApiError
          ? downloadError.message
          : "Could not download this file. Please try again.",
      );
    } finally {
      setDownloadingMaterialId(null);
    }
  }

  return (
    <>
      {error && (
        <p className="material-list__error" role="alert">
          {error}
        </p>
      )}
      <ul className="material-list">
        {materials.map((material) => {
          const filename =
            material.type === "file" ? storedFilename(material.url) : "";
          const date = uploadDate(material.createdAt);

          return (
            <li key={material.id} className="material-list__item">
              <div className="material-list__info">
                <div className="material-list__heading">
                  <Badge
                    label={
                      material.type === "file" ? fileType(filename) : "Link"
                    }
                    tone="accent"
                  />
                  <span className="material-list__title">{material.title}</span>
                </div>
                {material.type === "file" && (
                  <span className="material-list__meta">
                    Filename: {filename || "Unavailable"}
                  </span>
                )}
                {date && (
                  <span className="material-list__meta">Uploaded {date}</span>
                )}
              </div>
              {material.type === "file" ? (
                <Button
                  type="button"
                  variant="ghost"
                  disabled={downloadingMaterialId !== null}
                  aria-busy={downloadingMaterialId === material.id}
                  onClick={() => void handleDownload(material)}
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <path d="m7 10 5 5 5-5M12 15V3" />
                  </svg>
                  {downloadingMaterialId === material.id
                    ? "Downloading…"
                    : "Download"}
                </Button>
              ) : (
                <a
                  href={resolveApiUrl(material.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--ghost"
                >
                  Open
                  <span className="sr-only">
                    {" "}
                    {material.title} in a new tab
                  </span>
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
}
