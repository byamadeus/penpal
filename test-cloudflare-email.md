# Test Email for Cloudflare Email Routing

## Step 1: Send Test Email

From your email client (Gmail, Outlook, etc.), send:

**To:** blog@yourdomain.com  
**Subject:** [TOKEN-your-secret-token] Cloudflare Test  
**Body:**
```
This is a test email to verify Cloudflare Email Routing is working.

If you see this as a blog post, everything works!
```

## Step 2: Check if Email Was Received

### Option A: Cloudflare Dashboard
1. Go to dash.cloudflare.com
2. Your domain → Email → Email Routing
3. Click "Activity" or "Logs" tab
4. Look for your test email

### Option B: Worker Logs (Real-time)
```bash
cd cloudflare-worker
wrangler tail
```

Keep this running and send the email. You'll see immediate feedback.

### Option C: Check GitHub Actions
1. Go to your GitHub repo
2. Click "Actions" tab
3. Look for a new workflow run
4. If you see it running, the email triggered the worker successfully!

## What You Should See at Each Stage

### ✅ Stage 1: Email Routing Receives Email
**Cloudflare Email Routing Logs:**
```
From: you@gmail.com
To: blog@yourdomain.com
Status: Delivered to Worker
```

### ✅ Stage 2: Worker Processes Email
**Worker Logs (wrangler tail):**
```
Received email from: you@gmail.com
Subject: [TOKEN-xxx] Cloudflare Test
✅ Token validated
✅ GitHub Actions workflow triggered
```

### ✅ Stage 3: GitHub Actions Runs
**GitHub Actions Tab:**
- New workflow run appears
- Status: Running → Success
- New commit with blog post

### ✅ Stage 4: Blog Post Created
**Check locally:**
```bash
git pull
ls content/posts/
# Should see: cloudflare-test.md
```

## Troubleshooting

### Email not in Activity Logs?
**Issue:** Email routing not configured
**Fix:**
1. Email Routing → Enable Email Routing
2. Add MX records (usually automatic)
3. Create routing rule: blog@yourdomain.com → Send to Worker

### Email in logs but "Failed" status?
**Issue:** Worker not found or crashed
**Fix:**
1. Verify worker deployed: `wrangler deployments list`
2. Check worker logs for errors
3. Verify routing rule points to correct worker

### Worker runs but no GitHub Action?
**Issue:** Worker can't trigger GitHub (wrong token/repo)
**Fix:**
1. Check worker secrets: `wrangler secret list`
2. Verify GITHUB_TOKEN has repo permissions
3. Verify GITHUB_REPO format: username/repo-name (no github.com)

### Token Invalid message?
**Issue:** Token mismatch
**Fix:**
1. Get worker token: `wrangler secret list` (won't show value)
2. Get GitHub token: Repo Settings → Secrets → EMAIL_SECRET_TOKEN
3. Make sure they match exactly (case-sensitive!)

## Quick Debug Commands

```bash
# View worker logs
wrangler tail

# List worker secrets
wrangler secret list

# View recent deployments
wrangler deployments list

# Check worker status
wrangler dev  # Test locally
```

## Test Email Formats

### Minimal Test:
```
Subject: [TOKEN-test123] Test
Body: Hello
```

### Full Test:
```
Subject: [TOKEN-test123] Full Feature Test

# This is a test

Testing all features:
- **Bold text**
- *Italic text*
- [Link](https://example.com)

With an image attachment!
```

