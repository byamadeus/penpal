# Email-to-Blog Setup Guide

Complete guide to set up your email-powered blog system.

## Overview

This system allows you to create blog posts by sending emails. The workflow:

1. Send email to your custom domain (e.g., `blog@yourdomain.com`)
2. Cloudflare Email Worker validates token and triggers GitHub Actions
3. GitHub Actions processes email → creates markdown file → commits to repo
4. Cloudflare Pages automatically rebuilds your blog
5. New post appears on your site

**Cost: Completely free** (using free tiers of Cloudflare and GitHub)

---

## Prerequisites

- A custom domain (required for Cloudflare Email Routing)
- GitHub account
- Cloudflare account
- Node.js 18+ installed locally (for testing)

---

## Step 1: GitHub Repository Setup

### 1.1 Create Repository

1. Push this code to a new GitHub repository
2. Make the repository public or private (both work with Cloudflare Pages)

### 1.2 Generate Personal Access Token

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Name it: `Email Blog Worker`
4. Scopes needed: `repo` (full control of private repositories)
5. Click "Generate token"
6. **Copy the token** - you'll need it for Cloudflare Worker

### 1.3 Set Repository Secrets

1. Go to your repository → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add secret:
   - Name: `EMAIL_SECRET_TOKEN`
   - Value: Create a random token (e.g., `my-secret-blog-token-12345`)
   - Click "Add secret"

> This token will be used in your email subjects to authenticate posts.

---

## Step 2: Cloudflare Pages Setup

### 2.1 Connect Repository

1. Log in to Cloudflare Dashboard
2. Go to Workers & Pages → Create application → Pages → Connect to Git
3. Connect your GitHub account
4. Select your email-blog repository
5. Configure build settings:
   - **Framework preset**: Next.js
   - **Build command**: `npm run build`
   - **Build output directory**: `.next`
6. Click "Save and Deploy"

Your blog will build and be available at `your-project.pages.dev`

### 2.2 Custom Domain (Optional)

1. In Cloudflare Pages → your project → Custom domains
2. Add your custom domain
3. Cloudflare will automatically configure DNS

---

## Step 3: Cloudflare Email Routing Setup

### 3.1 Add Domain to Cloudflare

If your domain isn't already on Cloudflare:

1. Cloudflare Dashboard → Add a site
2. Enter your domain → Add site
3. Select Free plan
4. Update nameservers at your domain registrar
5. Wait for activation (usually a few minutes)

### 3.2 Enable Email Routing

1. Cloudflare Dashboard → Email → Email Routing
2. Enable Email Routing for your domain
3. Add MX records (Cloudflare will do this automatically)
4. Create a destination email (your personal email where you want to receive/test emails)
5. Verify the destination email address

### 3.3 Create Email Address

