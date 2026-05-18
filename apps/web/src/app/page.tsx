'use client';

import { Button, Card } from '@buscapro/ui';
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  MapPin,
  MessageSquare,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { AppHeader } from '@/components/app-header';
import { ServiceCard, ServiceCardSkeleton } from '@/components/service-card';
import { useCategories } from '@/hooks/use-categories';
import { useServices } from '@/hooks/use-services';

const benefits = [
  {
    icon: ShieldCheck,
    title: 'Profissionais verificados',
    description:
      'Cada prestador é avaliado pela comunidade. Você contrata com segurança.',
  },
  {
    icon: MapPin,
    title: 'Perto de você',
    description:
      'Encontre quem atende na sua cidade e região, em poucos segundos.',
  },
  {
    icon: BadgeCheck,
    title: 'Sem fricção',
    description:
      'Do primeiro contato à contratação, tudo num só lugar — simples e rápido.',
  },
];

const steps = [
  {
    icon: Search,
    title: 'Busque',
    description: 'Pesquise pelo serviço ou navegue pelas categorias.',
  },
  {
    icon: Star,
    title: 'Compare',
    description: 'Veja perfis, preços e avaliações reais de outros clientes.',
  },
  {
    icon: MessageSquare,
    title: 'Contrate',
    description: 'Entre em contato direto com o profissional escolhido.',
  },
];

