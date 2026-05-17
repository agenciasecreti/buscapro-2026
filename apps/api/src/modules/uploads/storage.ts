import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

import { env } from '../../config/env';

export interface Storage {
  /** Persiste o arquivo e devolve a URL pública definitiva. */
  put(key: string, body: Buffer, contentType: string): Promise<string>;
}

/** Armazenamento em disco — para dev/demo sem S3. Servido em /uploads. */
class LocalStorage implements Storage {
  private readonly root = join(process.cwd(), env.UPLOAD_DIR);

  async put(key: string, body: Buffer): Promise<string> {
    const filePath = join(this.root, key);
    await mkdir(dirname(filePath), { recursive: true });
    await writeFile(filePath, body);
    return `${env.APP_PUBLIC_URL}/${env.UPLOAD_DIR}/${key}`;
  }
}

/** Armazenamento S3-compatível (AWS S3, R2, MinIO, …). */
class S3Storage implements Storage {
  // Import dinâmico evita carregar o SDK quando STORAGE_DRIVER=local.
  private clientPromise = import('@aws-sdk/client-s3').then(
    ({ S3Client }) =>
      new S3Client({
        region: env.S3_REGION,
        endpoint: env.S3_ENDPOINT,
        forcePathStyle: env.S3_FORCE_PATH_STYLE,
        credentials: {
          accessKeyId: env.S3_ACCESS_KEY_ID as string,
          secretAccessKey: env.S3_SECRET_ACCESS_KEY as string,
        },
      }),
  );

  async put(key: string, body: Buffer, contentType: string): Promise<string> {
    const [{ PutObjectCommand }, client] = await Promise.all([
      import('@aws-sdk/client-s3'),
      this.clientPromise,
    ]);

    await client.send(
      new PutObjectCommand({
        Bucket: env.S3_BUCKET as string,
        Key: key,
        Body: body,
        ContentType: contentType,
        CacheControl: 'public, max-age=31536000, immutable',
      }),
    );

    return `${env.S3_PUBLIC_URL}/${key}`;
  }
}

export const storage: Storage =
  env.STORAGE_DRIVER === 's3' ? new S3Storage() : new LocalStorage();
