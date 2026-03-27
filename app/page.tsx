import { getAllPosts } from '@/lib/post-manager'
import { PostCard } from '@/components/post-card'

export default function Home() {
  const posts = getAllPosts()

  return (
    <div className="max-w-5xl mx-auto">
      {posts.length === 0 ? (
        <div className="border-2 border-black p-8 text-center font-mono">
          <p className="font-bold uppercase text-sm mb-2">No posts yet.</p>
          <p className="text-xs">
            Send an email to penpal@byamadeus.com with [TOKEN-good-boy] in the subject.
          </p>
        </div>
      ) : (
        <div className="grid gap-8 grid-cols-2 md:grid-cols-3">
          {posts.map(post => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}

export const dynamic = 'force-static'
