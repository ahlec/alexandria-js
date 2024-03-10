import type { HttpRequestClient } from "@alexandria/http/types";
import type { GetFanficResult, Repository } from "@alexandria/types/repository";
import { Ao3Fanfic } from "./Ao3Fanfic";
import { isValidAO3DatabaseId } from "./validation";
import { ParsedHtmlDocument } from "@alexandria/xml/ParsedHtmlDocument";

export class Ao3Repository implements Repository {
  public constructor(private readonly httpClient: HttpRequestClient) {}

  public async getFanfic(handle: string): Promise<GetFanficResult> {
    if (!isValidAO3DatabaseId(handle)) {
      return {
        success: false,
        error: "invalid-handle",
      };
    }

    const response = await this.httpClient.request({
      method: "GET",
      url: `https://archiveofourown.org/works/${handle}?view_adult=true`,
    });

    if (response.status === 404) {
      return {
        success: false,
        error: "fanfic-doesnt-exist",
      };
    }

    if (response.status !== 200) {
      return {
        success: false,
        error: "unrecognized-http-status",
        status: response.status,
      };
    }

    const parsed = Ao3Fanfic.parse(new ParsedHtmlDocument(response.body));
    if (!parsed) {
      return {
        success: false,
        error: "malformed-response",
      };
    }

    return {
      success: true,
      fanfic: parsed,
    };
  }
}
