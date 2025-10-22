import type { CampaignDataset, RouteSegment, Track, Waypoint } from '@/types';
import type { LineString } from 'geojson';

const createLineString = (coords: [number, number][]): LineString => ({
  type: 'LineString',
  coordinates: coords
});

const alexanderTrack: Track = {
  id: 'track-alexander',
  title: 'Alexander the Great',
  personId: 'person-alexander',
  color: '#7c3f00',
  transportDefault: 'mixed',
  visibleByDefault: true,
  kind: 'land'
};

const parmenionTrack: Track = {
  id: 'track-parmenion',
  title: 'General Parmenion',
  personId: 'person-parmenion',
  color: '#3a6b6c',
  transportDefault: 'horse',
  visibleByDefault: false,
  kind: 'land'
};

const dariusTrack: Track = {
  id: 'track-darius',
  title: 'King Darius III',
  personId: 'person-darius',
  color: '#7a1f2a',
  transportDefault: 'horse',
  visibleByDefault: false,
  kind: 'enemy'
};

const nearchusTrack: Track = {
  id: 'track-nearchus',
  title: 'Admiral Nearchus (Fleet)',
  personId: 'person-nearchus',
  color: '#2f4858',
  transportDefault: 'ship',
  visibleByDefault: true,
  kind: 'sea'
};

