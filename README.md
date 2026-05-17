# BuscaPRO

Plataforma web mobile-first que conecta clientes a prestadores de serviços locais.

> **Status:** production-ready — auth JWT, marketplace completo (categorias,
> serviços CRUD + busca/filtros/paginação, perfil, avaliações, painel),
> upload de imagens (S3 ou disco local), landing page premium e preparação
> de produção. Frontend integrado com TanStack Query.
>
> **API:** `/api/categories`, `/api/services` (lista · `/mine` · `/:id` ·
> POST/PUT/DELETE), `/api/services/:id/reviews`, `/api/providers/:id`,
> `/api/reviews`, `/api/uploads` (multipart), `/api/me/avatar`,
> `/api/health` + `/api/health/ready` (DB ping). **Telas:** `/` (landing),
> `/buscar`, `/servicos/[id]`, `/profissionais/[id]`, `/painel`, `/conta`,
> `/login`, `/cadastro`.
>
> **Mídia:** `STORAGE_DRIVER=local` (dev/demo, servido em `/uploads`) ou
> `STORAGE_DRIVER=s3` (produção — AWS S3, Cloudflare R2, MinIO). Migração
> incremental em `prisma/migrations/0002_service_image`.

---

## 🧱 Stack

| Camada      | Tecnologia                                                    |
| ----------- | ------------------------------------------------------------- |
| Frontend    | Next.js 15 · React 18 · TypeScript · TailwindCSS · shadcn/ui  |
| Backend     | Node.js 20 · Express · TypeScript · Prisma                    |
| Banco       | PostgreSQL (NeonDB serverless — **externo**)                  |
| Infra       | Docker · Docker Compose · Turborepo                           |
| CI/CD       | GitHub Actions · GHCR · Deploy SSH em VPS DigitalOcean        |

---

## 📁 Estrutura

```
buscapro/
├── apps/
│   ├── web/                    # Next.js 15 (App Router)
│   │   └── src/{app,components,services,hooks,store,lib,types}
│   └── api/                    # Express + Prisma
│       ├── prisma/schema.prisma
│       └── src/{modules,routes,middlewares,prisma,config,utils,types}
├── packages/
│   ├── ui/                     # Componentes compartilhados (shadcn/ui)
│   ├── types/                  # Tipos compartilhados web ↔ api
│   ├── eslint-config/          # ESLint base / next / node
│   └── tsconfig/               # tsconfigs base / nextjs / node
├── .github/workflows/          # CI + Deploy
├── docker-compose.dev.yml
├── docker-compose.prod.yml
├── turbo.json
└── package.json
```

---

## ⚙️ Pré-requisitos

- **Node.js** ≥ 20.11
- **pnpm** ≥ 9 (`corepack enable && corepack prepare pnpm@9.12.0 --activate`)
- **Docker** ≥ 24 (opcional, para ambientes containerizados)
- Conta no **NeonDB** com uma `DATABASE_URL` válida

---

## 🚀 Rodando localmente (sem Docker)

```bash
# 1. Instalar dependências
pnpm install

# 2. Configurar envs (copie e edite)
cp .env.example .env
cp apps/web/.env.example apps/web/.env
cp apps/api/.env.example apps/api/.env

# 3. Gerar Prisma Client
pnpm --filter @buscapro/api db:generate

# 4. Rodar migrations (NeonDB) — aplica 0001_init + 0002_service_image
pnpm --filter @buscapro/api db:migrate:deploy

# 5. Semear dados de demonstração (idempotente)
pnpm --filter @buscapro/api db:seed

# 6. Subir tudo em paralelo (web + api)
pnpm dev
```

> **Dados de demonstração:** o seed cria 12 categorias, 20 prestadores,
> 15 clientes, 40 serviços e 80 avaliações (cidades reais de PB/PE/RN,
> avatares e imagens placeholder). É **idempotente** — pode rodar várias
> vezes sem duplicar. Login de teste: qualquer e-mail
> `nome.NN@demo.buscapro.com` (ver console do seed) · senha **`demo1234`**.

- Web → http://localhost:3000
- API → http://localhost:3333/api/health

