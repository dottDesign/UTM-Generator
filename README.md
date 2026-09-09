# 🧪 UTM Lab

A playful, browser-based UTM campaign URL builder by **dottDesign**.

UTM Lab helps marketers, web teams, and campaign managers build clean, consistent, GA4-friendly tracking URLs without manually editing query strings.

**Live site:** https://dottdesign.github.io/UTM-Generator/

---

## ✨ What it does

UTM Lab turns a normal destination URL into a campaign-ready tracking link using standard UTM parameters:

- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `utm_term`

The interface is designed to make campaign tagging faster, easier to understand, and more consistent.

---

## 🚀 Features

### Campaign URL Builder

Enter a destination URL and add the UTM parameters you need.

UTM Lab automatically builds the final tracking URL while preserving any existing query parameters already on the destination URL.

### Smart normalization

Optional automatic formatting keeps campaign values clean and consistent by:

- converting values to lowercase
- replacing spaces with underscores
- reducing inconsistent campaign naming

Example:

```text
Fall Open House
```

becomes:

```text
fall_open_house
```

### Campaign presets

Quick-start presets help populate common campaign combinations for channels such as:

- Google Ads
- Instagram / paid social
- Email campaigns
- QR codes and print campaigns

You can still edit every field after applying a preset.

### Live campaign formula

The generated URL is broken down into its individual UTM ingredients so you can quickly see what is being added.

### URL health feedback

UTM Lab monitors the final URL length and provides visual feedback when URLs become unusually long.

### Remembered campaign values

Frequently used sources, mediums, and campaigns can be remembered locally in your browser for faster reuse.

No account is required.

### Copy celebration 🎉

When your tracking URL is copied successfully, UTM Lab celebrates with a little confetti.

Because campaign tagging deserves at least *some* excitement.

### Keyboard shortcut

Use:

```text
Command + Enter
```

on macOS or:

```text
Ctrl + Enter
```

on Windows to quickly generate the tracking URL.

### Responsive interface

UTM Lab is designed to work across desktop, tablet, and mobile layouts.

### Reduced-motion support

Animations respect the browser's `prefers-reduced-motion` accessibility setting.

---

## 📊 GA4 Mapping

UTM parameters map directly to commonly used Google Analytics 4 dimensions.

| UTM Parameter | GA4 Dimension | Purpose |
| --- | --- | --- |
| `utm_source` | Session source | Where the traffic originated |
| `utm_medium` | Session medium | How the visitor arrived |
| `utm_campaign` | Session campaign | The campaign or initiative |
| `utm_content` | Session manual ad content | Differentiates links, creative, or placements |
| `utm_term` | Session manual term | Commonly used for paid-search keywords |

---

## 🧪 Example

### Base URL

```text
https://example.com/programs/web-design/
```

### Campaign values

```text
Source: instagram
Medium: paid_social
Campaign: fall_2026_launch
Content: story_cta
```

### Generated URL

```text
https://example.com/programs/web-design/?utm_source=instagram&utm_medium=paid_social&utm_campaign=fall_2026_launch&utm_content=story_cta
```

---

## 🏷 Suggested Naming Convention

Consistency is more important than any single naming format.

A simple campaign convention might look like:

```text
initiative_audience_term_year
```

Example:

```text
open_house_prospects_fall_2026
```

Recommended practices:

- use lowercase values
- avoid spaces
- use underscores consistently
- keep source and medium values standardized
- avoid changing naming conventions halfway through a campaign
- document commonly used values across your team

---

## 🔗 Common UTM Examples

### Paid Search

```text
utm_source=google
utm_medium=cpc
utm_campaign=fall_2026
```

### Paid Social

```text
utm_source=instagram
utm_medium=paid_social
utm_campaign=fall_2026
```

### Email

```text
utm_source=newsletter
utm_medium=email
utm_campaign=monthly_update
```

### QR / Print

```text
utm_source=qr
utm_medium=offline
utm_campaign=campus_poster
```

---

## ⚠️ UTM Best Practices

### Do

- use UTMs for external campaign traffic
- keep naming conventions consistent
- use `utm_content` to distinguish multiple CTAs or creatives
- test the final URL before publishing
- use clear campaign names that will still make sense months later

### Avoid

- using UTMs on internal website navigation
- mixing capitalization styles
- using multiple names for the same source
- changing campaign naming conventions during an active campaign
- manually editing generated URLs unless necessary

Using UTMs on internal links can overwrite attribution data in analytics platforms, so they should generally be reserved for inbound campaign traffic.

---

## 🔒 Privacy

UTM Lab runs primarily in the browser.

Campaign-building data is not uploaded simply to generate a tracking URL.

Some preferences may be stored locally using `localStorage`, such as frequently used campaign values.

---

## 🎨 Design

UTM Lab is part of a growing collection of small web utilities by **dottDesign**.

The interface uses:

- playful campaign-lab styling
- responsive CSS
- GSAP animations
- confetti feedback
- client-side JavaScript
- accessible reduced-motion behavior

The goal is to make useful marketing tools feel a little less boring.

---

## 🛠 Built With

- HTML5
- CSS3
- Vanilla JavaScript
- [GSAP](https://gsap.com/)
- [canvas-confetti](https://github.com/catdad/canvas-confetti)
- GitHub Pages

No frontend framework is required.

---

## 📂 Project Structure

A simple deployment can look like:

```text
UTM-Generator/
├── index.html
├── README.md
└── docs/
```

Depending on the version of the project, documentation images or supporting assets may also be stored in the `docs` directory.

---

## 💻 Running Locally

Clone the repository:

```bash
git clone https://github.com/dottDesign/UTM-Generator.git
```

Move into the project folder:

```bash
cd UTM-Generator
```

Then open `index.html` in your browser.

You can also serve it locally with a lightweight development server.

For example, using Python:

```bash
python3 -m http.server 8000
```

Then visit:

```text
http://localhost:8000
```

---

## 🌐 Deployment

This project is hosted using **GitHub Pages**.

Repository:

https://github.com/dottDesign/UTM-Generator

Live site:

https://dottdesign.github.io/UTM-Generator/

---

## ♿ Accessibility

UTM Lab includes accessibility-minded features such as:

- semantic labels
- keyboard-friendly controls
- visible focus states
- responsive layouts
- reduced-motion support
- clear status messaging

Accessibility improvements are always welcome.

---

## 🗺 Roadmap

Potential future additions include:

- saved campaign templates
- campaign history
- CSV export
- bulk UTM generation
- QR-code handoff
- custom organization presets
- configurable naming conventions
- URL shortening integrations
- campaign validation rules
- shareable campaign templates
- import/export of preset libraries

---

## 🔗 Related dottDesign Tools

UTM Lab is part of a broader collection of small browser-based utilities.

Also check out:

- QR Pop
- Image Crop & Resize
- Accessibility Checker
- Reverse UTM
- Site Scraper

More tools:

https://apps.devworks.space/

---

## 👨‍💻 Author

Built by **Derrick Ottenbreit / dottDesign**

GitHub:

https://github.com/dottDesign

Portfolio:

https://dottdesign.github.io/portfolio/

---

## 📄 License

Add the license that best fits how you want others to use the project.

For an open-source utility, the **MIT License** is a common choice.

---

## ⭐ Support

If you find UTM Lab useful, consider starring the repository.

Small tools. Big usefulness.

**dottDesign**
