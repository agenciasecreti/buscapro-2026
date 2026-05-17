'use client';

import type { UploadType } from '@buscapro/types';
import { useMutation } from '@tanstack/react-query';

import { accountService } from '@/services/account.service';
import { uploadsService } from '@/services/uploads.service';
import { useAuthStore } from '@/store/auth.store';

function requireToken(): string {
  const token = useAuthStore.getState().token;
  if (!token) throw new Error('Sessão expirada. Entre novamente.');
  return token;
}

/** Faz upload de uma imagem e devolve a URL pública. */
export function useUploadImage(type: UploadType) {
  return useMutation({
    mutationFn: (file: File) =>
      uploadsService.upload(requireToken(), type, file),
  });
}

/** Atualiza o avatar do usuário e sincroniza o store de auth. */
export function useUpdateAvatar() {
  const setUser = useAuthStore((s) => s.setUser);
  return useMutation({
    mutationFn: (avatarUrl: string | null) =>
      accountService.updateAvatar(requireToken(), avatarUrl),
    onSuccess: (user) => setUser(user),
  });
}
