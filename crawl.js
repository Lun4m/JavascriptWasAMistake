const url = require("node:url");
const { JSDOM } = require("jsdom");

function normalizeURL(inputUrl) {
  try {
    const urlObj = new URL(inputUrl);
    let path = `${urlObj.host}${urlObj.pathname}`;
    if (path.length > 1 && path.endsWith("/")) {
      path = path.slice(0, -1);
    }
    return path;
  } catch (err) {
    throw Error(`Invalid url: ${inputUrl}`);
  }
}

function getURLsFromHTML(htmlBody, baseUrl) {
  const dom = new JSDOM(htmlBody);
  const links = dom.window.document.querySelectorAll("a");
  const urls = [];

  for (const link of links) {
    let href = link.href;
    if (href.startsWith("/")) {
      try {
        urls.push(`${baseUrl}${href}`);
      } catch (err) {
        console.log(`${err.message}: ${href}`);
      }
    } else {
      if (href.startsWith("http")) {
        continue;
      }
      try {
        urls.push(`${baseUrl}/${href}`);
      } catch (err) {
        console.log(`${err.message}: ${href}`);
      }
    }
  }
  return urls;
}

async function crawlPage(baseURL, currentURL, pages) {
  if (!currentURL.startsWith(baseURL)) {
    return pages;
  }

  try {
    const normURL = normalizeURL(currentURL);
    if (pages[normURL]) {
      pages[normURL]++;
      return pages;
    }
    pages[normURL] = 1;
  } catch (error) {
    return pages;
  }

  console.log(`Fetching page at ${currentURL}`);
  const response = await fetch(currentURL, {
    method: "GET",
    mode: "cors",
  });

  if (response.status >= 400) {
    console.log(
      `Unable to fetch page ${currentURL}\nStatus code: ${response.status}`,
    );
    console.log("---------");
    return pages;
  }

  if (!response.headers.get("content-type").startsWith("text/html")) {
    console.log(
      `Unable to fetch page ${currentURL}\nInvalid content-type: ${response.headers["content-type"]}`,
    );
    console.log("---------");
    return pages;
  }

  const body = await response.text();
  const bodyURLs = getURLsFromHTML(body, baseURL);
  for (const url of bodyURLs) {
    pages = await crawlPage(baseURL, url, pages);
  }
  return pages;
}

module.exports = {
  crawlPage,
  normalizeURL,
  getURLsFromHTML,
};
