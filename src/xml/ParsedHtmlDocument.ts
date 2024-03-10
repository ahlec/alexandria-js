import { JSDOM } from "jsdom";

const ORDERED_NODE_ITERATOR_TYPE = 5;
const FIRST_ORDERED_NODE_TYPE = 9;

type TransformFn<T> = (node: Element) => T;

interface XpathOptions {
  /**
   * If false, this function will process only the first node that matches the
   * XPath query. If true, this function will process all nodes that match the
   * XPath query. This changes the return value from the function.
   *
   * @default false
   */
  array?: boolean;
}

export class ParsedHtmlDocument {
  private readonly doc: JSDOM;

  public constructor(html: string) {
    this.doc = new JSDOM(html);
  }

  public xpath<T>(xpath: string, transform: TransformFn<T>): T | null;
  public xpath<T, TOpts extends XpathOptions>(
    xpath: string,
    transform: TransformFn<T>,
    opts: TOpts,
  ): (TOpts["array"] extends true ? readonly T[] : T) | null;
  public xpath<T>(
    xpath: string,
    transform: TransformFn<T>,
    { array = false }: XpathOptions = {},
  ): readonly T[] | T | null {
    if (!array) {
      const singleResult = this.doc.window.document.evaluate(
        xpath,
        this.doc.window.document,
        null,
        FIRST_ORDERED_NODE_TYPE,
        null,
      );

      if (!singleResult.singleNodeValue) {
        return null;
      }

      if (!(singleResult.singleNodeValue instanceof this.doc.window.Element)) {
        throw new Error("Resultant node is not an Element!");
      }

      return transform(singleResult.singleNodeValue);
    }

    const arrayResult = this.doc.window.document.evaluate(
      xpath,
      this.doc.window.document,
      null,
      ORDERED_NODE_ITERATOR_TYPE,
      null,
    );

    const result: T[] = [];
    let node = arrayResult.iterateNext();
    while (node) {
      if (!(node instanceof this.doc.window.Element)) {
        throw new Error("Iterator node is not an Element!");
      }

      result.push(transform(node));
      node = arrayResult.iterateNext();
    }

    return result;
  }

  public xpathText(xpath: string): string | null;
  public xpathText<TOpts extends XpathOptions>(
    xpath: string,
    opts: TOpts,
  ): (TOpts["array"] extends true ? readonly string[] : string) | null;
  public xpathText(
    xpath: string,
    opts?: XpathOptions,
  ): readonly string[] | string | null {
    return this.xpath(xpath, (node) => node.textContent ?? "", opts ?? {});
  }
}
