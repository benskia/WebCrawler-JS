const jsdom = require('jsdom');
const { JSDOM } = jsdom;

async function crawlPage(baseURL) {
  try {
    const response = await fetch(baseURL)
    if (response.status > 399) {
      console.log(`Fetch recieved error: ${response.status}`)
      return
    }
    if (response.headers.get('Content-Type') !== 'text/html') {
      console.log(`Fetch received Content-Type: ${response.headers.get('Content-Type')}`)
      return
    }
    console.log(`${response.body}`)
  } catch (error) {
    console.log(`Fetch error: ${error}`)
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
