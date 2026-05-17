/**
 * @buscapro/ui
 * Design system compartilhado — tokens vivem no app (Tailwind),
 * os componentes consomem variáveis CSS semânticas.
 */

export { cn } from './lib/cn';

export { Button, buttonVariants } from './components/button';
export type { ButtonProps } from './components/button';

export { Input } from './components/input';
export type { InputProps } from './components/input';

export { Label } from './components/label';

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from './components/card';

export { Spinner, LoadingState } from './components/spinner';
export type { SpinnerProps } from './components/spinner';

export { EmptyState } from './components/empty-state';
export type { EmptyStateProps } from './components/empty-state';

export { FormField } from './components/form-field';
export type { FormFieldProps } from './components/form-field';

export { Logo } from './components/logo';
export type { LogoProps } from './components/logo';

export { Skeleton } from './components/skeleton';

export { Badge, badgeVariants } from './components/badge';
export type { BadgeProps } from './components/badge';

export { Avatar } from './components/avatar';
export type { AvatarProps } from './components/avatar';

export { Textarea } from './components/textarea';
export type { TextareaProps } from './components/textarea';

export { Select } from './components/select';
export type { SelectProps } from './components/select';

export { StarRating } from './components/star-rating';
export type { StarRatingProps } from './components/star-rating';

export { Modal } from './components/modal';
export type { ModalProps } from './components/modal';

export { ImageUpload } from './components/image-upload';
export type { ImageUploadProps } from './components/image-upload';
