// requirements of @tableland/sdk for node < 18 (install "node-fetch" before)

import fetch, { Headers, Request, Response } from "node-fetch";

if (!globalThis.fetch) {
  globalThis.fetch = fetch;
  globalThis.Headers = Headers;
  globalThis.Request = Request;
  globalThis.Response = Response;
}
