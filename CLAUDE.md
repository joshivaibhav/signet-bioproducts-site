# packaging-site

Marketing website for an eco-friendly, compostable food packaging manufacturer
(take-out bags, cups, containers, plates). **The company name is not final.**

- **Audience:** restaurants, cafés and other food businesses (B2B).
- **Goal of the site:** turn visitors into **quote requests** and **sample requests**.
  There is no shopping cart or online checkout.

## Stack

- **Frontend:** Astro (static output) + Tailwind CSS + TypeScript (strict)
- **Content:** Astro content collections (one file per product)
- **Backend (later):** Go Lambda behind API Gateway, SES for email, DynamoDB for leads, in `backend/`
- **Infra (later):** Terraform in `infra/`, deployed by GitHub Actions only
- **Hosting:** S3 + CloudFront (no custom domain yet; uses the cloudfront.net URL)

## Repo layout

```
src/
  config/site.ts      # company name, tagline, contact email, indexable flag: the ONLY place these live
  content/            # product collections
  components/
  layouts/
  pages/
public/
backend/              # (later) Go Lambda
infra/                # (later) Terraform
.github/
```

## Commands

```
npm install
npm run dev        # local dev server
npm run build      # production build
npm run lint       # ESLint
npm run format     # Prettier (write)
npm run check      # astro check (type checking)
npm run test       # Vitest
```

## Rules

### Branding
- The company name, tagline, logo path and contact email live **only** in `src/config/site.ts`.
  Never hardcode them anywhere else. A rebrand must be a one-file change.
- Use placeholder copy marked with `TODO(copy):` when real content isn't available.

### Environmental claims
- Never write vague green claims ("eco-friendly", "biodegradable", "good for the planet")
  as standalone marketing copy. Claims must be specific and backed by data in the product
  content (material, certification name). In Canada, environmental claims must be substantiated.
- If a change adds or edits any environmental claim, call it out in the PR description
  under **Claims to review**.

### Search indexing
- The site must not be indexed until launch. `site.indexable` (default `false`) controls
  the robots meta tag and `robots.txt`. Never flip it to `true` unless an issue says so.

### Secrets
- Never commit `.env` files, credentials, tokens or keys. Never print credentials.

## Workflow (follow on every task)

1. **Never commit or push to `main`.** All changes go through a pull request.
2. One issue → one branch → one PR. Keep PRs small. If the scope grows, stop and ask.
3. Branch names: `feat/<issue#>-short-slug`, `fix/…`, `chore/…`, `infra/…`, `docs/…`
4. Commits use Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `ci:`, `infra:`).
5. Before opening a PR, all of these must pass:
   `npm run lint && npm run check && npm run test && npm run build`
6. Open the PR with `gh pr create`, fill in `.github/pull_request_template.md`,
   and include `Closes #<issue>`.
7. **Never merge PRs.** The human reviews and merges.
8. After opening the PR, report the PR URL and a short summary.

## Infrastructure rules

- Run only `terraform fmt`, `terraform validate` and `terraform plan` locally.
- **Never run `terraform apply` or `terraform destroy`.** Applies happen in CI after merge.
- Never run AWS CLI commands that create, modify or delete resources. Read-only only.
- Name resources with `var.project` (`packaging-site`), never the company name.
