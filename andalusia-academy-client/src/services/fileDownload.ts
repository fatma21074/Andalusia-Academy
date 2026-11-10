import { getBlob, resolveApiUrl } from "./api";

export async function downloadFile(path: string, title: string): Promise<void> {
  let objectUrl: string | undefined;

  try {
    const { blob, filename } = await getBlob(path);
    const storedFilename =
      new URL(resolveApiUrl(path)).pathname.split("/").pop() ?? "";
    const extension = storedFilename.match(/\.[^.]+$/)?.[0] ?? "";
    const safeTitle = title.trim().replace(/[\\/:*?"<>|]/g, "_");
    const titleWithoutExtension = safeTitle.replace(/\.[^.]+$/, "");
    const downloadName =
      filename ||
      `${titleWithoutExtension || storedFilename || "course-material"}${extension}`;

    objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = objectUrl;
    anchor.download = downloadName;
    anchor.style.display = "none";
    document.body.appendChild(anchor);
    try {
      anchor.click();
    } finally {
      anchor.remove();
    }

    window.setTimeout(() => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    }, 1000);
  } catch (error) {
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    throw error;
  }
}
