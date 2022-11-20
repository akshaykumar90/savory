<template>
  <div class="flex flex-grow flex-col overflow-y-auto bg-white pb-4">
    <div class="mt-5 flex flex-grow flex-col">
      <nav class="flex-1 space-y-1 bg-white px-2" aria-label="Sidebar">
        <router-link
          v-for="item in navigation"
          :key="item.name"
          :to="item.href"
          :class="[
            currentTab === item.name.toLowerCase()
              ? 'bg-gray-100 text-gray-900'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
            'group flex items-center rounded-md px-2 py-2 text-sm font-medium',
          ]"
        >
          <component
            :is="item.icon"
            :class="[
              item.current
                ? 'text-gray-500'
                : 'text-gray-400 group-hover:text-gray-500',
              'mr-3 h-6 w-6 flex-shrink-0',
            ]"
            aria-hidden="true"
          />
          <span class="flex-1">
            {{ item.name }}
          </span>
          <span
            v-if="item.count"
            :class="[
              item.current ? 'bg-white' : 'bg-gray-100 group-hover:bg-gray-200',
              'ml-3 inline-block rounded-full py-0.5 px-3 text-xs font-medium',
            ]"
          >
            {{ item.count }}
          </span>
        </router-link>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { navigation as navItems } from '../lib/navigation'

const route = useRoute()

const currentTab = computed(() => {
  if (route.name === 'tags') {
    return 'tags'
  }
  if (route.name !== 'home') {
    return null
  }
  if (route.query) {
    if (route.query.name) {
      const tags = Array.isArray(route.query.name)
        ? route.query.name
        : [route.query.name]
      let lowercaseTags = tags.map((x) => x.toLowerCase())
      if (lowercaseTags.includes('reading')) {
        return 'reading'
      } else if (lowercaseTags.includes('playlist')) {
        return 'playlist'
      }
    }
  }
  return 'bookmarks'
})

const navigation = navItems
</script>
