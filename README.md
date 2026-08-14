# imo

A modern Next.js replica of imo web with interactive landing page, direct APK distribution, and full administrator control panel.

## Features

- **Pixel-Perfect UI**: High-fidelity phone and desktop responsive layout.
- **Admin Panel** (`/demon/admin`):
  - Configure direct APK download links or upload `.apk` packages directly.
  - Server-side cookie session authentication with password management.
  - Real-time download link management and testing.
- **Fast Next.js 16 App Router**: SSR-rendered for instant mobile loading.

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
Admin control panel: [http://localhost:3000/demon/admin](http://localhost:3000/demon/admin) (Default password: `admin123`).
