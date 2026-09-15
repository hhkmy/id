/**
 * Speedlify2 Score Web Component
 * Fetches and renders live Speedlify benchmark scores.
 */

function getScoreClass(score) {
  if (score >= 90) return "speedlify-score-good";
  if (score >= 50) return "speedlify-score-warn";
  return "speedlify-score-bad";
}

function createScoreItem(cat) {
  const item = document.createElement("div");
  item.className = "speedlify-score-item";
  item.title = `${cat.score} - ${cat.label}`;

  const circle = document.createElement("span");
  circle.className = `speedlify-score-circle ${getScoreClass(cat.score)}`;
  circle.setAttribute("aria-hidden", "true");
  circle.textContent = String(cat.score);

  const sr = document.createElement("span");
  sr.className = "sr-only";
  sr.textContent = `${cat.score} - ${cat.label}`;

  item.append(circle, sr);
  return item;
}

function normalizeScore(val) {
  if (typeof val !== "number") return 0;
  return val <= 1 ? Math.round(val * 100) : Math.round(val);
}

function calculateSpeedlifySlug(targetUrl) {
  let source;
  try {
    const u = new URL(targetUrl);
    const pathname = u.pathname === "/" ? "" : u.pathname.replace(/\/$/, "");
    source = `${u.hostname}${pathname}${u.search}`;
  } catch {
    source = String(targetUrl).trim();
  }

  return source
    .toLowerCase()
    .replaceAll("-", "--")
    .replace(/[^a-z0-9-]/g, "-")
    .slice(0, 180);
}

class SpeedlifyScoreElement extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  async render() {
    const rawSpeedlifyUrl = this.getAttribute("speedlify-url");
    if (!rawSpeedlifyUrl) return;

    const speedlifyUrl = rawSpeedlifyUrl.endsWith("/")
      ? rawSpeedlifyUrl.slice(0, -1)
      : rawSpeedlifyUrl;
    const targetUrl = this.getAttribute("url") || window.location.href;

    try {
      // 1. Try Speedlify 2 direct site endpoint
      const slug = calculateSpeedlifySlug(targetUrl);
      const siteResp = await fetch(`${speedlifyUrl}/api/site/${slug}.json`);
      if (siteResp.ok) {
        const siteData = await siteResp.json();
        if (siteData?.lighthouse) {
          const reportLink = siteData.page ? `${speedlifyUrl}${siteData.page}` : speedlifyUrl;
          this.renderScores(siteData.lighthouse, reportLink);
          return;
        }
      }

      // 2. Fallback to legacy Speedlify 1 urls.json
      const response = await fetch(`${speedlifyUrl}/api/urls.json`);
      if (!response.ok) return;

      const data = await response.json();
      const match = Array.isArray(data)
        ? data.find(
            (entry) =>
              entry.url === targetUrl || entry.requestedUrl === targetUrl,
          )
        : data[targetUrl];

      if (match?.lighthouse) {
        this.renderScores(match.lighthouse, speedlifyUrl);
      }
    } catch {
      // Safely ignore fetch error when offline or speedlify endpoint is unreachable
    }
  }

  renderScores(scores, speedlifyUrl) {
    const categories = [
      {
        label: "Performance",
        score: normalizeScore(scores.performance),
      },
      {
        label: "Accessibility",
        score: normalizeScore(scores.accessibility),
      },
      {
        label: "Best Practices",
        score: normalizeScore(scores.bestPractices),
      },
      { label: "SEO", score: normalizeScore(scores.seo) },
    ];

    const container = document.createElement("div");
    container.className = "speedlify-score-group";

    for (const cat of categories) {
      if (!Number.isNaN(cat.score)) {
        container.appendChild(createScoreItem(cat));
      }
    }

    const link = document.createElement("a");
    link.href = speedlifyUrl;
    link.className = "speedlify-score-link";
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Speedlify";
    container.appendChild(link);

    this.replaceChildren(container);
  }
}

export function initSpeedlifyScore() {
  if (!customElements.get("speedlify-score")) {
    customElements.define("speedlify-score", SpeedlifyScoreElement);
  }
  if (!customElements.get("speedlify2-score")) {
    customElements.define(
      "speedlify2-score",
      class extends SpeedlifyScoreElement {},
    );
  }
}
