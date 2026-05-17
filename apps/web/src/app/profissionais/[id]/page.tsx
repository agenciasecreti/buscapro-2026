'use client';

import {
  Avatar,
  Button,
  Card,
  EmptyState,
  Skeleton,
  StarRating,
} from '@buscapro/ui';
import { AlertCircle, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import { AppHeader } from '@/components/app-header';
import { ReviewList } from '@/components/review-list';
import { ServiceCard } from '@/components/service-card';
import { useProvider } from '@/hooks/use-provider';
import { memberSince } from '@/lib/format';

export default function ProviderProfilePage() {
  const params = useParams<{ id: string }>();
  const { data, isLoading, isError } = useProvider(params.id);

  return (
    <div className="flex min-h-dvh flex-col">
      <AppHeader />

      <main className="container flex-1 animate-fade-in py-8">
        {isLoading ? (
          <div className="space-y-8">
            <Skeleton className="h-40 w-full" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-48" />
              ))}
            </div>
          </div>
        ) : isError || !data ? (
          <EmptyState
            icon={AlertCircle}
            title="Profissional não encontrado"
            description="Este perfil pode ter sido removido ou está indisponível."
            action={
              <Button asChild>
                <Link href="/buscar">Voltar à busca</Link>
              </Button>
            }
          />
        ) : (
          <div className="space-y-10">
            {/* Cabeçalho do perfil */}
            <Card elevated className="overflow-hidden">
              <div className="h-24 bg-brand-gradient" />
              <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                  <div className="-mt-16 sm:-mt-20">
                    <Avatar
                      name={data.name}
                      src={data.avatarUrl}
                      size="xl"
                      className="ring-4 ring-card"
                    />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                      {data.name}
                    </h1>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      {data.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="size-4" aria-hidden />
                          {data.location.city}, {data.location.state}
                        </span>
                      )}
                      <span>Na BuscaPRO desde {memberSince(data.createdAt)}</span>
                    </div>
                    <div className="mt-3">
                      {data.rating.count > 0 ? (
                        <StarRating
                          value={data.rating.average}
                          label={`${data.rating.average.toFixed(1)} · ${data.rating.count} avaliação(ões)`}
                        />
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          Ainda sem avaliações
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {data.phone ? (
                  <Button asChild size="lg" className="shrink-0">
                    <a href={`tel:${data.phone}`}>
                      <Phone aria-hidden />
                      Entrar em contato
                    </a>
                  </Button>
                ) : (
                  <Button size="lg" disabled className="shrink-0">
                    Contato indisponível
                  </Button>
                )}
              </div>
            </Card>

            {/* Serviços */}
            <section>
              <h2 className="mb-4 text-xl font-bold tracking-tight text-foreground">
                Serviços oferecidos
              </h2>
              {data.services.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {data.services.map((s) => (
                    <ServiceCard key={s.id} service={s} />
                  ))}
                </div>
              ) : (
                <p className="rounded-lg border border-dashed border-border bg-muted/30 px-4 py-10 text-center text-sm text-muted-foreground">
                  Este profissional ainda não publicou serviços.
                </p>
              )}
            </section>

            {/* Avaliações */}
            <section>
              <h2 className="mb-4 text-xl font-bold tracking-tight text-foreground">
                Avaliações recebidas
              </h2>
              {data.reviews.length > 0 ? (
                <Card className="p-6">
                  <ReviewList reviews={data.reviews} />
                </Card>
              ) : (
                <p className="rounded-lg border border-dashed border-border bg-muted/30 px-4 py-10 text-center text-sm text-muted-foreground">
                  Ainda não há avaliações para este profissional.
                </p>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
