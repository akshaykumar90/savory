const amplitude = require('amplitude-js')

export const EVENT_LANDING_LOAD = 'registration - app landing load'
export const EVENT_LANDING_CTA = 'registration - app landing cta'
export const EVENT_SIGNUP_SUCCESS = 'registration - successful signup'

export const eventLogger = amplitude.getInstance()
