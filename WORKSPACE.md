# Workspace — Next.js + Tailwind CSS v4 + ESLint + Prettier + Shadcn

## Versões (atualizado: 07/03/2026)

- Next.js: 16.1.6
- React: 19.2.3
- Tailwind CSS: v4 (já incluso no `create-next-app`)
- ESLint: v9 (Flat Config)
- Shadcn/ui: latest

---

## O que o `create-next-app` já entrega

O comando de criação já inclui, sem instalação adicional:

- `tailwindcss ^4`
- `@tailwindcss/postcss ^4`
- `postcss` configurado via `postcss.config.mjs`
- `eslint ^9` com Flat Config (`eslint.config.mjs`)
- `eslint-config-next`
- TypeScript + tipos do React

**Não reinstale nem recrie esses arquivos.**

---

## 1. Criação do Projeto

No VS Code, abra o terminal (_Ctrl + '_)

```bash
npx create-next-app@latest . --yes --empty
```

> `--empty` remove o boilerplate da página inicial — gera um projeto limpo sem estilos, imagens ou conteúdo de exemplo.

**Observação:** Para projetos com Shadcn, use [shadcn/create](https://ui.shadcn.com/create) para iniciar já configurado com temas personalizados e bibliotecas de ícones.

---

## 2. `.gitignore`

Substitua o `.gitignore` gerado pelo conteúdo abaixo.
O padrão do Next.js é enxuto — este adiciona cobertura para editor, testes e variáveis de ambiente:

```gitignore
# DEPENDÊNCIAS
/node_modules
/.pnp
.pnp.*
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/versions

# NEXT.JS & BUILD
/.next/
/out/
/build/
/dist/

# TESTES & COVERAGE
/coverage
/playwright-report
/test-results
/.vitest-cache

# DIVERSOS / SISTEMA OPERACIONAL
.DS_Store
*.pem
Thumbs.db

# LOGS & DEBUG
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
.debug

# VARIÁVEIS DE AMBIENTE (CRÍTICO)
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
*.env
*.env.*

# EDITOR (VS CODE)
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json

# VERCEL & TYPESCRIPT
.vercel
*.tsbuildinfo
next-env.d.ts
```

---

## 3. `.prettierignore`

Crie o arquivo `.prettierignore` na raiz:

```
.next
dist
build
node_modules
pnpm-lock.yaml
package-lock.json
yarn.lock
public
.husky
coverage
playwright-report
test-results
```

---

## 4. Limpeza Inicial

Vá em `app/globals.css`, apague tudo e deixe apenas:

```css
@import 'tailwindcss';
```

> **Atenção:** Esta limpeza acontece agora, antes do Shadcn. O Shadcn (Passo 15) vai reescrever este arquivo com suas próprias variáveis de tema. O Passo 18 instrui como adicionar as variáveis de fonte **após** o Shadcn ter rodado — não substitua o que ele gerou.

---

## 5. Criação das Pastas do Projeto

**PowerShell (Windows):**

```powershell
@('components\layout','components\sections','components\icons','components\providers','lib','hooks','data','types','public\images') | ForEach-Object { New-Item -ItemType Directory -Force -Path $_ | Out-Null }
```

**bash/zsh (Mac/Linux):**

```bash
mkdir -p components/{layout,sections,icons,providers} lib hooks data types public/images
```

> `lib/` e `hooks/` são necessárias — o `importOrder` do `.prettierrc` e os paths do `tsconfig.json` já as referenciam. O `-Force` no PowerShell e o `-p` no bash ignoram pastas que já existem — sem erros se já existirem.

---

## 6. Instalação do Prettier e Plugins

```bash
npm install -D prettier eslint-config-prettier prettier-plugin-tailwindcss @trivago/prettier-plugin-sort-imports
```

> `eslint-plugin-jsx-a11y` **não precisa ser instalado** — o `eslint-config-next` já o inclui internamente.

---

## 6. Instalação do Husky e Lint-Staged

```bash
npm install -D husky lint-staged
```

---

## 7. Inicialização do Husky

```bash
npx husky init
```

---

## 8. Configuração do Husky — Pre-commit

Abra o arquivo `.husky/pre-commit` e substitua o conteúdo por:

```
npx lint-staged
```

---

## 9. Configuração do Husky — Commit-msg

Crie o arquivo `.husky/commit-msg`:

```
npx --no -- commitlint --edit $1
```

> Este hook valida a mensagem de commit contra as regras do Commitlint (configurado no Passo 13).

---

## 10. `.prettierrc`

Crie o arquivo `.prettierrc` na raiz:

```json
{
  "arrowParens": "always",
  "endOfLine": "lf",
  "printWidth": 100,
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "all",
  "plugins": ["@trivago/prettier-plugin-sort-imports", "prettier-plugin-tailwindcss"],
  "importOrder": [
    "^react$",
    "^next",
    "<THIRD_PARTY_MODULES>",
    "^@/components/(.*)$",
    "^@/lib/(.*)$",
    "^@/hooks/(.*)$",
    "^[./]"
  ],
  "importOrderSeparation": true,
  "importOrderSortSpecifiers": true
}
```

> A ordem dos plugins é obrigatória. `sort-imports` deve vir antes de `prettier-plugin-tailwindcss`.

---

## 11. `eslint.config.mjs`

O arquivo gerado pelo `create-next-app` já usa Flat Config corretamente.
Adicione `prettier` para desativar regras conflitantes e eleve as regras de a11y para `error`:

> **Por que elevar a11y para `error`?** O `eslint-config-next` já inclui `jsx-a11y` em modo `warn` — violações passam silenciosamente. Elevando para `error`, qualquer violação bloqueia o commit.
>
> **Nota:** Não redeclare o plugin `jsx-a11y`. O `eslint-config-next` já o registra internamente — redeclará-lo causa erro no ESLint 9. Declare apenas as `rules`.

```js
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier';
import { defineConfig, globalIgnores } from 'eslint/config';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  {
    rules: {
      // Acessibilidade — warn → error
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/anchor-has-content': 'error',
      'jsx-a11y/anchor-is-valid': 'error',
      'jsx-a11y/aria-props': 'error',
      'jsx-a11y/aria-proptypes': 'error',
      'jsx-a11y/aria-role': 'error',
      'jsx-a11y/aria-unsupported-elements': 'error',
      'jsx-a11y/heading-has-content': 'error',
      'jsx-a11y/html-has-lang': 'error',
      'jsx-a11y/iframe-has-title': 'error',
      'jsx-a11y/img-redundant-alt': 'error',
      'jsx-a11y/interactive-supports-focus': 'error',
      'jsx-a11y/label-has-associated-control': 'error',
      'jsx-a11y/no-access-key': 'error',
      'jsx-a11y/no-autofocus': 'warn',
      'jsx-a11y/no-noninteractive-element-interactions': 'error',
      'jsx-a11y/no-redundant-roles': 'error',
      'jsx-a11y/role-has-required-aria-props': 'error',
      'jsx-a11y/role-supports-aria-props': 'error',
      'jsx-a11y/tabindex-no-positive': 'error',

      // TypeScript — boas práticas
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-unused-expressions': 'error',

      // React — boas práticas
      'react/no-unused-prop-types': 'error',
      'react/no-array-index-key': 'error',
      'react-hooks/exhaustive-deps': 'error',

      // JavaScript — boas práticas
      'prefer-const': 'error',
      'no-var': 'error',
      'no-console': 'warn',
    },
  },
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
]);

export default eslintConfig;
```

---

## 12. `tsconfig.json`

Abra o `tsconfig.json` gerado e substitua tudo por:

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts",
    "**/*.mts"
  ],
  "exclude": ["node_modules"]
}
```

**O que cada flag extra faz:**

| Flag                         | Comportamento                                                      |
| ---------------------------- | ------------------------------------------------------------------ |
| `noUncheckedIndexedAccess`   | `array[0]` retorna `T \| undefined` — força checagem antes de usar |
| `exactOptionalPropertyTypes` | `undefined` explícito é diferente de propriedade ausente           |
| `noImplicitReturns`          | Toda função deve retornar em todos os caminhos de código           |
| `noFallthroughCasesInSwitch` | Todo `case` precisa de `break`, `return` ou `throw`                |

---

## 13. Instalação do Commitlint

```bash
npm install -D @commitlint/cli @commitlint/config-conventional
```

---

## 13. `commitlint.config.ts`

Crie o arquivo `commitlint.config.ts` na raiz:

```ts
import type { UserConfig } from '@commitlint/types';

