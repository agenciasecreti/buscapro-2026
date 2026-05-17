'use client';

import { Button, FormField, Input, cn } from '@buscapro/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { Briefcase, UserRound } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { PasswordInput } from '@/components/password-input';
import { registerSchema, type RegisterValues } from '@/lib/validations/auth';
import { authService } from '@/services/auth.service';
import { ApiError } from '@/services/http';
import { useAuthStore } from '@/store/auth.store';

const roles = [
  {
    value: 'CLIENT' as const,
    label: 'Sou cliente',
    hint: 'Quero contratar',
    icon: UserRound,
  },
  {
    value: 'PROVIDER' as const,
    label: 'Sou prestador',
    hint: 'Quero oferecer',
    icon: Briefcase,
  },
];

export default function CadastroPage() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  const hydrated = useAuthStore((s) => s.hydrated);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', phone: '', role: 'CLIENT' },
  });

  const selectedRole = watch('role');

  useEffect(() => {
    if (hydrated && isAuthenticated) router.replace('/');
  }, [hydrated, isAuthenticated, router]);

  async function onSubmit(values: RegisterValues) {
    try {
      const result = await authService.register({
        ...values,
        phone: values.phone?.trim() ? values.phone : undefined,
      });
      setSession(result);
      toast.success('Conta criada com sucesso. Bem-vindo ao BuscaPRO!');
      router.replace('/');
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : 'Algo deu errado. Tente novamente.';
      toast.error(message);
    }
  }

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Criar sua conta
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Leva menos de um minuto. Sem cartão de crédito.
        </p>
      </header>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-5"
      >
        <fieldset className="flex flex-col gap-2">
          <legend className="mb-2 text-sm font-medium text-foreground">
            Como você vai usar o BuscaPRO?
          </legend>
          <div className="grid grid-cols-2 gap-3">
            {roles.map(({ value, label, hint, icon: Icon }) => {
              const active = selectedRole === value;
              return (
                <button
                  key={value}
                  type="button"
                  aria-pressed={active}
                  onClick={() =>
                    setValue('role', value, { shouldValidate: true })
                  }
                  className={cn(
                    'flex flex-col items-start gap-1.5 rounded-lg border p-4 text-left transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                    active
                      ? 'border-primary bg-primary/5 ring-1 ring-primary'
                      : 'border-input hover:border-foreground/20 hover:bg-muted',
                  )}
                >
                  <Icon
                    className={cn(
                      'size-5',
                      active ? 'text-primary' : 'text-muted-foreground',
                    )}
                    aria-hidden
                  />
                  <span className="text-sm font-semibold text-foreground">
                    {label}
                  </span>
                  <span className="text-xs text-muted-foreground">{hint}</span>
                </button>
              );
            })}
          </div>
        </fieldset>

        <FormField
          htmlFor="name"
          label="Nome completo"
          error={errors.name?.message}
        >
          <Input
            id="name"
            autoComplete="name"
            placeholder="Maria Silva"
            aria-describedby="name-msg"
            invalid={Boolean(errors.name)}
            {...register('name')}
          />
        </FormField>

        <FormField htmlFor="email" label="E-mail" error={errors.email?.message}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="voce@email.com"
            aria-describedby="email-msg"
            invalid={Boolean(errors.email)}
            {...register('email')}
          />
        </FormField>

        <FormField
          htmlFor="phone"
          label="Telefone"
          hint="Opcional — facilita o contato."
          error={errors.phone?.message}
        >
          <Input
            id="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            placeholder="(11) 99999-9999"
            aria-describedby="phone-msg"
            invalid={Boolean(errors.phone)}
            {...register('phone')}
          />
        </FormField>

        <FormField
          htmlFor="password"
          label="Senha"
          hint="Mínimo de 8 caracteres."
          error={errors.password?.message}
        >
          <PasswordInput
            id="password"
            autoComplete="new-password"
            placeholder="Crie uma senha forte"
            aria-describedby="password-msg"
            invalid={Boolean(errors.password)}
            {...register('password')}
          />
        </FormField>

        <Button
          type="submit"
          size="lg"
          loading={isSubmitting}
          className="mt-1 w-full"
        >
          {isSubmitting ? 'Criando conta…' : 'Criar conta'}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Já tem conta?{' '}
        <Link
          href="/login"
          className="font-semibold text-primary underline-offset-4 hover:underline"
        >
          Entrar
        </Link>
      </p>
    </div>
  );
}
