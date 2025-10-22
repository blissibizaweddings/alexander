import type { CampaignDataset, RouteSegment, Track, Waypoint, TerritorySnapshot, TerritoryFeature, AncientLabel, LifeEvent } from '@/types';
import type { LineString, Polygon } from 'geojson';

const createLineString = (coords: [number, number][]): LineString => ({
  type: 'LineString',
  coordinates: coords
});

const createPolygon = (coords: [number, number][]): Polygon => {
  const first = coords[0];
  const last = coords[coords.length - 1];
  const ring = first[0] === last[0] && first[1] === last[1] ? coords : [
    ...coords,
    first
  ];
  return {
    type: 'Polygon',
    coordinates: [ring]
  };
};

const cloneTerritory = (territory: TerritoryFeature): TerritoryFeature => ({
  ...territory,
  geometry: JSON.parse(JSON.stringify(territory.geometry))
});

const createSnapshot = (waypointId: string, territories: TerritoryFeature[], description: string): TerritorySnapshot => ({
  waypointId,
  description,
  territories: territories.map(cloneTerritory)
});

const makeTerritory = (id: string, name: string, controller: TerritoryFeature['controller'], geometry: Polygon): TerritoryFeature => ({
  id,
  name,
  controller,
  geometry
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
        url: 'https://images.unsplash.com/photo-1504609813442-a8924e83f76e?auto=format&fit=crop&w=1200&q=80',
        title: 'Ruins of Pella',
        credit: 'Image via Unsplash',
        caption: 'Sunset over the archaeological site of Pella.'
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
        url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
        title: 'Granicus River Valley',
        credit: 'Image via Unsplash',
        caption: 'The river valley terrain near the Granicus.'
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
      },
      {
        id: 'media-issus-image',
        kind: 'image',
        url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80',
        title: 'Cilician Foothills',
        credit: 'Image via Unsplash',
        caption: 'The rugged ground near Issus where the armies met.'
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
      },
      {
        id: 'media-tyre-image',
        kind: 'image',
        url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80',
        title: 'Siege of Tyre Coastline',
        credit: 'Image via Unsplash',
        caption: 'Coastal shallows facing the fortress of Tyre.'
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
      },
      {
        id: 'media-gaugamela-image',
        kind: 'image',
        url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1200&q=80',
        title: 'Plain of Gaugamela',
        credit: 'Image via Unsplash',
        caption: 'Wide plains suited for the decisive battle of Gaugamela.'
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
      },
      {
        id: 'media-babylon-image',
        kind: 'image',
        url: 'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?auto=format&fit=crop&w=1200&q=80',
        title: 'Babylonian Reliefs',
        credit: 'Image via Unsplash',
        caption: 'Symbolic imagery evoking the grandeur of Babylon.'
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
    media: [
      {
        id: 'media-parmenion-granicus-image',
        kind: 'image',
        url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80',
        title: 'Parmenion Holds the Line',
        credit: 'Image via Unsplash',
        caption: 'The Macedonian left secures the river crossing at Granicus.'
      }
    ],
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
    media: [
      {
        id: 'media-parmenion-issus-image',
        kind: 'image',
        url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80',
        title: 'Parmenion at Issus',
        credit: 'Image via Unsplash',
        caption: 'Narrow pass terrain defended by Parmenion.'
      }
    ],
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
    media: [
      {
        id: 'media-darius-issus-image',
        kind: 'image',
        url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
        title: 'Darius at Issus',
        credit: 'Image via Unsplash',
        caption: 'Persian forces assemble in the hills near Issus.'
      }
    ],
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
    media: [
      {
        id: 'media-darius-gaugamela-image',
        kind: 'image',
        url: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80',
        title: 'Royal Camp at Gaugamela',
        credit: 'Image via Unsplash',
        caption: 'Desert plain prepared for Darius\' field army.'
      }
    ],
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
    media: [
      {
        id: 'media-nearchus-tyre-image',
        kind: 'image',
        url: 'https://images.unsplash.com/photo-1491557345352-5929e343eb89?auto=format&fit=crop&w=1200&q=80',
        title: 'Fleet off Tyre',
        credit: 'Image via Unsplash',
        caption: 'Macedonian ships maintain the blockade of Tyre.'
      }
    ],
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
    media: [
      {
        id: 'media-nearchus-babylon-image',
        kind: 'image',
        url: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
        title: 'Fleet Rejoins at Babylon',
        credit: 'Image via Unsplash',
        caption: 'Supply ships sailing up the Euphrates toward Babylon.'
      }
    ],
    sources: ['Arrian, *Anabasis* 3.16']
  }
];

