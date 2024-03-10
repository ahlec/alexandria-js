import fetch from "node-fetch";
import type { HttpRequestClient, RequestOptions, Response } from "./types";

export class StandardHttpRequestClient implements HttpRequestClient {
  public async request(options: RequestOptions): Promise<Response> {
    const response = await fetch(options.url, {
      method: options.method,
    });

    return {
      body: await response.text(),
      status: response.status,
    };
  }
}