1. Email Routing → Routing Rules → Create address
2. Custom address: `blog@yourdomain.com` (or any address you want)
3. Action: Send to a Worker (we'll create this next)
4. Save

---

## Step 4: Deploy Cloudflare Email Worker

### 4.1 Install Wrangler CLI

```bash
npm install -g wrangler
```

### 4.2 Login to Cloudflare

```bash
wrangler login
```

### 4.3 Set Worker Secrets

From your project's `cloudflare-worker` directory:

```bash
cd cloudflare-worker

# Set your secrets
wrangler secret put EMAIL_SECRET_TOKEN
# Enter: my-secret-blog-token-12345 (same as in GitHub)

wrangler secret put GITHUB_TOKEN
# Enter: ghp_your_github_personal_access_token

wrangler secret put GITHUB_REPO
# Enter: yourusername/your-repo-name
```

### 4.4 Deploy Worker

```bash
wrangler deploy
```

Take note of the worker URL (e.g., `email-to-blog-worker.yourname.workers.dev`)

### 4.5 Connect Worker to Email Route

1. Go back to Cloudflare Dashboard → Email Routing → Routing Rules
2. Edit the `blog@yourdomain.com` rule
3. Action: Send to a Worker → Select your deployed worker
4. Save

---

## Step 5: Test the System

### 5.1 Send Test Email

Send an email to `blog@yourdomain.com` with:

- **Subject**: `[TOKEN-my-secret-blog-token-12345] My First Blog Post`
- **Body**: Write your post content (HTML or plain text)
- **Attachments**: Optional (images, PDFs, etc.)

### 5.2 Verify Processing

1. Check GitHub Actions:
   - Go to your repo → Actions tab
   - You should see a workflow running
   - Wait for it to complete (green checkmark)

2. Check commit:
   - Go to your repo → content/posts/
   - You should see a new `.md` file

3. Check blog:
   - Visit your Cloudflare Pages URL
   - Wait 1-2 minutes for rebuild
   - Your new post should appear!

---

## Step 6: Email Thread Series

To create linked post series, simply reply to your original email:

1. Send first post: `[TOKEN-xxx] Series Part 1`
2. Reply to that email: `[TOKEN-xxx] Series Part 2`
3. The blog will automatically detect the thread and show navigation

---

## Usage Tips

### Email Subject Format

Always include the token:
```
[TOKEN-your-secret-token] Your Post Title
```

### Markdown in Emails

The system converts HTML to Markdown automatically. You can write in:
- Plain text
- Rich text (from Gmail, Outlook, etc.)
- HTML

### Attachments

- Images are automatically embedded in posts
- PDFs and other files show as download links
- All attachments saved to `/public/attachments/{slug}/`

### Cross-Platform Posting

The generated markdown files work with:
- Jekyll
- Hugo
- Gatsby
- Any markdown-based blog platform

Just copy files from `content/posts/` to your other blogs!

---

## Local Development

### Run Blog Locally

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`

### Test Email Processing Locally

Create a test email file (`test-email.eml`):

```
From: you@example.com
To: blog@yourdomain.com
Subject: [TOKEN-my-secret-blog-token-12345] Test Post
Date: Mon, 21 Jan 2026 12:00:00 +0000
Content-Type: text/plain

This is my test blog post content!
```

Process it:

```bash
export EMAIL_SECRET_TOKEN="my-secret-blog-token-12345"
cat test-email.eml | npm run process-email
```

Check `content/posts/` for the generated markdown.

---

## Troubleshooting

### Email not triggering workflow

1. Check Cloudflare Worker logs:
   - Cloudflare Dashboard → Workers & Pages → your worker → Logs
2. Verify token matches exactly (case-sensitive)
3. Check GitHub webhook delivery:
   - Repo → Settings → Webhooks → Recent Deliveries

### Workflow fails

1. Check Actions tab for error messages
2. Common issues:
   - Missing `EMAIL_SECRET_TOKEN` secret
   - Invalid token in subject
   - Permissions issue (need write access to repo)

### Post not appearing on blog

1. Wait 1-2 minutes for Cloudflare Pages to rebuild
2. Check if markdown file was created in `content/posts/`
3. Check Cloudflare Pages build logs

### Attachments not showing

1. Verify attachments were committed to `public/attachments/`
2. Check file paths in markdown frontmatter
3. Clear browser cache

---

## Customization

### Change Blog Title

Edit `app/layout.tsx`:

```typescript
export const metadata: Metadata = {
  title: "Your Blog Name",
  description: "Your blog description",
}
```

### Change Theme Colors

Edit `app/globals.css` CSS variables in `:root` and `.dark`

### Add Custom Components

shadcn/ui components are available:

```bash
npx shadcn@latest add [component-name]
```

Available: button, dialog, dropdown-menu, tabs, etc.

---

## Environment Variables Reference

### GitHub Secrets
- `EMAIL_SECRET_TOKEN`: Token for email authentication

### Cloudflare Worker Secrets
- `EMAIL_SECRET_TOKEN`: Same as GitHub secret
- `GITHUB_TOKEN`: Personal access token
- `GITHUB_REPO`: Format `username/repo-name`

---

## Security Notes

- Never commit secrets to git
- Rotate `EMAIL_SECRET_TOKEN` periodically
- Use GitHub fine-grained tokens for better security
- Email worker validates token before processing

---

## Cost Breakdown

- **Cloudflare Pages**: Free (500 builds/month)
- **Cloudflare Workers**: Free (100,000 requests/day)
- **Cloudflare Email Routing**: Free (unlimited emails)
- **GitHub Actions**: Free (2,000 minutes/month)
- **Custom Domain**: Varies ($10-15/year typical)

**Total**: Domain cost only (~$1/month)

---

## Next Steps

1. Customize your blog design
2. Add your own posts
3. Share your blog URL
4. Consider adding:
   - RSS feed
   - Search functionality
   - Comments (via third-party service)
   - Analytics

---

## Support

If you encounter issues:
1. Check Cloudflare Worker logs
2. Check GitHub Actions logs
3. Verify all secrets are set correctly
4. Ensure token in email subject matches exactly

Happy blogging! Send yourself an email and watch the magic happen.