const macedonHeartland = createPolygon([
  [20.3, 41.6],
  [23.8, 41.9],
  [24.2, 39.2],
  [21.1, 38.4]
]);

const anatoliaSatrapies = createPolygon([
  [23.5, 41.9],
  [31.5, 42.0],
  [37.2, 38.6],
  [29.6, 32.8],
  [24.1, 33.5]
]);

const levantCoast = createPolygon([
  [36.6, 36.8],
  [37.4, 33.1],
  [34.2, 29.6],
  [33.1, 33.6]
]);

const mesopotamiaBasin = createPolygon([
  [38.2, 37.8],
  [46.8, 37.8],
  [47.6, 30.8],
  [39.0, 30.0]
]);

const persisHeartland = createPolygon([
  [46.5, 35.0],
  [57.5, 35.0],
  [58.6, 27.0],
  [49.0, 24.5]
]);

const stageInitialTerritories: TerritoryFeature[] = [
  makeTerritory('territory-macedon-core', 'Kingdom of Macedon', 'macedon', macedonHeartland),
  makeTerritory('territory-persia-anatolia', 'Satrapies of Asia Minor', 'persia', anatoliaSatrapies),
  makeTerritory('territory-persia-levant', 'Phoenicia and Syria', 'persia', levantCoast),
  makeTerritory('territory-persia-mesopotamia', 'Mesopotamia', 'persia', mesopotamiaBasin),
  makeTerritory('territory-persia-core', 'Persis and Media', 'persia', persisHeartland)
];

const stageAnatoliaSecured: TerritoryFeature[] = [
  makeTerritory('territory-macedon-core', 'Kingdom of Macedon', 'macedon', macedonHeartland),
  makeTerritory('territory-macedon-anatolia', 'Anatolian Satrapies', 'macedon', anatoliaSatrapies),
  makeTerritory('territory-persia-levant', 'Phoenicia and Syria', 'persia', levantCoast),
  makeTerritory('territory-persia-mesopotamia', 'Mesopotamia', 'persia', mesopotamiaBasin),
  makeTerritory('territory-persia-core', 'Persis and Media', 'persia', persisHeartland)
];

const stageLevantSecured: TerritoryFeature[] = [
  makeTerritory('territory-macedon-core', 'Kingdom of Macedon', 'macedon', macedonHeartland),
  makeTerritory('territory-macedon-anatolia', 'Anatolian Satrapies', 'macedon', anatoliaSatrapies),
  makeTerritory('territory-macedon-levant', 'Phoenicia and Syria', 'macedon', levantCoast),
  makeTerritory('territory-persia-mesopotamia', 'Mesopotamia', 'persia', mesopotamiaBasin),
  makeTerritory('territory-persia-core', 'Persis and Media', 'persia', persisHeartland)
];

const stageMesopotamiaSecured: TerritoryFeature[] = [
  makeTerritory('territory-macedon-core', 'Kingdom of Macedon', 'macedon', macedonHeartland),
  makeTerritory('territory-macedon-anatolia', 'Anatolian Satrapies', 'macedon', anatoliaSatrapies),
  makeTerritory('territory-macedon-levant', 'Phoenicia and Syria', 'macedon', levantCoast),
  makeTerritory('territory-macedon-mesopotamia', 'Mesopotamia', 'macedon', mesopotamiaBasin),
  makeTerritory('territory-persia-core', 'Persis and Media', 'persia', persisHeartland)
];

