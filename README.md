# Sereno Psicologia — Site

Landing page para a clínica de psicologia "Sereno", originalmente prototipada no Claude Design e reorganizada aqui como um projeto estático comum, sem dependências proprietárias.

## Estrutura

```
sereno-site/
├── index.html        → marcação da página (todas as seções)
├── css/style.css      → resets, fontes, keyframes de animação
├── js/main.js         → interações (hover, accordion FAQ, parallax, scroll reveal)
└── README.md
```

## O que mudou em relação ao export do Claude Design

- Removido o wrapper `<x-dc>`/`<helmet>` e o `support.js` (runtime interno da ferramenta).
- Removidos os atributos `ref="{{ ... }}"`, `onClick="{{ ... }}"` etc. — substituídos por atributos `data-*` simples (`data-cta`, `data-fillbtn`, `data-faq-toggle`...) lidos pelo `js/main.js`.
- A classe `DCLogic`/`renderVals` virou um único `DOMContentLoaded` com `addEventListener` padrão.
- O reveal-on-scroll, que no export usava polling via `requestAnimationFrame` ("IO é pouco confiável no host da ferramenta"), agora usa `IntersectionObserver`, mais leve e nativo do browser.
- CSS global (resets, `@keyframes`, fontes) foi extraído para `css/style.css`. Os estilos específicos de cada seção permanecem inline, como no design original — dá pra extrair para classes CSS depois, se o projeto crescer.

## Como rodar

É um site estático puro — não tem build step. Basta servir a pasta:

```bash
cd sereno-site
python3 -m http.server 8000
# depois abra http://localhost:8000
```

Ou simplesmente abra `index.html` direto no navegador.

## Próximos passos sugeridos

- Trocar os placeholders de retrato (os blocos com texto "portrait · 4:5") por fotos reais.
- Conectar o link "Book a first conversation" a um formulário de contato ou agenda real (hoje é só uma âncora `#invitation`/`#top`).
- Traduzir o conteúdo para português, se o público-alvo for falante de português (o texto atual ficou em inglês, vindo do protótipo original).
- Se o site crescer (mais páginas, formulário com backend), vale migrar para um framework leve (Astro, Next.js, etc.) — a estrutura atual já está pronta pra virar componentes.
