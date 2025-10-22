'use client';

import { useEffect, useRef } from 'react';
import maplibregl, { type Map } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import * as turf from '@turf/turf';
import type { FeatureCollection, LineString } from 'geojson';
import { dataset, orderedWaypoints, segmentsForTrack } from '@/data/mockCampaign';
import { usePlaybackStore } from '@/state/playback-store';
import {
  buildEventFeatures,
  buildRegionFeatures,
  buildTrackLineFeatures,
  buildWaypointFeatures,
  buildTerritoryFeatures,
  buildAncientLabelFeatures,
  getTrackById,
  getWaypointById
} from '@/utils/geo';
import { modeIcon } from '@/utils/format';

const FALLBACK_MAP_STYLE = '/styles/ancient.json';
const MAP_STYLE = process.env.NEXT_PUBLIC_MAP_STYLE_URL ?? FALLBACK_MAP_STYLE;

const BASE_SPEED_METERS_PER_SEC = 20; // tuned for smooth playback

const TRANSPORT_SPEED_MULTIPLIERS: Record<string, number> = {
  foot: 0.7,
  horse: 1.0,
  ship: 1.3,
  supply: 0.5
};

const buildProgressGeoJSON = (
  trackId: string,
  waypointId: string,
  partialLine?: LineString
): FeatureCollection<LineString> => {
  const waypoints = orderedWaypoints(trackId);
  const currentIndex = waypoints.findIndex((wp) => wp.id === waypointId);
  const features: FeatureCollection<LineString>['features'] = [];
  if (currentIndex > 0) {
    const segments = segmentsForTrack(trackId);
    for (let index = 0; index < currentIndex; index += 1) {
      const from = waypoints[index];
      const to = waypoints[index + 1];
      if (!from || !to) continue;
      const segment = segments.find(
        (candidate) =>
          candidate.fromWaypointId === from.id && candidate.toWaypointId === to.id
      );
      if (segment) {
        features.push({
          type: 'Feature',
          id: `progress-${segment.id}`,
          properties: {
            trackId,
            state: 'completed'
          },
          geometry: segment.geometry
        });
      }
    }
  }
  if (partialLine && partialLine.coordinates.length > 1) {
    features.push({
      type: 'Feature',
      id: 'progress-active',
      properties: {
        trackId,
        state: 'active'
      },
      geometry: partialLine
    });
  }
  return {
    type: 'FeatureCollection',
    features
  };
};

