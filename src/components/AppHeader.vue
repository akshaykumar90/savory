<template>
  <Disclosure as="nav" class="bg-white border-b" v-slot="{ open }">
    <div class="px-2 sm:px-4 lg:px-8">
      <div class="relative flex items-center justify-between h-16">
        <!-- Logo section -->
        <div class="flex items-center px-2 lg:px-0 xl:w-64">
          <div class="flex-shrink-0">
            <a href="#">
              <img
                class="h-14 w-auto"
                src="../assets/logo_light.svg"
                alt="Savory"
              />
            </a>
          </div>
        </div>

        <!-- Search section -->
        <div class="flex-1 flex justify-center lg:justify-end">
          <div class="w-full px-2 lg:px-6">
            <label for="search" class="sr-only">Search bookmarks</label>
            <div
              class="relative text-black-200 focus-within:text-gray-400 h-[46px]"
            >
              <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              >
                <SearchIcon class="h-5 w-5" aria-hidden="true" />
              </div>
              <input
                id="search"
                name="search"
                class="block w-full h-full pl-10 pr-3 py-2 border border-transparent rounded-md leading-5 bg-gray-400 bg-opacity-25 text-black-100 placeholder-black-200 focus:outline-none focus:bg-white focus:ring-0 focus:placeholder-gray-400 focus:text-gray-900 sm:text-sm"
                placeholder="Search bookmarks"
                type="search"
              />
            </div>
          </div>
        </div>
        <div class="flex lg:hidden">
          <!-- Mobile menu button -->
          <DisclosureButton
            class="bg-white-600 inline-flex items-center justify-center p-2 rounded-md text-black-400 hover:text-white hover:bg-black-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white"
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
            <Menu as="div" class="ml-4 relative flex-shrink-0">
              <div>
                <MenuButton
                  class="bg-indigo-700 flex text-sm rounded-full text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-700 focus:ring-white"
                >
                  <span class="sr-only">Open user menu</span>
                  <span
                    class="inline-block h-8 w-8 rounded-full overflow-hidden bg-blue-800"
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
                  class="origin-top-right absolute z-10 right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
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
      <div class="pt-4 pb-3 border-t border-indigo-800">
        <div class="px-2">
          <DisclosureButton
            as="a"
            href="#"
            class="block px-3 py-2 rounded-md text-base font-medium text-indigo-200 hover:text-indigo-100 hover:bg-indigo-600"
            >Your Profile</DisclosureButton
          >
          <DisclosureButton
            as="a"
            href="#"
            class="mt-1 block px-3 py-2 rounded-md text-base font-medium text-indigo-200 hover:text-indigo-100 hover:bg-indigo-600"
            >Sign out</DisclosureButton
          >
        </div>
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
</script>
