import { Logo } from '@buscapro/ui';
import { BadgeCheck, MapPin, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

const highlights = [
  {
    icon: ShieldCheck,
    title: 'Profissionais verificados',
    description: 'Prestadores avaliados pela comunidade, sem surpresas.',
  },
  {
    icon: MapPin,
    title: 'Perto de você',
    description: 'Encontre serviços na sua região em segundos.',
  },
  {
    icon: BadgeCheck,
    title: 'Contratação sem fricção',
    description: 'Do primeiro contato ao serviço feito, tudo num só lugar.',
  },
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[1.05fr_1fr]">
      {/* Painel de marca — escondido no mobile, presente no desktop */}
      <aside className="relative hidden overflow-hidden bg-brand-gradient p-12 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.12] [background:radial-gradient(circle_at_25%_15%,white,transparent_45%),radial-gradient(circle_at_80%_70%,white,transparent_40%)]"
        />
        <Link
          href="/"
          className="relative inline-flex w-fit rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        >
          <span className="text-xl font-bold tracking-tight text-primary-foreground">
            Busca<span className="text-primary-foreground/70">PRO</span>
          </span>
        </Link>

        <div className="relative max-w-md">
          <h2 className="text-3xl font-bold leading-tight tracking-tight">
            O jeito mais confiável de contratar serviços locais.
          </h2>
          <ul className="mt-10 space-y-6">
            {highlights.map(({ icon: Icon, title, description }) => (
              <li key={title} className="flex gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/15 ring-1 ring-inset ring-white/20">
                  <Icon className="size-5" aria-hidden />
                </span>
                <div>
                  <p className="font-semibold">{title}</p>
                  <p className="text-sm text-primary-foreground/75">
                    {description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-sm text-primary-foreground/60">
          © {new Date().getFullYear()} BuscaPRO. Todos os direitos reservados.
        </p>
      </aside>

      {/* Área do formulário */}
      <main className="flex flex-col items-center justify-center bg-background px-5 py-10 sm:px-8">
        <div className="w-full max-w-[400px] animate-fade-in">
          <div className="mb-8 flex justify-center lg:hidden">
            <Link
              href="/"
              className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <Logo />
            </Link>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
