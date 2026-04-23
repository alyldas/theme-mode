<script setup lang="ts">
defineProps<{
  items: Array<{
    src: string
    alt: string
    caption: string
  }>
}>()
</script>

<template>
  <div class="landing-gallery">
    <figure v-for="item in items" :key="item.src" class="landing-gallery__item">
      <img :src="item.src" :alt="item.alt" decoding="async" loading="lazy" />
      <figcaption>{{ item.caption }}</figcaption>
    </figure>
  </div>
</template>

<style scoped>
.landing-gallery {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin: 24px 0 8px;
}

.landing-gallery__item {
  margin: 0;
}

.landing-gallery img {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  display: block;
  margin-bottom: 10px;
  width: 100%;
}

.landing-gallery figcaption {
  color: var(--vp-c-text-2);
  font-size: 0.92rem;
  line-height: 1.4;
}

@media (max-width: 959px) {
  .landing-gallery {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 639px) {
  .landing-gallery {
    grid-template-columns: 1fr;
  }
}
</style>
