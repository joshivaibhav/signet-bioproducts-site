/**
 * Site-wide branding and indexing settings.
 *
 * This is the ONLY place the company name, tagline, logo path and contact
 * email may live. A rebrand must be a one-file change (see CLAUDE.md).
 */
export interface SiteConfig {
  /** Company name shown in the header, footer and page titles. */
  name: string;
  /** Short tagline shown alongside the name. */
  tagline: string;
  /** Public contact address for quote and sample enquiries. */
  contactEmail: string;
  /** Path to the logo, relative to `public/`. */
  logo: string;
  /**
   * Whether search engines may index the site. Controls the robots meta tag
   * and robots.txt. Keep `false` until launch; only flip it when an issue
   * explicitly says so.
   */
  indexable: boolean;
}

export const site: SiteConfig = {
  // TODO(copy): company name is not final.
  name: "Company Name",
  // TODO(copy): replace with the approved tagline.
  tagline: "Food packaging for restaurants and cafés",
  // TODO(copy): replace with the real contact address.
  contactEmail: "hello@example.com",
  // TODO(copy): add the real logo file at this path.
  logo: "/logo.svg",
  indexable: false,
};