const config: UserConfig = {
  extends: ['@commitlint/config-conventional'],
};

export default config;
```

**Formato obrigatório de commits:**

```
tipo(escopo opcional): descrição curta

Exemplos válidos:
  feat: add authentication flow
  fix(api): handle null response from endpoint
  chore: update dependencies
  docs: add setup instructions
  refactor(auth): simplify token validation
  test: add unit tests for useAuth hook
```

**Tipos aceitos:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `ci`, `build`, `revert`

---

## 14. Instalação do Zod + Env tipado

```bash
npm install zod @t3-oss/env-nextjs
```

Crie o arquivo `lib/env.ts`:

```ts
import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(['development', 'test', 'production']),
    // Adicione variáveis server-side aqui
    // DATABASE_URL: z.string().url(),
  },
  client: {
    // Variáveis client-side devem começar com NEXT_PUBLIC_
    // NEXT_PUBLIC_API_URL: z.string().url(),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    // Espelhe cada variável declarada acima
  },
});
```

> Se uma variável obrigatória estiver ausente, o **build falha imediatamente** com mensagem clara — não em runtime.

Crie também o arquivo `.env.example` na raiz (commitado no repositório como referência):

```env
# Ambiente
NODE_ENV=development

# Adicione aqui todas as variáveis necessárias como referência
# DATABASE_URL=
# NEXT_PUBLIC_API_URL=
```

---

## 15. Inicialização do Shadcn

> **Não vai usar Shadcn?** Pule para o Passo 16. No Passo 18, o bloco `@theme inline {` não vai existir — você precisará criá-lo manualmente conforme indicado lá.

```bash
npx shadcn@latest init
```

Durante o `init`, estas perguntas afetam diretamente o restante do setup:

- **"Which color would you like to use as base color?"** — escolha sua preferência. Isso define as variáveis CSS no `globals.css`.
- **"Would you like to use CSS variables for colors?"** — responda **Yes**. É o padrão que o Passo 18 assume.
- **"Would you like to install `next-themes`?"** — se aparecer, responda **Yes** e **pule o Passo 16**.
- **"Would you like to add a `ThemeProvider`?"** — se aparecer, responda **Yes** e **pule o Passo 17**.

> O Shadcn vai reescrever o `globals.css` com variáveis de cor e tema. Isso é esperado — não reverta.

---

## 16. Instalação do Gerenciador de Tema

> **Pule este passo** se o Shadcn já instalou o `next-themes` durante o `init`.

```bash
npm install next-themes
```

---

## 17. Theme Provider

> **Pule este passo** se o Shadcn já gerou o `theme-provider.tsx` durante o `init`.

Crie o arquivo `components/providers/theme-provider.tsx`:

```tsx
'use client';

import * as React from 'react';

import { ThemeProvider as NextThemesProvider } from 'next-themes';

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
```

---

## 18. `app/globals.css`

**Se usou o Shadcn:** ele reescreveu o `globals.css`. Não substitua o arquivo — apenas adicione as variáveis de fonte dentro do bloco `@theme inline {` que ele gerou:

```css
@theme inline {
  /* variáveis geradas pelo Shadcn ficam aqui — não remova */

  /* adicione no final do bloco: */
  --font-sans: var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-geist-mono), ui-monospace, monospace;
}
```

**Se não usou o Shadcn:** o bloco não existe. Crie manualmente:

```css
@import 'tailwindcss';

@theme inline {
  --font-sans: var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-geist-mono), ui-monospace, monospace;
}
```

---

## 19. `app/layout.tsx`

Substitua tudo por:

```tsx
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { ThemeProvider } from '@/components/providers/theme-provider';

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Project Title',
  description: 'Project description',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

