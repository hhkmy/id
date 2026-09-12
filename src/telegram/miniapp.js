/**
 * Telegram Mini App HTML/CSS/JS Dashboard renderer.
 */

export function renderMiniAppHtml() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Shop Manager — MPX Store</title>
  <script src="https://telegram.org/js/telegram-web-app.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/lottie-web@5.12.2/build/player/lottie_light.min.js"></script>
  <style>
    /* BASE THEMING (Dark theme default, high-contrast light theme override) */
    :root {
      --bg: #0b0f19;
      --text: #f8fafc;
      --hint: #94a3b8;
      --link: #38bdf8;
      --button: #0284c7;
      --button-text: #ffffff;
      --card-bg: #151d30;
      --card-hover: rgba(255, 255, 255, 0.04);
      --border: rgba(255, 255, 255, 0.12);
      --border-focus: #38bdf8;
      --control-bg: rgba(0, 0, 0, 0.35);
      --control-border: rgba(255, 255, 255, 0.12);
      --input-bg: rgba(0, 0, 0, 0.25);
      --input-border: rgba(255, 255, 255, 0.16);
      --input-text: #f8fafc;
      --footer-bg: rgba(15, 23, 42, 0.94);
      --toggle-track: rgba(255, 255, 255, 0.2);
      --avatar-bg: rgba(255, 255, 255, 0.06);
      --badge-bg: rgba(56, 189, 248, 0.1);
      --badge-text: #38bdf8;
      --badge-border: rgba(56, 189, 248, 0.25);
      --success: #10b981;
      --danger: #ef4444;
      --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.3);
      --shadow-md: 0 8px 24px rgba(0, 0, 0, 0.4);
    }

    /* Crisp, High-Contrast Light Mode */
    :root.light-mode, body.light-mode {
      --bg: #f8fafc;
      --text: #0f172a;
      --hint: #475569;
      --link: #0284c7;
      --button: #0284c7;
      --button-text: #ffffff;
      --card-bg: #ffffff;
      --card-hover: #f1f5f9;
      --border: #cbd5e1;
      --border-focus: #0284c7;
      --control-bg: #e2e8f0;
      --control-border: #cbd5e1;
      --input-bg: #ffffff;
      --input-border: #94a3b8;
      --input-text: #0f172a;
      --footer-bg: rgba(255, 255, 255, 0.96);
      --toggle-track: #cbd5e1;
      --avatar-bg: #f1f5f9;
      --badge-bg: rgba(2, 132, 199, 0.08);
      --badge-text: #0284c7;
      --badge-border: rgba(2, 132, 199, 0.25);
      --success: #059669;
      --danger: #dc2626;
      --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.08);
      --shadow-md: 0 8px 24px rgba(0, 0, 0, 0.1);
    }

    @media (prefers-color-scheme: light) {
      :root:not(.dark-mode) {
        --bg: #f8fafc;
        --text: #0f172a;
        --hint: #475569;
        --link: #0284c7;
        --button: #0284c7;
        --button-text: #ffffff;
        --card-bg: #ffffff;
        --card-hover: #f1f5f9;
        --border: #cbd5e1;
        --border-focus: #0284c7;
        --control-bg: #e2e8f0;
        --control-border: #cbd5e1;
        --input-bg: #ffffff;
        --input-border: #94a3b8;
        --input-text: #0f172a;
        --footer-bg: rgba(255, 255, 255, 0.96);
        --toggle-track: #cbd5e1;
        --avatar-bg: #f1f5f9;
        --badge-bg: rgba(2, 132, 199, 0.08);
        --badge-text: #0284c7;
        --badge-border: rgba(2, 132, 199, 0.25);
        --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.08);
        --shadow-md: 0 8px 24px rgba(0, 0, 0, 0.1);
      }
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-tap-highlight-color: transparent;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: var(--bg);
      color: var(--text);
      padding: 16px;
      padding-bottom: 96px;
      font-size: 14px;
      line-height: 1.5;
      transition: background-color 0.2s, color 0.2s;
    }

    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border-width: 0;
    }

    /* Auth Gate */
    .auth-overlay {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 80vh;
      text-align: center;
      padding: 20px;
    }

    .auth-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 18px;
      padding: 32px 24px;
      max-width: 380px;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      box-shadow: var(--shadow-md);
      transition: background-color 0.2s, border-color 0.2s;
    }

    .auth-icon {
      font-size: 46px;
      line-height: 1;
    }

    .auth-title {
      font-size: 20px;
      font-weight: 700;
      color: var(--text);
    }

    .auth-desc {
      font-size: 13px;
      color: var(--hint);
      line-height: 1.4;
    }

    .auth-status {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 14px;
      color: var(--link);
      margin-top: 6px;
    }

    .auth-error {
      background: rgba(239, 68, 68, 0.12);
      color: var(--danger);
      border: 1px solid rgba(239, 68, 68, 0.25);
      padding: 10px 14px;
      border-radius: 10px;
      font-size: 13px;
      width: 100%;
      display: none;
    }

    .auth-divider {
      display: flex;
      align-items: center;
      width: 100%;
      color: var(--hint);
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin: 10px 0;
    }

    .auth-divider::before, .auth-divider::after {
      content: "";
      flex: 1;
      border-bottom: 1px solid var(--border);
    }

    .auth-divider span {
      padding: 0 12px;
    }

    /* Header Bar */
    .top-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .brand-title {
      font-size: 19px;
      font-weight: 700;
      letter-spacing: -0.3px;
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--text);
    }

    .brand-sub {
      font-size: 12px;
      color: var(--hint);
      margin-top: 1px;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .btn-action-icon {
      background: var(--control-bg);
      border: 1px solid var(--border);
      color: var(--text);
      width: 32px;
      height: 32px;
      border-radius: 8px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 15px;
      transition: all 0.15s;
    }

    .btn-action-icon:hover {
      border-color: var(--border-focus);
    }

    .btn-logout:hover {
      color: var(--danger);
      border-color: rgba(239, 68, 68, 0.35);
    }

    .badge-kv {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.5px;
      padding: 5px 8px;
      border-radius: 8px;
      background: var(--badge-bg);
      color: var(--badge-text);
      border: 1px solid var(--badge-border);
      display: inline-flex;
      align-items: center;
      gap: 2px;
      line-height: 1;
    }

    /* PAYMENT ACCOUNT DETAILS - AT TOP */
    .payment-summary-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 12px 14px;
      margin-bottom: 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      box-shadow: var(--shadow-sm);
      transition: all 0.15s;
    }

    .payment-summary-left {
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 0;
      flex: 1;
    }

    .payment-summary-icon {
      font-size: 20px;
      flex-shrink: 0;
    }

    .payment-summary-text {
      min-width: 0;
      flex: 1;
    }

    .payment-summary-title {
      font-size: 13px;
      font-weight: 700;
      color: var(--text);
    }

    .payment-summary-sub {
      font-size: 11.5px;
      color: var(--hint);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-top: 1px;
    }

    .btn-toggle-payment {
      background: var(--control-bg);
      color: var(--link);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 5px 11px;
      font-size: 11.5px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s;
      flex-shrink: 0;
    }

    .btn-toggle-payment:hover {
      border-color: var(--border-focus);
    }

    .payment-drawer {
      margin-bottom: 14px;
    }

    .payment-card {
      background: var(--card-bg);
      border: 1px solid var(--border-focus);
      border-radius: 14px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      box-shadow: var(--shadow-md);
      animation: fadeIn 0.2s ease-in-out;
    }

    .payment-card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--border);
      font-size: 13px;
      font-weight: 700;
      color: var(--text);
    }

    .btn-close-payment {
      background: var(--button);
      color: var(--button-text);
      border: none;
      border-radius: 6px;
      padding: 4px 10px;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-4px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Category Selection Box (Box Only - No Dropdown) */
    .category-box {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 12px;
      margin-bottom: 14px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      box-shadow: var(--shadow-sm);
      transition: background-color 0.2s, border-color 0.2s;
    }

    .category-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .category-label {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      color: var(--hint);
    }

    .category-badge {
      font-size: 12px;
      font-weight: 600;
      color: var(--badge-text);
      background: var(--badge-bg);
      border: 1px solid var(--badge-border);
      padding: 2px 8px;
      border-radius: 12px;
    }

    /* Segmented Quick Switcher - STRICT 3 LINES ON BOTH MOBILE & WEB */
    .segmented-control {
      display: grid !important;
      grid-template-columns: repeat(5, 1fr) !important;
      gap: 5px !important;
      background: var(--control-bg) !important;
      border-radius: 12px !important;
      padding: 5px !important;
      border: 1px solid var(--control-border) !important;
    }

    .segment-btn {
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      justify-content: center !important;
      text-align: center !important;
      padding: 8px 3px !important;
      border-radius: 9px !important;
      border: none !important;
      cursor: pointer !important;
      background: transparent !important;
      color: var(--hint) !important;
      transition: all 0.15s ease !important;
      min-width: 0 !important;
      width: 100% !important;
      user-select: none !important;
    }

    /* Line 1: Emoji */
    .segment-emoji {
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      width: 100% !important;
      height: 24px !important;
      font-size: 20px !important;
      line-height: 1.15 !important;
      text-align: center !important;
    }

    tg-emoji {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      vertical-align: middle;
    }

    .segment-emoji tg-emoji {
      width: 22px;
      height: 22px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .segment-emoji .tg-emoji-wrap {
      width: 22px;
      height: 22px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .segment-emoji .tg-emoji-wrap svg,
    .segment-emoji .tg-emoji-wrap img,
    .segment-emoji .tg-emoji-wrap video {
      width: 22px;
      height: 22px;
      object-fit: contain;
    }

    .plan-avatar tg-emoji {
      width: 26px;
      height: 26px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .plan-avatar .tg-emoji-wrap {
      width: 26px;
      height: 26px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .plan-avatar .tg-emoji-wrap svg,
    .plan-avatar .tg-emoji-wrap img,
    .plan-avatar .tg-emoji-wrap video {
      width: 26px;
      height: 26px;
      object-fit: contain;
    }

    /* Line 2: Title */
    .segment-title {
      display: block !important;
      width: 100% !important;
      font-size: 11.5px !important;
      font-weight: 700 !important;
      line-height: 1.25 !important;
      margin-top: 3px !important;
      text-align: center !important;
      white-space: nowrap !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
      color: var(--text) !important;
    }

    /* Line 3: Count */
    .segment-count {
      display: block !important;
      width: 100% !important;
      font-size: 10px !important;
      line-height: 1.2 !important;
      margin-top: 2px !important;
      text-align: center !important;
      white-space: nowrap !important;
      color: var(--hint) !important;
      opacity: 0.85 !important;
    }

    .segment-btn.active {
      background: var(--button) !important;
      color: var(--button-text) !important;
      box-shadow: 0 2px 10px rgba(2, 132, 199, 0.4) !important;
    }

    .segment-btn.active .segment-title {
      color: var(--button-text) !important;
    }

    .segment-btn.active .segment-count {
      color: var(--button-text) !important;
      opacity: 0.95 !important;
    }

    /* Search Input */
    .search-box {
      margin-bottom: 14px;
    }

    .search-input {
      width: 100%;
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 10px;
      color: var(--text);
      padding: 10px 14px;
      font-size: 13.5px;
      outline: none;
      transition: border-color 0.15s;
    }

    .search-input:focus {
      border-color: var(--border-focus);
    }

    /* Section Headers */
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 18px 0 10px 0;
    }

    .section-title {
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      color: var(--hint);
    }

    .btn-add-plan {
      background: var(--badge-bg);
      color: var(--link);
      border: 1px solid var(--badge-border);
      border-radius: 8px;
      padding: 5px 11px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s;
    }

    .btn-add-plan:hover {
      opacity: 0.9;
    }

    /* Plan Card */
    .plan-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 14px;
      margin-bottom: 12px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      box-shadow: var(--shadow-sm);
      transition: border-color 0.15s, background-color 0.2s;
    }

    .plan-card:hover {
      border-color: var(--border-focus);
    }

    .plan-card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      border-bottom: 1px solid var(--border);
      padding-bottom: 10px;
    }

    .plan-info-main {
      display: flex;
      align-items: center;
      gap: 10px;
      flex: 1;
      min-width: 0;
    }

    .plan-avatar {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: var(--avatar-bg);
      border: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      flex-shrink: 0;
    }

    .plan-titles {
      display: flex;
      flex-direction: column;
      min-width: 0;
      flex: 1;
    }

    .plan-title-input {
      background: transparent;
      border: none;
      color: var(--text);
      font-size: 14.5px;
      font-weight: 700;
      outline: none;
      width: 100%;
      padding: 0;
    }

    .plan-title-input:focus {
      border-bottom: 1px solid var(--link);
    }

    .plan-header-controls {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-shrink: 0;
    }

    /* iOS Style Toggle Switch */
    .toggle-wrap {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      font-weight: 600;
      color: var(--hint);
      cursor: pointer;
    }

    .switch {
      position: relative;
      display: inline-block;
      width: 36px;
      height: 20px;
    }

    .switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: var(--toggle-track);
      transition: .2s;
      border-radius: 20px;
    }

    .slider:before {
      position: absolute;
      content: "";
      height: 14px;
      width: 14px;
      left: 3px;
      bottom: 3px;
      background-color: #ffffff;
      transition: .2s;
      border-radius: 50%;
      box-shadow: 0 1px 3px rgba(0,0,0,0.3);
    }

    input:checked + .slider {
      background-color: var(--button);
    }

    input:checked + .slider:before {
      transform: translateX(16px);
    }

    .btn-card-del {
      background: transparent;
      border: none;
      color: var(--hint);
      cursor: pointer;
      font-size: 16px;
      padding: 4px;
      border-radius: 6px;
      transition: all 0.15s;
    }

    .btn-card-del:hover {
      color: var(--danger);
      background: rgba(239, 68, 68, 0.1);
    }

    /* Plan Form Fields Grid - Restored without category dropdown */
    .plan-fields-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }

    .field-group {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .field-group label {
      font-size: 11px;
      font-weight: 600;
      color: var(--hint);
      text-transform: uppercase;
      letter-spacing: 0.4px;
    }

    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .input-field {
      width: 100%;
      background: var(--input-bg);
      border: 1px solid var(--input-border);
      border-radius: 8px;
      color: var(--input-text);
      padding: 9px 10px;
      font-size: 13.5px;
      outline: none;
      transition: border-color 0.15s, background-color 0.2s;
    }

    .input-field:focus {
      border-color: var(--border-focus);
    }

    .field-full {
      grid-column: span 2;
    }

    /* Bottom Fixed Save Bar */
    .footer-bar {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 12px 16px;
      background: var(--footer-bg);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-top: 1px solid var(--border);
      display: flex;
      gap: 10px;
      z-index: 50;
      box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.1);
    }

    .btn-save {
      flex: 1;
      background: var(--button);
      color: var(--button-text);
      border: none;
      border-radius: 10px;
      padding: 13px;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      text-align: center;
      transition: opacity 0.15s;
      box-shadow: 0 4px 14px rgba(2, 132, 199, 0.35);
    }

    .btn-save:active {
      opacity: 0.85;
    }

    .btn-save:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .toast {
      position: fixed;
      top: 16px;
      left: 50%;
      transform: translateX(-50%);
      background: #047857;
      color: white;
      padding: 10px 20px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 600;
      box-shadow: 0 4px 16px rgba(0,0,0,0.4);
      display: none;
      z-index: 1000;
    }

    .spinner {
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255,255,255,0.3);
      border-radius: 50%;
      border-top-color: white;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  </style>
