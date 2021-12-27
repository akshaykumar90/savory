<template>
  <form action="#" method="POST">
    <div class="shadow overflow-hidden rounded-md">
      <div class="px-4 py-5 bg-white p-6">
        <div class="flex flex-col gap-6">
          <div>
            <label
              for="bookmark-title"
              class="block text-sm font-medium text-gray-700"
              >Title</label
            >
            <input
              type="text"
              name="bookmark-title"
              id="bookmark-title"
              v-model="title"
              class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm text-sm border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label
              for="bookmark-url"
              class="block text-sm font-medium text-gray-700"
              >URL</label
            >
            <input
              type="text"
              name="bookmark-url"
              id="bookmark-url"
              v-model="url"
              class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm text-sm border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>
      <div class="px-4 py-3 bg-gray-50 text-right">
        <button
          type="submit"
          class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Save
        </button>
      </div>
    </div>
  </form>
</template>

<script>
export default {
  name: 'edit-panel',
  setup() {
    return {
      title:
        'How QuintoAndar increased conversion rates and pages per session by improving page performance',
      url: 'https://web.dev/quintoandar/',
      newTag: '',
      tags: ['frontend', 'books', 'performance', 'nextjs'],
    }
  },
}
</script>
