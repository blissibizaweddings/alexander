'use client';

import { useEffect, useRef } from 'react';
import maplibregl, { type Map } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import * as turf from '@turf/turf';
import { dataset } from '@/data/mockCampaign';
import { usePlaybackStore } from '@/state/playback-store';
import {
  buildEventFeatures,
  buildRegionFeatures,
  buildTrackLineFeatures,
  buildWaypointFeatures,
  getTrackById,
  getWaypointById
} from '@/utils/geo';
import { modeIcon } from '@/utils/format';

const FALLBACK_MAP_STYLE = 'https://demotiles.maplibre.org/style.json';
const MAP_STYLE = process.env.NEXT_PUBLIC_MAP_STYLE_URL ?? FALLBACK_MAP_STYLE;

const BASE_SPEED_METERS_PER_SEC = 20; // tuned for smooth playback

const TRANSPORT_SPEED_MULTIPLIERS: Record<string, number> = {
  foot: 0.7,
  horse: 1.0,
  ship: 1.3,
  supply: 0.5
};

type AnimationState = {
  rafId?: number;
  segmentId?: string;
  distanceTraveled: number;
};

export function MapCanvas() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);
  const animationRef = useRef<AnimationState>({ distanceTraveled: 0 });

  const {
    activeTrackId,
    currentWaypointId,
    isPlaying,
    playbackSpeed,
    visibleTracks,
    regionOverlayVisible,
    eventOverlayVisible,
    setWaypoint,
    setPlaying
  } = usePlaybackStore((state) => ({
    activeTrackId: state.activeTrackId,
    currentWaypointId: state.currentWaypointId,
    isPlaying: state.isPlaying,
    playbackSpeed: state.playbackSpeed,
    visibleTracks: state.visibleTracks,
    regionOverlayVisible: state.regionOverlayVisible,
    eventOverlayVisible: state.eventOverlayVisible,
    setWaypoint: state.setWaypoint,
    setPlaying: state.setPlaying
  }));

  // Initialize map once.
  useEffect(() => {
    if (!containerRef.current || mapRef.current) {
      return;
    }
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: MAP_STYLE,
      center: [22.5, 40.8],
      zoom: 4,
      attributionControl: true
    });
    let hasAppliedFallbackStyle = MAP_STYLE === FALLBACK_MAP_STYLE;
    map.on('error', (event) => {
      if (!hasAppliedFallbackStyle && !map.isStyleLoaded()) {
        const status = (event as { error?: { status?: number } })?.error?.status;
        if (typeof status !== 'number' || status >= 400) {
          map.setStyle(FALLBACK_MAP_STYLE);
          hasAppliedFallbackStyle = true;
        }
      }
    });
    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }));
    mapRef.current = map;

    map.on('load', () => {
      dataset.tracks.forEach((track) => {
        map.addSource(`track-lines-${track.id}`, {
          type: 'geojson',
          data: buildTrackLineFeatures(track)
        });

        map.addLayer({
          id: `track-lines-${track.id}`,
          type: 'line',
          source: `track-lines-${track.id}`,
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': track.color,
            'line-width': ["interpolate", ["linear"], ["zoom"], 3, 1, 7, 3.5],
            'line-opacity': track.kind === 'enemy' ? 0.6 : 0.85,
            'line-dasharray': track.kind === 'sea' ? [2, 2] : [1, 0]
          }
        });

        map.addSource(`track-waypoints-${track.id}`, {
          type: 'geojson',
          data: buildWaypointFeatures(track)
        });

        map.addLayer({
          id: `track-waypoints-${track.id}`,
          type: 'circle',
          source: `track-waypoints-${track.id}`,
          paint: {
            'circle-radius': ["interpolate", ["linear"], ["zoom"], 4, 3.5, 7, 7],
            'circle-color': '#fff',
            'circle-stroke-color': track.color,
            'circle-stroke-width': 2
          }
        });
      });

      map.addSource('events', {
        type: 'geojson',
        data: buildEventFeatures()
      });

      map.addLayer({
        id: 'events-fill',
        type: 'fill',
        source: 'events',
        paint: {
          'fill-color': '#b54936',
          'fill-opacity': 0.25
        }
      });

      map.addLayer({
        id: 'events-outline',
        type: 'line',
        source: 'events',
        paint: {
          'line-color': '#7a1f2a',
          'line-width': 2,
          'line-dasharray': [1, 1.5]
        }
      });

      map.addSource('regions', {
        type: 'geojson',
        data: buildRegionFeatures()
      });

      map.addLayer({
        id: 'regions-fill',
        type: 'fill',
        source: 'regions',
        paint: {
          'fill-color': '#d9c3a5',
          'fill-opacity': 0.18
        }
      });

      map.addLayer({
        id: 'regions-outline',
        type: 'line',
        source: 'regions',
        paint: {
          'line-color': '#a6875a',
          'line-width': 1.5,
          'line-opacity': 0.7
        }
      });
    });

    return () => {
      map.remove();
    };
  }, []);

  // Manage track visibility toggles.
  useEffect(() => {
    const map = mapRef.current;
    if (!map?.isStyleLoaded()) return;
    dataset.tracks.forEach((track) => {
      const visibility = visibleTracks[track.id] ? 'visible' : 'none';
      const lineLayerId = `track-lines-${track.id}`;
      const pointLayerId = `track-waypoints-${track.id}`;
      if (map.getLayer(lineLayerId)) {
        map.setLayoutProperty(lineLayerId, 'visibility', visibility);
      }
      if (map.getLayer(pointLayerId)) {
        map.setLayoutProperty(pointLayerId, 'visibility', visibility);
      }
    });
  }, [visibleTracks]);

  // Manage overlay visibility toggles.
  useEffect(() => {
    const map = mapRef.current;
    if (!map?.isStyleLoaded()) return;
    const regionVisibility = regionOverlayVisible ? 'visible' : 'none';
    if (map.getLayer('regions-fill')) {
      map.setLayoutProperty('regions-fill', 'visibility', regionVisibility);
    }
    if (map.getLayer('regions-outline')) {
      map.setLayoutProperty('regions-outline', 'visibility', regionVisibility);
    }
  }, [regionOverlayVisible]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map?.isStyleLoaded()) return;
    const eventVisibility = eventOverlayVisible ? 'visible' : 'none';
    if (map.getLayer('events-fill')) {
      map.setLayoutProperty('events-fill', 'visibility', eventVisibility);
    }
    if (map.getLayer('events-outline')) {
      map.setLayoutProperty('events-outline', 'visibility', eventVisibility);
    }
  }, [eventOverlayVisible]);

  // Update marker location when waypoint changes.
  useEffect(() => {
    const map = mapRef.current;
    const waypoint = getWaypointById(currentWaypointId);
    const track = getTrackById(activeTrackId);
    if (!map || !waypoint) return;
    if (!markerRef.current) {
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.width = '32px';
      el.style.height = '32px';
      el.style.borderRadius = '50%';
      el.style.display = 'grid';
      el.style.placeItems = 'center';
      el.style.background = 'rgba(178, 112, 61, 0.85)';
      el.style.color = '#fff';
      el.style.fontSize = '18px';
      el.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.25)';
      markerRef.current = new maplibregl.Marker(el).setLngLat(waypoint.coordinates).addTo(map);
    } else {
      markerRef.current.setLngLat(waypoint.coordinates);
    }

    if (track) {
      const defaultMode = track.transportDefault === 'mixed' ? 'horse' : track.transportDefault;
      markerRef.current?.getElement().replaceChildren(document.createTextNode(modeIcon(defaultMode)));
    }

    if (map && waypoint.coordinates) {
      map.easeTo({ center: waypoint.coordinates, duration: 1500, zoom: Math.max(map.getZoom(), 5) });
    }
  }, [currentWaypointId, activeTrackId]);

  // Handle playback animation between waypoints.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const marker = markerRef.current;
    if (!marker) return;

    const track = getTrackById(activeTrackId);
    if (!track) return;

    const waypoints = dataset.waypoints
      .filter((wp) => wp.trackId === activeTrackId)
      .sort((a, b) => a.seq - b.seq);
    const currentIndex = waypoints.findIndex((wp) => wp.id === currentWaypointId);
    const current = waypoints[currentIndex];
    const target = waypoints[currentIndex + 1];

    if (!isPlaying) {
      if (animationRef.current.rafId) {
        cancelAnimationFrame(animationRef.current.rafId);
      }
      animationRef.current = { distanceTraveled: 0 };
      return;
    }

    if (!current || !target) {
      setPlaying(false);
      return;
    }

    const segment = dataset.segments.find(
      (seg) => seg.trackId === activeTrackId && seg.fromWaypointId === current.id && seg.toWaypointId === target.id
    );

    if (!segment) {
      setWaypoint(target.id);
      return;
    }

    const totalLengthKm = turf.length(segment.geometry, { units: 'kilometers' });
    const totalLengthMeters = totalLengthKm * 1000;
    const durationSeconds = (segment.estDurationMinutes ?? 180) * 60;
    const baseSpeed = durationSeconds > 0 ? totalLengthMeters / durationSeconds : BASE_SPEED_METERS_PER_SEC;
    const modeMultiplier = TRANSPORT_SPEED_MULTIPLIERS[segment.transportMode] ?? 1;
    const speed = baseSpeed * playbackSpeed * modeMultiplier;

    const animationState: AnimationState = {
      distanceTraveled: animationRef.current.segmentId === segment.id ? animationRef.current.distanceTraveled : 0,
      segmentId: segment.id
    };

    const element = marker.getElement();
    element.textContent = modeIcon(segment.transportMode);

    let lastTime = performance.now();

    const step = (time: number) => {
      const elapsedSeconds = (time - lastTime) / 1000;
      lastTime = time;
      animationState.distanceTraveled += speed * elapsedSeconds;

      if (animationState.distanceTraveled >= totalLengthMeters) {
        marker.setLngLat(target.coordinates);
        animationRef.current = { distanceTraveled: 0 };
        setWaypoint(target.id);
        return;
      }

      const distanceKm = animationState.distanceTraveled / 1000;
      const along = turf.along(segment.geometry, distanceKm, { units: 'kilometers' });
      const coords = along.geometry.coordinates as [number, number];
      marker.setLngLat(coords);

      animationRef.current = { ...animationState, rafId: requestAnimationFrame(step) };
    };

    animationRef.current = animationState;
    animationRef.current.rafId = requestAnimationFrame(step);

    return () => {
      if (animationRef.current.rafId) {
        cancelAnimationFrame(animationRef.current.rafId);
      }
    };
  }, [isPlaying, activeTrackId, currentWaypointId, playbackSpeed, setWaypoint, setPlaying]);

  return <div ref={containerRef} className="map-container w-full h-full" role="presentation" aria-hidden />;
}