</head>
<body>
  <div id="toast" class="toast">Changes saved!</div>

  <!-- AUTH GATE OVERLAY -->
  <div id="authGate" class="auth-overlay">
    <div class="auth-card">
      <div class="auth-icon">🔒</div>
      <div class="auth-title">Admin Access Required</div>
      <div class="auth-desc">Only the authorized shop administrator may view and manage products, prices, and settings.</div>

      <div id="authStatus" class="auth-status" style="display: none;">
        <span class="spinner"></span>
        <span id="authStatusText">Verifying credentials...</span>
      </div>

      <div id="authError" class="auth-error"></div>

      <!-- BROWSER LOGIN: TELEGRAM LOGIN WIDGET -->
      <div id="telegramWidgetSection" style="width: 100%; display: none;">
        <div style="margin: 10px 0;">
          <script async src="https://telegram.org/js/telegram-widget.js?22"
                  data-telegram-login="HHKMyIDBot"
                  data-size="large"
                  data-radius="8"
                  data-onauth="onTelegramAuth(user)"
                  data-request-access="write"></script>
        </div>

        <div class="auth-divider">
          <span>OR</span>
        </div>

        <form id="passcodeForm" style="display: flex; flex-direction: column; gap: 10px; width: 100%;">
          <input type="password" id="passcodeInput" class="input-field" placeholder="Enter admin passcode" autocomplete="current-password" style="padding: 11px;">
          <button type="submit" class="btn-save" style="padding: 10px; font-size: 14px;">Unlock with Passcode</button>
        </form>
      </div>
    </div>
  </div>

  <!-- MAIN ADMIN DASHBOARD (Hidden until authenticated) -->
  <div id="adminDashboard" style="display: none;">
    <!-- Top Bar -->
    <div class="top-bar">
      <div>
        <div class="brand-title">
          <span>🛒 Shop Admin</span>
        </div>
        <div id="adminSubtitle" class="brand-sub">MPX Store Manager</div>
      </div>
      <div class="header-actions">
        <button type="button" id="themeToggleBtn" class="btn-action-icon" title="Toggle Light/Dark Theme" aria-label="Toggle light and dark theme">
          <span id="themeToggleIcon">🌓</span>
          <span class="sr-only">Toggle theme</span>
        </button>
        <span class="badge-kv" title="Cloudflare KV Database">⚡ KV</span>
        <button type="button" id="logoutBtn" class="btn-action-icon btn-logout" title="Logout" aria-label="Logout">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          <span class="sr-only">Logout</span>
        </button>
      </div>
    </div>

    <form id="shopForm">
      <!-- Payment Account Details (Placed Prominently at Top) -->
      <div class="payment-summary-card">
        <div class="payment-summary-left">
          <div class="payment-summary-icon">💳</div>
          <div class="payment-summary-text">
            <div class="payment-summary-title">Payment Account Details</div>
            <div id="paymentSummaryDesc" class="payment-summary-sub">Loading payment info...</div>
          </div>
        </div>
        <button type="button" id="togglePaymentBtn" class="btn-toggle-payment">✏️ Edit</button>
      </div>

      <div id="paymentDrawer" class="payment-drawer" style="display: none;">
        <div class="payment-card">
          <div class="payment-card-header">
            <span>⚙️ Configure Payment Details</span>
            <button type="button" id="closePaymentBtn" class="btn-close-payment">Done</button>
          </div>
          <div class="field-group">
            <label for="payPhone">Phone Number</label>
            <input type="tel" id="payPhone" class="input-field" placeholder="09xxxxxxxxx">
          </div>
          <div class="field-group">
            <label for="payName">Account Name</label>
            <input type="text" id="payName" class="input-field" placeholder="Account Name">
          </div>
          <div class="field-group">
            <label for="payNote">Payment Note</label>
            <input type="text" id="payNote" class="input-field" placeholder="e.g. Be Happy Money">
          </div>
        </div>
      </div>

      <!-- Category Selector Box (Clean Segmented Box - All First, Premium Default) -->
      <div class="category-box">
        <div class="category-header">
          <span class="category-label">Product Category</span>
          <span id="activeCategoryBadge" class="category-badge">4 Plans</span>
        </div>

        <div class="segmented-control">
          <button type="button" class="segment-btn" data-filter="all">
            <span class="segment-emoji">📋</span>
            <span class="segment-title">All</span>
            <span class="segment-count" id="countAll">23 Plans</span>
          </button>
          <button type="button" class="segment-btn active" data-filter="premium">
            <span class="segment-emoji"><tg-emoji emoji-id="6192798024230505469"><span class="tg-emoji-wrap">🎁</span></tg-emoji></span>
            <span class="segment-title">Premium</span>
            <span class="segment-count" id="countPremium">4 Plans</span>
          </button>
          <button type="button" class="segment-btn" data-filter="stars">
            <span class="segment-emoji"><tg-emoji emoji-id="6325838686378269641"><span class="tg-emoji-wrap">⭐️</span></tg-emoji></span>
            <span class="segment-title">Stars</span>
            <span class="segment-count" id="countStars">16 Plans</span>
          </button>
          <button type="button" class="segment-btn" data-filter="gram">
            <span class="segment-emoji"><tg-emoji emoji-id="6169992765795999529"><span class="tg-emoji-wrap">💎</span></tg-emoji></span>
            <span class="segment-title">Gram</span>
            <span class="segment-count" id="countGram">1 Plan</span>
          </button>
          <button type="button" class="segment-btn" data-filter="other">
            <span class="segment-emoji"><tg-emoji emoji-id="6210689895912968015"><span class="tg-emoji-wrap">🌐</span></tg-emoji></span>
            <span class="segment-title">Others</span>
            <span class="segment-count" id="countOther">2 Plans</span>
          </button>
        </div>
      </div>

      <!-- Search Box -->
      <div class="search-box">
        <input type="text" id="searchInput" class="search-input" placeholder="🔍 Search plans by title, duration, price...">
      </div>

      <!-- Plans Section Header -->
      <div class="section-header">
        <span class="section-title">Plans & Pricing</span>
        <button type="button" id="addPlanBtn" class="btn-add-plan">+ Add Plan</button>
      </div>

      <div id="plansContainer">Loading plans...</div>

      <!-- Fixed Bottom Save Bar -->
      <div class="footer-bar">
        <button type="submit" id="saveBtn" class="btn-save">Save Changes</button>
      </div>
    </form>
  </div>

  <script>
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
    }

    let shopData = null;
    // Default selection is Telegram Premium
    let activeFilter = "premium";
    let searchQuery = "";
    let adminToken = localStorage.getItem("mpx_admin_token") || "";

    const authGate = document.getElementById("authGate");
    const authStatus = document.getElementById("authStatus");
    const authStatusText = document.getElementById("authStatusText");
    const authError = document.getElementById("authError");
    const telegramWidgetSection = document.getElementById("telegramWidgetSection");
    const adminDashboard = document.getElementById("adminDashboard");
    const paymentDrawer = document.getElementById("paymentDrawer");
    const togglePaymentBtn = document.getElementById("togglePaymentBtn");
    const closePaymentBtn = document.getElementById("closePaymentBtn");
    const themeToggleBtn = document.getElementById("themeToggleBtn");

    // Theme Management: Light/Dark Mode handling
    function applyTheme(isLight) {
      if (isLight) {
        document.documentElement.classList.add("light-mode");
        document.body.classList.add("light-mode");
        document.documentElement.classList.remove("dark-mode");
        document.body.classList.remove("dark-mode");
        const iconEl = document.getElementById("themeToggleIcon");
        if (iconEl) iconEl.textContent = "☀️";
      } else {
        document.documentElement.classList.remove("light-mode");
        document.body.classList.remove("light-mode");
        document.documentElement.classList.add("dark-mode");
        document.body.classList.add("dark-mode");
        const iconEl = document.getElementById("themeToggleIcon");
        if (iconEl) iconEl.textContent = "🌙";
      }
    }

    function initTheme() {
      const savedTheme = localStorage.getItem("mpx_theme");
      if (savedTheme) {
        applyTheme(savedTheme === "light");
      } else if (tg && tg.colorScheme) {
        applyTheme(tg.colorScheme === "light");
      } else {
        const prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
        applyTheme(prefersLight);
      }
    }

    initTheme();

    if (themeToggleBtn) {
      themeToggleBtn.addEventListener("click", () => {
        const isCurrentlyLight = document.documentElement.classList.contains("light-mode");
        const nextLight = !isCurrentlyLight;
        localStorage.setItem("mpx_theme", nextLight ? "light" : "dark");
        applyTheme(nextLight);
      });
    }

    if (tg) {
      tg.onEvent("themeChanged", () => {
        if (!localStorage.getItem("mpx_theme")) {
          applyTheme(tg.colorScheme === "light");
        }
      });
    }

    // Payment Drawer toggle
    if (togglePaymentBtn) {
      togglePaymentBtn.addEventListener("click", () => {
        const isHidden = paymentDrawer.style.display === "none";
        paymentDrawer.style.display = isHidden ? "block" : "none";
        togglePaymentBtn.textContent = isHidden ? "▲ Close" : "✏️ Edit";
        if (isHidden) {
          document.getElementById("payPhone")?.focus();
        }
      });
    }

    if (closePaymentBtn) {
      closePaymentBtn.addEventListener("click", () => {
        paymentDrawer.style.display = "none";
        if (togglePaymentBtn) togglePaymentBtn.textContent = "✏️ Edit";
        updatePaymentSummary();
      });
    }

    ["payPhone", "payName", "payNote"].forEach((id) => {
      document.getElementById(id)?.addEventListener("input", updatePaymentSummary);
    });

    function updatePaymentSummary() {
      const phone = document.getElementById("payPhone")?.value || shopData?.payment_details?.phone || "";
      const name = document.getElementById("payName")?.value || shopData?.payment_details?.account_name || "";
      const note = document.getElementById("payNote")?.value || shopData?.payment_details?.note || "";
      const summaryEl = document.getElementById("paymentSummaryDesc");
      if (summaryEl) {
        summaryEl.textContent = [phone, name, note].filter(Boolean).join(" • ") || "No payment details configured";
      }
    }

    function showAuthError(msg) {
      authStatus.style.display = "none";
      authError.textContent = msg;
      authError.style.display = "block";
    }

    function showAuthLoading(msg) {
      authError.style.display = "none";
      authStatusText.textContent = msg;
      authStatus.style.display = "flex";
    }

    function unlockDashboard(user) {
      authGate.style.display = "none";
      adminDashboard.style.display = "block";
      if (user?.first_name) {
        document.getElementById("adminSubtitle").textContent = "Logged in as " + user.first_name;
      }
      initCustomEmojis(document);
      loadData();
    }

    // 1. Initial Authentication Flow
    async function initAuth() {
      // Case A: Inside Telegram Mini App
      if (tg && tg.initData) {
        showAuthLoading("Verifying Telegram Administrator...");
        try {
          const res = await fetch("/api/telegram/api/auth-check", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: "initData", initData: tg.initData }),
          });
          const result = await res.json();
          if (res.ok && result.authorized) {
            adminToken = result.token;
            localStorage.setItem("mpx_admin_token", result.token);
            unlockDashboard(result.user);
            return;
          }
          showAuthError(result.error || "Access Denied: Only the authorized administrator can access this panel.");
        } catch (err) {
          showAuthError("Connection error during verification.");
        }
        return;
      }

      // Case B: In Web Browser with cached session token
      if (adminToken) {
        showAuthLoading("Checking existing session...");
        try {
          const res = await fetch("/api/telegram/api/auth-check", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: "session", token: adminToken }),
          });
          const result = await res.json();
          if (res.ok && result.authorized) {
            unlockDashboard(result.user);
            return;
          }
          localStorage.removeItem("mpx_admin_token");
          adminToken = "";
        } catch {
          // Token invalid, fallback to login
        }
      }

      // Case C: Show Browser Telegram Login Widget & Passcode form
      authStatus.style.display = "none";
      telegramWidgetSection.style.display = "block";
    }

    // 2. Telegram Login Widget callback
    window.onTelegramAuth = async function(user) {
      showAuthLoading("Authenticating with Telegram...");
      try {
        const res = await fetch("/api/telegram/api/auth-check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "widget", widgetData: user }),
        });
        const result = await res.json();
        if (res.ok && result.authorized) {
          adminToken = result.token;
          localStorage.setItem("mpx_admin_token", result.token);
          unlockDashboard(result.user);
        } else {
          showAuthError(result.error || "Access Denied: Admin user ID required.");
        }
      } catch (err) {
        showAuthError("Network error during Telegram authentication.");
      }
    };

    // 3. Passcode form handler
    document.getElementById("passcodeForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const code = document.getElementById("passcodeInput").value.trim();
      if (!code) return;

      showAuthLoading("Validating passcode...");
      try {
        const res = await fetch("/api/telegram/api/auth-check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "secret", secret: code }),
        });
        const result = await res.json();
        if (res.ok && result.authorized) {
          adminToken = result.token;
          localStorage.setItem("mpx_admin_token", result.token);
          unlockDashboard(result.user);
        } else {
          showAuthError(result.error || "Invalid admin passcode.");
        }
      } catch (err) {
        showAuthError("Network error during passcode validation.");
      }
    });

    // 4. Logout handler
    document.getElementById("logoutBtn").addEventListener("click", () => {
      localStorage.removeItem("mpx_admin_token");
      adminToken = "";
      adminDashboard.style.display = "none";
      authGate.style.display = "flex";
      telegramWidgetSection.style.display = "block";
      authStatus.style.display = "none";
      authError.style.display = "none";
    });

    function showToast(msg) {
      const t = document.getElementById("toast");
      t.textContent = msg;
      t.style.display = "block";
      setTimeout(() => { t.style.display = "none"; }, 2500);
    }

    // Custom Telegram Premium Emoji Renderer for Mini App
    const emojiCache = new Map();

    async function fetchEmojiPayload(id) {
      if (emojiCache.has(id)) return emojiCache.get(id);
      const promise = (async () => {
        try {
          let res = await fetch(\`/icons/premiumemojis/\${id}.tgs.base64\`);
          if (!res.ok) {
            res = await fetch(\`/api/emoji/\${id}\`);
          }
          if (res.ok) {
            return (await res.text()).trim();
          }
        } catch {
          // Gracefully ignore fetch errors
        }
        return null;
      })();
      emojiCache.set(id, promise);
      return promise;
    }

    async function ensureLottie() {
      if (window.lottie) return window.lottie;
      return new Promise((resolve) => {
        let attempts = 0;
        const interval = setInterval(() => {
          attempts += 1;
          if (window.lottie) {
            clearInterval(interval);
            resolve(window.lottie);
          } else if (attempts > 50) {
            clearInterval(interval);
            resolve(null);
          }
        }, 50);
      });
    }

    async function renderCustomEmoji(element) {
      const id = element.getAttribute("emoji-id");
      if (!id || element.dataset.rendered === id) return;
      element.dataset.rendered = id;

      try {
        const payload = await fetchEmojiPayload(id);
        if (!payload) return;

        let wrap = element.querySelector(".tg-emoji-wrap");
        if (!wrap) {
          wrap = document.createElement("span");
          wrap.className = "tg-emoji-wrap";
          element.appendChild(wrap);
        }

        // 1. WebP image (base64 starts with UklGR)
        if (payload.startsWith("UklGR")) {
          const img = document.createElement("img");
          img.src = \`data:image/webp;base64,\${payload}\`;
          img.alt = "emoji";
          wrap.replaceChildren(img);
          return;
        }

        // 2. WebM video (base64 starts with GkXf)
        if (payload.startsWith("GkXf")) {
          const video = document.createElement("video");
          video.src = \`data:video/webm;base64,\${payload}\`;
          video.autoplay = true;
          video.loop = true;
          video.muted = true;
          video.playsInline = true;
          wrap.replaceChildren(video);
          return;
        }

        // 3. TGS vector animation (gzip Lottie JSON)
        if ("DecompressionStream" in window) {
          const lottie = await ensureLottie();
          if (!lottie) return;

          const compressed = Uint8Array.from(atob(payload), (c) => c.codePointAt(0));
          const decompressed = new Blob([compressed])
            .stream()
            .pipeThrough(new DecompressionStream("gzip"));
          const animData = await new Response(decompressed).json();

          wrap.replaceChildren();
          lottie.loadAnimation({
            container: wrap,
            renderer: "svg",
            loop: true,
            autoplay: true,
            animationData: animData,
            rendererSettings: {
              preserveAspectRatio: "xMidYMid meet",
              progressiveLoad: true,
            },
          });
        }
      } catch {
        // Gracefully ignore decode errors and preserve fallback
      }
    }

    function initCustomEmojis(root = document) {
      const emojis = root.querySelectorAll("tg-emoji[emoji-id]");
      emojis.forEach((el) => {
        renderCustomEmoji(el);
      });
    }

    if (typeof customElements !== "undefined" && !customElements.get("tg-emoji")) {
      customElements.define(
        "tg-emoji",
        class extends HTMLElement {
          connectedCallback() {
            renderCustomEmoji(this);
          }
        },
      );
    }

    async function loadData() {
      try {
        const res = await fetch("/api/shop");
        shopData = await res.json();
        renderPlans();
        renderPayment();
        updateCategoryCounts();
      } catch (err) {
        document.getElementById("plansContainer").innerHTML = '<p style="color:#ef4444">Failed to load shop data</p>';
      }
    }

    function getPlanCategory(plan) {
      if (plan.category) {
        const cat = plan.category.toLowerCase();
        if (cat.includes("star")) return "stars";
        if (cat.includes("premium")) return "premium";
        if (cat.includes("gram")) return "gram";
        return "other";
      }
      const title = (plan.title || "").toLowerCase();
      if (title.includes("star")) return "stars";
      if (title.includes("premium")) return "premium";
      if (title.includes("gram")) return "gram";
      return "other";
    }

    function getCategoryEmoji(cat, plan) {
      if (plan?.emoji) return plan.emoji;
      if (cat === "stars") return "⭐️";
      if (cat === "premium") return "🎁";
      if (cat === "gram") return "💎";
      return "🌐";
    }

    function updateCategoryCounts() {
      if (!shopData?.plans) return;
      const plans = shopData.plans;
      const counts = {
        all: plans.length,
        premium: plans.filter(p => getPlanCategory(p) === "premium").length,
        stars: plans.filter(p => getPlanCategory(p) === "stars").length,
        gram: plans.filter(p => getPlanCategory(p) === "gram").length,
        other: plans.filter(p => getPlanCategory(p) === "other").length,
      };

      document.getElementById("countAll").textContent = counts.all + (counts.all === 1 ? " Plan" : " Plans");
      document.getElementById("countPremium").textContent = counts.premium + (counts.premium === 1 ? " Plan" : " Plans");
      document.getElementById("countStars").textContent = counts.stars + (counts.stars === 1 ? " Plan" : " Plans");
      document.getElementById("countGram").textContent = counts.gram + (counts.gram === 1 ? " Plan" : " Plans");
      document.getElementById("countOther").textContent = counts.other + (counts.other === 1 ? " Plan" : " Plans");

      const badgeNames = {
        all: "📋 " + counts.all + " Plans",
        premium: "🎁 " + counts.premium + " Plans",
        stars: "⭐️ " + counts.stars + " Plans",
        gram: "💎 " + counts.gram + " Plans",
        other: "🌐 " + counts.other + " Plans",
      };
      document.getElementById("activeCategoryBadge").textContent = badgeNames[activeFilter] || (counts[activeFilter] + " Plans");
    }

    function setFilter(newFilter) {
      activeFilter = newFilter;

      document.querySelectorAll(".segment-btn").forEach(b => {
        b.classList.toggle("active", b.dataset.filter === newFilter);
      });

      updateCategoryCounts();
      renderPlans();
    }

    document.querySelectorAll(".segment-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        setFilter(btn.dataset.filter);
      });
    });

    document.getElementById("searchInput").addEventListener("input", (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      renderPlans();
    });

    function renderPlans() {
      const container = document.getElementById("plansContainer");
      if (!shopData?.plans) return;

      const q = searchQuery;
      const filtered = shopData.plans
        .map((p, idx) => ({ ...p, originalIndex: idx }))
        .filter(p => {
          const cat = getPlanCategory(p);
          if (activeFilter !== "all" && cat !== activeFilter) return false;
          if (q) {
            const str = (p.title + " " + (p.duration || "") + " " + (p.price || "")).toLowerCase();
            return str.includes(q);
          }
          return true;
        });

      if (filtered.length === 0) {
        container.innerHTML = '<div style="background:var(--card-bg); border:1px solid var(--border); border-radius:12px; padding:32px 16px; text-align:center; color:var(--hint)">No matching plans found in this category.</div>';
        return;
      }

      container.innerHTML = filtered.map((p) => {
        const idx = p.originalIndex;
        const cat = getPlanCategory(p);
        const emojiIcon = getCategoryEmoji(cat, p);
        const emojiId = p.premium_emoji_id || (cat === "stars" ? "6325838686378269641" : (cat === "premium" ? "6192798024230505469" : (cat === "gram" ? "6169992765795999529" : (p.title && p.title.toLowerCase().includes("gemini") ? "6210689895912968015" : ""))));
        const emojiDisplay = emojiId
          ? \`<tg-emoji emoji-id="\${emojiId}"><span class="tg-emoji-wrap">\${emojiIcon}</span></tg-emoji>\`
          : emojiIcon;

        return \`
          <div class="plan-card" data-idx="\${idx}">
            <!-- Header: Avatar + Title Input + Popular Switch + Delete -->
            <div class="plan-card-header">
              <div class="plan-info-main">
                <div class="plan-avatar">\${emojiDisplay}</div>
                <div class="plan-titles">
                  <input type="text" class="plan-title-input plan-title" value="\${p.title || ''}" placeholder="Product Title">
                </div>
              </div>

              <div class="plan-header-controls">
                <label class="toggle-wrap" title="Highlight as Popular">
                  <span>Popular</span>
                  <label class="switch">
                    <input type="checkbox" class="plan-highlight" \${p.highlight ? "checked" : ""}>
                    <span class="slider"></span>
                  </label>
                </label>

                <button type="button" class="btn-card-del delete-plan-btn" data-idx="\${idx}" title="Delete Plan">✕</button>
              </div>
            </div>

            <!-- Fields Grid: Duration + Price (Restored Clean Layout) -->
            <div class="plan-fields-grid">
              <div class="field-group">
                <label>Duration / Tier</label>
                <div class="input-wrapper">
                  <input type="text" class="input-field plan-duration" value="\${p.duration || ''}" placeholder="e.g. 1 Month, 50 Stars">
                </div>
              </div>

              <div class="field-group">
                <label>Price (MMK)</label>
                <div class="input-wrapper">
                  <input type="text" class="input-field plan-price" value="\${p.price || ''}" placeholder="e.g. 22,500 MMK">
                </div>
              </div>

              <div class="field-group field-full">
                <label>Custom Emoji ID or Telegram Post Link (optional)</label>
                <div class="input-wrapper">
                  <input type="text" class="input-field plan-emoji-id" value="\${p.premium_emoji_id || ''}" placeholder="e.g. 6169992765795999529 or https://t.me/.../61">
                </div>
              </div>
            </div>
          </div>
        \`;
      }).join("");

      initCustomEmojis(container);

      // Live update avatar when custom emoji id is edited
      container.querySelectorAll(".plan-emoji-id").forEach((input) => {
        input.addEventListener("input", (e) => {
          const card = e.target.closest(".plan-card");
          if (!card) return;
          const avatar = card.querySelector(".plan-avatar");
          const val = e.target.value.trim();
          if (val && /^[0-9]+$/.test(val)) {
            avatar.innerHTML = \`<tg-emoji emoji-id="\${val}"><span class="tg-emoji-wrap">⭐️</span></tg-emoji>\`;
            initCustomEmojis(avatar);
          }
        });
      });

      // Attach delete handlers
      container.querySelectorAll(".delete-plan-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const idx = Number.parseInt(btn.dataset.idx, 10);
          const targetPlan = shopData.plans[idx];
          const name = (targetPlan?.title || "Plan") + " (" + (targetPlan?.duration || "") + ")";
          if (confirm("Delete " + name + "?")) {
            shopData.plans.splice(idx, 1);
            renderPlans();
            updateCategoryCounts();
          }
        });
      });
    }

    function renderPayment() {
      if (!shopData?.payment_details) return;
      document.getElementById("payPhone").value = shopData.payment_details.phone || "";
      document.getElementById("payName").value = shopData.payment_details.account_name || "";
      document.getElementById("payNote").value = shopData.payment_details.note || "";
      updatePaymentSummary();
    }

    // Add Plan Button
    document.getElementById("addPlanBtn").addEventListener("click", () => {
      if (!shopData) return;
      const defaultCategory = activeFilter === "stars" ? "Telegram Stars" : (activeFilter === "gram" ? "Gram" : (activeFilter === "other" ? "Other Services" : "Telegram Premium"));
      const defaultTitle = activeFilter === "stars" ? "Telegram Stars" : (activeFilter === "gram" ? "Gram" : (activeFilter === "other" ? "OpenVPN Profile" : "Telegram Premium"));
      const defaultDuration = activeFilter === "stars" ? "100 Stars" : (activeFilter === "gram" ? "1 Gram" : (activeFilter === "other" ? "1 Month" : "1 Month"));
      const defaultEmoji = activeFilter === "stars" ? "⭐️" : (activeFilter === "gram" ? "💎" : (activeFilter === "other" ? "🌐" : "🎁"));

      shopData.plans.unshift({
        category: defaultCategory,
        title: defaultTitle,
        duration: defaultDuration,
        price: "10,000 MMK",
        buy_url: "https://t.me/callmehhk",
        emoji: defaultEmoji,
        highlight: false,
      });
      renderPlans();
      updateCategoryCounts();
    });

    // Save Form Handler
    document.getElementById("shopForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const saveBtn = document.getElementById("saveBtn");
      saveBtn.disabled = true;
      saveBtn.innerHTML = '<span class="spinner"></span> Saving...';

      // Synchronize inputs to local state
      const cards = document.querySelectorAll("#plansContainer .plan-card");
      cards.forEach((card) => {
        const idx = Number.parseInt(card.dataset.idx, 10);
        if (shopData.plans[idx]) {
          shopData.plans[idx].title = card.querySelector(".plan-title").value.trim();
          shopData.plans[idx].duration = card.querySelector(".plan-duration").value.trim();
          shopData.plans[idx].price = card.querySelector(".plan-price").value.trim();
          shopData.plans[idx].highlight = card.querySelector(".plan-highlight").checked;
          const emojiId = card.querySelector(".plan-emoji-id").value.trim();
          if (emojiId) {
            shopData.plans[idx].premium_emoji_id = emojiId;
          } else {
            delete shopData.plans[idx].premium_emoji_id;
          }
        }
      });

      shopData.payment_details = {
        ...shopData.payment_details,
        phone: document.getElementById("payPhone").value.trim(),
        account_name: document.getElementById("payName").value.trim(),
        note: document.getElementById("payNote").value.trim(),
      };

      try {
        const headers = {
          "Content-Type": "application/json",
        };
        if (adminToken) {
          headers["Authorization"] = "Bearer " + adminToken;
        }
        if (tg?.initData) {
          headers["X-Telegram-Init-Data"] = tg.initData;
        }

        const res = await fetch("/api/telegram/api/save", {
          method: "POST",
          headers,
          body: JSON.stringify(shopData),
        });

        const result = await res.json();
        if (res.ok && result.success) {
          showToast("Changes saved successfully!");
          updatePaymentSummary();
          updateCategoryCounts();
          if (tg?.HapticFeedback) {
            tg.HapticFeedback.notificationOccurred("success");
          }
        } else {
          alert("Error saving changes: " + (result.error || "Unknown error"));
        }
      } catch (err) {
        alert("Network error while saving");
      } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = "Save Changes";
      }
    });

    initCustomEmojis(document);
    initAuth();
  </script>
</body>
</html>`;
}
