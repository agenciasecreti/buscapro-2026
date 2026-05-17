'use client';

import { ImagePlus, Loader2, Trash2, UploadCloud } from 'lucide-react';
import { useId, useRef, useState } from 'react';

import { cn } from '../lib/cn';

const ACCEPT = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024;

export interface ImageUploadProps {
  value?: string | null;
  onUpload: (file: File) => Promise<string>;
  onChange: (url: string | null) => void;
  shape?: 'circle' | 'wide';
  label?: string;
  hint?: string;
  className?: string;
}

export function ImageUpload({
  value,
  onUpload,
  onChange,
  shape = 'wide',
  label = 'Imagem',
  hint = 'JPG, PNG ou WEBP · até 5 MB',
  className,
}: ImageUploadProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const isCircle = shape === 'circle';

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError(null);

    if (!ACCEPT.includes(file.type)) {
      setError('Formato inválido. Use JPG, PNG ou WEBP.');
      return;
    }
    if (file.size > MAX_SIZE) {
      setError('Imagem muito grande (máx. 5 MB).');
      return;
    }

    setUploading(true);
    try {
      const url = await onUpload(file);
      onChange(url);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Falha ao enviar a imagem.',
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <span className="text-sm font-medium text-foreground">{label}</span>

      <div
        className={cn(
          'group relative flex items-center justify-center overflow-hidden border border-dashed border-input bg-muted/30 transition-colors',
          isCircle ? 'size-28 rounded-full' : 'aspect-[16/9] w-full rounded-xl',
          dragging && 'border-primary bg-primary/5',
          !value && 'hover:border-foreground/30',
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          void handleFile(e.dataTransfer.files?.[0]);
        }}
      >
        {value ? (
          <img
            src={value}
            alt={label}
            className="h-full w-full object-cover"
          />
        ) : (
          <label
            htmlFor={inputId}
            className="flex cursor-pointer flex-col items-center gap-2 p-4 text-center"
          >
            {isCircle ? (
              <ImagePlus
                className="size-6 text-muted-foreground"
                aria-hidden
              />
            ) : (
              <>
                <span className="flex size-11 items-center justify-center rounded-full bg-background text-muted-foreground shadow-sm">
                  <UploadCloud className="size-5" aria-hidden />
                </span>
                <span className="text-sm font-medium text-foreground">
                  Arraste uma imagem ou{' '}
                  <span className="text-primary">selecione</span>
                </span>
                <span className="text-xs text-muted-foreground">{hint}</span>
              </>
            )}
          </label>
        )}

        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm">
            <Loader2
              className="size-6 animate-spin text-primary"
              aria-hidden
            />
            <span className="sr-only">Enviando imagem…</span>
          </div>
        )}

        {value && !uploading && (
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-foreground/40 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
            <label
              htmlFor={inputId}
              className="cursor-pointer rounded-md bg-background/90 px-3 py-1.5 text-xs font-medium text-foreground shadow-sm"
            >
              Trocar
            </label>
            <button
              type="button"
              onClick={() => onChange(null)}
              className="flex items-center gap-1 rounded-md bg-background/90 px-3 py-1.5 text-xs font-medium text-destructive shadow-sm"
            >
              <Trash2 className="size-3.5" aria-hidden />
              Remover
            </button>
          </div>
        )}
      </div>

      <input
        id={inputId}
        ref={inputRef}
        type="file"
        accept={ACCEPT.join(',')}
        className="sr-only"
        onChange={(e) => {
          void handleFile(e.target.files?.[0]);
          e.target.value = '';
        }}
      />

      {isCircle && !value && (
        <label
          htmlFor={inputId}
          className="cursor-pointer text-center text-xs text-muted-foreground"
        >
          {hint}
        </label>
      )}

      {error && (
        <p role="alert" className="text-sm font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
