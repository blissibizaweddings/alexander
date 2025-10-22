import { Suspense } from 'react';
import { MapCanvas } from './components/MapCanvas';
import { ControlPanel } from './components/ControlPanel';
import { WaypointDrawer } from './components/WaypointDrawer';

export default function HomePage() {
  return (
    <main className="main-grid">
      <section className="map-panel" aria-label="Campaign map">
        <Suspense
          fallback={
            <div className="map-viewport flex items-center justify-center p-4 text-sm">
              Loading map…
            </div>
          }
        >
          <MapCanvas />
        </Suspense>
      </section>
      <section className="info-panel flex h-full flex-col overflow-y-auto" aria-label="Information panel">
        <WaypointDrawer />
        <ControlPanel />
      </section>
    </main>
  );
}