const setActiveTrackProgress = (
  map: maplibregl.Map,
  trackId: string,
  waypointId: string,
  partialLine?: LineString
) => {
  const source = map.getSource('active-track-progress') as maplibregl.GeoJSONSource | undefined;
  if (!source) return;
  source.setData(buildProgressGeoJSON(trackId, waypointId, partialLine));
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

  const initialActiveTrackRef = useRef(activeTrackId);
  const initialWaypointRef = useRef(currentWaypointId);

  // Initialize map once.
  useEffect(() => {
    if (!containerRef.current || mapRef.current) {
      return;
    }
    let isMounted = true;

    const initializeMap = async () => {
      const initialTrackId = initialActiveTrackRef.current;
      const initialWaypointId = initialWaypointRef.current;
      const resolvedTrackId = initialTrackId ?? dataset.tracks[0]?.id ?? 'track';
      const resolvedWaypointId = initialWaypointId ?? (dataset.waypoints.find((wp) => wp.trackId === resolvedTrackId)?.id ?? dataset.waypoints[0]?.id ?? 'wp');
      let styleToUse = MAP_STYLE;
      const isRemoteStyle = /^https?:/i.test(MAP_STYLE);
      if (isRemoteStyle && MAP_STYLE !== FALLBACK_MAP_STYLE) {
        try {
          const response = await fetch(MAP_STYLE);
          if (!response.ok) {
            console.warn(`Map style responded with ${response.status}; using fallback tiles instead.`);
            styleToUse = FALLBACK_MAP_STYLE;
          }
        } catch (error) {
          console.warn('Failed to fetch primary map style; using fallback tiles instead.', error);
          styleToUse = FALLBACK_MAP_STYLE;
        }
      }

      if (!isMounted || !containerRef.current) {
        return;
      }

      const map = new maplibregl.Map({
        container: containerRef.current,
        style: styleToUse,
        center: [22.5, 40.8],
        zoom: 4,
        attributionControl: true
      });
      let hasAppliedFallbackStyle = styleToUse === FALLBACK_MAP_STYLE;
      map.on('error', (event) => {
        if (!hasAppliedFallbackStyle && !map.isStyleLoaded()) {
          const status = (event as { error?: { status?: number } })?.error?.status;
          if (typeof status !== 'number' || status >= 400) {
            console.warn('Runtime style error encountered; switching to fallback tiles.', event);
            map.setStyle(FALLBACK_MAP_STYLE);
            hasAppliedFallbackStyle = true;
          }
        }
      });
      map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }));
      mapRef.current = map;

      map.on('load', () => {
        map.addSource('territories', {
          type: 'geojson',
          data: buildTerritoryFeatures(resolvedWaypointId)
        });

        map.addLayer({
          id: 'territories-fill',
          type: 'fill',
          source: 'territories',
          paint: {
            'fill-color': [
              'match',
              ['get', 'controller'],
              'macedon',
              '#b47d2b',
              'allies',
              '#2f4858',
              'persia',
              '#7a1f2a',
              '#a57c4f'
            ],
            'fill-opacity': 0.32
          }
        });

        map.addLayer({
          id: 'territories-outline',
          type: 'line',
          source: 'territories',
          paint: {
            'line-color': [
              'match',
              ['get', 'controller'],
              'macedon',
              '#b47d2b',
              'allies',
              '#2f4858',
              'persia',
              '#7a1f2a',
              '#8c6b3a'
            ],
            'line-width': 1.4,
            'line-opacity': 0.8
          }
        });

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

        map.addSource('active-track-progress', {
          type: 'geojson',
          lineMetrics: true,
          data: buildProgressGeoJSON(resolvedTrackId, resolvedWaypointId)
        });

        map.addLayer({
          id: 'active-track-progress',
          type: 'line',
          source: 'active-track-progress',
          paint: {
            'line-color': [
              'case',
              ['==', ['get', 'state'], 'active'],
              '#f59e0b',
              '#d97706'
            ],
            'line-width': [
              'interpolate',
              ['linear'],
              ['zoom'],
              3,
              3,
              6,
              6.5
            ],
            'line-opacity': [
              'case',
              ['==', ['get', 'state'], 'active'],
              0.9,
              0.6
            ]
          }
        });

        map.addSource('ancient-labels', {
          type: 'geojson',
          data: buildAncientLabelFeatures()
        });

        map.addLayer({
          id: 'ancient-labels',
          type: 'symbol',
          source: 'ancient-labels',
          layout: {
            'text-field': ['get', 'name'],
            'text-font': ['Open Sans Bold', 'Open Sans Regular'],
            'text-size': [
              'case',
              ['==', ['get', 'kind'], 'city'],
              12,
              ['==', ['get', 'kind'], 'territory'],
              16,
              14
            ],
            'text-transform': 'uppercase',
            'text-letter-spacing': 0.12
          },
          paint: {
            'text-color': '#4a3210',
            'text-halo-color': 'rgba(242, 237, 227, 0.78)',
            'text-halo-width': 1.2
          }
        });

        setActiveTrackProgress(map, resolvedTrackId, resolvedWaypointId);
      });
    };

    void initializeMap();

    return () => {
      isMounted = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
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
    const layers = ['regions-fill', 'regions-outline', 'territories-fill', 'territories-outline', 'ancient-labels'];
    layers.forEach((layerId) => {
      if (map.getLayer(layerId)) {
        map.setLayoutProperty(layerId, 'visibility', regionVisibility);
      }
    });
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

  useEffect(() => {
    const map = mapRef.current;
    if (!map?.isStyleLoaded()) return;
    const territorySource = map.getSource('territories') as maplibregl.GeoJSONSource | undefined;
    if (territorySource) {
      territorySource.setData(buildTerritoryFeatures(currentWaypointId));
    }
  }, [currentWaypointId]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map?.isStyleLoaded()) return;
    setActiveTrackProgress(map, resolvedTrackId, resolvedWaypointId);
  }, [activeTrackId, currentWaypointId]);

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
      setActiveTrackProgress(map, resolvedTrackId, resolvedWaypointId);
      return;
    }

    if (!current || !target) {
      setPlaying(false);
      setActiveTrackProgress(map, resolvedTrackId, resolvedWaypointId);
      return;
    }

    const segment = dataset.segments.find(
      (seg) => seg.trackId === activeTrackId && seg.fromWaypointId === current.id && seg.toWaypointId === target.id
    );

    if (!segment) {
      setWaypoint(target.id);
      setActiveTrackProgress(map, activeTrackId, target.id);
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
        setActiveTrackProgress(map, activeTrackId, target.id);
        setWaypoint(target.id);
        return;
      }

      const distanceKm = animationState.distanceTraveled / 1000;
      const along = turf.along(segment.geometry, distanceKm, { units: 'kilometers' });
      const coords = along.geometry.coordinates as [number, number];
      marker.setLngLat(coords);

      const partialSlice = turf.lineSlice(turf.point(current.coordinates), along, segment.geometry);
      const partialLine = partialSlice.geometry as LineString;
      setActiveTrackProgress(map, activeTrackId, current.id, partialLine);

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
