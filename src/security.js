import { generateNonce } from "./utils.js";

const BEACON_TOKEN = "8c7b2f58353c4498b218d4429da3e6dd";

export const createCsp = (nonce) => {
  return [
    "default-src 'self'",
    [
      "script-src 'self'",
      `'nonce-${nonce}'`,
      "https://static.cloudflareinsights.com",
      "https://comments.hhk.my.id",
      "https://cdn.jsdelivr.net",
      "https://gist.github.com",
    ].join(" "),
    [
      "connect-src 'self'",
      "https://comments.hhk.my.id",
      "https://api.github.com",
      "https://cloudflareinsights.com",
      "https://*.telesco.pe",
    ].join(" "),
    [
      "img-src 'self' data:",
      "https://comments.hhk.my.id",
      "https://avatars.githubusercontent.com",
      "https://raw.githubusercontent.com",
      "https://i.ytimg.com",
      "https://flagcdn.com",
      "https://cdn.jsdelivr.net",
      "https://*.telesco.pe",
      "https://t.me",
      "https://*.telegram.org",
      "https://telegram.org",
      "https://github.com",
    ].join(" "),
    [
      "style-src 'self' 'unsafe-inline'",
      "https://comments.hhk.my.id",
      "https://cdn.jsdelivr.net",
      "https://github.githubassets.com",
    ].join(" "),
    [
      "frame-src 'self'",
      "https://comments.hhk.my.id",
      "https://www.youtube.com",
      "https://www.youtube-nocookie.com",
    ].join(" "),
    ["font-src 'self' data:", "https://cdn.jsdelivr.net"].join(" "),
    "media-src 'self' data: https://*.telesco.pe",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    [
      "frame-ancestors 'self'",
      "https://*.cloudflarepreviews.com",
      "https://web.telegram.org",
      "https://*.telegram.org",
      "https://*.t.me",
    ].join(" "),
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
