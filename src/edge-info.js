import { createJsonResponse } from "./utils.js";

export const getVisitorLocation = (request) => {
  // 1. Real visitor IP address
  const ip =
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-real-ip") ||
    "";

  // 2. Real IP Geolocation from Cloudflare
  const rawCountry = String(
    request.cf?.country || request.headers.get("cf-ipcountry") || "",
  ).toUpperCase();
  const country = /^[A-Z]{2}$/.test(rawCountry) ? rawCountry : "";

  const city = String(request.cf?.city || "").trim();
  const region = String(request.cf?.region || "").trim();
  const regionCode = String(request.cf?.regionCode || "").trim();
  const postalCode = String(request.cf?.postalCode || "").trim();
  const continent = String(request.cf?.continent || "").trim();
  const latitude = request.cf?.latitude ? String(request.cf.latitude) : "";
  const longitude = request.cf?.longitude ? String(request.cf.longitude) : "";
  const timezone = String(request.cf?.timezone || "").trim();

  // 3. Network & Edge infrastructure (Cloudflare Radar data)
  const colo = String(request.cf?.colo || "").trim();
  const asn = request.cf?.asn ? Number(request.cf.asn) : null;
  const asOrganization = String(request.cf?.asOrganization || "").trim();
  const httpProtocol = String(request.cf?.httpProtocol || "").trim();
  const tlsVersion = String(request.cf?.tlsVersion || "").trim();

  return {
    ip,
    country,
    city,
    region,
    regionCode,
    postalCode,
    continent,
    latitude,
    longitude,
    timezone,
    colo,
    asn,
    asOrganization,
    httpProtocol,
    tlsVersion,
  };
};

export const handleEdgeInfo = (request) => {
  const location = getVisitorLocation(request);
  // Real IP and dynamic edge info must never be cached across visitors
  return createJsonResponse(
    location,
    200,
    "private, no-cache, no-store, must-revalidate",
  );
};
