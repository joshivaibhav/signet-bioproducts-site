import { existsSync } from "node:fs";
import { join } from "node:path";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";
import Footer from "../src/components/Footer.astro";
import Header from "../src/components/Header.astro";
import { isCurrent, mainNav, quoteHref } from "../src/config/navigation";
import { site } from "../src/config/site";
import BaseLayout from "../src/layouts/BaseLayout.astro";

const PAGES = join(import.meta.dirname, "..", "src", "pages");

describe("navigation", () => {
  it("lists the agreed nav items in order", () => {
    expect(mainNav.map((i) => i.label)).toEqual([
      "Products",
      "Custom Printing",
      "Sustainability",
      "About",
      "Contact",
    ]);
  });

  it.each(mainNav)("$label has a page", ({ href }) => {
    expect(existsSync(join(PAGES, `${href.slice(1)}.astro`))).toBe(true);
  });

  it("matches the current page and its sub-pages only", () => {
    expect(isCurrent("/products", "/products")).toBe(true);
    expect(isCurrent("/products", "/products/")).toBe(true);
    expect(isCurrent("/products", "/products/cups")).toBe(true);
    expect(isCurrent("/products", "/products-old")).toBe(false);
    expect(isCurrent("/products", "/")).toBe(false);
  });
});

describe("Header", () => {
  it("shows every nav link, the quote button and marks the current page", async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Header, {
      props: { currentPath: "/about" },
    });

    for (const item of mainNav) expect(html).toContain(`href="${item.href}"`);
    expect(html).toContain(`href="${quoteHref}"`);
    expect(html).toContain("Request a Quote");
    expect(html).toContain(site.name);
    expect(html).toMatch(/href="\/about"[^>]*aria-current="page"/);
    expect(html).not.toMatch(/href="\/products"[^>]*aria-current/);
  });
});

describe("Footer", () => {
  it("shows the name and contact email from site config", async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Footer);
    expect(html).toContain(site.name);
    expect(html).toContain(`mailto:${site.contactEmail}`);
  });
});

describe("BaseLayout", () => {
  it("includes the robots meta tag and a titled document", async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(BaseLayout, {
      props: { title: "About" },
      request: new Request("http://localhost/about"),
    });
    expect(html).toContain('<meta name="robots"');
    expect(html).toContain(`<title>About | ${site.name}</title>`);
    expect(html).toContain('<main id="main"');
  });
});
