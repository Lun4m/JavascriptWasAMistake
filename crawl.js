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

