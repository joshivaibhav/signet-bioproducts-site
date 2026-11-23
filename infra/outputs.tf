output "site_bucket" {
  description = "S3 bucket the deploy workflow syncs dist/ into."
  value       = aws_s3_bucket.site.bucket
}

output "distribution_id" {
  description = "CloudFront distribution ID, used for cache invalidations."
  value       = aws_cloudfront_distribution.site.id
}

output "site_url" {
  description = "Public URL of the site."
  value       = "https://${aws_cloudfront_distribution.site.domain_name}"
}
