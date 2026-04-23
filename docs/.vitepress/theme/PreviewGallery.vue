<script setup lang="ts">
defineProps<{
  items: Array<{
    src: string
    alt: string
  }>
}>()
</script>

<template>
  <div class="landing-gallery">
    <img
      v-for="item in items"
      :key="item.src"
      :src="item.src"
      :alt="item.alt"
      decoding="async"
      loading="lazy"
    />
  </div>
</template>

<style scoped>
.landing-gallery {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin: 24px 0 8px;
}

.landing-gallery img {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  display: block;
  width: 100%;
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