const lifeTimeline: LifeEvent[] = [
  {
    id: "life-birth",
    title: "Birth of Alexander III",
    occurredOn: "0356-07-20",
    location: "Pella, Macedon",
    description: "Alexander is born to Philip II and Olympias, inheriting the royal lineage of Macedon."
  },
  {
    id: "life-bucephalus",
    title: "Tames the Horse Bucephalus",
    occurredOn: "0344-01-01",
    location: "Pella, Macedon",
    description: "Demonstrating courage and insight, the young prince tames the wild stallion Bucephalus, earning Philip II's admiration."
  },
  {
    id: "life-aristotle",
    title: "Tutored by Aristotle",
    occurredOn: "0343-01-01",
    location: "Mieza, Macedon",
    description: "Alexander and other noble youths begin intensive studies under Aristotle, absorbing lessons in philosophy, science, and governance."
  },
  {
    id: "life-regent",
    title: "Serves as Regent of Macedon",
    occurredOn: "0340-01-01",
    location: "Pella, Macedon",
    description: "While Philip II campaigns abroad, Alexander governs as regent and quells revolts, showcasing early administrative skill."
  },
  {
    id: "life-chaeronea",
    title: "Battle of Chaeronea",
    occurredOn: "0338-08-02",
    location: "Chaeronea, Boeotia",
    description: "Alexander leads the Companion cavalry to decisive effect, helping Philip II defeat the Greek coalition and secure Macedonian hegemony."
  },
  {
    id: "life-ascension",
    title: "Ascends the Macedonian Throne",
    occurredOn: "0336-10-01",
    location: "Pella, Macedon",
    description: "Following Philip II's assassination, Alexander suppresses rivals and is proclaimed king at age twenty."
  },
  {
    id: "life-thebes",
    title: "Sack of Thebes",
    occurredOn: "0335-09-01",
    location: "Thebes, Boeotia",
    description: "Alexander swiftly destroys the rebelling city of Thebes, warning other Greek states and consolidating his authority."
  },
  {
    id: "life-hellespont",
    title: "Crosses the Hellespont",
    occurredOn: "0334-04-01",
    location: "Abydos, Hellespont",
    description: "Leading nearly 40,000 troops, Alexander enters Asia Minor and begins his campaign against the Persian Empire."
  },
  {
    id: "life-granicus",
    title: "Battle of the Granicus",
    occurredOn: "0334-05-01",
    location: "Granicus River, Asia Minor",
    description: "Alexander defeats the Persian satraps in his first major battle on Asian soil, securing Asia Minor."
  },
  {
    id: "life-gordian",
    title: "Cuts the Gordian Knot",
    occurredOn: "0333-05-15",
    location: "Gordium, Phrygia",
    description: "According to legend, Alexander slices the Gordian Knot, fulfilling a prophecy that whoever untied it would rule Asia."
  },
  {
    id: "life-issus",
    title: "Battle of Issus",
    occurredOn: "0333-11-05",
    location: "Issus, Cilicia",
    description: "Facing Darius III, Alexander wins a decisive victory, capturing the Persian royal family and securing Syria."
  },
  {
    id: "life-tyre",
    title: "Siege of Tyre",
    occurredOn: "0332-07-29",
    location: "Tyre, Phoenicia",
    description: "After a seven-month siege, Alexander captures the island city of Tyre, opening the Eastern Mediterranean to his fleet."
  },
  {
    id: "life-egypt",
    title: "Crowned Pharaoh in Egypt",
    occurredOn: "0332-11-14",
    location: "Memphis, Egypt",
    description: "Welcomed as a liberator, Alexander is proclaimed pharaoh and later founds Alexandria on the Nile Delta."
  },
  {
    id: "life-siwa",
    title: "Consults the Oracle of Ammon",
    occurredOn: "0331-02-01",
    location: "Siwa Oasis, Egypt",
    description: "At the Siwa Oasis, priests hail Alexander as the son of Zeus-Ammon, reinforcing his divine authority among troops and subjects."
  },
  {
    id: "life-gaugamela",
    title: "Battle of Gaugamela",
    occurredOn: "0331-10-01",
    location: "Near Gaugamela, Assyria",
    description: "Alexander's tactical brilliance destroys Darius III's main army, effectively ending Persian resistance in Mesopotamia."
  },
  {
    id: "life-babylon",
    title: "Triumphal Entry into Babylon",
    occurredOn: "0331-10-22",
    location: "Babylon, Mesopotamia",
    description: "Babylon submits peacefully and becomes Alexander's administrative capital in Asia."
  },
  {
    id: "life-persepolis",
    title: "Burning of Persepolis",
    occurredOn: "0330-05-01",
    location: "Persepolis, Persis",
    description: "Alexander seizes the Persian ceremonial capital and later burns the palace complex, symbolically ending the Achaemenid dynasty."
  },
  {
    id: "life-hindu-kush",
    title: "Campaigns in Bactria and Sogdiana",
    occurredOn: "0329-01-01",
    location: "Bactria and Sogdiana",
    description: "Alexander wages prolonged guerilla warfare in Central Asia, founding cities and securing the empire's northeastern frontier."
  },
  {
    id: "life-roxana",
    title: "Marriage to Roxana",
    occurredOn: "0327-03-01",
    location: "Bactra, Bactria",
    description: "To legitimize rule in Central Asia, Alexander marries Roxana, a noble Sogdian woman."
  },
  {
    id: "life-hydaspes",
    title: "Battle of the Hydaspes",
    occurredOn: "0326-05-01",
    location: "Hydaspes River, Punjab",
    description: "Alexander defeats King Porus after a difficult battle, extending Macedonian control into the Indus Valley."
  },
  {
    id: "life-mutiny",
    title: "Troops Mutiny on the Hyphasis",
    occurredOn: "0326-08-15",
    location: "Hyphasis River, Punjab",
    description: "Exhausted Macedonian troops refuse to march deeper into India, compelling Alexander to turn back toward the west."
  },
  {
    id: "life-gedrosia",
    title: "Crossing the Gedrosian Desert",
    occurredOn: "0325-10-01",
    location: "Gedrosia (Makran Desert)",
    description: "During the return journey, Alexander leads a perilous march along the southern coast, losing thousands to heat and thirst."
  },
  {
    id: "life-susa-weddings",
    title: "Mass Weddings at Susa",
    occurredOn: "0324-02-01",
    location: "Susa, Susiana",
    description: "Alexander stages mass marriages between Macedonian officers and Persian noblewomen to fuse the cultures of his empire."
  },
  {
    id: "life-hephaestion",
    title: "Death of Hephaestion",
    occurredOn: "0324-10-01",
    location: "Ecbatana, Media",
    description: "Hephaestion, Alexander's closest companion and general, dies suddenly, plunging the king into intense mourning."
  },
  {
    id: "life-babylon-return",
    title: "Returns to Babylon for Imperial Plans",
    occurredOn: "0324-11-01",
    location: "Babylon, Mesopotamia",
    description: "Alexander begins reorganizing the empire, planning new campaigns toward Arabia and maritime projects."
  },
  {
    id: "life-death",
    title: "Death of Alexander the Great",
    occurredOn: "0323-06-10",
    location: "Babylon, Mesopotamia",
    description: "After a sudden illness, Alexander dies at age thirty-two, leaving a vast empire without a clear successor."
  }
];

