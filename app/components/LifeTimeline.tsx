'use client';

import { useMemo, useState } from 'react';
import { getLifeTimeline } from '@/data/mockCampaign';
import { usePlaybackStore } from '@/state/playback-store';

export function LifeTimeline() {
  const events = useMemo(() => getLifeTimeline(), []);
  const [expanded, setExpanded] = useState(false);
  const highlightedLifeEventId = usePlaybackStore((state) => state.highlightedLifeEventId);
  const setHighlightedLifeEvent = usePlaybackStore((state) => state.setHighlightedLifeEvent);

  if (events.length === 0) {
    return null;
  }

  return (
    <div className="panel-section" aria-label="Alexander's life timeline">
      <div className="flex items-center justify-between gap-3">
        <h2>Life Timeline</h2>
        <button
          type="button"
          className="button text-xs"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
        >
          {expanded ? 'Collapse' : 'Expand'}
        </button>
      </div>
      <p className="text-xs text-ink/70">
        From birth in Pella to his last days in Babylon, trace each major milestone alongside the campaign map.
      </p>
      <ol
        className={`mt-4 space-y-3 text-sm transition-all ${expanded ? 'max-h-96 overflow-y-auto pr-1' : 'max-h-0 overflow-hidden'}`}
        onMouseLeave={() => setHighlightedLifeEvent(undefined)}
      >
        {events.map((event) => {
          const isHighlighted = event.id === highlightedLifeEventId;
          return (
            <li
              key={event.id}
              className={`rounded-md border ${isHighlighted ? 'border-accent bg-white/80 shadow-md' : 'border-ink/10 bg-white/70'} p-3`}
              onMouseEnter={() => setHighlightedLifeEvent(event.id)}
              onMouseLeave={() => setHighlightedLifeEvent(undefined)}
              onFocus={() => setHighlightedLifeEvent(event.id)}
              onBlur={() => setHighlightedLifeEvent(undefined)}
              tabIndex={0}
            >
            <p className="text-xs uppercase tracking-wide text-ink/60">
              {event.occurredOn ?? 'Date unknown'}
            </p>
            <p className="mt-1 font-semibold text-ink">{event.title}</p>
            {event.location && <p className="text-xs text-ink/60">{event.location}</p>}
            <p className="mt-2 leading-relaxed text-ink/80">{event.description}</p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
