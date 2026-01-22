import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "My Email Blog",
  description: "A blog powered by email",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-background">
          <header className="border-b">
            <div className="container mx-auto px-4 py-6">
              <h1 className="text-2xl font-bold">
                <a href="/" className="hover:text-primary/80">My Email Blog</a>
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Thoughts delivered via email
              </p>
            </div>
          </header>
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
          <footer className="border-t mt-16">
            <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
              <p>Powered by email and markdown</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
