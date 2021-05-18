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
          class="
            mt-4
            bg-primary
            hover:bg-blue-700
            text-lg
            tracking-wide
            text-white
            py-2
            px-4
            rounded
            select-none
            focus:outline-none
          "
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
import { isChrome, isExtensionInstalled } from '../api/browser'
import {
  EVENT_ONBOARDING_IMPORT_BOOKMARKS,
  EVENT_ONBOARDING_INSTALL_EXT,
  EVENT_ONBOARDING_START,
  EVENT_SIGNUP_SUCCESS,
  eventLogger,
} from '../api/events'

const chromeWebStoreUrl = `https://chrome.google.com/webstore/detail/savory/${process.env.EXTENSION_ID}`
const progressBarPercent = {
  IMPORT_START: 25,
  IMPORT_FINISH: 75,
  SYNC_START: 85,
  SYNC_FINISH: 95,
}

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
      startEventRecorded: false,
    }
  },

  components: {
    ProgressBar,
  },

  methods: {
    onButtonClicked() {
      switch (this.buttonAction) {
        case 'install':
          eventLogger.logEvent(EVENT_ONBOARDING_INSTALL_EXT)
          window.open(chromeWebStoreUrl, '_blank')
          break
        case 'import':
          eventLogger.logEvent(EVENT_ONBOARDING_IMPORT_BOOKMARKS)
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
      // TODO: This may be a UX regression. Earlier, user would see bookmarks
      //  already loaded. Now they may have to wait.
      this.$refs.bar.finish()
      this.$router.replace({ name: 'app' })
    },
    promptInstall() {
      this.$refs.bar.finish()
      this.title = 'Install web extension'
      this.subtitle =
        'For best experience, add Savory’s web extension to Chrome.'
      this.buttonText = 'Add to Chrome'
      if (!this.startEventRecorded) {
        this.startEventRecorded = true
        eventLogger.logEvent(EVENT_ONBOARDING_START)
      }
    },
    promptImport() {
      this.$refs.bar.finish()
      this.title = 'Import Bookmarks from Chrome'
      this.subtitle =
        'Your Chrome bookmarks will be added to your Savory’s collection'
      this.buttonText = 'Import Bookmarks'
      if (!this.startEventRecorded) {
        this.startEventRecorded = true
        eventLogger.logEvent(EVENT_ONBOARDING_START)
      }
    },
    errorScreen(errorText) {
      this.$refs.bar.finish()
      this.title = 'Something went wrong. Try again?'
      this.subtitle = errorText
    },
    async startImport() {
      this.title = ''
      this.$refs.bar.set(progressBarPercent.IMPORT_START)
      this.unwatch = this.$store.watch(
        (state) => state.browser.importPercent,
        (newValue) => {
          this.$refs.bar.set(
            progressBarPercent.IMPORT_START +
              newValue *
                (progressBarPercent.IMPORT_FINISH -
                  progressBarPercent.IMPORT_START)
          )
        }
      )
      try {
        await this.$store.dispatch('IMPORT_BROWSER_BOOKMARKS')
        this.$refs.bar.set(progressBarPercent.IMPORT_FINISH)
        await ApiClient.markBookmarksImported()
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
    this.userData = await ApiClient.loadUserData()
    this.$refs.bar.increase(10)
    if (!this.userData) {
      // We provide `/provider_cb` as the success callback to Auth0 which
      // redirects to this page. We use empty userData as a proxy for new
      // user.
      eventLogger.logEvent(EVENT_SIGNUP_SUCCESS)
    }
    // This cannot be loaded in `created` because Vue does not wait to resolve
    // async code before moving forward with lifecycle hooks.
    this.extensionInstalled = await isExtensionInstalled()
    this.step()
  },

  async created() {
    this.isChrome = isChrome()
  },

  beforeDestroy() {
    if (this.unwatch !== undefined) {
      this.unwatch()
    }
  },
}
</script>
