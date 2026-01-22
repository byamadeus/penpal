#!/usr/bin/env node

import { simpleParser, ParsedMail, Attachment } from 'mailparser'
import { convertEmailToMarkdown, EmailAttachment } from '../lib/markdown-converter'
import { savePost, saveAttachments, updateThreadMetadata } from '../lib/post-manager'
import { extractToken } from '../lib/utils'
import * as fs from 'fs'

async function processEmail(emailData: string | Buffer): Promise<void> {
  try {
    // Parse the email
    const parsed: ParsedMail = await simpleParser(emailData)

    // Extract subject and validate token
    const subject = parsed.subject || 'Untitled Post'
    const { token, cleanSubject } = extractToken(subject)

    // Validate token
    const expectedToken = process.env.EMAIL_SECRET_TOKEN

    if (expectedToken && token !== expectedToken) {
      console.error('❌ Invalid or missing token in subject line')
      process.exit(1)
    }

    console.log(`📧 Processing email: "${cleanSubject}"`)

    // Extract email content
    const htmlBody = parsed.html || ''
    const textBody = parsed.text || ''
    const date = parsed.date || new Date()
    const messageId = parsed.messageId || `msg-${Date.now()}`

    // Extract thread ID from In-Reply-To or References headers
    let threadId: string | null = null

    if (parsed.inReplyTo) {
      threadId = parsed.inReplyTo
    } else if (parsed.references && parsed.references.length > 0) {
      threadId = parsed.references[0]
    }

    // Process attachments
    const attachments: EmailAttachment[] = []

    if (parsed.attachments && parsed.attachments.length > 0) {
      for (const attachment of parsed.attachments) {
        attachments.push({
          filename: attachment.filename || 'unnamed',
          contentType: attachment.contentType,
          content: attachment.content,
        })
      }
      console.log(`📎 Found ${attachments.length} attachment(s)`)
    }

    // Convert to markdown
    const converted = convertEmailToMarkdown(
      cleanSubject,
      htmlBody as string,
      textBody,
      attachments,
      threadId,
      messageId,
      date
    )

    // Save the post
    savePost(converted.slug, converted.frontmatter)

    // Save attachments if any
    if (attachments.length > 0) {
      saveAttachments(converted.slug, attachments)
    }

    // Update thread metadata if this is part of a thread
    if (threadId) {
      updateThreadMetadata(threadId, converted.slug, messageId)
    }

    console.log('✅ Email processed successfully!')
    console.log(`   Slug: ${converted.slug}`)
    console.log(`   Thread: ${threadId || 'none'}`)
  } catch (error) {
    console.error('❌ Error processing email:', error)
    process.exit(1)
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2)

  if (args.length === 0) {
    // Read from stdin
    let data = ''
    process.stdin.setEncoding('utf-8')

    for await (const chunk of process.stdin) {
      data += chunk
    }

    if (data.trim().length === 0) {
      console.error('❌ No email data provided')
      console.error('Usage: process-email.ts [email-file.eml]')
      console.error('   or: cat email.eml | process-email.ts')
      process.exit(1)
    }

    await processEmail(data)
  } else {
    // Read from file
    const filePath = args[0]

    if (!fs.existsSync(filePath)) {
      console.error(`❌ File not found: ${filePath}`)
      process.exit(1)
    }

    const emailData = fs.readFileSync(filePath)
    await processEmail(emailData)
  }
}

main()
