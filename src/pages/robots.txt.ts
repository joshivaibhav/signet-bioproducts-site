import type { APIRoute } from "astro";
import { site } from "../config/site";
import { robotsTxt } from "../lib/robots";

export const GET: APIRoute = () =>
  new Response(robotsTxt(site.indexable), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
