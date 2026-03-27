import { notFound } from 'next/navigation'
import { getAllPosts, getPostBySlug } from '@/lib/post-manager'
import { PostContent } from '@/components/post-content'
import { SeriesNav } from '@/components/series-nav'
import { MarkSeen } from '@/components/mark-seen'
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
    <div className="max-w-2xl mx-auto">
      <MarkSeen slug={params.slug} />

      {/* Close / back button */}
      <div className="flex justify-end mb-4">
        <Link
          href="/"
          className="w-8 h-8 border-2 border-black flex items-center justify-center text-xs font-bold font-mono hover:bg-black hover:text-white transition-colors"
          aria-label="Back to all posts"
        >
          X
        </Link>
      </div>

      {/* Letter container */}
      <div className="border-2 border-black p-8">
        {/* Post header */}
        <header className="mb-6">
          <h1 className="text-xl font-bold uppercase font-mono leading-snug mb-4">
            {post.metadata.title}
          </h1>
          <div className="flex items-center gap-4 text-xs font-mono uppercase">
            <span>AMADEUS</span>
            <span>{formattedDate}</span>
            {post.metadata.threadId && (
              <span className="border border-black px-1">Thread</span>
            )}
          </div>
        </header>

        <hr className="border-black mb-6" />

        {/* Post content */}
        <article>
          <PostContent content={post.content} />
        </article>

        {/* Attachments */}
        {post.metadata.attachments && post.metadata.attachments.length > 0 && (
          <div className="mt-8">
            <hr className="border-black mb-6" />
            <p className="text-xs font-bold uppercase font-mono mb-4">Attachments</p>
            <div className="space-y-3">
              {post.metadata.attachments.map((attachment, index) => {
                const isImage = attachment.contentType.startsWith('image/')
                const attachmentPath = `/attachments/${params.slug}/${attachment.filename}`

                return (
                  <div key={index} className="border-2 border-black p-3">
                    {isImage ? (
                      <img
                        src={attachmentPath}
                        alt={attachment.filename}
                        className="max-w-full h-auto"
                      />
                    ) : (
                      <div className="flex items-center justify-between gap-3 font-mono text-xs">
                        <span className="font-bold uppercase">{attachment.filename}</span>
                        <a
                          href={attachmentPath}
                          download
                          className="border border-black px-2 py-1 hover:bg-black hover:text-white transition-colors"
                        >
                          DOWNLOAD
                        </a>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Series navigation */}
      {post.metadata.threadId && (
        <SeriesNav threadId={post.metadata.threadId} currentSlug={params.slug} />
      )}
    </div>
  )
}

export const dynamic = 'force-static'
