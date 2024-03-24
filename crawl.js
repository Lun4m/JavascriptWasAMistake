const url = require("node:url");
const { JSDOM } = require("jsdom");

function normalizeURL(inputUrl) {
  try {
    const urlObj = new URL(inputUrl);
    if (urlObj.pathname.endsWith("/")) {
      if (urlObj.pathname.length === 1) {
        return urlObj.hostname;
      } else {
        urlObj.pathname = urlObj.pathname.slice(0, -1);
      }
    }
    return `${urlObj.hostname}${urlObj.pathname}`;
  } catch (err) {
    throw Error("invalid url");
  }
}

function getURLsFromHTML(htmlBody, baseUrl) {
  const dom = new JSDOM(htmlBody);
  const links = dom.window.document.querySelectorAll("a");
  const hrefs = [];
  for (const link of links) {
    let href = link.href;
    if (href.startsWith("/")) {
      href = `${baseUrl}${href}`;
    }
    hrefs.push(href);
  }
  return hrefs;
}

async function crawlPage(url) {
  const response = await fetch(url, {
    method: "GET",
    mode: "cors",
  });

  if (response.status >= 400) {
    console.log(`Unable to fetch page, status code: ${response.status}`);
    return;
  }
  if (!response.headers.get("content-type").startsWith("text/html")) {
    console.log(
      `Unable to fetch this content-type: ${response.headers["content-type"]}`,
    );
    return;
  }
  const body = await response.text();
  console.log(body);
}

module.exports = {
  crawlPage,
  normalizeURL,
  getURLsFromHTML,
};
