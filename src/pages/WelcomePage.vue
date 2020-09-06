<template>
  <div class="leading-normal">
    <ProgressBar ref="bar" />
    <section class="max-w-3xl mx-auto px-4" v-if="title">
      <div class="flex flex-col items-center text-center py-8">
        <h3 class="text-3xl mt-12 mb-8 text-gray-800">
          {{ title }}
        </h3>
        <p class="text-xl text-gray-700 mb-4 w-3/4">
          {{ subtitle }}
        </p>
        <button
          class="mt-4 bg-primary hover:bg-blue-700 text-lg tracking-wide text-white py-2 px-4 rounded select-none focus:outline-none"
          @click="onButtonClicked"
        >
          {{ buttonText }}
        </button>
        <p class="text-xs leading-5 mt-4 text-gray-700">
          <a href="#" @click="takeMeToTheApp" class="underline">Maybe Later</a>
        </p>
      </div>
    </section>
  </div>
</template>

<script>
import ProgressBar from '../components/ProgressBar.vue'
import { loadUserData, markBookmarksImported } from '../api/mongodb'
import { isChrome, isExtensionInstalled } from '../api/browser'

const chromeWebStoreUrl = `https://chrome.google.com/webstore/detail/savory/${process.env.EXTENSION_ID}`

export default {
  name: 'welcome-page',

  data: function () {
    return {
      title: '',
      subtitle: '',
      buttonText: '',
      buttonAction: undefined,
      userData: undefined,
      isChrome: undefined,
      extensionInstalled: undefined,
    }
  },

  components: {
    ProgressBar,
  },

  methods: {
    onButtonClicked() {
      switch (this.buttonAction) {
        case 'install':
          window.open(chromeWebStoreUrl, '_blank')
          break
        case 'import':
          this.startImport()
          break
        default:
        // noop
      }
    },
    step() {
      switch (true) {
        case this.isChrome && !this.extensionInstalled:
          this.buttonAction = 'install'
          this.promptInstall()
          break
        case !this.userData && this.isChrome && this.extensionInstalled:
        case this.userData &&
          !this.userData.is_chrome_imported &&
          this.isChrome &&
          this.extensionInstalled:
          this.buttonAction = 'import'
          this.promptImport()
          break
        default:
          this.buttonAction = undefined
          this.takeMeToTheApp()
      }
    },
    takeMeToTheApp() {
      this.$refs.bar.finish()
      this.$store.dispatch('SYNC_BOOKMARKS')
      this.$router.replace({ name: 'app' })
    },
    promptInstall() {
      this.$refs.bar.finish()
      this.title = 'Install web extension'
      this.subtitle =
        'For best experience, add Savory’s web extension to Chrome.'
      this.buttonText = 'Add to Chrome'
    },
    promptImport() {
      this.$refs.bar.finish()
      this.title = 'Import Bookmarks from Chrome'
      this.subtitle =
        'Your Chrome bookmarks will be added to your Savory’s collection'
      this.buttonText = 'Import Bookmarks'
    },
    errorScreen(errorText) {
      this.$refs.bar.finish()
      this.title = 'Something went wrong. Try again?'
      this.subtitle = errorText
    },
    async startImport() {
      this.title = ''
      this.$refs.bar.set(25)
      const importStartPercent = 25
      const importFinishPercent = 90
      this.unwatch = this.$store.watch(
        (state) => state.browser.importPercent,
        (newValue) => {
          this.$refs.bar.set(
            importStartPercent +
              newValue * (importFinishPercent - importStartPercent)
          )
        }
      )
      try {
        await this.$store.dispatch('IMPORT_BROWSER_BOOKMARKS')
        this.$refs.bar.set(90)
        await markBookmarksImported()
        this.takeMeToTheApp()
      } catch (e) {
        console.error('Something went wrong: ', e)
        this.$refs.bar.fail()
        this.errorScreen(e)
      }
    },
  },

  async mounted() {
    this.$refs.bar.set(5)
    this.$refs.bar.increase(10)
    this.userData = await loadUserData()
    this.$refs.bar.increase(10)
    this.step()
  },

  async created() {
    this.isChrome = isChrome()
    this.extensionInstalled = await isExtensionInstalled()
  },

  beforeDestroy() {
    if (this.unwatch !== undefined) {
      this.unwatch()
    }
  },
}
</script>
