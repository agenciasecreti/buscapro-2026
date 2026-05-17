'use client';

import { cn } from '@buscapro/ui';
import {
  Home,
  LayoutDashboard,
  LogIn,
  Search,
  User,
  type LucideIcon,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useAuthStore } from '@/store/auth.store';

type Item = {
  href: string;
  label: string;
  icon: LucideIcon;
  match: (path: string) => boolean;
};

// Rotas onde a bottom nav não deve aparecer (telas full-screen de auth).
const HIDDEN_ON = ['/login', '/cadastro'];

export function BottomNav() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);

  if (HIDDEN_ON.some((p) => pathname.startsWith(p))) return null;

  const items: Item[] = [
    { href: '/', label: 'Início', icon: Home, match: (p) => p === '/' },
    {
      href: '/buscar',
      label: 'Buscar',
      icon: Search,
      match: (p) =>
        p.startsWith('/buscar') ||
        p.startsWith('/servicos') ||
        p.startsWith('/profissionais'),
    },
  ];

  if (hydrated && user?.role === 'PROVIDER') {
    items.push({
      href: '/painel',
      label: 'Painel',
      icon: LayoutDashboard,
      match: (p) => p.startsWith('/painel'),
    });
  }

  items.push(
    hydrated && user
      ? {
          href: '/conta',
          label: 'Conta',
          icon: User,
          match: (p) => p.startsWith('/conta'),
        }
      : {
          href: '/login',
          label: 'Entrar',
          icon: LogIn,
          match: (p) => p.startsWith('/login'),
        },
  );

  return (
    <>
      {/* Espaçador: garante que o conteúdo não fique sob a barra (mobile). */}
      <div
        aria-hidden
        className="h-[calc(4rem+env(safe-area-inset-bottom))] lg:hidden"
      />

      <nav
        aria-label="Navegação principal"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-border/60 bg-background/80 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden"
      >
        <ul className="mx-auto flex max-w-md items-stretch justify-around px-2">
          {items.map(({ href, label, icon: Icon, match }) => {
            const active = match(pathname);
            return (
              <li key={href} className="flex-1">
                <Link
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'group flex h-16 flex-col items-center justify-center gap-1 rounded-xl text-[11px] font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    active
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  <span
                    className={cn(
                      'flex size-9 items-center justify-center rounded-full transition-all duration-200',
                      active
                        ? 'scale-100 bg-primary/10'
                        : 'scale-95 group-active:scale-90',
                    )}
                  >
                    <Icon
                      className={cn(
                        'size-[22px] transition-transform duration-200',
                        active && 'scale-110',
                      )}
                      aria-hidden
                    />
                  </span>
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
