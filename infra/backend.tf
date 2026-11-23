# Remote state lives in the bucket created by infra/bootstrap. The bucket
# name contains the AWS account ID, so it is passed at init time instead of
# being committed:
#
#   terraform init -backend-config="bucket=packaging-site-tfstate-<account_id>"
#
# Locking uses an S3 lock file (no DynamoDB table needed).
terraform {
  backend "s3" {
    key          = "site/terraform.tfstate"
    region       = "us-east-2"
    encrypt      = true
    use_lockfile = true
  }
}
