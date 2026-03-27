import type { Metadata } from "next"
import "./globals.css"
import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = {
  title: "Pen Pal Blog",
  description: "Thoughts delivered via email.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body style={{ fontFamily: '"Courier New", Courier, monospace' }}>
        <div className="min-h-screen bg-white">
          <SiteHeader />
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
          <footer className="border-t-2 border-black mt-16">
            <div className="container mx-auto px-4 py-4 text-center text-xs font-mono uppercase tracking-wide">
              <p>Powered by old fashioned email and cloudflare workers</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
