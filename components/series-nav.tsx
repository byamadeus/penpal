import Link from 'next/link'
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
    <div className="border-2 border-black mt-4">
      <div className="border-b-2 border-black px-4 py-3 flex items-center justify-between">
        <span className="text-xs font-bold uppercase font-mono">Post Series</span>
        <span className="text-xs font-mono border border-black px-1">
          {currentIndex + 1} / {threadMeta.posts.length}
        </span>
      </div>
      <div>
        {threadMeta.posts.map((post, index) => {
          const postData = getPostBySlug(post.slug)
          const isCurrent = post.slug === currentSlug

          return (
            <Link
              key={post.slug}
              href={`/post/${post.slug}`}
              className={`flex items-center gap-3 px-4 py-3 text-xs font-mono border-b border-black last:border-b-0 transition-colors ${
                isCurrent ? 'bg-black text-white' : 'hover:bg-black hover:text-white'
              }`}
            >
              <span className="font-bold w-4">{index + 1}.</span>
              <span className="flex-1 uppercase">
                {postData?.metadata.title || 'Untitled'}
              </span>
              {isCurrent && <span className="text-xs">CURRENT</span>}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
