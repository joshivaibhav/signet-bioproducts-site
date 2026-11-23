import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

interface CfRequest {
  uri: string;
}
type Handler = (event: { request: CfRequest }) => CfRequest;

// CloudFront Functions can't use module exports, so load the file as text.
const source = readFileSync(
  new URL("../infra/functions/index-rewrite.js", import.meta.url),
  "utf8",
);
const handler = new Function(`${source}\nreturn handler;`)() as Handler;

const rewrite = (uri: string) => handler({ request: { uri } }).uri;

describe("CloudFront index rewrite", () => {
  it.each([
    ["/", "/index.html"],
    ["/about", "/about/index.html"],
    ["/about/", "/about/index.html"],
    ["/products/cups", "/products/cups/index.html"],
  ])("rewrites %s to %s", (input, expected) => {
    expect(rewrite(input)).toBe(expected);
  });

  it.each(["/robots.txt", "/_astro/index.abc123.css", "/index.html"])(
    "leaves file path %s unchanged",
    (uri) => {
      expect(rewrite(uri)).toBe(uri);
    },
  );

  it("rewrites a directory whose parent contains a dot", () => {
    expect(rewrite("/v1.2/about")).toBe("/v1.2/about/index.html");
  });
});
