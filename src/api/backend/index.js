export const clientConfig = {
  // `baseURL` will be prepended to `url` unless `url` is absolute.
  // It can be convenient to set `baseURL` for an instance of axios to pass relative URLs
  // to methods of that instance.
  baseURL: process.env.API_BASE_URL,

  // `timeout` specifies the number of milliseconds before the request times out.
  // If the request takes longer than `timeout`, the request will be aborted.
  timeout: 3000, // default is `0` (no timeout)

  // `withCredentials` indicates whether or not cross-site Access-Control requests
  // should be made using credentials
  withCredentials: true,

  // `xsrfCookieName` is the name of the cookie to use as a value for xsrf token
  xsrfCookieName: 'csrf_access_token',

  // `xsrfHeaderName` is the name of the http header that carries the xsrf token value
  xsrfHeaderName: 'X-CSRF-Token',

  //////////////////////////////////////////////////////////////////////////////
  // Below are custom options defined in client.js

  // Client will only retry these urls.
  urlsToRetry: ['/bookmarks/add'],

  // Total # of requests made will be `maxRetryCount` + 1
  maxRetryCount: 3,

  // Retry interval specified in ms. The client does random exponential backoff
  // on timeout errors. The gap gets larger and larger -- second request will be
  // made at 500ms, then 1000ms and the last request will be made 2s after the
  // first request.
  errorRetryInterval: 250,
}
