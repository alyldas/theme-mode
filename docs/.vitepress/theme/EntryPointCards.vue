<script setup lang="ts">
defineProps<{
  items: Array<{
    path: string
    title: string
    bestFor: string
    details: string
    importLine: string
  }>
}>()
</script>

<template>
  <div class="entry-point-cards">
    <article v-for="item in items" :key="item.path" class="entry-point-card">
      <code class="entry-point-card__path">{{ item.path }}</code>
      <h3 class="entry-point-card__title">{{ item.title }}</h3>
      <p class="entry-point-card__best-for">{{ item.bestFor }}</p>
      <p class="entry-point-card__details">{{ item.details }}</p>
      <code class="entry-point-card__import">{{ item.importLine }}</code>
    </article>
  </div>
</template>

<style scoped>
.entry-point-cards {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin: 24px 0;
}

.entry-point-card {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 18px;
}

.entry-point-card__path {
  color: var(--vp-c-brand-1);
  display: block;
  font-size: 0.95rem;
  margin-bottom: 10px;
}

.entry-point-card__title {
  color: var(--vp-c-text-1);
  font-size: 1.05rem;
  line-height: 1.3;
  margin: 0 0 8px;
}

.entry-point-card__best-for {
  color: var(--vp-c-text-1);
  font-weight: 600;
  margin: 0 0 6px;
}

.entry-point-card__details {
  color: var(--vp-c-text-2);
  margin: 0 0 12px;
}

.entry-point-card__import {
  background: var(--vp-c-default-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  color: var(--vp-c-text-1);
  display: block;
  font-size: 0.92rem;
  overflow-x: auto;
  padding: 10px 12px;
  white-space: nowrap;
}

@media (max-width: 959px) {
  .entry-point-cards {
    grid-template-columns: 1fr;
  }
}
</style>
