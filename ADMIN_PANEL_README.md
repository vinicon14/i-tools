# Admin Panel - i-Tools

Este projeto possui um painel administrativo completo localizado em `/adm`.

## Setup Inicial

### 1. Configurar Variáveis de Ambiente

No Lovable Dashboard (Cloud Agents > Secrets), adicione as seguintes variáveis:

```bash
ADMIN_USER=admin
ADMIN_PASSWORD_HASH=<hash-gerado-pelo-script>
MONETAG_API_TOKEN=<seu-token-monetag-opcional>
ANALYTICS_SALT=<string-aleatória-para-hash-de-ips>
```

### 2. Gerar Hash da Senha

Execute o script para gerar o hash da senha do administrador:

```bash
node scripts/generate-admin-password.mjs SuaSenhaSecreta123
```

Copie o hash gerado e defina como valor da variável `ADMIN_PASSWORD_HASH`.

### 3. Executar Migração do Banco de Dados

A migração SQL está em `supabase/migrations/20261102000000_create_admin_tables.sql`.

**Opções de execução:**

#### A. Via Supabase Dashboard (Recomendado)
1. Acesse o projeto no Supabase Dashboard
2. Vá em SQL Editor
3. Copie e cole o conteúdo do arquivo de migração
4. Execute a query

#### B. Via Lovable Deployment
O Lovable pode executar migrações automaticamente durante o deploy se configurado corretamente.

### 4. Deploy

Faça push das mudanças para a branch principal:

```bash
git push origin main
```

O Lovable fará o deploy automaticamente.

## Funcionalidades do Painel Admin

### Autenticação e Segurança
- ✅ Login com usuário e senha (credenciais em variáveis de ambiente)
- ✅ Senhas hashadas com scrypt (algoritmo nativo do Node.js)
- ✅ Proteção contra brute-force (rate limiting)
- ✅ Sessões seguras com HttpOnly, Secure e SameSite cookies
- ✅ Expiração automática de sessão (4 horas)
- ✅ Proteção CSRF
- ✅ Middleware de autenticação em todas as rotas admin
- ✅ Rota `/adm` oculta (não aparece em sitemap, bloqueada em robots.txt, noindex)

### Dashboard (`/adm/dashboard`)
- Visitas totais, visitantes únicos, visitas hoje, usuários online em tempo real
- Receita diária e mensal (Monetag)
- Impressões e cliques de anúncios
- Gráfico de visitas nos últimos 30 dias (linha)
- Top 10 ferramentas mais usadas (barras)
- Visitantes por país (pizza)

### Gerenciamento de Ferramentas (`/adm/tools`)
- Lista todas as ferramentas do catálogo
- Estatísticas por ferramenta (visitas, visitantes únicos, usos)
- Toggle para ativar/desativar ferramentas
- Ferramentas desativadas retornam 404 para visitantes públicos

### Monitoramento (`/adm/monitoring`)
- Logs de erros (404, 500, JS errors, erros de ferramentas, falhas de integração)
- Contagem de erros por tipo
- Últimos 100 erros com detalhes

### Filtros Globais (Planejado)
Todos os gráficos e KPIs respeitarão filtros por:
- Período (hoje, ontem, últimos 7/30/90 dias, este mês, mês anterior, personalizado)
- Ferramenta específica
- País
- Tipo de dispositivo
- Origem do tráfico

## Estrutura de Banco de Dados (Supabase)

### Tabelas Criadas

- `admin_users` - Usuários administradores
- `admin_sessions` - Sessões ativas
- `access_events` - Eventos de acesso (pageviews) com IP hasheado
- `usage_events` - Eventos de uso de ferramentas
- `online_users` - Rastreamento de usuários online (heartbeat)
- `geo_stats` - Estatísticas geográficas agregadas
- `monetag_revenue` - Dados de receita do Monetag
- `error_logs` - Logs de erros
- `admin_logs` - Logs de atividade dos administradores
- `tool_config` - Configuração por ferramenta (ativo/inativo)

Todas as tabelas possuem RLS (Row Level Security) ativado e são acessadas exclusivamente via service role key no servidor.

## Coleta de Analytics