---

## 20. `data/site-config.ts`

Crie o arquivo `data/site-config.ts` e ajuste os valores para o projeto:

```ts
export const siteConfig = {
  name: 'Project Name',
  title: 'Project Title',
  description: 'Project description',
  url: 'https://example.com',
  links: {
    // Adicione os links relevantes para o projeto
  },
};

export type SiteConfig = typeof siteConfig;
```

---

## 21. Instalação do Vitest + Testing Library + Playwright

```bash
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event @playwright/test
```

---

## 22. `vitest.config.ts`

Crie o arquivo `vitest.config.ts` na raiz:

```ts
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    include: ['**/*.{test,spec}.{ts,tsx}'],
    exclude: ['**/node_modules/**', '**/e2e/**', '**/.next/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'tests/setup.ts', '**/*.config.*', '**/e2e/**'],
    },
  },
  resolve: {
    alias: {
      '@': new URL('./', import.meta.url).pathname,
    },
  },
});
```

---

## 23. `playwright.config.ts`

Crie o arquivo `playwright.config.ts` na raiz:

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  ...(process.env.CI ? { workers: 1 } : {}),
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

---

## 24. Estrutura de Testes

Crie as pastas e o arquivo de setup:

**PowerShell (Windows):**

```powershell
mkdir tests\unit, tests\integration, tests\e2e
```

