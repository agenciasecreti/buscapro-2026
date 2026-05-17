'use client';

import type { Service } from '@buscapro/types';
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Modal,
  Skeleton,
} from '@buscapro/ui';
import { Briefcase, Pencil, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { AppHeader } from '@/components/app-header';
import { ServiceFormModal } from '@/components/service-form-modal';
import { useDeleteService, useMyServices } from '@/hooks/use-services';
import { formatPrice } from '@/lib/format';
import { ApiError } from '@/services/http';
import { useAuthStore } from '@/store/auth.store';

export default function DashboardPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [deleting, setDeleting] = useState<Service | null>(null);

  const myServices = useMyServices();
  const deleteMutation = useDeleteService();

  // Protege a rota: somente prestadores autenticados.
  useEffect(() => {
    if (!hydrated) return;
    if (!user) router.replace('/login');
    else if (user.role !== 'PROVIDER') router.replace('/');
  }, [hydrated, user, router]);

  if (!hydrated || !user || user.role !== 'PROVIDER') {
    return (
      <div className="flex min-h-dvh flex-col">
        <AppHeader />
        <div className="container flex-1 py-10">
          <Skeleton className="h-8 w-48" />
          <div className="mt-6 space-y-3">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </div>
    );
  }

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(service: Service) {
    setEditing(service);
    setFormOpen(true);
  }

  async function confirmDelete() {
    if (!deleting) return;
    try {
      await deleteMutation.mutateAsync(deleting.id);
      toast.success('Serviço excluído.');
      setDeleting(null);
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : 'Não foi possível excluir.',
      );
    }
  }

  const services = myServices.data?.items ?? [];

  return (
    <div className="flex min-h-dvh flex-col">
      <AppHeader />

      <main className="container flex-1 animate-fade-in py-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Meu painel
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Gerencie os serviços que você oferece na BuscaPRO.
            </p>
          </div>
          <Button onClick={openCreate}>
            <Plus aria-hidden />
            Novo serviço
          </Button>
        </div>

        <div className="mt-8">
          {myServices.isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : services.length === 0 ? (
            <EmptyState
              icon={Briefcase}
              title="Você ainda não tem serviços"
              description="Publique seu primeiro serviço e comece a receber clientes."
              action={
                <Button onClick={openCreate}>
                  <Plus aria-hidden />
                  Criar serviço
                </Button>
              }
            />
          ) : (
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.id}>
                  <Card className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          href={`/servicos/${service.id}`}
                          className="font-semibold text-foreground hover:text-primary"
                        >
                          {service.title}
                        </Link>
                        <Badge
                          variant={service.active ? 'success' : 'neutral'}
                        >
                          {service.active ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {service.category.name} ·{' '}
                        {formatPrice(service.price)} ·{' '}
                        {service.rating.count} avaliação(ões)
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEdit(service)}
                      >
                        <Pencil aria-hidden />
                        Editar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleting(service)}
                        className="text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 aria-hidden />
                        Excluir
                      </Button>
                    </div>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>

      <ServiceFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        service={editing}
      />

      <Modal
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        title="Excluir serviço"
        description={`Tem certeza que deseja excluir "${deleting?.title ?? ''}"? Esta ação não pode ser desfeita.`}
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => setDeleting(null)}
              disabled={deleteMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              loading={deleteMutation.isPending}
            >
              Excluir
            </Button>
          </>
        }
      >
        <p className="text-sm text-muted-foreground">
          O serviço deixará de aparecer na busca e no seu perfil imediatamente.
        </p>
      </Modal>
    </div>
  );
}
