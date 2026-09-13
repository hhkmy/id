#!/usr/bin/env node

/**
 * Cloudflare KV Shop Data Synchronizer.
 *
 * Reads data/services.json, categorizes plans into products keys,
 * and bulk uploads store information, payment details, and services to SHOP_DATA KV.
 */

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const ROOT_DIR = process.cwd();
const SERVICES_FILE = path.join(ROOT_DIR, "data", "services.json");
const SCRATCH_BULK_FILE = path.join(ROOT_DIR, "scratch_kv_services_bulk.json");
const NPX_BIN = path.join(path.dirname(process.execPath), "npx");

function main() {
  if (!fs.existsSync(SERVICES_FILE)) {
    console.error("[error] data/services.json not found!");
    process.exit(1);
  }

  const raw = fs.readFileSync(SERVICES_FILE, "utf8");
  const data = JSON.parse(raw);

  const premium = [];
  const stars = [];
  const gram = [];
  const other = [];

  for (const plan of data.plans || []) {
    const cat = (plan.category || "").toLowerCase();
    const title = (plan.title || "").toLowerCase();
    if (cat.includes("premium") || title.includes("premium")) {
      premium.push(plan);
    } else if (cat.includes("star") || title.includes("star")) {
      stars.push(plan);
    } else if (cat.includes("gram") || title.includes("gram")) {
      gram.push(plan);
    } else {
      other.push(plan);
    }
  }

  const storeInfo = {
    store: data.store,
    stars_info: data.stars_info,
  };

  const paymentDetails = {
    ...data.payment_details,
    payment_methods: data.payment_methods,
  };

  const bulk = [
    { key: "products:telegram_premium", value: JSON.stringify(premium, null, 2) },
    { key: "products:telegram_stars", value: JSON.stringify(stars, null, 2) },
    { key: "products:gram", value: JSON.stringify(gram, null, 2) },
    { key: "products:other", value: JSON.stringify(other, null, 2) },
    { key: "store:info", value: JSON.stringify(storeInfo, null, 2) },
    { key: "payment:details", value: JSON.stringify(paymentDetails, null, 2) },
    { key: "services", value: JSON.stringify(data, null, 2) },
  ];

  fs.writeFileSync(SCRATCH_BULK_FILE, JSON.stringify(bulk, null, 2), "utf8");
  console.log(`[kv] Generated bulk payload with ${bulk.length} keys from data/services.json:`);
  console.log(`  - Telegram Premium: ${premium.length} plans`);
  console.log(`  - Telegram Stars:   ${stars.length} plans`);
  console.log(`  - Gram:             ${gram.length} plans`);
  console.log(`  - Other Services:   ${other.length} plans`);

  try {
    console.log("[kv] Uploading services to Cloudflare KV (SHOP_DATA)...");
    execFileSync(NPX_BIN, ["wrangler", "kv", "bulk", "put", SCRATCH_BULK_FILE, "--binding=SHOP_DATA", "--remote"], {
      stdio: "inherit",
      env: { ...process.env, NODE_OPTIONS: "--dns-result-order=ipv4first" },
    });
    console.log("[kv] Successfully synchronized shop data to Cloudflare KV!");
  } catch (err) {
    console.error("[kv:error] Failed to upload shop data to KV:", err.message);
    process.exit(1);
  } finally {
    if (fs.existsSync(SCRATCH_BULK_FILE)) {
      fs.unlinkSync(SCRATCH_BULK_FILE);
    }
  }
}

main();
