'use client';

import { Button, FormField, Input } from '@buscapro/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { PasswordInput } from '@/components/password-input';
import { loginSchema, type LoginValues } from '@/lib/validations/auth';
import { authService } from '@/services/auth.service';
import { ApiError } from '@/services/http';
import { useAuthStore } from '@/store/auth.store';

export default function LoginPage() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  const hydrated = useAuthStore((s) => s.hydrated);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  useEffect(() => {
    if (hydrated && isAuthenticated) router.replace('/');
  }, [hydrated, isAuthenticated, router]);

  async function onSubmit(values: LoginValues) {
    try {
      const result = await authService.login(values);
      setSession(result);
      toast.success(`Bem-vindo de volta, ${result.user.name.split(' ')[0]}!`);
      router.replace('/');
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : 'Algo deu errado. Tente novamente.';
      if (err instanceof ApiError && err.code === 'INVALID_CREDENTIALS') {
        setError('password', { message });
      }
      toast.error(message);
    }
  }

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Entrar na sua conta
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Bem-vindo de volta. Acesse para continuar.
        </p>
      </header>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-5"
      >
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
          htmlFor="password"
          label="Senha"
          error={errors.password?.message}
        >
          <PasswordInput
            id="password"
            autoComplete="current-password"
            placeholder="Sua senha"
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
          {isSubmitting ? 'Entrando…' : 'Entrar'}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Ainda não tem conta?{' '}
        <Link
          href="/cadastro"
          className="font-semibold text-primary underline-offset-4 hover:underline"
        >
          Criar conta
        </Link>
      </p>
    </div>
  );
}
