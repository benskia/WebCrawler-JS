function main() {
  if (process.argv.length < 3) {
    console.log("Too few arguments: 'npm run BASE_URL'")
    process.exit()
  }
  if (process.argv.length > 3) {
    console.log("Too many arguments: 'npm run BASE_URL'")
    process.exit()
  }
  console.log(`Starting crawl at ${process.argv[2]}`)
}

main()
