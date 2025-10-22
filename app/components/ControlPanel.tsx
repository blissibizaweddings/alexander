'use client';

import { useMemo, type ChangeEvent } from 'react';
import clsx from 'clsx';
import { dataset, orderedWaypoints } from '@/data/mockCampaign';
import { LifeTimeline } from './LifeTimeline';
import { usePlaybackStore } from '@/state/playback-store';
import { getTrackById, nextWaypoint, previousWaypoint } from '@/utils/geo';
import { modeIcon } from '@/utils/format';

export function ControlPanel() {
  const {
    activeTrackId,
    visibleTracks,
    setActiveTrack,
    toggleTrack,
    currentWaypointId,
    setWaypoint,
    isPlaying,
    setPlaying,
    playbackSpeed,
    setPlaybackSpeed,
    regionOverlayVisible,
    setRegionOverlayVisible,
    eventOverlayVisible,
    setEventOverlayVisible,
    timeFilter,
    updateTimeFilter
  } = usePlaybackStore((state) => ({
    activeTrackId: state.activeTrackId,
    visibleTracks: state.visibleTracks,
    setActiveTrack: state.setActiveTrack,
    toggleTrack: state.toggleTrack,
    currentWaypointId: state.currentWaypointId,
    setWaypoint: state.setWaypoint,
    isPlaying: state.isPlaying,
    setPlaying: state.setPlaying,
    playbackSpeed: state.playbackSpeed,
    setPlaybackSpeed: state.setPlaybackSpeed,
    regionOverlayVisible: state.regionOverlayVisible,
    setRegionOverlayVisible: state.setRegionOverlayVisible,
    eventOverlayVisible: state.eventOverlayVisible,
    setEventOverlayVisible: state.setEventOverlayVisible,
    timeFilter: state.timeFilter,
    updateTimeFilter: state.updateTimeFilter
  }));

  const track = useMemo(() => getTrackById(activeTrackId), [activeTrackId]);
  const waypoints = useMemo(() => orderedWaypoints(activeTrackId), [activeTrackId]);
  const currentIndex = waypoints.findIndex((wp) => wp.id === currentWaypointId);
  const normalizedIndex = currentIndex < 0 ? 0 : currentIndex;
  const progress = waypoints.length > 1 ? (normalizedIndex / (waypoints.length - 1)) * 100 : 0;
  const currentPosition = waypoints.length === 0 ? 0 : normalizedIndex + 1;

  const handleNext = () => {
    if (!track) return;
    const fallbackWaypoint = waypoints[0];
    const currentSeq = waypoints[currentIndex]?.seq ?? fallbackWaypoint?.seq;
    const next = currentSeq ? nextWaypoint(track.id, currentSeq) : waypoints[1];
    if (next) {
      setWaypoint(next.id);
    } else {
      setPlaying(false);
    }
  };

  const handlePrevious = () => {
    if (!track) return;
    const fallbackWaypoint = waypoints[0];
    const currentSeq = waypoints[currentIndex]?.seq ?? fallbackWaypoint?.seq;
    const previous = currentSeq ? previousWaypoint(track.id, currentSeq) : undefined;
    if (previous) {
      setWaypoint(previous.id);
    }
  };

  const handleTrackSelection = (event: ChangeEvent<HTMLSelectElement>) => {
    setActiveTrack(event.target.value);
  };

  const handleTimelineChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    if (waypoints.length === 0) return;
    if (waypoints.length === 1) {
      setWaypoint(waypoints[0].id);
      return;
    }
    const index = Math.round((value / 100) * (waypoints.length - 1));
    const clampedIndex = Math.min(Math.max(index, 0), waypoints.length - 1);
    const waypoint = waypoints[clampedIndex];
    if (waypoint) {
      setWaypoint(waypoint.id);
    }
  };

  return (
    <aside className="control-panel mt-4" aria-label="Campaign controls">
      <div className="panel-section">
        <label className="block text-xs font-semibold uppercase tracking-wide text-ink/60" htmlFor="track-select">
          Active track
        </label>
        <select
          id="track-select"
          className="mt-2 w-full rounded-lg border border-ink/10 bg-white/60 p-2 text-sm"
          value={activeTrackId}
          onChange={handleTrackSelection}
        >
          {dataset.tracks.map((trackOption) => (
            <option key={trackOption.id} value={trackOption.id}>
              {trackOption.title}
            </option>
          ))}
        </select>
        {track && (
          <p className="mt-2 text-xs text-ink/70">
            Navigate the journey of {track.title}. Toggle visibility of allied, enemy, and naval routes below.
          </p>
        )}
      </div>

      <div className="panel-section" aria-label="Playback controls">
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            className="button"
            onClick={handlePrevious}
            aria-label="Previous waypoint"
          >
            ◀ Prev
          </button>
          <button
            type="button"
            className="button flex-1"
            onClick={() => setPlaying(!isPlaying)}
            aria-label={isPlaying ? 'Pause route playback' : 'Play route playback'}
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button type="button" className="button" onClick={handleNext} aria-label="Next waypoint">
            Next ▶
          </button>
        </div>
        <div className="mt-4">
          <label className="text-xs font-semibold uppercase tracking-wide text-ink/60" htmlFor="speed-control">
            Speed {playbackSpeed.toFixed(1)}×
          </label>
          <input
            id="speed-control"
            type="range"
            min={0.5}
            max={4}
            step={0.25}
            value={playbackSpeed}
            onChange={(event) => setPlaybackSpeed(Number(event.target.value))}
            className="mt-2 w-full"
          />
        </div>
        <div className="mt-4" aria-label="Timeline scrubber">
          <div className="flex items-center justify-between text-xs text-ink/60">
            <span>Start</span>
            <span>
              {currentPosition} / {waypoints.length}
            </span>
          </div>
          <div className="timeline-track mt-2">
            <div className="timeline-thumb" style={{ left: `${progress}%` }} />
          </div>
          <input
            type="range"
            aria-label="Scrub timeline"
            className="mt-2 w-full"
            min={0}
            max={100}
            value={progress}
            onChange={handleTimelineChange}
          />
        </div>
        <p className="mt-3 text-xs text-ink/60">
          Keyboard: Space to play/pause · ←/→ to step · +/- to adjust speed
        </p>
      </div>

      <div className="panel-section" aria-label="Track visibility toggles">
        <h2>Tracks &amp; routes</h2>
        <div className="space-y-2">
          {dataset.tracks.map((trackOption) => (
            <label key={trackOption.id} className="flex items-center justify-between gap-2 text-sm">
              <span className="flex items-center gap-2">
                <span
                  className="legend-swatch"
                  style={{ backgroundColor: trackOption.color }}
                  aria-hidden
                />
                {trackOption.title}
              </span>
              <input
                type="checkbox"
                checked={visibleTracks[trackOption.id] ?? false}
                onChange={() => toggleTrack(trackOption.id)}
                aria-label={`Toggle ${trackOption.title}`}
              />
            </label>
          ))}
        </div>
      </div>

      <div className="panel-section" aria-label="Overlays and filters">
        <h2>Context layers</h2>
        <div className="space-y-2 text-sm">
          <label className="flex items-center justify-between">
            <span>Ancient regions</span>
            <input
              type="checkbox"
              checked={regionOverlayVisible}
              onChange={(event) => setRegionOverlayVisible(event.target.checked)}
            />
          </label>
          <label className="flex items-center justify-between">
            <span>Battle overlays</span>
            <input
              type="checkbox"
              checked={eventOverlayVisible}
              onChange={(event) => setEventOverlayVisible(event.target.checked)}
            />
          </label>
        </div>

        <div className="mt-4 space-y-2 text-sm">
          <label className="flex items-center justify-between">
            <span>Enable time filter</span>
            <input
              type="checkbox"
              checked={timeFilter.enabled}
              onChange={(event) => updateTimeFilter({ enabled: event.target.checked })}
            />
          </label>
          <div className={clsx('grid grid-cols-2 gap-2', !timeFilter.enabled && 'opacity-50')}>
            <input
              type="date"
              className="rounded-lg border border-ink/10 bg-white/60 p-2"
              value={timeFilter.start ?? ''}
              onChange={(event) => updateTimeFilter({ start: event.target.value })}
              aria-label="Filter start date"
              disabled={!timeFilter.enabled}
            />
            <input
              type="date"
              className="rounded-lg border border-ink/10 bg-white/60 p-2"
              value={timeFilter.end ?? ''}
              onChange={(event) => updateTimeFilter({ end: event.target.value })}
              aria-label="Filter end date"
              disabled={!timeFilter.enabled}
            />
          </div>
          <p className="text-xs text-ink/60">
            The time filter will dim events and tracks outside the selected range in a future release.
          </p>
        </div>
      </div>

      <LifeTimeline />

      <div className="panel-section" aria-label="Legend">
        <h2>Legend</h2>
        <ul className="space-y-2 text-sm text-ink/80">
          <li className="flex items-center gap-2">
            <span className="legend-swatch" style={{ backgroundColor: '#7c3f00' }} aria-hidden />
            Macedonian advance
          </li>
          <li className="flex items-center gap-2">
            <span className="legend-swatch" style={{ backgroundColor: '#2f4858' }} aria-hidden />
            Naval &amp; supply routes
          </li>
          <li className="flex items-center gap-2">
            <span className="legend-swatch" style={{ backgroundColor: '#7a1f2a' }} aria-hidden />
            Persian movements
          </li>
          <li className="flex items-center gap-2">
            <span aria-hidden>{modeIcon('foot')}</span> Land march icon
          </li>
          <li className="flex items-center gap-2">
            <span aria-hidden>{modeIcon('ship')}</span> Fleet marker
          </li>
        </ul>
      </div>

      <div className="panel-section" aria-label="Accessibility note">
        <h2>Accessibility</h2>
        <ul className="list-disc space-y-1 pl-4 text-xs text-ink/70">
          <li>Screen reader labels provided for controls and timeline.</li>
          <li>Audio transcripts available for each waypoint.</li>
          <li>High-contrast palette aligned with WCAG AA.</li>
        </ul>
      </div>
    </aside>
  );
}
