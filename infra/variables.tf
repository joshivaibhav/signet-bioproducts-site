variable "project" {
  description = "Project name used as a prefix for every resource. Never the company name."
  type        = string
  default     = "packaging-site"
}

variable "region" {
  description = "AWS region for the site bucket. CloudFront itself is global."
  type        = string
  default     = "us-east-2"
}
