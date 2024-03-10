import type { Fanfic } from "./fanfic";

export type GetFanficResult =
  | {
      success: true;
      fanfic: Fanfic;
    }
  | {
      success: false;
      error: "invalid-handle" | "fanfic-doesnt-exist" | "malformed-response";
    }
  | {
      success: false;
      error: "unrecognized-http-status";
      status: number;
    };

export interface Repository {
  getFanfic(handle: string): Promise<GetFanficResult>;
}
