import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Post } from '@/lib/post-manager'
import { format } from 'date-fns'

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  const formattedDate = format(new Date(post.metadata.date), 'MMMM d, yyyy')

  // Get a preview of the content (first 150 characters)
  const preview = post.content.slice(0, 150).trim() + (post.content.length > 150 ? '...' : '')

  return (
    <Link href={`/post/${post.slug}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <CardTitle className="text-xl">{post.metadata.title}</CardTitle>
            {post.metadata.threadId && (
              <Badge variant="secondary" className="shrink-0">
                Thread
              </Badge>
            )}
          </div>
          <CardDescription>{formattedDate}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {preview}
          </p>
          {post.metadata.attachments && post.metadata.attachments.length > 0 && (
            <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
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
              >
                <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
              </svg>
              <span>{post.metadata.attachments.length} attachment{post.metadata.attachments.length > 1 ? 's' : ''}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
