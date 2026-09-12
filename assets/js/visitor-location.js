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

function renderLocation(locEl, countryCode, cityName) {
  const cc = (countryCode || "").toUpperCase();
  if (!cc || cc === "XX") {
    locEl.innerHTML = '<span class="edge-location-global">Global Edge</span>';
    return;
  }

  const flagEmoji = getFlagEmoji(cc);
  const countryName = getCountryName(cc);
  const displayCity =
    cityName && cityName.trim().length > 0 ? cityName.trim() : "";
  const locationText = displayCity
    ? `${displayCity}, ${countryName}`
    : countryName;

  const flagImg = `<img src="https://flagcdn.com/24x18/${cc.toLowerCase()}.png" srcset="https://flagcdn.com/48x36/${cc.toLowerCase()}.png 2x" width="18" height="13.5" alt="${cc}" class="edge-flag" onerror="this.replaceWith(document.createTextNode('${flagEmoji}'))" />`;

  locEl.innerHTML = `
    <span class="edge-location-display">
      ${flagImg}
      <span class="leading-none tracking-tight">${locationText}</span>
    </span>
  `;
}

export async function initVisitorLocation() {
  const locEl =
    document.getElementById("cf-edge-location") ||
    document.querySelector("[data-edge-location]");
  if (!locEl) return;

  // 1. Fetch Cloudflare edge info from Worker (/api/edge-info) based on Real IP
  try {
    const res = await fetch("/api/edge-info", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (data?.country && data.country !== "XX") {
        renderLocation(locEl, data.country, data.city);
        return;
      }
    }
  } catch (_) {
    // Ignore edge-info fetch failure and fallback to cdn-cgi trace
  }

  // 2. Fallback to Cloudflare native edge trace (/cdn-cgi/trace) based on Real IP
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
        renderLocation(locEl, trace.loc, "");
        return;
      }
    }
  } catch (_) {
    // Ignore trace fetch failure and fallback to global edge
  }

  // 3. Fallback when Cloudflare location is unavailable
  renderLocation(locEl, "XX", "");
}
