# Next.js Workspace

Template base para iniciar projetos Next.js com stack padronizada, qualidade de código automatizada e pipeline de CI/CD pronto para uso.

---

## Stack

| Ferramenta   | Versão           | Função                             |
| ------------ | ---------------- | ---------------------------------- |
| Next.js      | 16.1.6           | Framework React com App Router     |
| React        | 19.2.3           | UI                                 |
| Tailwind CSS | v4               | Estilização utility-first          |
| TypeScript   | v5               | Tipagem estática                   |
| ESLint       | v9 (Flat Config) | Lint com regras de a11y em `error` |
| Prettier     | v3               | Formatação automática              |
| Shadcn/ui    | latest           | Componentes acessíveis (opcional)  |
| Husky        | v9               | Git hooks                          |
| Commitlint   | latest           | Commits semânticos obrigatórios    |
| Zod + t3-env | latest           | Variáveis de ambiente tipadas      |
| Vitest       | v4               | Testes unitários e de integração   |
| Playwright   | latest           | Testes E2E                         |

---

## O que está configurado

**Qualidade de código**

- Prettier rodando no save e no pre-commit
- ESLint com `jsx-a11y` elevado para `error` — violações de acessibilidade bloqueiam commit
- `lint:ci` com `--max-warnings=0` para pipelines

**Git**

- Husky com pre-commit rodando lint-staged
- Commitlint com Conventional Commits obrigatório
- Formato: `tipo(escopo): descrição` — ex: `feat: add auth flow`

**Ambiente**

- Variáveis de ambiente validadas em build-time via Zod
- Build falha imediatamente se variável obrigatória estiver ausente
- `.env.example` como referência para novos devs

**Testes**

- Vitest para unitários e integração — passa sem testes ainda (`--passWithNoTests`)
- Playwright para E2E — job condicional no CI, só roda se existirem arquivos de teste

**CI/CD**

- GitHub Actions com dois jobs: `Lint, Test & Build` e `E2E Tests`
- E2E só roda após o CI principal passar
- Branch `main` protegida por ruleset — merge exige PR com checks passando

---

## Como usar

### Clonar e instalar

```bash
git clone https://github.com/natan-fx/nextjs-workspace.git nome-do-projeto
cd nome-do-projeto
npm install
```

### Rodar em desenvolvimento

```bash
npm run dev
```

### Scripts disponíveis

| Script                  | O que faz                         |
| ----------------------- | --------------------------------- |
| `npm run dev`           | Servidor de desenvolvimento       |
| `npm run build`         | Build de produção                 |
| `npm run lint`          | ESLint                            |
| `npm run lint:fix`      | ESLint com auto-fix               |
| `npm run lint:ci`       | ESLint com `--max-warnings=0`     |
| `npm run format`        | Prettier em todos os arquivos     |
| `npm run format:check`  | Verifica formatação sem alterar   |
| `npm run test`          | Vitest (unitários + integração)   |
| `npm run test:watch`    | Vitest em modo watch              |
| `npm run test:coverage` | Vitest com relatório de cobertura |
| `npm run test:e2e`      | Playwright (E2E)                  |
| `npm run test:e2e:ui`   | Playwright com interface visual   |

---

## Estrutura de pastas

```
.
├── .github/workflows/    # CI pipeline
├── .husky/               # Git hooks
├── .vscode/              # Configurações do editor
├── app/                  # App Router do Next.js
├── components/
│   ├── icons/
│   ├── layout/
│   ├── providers/        # ThemeProvider
│   └── sections/
├── data/                 # Configurações estáticas (site-config)
├── hooks/                # Custom hooks
├── lib/                  # Utilitários e env.ts
├── public/images/
├── tests/
│   ├── e2e/              # Playwright
│   ├── integration/      # Testing Library
│   └── unit/             # Vitest
└── types/                # Tipos globais
```

---

## Configuração em novo projeto

Após clonar, antes de começar:

1. Renomeie o projeto no `package.json` (`"name"`)
2. Atualize `data/site-config.ts` com os dados do projeto
3. Atualize `app/layout.tsx` com título e descrição corretos
4. Adicione as variáveis de ambiente em `lib/env.ts` e `.env.local`
5. Atualize `.env.example` com as novas variáveis
6. Conecte ao repositório do novo projeto:

```bash
git remote remove origin
git remote add origin https://github.com/seu-usuario/novo-projeto.git
git branch -M main
git push -u origin main
```

---

## Documentação completa

O processo de configuração completo — cada decisão, comando e validação — está documentado em [`WORKSPACE.md`](./WORKSPACE.md).
