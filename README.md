# Email-to-Blog System

A serverless blog that converts emails into beautifully formatted blog posts. Write your posts in your email client, send them, and watch them appear on your blog automatically!

## Features

- 📧 **Email-powered**: Write posts in your email client
- 🎨 **Beautiful UI**: Built with Next.js and shadcn/ui
- 🧵 **Thread support**: Email replies become post series
- 📎 **Attachments**: Images and files automatically embedded
- 📝 **Markdown**: All posts saved as portable markdown files
- 🚀 **Serverless**: Completely free hosting on Cloudflare Pages
- 🔒 **Secure**: Token-based authentication

## How It Works

1. You send an email to `blog@yourdomain.com` with subject: `[TOKEN-abc123] Post Title`
2. Cloudflare Email Worker receives the email and validates the token
3. Worker triggers GitHub Actions via webhook
4. GitHub Action processes the email and creates a markdown file
5. Changes are committed to the repository
6. Cloudflare Pages detects the commit and rebuilds your static site
7. Your new post appears on the blog!

## Architecture

```
Email → Cloudflare Email Routing → Email Worker (validates token)
  → GitHub Actions (processes email) → Commit markdown file
  → Cloudflare Pages (rebuilds site) → Blog updated!
```

## Setup Guide

### Prerequisites

- A custom domain (required for Cloudflare Email Routing)
- Cloudflare account (free tier is fine)
- GitHub account (free tier is fine)

### Step 1: Clone and Install

```bash
git clone <your-repo-url>
cd email-to-blog
npm install
```

### Step 2: Generate a Secret Token

This token will be used to authenticate your emails.

```bash
# Generate a random token
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```

Save this token - you'll need it later.

### Step 3: Set Up GitHub Repository

1. Create a new GitHub repository
2. Push this code to your repository
3. Go to **Settings → Secrets and variables → Actions**
4. Add a new secret:
   - Name: `EMAIL_SECRET_TOKEN`
   - Value: The token you generated in Step 2

### Step 4: Create GitHub Personal Access Token

