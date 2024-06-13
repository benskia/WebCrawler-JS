const jsdom = require('jsdom');
const { JSDOM } = jsdom;

function getURLsFromHTML(htmlBody, baseURL) {
  const dom = new JSDOM(htmlBody)
  const anchorTags = dom.window.document.querySelectorAll('a')
  const links = []
  for (const anchorTag of anchorTags) {
    if (anchorTag.href.slice(0, 1) === '/') {
      // relative link
      links.push(`${baseURL}${anchorTag.href}`)
    } else {
      // absolute link
      links.push(anchorTag.href)
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
  normalizeURL,
  getURLsFromHTML,
};
