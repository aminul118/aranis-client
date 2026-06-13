'use server';

import envVars from '@/config/env.config';
import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { logger } from '../../../lib/logger';

// Configure R2 Client using envVars
const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${envVars.r2.accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: envVars.r2.accessKeyId || '',
    secretAccessKey: envVars.r2.secretAccessKey || '',
  },
});

export async function deleteImage(key: string) {
  try {
    if (!key) {
      return { success: false, error: 'Key is missing' };
    }

    // Delete from R2
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: envVars.r2.bucketName || 'aranis-stroage',
        Key: key,
      }),
    );

    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Delete failed';
    logger.error('Error deleting image from R2:', error);
    return { success: false, error: message };
  }
}