**bash/zsh (Mac/Linux):**

```bash
mkdir -p tests/{unit,integration,e2e}
```

Crie o arquivo `tests/setup.ts`:

```ts
import '@testing-library/jest-dom';
```

---

## 26. `package.json`

Substitua o bloco `"scripts"` e adicione `"lint-staged"` antes da última `}`:

**Scripts:**

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint .",
  "lint:fix": "eslint . --fix",
  "lint:ci": "eslint . --max-warnings=0",
  "format": "prettier --write .",
  "format:check": "prettier --check .",
  "typecheck": "tsc --noEmit",
  "test": "vitest run --passWithNoTests",
  "test:watch": "vitest",
  "test:coverage": "vitest run --coverage --passWithNoTests",
  "test:e2e": "playwright test",
  "test:e2e:ui": "playwright test --ui",
  "prepare": "husky"
},
```

**lint-staged:**

```json
"lint-staged": {
  "*.{ts,tsx,js,jsx}": [
    "eslint . --fix",
    "prettier --write"
  ],
  "*.{json,css,md}": [
    "prettier --write"
  ]
}
```

> `next lint` foi removido no Next.js 16. O lint agora roda via ESLint diretamente.
> `lint:ci` usa `--max-warnings=0` — qualquer warning vira erro no pipeline.

---

## 27. Configuração do VS Code

**`.vscode/settings.json`**

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "editor.rulers": [100],
  "css.validate": false,
  "tailwindCSS.emmetCompletions": true,
  "vitest.enable": true
}
```

**`.vscode/extensions.json`**

```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "vitest.explorer",
    "ms-playwright.playwright"
  ]
}
```

---

## 28. GitHub Actions — CI Pipeline

Crie a estrutura de pastas:

**PowerShell (Windows):**

```powershell
mkdir .github\workflows
```

**bash/zsh (Mac/Linux):**

```bash
mkdir -p .github/workflows
```

Crie o arquivo `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  ci:
    name: Lint, Test & Build
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint:ci

      - name: Format check
        run: npm run format:check

      - name: Type check
        run: npx tsc --noEmit

      - name: Unit & Integration tests
        run: npm run test

      - name: Build
        run: npm run build

  e2e:
    name: E2E Tests
    runs-on: ubuntu-latest
    needs: ci

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Check for E2E tests
        id: check-tests
        run: |
          if find tests/e2e -name "*.spec.ts" -o -name "*.test.ts" | grep -q .; then
            echo "has_tests=true" >> $GITHUB_OUTPUT
          else
            echo "has_tests=false" >> $GITHUB_OUTPUT
          fi

      - name: Setup Node.js
        if: steps.check-tests.outputs.has_tests == 'true'
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        if: steps.check-tests.outputs.has_tests == 'true'
        run: npm ci

      - name: Install Playwright browsers
        if: steps.check-tests.outputs.has_tests == 'true'
        run: npx playwright install --with-deps

      - name: Run E2E tests
        if: steps.check-tests.outputs.has_tests == 'true'
        run: npm run test:e2e

      - name: Upload Playwright report
        uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 7
```

