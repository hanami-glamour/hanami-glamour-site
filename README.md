# Hanami Glamour

Projeto Next.js pronto para publicar na Vercel.

## Como rodar localmente

```bash
npm install
npm run dev
```

## Publicar na Vercel

1. Crie uma conta na Vercel.
2. Envie esta pasta para um repositório no GitHub.
3. Na Vercel, clique em **Add New Project**.
4. Importe o repositório.
5. Clique em **Deploy**.
6. Depois do deploy, em **Settings > Domains**, adicione:
   - `hanamiglamour.com.br`
   - `www.hanamiglamour.com.br`

## Logo

O logo está em:

`public/logo-hanami-glamour.jpeg`

Se quiser trocar, substitua esse arquivo mantendo o mesmo nome.

## Observação importante

Este pacote está pronto visualmente para publicação, mas o painel administrativo ainda funciona em memória local no navegador.
Para produção real com login seguro, banco de dados e pedidos salvos, a próxima etapa é integrar Supabase e um gateway de pagamento.
