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

async function crawlPage(baseURL, currentURL, pages) {
  if (!currentURL.startsWith(baseURL)) {
    return pages;
  }

  try {
    const normURL = normalizeURL(currentURL);
    if (pages[normURL]) {
      pages[normURL]++;
      return pages;
    } else {
      pages[normURL] = 1;
    }
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
  const bodyURLs = getURLsFromHTML(body);
  for (const url of bodyURLs) {
    // Skip if linking to different website
    if (url.startsWith("http")) {
      continue;
    }
    pages = await crawlPage(baseURL, `${baseURL}/${url}`, pages);
  }
  return pages;
}

module.exports = {
  crawlPage,
  normalizeURL,
  getURLsFromHTML,
};
