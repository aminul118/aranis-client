'use server';

import envVars from '@/config/env.config';
import crypto from 'crypto';

export async function deleteImage(publicId: string) {
  const cloudName = envVars.cloudinary.cloudName;
  const apiKey = envVars.cloudinary.apiKey;
  const apiSecret = envVars.cloudinary.apiSecret;

  if (!cloudName || !apiKey || !apiSecret) {
    console.error('Cloudinary credentials missing');
    return { success: false, error: 'Credentials missing' };
  }

  const timestamp = Math.round(new Date().getTime() / 1000);
  const signatureString = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
  const signature = crypto
    .createHash('sha1')
    .update(signatureString)
    .digest('hex');

  const formData = new FormData();
  formData.append('public_id', publicId);
  formData.append('api_key', apiKey);
  formData.append('timestamp', timestamp.toString());
  formData.append('signature', signature);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
      {
        method: 'POST',
        body: formData,
      },
    );
    const result = await response.json();

    if (result.error) {
      return { success: false, error: result.error.message };
    }

    return { success: true, result };
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    return { success: false, error };
  }
}
