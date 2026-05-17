'use client';

import { Avatar, Button, Logo } from '@buscapro/ui';
import { LayoutDashboard, LogOut, Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { ThemeToggle } from '@/components/theme-toggle';
import { useAuthStore } from '@/store/auth.store';

export function AppHeader() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);
  const logout = useAuthStore((s) => s.logout);

  function handleLogout() {
    logout();
    router.push('/');
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-background/60 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <Logo />
        </Link>

        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="hidden sm:flex">
            <Link href="/buscar">
              <Search aria-hidden />
              Buscar
            </Link>
          </Button>

          <ThemeToggle className="size-9" />

          {hydrated && user ? (
            <>
              {user.role === 'PROVIDER' && (
                <Button asChild variant="ghost" size="sm">
                  <Link href="/painel">
                    <LayoutDashboard aria-hidden />
                    <span className="hidden sm:inline">Painel</span>
                  </Link>
                </Button>
              )}
              <Link
                href="/conta"
                className="flex items-center gap-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-label="Minha conta"
              >
                <Avatar name={user.name} src={user.avatarUrl} size="sm" />
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                aria-label="Sair"
              >
                <LogOut aria-hidden />
              </Button>
            </>
          ) : hydrated ? (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Entrar</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/cadastro">Criar conta</Link>
              </Button>
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
}
