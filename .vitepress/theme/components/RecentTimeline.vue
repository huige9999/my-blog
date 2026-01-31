<script setup lang="ts">
import { computed } from 'vue'
import { data as recentPosts } from '../../data/recent-posts.data'

type RecentPost = {
  title: string
  url: string
  date: string
  sectionLabel?: string
}

const posts = computed(() => (recentPosts as RecentPost[]) ?? [])
</script>

<template>
  <div class="recent-timeline">
    <div v-if="!posts.length" class="recent-empty">暂无近期文章。</div>
    <ol v-else class="timeline-list">
      <li v-for="post in posts" :key="post.url" class="timeline-item">
        <div class="timeline-date">
          <time :datetime="post.date">{{ post.date }}</time>
        </div>
        <div class="timeline-content">
          <a class="timeline-title" :href="post.url">{{ post.title }}</a>
          <span v-if="post.sectionLabel" class="timeline-tag">{{ post.sectionLabel }}</span>
        </div>
      </li>
    </ol>
  </div>
</template>

<style scoped>
.recent-timeline {
  margin: 16px 0 8px;
}

.recent-empty {
  padding: 12px 14px;
  border: 1px dashed var(--vp-c-divider);
  border-radius: 10px;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-soft);
}

.timeline-list {
  list-style: none;
  padding: 0;
  margin: 0;
  border-left: 2px solid var(--vp-c-divider);
}

.timeline-item {
  position: relative;
  padding: 4px 0 18px 22px;
}

.timeline-item::before {
  content: '';
  position: absolute;
  left: -5px;
  top: 10px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
}

.timeline-date {
  font-size: 13px;
  color: var(--vp-c-text-2);
  font-variant-numeric: tabular-nums;
}

.timeline-content {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 6px;
}

.timeline-title {
  font-weight: 600;
  color: var(--vp-c-text-1);
  text-decoration: none;
}

.timeline-title:hover {
  color: var(--vp-c-brand-1);
}

.timeline-tag {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 999px;
  background: var(--vp-c-bg-alt);
  color: var(--vp-c-text-2);
  border: 1px solid var(--vp-c-divider);
}

@media (max-width: 640px) {
  .timeline-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
}
</style>
