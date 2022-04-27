<template>
  <div class="flex flex-grow flex-col overflow-y-auto bg-white pb-4">
    <div class="mt-5 flex flex-grow flex-col">
      <nav class="flex-1 space-y-1 bg-white px-2" aria-label="Sidebar">
        <router-link
          v-for="item in navigation"
          :key="item.name"
          :to="item.href"
          :class="[
            item.current
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
import { FolderIcon, InboxIcon } from '@heroicons/vue/outline'

const navigation = [
  { name: 'Bookmarks', icon: InboxIcon, href: '/', current: false },
  { name: 'Tags', icon: FolderIcon, href: '/tags', current: false },
]
</script>