export default function LandingPage() {
  const router = useRouter();
  const [term, setTerm] = useState('');

  const categories = useCategories();
  const featured = useServices({ sort: 'rating', pageSize: 6 });

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = term.trim();
    router.push(q ? `/buscar?q=${encodeURIComponent(q)}` : '/buscar');
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <AppHeader />

      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden border-b border-border/50">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-brand-mesh"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-28 -top-28 size-[460px] rounded-full bg-primary/15 blur-[120px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-32 top-20 size-[380px] rounded-full bg-accent/15 blur-[120px]"
        />
        <div className="container relative flex flex-col items-center py-20 text-center sm:py-28">
          <span className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground shadow-xs">
            <Sparkles className="size-3.5 text-primary" aria-hidden />
            Mais de 12 categorias de serviços locais
          </span>
          <h1 className="max-w-3xl text-balance text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            Profissionais de confiança,{' '}
            <span className="text-primary">perto de você</span>
          </h1>
          <p className="mt-5 max-w-xl text-pretty text-base text-muted-foreground sm:text-lg">
            O BuscaPRO conecta você a prestadores de serviços locais avaliados
            pela comunidade — rápido, simples e sem fricção.
          </p>

          <form
            onSubmit={submitSearch}
            className="mt-10 flex w-full max-w-xl flex-col gap-2 rounded-2xl border border-border bg-card p-2 shadow-lg sm:flex-row sm:items-center sm:rounded-xl"
            role="search"
          >
            <div className="flex flex-1 items-center gap-2 px-3">
              <Search
                className="size-5 shrink-0 text-muted-foreground"
                aria-hidden
              />
              <input
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="O que você precisa? Ex.: eletricista, faxina…"
                aria-label="Buscar serviços"
                className="h-11 w-full bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>
            <Button type="submit" size="lg" className="sm:w-auto">
              Buscar agora
            </Button>
          </form>

          <p className="mt-4 text-xs text-muted-foreground">
            Buscas populares: limpeza · elétrica · pintura · jardinagem
          </p>
        </div>
      </section>

      <main className="flex-1">
        {/* ---------- Benefícios ---------- */}
        <section className="container py-16 sm:py-20">
          <div className="grid gap-6 sm:grid-cols-3">
            {benefits.map(({ icon: Icon, title, description }) => (
              <Card
                key={title}
                className="p-6 transition-shadow duration-200 hover:shadow-md"
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-5" aria-hidden />
                </span>
                <h3 className="mt-4 text-base font-semibold text-foreground">
                  {title}
                </h3>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {description}
                </p>
              </Card>
            ))}
          </div>
        </section>

        {/* ---------- Categorias populares ---------- */}
        <section className="border-y border-border bg-muted/30">
          <div className="container py-16 sm:py-20">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  Categorias populares
                </h2>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Comece por uma área e encontre profissionais perto de você.
                </p>
              </div>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="hidden shrink-0 sm:flex"
              >
                <Link href="/buscar">
                  Ver tudo
                  <ArrowRight aria-hidden />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {categories.isLoading
                ? Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-20 animate-pulse rounded-xl bg-muted"
                  />
                ))
                : categories.data?.slice(0, 8).map((c) => (
                  <Link
                    key={c.id}
                    href={`/buscar?categoryId=${c.id}`}
                    className="group rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <Card className="flex h-20 items-center justify-center px-4 text-center transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-primary/40 group-hover:bg-primary/5">
                      <span className="text-sm font-semibold text-foreground">
                        {c.name}
                      </span>
                    </Card>
                  </Link>
                ))}
            </div>
          </div>
        </section>

        {/* ---------- Como funciona ---------- */}
        <section className="container py-16 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Como funciona
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Três passos entre o seu problema e a solução.
            </p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {steps.map(({ icon: Icon, title, description }, i) => (
              <div key={title} className="relative text-center">
                <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-brand-gradient text-primary-foreground shadow-sm">
                  <Icon className="size-6" aria-hidden />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-foreground">
                  <span className="mr-1 text-primary">{i + 1}.</span>
                  {title}
                </h3>
                <p className="mx-auto mt-1.5 max-w-xs text-sm text-muted-foreground">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- Destaques ---------- */}
        <section className="border-t border-border bg-muted/30">
          <div className="container py-16 sm:py-20">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  Profissionais em destaque
                </h2>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Os serviços mais bem avaliados da plataforma.
                </p>
              </div>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="hidden shrink-0 sm:flex"
              >
                <Link href="/buscar">
                  Ver todos
                  <ArrowRight aria-hidden />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featured.isLoading
                ? Array.from({ length: 6 }).map((_, i) => (
                  <ServiceCardSkeleton key={i} />
                ))
                : featured.data?.items.map((s) => (
                  <ServiceCard key={s.id} service={s} />
                ))}
            </div>
          </div>
        </section>

        {/* ---------- CTA ---------- */}
        <section className="container py-16 sm:py-24">
          <div className="relative overflow-hidden rounded-3xl bg-brand-gradient px-6 py-14 text-center sm:px-12">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.12] [background:radial-gradient(circle_at_20%_20%,white,transparent_45%),radial-gradient(circle_at_85%_75%,white,transparent_40%)]"
            />
            <div className="relative">
              <CalendarCheck
                className="mx-auto size-10 text-primary-foreground"
                aria-hidden
              />
              <h2 className="mt-5 text-balance text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
                Você presta serviços? Comece a receber clientes hoje.
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-pretty text-primary-foreground/80">
                Crie seu perfil grátis, publique seus serviços e seja
                encontrado por quem precisa de você.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="w-full sm:w-auto"
                >
                  <Link href="/cadastro">
                    Criar conta grátis
                    <ArrowRight aria-hidden />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="ghost"
                  className="w-full text-primary-foreground hover:bg-white/10 sm:w-auto"
                >
                  <Link href="/buscar">Explorar serviços</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ---------- Footer ---------- */}
      <footer className="border-t border-border bg-card">
        <div className="container grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <span className="text-lg font-bold tracking-tight text-foreground">
              Busca<span className="text-primary">PRO</span>
            </span>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              Conectando pessoas a profissionais locais de confiança.
            </p>
          </div>
          <nav className="text-sm">
            <p className="font-semibold text-foreground">Plataforma</p>
            <ul className="mt-3 space-y-2 text-muted-foreground">
              <li>
                <Link href="/buscar" className="hover:text-foreground">
                  Buscar serviços
                </Link>
              </li>
              <li>
                <Link href="/cadastro" className="hover:text-foreground">
                  Criar conta
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-foreground">
                  Entrar
                </Link>
              </li>
            </ul>
          </nav>
          <nav className="text-sm">
            <p className="font-semibold text-foreground">Para profissionais</p>
            <ul className="mt-3 space-y-2 text-muted-foreground">
              <li>
                <Link href="/cadastro" className="hover:text-foreground">
                  Anunciar serviço
                </Link>
              </li>
              <li>
                <Link href="/painel" className="hover:text-foreground">
                  Painel do prestador
                </Link>
              </li>
            </ul>
          </nav>
          <div className="text-sm">
            <p className="font-semibold text-foreground">Contato</p>
            <p className="mt-3 text-muted-foreground">
              contato@secreti.com.br
            </p>
          </div>
        </div>
        <div className="border-t border-border py-6">
          <p className="container text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} BuscaPRO. Todos os direitos
            reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
