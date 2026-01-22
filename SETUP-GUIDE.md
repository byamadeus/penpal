# Quick Setup Guide

Follow these steps to get your email-to-blog system running.

## 1. Initial Setup (5 minutes)

### Install Dependencies
```bash
npm install
```

### Generate Your Secret Token
```bash
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```
Save this token - you'll use it in steps below.

## 2. GitHub Setup (5 minutes)

### Create Repository
1. Create a new GitHub repository
2. Push this code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

### Add GitHub Secret
1. Go to your repo → **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Name: `EMAIL_SECRET_TOKEN`
4. Value: Your generated token from step 1

### Create Personal Access Token (PAT)
1. GitHub **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. **Generate new token (classic)**
3. Name: "Email Blog Worker"
4. Scopes: Check all under `repo`
5. Generate and **copy the token** (save it somewhere safe)

## 3. Cloudflare Setup (10 minutes)

### Enable Email Routing
1. Cloudflare Dashboard → Select your domain
2. **Email** → **Email Routing** → **Get Started**
3. Add your personal email as a destination
4. Create custom address: `blog@yourdomain.com`
5. Set action: **Send to a Worker** (we'll configure this in step 4)

### Deploy Email Worker
```bash
# Install Wrangler globally
npm install -g wrangler

# Login to Cloudflare
cd cloudflare-worker
wrangler login

# Set secrets
wrangler secret put EMAIL_SECRET_TOKEN
# Enter your token

wrangler secret put GITHUB_TOKEN
# Enter your GitHub PAT

wrangler secret put GITHUB_REPO
# Enter: username/repo-name

# Deploy
wrangler deploy
```

### Connect Email to Worker
1. Back in Cloudflare Dashboard → **Email Routing**
2. Edit `blog@yourdomain.com`
3. Action: **Send to a Worker**
4. Select: `email-to-blog-worker`
5. Save

## 4. Deploy Blog to Cloudflare Pages (5 minutes)

1. Cloudflare Dashboard → **Pages** → **Create a project**
2. **Connect to GitHub** → Select your repository
3. **Build settings**:
   - Framework: **Next.js**
   - Build command: `npm run build`
   - Build output: `out`
4. Click **Save and Deploy**

Wait for the build to complete (~2 minutes).

Your blog is now live at `your-project.pages.dev`!

## 5. Test It! (1 minute)

### Send Test Email

Compose an email:
- **To**: `blog@yourdomain.com`
- **Subject**: `[TOKEN-your-token] My First Post`
- **Body**: `Hello from email! This is my first blog post.`

Send it!

### Watch the Magic
1. Check GitHub Actions: Your repo → **Actions** tab
2. You should see a workflow running called "Process Email to Blog Post"
3. When it completes, check Cloudflare Pages - it will rebuild
4. Visit your blog - your post should appear!

## Troubleshooting

### Email not creating post?
- Check GitHub Actions logs for errors
- Verify token matches in email, GitHub secret, and Cloudflare secret
- Check Cloudflare Worker logs (Dashboard → Workers → Logs)

### Build failing?
```bash
npm run build
```
Fix any errors shown.

### Need help?
Check the full README.md for detailed troubleshooting.

## Next Steps

- Add a custom domain to Cloudflare Pages
- Customize the theme in `app/globals.css`
- Send more posts!
- Try creating a thread by replying to one of your emails

## Summary

You now have:
- ✅ A beautiful static blog
- ✅ Email-powered posting
- ✅ Automatic deployment
- ✅ Completely free hosting
- ✅ Thread/series support
- ✅ Attachment handling

Total setup time: ~25 minutes
Total cost: $0/month (just domain cost)

Enjoy your new blog! 🎉
