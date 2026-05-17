import type { PublicUser } from '@buscapro/types';

import { apiFetch } from './http';

export const accountService = {
  updateAvatar(
    token: string,
    avatarUrl: string | null,
  ): Promise<PublicUser> {
    return apiFetch<PublicUser>('/api/me/avatar', {
      method: 'PATCH',
      token,
      body: { avatarUrl },
    });
  },
};
