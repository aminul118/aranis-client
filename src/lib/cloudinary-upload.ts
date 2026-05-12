/**
 * Upload a single file via the Next.js /api/upload route,
 * which streams it to Cloudinary server-side (no unsigned preset needed).
 * Returns the secure Cloudinary URL.
 */
export const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

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
export const uploadManyToCloudinary = async (
  files: File[],
): Promise<string[]> => {
  return Promise.all(files.map((f) => uploadToCloudinary(f)));
};
