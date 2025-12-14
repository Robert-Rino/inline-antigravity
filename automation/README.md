# Inline.app Automation Suite 🤖

A comprehensive automation toolkit for the Inline.app reservation system, featuring both browser-based and hybrid API solutions.

## 🛠️ Tools Overview

### 1. Browser Bot (Node.js) [`bot.js`]
A full browser automation script that mimics human behavior (mouse jitter, typing delays) to book reservations via the UI.
- **Best for**: Debugging, visual verification, simple setups.
- **Command**: `npm run bot`

### 2. Hybrid API Bot (Python) [`api_bot.py`]
A high-performance bot that combines browser security with API speed. It launches a browser momentarily to fetch valid anti-bot tokens (`cf_clearance`, `_pxhd`) and then executes the booking request directly via the browser's network engine.
- **Best for**: Speed, reliability, bypassing 403 Forbidden errors.
- **Command**: `python3 automation/api_bot.py`

### 3. Traffic Utilities (Python)
- **Recorder [`record_har.py`]**: Launches a browser to record network traffic to a `.har` file. Useful for capturing valid payloads.
    - `python3 automation/record_har.py`
- **Analyzer [`analyze_har.py`]**: Parses a `.har` file to extract API endpoints, headers, and error messages.
    - `python3 automation/analyze_har.py`

---

## ⚙️ Configuration

### JavaScript Config (`automation/config.js`)
Used by the **Browser Bot**.
```javascript
export const config = {
    targetUrl: "...",
    partySize: 2,
    preferredDate: "17",
    preferredTime: "17:00",
    user: { ... }
};
```

### Python Config (`automation/api_bot.py`)
Used by the **Hybrid API Bot**. Edit the `CONFIG` dictionary at the top of the file:
```python
CONFIG = {
    "booking_page_url": "https://inline.app/booking/...",
    "target_url": "https://inline.app/api/reservations/booking",
    "date": "2025-12-17",
    "time": "17:00",
    # ...
}
```

---

## 🚀 Usage Guide

### Method A: Browser Bot (UI)
1. Install dependencies: `npm install`
2. Configure `automation/config.js`
3. Run:
   ```bash
   npm run bot
   ```

### Method B: Hybrid API Bot (Recommended)
1. Install Playwright for Python:
   ```bash
   pip install playwright
   playwright install chromium
   ```
2. Configure `CONFIG` in `automation/api_bot.py`
3. Run:
   ```bash
   python3 automation/api_bot.py
   ```
   *Note: This will launch a browser window briefly to pass security checks.*

### Method C: Analysis & Debugging
If you need to investigate API errors or payload structures:
1. **Record Traffic**:
   ```bash
   # Records 2 minutes of traffic to automation/traffic.har
   python3 automation/record_har.py --time 120
   ```
2. **Analyze Traffic**:
   ```bash
   python3 automation/analyze_har.py
   ```
   *Look for status 400 (Bad Request) or 403 (Forbidden) to diagnose issues.*
