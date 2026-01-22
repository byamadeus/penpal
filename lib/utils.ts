import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

export function extractToken(subject: string): { token: string | null; cleanSubject: string } {
  const tokenMatch = subject.match(/\[TOKEN-([^\]]+)\]\s*(.*)/)

  if (tokenMatch) {
    return {
      token: tokenMatch[1],
      cleanSubject: tokenMatch[2].trim()
    }
  }

  return {
    token: null,
    cleanSubject: subject
  }
}
