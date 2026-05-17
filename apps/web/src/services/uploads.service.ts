import type { UploadResult, UploadType } from '@buscapro/types';

import { apiFetch } from './http';

export const uploadsService = {
  upload(
    token: string,
    type: UploadType,
    file: File,
  ): Promise<UploadResult> {
    const form = new FormData();
    form.append('type', type);
    form.append('file', file);
    return apiFetch<UploadResult>('/api/uploads', {
      method: 'POST',
      token,
      body: form,
    });
  },
};
