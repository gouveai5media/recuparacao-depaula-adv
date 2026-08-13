# Grupo De Paula — Recuperação Tributária

Landing page institucional para o serviço de diagnóstico e recuperação tributária do Grupo De Paula.

## Principais recursos

- layout premium, responsivo e acessível;
- conteúdo informativo sobre revisão fiscal, créditos tributários e PGFN;
- formulário de triagem integrado ao Supabase;
- políticas RLS com permissão pública somente para inserção de leads;
- contato direcionado ao WhatsApp sem exibir o número no HTML da página;
- rotas de API com validação de dados e proteção simples contra spam.

## Tecnologias

- Next.js 16
- React 19
- TypeScript
- Vinext / Cloudflare Workers
- Supabase Postgres

## Configuração

Copie `.env.example` para `.env` e preencha:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key
WHATSAPP_NUMBER=5511000000000
```

O número de WhatsApp deve ser configurado somente no ambiente do servidor. Não use prefixo `NEXT_PUBLIC_` nessa variável.

## Desenvolvimento

```bash
npm ci
npm run dev
```

## Validação

```bash
npm run lint
npm run build
```

## Observação jurídica

O conteúdo é informativo. A existência, o valor e a forma de aproveitamento de créditos dependem da análise técnica e documental de cada empresa.
