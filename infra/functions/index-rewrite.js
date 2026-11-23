// CloudFront Function (cloudfront-js-2.0), viewer-request.
//
// Astro builds each page as <page>/index.html. The S3 origin is private
// (OAC), so it does not resolve directory indexes. Map:
//   /             -> /index.html
//   /about/       -> /about/index.html
//   /about        -> /about/index.html
// Paths with a file extension (/robots.txt, /_astro/x.css) pass through.
//
// CloudFront Functions do not support ES module exports; tests load this
// file as text (see tests/index-rewrite.test.ts).
function handler(event) {
  var request = event.request;
  var uri = request.uri;

  if (uri.endsWith("/")) {
    request.uri = uri + "index.html";
  } else if (uri.lastIndexOf(".") <= uri.lastIndexOf("/")) {
    request.uri = uri + "/index.html";
  }

  return request;
}
