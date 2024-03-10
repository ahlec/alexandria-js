import { Ao3Repository } from "./ao3/Ao3Repository";
import { StandardHttpRequestClient } from "./http/StandardHttpRequestClient";

async function main() {
  const ao3 = new Ao3Repository(new StandardHttpRequestClient());
  const response = await ao3.getFanfic("538425");
  console.log(JSON.stringify(response, undefined, 2));
}

main();
