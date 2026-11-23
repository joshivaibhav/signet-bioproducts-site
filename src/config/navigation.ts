export interface NavItem {
  label: string;
  href: string;
}

/** Main site navigation, shown in the header and footer. */
export const mainNav: NavItem[] = [
  { label: "Products", href: "/products" },
  { label: "Custom Printing", href: "/custom-printing" },
  { label: "Sustainability", href: "/sustainability" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

/** Where the "Request a Quote" button points until a dedicated form exists. */
export const quoteHref = "/contact";

/** Where "Request samples" points until a dedicated form exists. */
export const samplesHref = "/contact";

/** True when `href` is the current page or a parent section of it. */
export function isCurrent(href: string, pathname: string): boolean {
  const path = pathname.replace(/\/+$/, "") || "/";
  return path === href || path.startsWith(`${href}/`);
}
