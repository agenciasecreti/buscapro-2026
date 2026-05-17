'use client';

import { Badge, Card, ImageUpload, Skeleton } from '@buscapro/ui';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

import { AppHeader } from '@/components/app-header';
import { ThemeToggle } from '@/components/theme-toggle';
import { useUpdateAvatar, useUploadImage } from '@/hooks/use-upload';
import { memberSince } from '@/lib/format';
import { ApiError } from '@/services/http';
import { useAuthStore } from '@/store/auth.store';

export default function AccountPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);

  const uploadAvatar = useUploadImage('avatar');
  const updateAvatar = useUpdateAvatar();

  useEffect(() => {
    if (hydrated && !user) router.replace('/login');
  }, [hydrated, user, router]);

  async function handleChange(url: string | null) {
    try {
      await updateAvatar.mutateAsync(url);
      toast.success(url ? 'Foto atualizada.' : 'Foto removida.');
    } catch (err) {
      toast.error(
        err instanceof ApiError
          ? err.message
          : 'Não foi possível salvar a foto.',
      );
    }
  }

  if (!hydrated || !user) {
    return (
      <div className="flex min-h-dvh flex-col">
        <AppHeader />
        <div className="container flex-1 py-10">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="mt-6 h-64 w-full max-w-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <AppHeader />

      <main className="container flex-1 animate-fade-in py-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Minha conta
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Gerencie suas informações e a foto do seu perfil.
        </p>

        <div className="mt-8 grid max-w-2xl gap-6">
          <Card className="p-6">
            <h2 className="text-base font-semibold text-foreground">
              Foto de perfil
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Uma boa foto aumenta a confiança dos clientes.
            </p>
            <div className="mt-5 max-w-[12rem]">
              <ImageUpload
                label="Avatar"
                shape="circle"
                value={user.avatarUrl}
                onUpload={(file) =>
                  uploadAvatar.mutateAsync(file).then((r) => r.url)
                }
                onChange={handleChange}
              />
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-base font-semibold text-foreground">
              Informações
            </h2>
            <dl className="mt-4 divide-y divide-border text-sm">
              <div className="flex items-center justify-between py-3 first:pt-0">
                <dt className="text-muted-foreground">Nome</dt>
                <dd className="font-medium text-foreground">{user.name}</dd>
              </div>
              <div className="flex items-center justify-between py-3">
                <dt className="text-muted-foreground">E-mail</dt>
                <dd className="font-medium text-foreground">{user.email}</dd>
              </div>
              <div className="flex items-center justify-between py-3">
                <dt className="text-muted-foreground">Telefone</dt>
                <dd className="font-medium text-foreground">
                  {user.phone ?? '—'}
                </dd>
              </div>
              <div className="flex items-center justify-between py-3">
                <dt className="text-muted-foreground">Tipo de conta</dt>
                <dd>
                  <Badge variant={user.role === 'PROVIDER' ? 'brand' : 'neutral'}>
                    {user.role === 'PROVIDER' ? 'Prestador' : 'Cliente'}
                  </Badge>
                </dd>
              </div>
              <div className="flex items-center justify-between py-3 last:pb-0">
                <dt className="text-muted-foreground">Membro desde</dt>
                <dd className="font-medium text-foreground">
                  {memberSince(user.createdAt)}
                </dd>
              </div>
            </dl>
          </Card>

          <Card className="p-6">
            <h2 className="text-base font-semibold text-foreground">
              Aparência
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Escolha entre tema claro e escuro. A preferência fica salva
              neste dispositivo.
            </p>
            <div className="mt-5">
              <ThemeToggle withLabel />
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
