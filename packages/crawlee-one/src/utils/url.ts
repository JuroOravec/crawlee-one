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

export interface FormatUrlOptions {
  allowRelative?: boolean;
  baseUrl?: string | null;
}

export const formatUrl = <T>(
  maybeUrl: string | T,
  { allowRelative, baseUrl }: FormatUrlOptions = {}
) => {
  if (typeof maybeUrl !== 'string') return maybeUrl;
  if (!maybeUrl.startsWith('/') || allowRelative) return maybeUrl;

  if (!baseUrl) throw Error('Cannot convert URL from relative to absolute path - baseUrl is missing'); // prettier-ignore
  return resolveUrlPath(baseUrl, maybeUrl);
};
