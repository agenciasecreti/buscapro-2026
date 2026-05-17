'use client';

import { cn } from '@buscapro/ui';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export interface ThemeToggleProps {
  /** Mostra o rótulo ao lado do ícone (uso em listas/tela de conta). */
  withLabel?: boolean;
  className?: string;
}

/**
 * Alterna Light/Dark com persistência (next-themes) e fallback do sistema.
 * Acessível, mobile-first, com crossfade suave entre sol e lua.
 */
export function ThemeToggle({ withLabel = false, className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Evita mismatch de hidratação (tema só é conhecido no client).
  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === 'dark';
  const next = isDark ? 'light' : 'dark';
  const label = isDark ? 'Ativar modo claro' : 'Ativar modo escuro';

  const icon = (
    <span className="relative inline-flex size-5 items-center justify-center">
      <Sun
        className={cn(
          'absolute size-5 transition-all duration-300',
          mounted && !isDark
            ? 'rotate-0 scale-100 opacity-100'
            : '-rotate-90 scale-50 opacity-0',
        )}
        aria-hidden
      />
      <Moon
        className={cn(
          'absolute size-5 transition-all duration-300',
          mounted && isDark
            ? 'rotate-0 scale-100 opacity-100'
            : 'rotate-90 scale-50 opacity-0',
        )}
        aria-hidden
      />
    </span>
  );

  if (withLabel) {
    return (
      <button
        type="button"
        onClick={() => setTheme(next)}
        aria-label={label}
        className={cn(
          'flex w-full items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          className,
        )}
      >
        <span className="flex items-center gap-3">
          {icon}
          {mounted ? (isDark ? 'Modo escuro' : 'Modo claro') : 'Tema'}
        </span>
        <span className="text-xs text-muted-foreground">
          {mounted ? 'Toque para alternar' : ''}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex size-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary/70 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className,
      )}
    >
      {icon}
    </button>
  );
}
