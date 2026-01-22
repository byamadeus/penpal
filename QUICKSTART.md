# Quick Start Guide

Get your email-powered blog running in 10 minutes!

## Prerequisites
- Custom domain
- GitHub account  
- Cloudflare account

## Setup Steps

### 1. Deploy to GitHub (2 min)
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```

### 2. Cloudflare Pages (2 min)
1. Dashboard → Workers & Pages → Create → Pages → Connect to Git
2. Select your repository
3. Build settings:
   - Framework: Next.js
   - Build command: `npm run build`
   - Build output: `.next`
4. Deploy

### 3. Set GitHub Secret (1 min)
1. Repo → Settings → Secrets → Actions
2. New secret:
   - Name: `EMAIL_SECRET_TOKEN`
   - Value: `my-secret-token-123` (choose your own)

### 4. Deploy Email Worker (3 min)
```bash
cd cloudflare-worker
wrangler login
wrangler secret put EMAIL_SECRET_TOKEN    # Enter same token
wrangler secret put GITHUB_TOKEN          # GitHub PAT with repo scope
wrangler secret put GITHUB_REPO           # username/repo-name
wrangler deploy
```

### 5. Configure Email Routing (2 min)
1. Cloudflare → Email Routing → Enable
2. Create address: `blog@yourdomain.com`
3. Action: Send to Worker → Select your worker
4. Save

## Test It!

Send email to `blog@yourdomain.com`:
```
Subject: [TOKEN-my-secret-token-123] My First Post

Hello world! This is my first blog post.
```

Watch it appear on your blog in ~1-2 minutes!

## Next Steps

- Read [SETUP.md](./SETUP.md) for detailed instructions
- Check [README.md](./README.md) for features
- Test locally: `cat example-email.eml | npm run process-email`

## Troubleshooting

**Email not working?**
- Check Cloudflare Worker logs
- Verify token matches exactly

**Post not appearing?**
- Check GitHub Actions tab
- Wait 1-2 minutes for rebuild

**Need help?**
- Check SETUP.md for detailed troubleshooting
- Verify all secrets are set correctly

---

**You're all set!** Start blogging by sending emails.
