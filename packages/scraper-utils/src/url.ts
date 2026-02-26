/**
 * Validate correctness of a URL and that it is fetchable (http/https with host).
 * Throws for malformed URLs and for non-fetchable schemes (about:blank, javascript:, etc.).
 */
export const validateUrl = (url: string) => {
  try {
    const u = new URL(url);
    if ((u.protocol !== 'http:' && u.protocol !== 'https:') || !u.hostname) {
      throw new Error(
        `URL has non-fetchable scheme (got ${u.protocol}). Rejects about:blank, javascript:, etc. URL: "${url}"`
      );
    }
  } catch (err) {
    if (err instanceof TypeError || (err as Error).name === 'TypeError') {
      (err as Error).message += `\nURL: "${url}"`;
    }
    throw err;
  }
};

/** Transform relative URL paths to absolute URLs */
export const resolveUrlPath = (urlBase: string, urlPath: string) => {
  const url = new URL(urlBase);
  url.pathname = urlPath;
  return url.href;
};

/** Sort URL's query params */
export const sortUrl = (url: string) => {
  const urlObj = new URL(url);

  urlObj.searchParams.sort();
  return urlObj.href;
};

export const equalUrls = (url1: string, url2: string) => {
  const url1Sorted = sortUrl(url1);
  const url2Sorted = sortUrl(url2);

  return url1Sorted === url2Sorted;
};
