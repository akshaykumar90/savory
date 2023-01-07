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

        <!-- Optional search section -->
        <slot />

        <div class="flex lg:hidden">
          <!-- Mobile menu button -->
          <DisclosureButton
            class="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <span class="sr-only">Open main menu</span>
            <Bars3Icon v-if="!open" class="block h-6 w-6" aria-hidden="true" />
            <XMarkIcon v-else class="block h-6 w-6" aria-hidden="true" />
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
                  <MenuItem
                    v-for="link in appLinks"
                    :key="link.name"
                    v-slot="{ active }"
                  >
                    <router-link
                      :to="link.href"
                      :class="[
                        active ? 'bg-gray-100' : '',
                        'block px-4 py-2 text-sm text-gray-700',
                      ]"
                      >{{ link.name }}</router-link
                    >
                  </MenuItem>
                  <MenuItem
                    v-for="link in outboundLinks"
                    :key="link.name"
                    v-slot="{ active }"
                  >
                    <a
                      :href="link.href"
                      target="_blank"
                      :class="[
                        active ? 'bg-gray-100' : '',
                        'block px-4 py-2 text-sm text-gray-700',
                      ]"
                      >{{ link.name }}</a
                    >
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                    <a
                      href="#"
                      @click.prevent="logout"
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
        <router-link
          v-for="item in navigation"
          :key="item.name"
          :to="item.href"
        >
          <DisclosureButton
            as="div"
            class="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
          >
            {{ item.name }}
          </DisclosureButton>
        </router-link>
      </div>
      <div class="space-y-1 border-t border-gray-200 pt-2 pb-3">
        <router-link v-for="link in appLinks" :key="link.name" :to="link.href">
          <DisclosureButton
            as="div"
            class="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
          >
            {{ link.name }}
          </DisclosureButton>
        </router-link>
        <DisclosureButton
          v-for="link in outboundLinks"
          :key="link.name"
          as="a"
          :href="link.href"
          target="_blank"
          class="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
        >
          {{ link.name }}
        </DisclosureButton>
        <DisclosureButton
          as="a"
          href="#"
          @click.prevent="logout"
          class="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
        >
          Sign out
        </DisclosureButton>
      </div>
    </DisclosurePanel>
  </Disclosure>
</template>

<script>
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/vue'
import { MagnifyingGlassIcon } from '@heroicons/vue/20/solid'
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'
import {
  appLinks,
  outboundLinks,
  navigation as navItems,
} from '../lib/navigation'

import { useAuth } from '../auth'

export default {
  components: {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    MagnifyingGlassIcon,
    Bars3Icon,
    XMarkIcon,
  },
  setup() {
    const authStore = useAuth()

    const { logout } = authStore

    return {
      logout,
      navigation: navItems,
      appLinks,
      outboundLinks,
    }
  },
}
</script>
