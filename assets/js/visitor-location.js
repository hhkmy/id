const COUNTRY_NAMES = {
  MM: "Myanmar",
  SG: "Singapore",
  TH: "Thailand",
  MY: "Malaysia",
  US: "United States",
  GB: "United Kingdom",
  JP: "Japan",
  KR: "South Korea",
  IN: "India",
  VN: "Vietnam",
  ID: "Indonesia",
  CN: "China",
  AU: "Australia",
  DE: "Germany",
  FR: "France",
  CA: "Canada",
  AE: "UAE",
  HK: "Hong Kong",
  TW: "Taiwan",
};

function getFlagEmoji(countryCode) {
  if (countryCode?.length !== 2) return "🌐";
  return countryCode
    .toUpperCase()
    .split("")
    .map((c) => String.fromCodePoint(127397 + c.codePointAt(0)))
    .join("");
}

function getCountryName(cc) {
  try {
    if (window.Intl?.DisplayNames) {
      const dn = new Intl.DisplayNames(["en"], { type: "region" });
      const name = dn.of(cc);
      if (name)
        return name.replace(" (Burma)", "").replace("(Burma)", "").trim();
    }
  } catch (_) {
    // Ignore Intl.DisplayNames exceptions and fallback to COUNTRY_NAMES
  }
  return COUNTRY_NAMES[cc] || cc;
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

  try {
    const res = await fetch("/api/edge-info", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (data?.country) {
        renderLocation(locEl, data.country, data.city);
        return;
      }
    }
  } catch (_) {
    // Ignore edge-info fetch failure and fallback to cdn-cgi trace
  }

  try {
    const res = await fetch("/cdn-cgi/trace");
    if (res.ok) {
      const text = await res.text();
      const trace = {};
      text.split("\n").forEach((line) => {
        const [k, v] = line.split("=");
        if (k && v) trace[k.trim()] = v.trim();
      });
      if (trace.loc) {
        renderLocation(locEl, trace.loc, "");
        return;
      }
    }
  } catch (_) {
    // Ignore trace fetch failure and fallback to timezone
  }

  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    if (tz.includes("Yangon") || tz.includes("Rangoon")) {
      renderLocation(locEl, "MM", "Yangon");
    } else if (tz.includes("Singapore")) {
      renderLocation(locEl, "SG", "Singapore");
    } else if (tz.includes("Bangkok")) {
      renderLocation(locEl, "TH", "Bangkok");
    } else {
      const city = tz.split("/").pop().replaceAll("_", " ");
      renderLocation(locEl, "MM", city || "Myanmar");
    }
  } catch (_) {
    // Fallback to default MM if timezone resolution fails
    renderLocation(locEl, "MM", "Myanmar");
  }
}
