import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { blogPosts } from '../src/data/blogPosts.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const clientRoot = resolve(__dirname, '..')
const distRoot = resolve(clientRoot, 'dist')
const template = await readFile(resolve(distRoot, 'index.html'), 'utf8')

const routes = [
  {
    path: 'resources',
    title: 'Interview Resources | InterviewArc',
    description: 'Read interview preparation guides for Amazon interviews, technical rounds, HR questions, and AI mock interview practice.',
    keywords: 'interview preparation blog, Amazon interview guide, technical interview tips, HR interview questions',
  },
  ...blogPosts.map((post) => ({
    path: `resources/${post.slug}`,
    title: `${post.title} | InterviewArc`,
    description: post.excerpt,
    keywords: post.keywords,
  })),
]

const escapeAttribute = (value) =>
  value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')

const injectSeo = (html, route) =>
  html
    .replace(/<title>.*?<\/title>/, `<title>${escapeAttribute(route.title)}</title>`)
    .replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/>/, `<meta name="description" content="${escapeAttribute(route.description)}" />`)
    .replace(/<meta\s+name="keywords"\s+content="[^"]*"\s*\/>/, `<meta name="keywords" content="${escapeAttribute(route.keywords)}" />`)
    .replace(/<meta\s+property="og:title"\s+content="[^"]*"\s*\/>/, `<meta property="og:title" content="${escapeAttribute(route.title)}" />`)
    .replace(/<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/, `<meta property="og:description" content="${escapeAttribute(route.description)}" />`)
    .replace(/<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/>/, `<meta name="twitter:title" content="${escapeAttribute(route.title)}" />`)
    .replace(/<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/>/, `<meta name="twitter:description" content="${escapeAttribute(route.description)}" />`)
    .replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/>/, `<link rel="canonical" href="/${route.path}" />`)

await Promise.all(
  routes.map(async (route) => {
    const routeDir = resolve(distRoot, route.path)
    await mkdir(routeDir, { recursive: true })
    await writeFile(resolve(routeDir, 'index.html'), injectSeo(template, route))
  }),
)

console.log(`Generated ${routes.length} static SEO pages.`)
