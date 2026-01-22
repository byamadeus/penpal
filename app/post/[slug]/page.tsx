import { notFound } from 'next/navigation'
import { getAllPosts, getPostBySlug } from '@/lib/post-manager'
import { PostContent } from '@/components/post-content'
import { SeriesNav } from '@/components/series-nav'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { format } from 'date-fns'
import Link from 'next/link'

interface PageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  const posts = getAllPosts()

  return posts.map(post => ({
    slug: post.slug,
  }))
}

export default function PostPage({ params }: PageProps) {
  const post = getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  const formattedDate = format(new Date(post.metadata.date), 'MMMM d, yyyy')

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2"
        >
          <path d="m12 19-7-7 7-7" />
          <path d="M19 12H5" />
        </svg>
        Back to all posts
      </Link>

      {/* Post header */}
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <time className="text-sm text-muted-foreground">{formattedDate}</time>
          {post.metadata.threadId && (
            <>
              <span className="text-muted-foreground">•</span>
              <Badge variant="secondary">Thread</Badge>
            </>
          )}
        </div>
        <h1 className="text-4xl font-bold mb-4">{post.metadata.title}</h1>
      </header>

      <Separator className="mb-8" />

      {/* Post content */}
      <article className="mb-8">
        <PostContent content={post.content} />
      </article>

      {/* Attachments */}
      {post.metadata.attachments && post.metadata.attachments.length > 0 && (
        <div className="mb-8">
          <Separator className="mb-6" />
          <h3 className="text-lg font-semibold mb-4">Attachments</h3>
          <div className="grid gap-4">
            {post.metadata.attachments.map((attachment, index) => {
              const isImage = attachment.contentType.startsWith('image/')
              const attachmentPath = `/attachments/${params.slug}/${attachment.filename}`

              return (
                <div key={index} className="border rounded-lg p-4">
                  {isImage ? (
                    <img
                      src={attachmentPath}
                      alt={attachment.filename}
                      className="max-w-full h-auto rounded"
                    />
                  ) : (
                    <div className="flex items-center gap-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                      <div>
                        <p className="font-medium">{attachment.filename}</p>
                        <p className="text-xs text-muted-foreground">{attachment.contentType}</p>
                      </div>
                      <a
                        href={attachmentPath}
                        download
                        className="ml-auto text-sm text-primary hover:underline"
                      >
                        Download
                      </a>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Series navigation */}
      {post.metadata.threadId && (
        <SeriesNav threadId={post.metadata.threadId} currentSlug={params.slug} />
      )}
    </div>
  )
}

export const dynamic = 'force-static'
