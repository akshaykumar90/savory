const amplitude = require('amplitude-js')

export const EVENT_LANDING_LOAD = 'registration - load landing page'
export const EVENT_SIGNUP_CTA = 'registration - click cta'
export const EVENT_SIGNUP_SUCCESS = 'registration - successful signup'
export const EVENT_ONBOARDING_START = 'onboarding - start'
export const EVENT_ONBOARDING_INSTALL_EXT = 'onboarding - install extension'
export const EVENT_ONBOARDING_IMPORT_BOOKMARKS = 'onboarding - import bookmarks'
export const EVENT_APP_LOAD = 'webapp - load'

export const eventLogger = amplitude.getInstance()
