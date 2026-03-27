'use client'

import Link from 'next/link'
import type { Post } from '@/lib/post-manager'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'

const CLOSED_PATH =
  'M288 162H18V144H288V162ZM18 144H0V18H18V144ZM306 144H288V18H306V144ZM162 90V108H144V90H162ZM144 90H108V72H144V90ZM198 90H162V72H198V90ZM108 72H90V54H108V72ZM216 72H198V54H216V72ZM90 54H54V36H90V54ZM252 54H216V36H252V54ZM288 18H270V36H252V18H54V36H36V18H18V0H288V18Z'

const OPEN_PATH =
  'M288 252H18V234H288V252ZM18 234H0V108H18V234ZM306 234H288V108H306V234ZM162 162V180H144V162H162ZM144 162H108V144H144V162ZM198 162H162V144H198V162ZM108 144H90V126H108V144ZM216 144H198V126H216V144ZM90 126H54V108H90V126ZM252 126H216V108H252V126ZM54 108H18V90H36V72H54V108ZM270 90H288V108H252V72H270V90ZM90 72H54V54H90V72ZM252 72H216V54H252V72ZM108 54H90V36H108V54ZM216 54H198V36H216V54ZM144 36H108V18H144V36ZM198 36H162V18H198V36ZM162 18H144V0H162V18Z'

const SEEN_PATH =
  'M322 189H52V171H322V189ZM288 162H52V171H34V162H18V144H288V162ZM340 171H322V45H340V171ZM18 144H0V18H18V144ZM306 27H322V45H306V144H288V18H306V27ZM288 18H18V0H288V18Z'

// Open envelope is 252px tall vs closed 162px — flap extends above by this ratio
const OPEN_HEIGHT_RATIO = 252 / 162 // ≈ 1.556

function getVisitedSlugs(): Set<string> {
  try {
    const stored = localStorage.getItem('visited-posts')
    return new Set(stored ? JSON.parse(stored) : [])
  } catch {
    return new Set()
  }
}

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  const shortDate = format(new Date(post.metadata.date), 'M/d')
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    setSeen(getVisitedSlugs().has(post.slug))
  }, [post.slug])

  return (
    <Link href={`/post/${post.slug}`} className="group block">
      {/* Container sized to closed envelope aspect ratio */}
      <div className="relative" style={{ aspectRatio: '306 / 162' }}>

        {/* CLOSED — default, fades on hover (hidden if already seen) */}
        {!seen && (
          <svg
            viewBox="0 0 306 162"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-0 w-full h-full opacity-100 group-hover:opacity-0 transition-opacity duration-200"
          >
            <path d={CLOSED_PATH} fill="black" />
          </svg>
        )}

        {/* SEEN — shown for previously visited posts, fades on hover */}
        {seen && (
          <svg
            viewBox="0 0 340 189"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-0 w-full h-full opacity-100 group-hover:opacity-0 transition-opacity duration-200"
            preserveAspectRatio="xMidYMid slice"
          >
            <path d={SEEN_PATH} fill="black" />
          </svg>
        )}

        {/* OPEN — fades in on hover; taller SVG anchored to bottom so flap overflows above */}
        <svg
          viewBox="0 0 306 252"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute bottom-0 left-0 w-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{ height: `${OPEN_HEIGHT_RATIO * 100}%` }}
        >
          <path d={OPEN_PATH} fill="black" />
        </svg>

        {/* Title overlay — centered in envelope body area, appears on hover */}
        <div
          className="absolute inset-x-0 bottom-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 px-6"
          style={{ bottom: '10%' }}
        >
          <p className="text-center font-bold uppercase text-xs leading-snug font-mono">
            {post.metadata.title}
          </p>
        </div>
      </div>

      <div className="flex justify-between mt-2 text-xs font-mono font-bold uppercase tracking-wide">
        {/* <span>AMADEUS</span> */}
        <span>{shortDate}</span>
      </div>
    </Link>
  )
}
