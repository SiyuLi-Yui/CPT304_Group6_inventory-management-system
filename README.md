# UNIQLO Inventory Management System

[![codecov](https://codecov.io/gh/LixinyuLu/CPT304_Group6_UNIQLO_InventorySystem/branch/main/graph/badge.svg)](https://codecov.io/gh/LixinyuLu/CPT304_Group6_UNIQLO_InventorySystem)
[![Tests](https://img.shields.io/badge/tests-124%20passing-brightgreen)](https://github.com/LixinyuLu/CPT304_Group6_UNIQLO_InventorySystem)
[![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen)](https://github.com/LixinyuLu/CPT304_Group6_UNIQLO_InventorySystem)

A browser-based inventory management system for UNIQLO products. Built with jQuery, DataTables, and Bootstrap — no build step required.

## Features

- Add, edit, and delete inventory items
- Import / export data via `.db` files
- Persistent storage via `localStorage` (with cookie consent)
- English / Chinese (中文) i18n support
- Privacy-compliant: Cookie consent banner + Privacy Policy page

## Getting Started

Open `index.html` directly in your browser (no server needed).

## Development

```bash
# Install dev dependencies
npm install

# Run tests
npm test

# Run tests with coverage report
npm run test:coverage
```

Coverage reports are generated in the `coverage/` folder.

## Project Structure

```
index.html          Main application
privacy.html        Privacy Policy page
src/
  i18n.js           Internationalisation module (i18next)
  utils.js          Pure utility functions
i18/
  en.json           English translations (reference)
  zh.json           Chinese translations (reference)
tests/              Vitest test files
assets/             CSS, JS, font, and image assets
.github/workflows/  GitHub Actions CI (test + Codecov upload)
```

## Coverage

Unit tests cover `src/utils.js` and `src/i18n.js`.
Coverage is uploaded to [Codecov](https://codecov.io) on every push to `main`.

## Privacy

This application stores data locally in the browser using `localStorage`.
No data is sent to any server. See [privacy.html](privacy.html) for the full policy.
