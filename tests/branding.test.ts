import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";
import { site } from "../src/config/site";

const ROOT = join(import.meta.dirname, "..");
const CONFIG_FILE = join("src", "config", "site.ts");
const SCAN_DIRS = ["src", "public"];

function walk(dir: string): string[] {
  // Git doesn't track empty dirs, so a scan dir (e.g. public/) can be absent
  // on a fresh clone if all its files are removed.
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

describe("branding lives only in src/config/site.ts", () => {
  const files = SCAN_DIRS.flatMap((d) => walk(join(ROOT, d)))
    .map((f) => relative(ROOT, f))
    .filter((f) => f !== CONFIG_FILE);

  const values = {
    name: site.name,
    tagline: site.tagline,
    contactEmail: site.contactEmail,
    logo: site.logo,
  };

  it.each(Object.entries(values))(
    "%s is not hardcoded elsewhere",
    (_key, value) => {
      const offenders = files.filter((f) =>
        readFileSync(join(ROOT, f), "utf8").includes(value),
      );
      expect(offenders).toEqual([]);
    },
  );
});
