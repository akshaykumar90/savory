<template>
  <form class="space-y-4" @submit.prevent="onSubmit">
    <div>
      <div>
        <h3 class="text-lg font-medium leading-6 text-gray-900">Account</h3>
        <p class="mt-1 text-sm text-gray-500">Member since {{ memberSince }}</p>
      </div>
      <div class="mt-6 space-y-6">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700"
            >Name</label
          >
          <div class="mt-2">
            <input
              type="text"
              name="name"
              id="name"
              ref="nameInput"
              autocomplete="name"
              v-model="name"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-gray-700"
            >Email</label
          >
          <div class="mt-2">
            <input
              type="email"
              name="email"
              id="email"
              v-model="email"
              disabled=""
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 sm:text-sm"
            />
          </div>
          <p class="mt-2 text-sm text-gray-500" id="email-description">
            <a
              class="underline underline-offset-2"
              target="_blank"
              href="/feedback"
              >Contact us</a
            >
            to update your email.
          </p>
        </div>
      </div>
    </div>
    <div class="pt-5">
      <div class="flex justify-end">
        <button
          type="submit"
          :disabled="isUpdating"
          class="disable:pointer-events-none ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          Update
        </button>
      </div>
    </div>
  </form>
</template>

<script>
import { ref } from 'vue'
import { useUpdateUser } from '../composables/useUser'

export default {
  props: {
    name: String,
    email: String,
    createdAt: String,
  },
  setup(props) {
    const name = ref(props.name)
    const email = ref(props.email)

    const createdAtDate = new Date(props.createdAt)
    const options = { year: 'numeric', month: 'short', day: 'numeric' }
    const memberSince = createdAtDate.toLocaleDateString(undefined, options)

    const { isLoading, mutate } = useUpdateUser()

    const onSubmit = () => {
      if (name.value !== props.name) {
        mutate({ fullName: name.value })
      }
    }

    return {
      name,
      email,
      memberSince,
      onSubmit,
      isUpdating: isLoading,
    }
  },
}
</script>
