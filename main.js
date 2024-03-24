const { crawlPage } = require("./crawl");

function main() {
  const { argv, exit } = require("node:process");

  if (argv.length !== 3) {
    console.log("USAGE: npm run start <url>");
    exit();
  }
  const baseURL = argv[2];
  console.log(`Crawler initialized at ${baseURL}`);

  crawlPage(baseURL, baseURL, {}).then((pages) => {
    console.log(`Fetch report for ${baseURL}:`);
    console.log(pages);
  });
}

main();
