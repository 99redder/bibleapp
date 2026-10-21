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

    if (isPageLoad(request)) {
      return Response.redirect(target, 301)
    }
    return fetch(new Request(target, request))
  }
}

function isPageLoad(request) {
  const mode = request.headers.get('Sec-Fetch-Mode')
  if (mode) return mode === 'navigate'
  // Crawlers and older browsers don't send Sec-Fetch-Mode.
  return request.method === 'GET' && (request.headers.get('Accept') || '').includes('text/html')
}
