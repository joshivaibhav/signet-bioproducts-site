data "aws_cloudfront_cache_policy" "caching_optimized" {
  name = "Managed-CachingOptimized"
}

resource "aws_cloudfront_origin_access_control" "site" {
  name                              = "${var.project}-site"
  description                       = "Lets CloudFront read the private site bucket."
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# Astro builds every page as <page>/index.html. S3 behind OAC does not serve
# directory indexes, so map "/about" and "/about/" to "/about/index.html".
resource "aws_cloudfront_function" "index_rewrite" {
  name    = "${var.project}-index-rewrite"
  runtime = "cloudfront-js-2.0"
  comment = "Rewrite directory-style URLs to index.html"
  publish = true
  code    = file("${path.module}/functions/index-rewrite.js")
}

resource "aws_cloudfront_response_headers_policy" "site" {
  name    = "${var.project}-security-headers"
  comment = "Security headers, plus noindex until launch."

  security_headers_config {
    strict_transport_security {
      access_control_max_age_sec = 31536000
      include_subdomains         = true
      override                   = true
    }

    content_type_options {
      override = true
    }

    frame_options {
      frame_option = "DENY"
      override     = true
    }

    referrer_policy {
      referrer_policy = "strict-origin-when-cross-origin"
      override        = true
    }
  }

  # Second guard against indexing before launch. The site itself is
  # controlled by site.indexable in src/config/site.ts; remove this header
  # in the same change that flips that flag.
  custom_headers_config {
    items {
      header   = "X-Robots-Tag"
      value    = "noindex, nofollow"
      override = true
    }
  }
}

resource "aws_cloudfront_distribution" "site" {
  enabled             = true
  comment             = "${var.project} static site"
  default_root_object = "index.html"
  http_version        = "http2and3"
  is_ipv6_enabled     = true
  price_class         = "PriceClass_100"

  origin {
    origin_id                = "site-bucket"
    domain_name              = aws_s3_bucket.site.bucket_regional_domain_name
    origin_access_control_id = aws_cloudfront_origin_access_control.site.id
  }

  default_cache_behavior {
    target_origin_id           = "site-bucket"
    viewer_protocol_policy     = "redirect-to-https"
    allowed_methods            = ["GET", "HEAD"]
    cached_methods             = ["GET", "HEAD"]
    compress                   = true
    cache_policy_id            = data.aws_cloudfront_cache_policy.caching_optimized.id
    response_headers_policy_id = aws_cloudfront_response_headers_policy.site.id

    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.index_rewrite.arn
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  # No custom domain yet: use the default *.cloudfront.net certificate.
  viewer_certificate {
    cloudfront_default_certificate = true
  }
}
