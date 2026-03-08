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
