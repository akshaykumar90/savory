import axios from 'axios'

export class Client {
  constructor(authWrapper, clientConfig, reqInterceptor) {
    this.auth = authWrapper
    this.instance = axios.create(clientConfig)
    if (reqInterceptor) {
      this.instance.interceptors.request.use(reqInterceptor)
    }
  }

  async _request(config) {
    try {
      return await this.instance.request(config)
    } catch (error) {
      if (!error.response || error.response.status !== 403) {
        throw error
      }
      if (config.doNotRefreshOnFailure) {
        this.auth.expireToken()
        throw error
      }
      await this.auth.tryRefreshToken()
      return await this._request({
        ...config,
        doNotRefreshOnFailure: true,
      })
    }
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

  fetchRecent({ num, before }) {
    return this._post('/bookmarks/', { num, before })
  }

  getBookmarksWithTag({ tags, site, num, before }) {
    return this._post('/bookmarks/', { tags, site, num, before })
  }

  searchBookmarks({ query, num, skip, site, tags }) {
    return this._post('/bookmarks/search', { query, num, skip, site, tags })
  }

  getTagsCount() {
    return this._get('/tags/')
  }

  createBookmark({ bookmark }) {
    return this._post('/bookmarks/add', bookmark)
  }

  importBookmarks({ chunk }) {
    return this._post('/bookmarks/import', {
      bookmarks: chunk,
    })
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

  markBookmarksImported() {
    return this._put('/users/me', {
      is_chrome_imported: true,
    })
  }
}
