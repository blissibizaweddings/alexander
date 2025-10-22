export type TransportMode = 'foot' | 'horse' | 'ship' | 'supply';

export interface Person {
  id: string;
  slug: string;
  displayName: string;
  role: 'alexander' | 'general' | 'enemy' | 'ally' | 'other';
  bio?: string;
  portraitUrl?: string;
}

export interface Track {
  id: string;
  title: string;
  personId?: string;
  color: string;
  transportDefault: TransportMode | 'mixed';
  visibleByDefault: boolean;
  kind: 'land' | 'sea' | 'supply' | 'enemy';
}

export interface WaypointMedia {
  id: string;
  kind: 'audio' | 'image' | 'text' | 'document';
  url: string;
  title?: string;
  credit?: string;
  language?: string;
  caption?: string;
}

export interface Waypoint {
  id: string;
  trackId: string;
  seq: number;
  name: string;
  occurredOn?: string;
  coordinates: [number, number];
  summary: string;
  transcript?: string;
  autoplayAudio?: boolean;
  media: WaypointMedia[];
  sources?: string[];
}

export interface RouteSegment {
  id: string;
  trackId: string;
  fromWaypointId: string;
  toWaypointId: string;
  geometry: GeoJSON.LineString;
  transportMode: TransportMode;
  estDurationMinutes?: number;
}

export interface EventOverlay {
  id: string;
  name: string;
  kind: 'battle' | 'siege' | 'treaty' | 'founding';
  occurredOn?: string;
  area: GeoJSON.Polygon | GeoJSON.MultiPolygon;
  summary: string;
  sourceCitation?: string;
}

export interface RegionOverlay {
  id: string;
  name: string;
  period?: string;
  geometry: GeoJSON.Polygon | GeoJSON.MultiPolygon;
}

export type TerritoryController = 'macedon' | 'allies' | 'persia';

export interface TerritoryFeature {
  id: string;
  name: string;
  controller: TerritoryController;
  geometry: GeoJSON.Polygon | GeoJSON.MultiPolygon;
}

export interface TerritorySnapshot {
  waypointId: string;
  description?: string;
  territories: TerritoryFeature[];
}

export interface AncientLabel {
  id: string;
  name: string;
  kind: 'region' | 'city' | 'territory';
  coordinates: [number, number];
}

export interface LifeEvent {
  id: string;
  title: string;
  occurredOn?: string;
  location?: string;
  coordinates?: [number, number];
  description: string;
}

export interface CampaignDataset {
  people: Person[];
  tracks: Track[];
  waypoints: Waypoint[];
  segments: RouteSegment[];
  events: EventOverlay[];
  regions: RegionOverlay[];
  territoryTimeline: TerritorySnapshot[];
  ancientLabels: AncientLabel[];
  lifeTimeline: LifeEvent[];
}