1. Go to GitHub **Settings → Developer settings → Personal access tokens → Tokens (classic)**
2. Click **Generate new token (classic)**
3. Give it a name like "Email Blog Worker"
4. Select scopes: `repo` (all repo permissions)
5. Generate and copy the token (you won't see it again!)

### Step 5: Set Up Cloudflare Email Routing

1. Log in to Cloudflare Dashboard
2. Select your domain
3. Go to **Email → Email Routing**
4. Click **Get Started** and follow the wizard
5. Create a new destination email address (your actual email)
6. Create a custom address: `blog@yourdomain.com`
7. Set the action to **Send to a Worker**

### Step 6: Deploy Cloudflare Email Worker

1. Install Wrangler CLI:
   ```bash
   npm install -g wrangler
   ```

2. Login to Cloudflare:
   ```bash
   wrangler login
   ```

3. Set up secrets:
   ```bash
   cd cloudflare-worker
   wrangler secret put EMAIL_SECRET_TOKEN
   # Enter your token when prompted

   wrangler secret put GITHUB_TOKEN
   # Enter your GitHub PAT when prompted

   wrangler secret put GITHUB_REPO
   # Enter your repo in format: username/repo-name
   ```

4. Deploy the worker:
   ```bash
   wrangler deploy
   ```

5. Go back to Cloudflare Dashboard → Email Routing
6. Set `blog@yourdomain.com` to route to your deployed worker

### Step 7: Connect Cloudflare Pages to GitHub

1. Go to Cloudflare Dashboard → **Pages**
2. Click **Create a project**
3. Connect to GitHub and select your repository
4. Build settings:
   - Framework preset: **Next.js**
   - Build command: `npm run build`
   - Build output directory: `out`
5. Click **Save and Deploy**

Your blog will be deployed to a Cloudflare Pages URL (e.g., `your-blog.pages.dev`). You can add a custom domain later.

### Step 8: Create Content Directories

Create the necessary directories for posts and attachments:

```bash
mkdir -p content/posts
mkdir -p public/attachments
git add content/.gitkeep public/attachments/.gitkeep
git commit -m "Initialize content directories"
git push
```

## Usage

### Sending Your First Post

Compose an email with:

- **To**: `blog@yourdomain.com`
- **Subject**: `[TOKEN-your-secret-token] My First Blog Post`
- **Body**: Your post content (HTML or plain text)
- **Attachments** (optional): Images or files

Example:

```
To: blog@yourdomain.com
Subject: [TOKEN-abc123def456] Hello World!

This is my first blog post! I'm writing this from my email client.

Here are some features I love:
- Write posts anywhere
- No complex CMS
- Beautiful design
- Completely free hosting
```

### Creating a Post Series (Thread)

To create a series of related posts:

1. Send your first email as normal
2. **Reply** to that email with your next post
3. The reply will be linked as part of a series

The blog will automatically show navigation between posts in the series.

### Attachments

- Images are automatically embedded in your post
- Other files (PDFs, etc.) are shown with download links
- All files are stored in `/public/attachments/{post-slug}/`

## Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your blog.

### Testing Email Processing Locally

Create a test email file (`test-email.eml`):

```
From: you@example.com
To: blog@yourdomain.com
Subject: [TOKEN-abc123] Test Post
Content-Type: text/plain

This is a test post!
```

Process it:

```bash
export EMAIL_SECRET_TOKEN=abc123
npm run process-email test-email.eml
```

## Project Structure

```
.
├── app/                          # Next.js app directory
│   ├── page.tsx                 # Homepage (post list)
│   ├── post/[slug]/page.tsx     # Individual post page
│   └── layout.tsx               # Root layout
├── components/                   # React components
│   ├── ui/                      # shadcn components
│   ├── post-card.tsx           # Post preview card
│   ├── post-content.tsx        # Markdown renderer
│   └── series-nav.tsx          # Thread navigation
├── lib/                         # Utility functions
│   ├── markdown-converter.ts   # Email → Markdown
│   ├── post-manager.ts         # File operations
│   └── utils.ts                # Helper functions
├── scripts/                     # CLI scripts
│   └── process-email.ts        # Email processor
├── content/                     # Blog content
│   └── posts/                  # Markdown files
├── public/                      # Static assets
│   └── attachments/            # Email attachments
├── cloudflare-worker/          # Email worker
│   ├── email-worker.js
│   └── wrangler.toml
└── .github/                     # CI/CD
    └── workflows/
        └── process-email.yml   # GitHub Actions workflow
```

## Customization

### Styling

This blog uses shadcn/ui components with Tailwind CSS. Customize the theme by editing:

- `app/globals.css` - Color scheme and typography
- `tailwind.config.ts` - Tailwind configuration
- `components/ui/` - Individual component styles

### Email Processing

Customize how emails are processed:

- `lib/markdown-converter.ts` - Modify HTML → Markdown conversion
- `lib/post-manager.ts` - Change file structure or metadata
- `scripts/process-email.ts` - Add custom validation or processing logic

### Blog Layout

- `app/layout.tsx` - Header and footer
- `app/page.tsx` - Homepage layout
- `app/post/[slug]/page.tsx` - Post detail layout

## Troubleshooting

### Email not creating a post

1. Check GitHub Actions logs (repo → Actions tab)
2. Verify your token matches in all three places:
   - Email subject
   - GitHub Secrets
   - Cloudflare Worker secrets
3. Check Cloudflare Worker logs (Dashboard → Workers → Logs)

### Build failing

```bash
# Locally test the build
npm run build

# Check for TypeScript errors
npm run lint
```

### Attachments not showing

- Verify files are in `/public/attachments/{slug}/`
- Check file permissions
- Rebuild the site

## Cost Breakdown

- **Cloudflare Pages**: Free (500 builds/month)
- **Cloudflare Workers**: Free (100,000 requests/day)
- **Cloudflare Email Routing**: Free (unlimited)
- **GitHub Actions**: Free (2,000 minutes/month)
- **Domain**: Varies (typically $10-15/year)

**Total**: Just the cost of your domain!

## Deployment Checklist

- [ ] Repository created and code pushed
- [ ] GitHub Secret `EMAIL_SECRET_TOKEN` configured
- [ ] GitHub Personal Access Token created
- [ ] Cloudflare Email Routing enabled on domain
- [ ] Cloudflare Worker deployed with all secrets
- [ ] Cloudflare Pages connected to repository
- [ ] Content directories created and committed
- [ ] Test email sent and post appears

## Contributing

This is a personal project, but feel free to fork and customize for your own use!

## License

MIT

## Credits

Built with:
- [Next.js](https://nextjs.org/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Cloudflare Workers](https://workers.cloudflare.com/)
- [Turndown](https://github.com/mixmark-io/turndown)
