'use client';

import { useEffect, useState } from 'react';

/** Retorna o valor após `delay` ms sem mudanças (evita buscas a cada tecla). */
export function useDebounce<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}
