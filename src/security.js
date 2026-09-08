import { generateNonce } from "./utils.js";

const BEACON_TOKEN = "8c7b2f58353c4498b218d4429da3e6dd";

export const createCsp = (nonce) => {
  return [
    "default-src 'self'",
    [
      "script-src 'self'",
      `'nonce-${nonce}'`,
      "https://www.googletagmanager.com",
      "https://www.google-analytics.com",
      "https://googleads.g.doubleclick.net",
      "https://pagead2.googlesyndication.com",
      "https://www.clarity.ms",
      "https://stats.hhk.my.id",
      "https://grafana.hhk.my.id",
      "https://static.cloudflareinsights.com",
      "https://comments.hhk.my.id",
      "https://cloud.hhk.my.id",
    ].join(" "),
    [
      "script-src-attr 'unsafe-hashes'",
      "'sha256-w/dYwr8dOxSxXkSn1TX2wSmL6acNm6A2QZk/9IX63rs='",
    ].join(" "),
    [
      "connect-src 'self'",
      "https://speedlify.hhk.my.id",
      "https://www.google-analytics.com",
      "https://hhk.my.id",
      "https://ipapi.co",
      "https://e.clarity.ms",
      "https://ep1.adtrafficquality.google",
      "https://www.clarity.ms",
      "https://n.clarity.ms",
      "https://static.cloudflareinsights.com",
      "https://cloudflareinsights.com",
      "https://api.github.com",
    ].join(" "),
    [
      "img-src 'self' data:",
      "https://www.googletagmanager.com",
      "https://stats.g.doubleclick.net",
      "https://googleads.g.doubleclick.net",
      "https://c.clarity.ms",
      "https://ep1.adtrafficquality.google",
      "https://pagead2.googlesyndication.com",
      "https://cdnjs.cloudflare.com",
      "https://raw.githubusercontent.com",
      "https://v1.generator.11ty.dev",
      "https://v1.indieweb-avatar.11ty.dev",
      "https://v1.builtwith.11ty.dev",
      "https://avatars.githubusercontent.com",
      "https://flagcdn.com",
    ].join(" "),
    [
      "style-src 'self' 'unsafe-inline'",
      "https://cdnjs.cloudflare.com",
      "https://stats.hhk.my.id",
    ].join(" "),
    [
      "frame-src 'self'",
      "https://www.googletagmanager.com",
      "https://www.youtube.com",
      "https://youtube.com",
      "https://*.youtube-nocookie.com",
      "https://ep2.adtrafficquality.google",
      "https://www.google.com",
      "https://googleads.g.doubleclick.net",
      "https://comments.hhk.my.id",
    ].join(" "),
    [
      "frame-ancestors 'self'",
      "https://www.google.com",
      "https://*.cloudflarepreviews.com",
    ].join(" "),
    "font-src 'self' data:",
    "media-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
  ].join("; ");
};

export const applySecurityHeaders = (headers) => {
  headers.delete("X-Frame-Options");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("Cross-Origin-Resource-Policy", "cross-origin");
  headers.set("Permissions-Policy", "clipboard-write=(self)");
};

export const applySecurity = async (response, request) => {
  const contentType = response.headers.get("Content-Type") || "";

  // Apply general security headers to non-HTML, errors, or HEAD requests
  if (
    request.method === "HEAD" ||
    !response.ok ||
    !contentType.toLowerCase().includes("text/html")
  ) {
    const headers = new Headers(response.headers);
    applySecurityHeaders(headers);
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  }

  const nonce = generateNonce();

  const transformedResponse = new HTMLRewriter()
    .on("script:not([src])", {
      element(element) {
        if (!element.getAttribute("nonce")) {
          element.setAttribute("nonce", nonce);
        }
      },
    })
    .on("body", {
      element(element) {
        element.append(
          `
<script
  defer
  src="https://static.cloudflareinsights.com/beacon.min.js"
  data-cf-beacon='${JSON.stringify({ token: BEACON_TOKEN })}'
  nonce="${nonce}"
></script>`,
          { html: true },
        );
      },
    })
    .transform(response);

  const headers = new Headers(transformedResponse.headers);

  // Content length & validation tags are invalidated by HTMLRewriter body mutation
  headers.delete("Content-Length");
  headers.delete("ETag");
  headers.delete("Last-Modified");

  // Dynamic nonce must not be cached by shared proxies
  headers.set("Cache-Control", "private, no-store, max-age=0");
  headers.set("Content-Security-Policy", createCsp(nonce));

  applySecurityHeaders(headers);

  return new Response(transformedResponse.body, {
    status: transformedResponse.status,
    statusText: transformedResponse.statusText,
    headers,
  });
};
