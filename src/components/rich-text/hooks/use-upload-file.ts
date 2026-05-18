import * as React from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

export type UploadedFile = {
  key: string;
  url: string;
  name: string;
  size: number;
  type: string;
};

interface UseUploadFileProps {
  onUploadComplete?: (file: UploadedFile) => void;
  onUploadError?: (error: unknown) => void;
}

export function useUploadFile({
  onUploadComplete,
  onUploadError,
  ...props
}: UseUploadFileProps = {}) {
  const [uploadedFile, setUploadedFile] = React.useState<UploadedFile>();
  const [uploadingFile, setUploadingFile] = React.useState<File>();
  const [progress, setProgress] = React.useState<number>(0);
  const [isUploading, setIsUploading] = React.useState(false);

  async function uploadToR2(file: File) {
    setIsUploading(true);
    setUploadingFile(file);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const xhr = new XMLHttpRequest();

      const promise = new Promise<UploadedFile>((resolve, reject) => {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const percentage = (event.loaded / event.total) * 100;
            setProgress(Math.round(percentage));
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const response = JSON.parse(xhr.responseText);
            const secureUrl = response.secure_url;
            const parts = secureUrl.split('cdn.thearanis.com/');
            const key = parts.length > 1 ? parts[1] : secureUrl;

            const uploadedFile: UploadedFile = {
              key: key,
              url: secureUrl,
              name: file.name,
              size: file.size,
              type: file.type,
            };
            resolve(uploadedFile);
          } else {
            const errorResponse = JSON.parse(xhr.responseText || '{}');
            reject(
              new Error(
                errorResponse.error || `Upload failed: ${xhr.statusText}`,
              ),
            );
          }
        });

        xhr.addEventListener('error', () => {
          reject(new Error('Upload failed due to network error'));
        });

        xhr.open('POST', '/api/upload');
        xhr.send(formData);
      });

      const res = await promise;

      setUploadedFile(res);
      onUploadComplete?.(res);

      return res;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Upload failed';
      console.error('R2 Upload Error:', error);
      toast.error(errorMessage);
      onUploadError?.(error);
      return undefined;
    } finally {
      setProgress(0);
      setIsUploading(false);
      setUploadingFile(undefined);
    }
  }

  return {
    isUploading,
    progress,
    uploadedFile,
    uploadFile: uploadToR2,
    uploadingFile,
  };
}

export function getErrorMessage(err: unknown) {
  const unknownError = 'Something went wrong, please try again later.';

  if (err instanceof z.ZodError) {
    const errors = err.issues.map((issue) => issue.message);

    return errors.join('\n');
  }
  if (err instanceof Error) {
    return err.message;
  }
  return unknownError;
}

export function showErrorToast(err: unknown) {
  const errorMessage = getErrorMessage(err);

  return toast.error(errorMessage);
}
