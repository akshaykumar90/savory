<template>
  <Disclosure as="nav" class="border-b bg-white" v-slot="{ open }">
    <div class="px-2 sm:px-4 lg:px-8">
      <div class="relative flex h-16 items-center justify-between">
        <!-- Logo section -->
        <div class="flex items-center px-2 lg:px-0 xl:w-64">
          <div class="flex-shrink-0">
            <router-link to="/">
              <img
                class="h-14 w-auto"
                src="../assets/logo_light.svg"
                alt="Savory"
              />
            </router-link>
          </div>
        </div>

        <!-- Search section -->
        <div class="flex flex-1 justify-center lg:justify-end">
          <div class="w-full px-2 lg:px-6">
            <label for="search" class="sr-only">Search bookmarks</label>
            <div
              class="text-black-200 relative h-[46px] focus-within:text-gray-400"
            >
              <div
                class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
              >
                <SearchIcon class="h-5 w-5" aria-hidden="true" />
              </div>
              <input
                type="search"
                placeholder="Search bookmarks"
                autocomplete="off"
                spellcheck="false"
                id="search"
                name="search"
                class="text-black-100 placeholder-black-200 block h-full w-full rounded-md border border-transparent bg-gray-400 bg-opacity-25 py-2 pl-10 pr-3 leading-5 focus:bg-white focus:text-gray-900 focus:placeholder-gray-400 focus:outline-none focus:ring-1 sm:text-sm"
                v-model="query"
              />
            </div>
          </div>
        </div>
        <div class="flex lg:hidden">
          <!-- Mobile menu button -->
          <DisclosureButton
            class="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <span class="sr-only">Open main menu</span>
            <MenuIcon v-if="!open" class="block h-6 w-6" aria-hidden="true" />
            <XIcon v-else class="block h-6 w-6" aria-hidden="true" />
          </DisclosureButton>
        </div>
        <!-- Links section -->
        <div class="hidden lg:block lg:w-80">
          <div class="flex items-center justify-end">
            <!-- Profile dropdown -->
            <Menu as="div" class="relative ml-4 flex-shrink-0">
              <div>
                <MenuButton
                  class="flex rounded-full bg-indigo-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-700"
                >
                  <span class="sr-only">Open user menu</span>
                  <span
                    class="inline-block h-8 w-8 overflow-hidden rounded-full bg-blue-800"
                  >
                    <svg
                      class="h-full w-full text-gray-300"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  </span>
                </MenuButton>
              </div>
              <transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <MenuItems
                  class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                >
                  <MenuItem v-slot="{ active }">
                    <a
                      href="#"
                      :class="[
                        active ? 'bg-gray-100' : '',
                        'block px-4 py-2 text-sm text-gray-700',
                      ]"
                      >View Profile</a
                    >
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                    <a
                      href="#"
                      :class="[
                        active ? 'bg-gray-100' : '',
                        'block px-4 py-2 text-sm text-gray-700',
                      ]"
                      >Logout</a
                    >
                  </MenuItem>
                </MenuItems>
              </transition>
            </Menu>
          </div>
        </div>
      </div>
    </div>

    <DisclosurePanel class="lg:hidden">
      <div class="space-y-1 pt-2 pb-3">
        <DisclosureButton
          as="a"
          href="#"
          class="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
        >
          Inbox
        </DisclosureButton>
        <DisclosureButton
          as="a"
          href="#"
          class="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
        >
          Reading
        </DisclosureButton>
        <DisclosureButton
          as="a"
          href="#"
          class="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
        >
          Watching
        </DisclosureButton>
      </div>
      <div class="space-y-1 border-t border-gray-200 pt-2 pb-3">
        <DisclosureButton
          as="a"
          href="#"
          class="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
        >
          Your Profile
        </DisclosureButton>
        <DisclosureButton
          as="a"
          href="#"
          class="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
        >
          Sign out
        </DisclosureButton>
      </div>
    </DisclosurePanel>
  </Disclosure>
</template>

<script setup>
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/vue'
import { SearchIcon } from '@heroicons/vue/solid'
import { MenuIcon, XIcon } from '@heroicons/vue/outline'
import { ref, watch } from 'vue'

import _ from 'lodash'
import { useRoute, useRouter } from 'vue-router'
import { usePageStore } from '../stores/page'

const router = useRouter()
const route = useRoute()
const store = usePageStore()

let query = ref('')

watch(
  query,
  _.debounce(function () {
    let q = query.value.trim()
    if (q) {
      store.updateSearch(q, router)
    } else {
      router.push('/')
    }
  }, 300)
)

watch(
  () => route.path,
  (path) => {
    if (path !== '/search') {
      query.value = ''
    } else {
      query.value = route.query.q
    }
  }
)
</script>
