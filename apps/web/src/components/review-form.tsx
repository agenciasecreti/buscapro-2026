'use client';

import { Button, Card, StarRating, Textarea } from '@buscapro/ui';
import { useState } from 'react';
import { toast } from 'sonner';

import { useCreateReview } from '@/hooks/use-reviews';
import { ApiError } from '@/services/http';

export function ReviewForm({ serviceId }: { serviceId: string }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const { mutateAsync, isPending } = useCreateReview(serviceId);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (rating < 1) {
      toast.error('Selecione uma nota de 1 a 5.');
      return;
    }
    try {
      await mutateAsync({
        serviceId,
        rating,
        comment: comment.trim() || undefined,
      });
      toast.success('Avaliação enviada. Obrigado!');
      setRating(0);
      setComment('');
    } catch (err) {
      toast.error(
        err instanceof ApiError
          ? err.message
          : 'Não foi possível enviar sua avaliação.',
      );
    }
  }

  return (
    <Card className="p-5">
      <h3 className="text-base font-semibold text-foreground">
        Avaliar este serviço
      </h3>
      <form onSubmit={submit} className="mt-4 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-foreground">Sua nota</span>
          <StarRating value={rating} onChange={setRating} size="lg" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="comment"
            className="text-sm font-medium text-foreground"
          >
            Comentário{' '}
            <span className="text-muted-foreground">(opcional)</span>
          </label>
          <Textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Conte como foi sua experiência…"
            maxLength={1000}
          />
        </div>
        <Button type="submit" loading={isPending} className="self-start">
          Enviar avaliação
        </Button>
      </form>
    </Card>
  );
}
