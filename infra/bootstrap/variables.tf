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

variable "github_repository" {
  description = "GitHub repository (owner/name) allowed to assume the deploy role."
  type        = string
  default     = "joshivaibhav/signet-bioproducts-site"
}

variable "github_environment" {
  description = "GitHub Actions environment whose jobs may assume the deploy role."
  type        = string
  default     = "production"
}
