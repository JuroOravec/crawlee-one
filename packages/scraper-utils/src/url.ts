/** Validate correctness of a URL */
export const validateUrl = (url: string) => {
  try {
    new URL(url);
  } catch (err) {
    (err as Error).message += `\nURL: "${url}"`;
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
