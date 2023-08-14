import { load as loadCheerio, AnyNode, Cheerio } from 'cheerio';

/**
 * Given a Cheerio selection, split it into an array of Cheerio selections,
 * where each has only one element.
 *
 * From `Cheerio[el, el, el, el]`
 *
 * To `[Cheerio[el], Cheerio[el], Cheerio[el], Cheerio[el]]`
 */
export const splitCheerioSelection = (cheerioSel: Cheerio<AnyNode>) => {
  return cheerioSel.toArray().map((el) => {
    const cheerioInst = loadCheerio(el);
    return cheerioInst(el);
  });
};
