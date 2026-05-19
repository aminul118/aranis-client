/**
 * Upload a single file via the Next.js /api/upload route,
 * which streams it to Cloudflare R2 server-side.
 * Returns the secure public URL of the uploaded asset.
 */
export const uploadToR2 = async (
  file: File,
  folder?: string,
): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  if (folder) {
    formData.append('folder', folder);
  }

  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || `Upload failed (HTTP ${res.status})`);
  }

  const data = await res.json();
  return data.secure_url as string;
};

/**
 * Upload multiple files in parallel via /api/upload.
 * Returns URLs in the same order as input files.
 */
export const uploadManyToR2 = async (
  files: File[],
  folder?: string,
): Promise<string[]> => {
  return Promise.all(files.map((f) => uploadToR2(f, folder)));
};