> O job `e2e` só roda após o `ci` passar — não desperdiça minutos de CI rodando E2E se lint, testes unitários ou build já falharam. O relatório do Playwright é salvo como artefato apenas em caso de falha.

---

## 29. Verificação Final

Execute cada comando na sequência. Todos devem passar sem erros antes do primeiro commit.

**1. Aplicação sobe:**

```bash
npm run dev
```

Acesse `http://localhost:3000`. Zero erros no terminal.

**2. Lint sem violações:**

```bash
npm run lint
```

Saída esperada: zero erros ou warnings.

**3. Formatação consistente:**

```bash
npm run format:check
```

Saída esperada: todos os arquivos já formatados.

**4. Type check:**

```bash
npm run typecheck
```

Saída esperada: zero erros de tipo.

**5. Testes passando:**

```bash
npm run test
```

Saída esperada: zero falhas (sem testes ainda = passa por padrão).

**6. Build limpo:**

```bash
npm run build
```

Saída esperada: build sem erros — valida env, tipos e bundle.

**7. Commit de teste — valida Husky + Commitlint + lint-staged:**

```bash
git add .
git commit -m "chore: initial project setup"
```

O pre-commit deve disparar o lint-staged. O commit-msg deve validar o formato. Se um dos dois falhar, revise os Passos 8 e 9.

---

## 30. Configuração do GitHub

### 30.1 Criar o repositório

