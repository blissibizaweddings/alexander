# Alexander Expedition Tracker

An immersive, map-first storytelling experience that follows Alexander the Great’s campaign from Pella to Babylon. Built with Next.js 14, MapLibre GL JS, and Turf.js, the tracker combines animated routes, narrated waypoints, multimedia annotations, and contextual overlays for history enthusiasts, educators, and museum visitors.

## Features

- **Map-first UI** with vintage-styled basemap powered by MapTiler Vintage tiles.
- **Animated route playback** for Alexander, allied generals, naval fleets, and enemy movements with play/pause, step navigation, and speed control.
- **Waypoint media drawer** showcasing narration audio, transcripts, imagery, and source citations.
- **Context overlays** for ancient regions and major battles (Granicus, Issus, Tyre, Gaugamela) with toggleable visibility.
- **Accessibility support** including keyboard shortcuts, labeled controls, and transcripts.
- **Mock dataset** demonstrating Alexander’s journey, ready to be replaced via CSV/GeoJSON import when integrated with a CMS.

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure the MapTiler style used by MapLibre. Create a `.env.local` file with your style URL (vintage recommended):

   ```bash
   NEXT_PUBLIC_MAP_STYLE_URL="https://api.maptiler.com/maps/vintage/style.json?key=YOUR_MAPTILER_KEY"
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) to explore the experience.

### Keyboard Shortcuts

- `Space` – Play/Pause route playback
- `←` / `→` – Step to previous/next waypoint
- `+` / `-` – Adjust playback speed

## Project Structure

- `app/` – Next.js App Router pages and UI components.
- `src/data/mockCampaign.ts` – Seed dataset for Alexander’s journey, including tracks, waypoints, segments, events, and regions.
- `src/state/playback-store.ts` – Zustand store powering playback controls and visibility toggles.
- `src/utils/` – Geospatial helpers and formatting utilities.
- `public/media/` – Placeholder folder for narration audio uploads.

## Next Steps

- Connect the frontend to Strapi v5 (or another headless CMS) to manage people, tracks, waypoints, media, events, and regions.
- Implement CSV/GeoJSON import endpoints inside the CMS for rapid content updates.
- Add analytics (e.g., Plausible) and error tracking (Sentry) prior to launch.

## License

This project is provided as an architectural and UX reference. Adapt freely for your institution or classroom.
