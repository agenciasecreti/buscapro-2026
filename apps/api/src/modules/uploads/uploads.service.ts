import { randomUUID } from 'node:crypto';

import type { UploadResult } from '@buscapro/types';

import { HttpError } from '../../utils/http-error';

import { storage } from './storage';
import { MIME_EXT } from './upload.middleware';

type UploadType = 'avatar' | 'service';

export const uploadsService = {
  async upload(
    ownerId: string,
    type: UploadType,
    file: Express.Multer.File | undefined,
  ): Promise<UploadResult> {
    if (!file) {
      throw new HttpError(400, 'NO_FILE', 'Nenhum arquivo enviado.');
    }

    const ext = MIME_EXT[file.mimetype];
    if (!ext) {
      throw new HttpError(
        400,
        'INVALID_FILE_TYPE',
        'Use uma imagem JPG, PNG ou WEBP.',
      );
    }

    const folder = type === 'avatar' ? 'avatars' : 'services';
    const key = `${folder}/${ownerId}/${randomUUID()}.${ext}`;

    const url = await storage.put(key, file.buffer, file.mimetype);
    return { url };
  },
};
