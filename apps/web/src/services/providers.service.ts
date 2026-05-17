import type { ProviderProfile } from '@buscapro/types';

import { apiFetch } from './http';

export const providersService = {
  getProfile(id: string): Promise<ProviderProfile> {
    return apiFetch<ProviderProfile>(`/api/providers/${id}`);
  },
};
