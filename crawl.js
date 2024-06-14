const jsdom = require('jsdom');
const { JSDOM } = jsdom;

async function crawlPage(baseURL, currentURL = baseURL, pages = {}) {
  // We're only crawling the targeted host (baseURL).
  const baseURLObj = new URL(baseURL)
  const currentURLObj = new URL(currentURL)
  if (baseURLObj.hostname !== currentURLObj.hostname) {
    return pages
  }

  // We want to track repeat URLs for our report, but we don't want to re-crawl.
  const normalizedCurrentURL = normalizeURL(currentURL)
  if (pages[normalizedCurrentURL] > 0) {
    pages[normalizedCurrentURL]++
    return pages
  }
  pages[normalizedCurrentURL] = 1

  console.log(`Crawling: ${currentURL}`)
  const htmlBody = await fetchHTML(currentURL)
  if (htmlBody === '') {
    return pages
  }
  const nextURLs = getURLsFromHTML(htmlBody, baseURL)
  for (const nextURL of nextURLs) {
    pages = await crawlPage(baseURL, nextURL, pages)
  }
  return pages
}

async function fetchHTML(currentURL) {
  try {
    const response = await fetch(currentURL)
    const status = response.status
    if (status > 399) {
      console.log(`Error in fetch with status code: ${status} on page: ${currentURL}`)
      return ''
    }
    const contentType = response.headers.get('Content-Type')
    if (!contentType.includes('text/html')) {
      console.log(`Error in fetch with Content-Type: ${contentType} on page: ${currentURL}`)
      return ''
    }
    return await response.text()
  } catch (error) {
    console.log(`Error in fetch: ${error.message} on page: ${currentURL}`)
    return ''
  }
}

function getURLsFromHTML(htmlBody, baseURL) {
  const links = []
  const dom = new JSDOM(htmlBody)
  const linkElements = dom.window.document.querySelectorAll('a')
  for (const linkElement of linkElements) {
    if (linkElement.href.slice(0, 1) === '/') {
      // relative link
      try {
        const urlObj = new URL(`${baseURL}${linkElement.href}`)
        links.push(urlObj.href)
      } catch (error) {
        console.log(`Error with relative URL: ${error.message}`)
      }
    } else {
      // absolute link
      try {
        const urlObj = new URL(linkElement.href)
        links.push(urlObj.href)
      } catch (error) {
        console.log(`Error with absolute URL: ${error.message}`)
      }
    }
  }
  return links
}

function normalizeURL(urlString) {
  const urlObj = new URL(urlString)
  const hostPath = `${urlObj.hostname}${urlObj.pathname}`
  if (hostPath.length > 0 && hostPath.slice(-1) === '/') {
    return hostPath.slice(0, -1)
  }
  return hostPath
}

module.exports = {
  crawlPage,
  getURLsFromHTML,
  normalizeURL,
};
