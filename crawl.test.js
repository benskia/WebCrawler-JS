const { test, expect } = require('@jest/globals');
const { normalizeURL, getURLsFromHTML } = require('./crawl');

test('normalizeURL strip protocol', () => {
  const input = 'https://blog.boot.dev/path'
  const actual = normalizeURL(input)
  const expected = 'blog.boot.dev/path'
  expect(actual).toEqual(expected)
})

test('normalizeURL strip trailing slash', () => {
  const input = 'https://blog.boot.dev/path/'
  const actual = normalizeURL(input)
  const expected = 'blog.boot.dev/path'
  expect(actual).toEqual(expected)
})

test('normalizeURL capitals', () => {
  const input = 'https://BLOG.boot.dev/path/'
  const actual = normalizeURL(input)
  const expected = 'blog.boot.dev/path'
  expect(actual).toEqual(expected)
})

test('getURLsFromHTML absolute', () => {
  const input = `
<html>
    <body>
        <a href="https://blog.boot.dev"><span>Go to Boot.dev</span></a>
    </body>
</html>
`
  const inputBaseURL = 'https://blog.boot.dev'
  const actual = getURLsFromHTML(input, inputBaseURL)
  const expected = ['https://blog.boot.dev/']
  expect(actual).toEqual(expected)
})

test('getURLsFromHTML relative', () => {
  const input = `
<html>
    <body>
        <a href="/path/"><span>Go to Boot.dev</span></a>
    </body>
</html>
`
  const inputBaseURL = 'https://blog.boot.dev'
  const actual = getURLsFromHTML(input, inputBaseURL)
  const expected = ['https://blog.boot.dev/path/']
  expect(actual).toEqual(expected)
})

test('getURLsFromHTML both', () => {
  const input = `
<html>
    <body>
        <a href="https://blog.boot.dev"><span>Go to Boot.dev</span></a>
        <a href="/path/"><span>Go to Boot.dev</span></a>
    </body>
</html>
`
  const inputBaseURL = 'https://blog.boot.dev'
  const actual = getURLsFromHTML(input, inputBaseURL)
  const expected = ['https://blog.boot.dev/', 'https://blog.boot.dev/path/']
  expect(actual).toEqual(expected)
})
