import { getAllPosts } from '@/lib/post-manager'
import { PostCard } from '@/components/post-card'

export default function Home() {
  const posts = getAllPosts()

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">All Posts</h2>
        <p className="text-muted-foreground">
          {posts.length} {posts.length === 1 ? 'post' : 'posts'} published
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg mb-4">
            No posts yet. Send an email to start blogging!
          </p>
          <p className="text-sm text-muted-foreground">
            Format: <code className="bg-muted px-2 py-1 rounded">[TOKEN-your-token] Post Title</code>
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {posts.map(post => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}

export const dynamic = 'force-static'
