const { getDomain } = require('tldjs')

export function domainName(bookmarkURL) {
  const url = new URL(bookmarkURL)
  // Drop the subdomain, e.g. news.ycombinator.com -> ycombinator.com
  return getDomain(url.hostname)
}
