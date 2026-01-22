# Cloudflare Configuration

This project has TWO separate Cloudflare components:

## 1. Cloudflare Pages (This Site)
- Deploys the Next.js blog
- Automatically builds on git push
- No wrangler needed
- Build command: `npm run build`
- Output: `.next/`

## 2. Cloudflare Email Worker (Separate)
- Located in: `cloudflare-worker/`
- Deployed manually via: `cd cloudflare-worker && wrangler deploy`
- Receives emails and triggers GitHub Actions
- NOT deployed by Pages

## Important
Pages should NOT try to deploy the worker!
If you see wrangler errors in Pages builds, remove any "deploy command" in Pages settings.