### Client-Side
O hook `useAnalytics()` rastreia automaticamente:
- Pageviews (quando a página é montada)
- Heartbeats (a cada 30 segundos para usuários online)
- IPs hasheados com salt diário (LGPD compliant)
- Geolocalização via headers do Cloudflare (`cf-ipcountry`, `cf-ipcity`)
- Tipo de dispositivo detectado por user agent

### Uso

```tsx
import { useAnalytics } from '@/hooks/use-analytics';

function MinhaFerramenta() {
  useAnalytics('minha-ferramenta'); // Passa o slug da ferramenta
  
  return <div>...</div>;
}
```

### Rastreamento de Eventos de Uso

Para rastrear ações específicas (downloads, compartilhamentos, erros):

```tsx
import { trackUsageEvent } from '@/lib/analytics-tracking.functions';

await trackUsageEvent({
  toolSlug: 'comprimir-imagem',
  eventType: 'download',
  metadata: { fileSize: 12345, format: 'jpg' }
});
```

### Rastreamento de Erros

```tsx
import { trackError } from '@/lib/analytics-tracking.functions';

await trackError({
  errorType: 'tool_error',
  pagePath: window.location.pathname,
  toolSlug: 'minha-ferramenta',
  errorMessage: 'Falha ao processar arquivo',
  stackTrace: error.stack,
});
```

## Integração com Monetag

### API Oficial (Recomendado)
Se o Monetag disponibilizar uma API de estatísticas, configure a variável `MONETAG_API_TOKEN` e implemente a integração em `/src/lib/monetag-api.functions.ts`.

### Importação Manual de CSV
Se não houver API, permita que o admin importe relatórios CSV mensais do painel do Monetag.

## Privacidade e LGPD

### Conformidade Implementada
- ✅ IPs nunca armazenados em texto claro (apenas hash SHA256 com salt diário rotativo)
- ✅ Dados agregados e anonimizados
- ✅ Sem cookies de tracking para visitantes (apenas session cookies admin)
- ✅ Geolocalização apenas por país/cidade (não coordenadas precisas)
- ✅ Nota adicionada na política de privacidade sobre analytics anonimizados

### Atualização da Política de Privacidade
Adicione o seguinte parágrafo na seção de coleta de dados da política de privacidade (em todos os 18 idiomas):

**Português:**
> Para melhorar nossos serviços, coletamos estatísticas de uso de forma anônima, incluindo informações sobre páginas visitadas, ferramentas utilizadas e localização aproximada (país/cidade). Seu endereço IP nunca é armazenado de forma identificável e todos os dados são agregados e anonimizados em conformidade com a LGPD.

## Tecnologias Utilizadas

- **Frontend**: React, TanStack Router, Recharts, Tailwind CSS, shadcn/ui
- **Backend**: TanStack Start (SSR), Server Functions
- **Database**: Supabase (PostgreSQL)
- **Auth**: Native Node.js crypto (scrypt)
- **Deploy**: Cloudflare via Nitro (Lovable)

## Comandos Úteis

```bash
# Gerar hash de senha
node scripts/generate-admin-password.mjs SuaSenha123

# Desenvolvimento local
npm run dev

# Build de produção
npm run build

# Testes
npm test
```

## Rotas Admin

- `/adm` - Login
- `/adm/dashboard` - Dashboard principal
- `/adm/tools` - Gerenciamento de ferramentas
- `/adm/monitoring` - Monitoramento de erros
- `/adm/logout` - Logout

## Próximos Passos (Backlog)

- [ ] Implementar filtros globais em todos os gráficos
- [ ] Página de exportação de dados (CSV, PDF)
- [ ] Integração real com API do Monetag
- [ ] Página detalhada por ferramenta
- [ ] Alertas configuráveis (email quando erro crítico)
- [ ] Dashboard de tempo de resposta e uptime
- [ ] Suporte multi-admin (cadastro de novos admins pela UI)
- [ ] Logs de auditoria completos

## Suporte

Para problemas ou dúvidas, consulte a documentação do Lovable ou abra uma issue no repositório.

---

**Segurança**: Nunca compartilhe as variáveis de ambiente `ADMIN_PASSWORD_HASH` ou `MONETAG_API_TOKEN`. Mantenha-as seguras no Lovable Dashboard.
