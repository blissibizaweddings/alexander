import { dataset } from '@/data/mockCampaign';
import type { Track } from '@/types';
import { create } from 'zustand';

export type PanelView = 'waypoint' | 'legend' | 'timeline';

interface TimeFilterState {
  enabled: boolean;
  start?: string;
  end?: string;
}

interface PlaybackStore {
  activeTrackId: string;
  visibleTracks: Record<string, boolean>;
  currentWaypointId: string;
  isPlaying: boolean;
  playbackSpeed: number;
  panelView: PanelView;
  regionOverlayVisible: boolean;
  eventOverlayVisible: boolean;
  timeFilter: TimeFilterState;
  setActiveTrack: (trackId: string) => void;
  toggleTrack: (trackId: string) => void;
  setWaypoint: (waypointId: string) => void;
  setPlaying: (playing: boolean) => void;
  setPlaybackSpeed: (speed: number) => void;
  cyclePanelView: () => void;
  setRegionOverlayVisible: (value: boolean) => void;
  setEventOverlayVisible: (value: boolean) => void;
  updateTimeFilter: (payload: Partial<TimeFilterState>) => void;
}

const initialVisibleTracks = dataset.tracks.reduce<Record<string, boolean>>((acc, track) => {
  acc[track.id] = track.visibleByDefault;
  return acc;
}, {});

const primaryTrack = dataset.tracks.find((track) => track.kind === 'land') ?? dataset.tracks[0];
const firstWaypoint = dataset.waypoints
  .filter((wp) => wp.trackId === primaryTrack?.id)
  .sort((a, b) => a.seq - b.seq)[0];

export const usePlaybackStore = create<PlaybackStore>((set) => ({
  activeTrackId: primaryTrack?.id ?? dataset.tracks[0]?.id ?? 'track',
  visibleTracks: initialVisibleTracks,
  currentWaypointId: firstWaypoint?.id ?? dataset.waypoints[0]?.id ?? 'wp',
  isPlaying: false,
  playbackSpeed: 1,
  panelView: 'waypoint',
  regionOverlayVisible: true,
  eventOverlayVisible: true,
  timeFilter: { enabled: false },
  setActiveTrack: (trackId) => set({ activeTrackId: trackId, currentWaypointId: getFirstWaypointId(trackId) }),
  toggleTrack: (trackId) =>
    set((state) => ({
      visibleTracks: {
        ...state.visibleTracks,
        [trackId]: !state.visibleTracks[trackId]
      }
    })),
  setWaypoint: (waypointId) => set({ currentWaypointId: waypointId }),
  setPlaying: (playing) => set({ isPlaying: playing }),
  setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),
  cyclePanelView: () =>
    set((state) => ({
      panelView: state.panelView === 'waypoint' ? 'legend' : state.panelView === 'legend' ? 'timeline' : 'waypoint'
    })),
  setRegionOverlayVisible: (value) => set({ regionOverlayVisible: value }),
  setEventOverlayVisible: (value) => set({ eventOverlayVisible: value }),
  updateTimeFilter: (payload) =>
    set((state) => ({
      timeFilter: {
        ...state.timeFilter,
        ...payload,
        enabled: payload.enabled ?? state.timeFilter.enabled
      }
    }))
}));

const getFirstWaypointId = (trackId: string): string => {
  const trackWaypoints = dataset.waypoints
    .filter((wp) => wp.trackId === trackId)
    .sort((a, b) => a.seq - b.seq);
  return trackWaypoints[0]?.id ?? dataset.waypoints[0]?.id ?? 'wp';
};

export const tracksForLegend = (): Track[] => dataset.tracks;
