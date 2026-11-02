# Investigação: Falha nas ferramentas de download de vídeo

## Problemas identificados

### 1. **Variáveis de ambiente ausentes**
As seguintes variáveis obrigatórias não estão configuradas:
- `UDC_FASTSAVER_API_KEY` - chave da API FastSaver
- `LOVABLE_API_KEY` - chave do gateway Lovable
- `VIDEO_DOWNLOAD_SIGNING_KEY` - chave para assinar tickets de download

**Impacto**: A função `prepareVideo` retorna imediatamente:
```typescript
if (!key || !gatewayKey || !signingKey)
  return { ok: false, error: "Serviço de download não configurado." };
```

### 2. **Conta Lovable com 0 créditos**
Mesmo com as chaves configuradas, o serviço FastSaver via gateway Lovable requer créditos.

**Impacto**: Mesmo que as chaves sejam configuradas, as requisições falharão com erro de crédito.

### 3. **allowedMediaUrl não inclui domínios do YouTube**
Em `src/lib/video-download.ts`, a função `allowedMediaUrl` valida apenas:
- `api.fastsaver.io`
- `drogon.fastsaver.io`
- CDNs do Instagram: `cdninstagram.com`, `fbcdn.net`
- CDNs do TikTok: `tiktokcdn.com`, `tiktokcdn-us.com`, etc.

**Faltam**: domínios do YouTube como `googlevideo.com`, `*.googlevideo.com`

**Impacto**: Mesmo que o FastSaver retorne URLs do YouTube, elas seriam rejeitadas no `mediaFiles()`.

### 4. **Teste ao vivo**
```bash
# Tentativa de download via site (página retorna HTML, não API):
curl -X POST https://i-tools.shop/baixar-video-youtube \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.youtube.com/watch?v=dQw4w9WgXcQ","quality":"720p","authorized":true,"platform":"youtube"}'
# Resultado: HTTP 200 com HTML da página (esperado, pois é uma rota de página, não API)
```

A função real é uma server function do TanStack Start que seria chamada via `/_server` endpoint.

## Causa raiz por ferramenta

### YouTube
- ❌ **Serviço não configurado**: faltam variáveis de ambiente
- ❌ **Sem créditos**: conta Lovable com 0 créditos
- ❌ **URLs bloqueadas**: allowedMediaUrl não aceita googlevideo.com

**Erro exato**: "Serviço de download não configurado."

### TikTok
- ❌ **Serviço não configurado**: faltam variáveis de ambiente
- ❌ **Sem créditos**: conta Lovable com 0 créditos
- ✅ **URLs permitidas**: CDNs do TikTok já estão na allowlist

**Erro exato**: "Serviço de download não configurado."

### Instagram
- ❌ **Serviço não configurado**: faltam variáveis de ambiente
- ❌ **Sem créditos**: conta Lovable com 0 créditos
- ✅ **URLs permitidas**: CDNs do Instagram já estão na allowlist

**Erro exato**: "Serviço de download não configurado."

## Soluções propostas

### Opção A: Corrigir FastSaver (requer ação do Vinicius)
1. Adicionar variáveis ao Cloudflare Workers:
   - `UDC_FASTSAVER_API_KEY`
   - `LOVABLE_API_KEY`
   - `VIDEO_DOWNLOAD_SIGNING_KEY`
2. Adicionar créditos na conta Lovable
3. Adicionar domínios do YouTube à allowlist

**Custo**: Depende do plano FastSaver via Lovable
**Risco**: Violação dos Termos de Uso do YouTube/TikTok/Instagram

### Opção B: Implementar alternativa gratuita com Cobalt API (RECOMENDADO)
Usar a API pública do Cobalt (https://cobalt.tools):
- ✅ Gratuito e open-source
- ✅ Suporta YouTube, TikTok, Instagram e outras plataformas
- ✅ Sem cadastro ou pagamento
- ✅ API REST simples
- ⚠️ Mesmos riscos de ToS das plataformas

Implementação:
1. Adicionar fallback para Cobalt quando FastSaver não estiver configurado
2. Adicionar domínios do Cobalt à allowlist
3. Configurar instância Cobalt via variável de ambiente (opcional)

**Custo**: R$ 0,00
**Configuração necessária**: Opcional - `COBALT_API_URL` (padrão: https://api.cobalt.tools)
