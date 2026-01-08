# Adler University — UTM Builder (Internal Tool)

A lightweight, single-file UTM URL builder designed for Adler University Marketing & Communications teams. This tool standardizes UTM parameter creation, encourages consistent naming, and provides helpful UI enhancements such as tooltips and character counters.

Built as a standalone HTML file (no build step, no dependencies). Intended for internal use only.

---

## Features

### UTM URL Generation
- Generates URLs with:
  - `utm_source` *(required)*
  - `utm_medium` *(required)*
  - `utm_campaign` *(required)*
  - `utm_term` *(optional)*
  - `utm_content` *(optional)*
- Supports URLs that already contain query parameters.

### Normalization Toggle
- Optional "Normalize values" switch:
  - Converts values to lowercase
  - Converts spaces to underscores  
  Example: `Paid Search` → `paid_search`

### Dropdown Suggestions (Persistent)
- `utm_source`, `utm_medium`, and `utm_campaign` include datalist suggestions.
- New entries are automatically stored in `localStorage` and shown in the dropdown next time.

### Tooltips (Field Help)
Tooltips are available for:
- Base URL
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_term`
- `utm_content`

Tooltips appear on hover or keyboard focus and are designed for accessibility.

### Character Counters & Warnings
#### `utm_content` length counter
- Displays a live character count.
- Warning appears when `utm_content` is **100+ characters** (soft warning, does not block generation).

#### Full URL length counter
- Displays total generated URL length.
- Warnings:
  - **1800+ characters:** caution (getting long)
  - **2000+ characters:** warning (may break in some platforms)

This helps reduce link issues in email clients, QR codes, and ad platforms.

### Copy + Preview
- One-click "Copy URL" button
- "Open URL in new tab" preview link appears after generation
- "Copied!" status indicator confirms clipboard copy

---

## Demo / Preview

Since this is a single HTML file, you can preview it immediately:

1. Download or clone this repository
2. Open `index.html` in your browser

No server required.

---

## Installation

### Option A — Basic Use (Recommended for internal teams)
1. Download `index.html`
2. Open it in any modern browser

### Option B — Host Internally (Intranet / SharePoint / Web Server)
You may host the tool on an internal Adler web server or intranet page.  
This is recommended if multiple teams need access and you want consistency.

---

## File Structure

This repository is intentionally minimal:

