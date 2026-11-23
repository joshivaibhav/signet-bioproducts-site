/** Value for `<meta name="robots">` for the given indexing setting. */
export function robotsMetaContent(indexable: boolean): string {
  return indexable ? "index, follow" : "noindex, nofollow";
}

/** Contents of `/robots.txt` for the given indexing setting. */
export function robotsTxt(indexable: boolean): string {
  return ["User-agent: *", indexable ? "Allow: /" : "Disallow: /", ""].join(
    "\n",
  );
}
