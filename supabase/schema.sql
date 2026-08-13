create table if not exists public.recuperacao_depaula_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  nome text not null check (char_length(nome) between 2 and 120),
  empresa text not null check (char_length(empresa) between 2 and 160),
  whatsapp text not null check (char_length(regexp_replace(whatsapp, '[^0-9]', '', 'g')) between 10 and 13),
  regime_tributario text not null check (regime_tributario in ('Lucro Real', 'Lucro Presumido', 'Simples Nacional', 'Não sei informar')),
  faixa_faturamento text not null check (faixa_faturamento in ('Até R$ 500 mil/mês', 'R$ 500 mil a R$ 1 milhão/mês', 'R$ 1 milhão a R$ 5 milhões/mês', 'Acima de R$ 5 milhões/mês', 'Prefiro informar na conversa')),
  interesse text not null default 'Diagnóstico tributário',
  consentimento boolean not null default true check (consentimento = true),
  origem text not null default 'landing_grupo_de_paula',
  status text not null default 'novo' check (status in ('novo', 'em_contato', 'qualificado', 'arquivado'))
);

alter table public.recuperacao_depaula_leads enable row level security;

revoke all on table public.recuperacao_depaula_leads from anon, authenticated;
grant insert on table public.recuperacao_depaula_leads to anon, authenticated;
grant select, insert, update, delete on table public.recuperacao_depaula_leads to service_role;

create policy "public_can_submit_depaula_lead"
on public.recuperacao_depaula_leads
for insert
to anon, authenticated
with check (
  consentimento = true
  and origem = 'landing_grupo_de_paula'
  and status = 'novo'
  and char_length(nome) between 2 and 120
  and char_length(empresa) between 2 and 160
);
