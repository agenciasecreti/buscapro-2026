import type { Review } from '@buscapro/types';
import { Avatar, StarRating } from '@buscapro/ui';

import { formatDate } from '@/lib/format';

export function ReviewList({ reviews }: { reviews: Review[] }) {
  return (
    <ul className="divide-y divide-border">
      {reviews.map((review) => (
        <li key={review.id} className="flex gap-4 py-5 first:pt-0">
          <Avatar
            name={review.reviewer.name}
            src={review.reviewer.avatarUrl}
            size="md"
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
              <p className="font-medium text-foreground">
                {review.reviewer.name}
              </p>
              <time className="text-xs text-muted-foreground">
                {formatDate(review.createdAt)}
              </time>
            </div>
            <StarRating value={review.rating} size="sm" className="mt-1" />
            {review.comment && (
              <p className="mt-2 text-sm text-muted-foreground">
                {review.comment}
              </p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
