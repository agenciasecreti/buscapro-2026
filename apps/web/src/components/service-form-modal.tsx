'use client';

import type { Service } from '@buscapro/types';
import {
  Button,
  FormField,
  ImageUpload,
  Input,
  Modal,
  Select,
  Textarea,
} from '@buscapro/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useCategories } from '@/hooks/use-categories';
import { useCreateService, useUpdateService } from '@/hooks/use-services';
import { useUploadImage } from '@/hooks/use-upload';
import {
  serviceFormSchema,
  type ServiceFormValues,
} from '@/lib/validations/service';
import { ApiError } from '@/services/http';

interface Props {
  open: boolean;
  onClose: () => void;
  service?: Service | null;
}

export function ServiceFormModal({ open, onClose, service }: Props) {
  const isEdit = Boolean(service);
  const categories = useCategories();
  const createMutation = useCreateService();
  const updateMutation = useUpdateService(service?.id ?? '');
  const uploadImage = useUploadImage('service');

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      categoryId: '',
      active: true,
      imageUrl: null,
    },
  });

  const imageUrl = watch('imageUrl');

  useEffect(() => {
    if (!open) return;
    reset(
      service
        ? {
            title: service.title,
            description: service.description,
            price: service.price,
            categoryId: service.category.id,
            active: service.active,
            imageUrl: service.imageUrl,
          }
        : {
            title: '',
            description: '',
            price: 0,
            categoryId: '',
            active: true,
            imageUrl: null,
          },
    );
  }, [open, service, reset]);

  const isPending = createMutation.isPending || updateMutation.isPending;

  async function onSubmit(values: ServiceFormValues) {
    try {
      if (isEdit) {
        await updateMutation.mutateAsync(values);
        toast.success('Serviço atualizado.');
      } else {
        await createMutation.mutateAsync(values);
        toast.success('Serviço publicado.');
      }
      onClose();
    } catch (err) {
      toast.error(
        err instanceof ApiError
          ? err.message
          : 'Não foi possível salvar o serviço.',
      );
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Editar serviço' : 'Novo serviço'}
      description="Capriche na descrição — é o que convence o cliente."
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={isPending}>
            Cancelar
          </Button>
          <Button
            type="submit"
            form="service-form"
            loading={isPending}
          >
            {isEdit ? 'Salvar alterações' : 'Publicar serviço'}
          </Button>
        </>
      }
    >
      <form
        id="service-form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-5"
      >
        <ImageUpload
          label="Imagem do serviço"
          shape="wide"
          value={imageUrl}
          onUpload={(file) => uploadImage.mutateAsync(file).then((r) => r.url)}
          onChange={(url) =>
            setValue('imageUrl', url, { shouldDirty: true })
          }
        />

        <FormField
          htmlFor="title"
          label="Título"
          error={errors.title?.message}
        >
          <Input
            id="title"
            placeholder="Ex.: Instalação elétrica residencial"
            invalid={Boolean(errors.title)}
            {...register('title')}
          />
        </FormField>

        <FormField
          htmlFor="categoryId"
          label="Categoria"
          error={errors.categoryId?.message}
        >
          <Select
            id="categoryId"
            invalid={Boolean(errors.categoryId)}
            {...register('categoryId')}
          >
            <option value="">Selecione…</option>
            {categories.data?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField
          htmlFor="price"
          label="Preço (R$)"
          error={errors.price?.message}
        >
          <Input
            id="price"
            type="number"
            min={0}
            step="0.01"
            inputMode="decimal"
            placeholder="0,00"
            invalid={Boolean(errors.price)}
            {...register('price')}
          />
        </FormField>

        <FormField
          htmlFor="description"
          label="Descrição"
          error={errors.description?.message}
        >
          <Textarea
            id="description"
            rows={5}
            placeholder="O que está incluso, experiência, diferenciais…"
            invalid={Boolean(errors.description)}
            {...register('description')}
          />
        </FormField>

        <label className="flex items-center gap-2.5 text-sm text-foreground">
          <input
            type="checkbox"
            className="size-4 rounded border-input accent-primary"
            {...register('active')}
          />
          Serviço ativo (visível na busca)
        </label>
      </form>
    </Modal>
  );
}
