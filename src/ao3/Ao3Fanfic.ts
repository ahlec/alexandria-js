import type { Fanfic } from "@alexandria/types/fanfic";
import type { AuthorHandle } from "@alexandria/types/handles";
import { ParsedHtmlDocument } from "@alexandria/xml/ParsedHtmlDocument";

export class Ao3Fanfic implements Fanfic {
  public static parse(document: ParsedHtmlDocument): Ao3Fanfic | null {
    const title = document.xpathText(
      '//div[contains(@class, "preface")]/h2[@class ="title heading"]',
    );
    const authorRelativeUrls = document.xpath(
      '//div[contains(@class, "preface")]/h3[@class="byline heading"]/a',
      (a) => a.getAttribute("href"),
      { array: true },
    );
    if (!title || !authorRelativeUrls) {
      return null;
    }

    const authors: AuthorHandle[] = [];
    for (const relativeUrl of authorRelativeUrls) {
      const match = relativeUrl?.match(/^\/users\/([^/]+?)\/pseuds\/([^/]+?)$/);
      if (!match) {
        return null;
      }

      const [, handle, pseud] = match;
      authors.push({
        type: "author",
        handle,
        name: pseud,
        url: `https://archiveofourown.org${relativeUrl}`,
      });
    }

    return {
      authors,
      title: title.trim(),
    };
  }

  public constructor(
    public title: string,
    public authors: readonly AuthorHandle[],
  ) {}
}
