import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto text-center py-16">
      <h2 className="text-4xl font-bold mb-4">404</h2>
      <p className="text-xl text-muted-foreground mb-8">
        This post doesn't exist yet.
      </p>
      <Link
        href="/"
        className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        Back to Home
      </Link>
    </div>
  )
}
