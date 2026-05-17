/**
 * @buscapro/types
 * Tipos compartilhados entre web e api.
 * Os domínios serão adicionados conforme o produto evoluir.
 */

export type ApiSuccess<T> = {
  success: true;
  data: T;
};

export type ApiError = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export type Paginated<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
};

// -----------------------------------------------------
// Auth — contrato compartilhado web ↔ api
// -----------------------------------------------------

export type Role = 'CLIENT' | 'PROVIDER';

export type PublicUser = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: Role;
  avatarUrl: string | null;
  createdAt: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: Role;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type AuthResult = {
  token: string;
  user: PublicUser;
};

// -----------------------------------------------------
// Marketplace — categorias, serviços, prestadores, avaliações
// -----------------------------------------------------

export type Category = {
  id: string;
  name: string;
  slug: string;
};

export type ProviderSummary = {
  id: string;
  name: string;
  avatarUrl: string | null;
  city: string | null;
  state: string | null;
};

export type Service = {
  id: string;
  title: string;
  description: string;
  price: number;
  active: boolean;
  imageUrl: string | null;
  createdAt: string;
  category: Category;
  provider: ProviderSummary;
  rating: { average: number; count: number };
};

export type ReviewAuthor = {
  id: string;
  name: string;
  avatarUrl: string | null;
};

export type Review = {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  reviewer: ReviewAuthor;
};

export type ProviderProfile = {
  id: string;
  name: string;
  avatarUrl: string | null;
  phone: string | null;
  role: Role;
  createdAt: string;
  location: { city: string; state: string } | null;
  rating: { average: number; count: number };
  services: Service[];
  reviews: Review[];
};

export type ServiceSort = 'recent' | 'price_asc' | 'price_desc' | 'rating';

export type ServiceListQuery = {
  q?: string;
  categoryId?: string;
  city?: string;
  state?: string;
  sort?: ServiceSort;
  page?: number;
  pageSize?: number;
};

export type CreateServicePayload = {
  title: string;
  description: string;
  price: number;
  categoryId: string;
  active?: boolean;
  imageUrl?: string | null;
};

export type UploadType = 'avatar' | 'service';

export type UploadResult = {
  url: string;
};

export type UpdateServicePayload = Partial<CreateServicePayload>;

export type CreateReviewPayload = {
  serviceId: string;
  rating: number;
  comment?: string;
};
