function sortPages(pages) {
  const pagesArr = Object.entries(pages)
  return pagesArr.sort((a, b) => {
    return b[1] - a[1]
  })
}

function printReport(pages) {
  console.log('--------------------')
  console.log('REPORT START')
  console.log('--------------------')
  for (const record of sortPages(pages)) {
    console.log(`Found ${record[1]} internal links to ${record[0]}`)
  }
  console.log('--------------------')
  console.log('REPORT END')
  console.log('--------------------')
}

module.exports = {
  sortPages,
  printReport,
}
