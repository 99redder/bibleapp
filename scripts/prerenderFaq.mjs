// Runs after `vite build`: writes dist/faq/index.html, the English FAQ (src/pages/FaqStaticPage.jsx)
// as plain HTML that search engines can index, styled by the app's own stylesheet. The app's /#/faq
// is a hash route, which Google treats as the home page. The questions come from
// src/pages/faqQuestions.jsx, so this page and the in-app one can't drift apart.
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import react from '@vitejs/plugin-react'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'

const SITE = 'https://biblereadingplan.app'
const PAGE_URL = `${SITE}/faq/`
const TITLE = 'Frequently Asked Questions | Bible Reading Plan'
const DESCRIPTION =
  "Plain answers about the free Bible Reading Plan app: why there's no NIV, plans up to 10 years, changing or restarting a plan, and catching up on missed days."

const appHtml = await readFile('dist/index.html', 'utf8')
const stylesheet = appHtml.match(/href="(\/assets\/[^"]+\.css)"/)?.[1]
if (!stylesheet) throw new Error('No stylesheet found in dist/index.html (run vite build first)')

const vite = await createServer({
  configFile: false,
  plugins: [react()],
  appType: 'custom',
  server: { middlewareMode: true },
  logLevel: 'error'
})
let body, questions
try {
  const { FaqStaticPage } = await vite.ssrLoadModule('/src/pages/FaqStaticPage.jsx')
  const { QUESTIONS } = await vite.ssrLoadModule('/src/pages/faqQuestions.jsx')
  body = renderToStaticMarkup(createElement(FaqStaticPage))
  questions = QUESTIONS.map(({ question, answer }) => ({ question, answer: plainText(renderToStaticMarkup(answer)) }))
} finally {
  await vite.close()
}

// The answers' text without screenshots or markup, for the FAQPage structured data.
function plainText(html) {
  return html
    .replace(/<img[^>]*>/g, '')
    .replace(/<\/p>/g, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim()
}

const structuredData = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  url: PAGE_URL,
  mainEntity: questions.map(({ question, answer }) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: { '@type': 'Answer', text: answer }
  }))
}).replace(/</g, '\\u003c')

const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${TITLE}</title>
    <meta name="description" content="${DESCRIPTION}" />
    <link rel="canonical" href="${PAGE_URL}" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    <meta name="theme-color" content="#0284c7" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${PAGE_URL}" />
    <meta property="og:site_name" content="Bible Reading Plan" />
    <meta property="og:title" content="${TITLE}" />
    <meta property="og:description" content="${DESCRIPTION}" />
    <meta property="og:image" content="${SITE}/pwa-512x512.png" />
    <meta name="twitter:card" content="summary" />
    <link rel="stylesheet" href="${stylesheet}" />
    <script>
      // Same light/dark choice as the app (ThemeContext): the saved setting, else the system's.
      try {
        var saved = localStorage.getItem('darkMode')
        if (saved !== null ? JSON.parse(saved) : matchMedia('(prefers-color-scheme: dark)').matches) {
          document.documentElement.classList.add('dark')
        }
      } catch (e) {}
    </script>
    <script type="application/ld+json">${structuredData}</script>
  </head>
  <body>
    ${body}
  </body>
</html>
`

await mkdir('dist/faq', { recursive: true })
await writeFile('dist/faq/index.html', html)
console.log(`dist/faq/index.html: ${questions.length} questions, ${stylesheet}`)