const waypoints: Waypoint[] = [
  {
    id: 'wp-pella',
    trackId: alexanderTrack.id,
    seq: 1,
    name: 'Pella',
    occurredOn: '0340-07-01',
    coordinates: [22.524, 40.758],
    summary:
      'Alexander is born in the royal capital of Macedon. The campaign narrative begins with his upbringing and ascension to the throne.',
    transcript:
      'Alexander was born in Pella in 356 BCE. This stage introduces the Macedonian court and the early ambitions of the young prince.',
    media: [
      {
        id: 'media-pella-audio',
        kind: 'audio',
        url: '/media/audio/pella-intro.mp3',
        title: 'Prologue: Birth in Pella',
        credit: 'Narrated by Dr. Helena Markos',
        caption: 'Narration introducing Alexander\'s early life.'
      },
      {
        id: 'media-pella-image',
        kind: 'image',
        url: 'https://images.example.com/pella.jpg',
        title: 'Ruins of Pella',
        credit: 'Hellenic Ministry of Culture'
      }
    ],
    sources: [
      'Arrian, *Anabasis* 1.1',
      'Plutarch, *Life of Alexander* 2'
    ]
  },
  {
    id: 'wp-granicus',
    trackId: alexanderTrack.id,
    seq: 2,
    name: 'Battle of the Granicus',
    occurredOn: '0334-05-01',
    coordinates: [27.033, 40.444],
    summary:
      'Alexander defeats the satrapal coalition at the Granicus River, securing Asia Minor and opening the path toward the Anatolian interior.',
    transcript:
      'At the Granicus, Alexander led the Companion cavalry in a daring assault across the river, breaking the Persian line.',
    media: [
      {
        id: 'media-granicus-audio',
        kind: 'audio',
        url: '/media/audio/granicus.mp3',
        title: 'Crossing the Granicus',
        credit: 'Narrated by Dr. Helena Markos'
      },
      {
        id: 'media-granicus-image',
        kind: 'image',
        url: 'https://images.example.com/granicus.jpg',
        title: 'Granicus River Valley',
        credit: 'Asia Minor Research Foundation'
      }
    ],
    sources: ['Arrian, *Anabasis* 1.14-16']
  },
  {
    id: 'wp-issus',
    trackId: alexanderTrack.id,
    seq: 3,
    name: 'Battle of Issus',
    occurredOn: '0333-11-05',
    coordinates: [35.9807, 36.587],
    summary:
      'Facing Darius III in a narrow coastal plain, Alexander secures a decisive victory that forces the Persian king to flee.',
    transcript:
      'Alexander strikes Darius\'s left flank, turning the tide and capturing the royal camp.',
    media: [
      {
        id: 'media-issus-audio',
        kind: 'audio',
        url: '/media/audio/issus.mp3',
        title: 'Decisive Victory at Issus',
        credit: 'Narrated by Dr. Helena Markos'
      }
    ],
    sources: ['Arrian, *Anabasis* 2.11-14']
  },
  {
    id: 'wp-tyre',
    trackId: alexanderTrack.id,
    seq: 4,
    name: 'Siege of Tyre',
    occurredOn: '0332-07-29',
    coordinates: [35.195, 33.270],
    summary:
      'Alexander engineers a causeway to storm the island city of Tyre after a seven-month siege.',
    transcript:
      'The capture of Tyre demonstrates Macedonian ingenuity and secures the eastern Mediterranean.',
    media: [
      {
        id: 'media-tyre-audio',
        kind: 'audio',
        url: '/media/audio/tyre.mp3',
        title: 'Siegecraft at Tyre'
      }
    ],
    sources: ['Diodorus Siculus 17.40-46']
  },
  {
    id: 'wp-gaugamela',
    trackId: alexanderTrack.id,
    seq: 5,
    name: 'Battle of Gaugamela',
    occurredOn: '0331-10-01',
    coordinates: [43.2505, 36.3636],
    summary:
      'Alexander\'s tactical feints outmaneuver Darius III near Arbela, culminating in the decisive collapse of the Persian field army.',
    transcript:
      'A massive battle fought on a prepared field; Alexander\'s oblique advance breaks the Persian center.',
    media: [
      {
        id: 'media-gaugamela-audio',
        kind: 'audio',
        url: '/media/audio/gaugamela.mp3',
        title: 'The Persian Line Falters'
      }
    ],
    sources: ['Arrian, *Anabasis* 3.13-15']
  },
  {
    id: 'wp-babylon',
    trackId: alexanderTrack.id,
    seq: 6,
    name: 'Babylon',
    occurredOn: '0331-10-22',
    coordinates: [44.420, 32.538],
    summary:
      'Alexander enters Babylon as king, receiving the surrender of the city and its treasuries.',
    transcript:
      'Babylon becomes a key administrative center for Alexander\'s empire.',
    media: [
      {
        id: 'media-babylon-audio',
        kind: 'audio',
        url: '/media/audio/babylon.mp3',
        title: 'Triumphal Entry into Babylon'
      }
    ],
    sources: ['Curtius Rufus 5.1']
  },
  {
    id: 'wp-parmenion-granicus',
    trackId: parmenionTrack.id,
    seq: 1,
    name: 'Parmenion at Granicus',
    occurredOn: '0334-05-01',
    coordinates: [27.02, 40.45],
    summary:
      'Parmenion commands the left wing of the Macedonian army, anchoring the crossing at the Granicus River.',
    media: [],
    sources: ['Arrian, *Anabasis* 1.14']
  },
  {
    id: 'wp-parmenion-issus',
    trackId: parmenionTrack.id,
    seq: 2,
    name: 'Holding the Pass at Issus',
    occurredOn: '0333-11-05',
    coordinates: [35.98, 36.6],
    summary:
      'Parmenion secures the narrow coastal strip at Issus, preventing a Persian flanking maneuver.',
    media: [],
    sources: ['Arrian, *Anabasis* 2.11']
  },
  {
    id: 'wp-darius-issus',
    trackId: dariusTrack.id,
    seq: 1,
    name: 'Darius Musters at Issus',
    occurredOn: '0333-11-04',
    coordinates: [36.05, 36.6],
    summary:
      'Darius III gathers a vast army near Issus, expecting to catch Alexander in the open.',
    media: [],
    sources: ['Diodorus Siculus 17.32']
  },
  {
    id: 'wp-darius-gaugamela',
    trackId: dariusTrack.id,
    seq: 2,
    name: 'Royal Camp at Gaugamela',
    occurredOn: '0331-09-30',
    coordinates: [43.30, 36.37],
    summary:
      'Darius reassembles his forces on a prepared battlefield near Gaugamela.',
    media: [],
    sources: ['Arrian, *Anabasis* 3.8']
  },
  {
    id: 'wp-nearchus-tyre',
    trackId: nearchusTrack.id,
    seq: 1,
    name: 'Fleet at Tyre',
    occurredOn: '0332-07-15',
    coordinates: [35.19, 33.27],
    summary:
      'Nearchus coordinates the Macedonian fleet supporting the siege of Tyre.',
    media: [],
    sources: ['Arrian, *Anabasis* 2.20']
  },
  {
    id: 'wp-nearchus-babylon',
    trackId: nearchusTrack.id,
    seq: 2,
    name: 'Fleet Rejoins at Babylon',
    occurredOn: '0331-10-25',
    coordinates: [44.42, 32.54],
    summary:
      'Nearchus sails up the Euphrates to deliver supplies to Alexander in Babylon.',
    media: [],
    sources: ['Arrian, *Anabasis* 3.16']
  }
];

