export const strOrNull = (s: string | null, allowEmpty?: boolean) => s ? s : typeof s === 'string' && allowEmpty ? s : null; // prettier-ignore

export interface StrAsNumOptions {
  allowEmpty?: boolean;
  removeWhitespace?: boolean;
  mode: 'int' | 'float';
  separator?: string;
  decimal?: string;
}

export const strAsNumber = (s: string | null, options?: StrAsNumOptions): number | null => {
  const { removeWhitespace, allowEmpty, separator, decimal, mode = 'float' } = options || {};
  let content = removeWhitespace ? s?.replace(/\s+/g, '') ?? null : s;
  content = strOrNull(content, allowEmpty);
  if (content === null) return null;

  content = separator ? content?.replace(new RegExp(separator, 'g'), '') ?? null : content;
  content = decimal ? content?.replace(new RegExp(decimal, 'g'), '.') ?? null : content;
  const num = mode === 'int' ? Number.parseInt(content) : Number.parseFloat(content);
  return Number.isNaN(num) ? null : num;
};
