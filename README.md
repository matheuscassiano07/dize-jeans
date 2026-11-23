# Site DIZE Jeans

Site estático, sem dependências: abre direto no navegador e funciona em qualquer hospedagem de arquivos (Hostinger, Netlify, Vercel, Cloudflare Pages, GitHub Pages).

```
index.html            página principal (todo o conteúdo, SEO e dados estruturados)
404.html              página de erro
llms.txt              resumo da marca para ChatGPT, Claude, Perplexity, Gemini etc.
robots.txt            libera buscadores e robôs de IA + aponta o sitemap
sitemap.xml           mapa do site para o Google/Bing
site.webmanifest      ícone e cor quando o site é salvo no celular
assets/css/style.css  visual e animações
assets/js/main.js     catálogo, sacola → WhatsApp, mapa, trena de tamanhos, animações
assets/img/           logo, imagem de compartilhamento, ícones e fotos dos produtos
```

## 1. Antes de publicar: troque o domínio

O site usa `https://dizejeans.com.br/` como endereço provisório. Se o domínio for outro, use "Localizar e substituir" no editor em **todos** estes arquivos:

- `index.html` (canonical, Open Graph e JSON-LD)
- `robots.txt`, `sitemap.xml`, `llms.txt`

## 2. Produtos do catálogo

Cada peça é um `<article class="produto">` dentro de `#catalogo` no `index.html`:

```html
<article class="produto" id="calca-wide-leg"
  data-id="calca-wide-leg"          ← identificador único, sem espaço
  data-nome="Calça Wide Leg"        ← nome que vai para a mensagem do WhatsApp
  data-cat="calcas"                 ← calcas | jaquetas | bermudas  (+ "black" se tiver Black Jeans)
  data-fit="wide"                   ← desenho: skinny, reta, wide, flare, mom, cargo, bermuda, short, jaqueta, jaqueta-over
  data-lavagens="claro,medio,escuro" ← claro, medio, escuro, black
  data-foto="assets/img/produtos/calca-wide-leg.webp">  ← opcional
```

- **Foto real:** coloque a imagem em `assets/img/produtos/` (de preferência `.webp`, 800×1000 px, fundo neutro) e adicione `data-foto`. Sem `data-foto`, o site desenha a peça em SVG na cor da lavagem.
- **Tamanhos:** o padrão é 36 ao 56. Para outra grade, use `data-tamanhos="P,M,G,GG"`.
- Ao criar ou remover peça, atualize também a lista `hasOfferCatalog` no JSON-LD do `<head>`. É ela que o Google e as IAs leem.
- Os filtros e os números nos botões se atualizam sozinhos.

## 3. Cidades atendidas

As cidades aparecem em quatro lugares. Mantenha os quatro iguais:

1. `index.html`: listas `data-lista-cidades="vale"` e `"litoral"` (seção `#onde-atendemos`)
2. `index.html`: `areaServed` no JSON-LD e a pergunta "Em quais cidades…" no FAQ (HTML e JSON-LD)
3. `assets/js/main.js`: array `CIDADES` (nome, longitude, latitude, região, lado do rótulo `d`/`e`/`c`), que desenha os pinos do mapa
4. `llms.txt`: seção "Onde atende"

## 4. WhatsApp e Instagram

- Número: constante `ZAP` em `main.js` e os links `wa.me/5512983014355` no `index.html` e no `404.html`.
- Posts do Instagram: na seção `#instagram`, cada `<a class="post" data-post="…">` aponta para um post. Troque os links pelos posts mais recentes. Os embeds oficiais só carregam quando o visitante toca em "Carregar os posts aqui na página", para não pesar o site.

## 5. Publicar

1. Envie a pasta inteira para a raiz do domínio, de forma que `index.html`, `robots.txt` e `llms.txt` fiquem em `https://seudominio/`.
2. Configure `404.html` como página de erro. Netlify, Cloudflare Pages e GitHub Pages fazem isso sozinhos; na Hostinger, use `.htaccess` com `ErrorDocument 404 /404.html`.
3. Cadastre o site no [Google Search Console](https://search.google.com/search-console) e no [Bing Webmaster Tools](https://www.bing.com/webmasters), e envie o `sitemap.xml`. O Bing também alimenta o ChatGPT e o Copilot.
4. Crie ou atualize o **Perfil da Empresa no Google** com o mesmo nome, telefone e cidades do site. Esse perfil pesa muito nas buscas locais ("calça jeans em Taubaté").
5. Coloque o link do site na bio do Instagram.
6. Teste o resultado em [Rich Results Test](https://search.google.com/test/rich-results) e [PageSpeed Insights](https://pagespeed.web.dev/).

## Notas

- A sacola fica salva no navegador do cliente (localStorage). Nenhum dado é enviado a servidor: o pedido sai como mensagem pronta no WhatsApp.
- Quem usa "reduzir movimento" no celular ou no computador vê o site sem as animações.
- Para medir cliques no WhatsApp, instale o Google Tag Manager. O site já envia o evento `clique_whatsapp` para o `dataLayer`.