const segments: RouteSegment[] = [
  {
    id: 'seg-pella-granicus',
    trackId: alexanderTrack.id,
    fromWaypointId: 'wp-pella',
    toWaypointId: 'wp-granicus',
    geometry: createLineString([
      [22.524, 40.758],
      [23.5, 40.5],
      [25.0, 40.9],
      [27.033, 40.444]
    ]),
    transportMode: 'horse',
    estDurationMinutes: 43200
  },
  {
    id: 'seg-granicus-issus',
    trackId: alexanderTrack.id,
    fromWaypointId: 'wp-granicus',
    toWaypointId: 'wp-issus',
    geometry: createLineString([
      [27.033, 40.444],
      [29.0, 39.0],
      [32.0, 37.0],
      [35.9807, 36.587]
    ]),
    transportMode: 'horse',
    estDurationMinutes: 57600
  },
  {
    id: 'seg-issus-tyre',
    trackId: alexanderTrack.id,
    fromWaypointId: 'wp-issus',
    toWaypointId: 'wp-tyre',
    geometry: createLineString([
      [35.9807, 36.587],
      [35.5, 35.5],
      [35.195, 33.270]
    ]),
    transportMode: 'foot',
    estDurationMinutes: 30240
  },
  {
    id: 'seg-tyre-gaugamela',
    trackId: alexanderTrack.id,
    fromWaypointId: 'wp-tyre',
    toWaypointId: 'wp-gaugamela',
    geometry: createLineString([
      [35.195, 33.270],
      [36.3, 34.3],
      [40.0, 35.5],
      [43.2505, 36.3636]
    ]),
    transportMode: 'horse',
    estDurationMinutes: 60480
  },
  {
    id: 'seg-gaugamela-babylon',
    trackId: alexanderTrack.id,
    fromWaypointId: 'wp-gaugamela',
    toWaypointId: 'wp-babylon',
    geometry: createLineString([
      [43.2505, 36.3636],
      [42.9, 35.0],
      [44.420, 32.538]
    ]),
    transportMode: 'horse',
    estDurationMinutes: 20160
  },
  {
    id: 'seg-parmenion-support',
    trackId: parmenionTrack.id,
    fromWaypointId: 'wp-parmenion-granicus',
    toWaypointId: 'wp-parmenion-issus',
    geometry: createLineString([
      [27.033, 40.444],
      [28.2, 39.5],
      [31.0, 37.6],
      [35.9807, 36.587]
    ]),
    transportMode: 'horse'
  },
  {
    id: 'seg-darius-retreat',
    trackId: dariusTrack.id,
    fromWaypointId: 'wp-darius-issus',
    toWaypointId: 'wp-darius-gaugamela',
    geometry: createLineString([
      [35.9807, 36.587],
      [38.5, 36.5],
      [41.2, 36.6],
      [43.2505, 36.3636]
    ]),
    transportMode: 'horse'
  },
  {
    id: 'seg-nearchus-fleet',
    trackId: nearchusTrack.id,
    fromWaypointId: 'wp-nearchus-tyre',
    toWaypointId: 'wp-nearchus-babylon',
    geometry: createLineString([
      [35.195, 33.270],
      [34.0, 32.0],
      [32.0, 31.0],
      [34.5, 30.5],
      [44.420, 32.538]
    ]),
    transportMode: 'ship'
  }
];

