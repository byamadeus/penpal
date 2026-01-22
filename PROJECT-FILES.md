# Complete Project Files Reference

## Core Application Files

### Next.js App
- `app/layout.tsx` - Root layout with header/footer
- `app/page.tsx` - Homepage with post grid
- `app/globals.css` - Global styles and markdown prose
- `app/post/[slug]/page.tsx` - Individual post pages

### React Components
- `components/post-card.tsx` - Blog post preview cards
- `components/post-content.tsx` - Markdown content renderer
- `components/series-nav.tsx` - Thread series navigation
- `components/ui/card.tsx` - shadcn Card component
- `components/ui/badge.tsx` - shadcn Badge component
- `components/ui/separator.tsx` - shadcn Separator component

### Core Libraries
- `lib/markdown-converter.ts` - Email → Markdown conversion
- `lib/post-manager.ts` - Post file operations & retrieval
- `lib/utils.ts` - Utility functions (slugify, token extraction)

### Email Processing
- `scripts/process-email.ts` - CLI email processor
- `cloudflare-worker/email-worker.js` - Cloudflare Email Worker
- `cloudflare-worker/wrangler.toml` - Worker configuration
- `.github/workflows/process-email.yml` - GitHub Actions workflow

### Configuration Files
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `next.config.js` - Next.js configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration
- `components.json` - shadcn/ui configuration
- `.env.example` - Environment variables template
- `.gitignore` - Git ignore rules

### Documentation
- `README.md` - Project overview and quick start
- `SETUP.md` - Comprehensive setup guide (detailed)
- `QUICKSTART.md` - 10-minute quick start
- `SETUP-GUIDE.md` - Additional setup instructions
- `PROJECT-SUMMARY.md` - Complete project summary
- `PROJECT-FILES.md` - This file

### Example & Content
- `example-email.eml` - Example email for testing
- `content/posts/` - Directory for blog post markdown files
- `public/attachments/` - Directory for email attachments

## File Purposes

### App Files
**app/layout.tsx**
- Defines site structure (header, main, footer)
- Sets up fonts and metadata
- Wraps all pages

**app/page.tsx**
- Homepage that lists all blog posts
- Uses PostCard components in grid layout
- Shows empty state when no posts

**app/post/[slug]/page.tsx**
- Dynamic route for individual posts
- Renders post content with markdown
- Shows attachments and series navigation
- Generates static params for all posts

### Component Files
**components/post-card.tsx**
- Card preview for blog posts
- Shows title, date, excerpt
- Badge for threaded posts
- Attachment count indicator

**components/post-content.tsx**
- Async component that processes markdown
- Uses unified/remark/rehype pipeline
- Sanitizes HTML output
- Renders with prose styles

**components/series-nav.tsx**
- Shows navigation for email thread series
- Lists all posts in thread
- Highlights current post
- Only appears if post is in thread

### Library Files
**lib/markdown-converter.ts**
- Converts HTML/text emails to markdown
- Uses turndown for HTML conversion
- Generates YAML frontmatter
- Handles email metadata

**lib/post-manager.ts**
- Saves markdown files to filesystem
- Manages attachments directory
- Handles thread metadata JSON
- Provides post retrieval functions
- Slug collision prevention

**lib/utils.ts**
- cn() - Tailwind class merging
- slugify() - Convert text to URL slugs
- extractToken() - Parse token from subject

### Processing Files
**scripts/process-email.ts**
- Node.js CLI script
- Parses raw email with mailparser
- Validates authentication token
- Converts to markdown
- Saves post and attachments
- Updates thread metadata

**cloudflare-worker/email-worker.js**
- Receives emails from Cloudflare Email Routing
- Validates secret token in subject
- Converts email to JSON
- Triggers GitHub repository_dispatch webhook
- Handles errors and logging

**.github/workflows/process-email.yml**
- Triggered by repository_dispatch event
- Runs on ubuntu-latest
- Installs dependencies
- Runs process-email script
- Commits new markdown files
- Pushes to repository

## Dependencies

### Production
- next@^14.2.0 - React framework
- react@^18.3.0 - UI library
- react-dom@^18.3.0 - React DOM
- turndown@^7.2.0 - HTML to Markdown
- mailparser@^3.7.1 - Email parsing
- gray-matter@^4.0.3 - Frontmatter parsing
- remark@^15.0.1 - Markdown processor
- remark-html@^16.0.1 - HTML output
- remark-parse@^11.0.0 - Markdown parser
- remark-rehype@^11.1.0 - Markdown to HTML
- rehype-sanitize@^6.0.0 - HTML sanitization
- rehype-stringify@^10.0.0 - HTML stringify
- unified@^11.0.4 - Text processing
- date-fns@^3.3.1 - Date formatting
- clsx - Class utility
- tailwind-merge - Tailwind class merging
- class-variance-authority - CVA utility

### Development
- typescript@^5 - TypeScript
- @types/node@^20 - Node types
- @types/react@^18 - React types
- @types/react-dom@^18 - React DOM types
- @types/turndown@^5.0.5 - Turndown types
- @types/mailparser - Mailparser types
- tailwindcss@^3.4.1 - CSS framework
- postcss@^8 - CSS processor
- autoprefixer@^10.0.1 - CSS autoprefixer
- eslint@^8 - Linter
- eslint-config-next@14.2.0 - Next.js ESLint
- tsx@^4.7.1 - TypeScript executor
- tailwindcss-animate - Tailwind animations

## Scripts

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "process-email": "tsx scripts/process-email.ts"
}
```

## Environment Variables

### GitHub Secrets
- `EMAIL_SECRET_TOKEN` - Token for authentication

### Cloudflare Worker Secrets
- `EMAIL_SECRET_TOKEN` - Same as GitHub
- `GITHUB_TOKEN` - GitHub PAT with repo scope
- `GITHUB_REPO` - Format: username/repo-name

### Local Development
- `EMAIL_SECRET_TOKEN` - For local testing

## Directory Structure

```
.
├── .github/
│   └── workflows/
│       └── process-email.yml
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   └── post/
│       └── [slug]/
│           └── page.tsx
├── components/
│   ├── ui/
│   │   ├── badge.tsx
│   │   ├── card.tsx
│   │   └── separator.tsx
│   ├── post-card.tsx
│   ├── post-content.tsx
│   └── series-nav.tsx
├── lib/
│   ├── markdown-converter.ts
│   ├── post-manager.ts
│   └── utils.ts
├── scripts/
│   └── process-email.ts
├── cloudflare-worker/
│   ├── email-worker.js
│   └── wrangler.toml
├── content/
│   └── posts/
├── public/
│   └── attachments/
├── .env.example
├── .gitignore
├── components.json
├── example-email.eml
├── next.config.js
├── package.json
├── postcss.config.js
├── PROJECT-FILES.md
├── PROJECT-SUMMARY.md
├── QUICKSTART.md
├── README.md
├── SETUP-GUIDE.md
├── SETUP.md
├── tailwind.config.ts
└── tsconfig.json
```

## Key Concepts

### Email Format
Emails must have token in subject:
```
[TOKEN-your-secret] Post Title
```

### Thread Detection
Uses email headers:
- `In-Reply-To` - Direct reply
- `References` - Thread chain

### Markdown Output
Format with frontmatter:
```yaml
---
title: "Post Title"
date: "2026-01-21"
messageId: "<unique@id>"
threadId: "<thread@id>"
---

Post content here...
```

### Workflow
1. Email sent
2. Worker validates & triggers
3. Action processes & commits
4. Pages rebuilds
5. Post live

---

**All files are complete and tested!**
