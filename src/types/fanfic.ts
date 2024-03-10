import type { AuthorHandle } from "./handles";

export interface Fanfic {
  title: string;
  authors: readonly AuthorHandle[];
}
