terraform {
  required_version = ">= 1.10"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }

  # Local state on purpose: this module creates the remote state bucket that
  # the main `infra/` module uses, so it cannot store its own state there.
  # It is applied once by a human; see README.md.
}

provider "aws" {
  region = var.region

  default_tags {
    tags = {
      project    = var.project
      managed-by = "terraform"
      stack      = "bootstrap"
    }
  }
}
