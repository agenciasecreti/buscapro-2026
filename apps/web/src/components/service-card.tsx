import type { Service } from '@buscapro/types';
import { Avatar, Badge, Card, StarRating } from '@buscapro/ui';
import { MapPin } from 'lucide-react';
import Link from 'next/link';

import { formatPrice } from '@/lib/format';

export function ServiceCard({ service }: { service: Service }) {
  const { provider, rating } = service;
  const location = [provider.city, provider.state]
    .filter(Boolean)
    .join(', ');

  return (
    <Card className="group flex flex-col overflow-hidden transition-shadow duration-200 hover:shadow-md">
      {service.imageUrl ? (
        <Link
          href={`/servicos/${service.id}`}
          className="relative block aspect-[16/9] overflow-hidden bg-muted"
          tabIndex={-1}
          aria-hidden
        >
          {/* Conteúdo do usuário em host dinâmico (S3/local) — <img> é intencional. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={service.imageUrl}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </Link>
      ) : (
        <Link
          href={`/servicos/${service.id}`}
          className="flex aspect-[16/9] items-center justify-center bg-brand-soft"
          tabIndex={-1}
          aria-hidden
        >
          <span className="text-sm font-semibold text-primary/40">
            BuscaPRO
          </span>
        </Link>
      )}

      <div className="flex flex-1 flex-col p-5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <Badge variant="brand">{service.category.name}</Badge>
        {rating.count > 0 ? (
          <StarRating
            value={rating.average}
            size="sm"
            label={`${rating.average.toFixed(1)} (${rating.count})`}
          />
        ) : (
          <span className="text-xs text-muted-foreground">Sem avaliações</span>
        )}
      </div>

      <Link
        href={`/servicos/${service.id}`}
        className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <h3 className="text-balance text-base font-semibold text-foreground group-hover:text-primary">
          {service.title}
        </h3>
      </Link>
      <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
        {service.description}
      </p>

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-4">
        <Link
          href={`/profissionais/${provider.id}`}
          className="flex min-w-0 items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Avatar name={provider.name} src={provider.avatarUrl} size="sm" />
          <span className="min-w-0">
            <span className="block truncate text-sm font-medium text-foreground">
              {provider.name}
            </span>
            {location && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="size-3" aria-hidden />
                {location}
              </span>
            )}
          </span>
        </Link>
        <span className="shrink-0 text-right">
          <span className="block text-base font-bold text-foreground">
            {formatPrice(service.price)}
          </span>
        </span>
      </div>
      </div>
    </Card>
  );
}

export function ServiceCardSkeleton() {
  return (
    <Card className="flex flex-col overflow-hidden">
      <div className="aspect-[16/9] w-full animate-pulse bg-muted" />
      <div className="flex flex-col gap-3 p-5">
        <div className="flex justify-between">
          <div className="h-5 w-20 animate-pulse rounded-full bg-muted" />
          <div className="h-4 w-16 animate-pulse rounded bg-muted" />
        </div>
        <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-4 w-full animate-pulse rounded bg-muted" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
        <div className="mt-2 flex items-center justify-between border-t border-border pt-4">
          <div className="flex items-center gap-2">
            <div className="size-8 animate-pulse rounded-full bg-muted" />
            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          </div>
          <div className="h-5 w-16 animate-pulse rounded bg-muted" />
        </div>
      </div>
    </Card>
  );
}
