import type {
  CreateServicePayload,
  Paginated,
  Service,
  ServiceListQuery,
  UpdateServicePayload,
} from '@buscapro/types';

import { apiFetch } from './http';

export const servicesService = {
  list(query: ServiceListQuery): Promise<Paginated<Service>> {
    return apiFetch<Paginated<Service>>('/api/services', { query });
  },

  listMine(
    token: string,
    query: ServiceListQuery = {},
  ): Promise<Paginated<Service>> {
    return apiFetch<Paginated<Service>>('/api/services/mine', {
      token,
      query,
    });
  },

  getById(id: string): Promise<Service> {
    return apiFetch<Service>(`/api/services/${id}`);
  },

  create(token: string, payload: CreateServicePayload): Promise<Service> {
    return apiFetch<Service>('/api/services', {
      method: 'POST',
      token,
      body: payload,
    });
  },

  update(
    token: string,
    id: string,
    payload: UpdateServicePayload,
  ): Promise<Service> {
    return apiFetch<Service>(`/api/services/${id}`, {
      method: 'PUT',
      token,
      body: payload,
    });
  },

  remove(token: string, id: string): Promise<{ id: string }> {
    return apiFetch<{ id: string }>(`/api/services/${id}`, {
      method: 'DELETE',
      token,
    });
  },
};
