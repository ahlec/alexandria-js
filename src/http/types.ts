export interface RequestOptions {
  method: "GET";
  url: string;
}

export interface Response {
  status: number;
  body: string;
}

export interface HttpRequestClient {
  request(options: RequestOptions): Promise<Response>;
}
