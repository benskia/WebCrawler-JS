const { test, expect } = require('@jest/globals');
const { sortPages } = require('./report');

test('sortPages', () => {
  const input = {
    'https://blog.boot.dev/path': 2,
    'https://blog.boot.dev': 1,
    'https://blog.boot.dev/path2': 5,
    'https://blog.boot.dev/path3': 4,
    'https://blog.boot.dev/path4': 3,
  }
  const actual = sortPages(input)
  const expected = [
    ['https://blog.boot.dev/path2', 5],
    ['https://blog.boot.dev/path3', 4],
    ['https://blog.boot.dev/path4', 3],
    ['https://blog.boot.dev/path', 2],
    ['https://blog.boot.dev', 1],
  ]
  expect(actual).toEqual(expected)
})
