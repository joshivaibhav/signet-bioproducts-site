# infra/bootstrap

One-off setup that lets GitHub Actions run Terraform and deploy the site.
It creates:

- `packaging-site-tfstate-<account_id>`: S3 bucket for the remote state of `infra/`
- the GitHub Actions OIDC identity provider
- `packaging-site-github-deploy`: IAM role that only jobs in this repo's
  `production` GitHub environment can assume, with access limited to the
  state bucket, `packaging-site-site-*` buckets and CloudFront

This module uses **local state** and is applied **once, by a human with admin
credentials**. Claude and CI never apply it. Re-apply only when the deploy role
needs new permissions (for example when the backend is added).

## 1. Apply (admin, once)

Terraform cannot read `aws login` sessions directly, so export them first:

```sh
cd infra/bootstrap
eval "$(aws configure export-credentials --profile default --format env)"
terraform init
terraform plan     # expect: 10 to add, 0 to change, 0 to destroy
terraform apply
terraform output
```

Keep `terraform.tfstate` safe (it is gitignored). If it is lost, the resources
can be re-imported; nothing in it is secret.

## 2. Configure GitHub (once)

1. **Settings → Environments → New environment** named `production`.
   Under _Deployment branches and tags_, choose _Selected branches_ and add `main`.
2. **Settings → Secrets and variables → Actions → Variables → New repository variable**:
   - `AWS_DEPLOY_ROLE_ARN` = the `deploy_role_arn` output

Or with the GitHub CLI:

```sh
gh api -X PUT repos/joshivaibhav/signet-bioproducts-site/environments/production \
  -F 'deployment_branch_policy[protected_branches]=false' \
  -F 'deployment_branch_policy[custom_branch_policies]=true'
gh api -X POST repos/joshivaibhav/signet-bioproducts-site/environments/production/deployment-branch-policies \
  -f name=main -f type=branch
gh variable set AWS_DEPLOY_ROLE_ARN --body "$(terraform output -raw deploy_role_arn)"
```

The role ARN is not secret, so a variable (not a secret) is fine.

## OIDC subject format

This repository uses GitHub's **immutable** OIDC subject format, so the token's
`sub` claim looks like
`repo:<owner>@<owner_id>/<repo>@<repo_id>:environment:production`, not
`repo:<owner>/<repo>:environment:production`. The trust policy must match it
exactly, or deploys fail with
`Not authorized to perform sts:AssumeRoleWithWebIdentity`.

The prefix lives in `var.github_oidc_subject_prefix`. To check the current
value:

```sh
gh api repos/joshivaibhav/signet-bioproducts-site/actions/oidc/customization/sub \
  -q .sub_claim_prefix
```
