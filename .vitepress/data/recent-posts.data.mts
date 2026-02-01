import { readFileSync } from 'node:fs'
import { basename, relative, sep } from 'node:path'
import { defineLoader } from 'vitepress'

type RecentPost = {
  title: string
  url: string
  date: string
  timestamp: number
  sectionLabel?: string
}

const SECTION_LABELS: Record<string, string> = {
  tutorials: '教程',
  projects: '项目',
  notes: '笔记',
  opinions: '观点'
}

const WATCH_GLOBS = [
  '../../tutorials/**/*.md',
  '../../projects/**/*.md',
  '../../notes/**/*.md',
  '../../opinions/**/*.md'
]

const toPosixPath = (value: string) => value.split(sep).join('/')

const formatDate = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const parseDate = (value: unknown): Date | null => {
  if (value instanceof Date) {
    return value
  }
  if (typeof value === 'number') {
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? null : date
  }
  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (!trimmed) return null
    const match = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/)
    if (match) {
      const [, year, month, day] = match
      return new Date(Number(year), Number(month) - 1, Number(day))
    }
    const date = new Date(trimmed)
    return Number.isNaN(date.getTime()) ? null : date
  }
  return null
}

const stripQuotes = (value: string) => {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1)
  }
  return value
}

const parseFrontmatter = (source: string): Record<string, string> => {
  const match = source.match(/^---\s*\n([\s\S]*?)\n---\s*\n?/)
  if (!match) return {}
  const raw = match[1]
  const data: Record<string, string> = {}
  for (const line of raw.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const kv = trimmed.match(/^([A-Za-z0-9_-]+)\s*:\s*(.+)$/)
    if (!kv) continue
    const key = kv[1]
    const value = stripQuotes(kv[2].trim())
    data[key] = value
  }
  return data
}

const extractTitleFromContent = (source: string): string | null => {
  const content = source.replace(/^---\s*\n[\s\S]*?\n---\s*\n?/, '')
  const match = content.match(/^#\s+(.+)$/m)
  return match ? match[1].trim() : null
}

const resolveUrl = (filePath: string) => {
  const relativePath = toPosixPath(relative(process.cwd(), filePath))
  const withoutExt = relativePath.replace(/\.md$/, '')
  const cleanPath = withoutExt.replace(/(^|\/)index$/, '$1')
  return `/my-blog/${cleanPath.replace(/^\//, '')}`
}

export default defineLoader({
  watch: WATCH_GLOBS,
  load(watchedFiles): RecentPost[] {
    const posts = watchedFiles
      .filter((file) => {
        const normalized = file.replace(/\\/g, '/')
        return normalized.endsWith('.md') && !normalized.endsWith('/index.md')
      })
      .map((file) => {
        const source = readFileSync(file, 'utf-8')
        const frontmatter = parseFrontmatter(source)
        const rawDate =
          frontmatter.date ?? frontmatter.publishDate ?? frontmatter.created ?? frontmatter.updated
        const parsedDate = parseDate(rawDate)
        if (!parsedDate) {
          return null
        }
        const relativePath = toPosixPath(relative(process.cwd(), file))
        const section = relativePath.split('/')[0] ?? ''
        const title =
          frontmatter.title ||
          frontmatter.name ||
          extractTitleFromContent(source) ||
          basename(file, '.md').replace(/[-_]/g, ' ')
        return {
          title,
          url: resolveUrl(file),
          date: formatDate(parsedDate),
          timestamp: parsedDate.getTime(),
          sectionLabel: SECTION_LABELS[section] ?? section
        }
      })
      .filter((post): post is RecentPost => Boolean(post))
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 5)

    return posts
  }
})
