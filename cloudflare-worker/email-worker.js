/**
 * Cloudflare Email Worker
 *
 * This worker receives emails via Cloudflare Email Routing,
 * validates the secret token, and triggers a GitHub Actions workflow
 * to process the email and create a blog post.
 *
 * Environment Variables Required:
 * - GITHUB_REPO: Your GitHub repository (e.g., "username/repo-name")
 * - GITHUB_TOKEN: GitHub Personal Access Token with repo scope
 * - EMAIL_SECRET_TOKEN: Secret token for email validation
 */

export default {
  async email(message, env, ctx) {
    try {
      // Extract email details
      const from = message.from
      const to = message.to
      const subject = message.headers.get('subject')

      console.log(`Received email from: ${from}`)
      console.log(`Subject: ${subject}`)

      // Validate token in subject line
      const tokenMatch = subject.match(/\[TOKEN-([^\]]+)\]/)

      if (!tokenMatch) {
        console.log('❌ No token found in subject')
        return new Response('Email rejected: Missing token in subject', { status: 400 })
      }

      const providedToken = tokenMatch[1]

      if (providedToken !== env.EMAIL_SECRET_TOKEN) {
        console.log('❌ Invalid token')
        return new Response('Email rejected: Invalid token', { status: 403 })
      }

      console.log('✅ Token validated')

      // Get the raw email content
      const rawEmail = await streamToString(message.raw)

      // Prepare payload for GitHub Actions
      const payload = {
        event_type: 'email-received',
        client_payload: {
          email: rawEmail,
          from: from,
          to: to,
          subject: subject,
          timestamp: new Date().toISOString(),
        },
      }

      // Trigger GitHub Actions workflow
      const githubUrl = `https://api.github.com/repos/${env.GITHUB_REPO}/dispatches`

      const response = await fetch(githubUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'Authorization': `token ${env.GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
          'User-Agent': 'Cloudflare-Email-Worker',
        },
        body: JSON.stringify(payload),
      })

      if (response.ok || response.status === 204) {
        console.log('✅ GitHub Actions workflow triggered')
        return new Response('Email processed successfully', { status: 200 })
      } else {
        const errorText = await response.text()
        console.error('❌ GitHub API error:', response.status, errorText)
        return new Response(`Failed to trigger GitHub Actions: ${errorText}`, {
          status: 500,
        })
      }
    } catch (error) {
      console.error('❌ Worker error:', error)
      return new Response(`Internal error: ${error.message}`, { status: 500 })
    }
  },
}

/**
 * Convert a ReadableStream to a string
 */
async function streamToString(stream) {
  const chunks = []
  const reader = stream.getReader()

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    chunks.push(value)
  }

  const uint8Array = new Uint8Array(
    chunks.reduce((acc, chunk) => acc + chunk.length, 0)
  )

  let offset = 0
  for (const chunk of chunks) {
    uint8Array.set(chunk, offset)
    offset += chunk.length
  }

  return new TextDecoder('utf-8').decode(uint8Array)
}
