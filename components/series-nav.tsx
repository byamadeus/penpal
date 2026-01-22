import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { getThreadMetadata, getPostBySlug } from '@/lib/post-manager'

interface SeriesNavProps {
  threadId: string
  currentSlug: string
}

export function SeriesNav({ threadId, currentSlug }: SeriesNavProps) {
  const threadMeta = getThreadMetadata(threadId)

  if (!threadMeta || threadMeta.posts.length <= 1) {
    return null
  }

  const currentIndex = threadMeta.posts.findIndex(p => p.slug === currentSlug)

  return (
    <Card className="mt-8">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg">Post Series</CardTitle>
          <Badge variant="secondary">{threadMeta.posts.length} posts</Badge>
        </div>
        <CardDescription>
          Part {currentIndex + 1} of {threadMeta.posts.length}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {threadMeta.posts.map((post, index) => {
            const postData = getPostBySlug(post.slug)
            const isCurrent = post.slug === currentSlug

            return (
              <div key={post.slug}>
                {index > 0 && <Separator className="my-2" />}
                <Link
                  href={`/post/${post.slug}`}
                  className={`block p-3 rounded-lg transition-colors ${
                    isCurrent
                      ? 'bg-primary/10 border border-primary/20'
                      : 'hover:bg-muted'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`text-sm font-semibold ${
                        isCurrent ? 'text-primary' : 'text-muted-foreground'
                      }`}
                    >
                      {index + 1}.
                    </span>
                    <div className="flex-1">
                      <p
                        className={`font-medium ${
                          isCurrent ? 'text-primary' : 'text-foreground'
                        }`}
                      >
                        {postData?.metadata.title || 'Untitled'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {postData?.metadata.date}
                      </p>
                    </div>
                    {isCurrent && (
                      <Badge variant="default" className="text-xs">
                        Current
                      </Badge>
                    )}
                  </div>
                </Link>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
