import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { EmailAttachment } from './markdown-converter'

export interface PostMetadata {
  title: string
  date: string
  messageId: string
  threadId?: string
  seriesPosition?: number
  seriesTotal?: number
  attachments?: Array<{ filename: string; contentType: string }>
}

export interface Post {
  slug: string
  content: string
  metadata: PostMetadata
}

export interface ThreadMetadata {
  threadId: string
  posts: Array<{ slug: string; position: number; messageId: string }>
}

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts')
const ATTACHMENTS_DIR = path.join(process.cwd(), 'public', 'attachments')

export function ensureDirectories() {
  if (!fs.existsSync(POSTS_DIR)) {
    fs.mkdirSync(POSTS_DIR, { recursive: true })
  }
  if (!fs.existsSync(ATTACHMENTS_DIR)) {
    fs.mkdirSync(ATTACHMENTS_DIR, { recursive: true })
  }
}

export function savePost(slug: string, frontmatter: string): void {
  ensureDirectories()

  const filePath = path.join(POSTS_DIR, `${slug}.md`)

  // Handle slug collisions
  let finalSlug = slug
  let counter = 1
  let finalPath = filePath

  while (fs.existsSync(finalPath)) {
    finalSlug = `${slug}-${counter}`
    finalPath = path.join(POSTS_DIR, `${finalSlug}.md`)
    counter++
  }

  fs.writeFileSync(finalPath, frontmatter, 'utf-8')
  console.log(`✅ Post saved: ${finalSlug}.md`)
}

export function saveAttachments(slug: string, attachments: EmailAttachment[]): void {
  ensureDirectories()

  const attachmentDir = path.join(ATTACHMENTS_DIR, slug)

  if (!fs.existsSync(attachmentDir)) {
    fs.mkdirSync(attachmentDir, { recursive: true })
  }

  attachments.forEach(attachment => {
    const filePath = path.join(attachmentDir, attachment.filename)
    fs.writeFileSync(filePath, attachment.content)
    console.log(`📎 Attachment saved: ${slug}/${attachment.filename}`)
  })
}

export function updateThreadMetadata(
  threadId: string,
  slug: string,
  messageId: string
): void {
  ensureDirectories()

  const metaFilePath = path.join(POSTS_DIR, `thread-${threadId}.meta.json`)

  let threadMeta: ThreadMetadata

  if (fs.existsSync(metaFilePath)) {
    const existing = JSON.parse(fs.readFileSync(metaFilePath, 'utf-8'))
    threadMeta = existing
  } else {
    threadMeta = {
      threadId,
      posts: [],
    }
  }

  // Add this post to the thread if not already present
  const existingPost = threadMeta.posts.find(p => p.messageId === messageId)

  if (!existingPost) {
    threadMeta.posts.push({
      slug,
      position: threadMeta.posts.length + 1,
      messageId,
    })

    fs.writeFileSync(metaFilePath, JSON.stringify(threadMeta, null, 2), 'utf-8')
    console.log(`🔗 Thread metadata updated: ${threadMeta.posts.length} posts in thread`)
  }
}

export function getAllPosts(): Post[] {
  ensureDirectories()

  if (!fs.existsSync(POSTS_DIR)) {
    return []
  }

  const files = fs.readdirSync(POSTS_DIR).filter(file => file.endsWith('.md'))

  const posts = files.map(file => {
    const filePath = path.join(POSTS_DIR, file)
    const fileContents = fs.readFileSync(filePath, 'utf-8')
    const { data, content } = matter(fileContents)

    return {
      slug: file.replace(/\.md$/, ''),
      content,
      metadata: data as PostMetadata,
    }
  })

  // Sort by date, newest first
  return posts.sort((a, b) => {
    return new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime()
  })
}

export function getPostBySlug(slug: string): Post | null {
  ensureDirectories()

  const filePath = path.join(POSTS_DIR, `${slug}.md`)

  if (!fs.existsSync(filePath)) {
    return null
  }

  const fileContents = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(fileContents)

  return {
    slug,
    content,
    metadata: data as PostMetadata,
  }
}

export function getThreadMetadata(threadId: string): ThreadMetadata | null {
  ensureDirectories()

  const metaFilePath = path.join(POSTS_DIR, `thread-${threadId}.meta.json`)

  if (!fs.existsSync(metaFilePath)) {
    return null
  }

  return JSON.parse(fs.readFileSync(metaFilePath, 'utf-8'))
}
