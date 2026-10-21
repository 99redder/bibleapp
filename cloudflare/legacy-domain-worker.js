// Runs on the old domains (bibleplannerapp.com, bibleplanapp.com).
// Page loads get a permanent redirect to biblereadingplan.app. Everything else
// (service worker, app assets, Bible JSON) is proxied from the new domain, so
// apps installed from the old domain keep working and keep receiving updates.
// A redirect would break those apps: browsers refuse a redirected service worker.
const NEW_ORIGIN = 'https://biblereadingplan.app'

export default {
  async fetch(request) {
    const url = new URL(request.url)
    const target = NEW_ORIGIN + url.pathname + url.search

    if (isPageLoad(request, url)) {
      return Response.redirect(target, 301)
    }
    return fetch(new Request(target, request))
  }
}

function isPageLoad(request, url) {
  // Page paths (no file extension) always redirect, whatever the headers:
  // crawlers such as Google's site-move check send varying Sec-Fetch headers,
  // and installed apps never fetch them (their service worker serves pages from
  // cache). Files such as sw.js, index.html, and Bible JSON stay proxied unless
  // a browser opens one directly.
  if (!/\.[a-z0-9]+$/i.test(url.pathname)) return true
  return request.headers.get('Sec-Fetch-Mode') === 'navigate'
}
