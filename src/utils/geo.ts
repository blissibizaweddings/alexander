import { dataset, orderedWaypoints, segmentsForTrack, territorySnapshotForWaypoint } from '@/data/mockCampaign';
import type { RouteSegment, Track, Waypoint } from '@/types';
import type { FeatureCollection, LineString, Point, Polygon, MultiPolygon } from 'geojson';

export const buildTrackLineFeatures = (track: Track): FeatureCollection<LineString> => {
  const segments = segmentsForTrack(track.id);
  return {
    type: 'FeatureCollection',
    features: segments.map((segment) => ({
      type: 'Feature',
      id: segment.id,
      properties: {
        trackId: track.id,
        transportMode: segment.transportMode
      },
      geometry: segment.geometry
    }))
  };
};

export const buildWaypointFeatures = (track: Track): FeatureCollection<Point> => {
  const waypoints = orderedWaypoints(track.id);
  return {
    type: 'FeatureCollection',
    features: waypoints.map((waypoint) => ({
      type: 'Feature',
      id: waypoint.id,
      properties: {
        trackId: track.id,
        name: waypoint.name,
        seq: waypoint.seq
      },
      geometry: {
        type: 'Point',
        coordinates: waypoint.coordinates
      }
    }))
  };
};

export const buildEventFeatures = (): FeatureCollection<Polygon> => ({
  type: 'FeatureCollection',
  features: dataset.events.map((event) => ({
    type: 'Feature',
    id: event.id,
    properties: {
      name: event.name,
      kind: event.kind,
      occurredOn: event.occurredOn,
      summary: event.summary,
      sourceCitation: event.sourceCitation
    },
    geometry: event.area
  }))
});

export const buildRegionFeatures = (): FeatureCollection => ({
  type: 'FeatureCollection',
  features: dataset.regions.map((region) => ({
    type: 'Feature',
    id: region.id,
    properties: {
      name: region.name,
      period: region.period
    },
    geometry: region.geometry
  }))
});

export const buildTerritoryFeatures = (waypointId: string): FeatureCollection<Polygon | MultiPolygon> => {
  const snapshot = territorySnapshotForWaypoint(waypointId);
  return {
    type: 'FeatureCollection',
    features: snapshot.territories.map((territory) => ({
      type: 'Feature',
      id: `${territory.id}-${snapshot.waypointId}`,
      properties: {
        name: territory.name,
        controller: territory.controller
      },
      geometry: territory.geometry
    }))
  };
};

export const buildLifeEventFeatures = (): FeatureCollection<Point> => ({
  type: 'FeatureCollection',
  features: dataset.lifeTimeline
    .filter((event) => Array.isArray(event.coordinates))
    .map((event) => ({
      type: 'Feature',
      id: event.id,
      properties: {
        title: event.title,
        occurredOn: event.occurredOn,
        location: event.location
      },
      geometry: {
        type: 'Point',
        coordinates: event.coordinates as [number, number]
      }
    }))
});

export const buildAncientLabelFeatures = (): FeatureCollection<Point> => ({
  type: 'FeatureCollection',
  features: dataset.ancientLabels.map((label) => ({
    type: 'Feature',
    id: label.id,
    properties: {
      name: label.name,
      kind: label.kind
    },
    geometry: {
      type: 'Point',
      coordinates: label.coordinates
    }
  }))
});

export const getWaypointById = (waypointId: string): Waypoint | undefined =>
  dataset.waypoints.find((wp) => wp.id === waypointId);

export const getTrackById = (trackId: string): Track | undefined =>
  dataset.tracks.find((track) => track.id === trackId);

export const segmentsForActiveWaypoint = (waypointId: string): RouteSegment[] =>
  dataset.segments.filter((segment) => segment.toWaypointId === waypointId);

export const nextWaypoint = (trackId: string, currentSeq: number): Waypoint | undefined => {
  const waypoints = orderedWaypoints(trackId);
  const index = waypoints.findIndex((wp) => wp.seq === currentSeq);
  if (index === -1) return undefined;
  return waypoints[index + 1];
};

export const previousWaypoint = (trackId: string, currentSeq: number): Waypoint | undefined => {
  const waypoints = orderedWaypoints(trackId);
  const index = waypoints.findIndex((wp) => wp.seq === currentSeq);
  if (index <= 0) return undefined;
  return waypoints[index - 1];
};
