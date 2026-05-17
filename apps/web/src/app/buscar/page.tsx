'use client';

import type { ServiceSort } from '@buscapro/types';
import {
  Button,
  EmptyState,
  Input,
  Label,
  Select,
} from '@buscapro/ui';
import { SearchX, SlidersHorizontal } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

import { AppHeader } from '@/components/app-header';
import { Pagination } from '@/components/pagination';
import { ServiceCard, ServiceCardSkeleton } from '@/components/service-card';
import { useCategories } from '@/hooks/use-categories';
import { useDebounce } from '@/hooks/use-debounce';
import { useServices } from '@/hooks/use-services';

const PAGE_SIZE = 12;

function BuscarContent() {
  const params = useSearchParams();
  const categories = useCategories();

  const [q, setQ] = useState(params.get('q') ?? '');
  const [categoryId, setCategoryId] = useState(params.get('categoryId') ?? '');
  const [city, setCity] = useState('');
  const [uf, setUf] = useState('');
  const [sort, setSort] = useState<ServiceSort>('recent');
  const [page, setPage] = useState(1);

  const debouncedQ = useDebounce(q);
  const debouncedCity = useDebounce(city);

  // Qualquer mudança de filtro volta para a primeira página.
  useEffect(() => {
    setPage(1);
  }, [debouncedQ, categoryId, debouncedCity, uf, sort]);

  const { data, isLoading, isError, isFetching } = useServices({
    q: debouncedQ || undefined,
    categoryId: categoryId || undefined,
    city: debouncedCity || undefined,
    state: uf || undefined,
    sort,
    page,
    pageSize: PAGE_SIZE,
  });

  const hasFilters = Boolean(q || categoryId || city || uf);

  function clearFilters() {
    setQ('');
    setCategoryId('');
    setCity('');
    setUf('');
    setSort('recent');
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <AppHeader />

      <div className="border-b border-border bg-muted/30">
        <div className="container py-8">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Buscar serviços
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Filtre por categoria, cidade e ordene como preferir.
          </p>
        </div>
      </div>

      <main className="container flex-1 animate-fade-in py-8">
        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          {/* Filtros */}
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <div className="flex items-center gap-2 pb-4 text-sm font-semibold text-foreground">
              <SlidersHorizontal className="size-4" aria-hidden />
              Filtros
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="q">Buscar</Label>
                <Input
                  id="q"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Ex.: pintura"
                  type="search"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="cat">Categoria</Label>
                <Select
                  id="cat"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  <option value="">Todas</option>
                  {categories.data?.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2 flex flex-col gap-1.5">
                  <Label htmlFor="city">Cidade</Label>
                  <Input
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="São Paulo"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="uf">UF</Label>
                  <Input
                    id="uf"
                    value={uf}
                    onChange={(e) => setUf(e.target.value.toUpperCase())}
                    maxLength={2}
                    placeholder="SP"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="sort">Ordenar por</Label>
                <Select
                  id="sort"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as ServiceSort)}
                >
                  <option value="recent">Mais recentes</option>
                  <option value="rating">Mais bem avaliados</option>
                  <option value="price_asc">Menor preço</option>
                  <option value="price_desc">Maior preço</option>
                </Select>
              </div>

              {hasFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Limpar filtros
                </Button>
              )}
            </div>
          </aside>

          {/* Resultados */}
          <section>
            <div className="mb-4 flex h-6 items-center text-sm text-muted-foreground">
              {data && !isLoading && (
                <span aria-live="polite">
                  {data.total} resultado{data.total === 1 ? '' : 's'}
                  {isFetching && ' · atualizando…'}
                </span>
              )}
            </div>

            {isError ? (
              <EmptyState
                icon={SearchX}
                title="Não foi possível carregar"
                description="Ocorreu um erro ao buscar os serviços. Tente novamente."
              />
            ) : isLoading ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ServiceCardSkeleton key={i} />
                ))}
              </div>
            ) : data && data.items.length > 0 ? (
              <div className="space-y-8">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {data.items.map((s) => (
                    <ServiceCard key={s.id} service={s} />
                  ))}
                </div>
                <Pagination
                  page={data.page}
                  pageSize={data.pageSize}
                  total={data.total}
                  onPageChange={setPage}
                />
              </div>
            ) : (
              <EmptyState
                icon={SearchX}
                title="Nenhum serviço encontrado"
                description="Tente termos mais genéricos, remova filtros ou busque em outra cidade."
                action={
                  hasFilters ? (
                    <Button variant="outline" onClick={clearFilters}>
                      Limpar filtros
                    </Button>
                  ) : undefined
                }
              />
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default function BuscarPage() {
  return (
    <Suspense>
      <BuscarContent />
    </Suspense>
  );
}
