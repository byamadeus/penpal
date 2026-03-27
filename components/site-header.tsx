'use client'

import { useState } from 'react'
import Link from 'next/link'

export function SiteHeader() {
  const [helpOpen, setHelpOpen] = useState(false)

  return (
    <header className="border-b-2 border-black relative">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/">
          <span className="bg-black text-white px-3 py-1 text-xs font-bold uppercase tracking-wider font-mono">
            PENPALS.BYAMADEUS.COM
          </span>
        </Link>
        <button
          onClick={() => setHelpOpen(!helpOpen)}
          className="w-8 h-8 border-2 border-black flex items-center justify-center text-xs font-bold font-mono hover:bg-black hover:text-white transition-colors"
          aria-label="Help"
        >
          {helpOpen ? 'X' : '?'}
        </button>
      </div>

      {helpOpen && (
        <div className="absolute top-full left-0 right-0 z-50 px-4 pt-4 pb-0">
          <div className="container mx-auto">
            <div className="border-2 border-black bg-white p-6 max-w-xl relative">
              <button
                onClick={() => setHelpOpen(false)}
                className="absolute top-3 right-3 w-6 h-6 border-2 border-black flex items-center justify-center text-xs font-bold font-mono hover:bg-black hover:text-white transition-colors"
              >
                X
              </button>
              <p className="font-bold uppercase text-sm font-mono mb-3">PEN PAL BLOG</p>
              <p className="text-sm font-mono mb-3">Thoughts delivered via email.</p>
              <p className="text-sm font-mono">
                Send a thought to penpal@byamadeus.com with &ldquo;[TOKEN-good-boy]&rdquo; in the subject line to have it automatically publish (if it works lol).
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