export const dataset: CampaignDataset = {
  people: [
    {
      id: 'person-alexander',
      slug: 'alexander-the-great',
      displayName: 'Alexander III of Macedon',
      role: 'alexander',
      bio: 'King of Macedon and conqueror of the Persian Empire.'
    },
    {
      id: 'person-parmenion',
      slug: 'parmenion',
      displayName: 'Parmenion',
      role: 'general'
    },
    {
      id: 'person-darius',
      slug: 'darius-iii',
      displayName: 'Darius III',
      role: 'enemy'
    },
    {
      id: 'person-nearchus',
      slug: 'nearchus',
      displayName: 'Nearchus',
      role: 'general'
    }
  ],
  tracks: [alexanderTrack, parmenionTrack, dariusTrack, nearchusTrack],
  waypoints,
  segments,
  events: [
    {
      id: 'event-granicus',
      name: 'Battle of the Granicus',
      kind: 'battle',
      occurredOn: '0334-05-01',
      area: {
        type: 'Polygon',
        coordinates: [
          [
            [26.95, 40.50],
            [27.12, 40.50],
            [27.12, 40.38],
            [26.95, 40.38],
            [26.95, 40.50]
          ]
        ]
      },
      summary: 'Alexander defeats the satraps of Asia Minor, opening the road into Anatolia.',
      sourceCitation: 'Arrian, *Anabasis* 1.14-16'
    },
    {
      id: 'event-issus',
      name: 'Battle of Issus',
      kind: 'battle',
      occurredOn: '0333-11-05',
      area: {
        type: 'Polygon',
        coordinates: [
          [
            [35.92, 36.70],
            [36.09, 36.70],
            [36.09, 36.48],
            [35.92, 36.48],
            [35.92, 36.70]
          ]
        ]
      },
      summary: 'Decisive Macedonian victory that forced Darius III to flee.',
      sourceCitation: 'Arrian, *Anabasis* 2.11-14'
    },
    {
      id: 'event-tyre',
      name: 'Siege of Tyre',
      kind: 'siege',
      occurredOn: '0332-07-29',
      area: {
        type: 'Polygon',
        coordinates: [
          [
            [35.17, 33.32],
            [35.22, 33.32],
            [35.22, 33.24],
            [35.17, 33.24],
            [35.17, 33.32]
          ]
        ]
      },
      summary: 'After a prolonged siege, Tyre falls to Macedonian forces.',
      sourceCitation: 'Diodorus Siculus 17.40-46'
    },
    {
      id: 'event-gaugamela',
      name: 'Battle of Gaugamela',
      kind: 'battle',
      occurredOn: '0331-10-01',
      area: {
        type: 'Polygon',
        coordinates: [
          [
            [43.16, 36.42],
            [43.34, 36.42],
            [43.34, 36.30],
            [43.16, 36.30],
            [43.16, 36.42]
          ]
        ]
      },
      summary: 'Persian forces collapse under Alexander\'s maneuvering, paving the way to Babylon.',
      sourceCitation: 'Arrian, *Anabasis* 3.13-15'
    }
  ],
  regions: [
    {
      id: 'region-asia-minor',
      name: 'Satrapies of Asia Minor',
      period: 'c. 334 BCE',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [23.0, 41.5],
            [30.0, 41.5],
            [34.5, 36.5],
            [29.0, 33.0],
            [24.0, 34.0],
            [23.0, 41.5]
          ]
        ]
      }
    }
  ]
};

export const orderedWaypoints = (trackId: string): Waypoint[] =>
  dataset.waypoints
    .filter((wp) => wp.trackId === trackId)
    .sort((a, b) => a.seq - b.seq);

export const segmentsForTrack = (trackId: string): RouteSegment[] =>
  dataset.segments.filter((segment) => segment.trackId === trackId);
