'use client';

import { Star } from 'lucide-react';
import { useState } from 'react';

import { cn } from '../lib/cn';

const sizeMap = { sm: 'size-3.5', md: 'size-5', lg: 'size-7' } as const;

export interface StarRatingProps {
  value: number;
  /** Quando definido, o componente vira input (1–5). */
  onChange?: (value: number) => void;
  size?: keyof typeof sizeMap;
  /** Texto auxiliar (ex.: "4.8 · 23 avaliações"). */
  label?: string;
  className?: string;
}

export function StarRating({
  value,
  onChange,
  size = 'md',
  label,
  className,
}: StarRatingProps) {
  const [hover, setHover] = useState<number | null>(null);
  const interactive = typeof onChange === 'function';
  const display = hover ?? value;
  const star = sizeMap[size];

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div
        className="flex items-center gap-0.5"
        role={interactive ? 'radiogroup' : 'img'}
        aria-label={
          interactive ? 'Selecione uma nota' : `Nota ${value} de 5`
        }
      >
        {[1, 2, 3, 4, 5].map((i) => {
          const filled = i <= display;
          const StarIcon = (
            <Star
              className={cn(
                star,
                'transition-colors',
                filled
                  ? 'fill-primary text-primary'
                  : 'fill-transparent text-muted-foreground/40',
              )}
              aria-hidden
            />
          );

          if (!interactive) {
            return <span key={i}>{StarIcon}</span>;
          }

          return (
            <button
              key={i}
              type="button"
              role="radio"
              aria-checked={i === value}
              aria-label={`${i} ${i === 1 ? 'estrela' : 'estrelas'}`}
              onClick={() => onChange?.(i)}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(null)}
              className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {StarIcon}
            </button>
          );
        })}
      </div>
      {label && (
        <span className="text-sm text-muted-foreground">{label}</span>
      )}
    </div>
  );
}
