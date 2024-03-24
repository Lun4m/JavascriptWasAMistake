const { crawlPage } = require("./crawl");
const { printReport } = require("./report");
const { argv, exit } = require("node:process");

function main() {
  if (argv.length !== 3) {
    console.log("USAGE: npm run start <url>");
    exit();
  }
  const baseURL = argv[2];
  console.log(`Crawler initialized at ${baseURL}`);

  crawlPage(baseURL, baseURL, {}).then((pages) => {
    printReport(pages, baseURL);
  });
}

main();
