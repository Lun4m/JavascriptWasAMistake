const { test, expect } = require("@jest/globals");
const { normalizeURL } = require("./crawl");

test("normalizeURL: https + domain", () => {
  const url = "https://www.website.com";
  expect(normalizeURL(url)).toBe("www.website.com");
});

test("normalizeURL: https + domain + path", () => {
  const url = "https://www.website.com/path";
  expect(normalizeURL(url)).toBe("www.website.com/path");
});

test("normalizeURL: https + domain + path + slash", () => {
  const url = "https://www.website.com/path/";
  expect(normalizeURL(url)).toBe("www.website.com/path");
});

test("normalizeURL: http + domain", () => {
  const url = "http://www.website.com";
  expect(normalizeURL(url)).toBe("www.website.com");
});

test("normalizeURL: http + domain + path", () => {
  const url = "http://www.website.com/path";
  expect(normalizeURL(url)).toBe("www.website.com/path");
});

test("normalizeURL: http + domain + path + slash", () => {
  const url = "http://www.website.com/path/";
  expect(normalizeURL(url)).toBe("www.website.com/path");
});

test("normalizeURL: not an url", () => {
  const url = "httwebsitecom";
  expect(() => {
    normalizeURL(url);
  }).toThrow(Error("invalid url"));
});

