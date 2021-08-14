const amplitude = require('amplitude-js')

export const EVENT_LANDING_LOAD = 'registration - load landing page'
export const EVENT_SIGNUP_CTA = 'registration - click cta'
export const EVENT_SIGNUP_SUCCESS = 'registration - successful signup'

export const EVENT_ONBOARDING_SAVE_LINK = 'onboarding - save link'
export const EVENT_ONBOARDING_ADD_TAGS = 'onboarding - add tags'
export const EVENT_ONBOARDING_FILTER_TAGS = 'onboarding - filter tags'
export const EVENT_ONBOARDING_NEED_HELP = 'onboarding - need help'
export const EVENT_ONBOARDING_INSTALL_EXT = 'onboarding - install extension'

export const eventLogger = amplitude.getInstance()
