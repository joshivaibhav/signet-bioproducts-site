# Signet Bioproducts Website

Source for the Signet Bioproducts website, hosted on AWS.

## Deployment

The site is a static Astro build served from a private S3 bucket through
CloudFront. Infrastructure is Terraform in `infra/`, applied only by GitHub
Actions after merge to `main`.

- `infra/bootstrap/`: one-off state bucket and GitHub OIDC deploy role
  (applied once by a human; see its README)
- `infra/`: site bucket, CloudFront distribution, URL rewrite function and
  security headers

Locally, only `terraform fmt`, `terraform validate` and `terraform plan` are run.
