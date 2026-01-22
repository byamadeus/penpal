# Testing Locally

Quick guide to test the email-to-blog system on your local machine before deploying.

## Prerequisites

```bash
npm install
```

## Step 1: Create Test Environment

Create a `.env.local` file:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and set your token:
```
EMAIL_SECRET_TOKEN=abc123
```

## Step 2: Test Email Processing

### Option A: Use the Example Email

```bash
npm run process-email EXAMPLE-EMAIL.eml
```

### Option B: Create Your Own Test Email

Create a file called `my-test.eml`:

```
From: you@example.com
To: blog@yourdomain.com
Subject: [TOKEN-abc123] My Test Post
Date: Tue, 21 Jan 2026 10:00:00 -0800
Message-ID: <test-001@example.com>
Content-Type: text/plain

This is my test post content!

It supports **markdown** and multiple paragraphs.

Here's a list:
- Item 1
- Item 2
- Item 3
```

Then process it:

```bash
npm run process-email my-test.eml
```

## Step 3: Verify Files Created

Check that files were created:

```bash
# List posts
ls -la content/posts/

# You should see:
# - my-test-post.md (or similar)

# Read the generated post
cat content/posts/my-test-post.md
```

## Step 4: Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

You should see:
- Your test post on the homepage
- Click it to view the full post

## Step 5: Test Thread Creation

Create a second email that replies to the first:

File: `my-reply.eml`
```
From: you@example.com
To: blog@yourdomain.com
Subject: Re: [TOKEN-abc123] My Test Post Follow-Up
Date: Tue, 21 Jan 2026 11:00:00 -0800
Message-ID: <test-002@example.com>
In-Reply-To: <test-001@example.com>
References: <test-001@example.com>
Content-Type: text/plain

This is a follow-up to my first post!

Since this email has "In-Reply-To" header, it will be
linked to the original post as part of a series.
```

Process it:

```bash
npm run process-email my-reply.eml
```

Refresh your browser - you should now see:
- A "Thread" badge on the posts
- Series navigation showing both posts

## Step 6: Test with Attachments

Create an email with an attachment:

File: `with-image.eml`
```
From: you@example.com
To: blog@yourdomain.com
Subject: [TOKEN-abc123] Post With Image
Date: Tue, 21 Jan 2026 12:00:00 -0800
Message-ID: <test-003@example.com>
Content-Type: multipart/mixed; boundary="boundary-test"

--boundary-test
Content-Type: text/plain

Check out this image below!

--boundary-test
Content-Type: image/png; name="test-image.png"
Content-Disposition: attachment; filename="test-image.png"
Content-Transfer-Encoding: base64

iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==

--boundary-test--
```

(Note: The base64 above is a 1x1 pixel red image for testing)

Process it:

```bash
npm run process-email with-image.eml
```

Check:
```bash
ls -la public/attachments/post-with-image/
# Should show test-image.png
```

View in browser - the image should appear.

## Step 7: Test Build

Build the static site:

```bash
npm run build
```

This creates the `out/` directory with your static site.

Preview it:

```bash
npx serve out
```

Open the URL shown (usually http://localhost:3000)

## Troubleshooting

### Error: "Invalid or missing token"

- Check that your `.env.local` has `EMAIL_SECRET_TOKEN` set
- Verify the token in your test email matches exactly: `[TOKEN-abc123]`

### Error: "Module not found"

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Posts not appearing

- Check `content/posts/` directory exists and has .md files
- Restart the dev server (`npm run dev`)
- Clear browser cache

### Markdown not rendering correctly

- Check the frontmatter format in the generated .md file
- Ensure there's a blank line after the closing `---`

## Clean Up

To start fresh:

```bash
# Remove all generated content
rm -rf content/posts/*.md
rm -rf content/posts/*.json
rm -rf public/attachments/*

# Keep the .gitkeep files
touch content/.gitkeep
touch public/attachments/.gitkeep
```

## Next Steps

Once local testing works:
1. Follow `SETUP-GUIDE.md` to deploy to Cloudflare
2. Set up real email routing
3. Start blogging!

## Debug Mode

For more verbose output when processing emails:

```bash
# Add debug logging
NODE_ENV=development npm run process-email test.eml
```

## Common Test Scenarios

### Test 1: Simple Text Post
```bash
npm run process-email EXAMPLE-EMAIL.eml
```

### Test 2: HTML Email
Create an email with HTML content type

### Test 3: Thread Series
Create multiple emails with In-Reply-To headers

### Test 4: With Attachments
Include image or PDF attachments

### Test 5: Invalid Token
Try processing without correct token (should fail)

All tests passing? You're ready to deploy! 🚀
