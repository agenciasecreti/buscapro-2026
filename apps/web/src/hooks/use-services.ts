'use client';

import type {
  CreateServicePayload,
  ServiceListQuery,
  UpdateServicePayload,
} from '@buscapro/types';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { queryKeys } from '@/lib/query-keys';
import { servicesService } from '@/services/services.service';
import { useAuthStore } from '@/store/auth.store';

export function useServices(query: ServiceListQuery) {
  return useQuery({
    queryKey: queryKeys.services.list(query),
    queryFn: () => servicesService.list(query),
    placeholderData: keepPreviousData,
  });
}

export function useService(id: string) {
  return useQuery({
    queryKey: queryKeys.services.detail(id),
    queryFn: () => servicesService.getById(id),
    enabled: Boolean(id),
  });
}

export function useMyServices(query: ServiceListQuery = {}) {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: queryKeys.services.mine(query),
    queryFn: () => servicesService.listMine(token as string, query),
    enabled: Boolean(token),
  });
}

function requireToken(): string {
  const token = useAuthStore.getState().token;
  if (!token) throw new Error('Sessão expirada. Entre novamente.');
  return token;
}

export function useCreateService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateServicePayload) =>
      servicesService.create(requireToken(), payload),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.services.all });
    },
  });
}

export function useUpdateService(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateServicePayload) =>
      servicesService.update(requireToken(), id, payload),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.services.all });
    },
  });
}

export function useDeleteService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => servicesService.remove(requireToken(), id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.services.all });
    },
  });
}
