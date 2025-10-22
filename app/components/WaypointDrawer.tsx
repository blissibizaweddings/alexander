'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { usePlaybackStore } from '@/state/playback-store';
import { getTrackById, getWaypointById } from '@/utils/geo';
import { formatDate } from '@/utils/format';

export function WaypointDrawer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [showTranscript, setShowTranscript] = useState(false);

  const { currentWaypointId } = usePlaybackStore((state) => ({
    currentWaypointId: state.currentWaypointId
  }));

  const waypoint = useMemo(() => getWaypointById(currentWaypointId), [currentWaypointId]);
  const track = useMemo(() => (waypoint ? getTrackById(waypoint.trackId) : undefined), [waypoint]);

  const audioMedia = waypoint?.media.find((media) => media.kind === 'audio');
  const imageMedia = waypoint?.media.filter((media) => media.kind === 'image') ?? [];

  useEffect(() => {
    if (audioRef.current && waypoint?.autoplayAudio !== false) {
      const play = async () => {
        try {
          await audioRef.current?.play();
        } catch (error) {
          // Autoplay might be blocked; ignore and rely on manual play.
        }
      };
      audioRef.current.currentTime = 0;
      play();
    }
    setShowTranscript(false);
  }, [currentWaypointId, waypoint?.autoplayAudio]);

  if (!waypoint) {
    return (
      <div className="panel-section" aria-live="polite">
        <p className="text-sm text-ink/80">
          Select a waypoint to see narration, imagery, and historical context.
        </p>
      </div>
    );
  }

  return (
    <section className="panel-section flex-shrink-0" aria-labelledby="waypoint-heading">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-ink/60">{track?.title ?? 'Track'}</p>
          <h1 id="waypoint-heading" className="font-serif text-2xl text-ink">
            {waypoint.name}
          </h1>
          <p className="text-sm text-ink/70">{formatDate(waypoint.occurredOn)}</p>
        </div>
        <span
          className="legend-swatch"
          style={{ backgroundColor: track?.color ?? '#b2703d', display: 'inline-block' }}
          aria-hidden
        />
      </div>

      {audioMedia && (
        <div className="audio-player mt-4" role="region" aria-label="Waypoint narration">
          <p className="text-sm font-semibold text-ink/80">{audioMedia.title ?? 'Narration'}</p>
          <audio
            ref={audioRef}
            controls
            preload="metadata"
            className="mt-2 w-full"
            aria-describedby="waypoint-heading"
          >
            <source src={audioMedia.url} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
          <p className="mt-1 text-xs text-ink/60">Credit: {audioMedia.credit ?? 'Unknown narrator'}</p>
        </div>
      )}

      <p className="mt-4 text-sm leading-relaxed text-ink/80">{waypoint.summary}</p>

      {waypoint.sources && waypoint.sources.length > 0 && (
        <div className="mt-3 rounded-lg bg-white/60 p-3 text-xs text-ink/80">
          <p className="font-semibold uppercase tracking-wide text-ink/60">Sources</p>
          <ul className="mt-1 list-disc space-y-1 pl-4">
            {waypoint.sources.map((source) => (
              <li key={source}>{source}</li>
            ))}
          </ul>
        </div>
      )}

      {waypoint.transcript && (
        <button
          type="button"
          className="button mt-4 w-full justify-center"
          onClick={() => setShowTranscript((value) => !value)}
          aria-expanded={showTranscript}
        >
          {showTranscript ? 'Hide transcript' : 'Show transcript'}
        </button>
      )}

      {showTranscript && waypoint.transcript && (
        <div className="mt-3 max-h-48 overflow-y-auto rounded-lg bg-white/75 p-3 text-sm leading-relaxed text-ink/80">
          {waypoint.transcript}
        </div>
      )}

      {imageMedia.length > 0 && (
        <div className="mt-5 space-y-3" aria-label="Waypoint imagery">
          {imageMedia.map((media) => (
            <figure key={media.id} className="rounded-lg bg-white/60 p-2">
              <Image
                src={media.url}
                alt={media.caption ?? media.title ?? waypoint.name}
                width={480}
                height={320}
                className="h-auto w-full rounded-md object-cover"
              />
              <figcaption className="mt-2 text-xs text-ink/70">
                <span className="block font-semibold">{media.title}</span>
                {media.credit && <span className="block">{media.credit}</span>}
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </section>
  );
}
