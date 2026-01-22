import TurndownService from 'turndown'
import { slugify } from './utils'

export interface EmailAttachment {
  filename: string
  contentType: string
  content: Buffer
}

export interface ConvertedEmail {
  title: string
  slug: string
  content: string
  date: string
  threadId: string | null
  attachments: EmailAttachment[]
  frontmatter: string
}

export function convertEmailToMarkdown(
  subject: string,
  htmlBody: string,
  textBody: string,
  attachments: EmailAttachment[],
  threadId: string | null,
  messageId: string,
  date: Date
): ConvertedEmail {
  const turndownService = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    emDelimiter: '*',
  })

  // Convert HTML to Markdown, fallback to plain text
  let markdownContent: string

  if (htmlBody && htmlBody.trim().length > 0) {
    markdownContent = turndownService.turndown(htmlBody)
  } else {
    markdownContent = textBody || ''
  }

  const title = subject.trim()
  const slug = slugify(title)
  const dateString = date.toISOString().split('T')[0]

  // Build frontmatter
  const frontmatterData: Record<string, any> = {
    title,
    date: dateString,
    messageId,
  }

  if (threadId) {
    frontmatterData.threadId = threadId
  }

  if (attachments && attachments.length > 0) {
    frontmatterData.attachments = attachments.map(att => ({
      filename: att.filename,
      contentType: att.contentType,
    }))
  }

  // Generate YAML frontmatter
  const frontmatter = Object.entries(frontmatterData)
    .map(([key, value]) => {
      if (typeof value === 'string') {
        return `${key}: "${value}"`
      } else if (Array.isArray(value)) {
        return `${key}:\n${value.map(item =>
          typeof item === 'object'
            ? `  - ${JSON.stringify(item)}`
            : `  - ${item}`
        ).join('\n')}`
      } else {
        return `${key}: ${value}`
      }
    })
    .join('\n')

  return {
    title,
    slug,
    content: markdownContent,
    date: dateString,
    threadId,
    attachments,
    frontmatter: `---\n${frontmatter}\n---\n\n${markdownContent}`,
  }
}
