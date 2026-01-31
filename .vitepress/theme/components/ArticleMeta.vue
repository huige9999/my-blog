<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

const { frontmatter, page } = useData()

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

const dateText = computed(() => {
  const raw =
    frontmatter.value.date ??
    frontmatter.value.publishDate ??
    frontmatter.value.created ??
    frontmatter.value.updated
  const parsed = parseDate(raw)
  if (parsed) {
    return formatDate(parsed)
  }
  return ''
})

const shouldShow = computed(() => {
  if (frontmatter.value.layout === 'home') return false
  if (frontmatter.value.date === false || frontmatter.value.hideDate) return false
  if (page.value.relativePath.endsWith('index.md')) return false
  return Boolean(dateText.value)
})
</script>

<template>
  <div v-if="shouldShow" class="article-meta">
    <span class="article-label">日期</span>
    <time class="article-date" :datetime="dateText">{{ dateText }}</time>
  </div>
</template>

<style scoped>
.article-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 20px;
  padding: 10px 14px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  font-size: 14px;
}

.article-label {
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.article-date {
  font-variant-numeric: tabular-nums;
}
</style>