const territoryTimeline: TerritorySnapshot[] = [
  createSnapshot('wp-pella', stageInitialTerritories, 'Alexander\'s Macedon before the Asian campaign (336–334 BCE)'),
  createSnapshot('wp-granicus', stageAnatoliaSecured, 'After the Battle of the Granicus (334 BCE)'),
  createSnapshot('wp-parmenion-granicus', stageAnatoliaSecured, 'Parmenion secures the Macedonian flank at the Granicus'),
  createSnapshot('wp-issus', stageAnatoliaSecured, 'Following the Battle of Issus (333 BCE)'),
  createSnapshot('wp-parmenion-issus', stageAnatoliaSecured, 'Parmenion holds the pass at Issus'),
  createSnapshot('wp-darius-issus', stageAnatoliaSecured, 'Darius retreats toward Syria after Issus'),
  createSnapshot('wp-tyre', stageLevantSecured, 'After the Siege of Tyre (332 BCE)'),
  createSnapshot('wp-nearchus-tyre', stageLevantSecured, 'Nearchus commands the fleet during the siege of Tyre'),
  createSnapshot('wp-gaugamela', stageMesopotamiaSecured, 'After the Battle of Gaugamela (331 BCE)'),
  createSnapshot('wp-darius-gaugamela', stageMesopotamiaSecured, 'Darius\' final field army at Gaugamela'),
  createSnapshot('wp-babylon', stageMesopotamiaSecured, 'Babylon submitted to Alexander (331 BCE)'),
  createSnapshot('wp-nearchus-babylon', stageMesopotamiaSecured, 'Nearchus delivers supplies at Babylon')
];

