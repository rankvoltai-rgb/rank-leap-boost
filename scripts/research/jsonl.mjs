// Streams a JSONL file, splitting only on "\n" (node:readline also splits on other characters).
import { createReadStream } from "node:fs";
import { StringDecoder } from "node:string_decoder";
export async function* readJsonl(path) {
  const dec = new StringDecoder("utf8");
  let rest = "";
  for await (const chunk of createReadStream(path, { highWaterMark: 1 << 20 })) {
    const text = rest + dec.write(chunk);
    const parts = text.split("\n");
    rest = parts.pop();
    for (const p of parts) if (p) yield JSON.parse(p);
  }
  rest += dec.end();
  if (rest.trim()) yield JSON.parse(rest);
}
