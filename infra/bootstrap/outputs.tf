output "state_bucket" {
  description = "Name of the S3 bucket holding Terraform state for infra/."
  value       = aws_s3_bucket.tfstate.bucket
}

output "deploy_role_arn" {
  description = "Set this as the AWS_DEPLOY_ROLE_ARN repository variable in GitHub."
  value       = aws_iam_role.deploy.arn
}

output "region" {
  description = "Region of the state bucket."
  value       = var.region
}
