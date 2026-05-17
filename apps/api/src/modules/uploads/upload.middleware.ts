import type { RequestHandler } from 'express';
import multer, { memoryStorage, MulterError } from 'multer';

import { HttpError } from '../../utils/http-error';

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export const ALLOWED_MIME = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;

export const MIME_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

const upload = multer({
  storage: memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE, files: 1 },
  fileFilter: (_req, file, cb) => {
    if ((ALLOWED_MIME as readonly string[]).includes(file.mimetype)) {
      cb(null, true);
      return;
    }
    cb(new HttpError(400, 'INVALID_FILE_TYPE', 'Use uma imagem JPG, PNG ou WEBP.'));
  },
});

/**
 * Recebe um único arquivo no campo `file`, traduzindo os erros do multer
 * (tamanho/tipo) para o formato de erro padrão da API.
 */
export const singleImage: RequestHandler = (req, res, next) => {
  upload.single('file')(req, res, (err: unknown) => {
    if (!err) {
      next();
      return;
    }
    if (err instanceof MulterError) {
      const message =
        err.code === 'LIMIT_FILE_SIZE'
          ? 'Imagem muito grande (máx. 5 MB).'
          : 'Falha no upload do arquivo.';
      next(new HttpError(400, 'UPLOAD_ERROR', message));
      return;
    }
    next(err);
  });
};