> **Auth:** defina `JWT_SECRET` (mín. 16 chars) e `DATABASE_URL` no `apps/api/.env`.
> Endpoints: `POST /api/auth/register`, `POST /api/auth/login`,
> `GET /api/auth/me` (Bearer token). Telas: `/login` e `/cadastro`.

---

## 🐳 Rodando com Docker (dev)

```bash
# Garanta que apps/web/.env e apps/api/.env existem (DATABASE_URL apontando para NeonDB)
pnpm docker:dev
```

Hot reload é preservado via bind-mount do repo dentro dos containers.

Parar:

```bash
pnpm docker:dev:down
```

---

## 🏭 Produção (Docker compose)

```bash
# Defina as envs do servidor (DATABASE_URL, CORS_ORIGIN, NEXT_PUBLIC_API_URL, etc.)
pnpm docker:prod
```

As imagens são puxadas do **GHCR** (`ghcr.io/<owner>/web` e `ghcr.io/<owner>/api`).
Para buildar localmente em vez de puxar, ajuste o `image:` do `docker-compose.prod.yml` para `build:`.

---

## 📜 Scripts úteis (raiz)

| Script                  | O que faz                                          |
| ----------------------- | -------------------------------------------------- |
| `pnpm dev`              | Sobe web + api em paralelo (turbo)                 |
| `pnpm build`            | Builda todos os apps/packages                      |
| `pnpm lint`             | Lint em todo o monorepo                            |
| `pnpm lint:fix`         | Lint corrigindo automaticamente                    |
| `pnpm type-check`       | Type-check em todos os pacotes                     |
| `pnpm format`           | Prettier write em todo o repo                      |
| `pnpm db:generate`      | `prisma generate`                                  |
| `pnpm db:migrate`       | `prisma migrate dev`                               |
| `pnpm db:studio`        | Abre o Prisma Studio                               |
| `pnpm docker:dev`       | Sobe stack dev com hot-reload                      |
| `pnpm docker:prod`      | Sobe stack de produção                             |
| `pnpm clean`            | Limpa caches, builds e node_modules                |

---

## 🔁 CI/CD (GitHub Actions)

### `.github/workflows/ci.yml`
Roda em `push` / `pull_request` para `main` e `develop`:
1. install (com cache pnpm + turbo)
2. lint
3. type-check
4. build

### `.github/workflows/deploy.yml`
Roda em `push` para `main`:
1. Builda **imagens multi-stage** (web e api) em paralelo
2. Publica em **GHCR** com tags `latest`, `sha-<short>` e nome do branch
3. Copia `docker-compose.prod.yml` para a VPS via SCP
4. SSH na VPS, `docker compose pull` + `up -d`

### Secrets necessárias no GitHub
| Secret              | Descrição                                          |
| ------------------- | -------------------------------------------------- |
| `VPS_HOST`          | IP ou hostname da VPS DigitalOcean                 |
| `VPS_USER`          | Usuário SSH (ex.: `deploy`)                        |
| `VPS_SSH_KEY`       | Chave privada SSH (PEM)                            |
| `VPS_PORT`          | (opcional) porta SSH — default `22`                |
| `VPS_DEPLOY_PATH`   | Path no servidor com o `docker-compose.prod.yml`   |

> O `GITHUB_TOKEN` é automático e tem permissão de push no GHCR via `permissions: packages: write`.

---

## 🗄️ Banco de dados

O banco roda no **NeonDB** (serverless PostgreSQL) — **não é containerizado**.
Para cada ambiente (dev / staging / prod), use uma branch separada no Neon e exporte o `DATABASE_URL` correspondente.

Schema vazio (`apps/api/prisma/schema.prisma`) — modelos serão adicionados nas próximas etapas.

---

## 📦 Workspaces

- `@buscapro/web` — front Next.js
- `@buscapro/api` — back Express
- `@buscapro/ui` — UI compartilhada
- `@buscapro/types` — tipos compartilhados
- `@buscapro/eslint-config` — configs ESLint reutilizáveis
- `@buscapro/tsconfig` — tsconfigs base reutilizáveis

Para usar uma dep interna em outro pacote: `"@buscapro/types": "workspace:*"`.

---

## 🛣️ Próximos passos

1. Modelar entidades de domínio no `schema.prisma`
2. Implementar autenticação
3. Implementar módulos da API (providers, services, bookings, …)
4. Implementar telas no Next.js