1. Acesse [github.com/new](https://github.com/new)
2. Preencha o nome do repositório
3. Deixe **privado** por padrão — mude para público apenas se for intencional
4. **Não marque** nenhuma opção de inicialização (README, .gitignore, license) — o projeto já tem tudo isso localmente
5. Clique em **Create repository**

Conecte o repositório local ao remoto:

```bash
git remote add origin https://github.com/seu-usuario/nome-do-repositorio.git
git branch -M main
git push -u origin main
```

---

### 30.2 Proteger a branch `main`

Sem essa configuração, qualquer pessoa pode fazer push direto para `main` ignorando o CI inteiro.

**Caminho:** Repositório → **Settings** → **Rules** → **Rulesets** → **New ruleset** → **New branch ruleset**

**Preencha:**

- **Ruleset name:** `main protection`
- **Enforcement status:** `Active`
- **Target branches:** clique em **Add target** → **Include by pattern** → digite `main`

**Ative as seguintes regras:**

| Regra                                                              | Configuração                                                             |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| **Restrict creations**                                             | ✅ Ativado                                                               |
| **Restrict deletions**                                             | ✅ Ativado                                                               |
| **Require a pull request before merging**                          | ✅ Ativado                                                               |
| ↳ Required approvals                                               | `0` para projetos solo — mude para `1` ou mais apenas quando houver time |
| ↳ Dismiss stale pull request approvals when new commits are pushed | ✅ Ativado                                                               |
| **Require status checks to pass**                                  | ✅ Ativado                                                               |
| ↳ Require branches to be up to date before merging                 | ✅ Ativado                                                               |
| ↳ Add checks                                                       | Adicione: `Lint, Test & Build` e `E2E Tests`                             |
| **Block force pushes**                                             | ✅ Ativado                                                               |

> **Atenção:** Os checks `Lint, Test & Build` e `E2E Tests` só aparecem para adicionar depois que o CI rodar pelo menos uma vez. Faça o primeiro push, aguarde o pipeline rodar, depois volte aqui para adicioná-los.

Clique em **Create** para salvar.

---

### 30.3 Configurar secrets do repositório (se necessário)

Se o projeto usar variáveis de ambiente sensíveis no CI (tokens de API, credenciais de banco), elas precisam estar como secrets do GitHub — nunca no código.

**Caminho:** Repositório → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

| Secret                | Quando usar                                |
| --------------------- | ------------------------------------------ |
| `DATABASE_URL`        | Se o CI rodar testes que precisam de banco |
| `NEXT_PUBLIC_API_URL` | Se o build precisar de URL de API externa  |

No `ci.yml`, acesse o secret assim:

```yaml
- name: Run tests
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
  run: npm run test
```

> Secrets nunca aparecem em logs do CI — o GitHub os mascara automaticamente.

---

## 31. Configuração da Vercel

### 31.1 Importar o projeto

1. Acesse [vercel.com/new](https://vercel.com/new)
2. Clique em **Import Git Repository**
3. Selecione o repositório criado no Passo 30.1
4. **Framework Preset:** Next.js (detectado automaticamente)
5. **Root Directory:** deixe vazio — o projeto está na raiz
6. **Build Command:** deixe o padrão (`next build`)
7. **Output Directory:** deixe o padrão (`.next`)
8. Não clique em **Deploy** ainda — configure as variáveis de ambiente primeiro

---

### 31.2 Configurar variáveis de ambiente

**Caminho:** Project → **Settings** → **Environment Variables**

Cadastre cada variável declarada no `lib/env.ts`. Para cada uma:

1. Clique em **Add New**
2. Preencha o **Key** (ex: `DATABASE_URL`)
3. Preencha o **Value**
4. Selecione os ambientes onde deve estar disponível:
   - `Production` — branch `main`
   - `Preview` — Pull Requests e outras branches
   - `Development` — ambiente local via `vercel dev`

> **Regra:** Se a variável está em `server` no `lib/env.ts`, cadastre apenas para `Production` e `Preview`. Se está em `client` (prefixo `NEXT_PUBLIC_`), cadastre para os três ambientes.

> O build falha com mensagem clara do Zod se uma variável obrigatória estiver ausente — isso é intencional. Melhor falhar no deploy do que em runtime para o usuário.

---

### 31.3 Conectar domínio personalizado (opcional)

**Caminho:** Project → **Settings** → **Domains** → **Add**

Digite o domínio (ex: `natanfx.com`) e siga as instruções para configurar os registros DNS no seu provedor de domínio. A Vercel fornece os valores exatos dos registros `A` e `CNAME` a configurar.

---

### 31.4 Configurar deploy apenas após CI passar

Por padrão, a Vercel tenta fazer deploy de cada push independentemente do CI. Como o GitHub Actions já cobre lint, testes e build, você não quer deploy de código que não passou por essas verificações.

**Caminho:** Project → **Settings** → **Git** → **Deployment Protection**

Ative **GitHub Deployment Protection** — isso vincula o deploy da Vercel ao status dos checks do GitHub. A Vercel só avança com o deploy após todos os status checks passarem.

> Se a opção não estiver disponível no seu plano, use o **Vercel CLI** diretamente no `ci.yml` — o deploy acontece como último step, após lint, testes e build passarem:

```yaml
- name: Deploy to Vercel
  if: github.ref == 'refs/heads/main'
  run: npx vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
  env:
    VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
    VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
```

Para usar essa alternativa, gere um token em [vercel.com/account/tokens](https://vercel.com/account/tokens) e cadastre `VERCEL_TOKEN`, `VERCEL_ORG_ID` e `VERCEL_PROJECT_ID` como secrets no GitHub (Passo 30.3).

---

### 31.5 Verificação do pipeline completo

Após as configurações do GitHub e Vercel, valide o fluxo completo:

**1.** Crie uma branch nova:

```bash
git checkout -b feat/test-pipeline
```

**2.** Faça uma alteração qualquer (ex: adicione um comentário em qualquer arquivo)

**3.** Commit e push:

```bash
git add .
git commit -m "test: validate full CI/CD pipeline"
git push origin feat/test-pipeline
```

**4.** Abra um Pull Request no GitHub para `main`

**5.** Verifique que os checks aparecem e rodam automaticamente

**6.** Após os checks passarem, faça o merge

**7.** Verifique que o deploy na Vercel dispara automaticamente após o merge

**Fluxo esperado:**

```
Push → GitHub Actions CI → (lint + typecheck + testes + build) → E2E Tests → Merge liberado → Vercel deploy
```

Se qualquer step falhar, o merge fica bloqueado e o deploy não acontece.
