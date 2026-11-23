variable "project" {
  description = "Project name used as a prefix for every resource. Never the company name."
  type        = string
  default     = "packaging-site"
}

variable "region" {
  description = "AWS region for the state bucket and the site stack."
  type        = string
  default     = "us-east-2"
}

variable "github_oidc_subject_prefix" {
  description = <<-EOT
    Repository part of the GitHub OIDC `sub` claim. This repo uses GitHub's
    immutable subject format (owner and repo names plus their numeric IDs),
    which survives renames and can't be claimed by a re-created repo of the
    same name. Look it up with:
      gh api repos/<owner>/<repo>/actions/oidc/customization/sub -q .sub_claim_prefix
  EOT
  type        = string
  default     = "repo:joshivaibhav@20138992/signet-bioproducts-site@1468136744"

  validation {
    condition     = startswith(var.github_oidc_subject_prefix, "repo:")
    error_message = "Must start with \"repo:\"."
  }
}

variable "github_environment" {
  description = "GitHub Actions environment whose jobs may assume the deploy role."
  type        = string
  default     = "production"
}
