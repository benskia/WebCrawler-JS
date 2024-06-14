const jsdom = require('jsdom');
const { JSDOM } = jsdom;

async function crawlPage(currentURL) {
  console.log(`Crawling: ${currentURL}`)
  try {
    const response = await fetch(currentURL)
    const status = response.status
    if (status > 399) {
      console.log(`Error in fetch with status code: ${status} on page: ${currentURL}`)
      return
    }
    const contentType = response.headers.get('Content-Type')
    if (contentType !== 'text/html; charset=utf-8') {
      console.log(`Error in fetch with Content-Type: ${contentType} on page: ${currentURL}`)
      return
    }
    console.log(await response.text())
  } catch (error) {
    console.log(`Error in fetch: ${error.message} on page: ${currentURL}`)
  }
}

function getURLsFromHTML(htmlBody, baseURL) {
  const dom = new JSDOM(htmlBody)
  const anchorTags = dom.window.document.querySelectorAll('a')
  const links = []
  for (const anchorTag of anchorTags) {
    if (anchorTag.href.slice(0, 1) === '/') {
      // relative link
      try {
        const urlObj = new URL(`${baseURL}${anchorTag.href}`)
        links.push(urlObj.href)
      } catch (error) {
        console.log(`Error with relative URL: ${error.message}`)
      }
    } else {
      // absolute link
      try {
        const urlObj = new URL(anchorTag.href)
        links.push(urlObj.href)
      } catch (error) {
        console.log(`Error with relative URL: ${error.message}`)
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
