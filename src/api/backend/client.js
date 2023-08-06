import axios from 'axios'

export class Client {
  constructor(authStore, clientConfig, reqInterceptor) {
    this.auth = authStore
    const { maxRetryCount, errorRetryInterval, urlsToRetry, ...axiosConfig } =
      clientConfig
    this.maxRetryCount = maxRetryCount || 3
    this.errorRetryInterval = errorRetryInterval || 250
    this.urlsToRetry = urlsToRetry || []
    this.instance = axios.create(axiosConfig)
    if (reqInterceptor) {
      this.instance.interceptors.request.use(reqInterceptor)
    }
    // For tests
    this.requestTimes = []
  }

  onAuthErrorRetry(config, error) {
    if (config.doNotRefreshOnFailure) {
      this.auth.expireToken()
      throw error
    }
    return this.auth.tryRefreshToken().then(() => {
      return this._request({
        ...config,
        doNotRefreshOnFailure: true,
      })
    })
  }

  onErrorRetry({ retryCount, ...config }, error) {
    const maxRetryCount = this.maxRetryCount
    const currentRetryCount = retryCount
    if (currentRetryCount > maxRetryCount) {
      return Promise.reject(error)
    }

    // Exponential backoff
    const timeout =
      ~~((Math.random() + 0.5) * (1 << Math.min(currentRetryCount, 8))) *
      this.errorRetryInterval

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          this._request({
            ...config,
            retryCount: retryCount + 1,
          })
        )
      }, timeout)
    })
  }

  _request(config) {
    this.requestTimes.push(Date.now())
    return this.instance.request(config).catch((error) => {
      if (error.response && error.response.status === 401) {
        return this.onAuthErrorRetry(config, error)
      }
      if (
        error.request &&
        (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED')
      ) {
        if (this.urlsToRetry.includes(config.url)) {
          return this.onErrorRetry(
            {
              ...config,
              retryCount: config.retryCount || 1,
            },
            error
          )
        }
      }
      throw error
    })
  }

  _get(url) {
    return this._request({ method: 'get', url })
  }

  _put(url, data) {
    return this._request({ method: 'put', url, data })
  }

  _post(url, data) {
    return this._request({ method: 'post', url, data })
  }

  _delete(url, data) {
    return this._request({ method: 'delete', url, data })
  }

  ////////////////////////////////////////////////////////////////////////////

  getBookmark({ bookmark_id }) {
    return this._get(`/bookmarks/${bookmark_id}`)
  }

  getBookmarks({ tags, site, num, cursor, untagged }) {
    return this._post('/bookmarks/', { tags, site, num, cursor, untagged })
  }

  searchBookmarks({ query, tags, site, num, cursor, untagged }) {
    return this._post('/bookmarks/search', {
      query,
      tags,
      site,
      num,
      cursor,
      untagged,
    })
  }

  getTagsCount() {
    return this._get('/tags/')
  }

  getDrillDownTags({ tags, site }) {
    return this._post('/tags/recs', { tags, site })
  }

  saveTab({ title, url, dateAddedMs }) {
    return this._post('/bookmarks/add', { title, url, date_added: dateAddedMs })
  }

  deleteBookmarks({ bookmarkIds }) {
    return this._delete('/bookmarks/', {
      bookmark_ids: bookmarkIds,
    })
  }

  addTag({ bookmarkId, newTag }) {
    return this._post('/tags/', {
      name: newTag,
      bookmark_id: bookmarkId,
    })
  }

  bulkAddTag({ bookmarkIds, newTag }) {
    return this._post('/tags/bulk', {
      name: newTag,
      bookmark_ids: bookmarkIds,
    })
  }

  removeTag({ bookmarkId, tagToRemove }) {
    return this._delete('/tags/', {
      name: tagToRemove,
      bookmark_id: bookmarkId,
    })
  }

  bulkRemoveTag({ bookmarkIds, tagToRemove }) {
    return this._delete('/tags/bulk', {
      name: tagToRemove,
      bookmark_ids: bookmarkIds,
    })
  }

  loadUserData() {
    return this._get('/users/me')
  }

  updateUser({ fullName }) {
    return this._put('/users/me', {
      full_name: fullName,
    })
  }

  connectPocket() {
    return this._post('/users/pocket/connect')
  }

  disconnectPocket() {
    return this._post('/users/pocket/disconnect')
  }

  pocketCallback() {
    return this._post('/users/pocket/callback')
  }
}
