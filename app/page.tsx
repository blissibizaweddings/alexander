import { Suspense } from 'react';
import { MapCanvas } from './components/MapCanvas';
import { ControlPanel } from './components/ControlPanel';
import { WaypointDrawer } from './components/WaypointDrawer';

export default function HomePage() {
  return (
    <main className="main-grid">
      <section className="map-container" aria-label="Campaign map">
        <Suspense fallback={<div className="p-4 text-sm">Loading map…</div>}>
          <MapCanvas />
        </Suspense>
      </section>
      <section className="flex h-full flex-col" aria-label="Information panel">
        <WaypointDrawer />
        <ControlPanel />
      </section>
    </main>
  );
}
