<template>
  <div class="flex flex-col flex-grow pb-4 bg-white overflow-y-auto">
    <div class="mt-5 flex-grow flex flex-col">
      <nav class="flex-1 px-2 bg-white space-y-1" aria-label="Sidebar">
        <a
          v-for="item in navigation"
          :key="item.name"
          :href="item.href"
          :class="[
            item.current
              ? 'bg-gray-100 text-gray-900'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
            'group flex items-center px-2 py-2 text-sm font-medium rounded-md',
          ]"
        >
          <component
            :is="item.icon"
            :class="[
              item.current
                ? 'text-gray-500'
                : 'text-gray-400 group-hover:text-gray-500',
              'mr-3 flex-shrink-0 h-6 w-6',
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
              'ml-3 inline-block py-0.5 px-3 text-xs font-medium rounded-full',
            ]"
          >
            {{ item.count }}
          </span>
        </a>
      </nav>
    </div>
  </div>
</template>

<script>
import { CalendarIcon, FolderIcon, InboxIcon } from '@heroicons/vue/outline'

const navigation = [
  { name: 'Inbox', icon: InboxIcon, href: '#', current: true },
  { name: 'Reading', icon: FolderIcon, href: '#', count: 3, current: false },
  { name: 'Playlist', icon: FolderIcon, href: '#', count: 4, current: false },
  { name: 'Recent', icon: CalendarIcon, href: '#', current: false },
]

export default {
  setup() {
    return {
      navigation,
    }
  },
}
</script>
