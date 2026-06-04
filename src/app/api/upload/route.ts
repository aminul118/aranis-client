import envVars from '@/config/env.config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

// Configure R2 Client using envVars
const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${envVars.r2.accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: envVars.r2.accessKeyId || '',
    secretAccessKey: envVars.r2.secretAccessKey || '',
  },
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 1. Get base name and convert to lowercase
    let baseName = file.name.toLowerCase();

    // 2. Remove the primary file extension (e.g. .jpg, .png, .webp)
    baseName = baseName.replace(/\.[^/.]+$/, '');

    // 3. Remove common sub-extensions like "-jpg", "-png" if present in the filename
    baseName = baseName.replace(/-(jpg|jpeg|png|gif|webp|svg)$/i, '');

    // 4. Format spaces to dashes and keep only alphanumeric characters and dashes
    baseName = baseName
      .replace(/\s+/g, '-')
      // eslint-disable-next-line no-useless-escape
      .replace(/[^a-z0-9\-]/g, '');

    // 5. Truncate name to 20 characters to keep it extremely "cute" and clean
    if (baseName.length > 20) {
      baseName = baseName.substring(0, 20).replace(/-$/, ''); // Truncate and trim trailing dash
    }

    // Fallback to 'image' if empty
    if (!baseName) {
      baseName = 'image';
    }

    // 6. Generate a cute, short 6-character unique ID
    const shortId = Math.random().toString(36).substring(2, 8);

    // Retrieve destination folder from formData, default to 'editor'
    const folder = (formData.get('folder') as string | null) || 'editor';

    // Save under the specified virtual folder
    const uniqueFileName = `${folder}/${shortId}-${baseName}.webp`;

    let bufferToUpload: any = buffer;
    let contentType = file.type;
    let finalFileName = uniqueFileName;

    if (file.type.startsWith('image/')) {
      // Convert and compress to webp with high quality, preserving original dimensions
      bufferToUpload = await sharp(buffer as any)
        .webp({ quality: 80 })
        .toBuffer();
      contentType = 'image/webp';
    } else {
      // For non-images, keep original name format but cute and clean
      const ext = file.name.split('.').pop() || 'bin';
      finalFileName = `${folder}/${shortId}-${baseName}.${ext}`;
    }

    // Upload to R2
    await s3Client.send(
      new PutObjectCommand({
        Bucket: envVars.r2.bucketName || 'aranis-stroage',
        Key: finalFileName,
        Body: bufferToUpload,
        ContentType: contentType,
      }),
    );

    const secureUrl = `${envVars.r2.publicDevUrl || 'https://cdn.thearanis.com'}/${finalFileName}`;

    return NextResponse.json({ secure_url: secureUrl });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Upload failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