const ancientLabels: AncientLabel[] = [
  { id: 'label-macedon', name: 'Macedon', kind: 'territory', coordinates: [22.3, 40.9] },
  { id: 'label-hellas', name: 'Hellas', kind: 'region', coordinates: [21.5, 38.5] },
  { id: 'label-anatolia', name: 'Anatolia', kind: 'region', coordinates: [29.2, 38.5] },
  { id: 'label-phoenicia', name: 'Phoenicia', kind: 'region', coordinates: [35.2, 33.7] },
  { id: 'label-mesopotamia', name: 'Mesopotamia', kind: 'region', coordinates: [43.0, 34.3] },
  { id: 'label-persis', name: 'Persis', kind: 'territory', coordinates: [52.5, 30.2] },
  { id: 'label-tyre', name: 'Tyre', kind: 'city', coordinates: [35.2, 33.3] },
  { id: 'label-babylon', name: 'Babylon', kind: 'city', coordinates: [44.4, 32.5] },
  { id: 'label-susa', name: 'Susa', kind: 'city', coordinates: [48.3, 32.9] }
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
  ],
  territoryTimeline,
  ancientLabels,
  lifeTimeline
};

export const orderedWaypoints = (trackId: string): Waypoint[] =>
  dataset.waypoints
    .filter((wp) => wp.trackId === trackId)
    .sort((a, b) => a.seq - b.seq);

export const segmentsForTrack = (trackId: string): RouteSegment[] =>
  dataset.segments.filter((segment) => segment.trackId === trackId);

export const territorySnapshotForWaypoint = (waypointId: string): TerritorySnapshot => {
  const snapshot = dataset.territoryTimeline.find((entry) => entry.waypointId === waypointId);
  if (snapshot) {
    return createSnapshot(snapshot.waypointId, snapshot.territories, snapshot.description ?? '');
  }
  const fallback = dataset.territoryTimeline.length > 0 ? dataset.territoryTimeline[dataset.territoryTimeline.length - 1] : undefined;
  if (!fallback) {
    return { waypointId, description: '', territories: [] };
  }
  return createSnapshot(waypointId, fallback.territories, fallback.description ?? '');
};

export const getLifeTimeline = (): LifeEvent[] => dataset.lifeTimeline;
