'use client';

import {
  Avatar,
  Badge,
  Button,
  Card,
  EmptyState,
  Skeleton,
  StarRating,
} from '@buscapro/ui';
import { AlertCircle, ArrowLeft, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import { AppHeader } from '@/components/app-header';
import { ReviewForm } from '@/components/review-form';
import { ReviewList } from '@/components/review-list';
import { useServiceReviews } from '@/hooks/use-reviews';
import { useService } from '@/hooks/use-services';
import { formatPrice } from '@/lib/format';
import { useAuthStore } from '@/store/auth.store';

export default function ServiceDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const service = useService(id);
  const reviews = useServiceReviews(id);

  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);

  const canReview =
    hydrated &&
    user?.role === 'CLIENT' &&
    service.data &&
    service.data.provider.id !== user.id;

  return (
    <div className="flex min-h-dvh flex-col">
      <AppHeader />

      <main className="container flex-1 animate-fade-in py-8">
        <Button asChild variant="ghost" size="sm" className="mb-6">
          <Link href="/buscar">
            <ArrowLeft aria-hidden />
            Voltar à busca
          </Link>
        </Button>

        {service.isLoading ? (
          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            <div className="space-y-4">
              <Skeleton className="h-7 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-40 w-full" />
            </div>
            <Skeleton className="h-56 w-full" />
          </div>
        ) : service.isError || !service.data ? (
          <EmptyState
            icon={AlertCircle}
            title="Serviço não encontrado"
            description="Este serviço pode ter sido removido ou está indisponível."
            action={
              <Button asChild>
                <Link href="/buscar">Ver outros serviços</Link>
              </Button>
            }
          />
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            <div className="space-y-8">
              {service.data.imageUrl && (
                <div className="aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border bg-muted">
                  {/* Conteúdo do usuário em host dinâmico (S3/local) — <img> é intencional. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={service.data.imageUrl}
                    alt={service.data.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <div>
                <Badge variant="brand">{service.data.category.name}</Badge>
                <h1 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground">
                  {service.data.title}
                </h1>
                <div className="mt-3">
                  {service.data.rating.count > 0 ? (
                    <StarRating
                      value={service.data.rating.average}
                      label={`${service.data.rating.average.toFixed(1)} · ${service.data.rating.count} avaliação(ões)`}
                    />
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      Ainda sem avaliações
                    </span>
                  )}
                </div>
                <p className="mt-6 whitespace-pre-line text-pretty leading-relaxed text-muted-foreground">
                  {service.data.description}
                </p>
              </div>

              <section>
                <h2 className="text-xl font-bold tracking-tight text-foreground">
                  Avaliações
                </h2>
                <div className="mt-4">
                  {reviews.isLoading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-20 w-full" />
                      <Skeleton className="h-20 w-full" />
                    </div>
                  ) : reviews.data && reviews.data.length > 0 ? (
                    <ReviewList reviews={reviews.data} />
                  ) : (
                    <p className="rounded-lg border border-dashed border-border bg-muted/30 px-4 py-8 text-center text-sm text-muted-foreground">
                      Seja o primeiro a avaliar este serviço.
                    </p>
                  )}
                </div>

                <div className="mt-6">
                  {canReview ? (
                    <ReviewForm serviceId={id} />
                  ) : hydrated && !user ? (
                    <Card className="flex flex-col items-start gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm text-muted-foreground">
                        Entre como cliente para avaliar este serviço.
                      </p>
                      <Button asChild size="sm">
                        <Link href="/login">Entrar</Link>
                      </Button>
                    </Card>
                  ) : null}
                </div>
              </section>
            </div>

            {/* Sidebar — preço + prestador */}
            <aside className="lg:sticky lg:top-24 lg:h-fit">
              <Card className="p-6">
                <p className="text-sm text-muted-foreground">A partir de</p>
                <p className="mt-1 text-3xl font-bold text-foreground">
                  {formatPrice(service.data.price)}
                </p>

                <div className="my-5 h-px bg-border" />

                <Link
                  href={`/profissionais/${service.data.provider.id}`}
                  className="flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Avatar
                    name={service.data.provider.name}
                    src={service.data.provider.avatarUrl}
                    size="md"
                  />
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-foreground">
                      {service.data.provider.name}
                    </p>
                    {(service.data.provider.city ||
                      service.data.provider.state) && (
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="size-3" aria-hidden />
                        {[
                          service.data.provider.city,
                          service.data.provider.state,
                        ]
                          .filter(Boolean)
                          .join(', ')}
                      </p>
                    )}
                  </div>
                </Link>

                <Button asChild className="mt-6 w-full">
                  <Link href={`/profissionais/${service.data.provider.id}`}>
                    Ver perfil e contato
                  </Link>
                </Button>
              </Card>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}
