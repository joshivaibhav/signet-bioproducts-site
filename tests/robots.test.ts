import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";
import RobotsMeta from "../src/components/RobotsMeta.astro";
import { site } from "../src/config/site";
import { robotsMetaContent, robotsTxt } from "../src/lib/robots";
import type { APIContext } from "astro";
import { GET } from "../src/pages/robots.txt";

describe("site config", () => {
  it("is not indexable by default (pre-launch)", () => {
    expect(site.indexable).toBe(false);
  });
});

describe("robots meta tag", () => {
  it.each([
    [false, "noindex, nofollow"],
    [true, "index, follow"],
  ])("indexable=%s → %s", async (indexable, expected) => {
    expect(robotsMetaContent(indexable)).toBe(expected);

    const container = await AstroContainer.create();
    const html = await container.renderToString(RobotsMeta, {
      props: { indexable },
    });
    expect(html).toContain(`<meta name="robots" content="${expected}">`);
  });

  it("defaults to the site config", async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(RobotsMeta);
    expect(html).toContain(`content="${robotsMetaContent(site.indexable)}"`);
  });
});

describe("robots.txt", () => {
  it("disallows everything when not indexable", () => {
    expect(robotsTxt(false)).toBe("User-agent: *\nDisallow: /\n");
  });

  it("allows everything when indexable", () => {
    expect(robotsTxt(true)).toBe("User-agent: *\nAllow: /\n");
  });

  it("endpoint serves the output for the current config", async () => {
    // The handler ignores its context, so an empty one is enough here.
    const response = await GET({} as APIContext);
    expect(response.headers.get("Content-Type")).toMatch(/^text\/plain/);
    expect(await response.text()).toBe(robotsTxt(site.indexable));
  });
});
