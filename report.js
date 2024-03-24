function printReport(pages, baseURL) {
  const title = `Crawler report for ${baseURL}`;
  const spacer = "-".repeat(title.length);
  console.log(`\n${spacer}\n${title}\n${spacer}`);

  const sorted = sortPages(pages);
  for (const [url, count] of sorted) {
    let link = "links";
    if (count === 1) {
      link = "link";
    }
    console.log(`Found ${count} internal ${link} to ${url}`);
  }
}

function sortPages(pages) {
  return Object.entries(pages).sort((a, b) => b[1] - a[1]);
}

module.exports = {
  printReport,
};
