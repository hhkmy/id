import { createJsonResponse } from "./utils.js";

export const getVisitorLocation = (request) => {
  const rawCountry = String(request.cf?.country || "").toUpperCase();
  const country = /^[A-Z]{2}$/.test(rawCountry) ? rawCountry : "MM";

  const rawCity = String(request.cf?.city || "").trim();
  const city = rawCity.slice(0, 100) || "";
  const colo = String(request.cf?.colo || "").trim();
  const timezone = String(request.cf?.timezone || "").trim();

  return { country, city, colo, timezone };
};

export const handleEdgeInfo = (request) => {
  const location = getVisitorLocation(request);
  return createJsonResponse(location, 200, "public, max-age=3600");
};
