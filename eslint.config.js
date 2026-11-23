// @ts-check
import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import astro from "eslint-plugin-astro";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig(
  { ignores: ["dist/", ".astro/", "node_modules/", "**/.terraform/"] },
  js.configs.recommended,
  tseslint.configs.recommended,
  astro.configs.recommended,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },
  {
    // CloudFront Functions: plain scripts whose `handler` is called by
    // CloudFront, not referenced in the file.
    files: ["infra/functions/**/*.js"],
    languageOptions: { sourceType: "script" },
    rules: { "@typescript-eslint/no-unused-vars": "off" },
  },
);
