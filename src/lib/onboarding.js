import OnboardingSaveLink from '../pages/onboarding/SaveLink.vue'
import OnboardingAddTags from '../pages/onboarding/AddTags.vue'
import OnboardingFilterTags from '../pages/onboarding/FilterTags.vue'
import OnboardingNeedHelp from '../pages/onboarding/NeedHelp.vue'
import OnboardingInstallExtension from '../pages/onboarding/InstallExtension.vue'
import OnboardingLayout from '../layouts/OnboardingLayout.vue'

export const chromeWebStoreUrl = `https://chrome.google.com/webstore/detail/savory/${process.env.EXTENSION_ID}`

const screens = [
  OnboardingSaveLink,
  OnboardingAddTags,
  OnboardingFilterTags,
  OnboardingNeedHelp,
  OnboardingInstallExtension,
]

export const totalScreensNum = screens.length

export function getOnboardingRoutes() {
  let routes = []
  screens.forEach((item, index) => {
    let path = index === 0 ? '/welcome' : `/welcome/${index + 1}`
    routes.push({
      path: path,
      name: item.name,
      component: item,
      meta: {
        layout: OnboardingLayout,
        requiredAuthState: 'login',
      },
    })
  })
  return routes
}

export function getPosition(screenName) {
  let found = -1
  screens.forEach((item, index) => {
    if (item.name === screenName) {
      found = index
    }
  })
  return found + 1
}
