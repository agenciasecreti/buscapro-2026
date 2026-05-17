'use client';

import { Button } from '@buscapro/ui';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (totalPages <= 1) return null;

  return (
    <nav
      className="flex items-center justify-between gap-4"
      aria-label="Paginação"
    >
      <Button
        variant="outline"
        size="sm"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft aria-hidden />
        Anterior
      </Button>
      <p className="text-sm text-muted-foreground" aria-live="polite">
        Página <span className="font-medium text-foreground">{page}</span> de{' '}
        {totalPages}
      </p>
      <Button
        variant="outline"
        size="sm"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Próxima
        <ChevronRight aria-hidden />
      </Button>
    </nav>
  );
}
