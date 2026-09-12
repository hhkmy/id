function getFlagEmoji(countryCode) {
  if (countryCode?.length !== 2) return "🌐";
  return countryCode
    .toUpperCase()
    .split("")
    .map((c) => String.fromCodePoint(127397 + c.codePointAt(0)))
    .join("");
}

function getCountryName(countryCode) {
  try {
    if (window.Intl?.DisplayNames) {
      const dn = new Intl.DisplayNames(["en"], { type: "region" });
      const name = dn.of(countryCode);
      if (name) {
        return name.replace(" (Burma)", "").replace("(Burma)", "").trim();
      }
    }
  } catch (_) {
    // Ignore Intl.DisplayNames exceptions and fallback to country code
  }
  return countryCode;
}

function buildLocationText(data, countryName) {
  const city = data.city?.trim();
  const region = data.region?.trim();
  const locationParts = [];

  if (city) {
    locationParts.push(city);
  }
  if (region && region.toLowerCase() !== city?.toLowerCase()) {
    locationParts.push(region);
  }
  locationParts.push(countryName);

  return locationParts.join(", ");
}

function updateBadgeTitle(badge, data, locationText) {
  if (!badge) return;

  const details = [];
  if (data.ip) {
    details.push(`IP: ${data.ip}`);
  }

  const asnStr = data.asn ? `AS${data.asn}` : "";
  const orgStr = data.asOrganization?.trim() || "";
  const networkStr = [asnStr, orgStr].filter(Boolean).join(" ");
  if (networkStr) {
    details.push(`Network: ${networkStr}`);
  }

  details.push(`Location: ${locationText}`);
  if (data.colo) {
    details.push(`Edge: ${data.colo}`);
  }

  badge.title = details.join(" • ");
}

function renderLocation(locEl, data) {
  const cc = (data.country || "").toUpperCase();
  if (!cc || cc === "XX") {
    locEl.innerHTML = '<span class="edge-location-global">Global Edge</span>';
    return;
  }

  const flagEmoji = getFlagEmoji(cc);
  const countryName = getCountryName(cc);
  const locationText = buildLocationText(data, countryName);
  const flagImg = `<img src="https://flagcdn.com/24x18/${cc.toLowerCase()}.png" srcset="https://flagcdn.com/48x36/${cc.toLowerCase()}.png 2x" width="18" height="13.5" alt="${cc}" class="edge-flag" onerror="this.replaceWith(document.createTextNode('${flagEmoji}'))" />`;

  locEl.innerHTML = `
    <span class="edge-location-display">
      ${flagImg}
      <span class="leading-none tracking-tight">${locationText}</span>
    </span>
  `;

  const badge = locEl.closest("#cf-edge-badge, [data-edge-badge]");
  updateBadgeTitle(badge, data, locationText);
}

export async function initVisitorLocation() {
  const locEl =
    document.getElementById("cf-edge-location") ||
    document.querySelector("[data-edge-location]");
  if (!locEl) return;

  // 1. Fetch Cloudflare Worker endpoint (/api/edge-info) for Real IP Data (Radar-style)
  try {
    const res = await fetch("/api/edge-info", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (data?.country && data.country !== "XX") {
        renderLocation(locEl, data);
        return;
      }
    }
  } catch (_) {
    // Ignore edge-info fetch failure and fallback to cdn-cgi trace
  }

  // 2. Fallback to Cloudflare native edge trace (/cdn-cgi/trace)
  try {
    const res = await fetch("/cdn-cgi/trace");
    if (res.ok) {
      const text = await res.text();
      const trace = {};
      text.split("\n").forEach((line) => {
        const [k, v] = line.split("=");
        if (k && v) trace[k.trim()] = v.trim();
      });
      if (trace.loc && trace.loc !== "XX") {
        renderLocation(locEl, {
          ip: trace.ip || "",
          country: trace.loc,
          colo: trace.colo || "",
        });
        return;
      }
    }
  } catch (_) {
    // Ignore trace fetch failure and fallback to global edge
  }

  // 3. Fallback when Cloudflare location is unavailable
  renderLocation(locEl, { country: "XX" });
}
