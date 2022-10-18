export function addXsrfHeader(config) {
  return chrome.cookies
    .get({
      url: process.env.API_COOKIES_URL,
      name: config.xsrfCookieName,
    })
    .then((cookie) => {
      if (cookie) {
        config.headers[config.xsrfHeaderName] = cookie.value
      }
      return config
    })
}
