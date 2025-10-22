import type {
  CampaignDataset,
  RouteSegment,
  Track,
  Waypoint,
  TerritorySnapshot,
  TerritoryFeature,
  AncientLabel,
  LifeEvent
} from '@/types';
import type { LineString, Polygon } from 'geojson';

const createLineString = (coords: [number, number][]): LineString => ({
  type: 'LineString',
  coordinates: coords
});

const createPolygon = (coords: [number, number][]): Polygon => {
  const first = coords[0];
  const last = coords[coords.length - 1];
  const ring = first[0] === last[0] && first[1] === last[1] ? coords : [...coords, first];
  return {
    type: 'Polygon',
    coordinates: [ring]
  };
};

const cloneTerritory = (territory: TerritoryFeature): TerritoryFeature => ({
  ...territory,
  geometry: JSON.parse(JSON.stringify(territory.geometry))
});

const createSnapshot = (
  waypointId: string,
  territories: TerritoryFeature[],
  description: string
): TerritorySnapshot => ({
  waypointId,
  description,
  territories: territories.map(cloneTerritory)
});

const makeTerritory = (
  id: string,
  name: string,
  controller: TerritoryFeature['controller'],
  geometry: Polygon
): TerritoryFeature => ({
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
const alexanderWaypoints: Waypoint[] = [
  {
    id: 'wp-pella',
    trackId: alexanderTrack.id,
    seq: 1,
    name: 'Pella',
    occurredOn: '0356-07-20',
    coordinates: [22.524, 40.758],
    summary:
      'Alexander is born in the royal capital of Macedon, inheriting the ambitions of the Argead dynasty.',
    transcript:
      'Alexander was born in Pella in 356 BCE. The Macedonian court under Philip II nurtured his education, military training, and determination to surpass his father.',
    media: [
      {
        id: 'media-pella-image',
        kind: 'image',
        url: 'https://images.unsplash.com/photo-1504609813442-a8924e83f76e?auto=format&fit=crop&w=1200&q=80',
        title: 'Ruins of Pella',
        credit: 'Image via Unsplash',
        caption: 'Sunset over the archaeological site of Pella.'
      },
      {
        id: 'media-pella-audio',
        kind: 'audio',
        url: '/media/audio/pella-intro.mp3',
        title: 'Prologue: Birth in Pella',
        credit: 'Narrated by Dr. Helena Markos',
        caption: 'Narration introducing Alexander\'s early life.'
      }
    ],
    sources: ['Arrian, *Anabasis* 1.1', 'Plutarch, *Life of Alexander* 2']
  },
  {
    id: 'wp-hellespont',
    trackId: alexanderTrack.id,
    seq: 2,
    name: 'Crossing the Hellespont',
    occurredOn: '0334-04-01',
    coordinates: [26.4, 40.2],
    summary:
      'Alexander ferries the Macedonian army from Europe to Asia at the Hellespont, inaugurating the Persian expedition.',
    transcript:
      'In the spring of 334 BCE Alexander led nearly 40,000 troops across the Hellespont near Abydos. He offered sacrifice at Troy and proclaimed the campaign a continuation of the Greek war against Persia.',
    media: [
      {
        id: 'media-hellespont-image',
        kind: 'image',
        url: 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&w=1200&q=80',
        title: 'Hellespont Strait',
        credit: 'Image via Unsplash',
        caption: 'Windswept waters along the Hellespont where Alexander crossed.'
      },
      {
        id: 'media-hellespont-audio',
        kind: 'audio',
        url: '/media/audio/hellespont.mp3',
        title: 'Crossing into Asia',
        credit: 'Narrated by Dr. Helena Markos'
      }
    ],
    sources: ['Arrian, *Anabasis* 1.11', 'Plutarch, *Life of Alexander* 15']
  },
  {
    id: 'wp-granicus',
    trackId: alexanderTrack.id,
    seq: 3,
    name: 'Battle of the Granicus',
    occurredOn: '0334-05-01',
    coordinates: [27.033, 40.444],
    summary:
      'Alexander defeats the satrapal coalition at the Granicus River, securing Asia Minor and opening the path toward the Anatolian interior.',
    transcript:
      'At the Granicus Alexander led the Companion cavalry in a daring assault across the river under missile fire, breaking the Persian line and capturing the satrapal commanders.',
    media: [
      {
        id: 'media-granicus-image',
        kind: 'image',
        url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
        title: 'Granicus River Valley',
        credit: 'Image via Unsplash',
        caption: 'The river valley terrain near the Granicus.'
      },
      {
        id: 'media-granicus-audio',
        kind: 'audio',
        url: '/media/audio/granicus.mp3',
        title: 'Crossing the Granicus',
        credit: 'Narrated by Dr. Helena Markos'
      }
    ],
    sources: ['Arrian, *Anabasis* 1.14-16']
  },
  {
    id: 'wp-halicarnassus',
    trackId: alexanderTrack.id,
    seq: 4,
    name: 'Siege of Halicarnassus',
    occurredOn: '0334-11-01',
    coordinates: [27.43, 37.037],
    summary:
      'The fortified Persian naval base at Halicarnassus falls after months of siege operations, giving Alexander control of Caria.',
    transcript:
      'Alexander invested Halicarnassus with engineers, siege towers, and allied fleets. After fierce night sorties and fires, the defenders evacuated and the Macedonians secured southwestern Asia Minor.',
    media: [
      {
        id: 'media-halicarnassus-image',
        kind: 'image',
        url: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
        title: 'Harbor Walls of Halicarnassus',
        credit: 'Image via Unsplash',
        caption: 'Harbor fortifications recalling the siege of Halicarnassus.'
      },
      {
        id: 'media-halicarnassus-audio',
        kind: 'audio',
        url: '/media/audio/halicarnassus.mp3',
        title: 'Securing Caria',
        credit: 'Narrated by Dr. Helena Markos'
      }
    ],
    sources: ['Arrian, *Anabasis* 1.19-23', 'Diodorus Siculus 17.24-25']
  },
  {
    id: 'wp-gordium',
    trackId: alexanderTrack.id,
    seq: 5,
    name: 'Gordium and the Knot',
    occurredOn: '0333-03-01',
    coordinates: [31.99, 37.511],
    summary:
      'At Gordium Alexander symbolically severs the Gordian Knot, securing Anatolia and claiming the mandate to rule Asia.',
    transcript:
      'During the winter at Gordium Alexander reorganized his army and reportedly sliced through the Gordian Knot, a prophecy that whoever loosened it would rule Asia.',
    media: [
      {
        id: 'media-gordium-image',
        kind: 'image',
        url: 'https://images.unsplash.com/photo-1526481280695-3c469928ad72?auto=format&fit=crop&w=1200&q=80',
        title: 'Citadel of Gordium',
        credit: 'Image via Unsplash',
        caption: 'Hills of Phrygia near the ancient city of Gordium.'
      },
      {
        id: 'media-gordium-audio',
        kind: 'audio',
        url: '/media/audio/gordium.mp3',
        title: 'The Gordian Knot',
        credit: 'Narrated by Dr. Helena Markos'
      }
    ],
    sources: ['Arrian, *Anabasis* 2.3-4', 'Plutarch, *Life of Alexander* 18']
  },
  {
    id: 'wp-issus',
    trackId: alexanderTrack.id,
    seq: 6,
    name: 'Battle of Issus',
    occurredOn: '0333-11-05',
    coordinates: [35.9807, 36.587],
    summary:
      'Facing Darius III in a narrow coastal plain, Alexander secures a decisive victory that forces the Persian king to flee.',
    transcript:
      'Alexander attacked through the narrow gorge at Issus, struck Darius\'s left, and captured the royal family and treasure, shattering Persian morale.',
    media: [
      {
        id: 'media-issus-image',
        kind: 'image',
        url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80',
        title: 'Cilician Foothills',
        credit: 'Image via Unsplash',
        caption: 'The rugged ground near Issus where the armies met.'
      },
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
    seq: 7,
    name: 'Siege of Tyre',
    occurredOn: '0332-07-29',
    coordinates: [35.195, 33.27],
    summary:
      'Alexander engineers a causeway to storm the island city of Tyre after a seven-month siege, eliminating the Persian naval base.',
    transcript:
      'The Macedonians constructed a mole, deployed siege towers, and coordinated their fleet to breach Tyre\'s walls. The fall of the city secured the eastern Mediterranean.',
    media: [
      {
        id: 'media-tyre-image',
        kind: 'image',
        url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80',
        title: 'Siege of Tyre Coastline',
        credit: 'Image via Unsplash',
        caption: 'Coastal shallows facing the fortress of Tyre.'
      },
      {
        id: 'media-tyre-audio',
        kind: 'audio',
        url: '/media/audio/tyre.mp3',
        title: 'Siegecraft at Tyre'
      }
    ],
    sources: ['Diodorus Siculus 17.40-46', 'Arrian, *Anabasis* 2.17-24']
  },
  {
    id: 'wp-gaza',
    trackId: alexanderTrack.id,
    seq: 8,
    name: 'Siege of Gaza',
    occurredOn: '0332-10-01',
    coordinates: [34.301, 31.5],
    summary:
      'After a costly assault Alexander captures Gaza, the last Persian stronghold on the road to Egypt.',
    transcript:
      'Gaza\'s high walls and Persian commander Batis resisted repeated attacks. Alexander finally breached the fortifications with siege ramps, opening the route into Egypt.',
    media: [
      {
        id: 'media-gaza-image',
        kind: 'image',
        url: 'https://images.unsplash.com/photo-1549899596-91b0fe0b6d70?auto=format&fit=crop&w=1200&q=80',
        title: 'Fortified Dunes near Gaza',
        credit: 'Image via Unsplash',
        caption: 'Desert bastions reminiscent of the siege of Gaza.'
      },
      {
        id: 'media-gaza-audio',
        kind: 'audio',
        url: '/media/audio/gaza.mp3',
        title: 'Gate to Egypt',
        credit: 'Narrated by Dr. Helena Markos'
      }
    ],
    sources: ['Arrian, *Anabasis* 2.26-27', 'Curtius Rufus 4.6']
  },
  {
    id: 'wp-alexandria',
    trackId: alexanderTrack.id,
    seq: 9,
    name: 'Founding of Alexandria',
    occurredOn: '0331-04-07',
    coordinates: [29.9187, 31.2001],
    summary:
      'Alexander lays out the city of Alexandria on the Nile Delta, establishing a new capital for Egypt.',
    transcript:
      'Recognized as pharaoh, Alexander planned Alexandria with a grid devised by the architect Deinocrates. The harbor city anchored Macedonian rule and commerce in Egypt.',
    media: [
      {
        id: 'media-alexandria-image',
        kind: 'image',
        url: 'https://images.unsplash.com/photo-1530543787849-128d94430c6b?auto=format&fit=crop&w=1200&q=80',
        title: 'Mediterranean Port at Alexandria',
        credit: 'Image via Unsplash',
        caption: 'Harbors reminiscent of the Hellenistic city of Alexandria.'
      },
      {
        id: 'media-alexandria-audio',
        kind: 'audio',
        url: '/media/audio/alexandria.mp3',
        title: 'City on the Nile',
        credit: 'Narrated by Dr. Helena Markos'
      }
    ],
    sources: ['Arrian, *Anabasis* 3.1', 'Plutarch, *Life of Alexander* 26']
  },
  {
    id: 'wp-siwa',
    trackId: alexanderTrack.id,
    seq: 10,
    name: 'Oracle of Siwa',
    occurredOn: '0331-02-01',
    coordinates: [25.52, 29.2],
    summary:
      'Alexander treks across the desert to consult the oracle of Ammon at Siwa, receiving confirmation of his divine lineage.',
    transcript:
      'At the oasis of Siwa Alexander was hailed as the son of Zeus-Ammon. The pilgrimage strengthened his authority over Egypt and the wider Hellenic world.',
    media: [
      {
        id: 'media-siwa-image',
        kind: 'image',
        url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
        title: 'Siwa Oasis',
        credit: 'Image via Unsplash',
        caption: 'Palm groves and dunes leading to the oracle of Ammon.'
      },
      {
        id: 'media-siwa-audio',
        kind: 'audio',
        url: '/media/audio/siwa.mp3',
        title: 'Pilgrimage to Ammon',
        credit: 'Narrated by Dr. Helena Markos'
      }
    ],
    sources: ['Arrian, *Anabasis* 3.3-4', 'Plutarch, *Life of Alexander* 27']
  },
  {
    id: 'wp-gaugamela',
    trackId: alexanderTrack.id,
    seq: 11,
    name: 'Battle of Gaugamela',
    occurredOn: '0331-10-01',
    coordinates: [43.2505, 36.3636],
    summary:
      'Alexander\'s tactical feints outmaneuver Darius III near Arbela, culminating in the decisive collapse of the Persian field army.',
    transcript:
      'Fighting on a prepared plain, Alexander advanced obliquely to draw the Persian left, then charged through the center toward Darius. The rout opened the road to Babylon.',
    media: [
      {
        id: 'media-gaugamela-image',
        kind: 'image',
        url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1200&q=80',
        title: 'Plain of Gaugamela',
        credit: 'Image via Unsplash',
        caption: 'Wide plains suited for the decisive battle of Gaugamela.'
      },
      {
        id: 'media-gaugamela-audio',
        kind: 'audio',
        url: '/media/audio/gaugamela.mp3',
        title: 'The Persian Line Falters'
      }
    ],
    sources: ['Arrian, *Anabasis* 3.13-15', 'Curtius Rufus 4.9-16']
  },
  {
    id: 'wp-babylon',
    trackId: alexanderTrack.id,
    seq: 12,
    name: 'Babylon',
    occurredOn: '0331-10-22',
    coordinates: [44.42, 32.538],
    summary:
      'Alexander enters Babylon as king, receiving the surrender of the city, its satraps, and immense treasuries.',
    transcript:
      'Babylon welcomed Alexander with processions, presenting it as the administrative heart of the new empire. He maintained the temples and appointed Macedonian and Persian officials together.',
    media: [
      {
        id: 'media-babylon-image',
        kind: 'image',
        url: 'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?auto=format&fit=crop&w=1200&q=80',
        title: 'Babylonian Reliefs',
        credit: 'Image via Unsplash',
        caption: 'Symbolic imagery evoking the grandeur of Babylon.'
      },
      {
        id: 'media-babylon-audio',
        kind: 'audio',
        url: '/media/audio/babylon.mp3',
        title: 'Triumphal Entry into Babylon'
      }
    ],
    sources: ['Curtius Rufus 5.1', 'Arrian, *Anabasis* 3.16']
  },
  {
    id: 'wp-susa',
    trackId: alexanderTrack.id,
    seq: 13,
    name: 'Treasures of Susa',
    occurredOn: '0331-12-01',
    coordinates: [48.257, 32.941],
    summary:
      'Alexander seizes the royal treasury at Susa, incorporating the administrative center of Elam into his empire.',
    transcript:
      'The satrap of Susa capitulated, delivering enormous wealth that financed further campaigns. Alexander maintained local officials while garrisoning the citadel.',
    media: [
      {
        id: 'media-susa-image',
        kind: 'image',
        url: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80',
        title: 'Citadel of Susa',
        credit: 'Image via Unsplash',
        caption: 'Ruins evocative of the Achaemenid palace complex at Susa.'
      },
      {
        id: 'media-susa-audio',
        kind: 'audio',
        url: '/media/audio/susa.mp3',
        title: 'Treasury Secured',
        credit: 'Narrated by Dr. Helena Markos'
      }
    ],
    sources: ['Arrian, *Anabasis* 3.16-17', 'Diodorus Siculus 17.64']
  },
  {
    id: 'wp-persepolis',
    trackId: alexanderTrack.id,
    seq: 14,
    name: 'Persepolis',
    occurredOn: '0330-01-20',
    coordinates: [53.086, 29.934],
    summary:
      'Alexander occupies Persepolis, ceremonially burning portions of the palace complex to signal the fall of the Achaemenid dynasty.',
    transcript:
      'After forcing the Persian Gate, Alexander entered Persepolis and for several months distributed the treasures. A later banquet led to the symbolic burning of Xerxes\' palace.',
    media: [
      {
        id: 'media-persepolis-image',
        kind: 'image',
        url: 'https://images.unsplash.com/photo-1558981285-6f0c94958bb6?auto=format&fit=crop&w=1200&q=80',
        title: 'Terraces of Persepolis',
        credit: 'Image via Unsplash',
        caption: 'Stone reliefs and columns at the ceremonial capital of Persia.'
      },
      {
        id: 'media-persepolis-audio',
        kind: 'audio',
        url: '/media/audio/persepolis.mp3',
        title: 'Fall of the Achaemenids',
        credit: 'Narrated by Dr. Helena Markos'
      }
    ],
    sources: ['Arrian, *Anabasis* 3.18-19', 'Plutarch, *Life of Alexander* 38']
  },
  {
    id: 'wp-ecbatana',
    trackId: alexanderTrack.id,
    seq: 15,
    name: 'Pursuit to Ecbatana',
    occurredOn: '0330-07-01',
    coordinates: [48.516, 34.806],
    summary:
      'Alexander marches to Ecbatana where Darius III is assassinated, assuming undisputed kingship of Asia.',
    transcript:
      'After defeating Bessus and Persian satraps at Ecbatana, Alexander claimed the title of King of Asia and reorganized his forces for campaigns into Central Asia.',
    media: [
      {
        id: 'media-ecbatana-image',
        kind: 'image',
        url: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
        title: 'Highlands near Ecbatana',
        credit: 'Image via Unsplash',
        caption: 'Zagros foothills around the Median capital of Ecbatana.'
      },
      {
        id: 'media-ecbatana-audio',
        kind: 'audio',
        url: '/media/audio/ecbatana.mp3',
        title: 'King of Asia',
        credit: 'Narrated by Dr. Helena Markos'
      }
    ],
    sources: ['Arrian, *Anabasis* 3.20-21', 'Curtius Rufus 5.6-7']
  },
  {
    id: 'wp-maracanda',
    trackId: alexanderTrack.id,
    seq: 16,
    name: 'Campaign in Sogdiana',
    occurredOn: '0329-09-01',
    coordinates: [66.972, 39.627],
    summary:
      'Alexander establishes his base at Maracanda and wages campaigns against Sogdian resistance in Central Asia.',
    transcript:
      'From Maracanda (Samarkand) Alexander conducted winter operations, founding garrisons and marrying Roxane to pacify Bactria and Sogdiana.',
    media: [
      {
        id: 'media-maracanda-image',
        kind: 'image',
        url: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=80',
        title: 'Samarkand Plain',
        credit: 'Image via Unsplash',
        caption: 'Fertile oasis serving as Alexander\'s base in Sogdiana.'
      },
      {
        id: 'media-maracanda-audio',
        kind: 'audio',
        url: '/media/audio/maracanda.mp3',
        title: 'Consolidating Central Asia',
        credit: 'Narrated by Dr. Helena Markos'
      }
    ],
    sources: ['Arrian, *Anabasis* 4.1-19', 'Curtius Rufus 7.6']
  },
  {
    id: 'wp-bucephala',
    trackId: alexanderTrack.id,
    seq: 17,
    name: 'Battle of the Hydaspes',
    occurredOn: '0326-05-01',
    coordinates: [73.7, 32.9],
    summary:
      'Alexander defeats King Porus on the Hydaspes River and founds the city of Bucephala in honor of his fallen horse.',
    transcript:
      'Using feints and a nocturnal crossing, Alexander surprised Porus beyond the Hydaspes. The hard-fought victory secured the Punjab frontier and a new city named Bucephala.',
    media: [
      {
        id: 'media-hydaspes-image',
        kind: 'image',
        url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
        title: 'Hydaspes River Basin',
        credit: 'Image via Unsplash',
        caption: 'Monsoon skies over the Hydaspes, site of Alexander\'s eastern victory.'
      },
      {
        id: 'media-hydaspes-audio',
        kind: 'audio',
        url: '/media/audio/hydaspes.mp3',
        title: 'Crossing the Monsoon River',
        credit: 'Narrated by Dr. Helena Markos'
      }
    ],
    sources: ['Arrian, *Anabasis* 5.8-19', 'Plutarch, *Life of Alexander* 60']
  },
  {
    id: 'wp-hyphasis',
    trackId: alexanderTrack.id,
    seq: 18,
    name: 'Mutiny on the Hyphasis',
    occurredOn: '0326-08-15',
    coordinates: [75.1, 31.45],
    summary:
      'Exhausted Macedonian troops refuse to march farther east at the Hyphasis River, compelling Alexander to turn back.',
    transcript:
      'After surveying the Hyphasis (Beas) River, Alexander confronted a mutiny led by Coenus and the rank-and-file, ending the eastward advance and prompting plans for a return journey.',
    media: [
      {
        id: 'media-hyphasis-image',
        kind: 'image',
        url: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80',
        title: 'Banks of the Hyphasis',
        credit: 'Image via Unsplash',
        caption: 'Verdant banks of the Hyphasis where the army insisted on returning west.'
      },
      {
        id: 'media-hyphasis-audio',
        kind: 'audio',
        url: '/media/audio/hyphasis.mp3',
        title: 'Decision to Turn Back',
        credit: 'Narrated by Dr. Helena Markos'
      }
    ],
    sources: ['Arrian, *Anabasis* 5.25-29', 'Curtius Rufus 9.3']
  },
  {
    id: 'wp-gedrosia',
    trackId: alexanderTrack.id,
    seq: 19,
    name: 'Crossing the Gedrosian Desert',
    occurredOn: '0325-10-01',
    coordinates: [64.0, 26.0],
    summary:
      'During the return march Alexander leads his army across the Gedrosian (Makran) desert, suffering heavy losses.',
    transcript:
      'Alexander attempted to outdo Cyrus by crossing the Gedrosian sands. Scarcity of water and heat killed thousands, but the march demonstrated his endurance and the loyalty of the survivors.',
    media: [
      {
        id: 'media-gedrosia-image',
        kind: 'image',
        url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
        title: 'Makran Desert',
        credit: 'Image via Unsplash',
        caption: 'Harsh dunes evocative of the Gedrosian crossing.'
      },
      {
        id: 'media-gedrosia-audio',
        kind: 'audio',
        url: '/media/audio/gedrosia.mp3',
        title: 'Perilous Return',
        credit: 'Narrated by Dr. Helena Markos'
      }
    ],
    sources: ['Arrian, *Anabasis* 6.24-26', 'Plutarch, *Life of Alexander* 66']
  },
  {
    id: 'wp-susa-weddings',
    trackId: alexanderTrack.id,
    seq: 20,
    name: 'Mass Weddings at Susa',
    occurredOn: '0324-02-01',
    coordinates: [48.25, 32.93],
    summary:
      'Alexander stages mass marriages between Macedonian officers and Persian noblewomen in Susa to fuse his empire.',
    transcript:
      'In the Hall of Audience at Susa Alexander married Stateira and arranged unions for eighty companions, distributing dowries to encourage Macedonian-Persian integration.',
    media: [
      {
        id: 'media-susa-weddings-image',
        kind: 'image',
        url: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80',
        title: 'Banquet Hall of Susa',
        credit: 'Image via Unsplash',
        caption: 'Imagined setting of the mass weddings orchestrated by Alexander.'
      },
      {
        id: 'media-susa-weddings-audio',
        kind: 'audio',
        url: '/media/audio/susa-weddings.mp3',
        title: 'Fusion of Macedon and Persia',
        credit: 'Narrated by Dr. Helena Markos'
      }
    ],
    sources: ['Arrian, *Anabasis* 7.4', 'Diodorus Siculus 17.107']
  },
  {
    id: 'wp-opis',
    trackId: alexanderTrack.id,
    seq: 21,
    name: 'Mutiny at Opis',
    occurredOn: '0324-09-01',
    coordinates: [44.4, 33.7],
    summary:
      'Alexander quells a mutiny at Opis when Macedonian veterans protest the integration of Persian troops.',
    transcript:
      'Addressing the assembled army at Opis, Alexander dismissed recalcitrant veterans and reconciled the troops after a dramatic speech, reaffirming his authority before returning to Babylon.',
    media: [
      {
        id: 'media-opis-image',
        kind: 'image',
        url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',
        title: 'Encampment near Opis',
        credit: 'Image via Unsplash',
        caption: 'River plains near Opis where Alexander confronted his troops.'
      },
      {
        id: 'media-opis-audio',
        kind: 'audio',
        url: '/media/audio/opis.mp3',
        title: 'Speech to the Troops',
        credit: 'Narrated by Dr. Helena Markos'
      }
    ],
    sources: ['Arrian, *Anabasis* 7.8-12', 'Curtius Rufus 10.2']
  },
  {
    id: 'wp-babylon-finale',
    trackId: alexanderTrack.id,
    seq: 22,
    name: 'Final Days in Babylon',
    occurredOn: '0323-06-10',
    coordinates: [44.42, 32.54],
    summary:
      'Alexander returns to Babylon to plan new expeditions, falls ill, and dies in the palace of Nebuchadnezzar II.',
    transcript:
      'In 323 BCE Alexander assembled fleets and envoys for an Arabian campaign. After feasting and a sudden fever he died in Babylon, leaving the empire without a clear successor.',
    media: [
      {
        id: 'media-babylon-finale-image',
        kind: 'image',
        url: 'https://images.unsplash.com/photo-1533558707412-4a3a67f6fdaf?auto=format&fit=crop&w=1200&q=80',
        title: 'Palace Walls of Babylon',
        credit: 'Image via Unsplash',
        caption: 'Reconstructed walls evoking Alexander\'s final days in Babylon.'
      },
      {
        id: 'media-babylon-finale-audio',
        kind: 'audio',
        url: '/media/audio/babylon-finale.mp3',
        title: 'Death of Alexander',
        credit: 'Narrated by Dr. Helena Markos'
      }
    ],
    sources: ['Arrian, *Anabasis* 7.24-28', 'Plutarch, *Life of Alexander* 76-77']
  }
];
const parmenionWaypoints: Waypoint[] = [
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
  }
];

const dariusWaypoints: Waypoint[] = [
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
    coordinates: [43.3, 36.37],
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
  }
];

const nearchusWaypoints: Waypoint[] = [
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

const waypoints: Waypoint[] = [
  ...alexanderWaypoints,
  ...parmenionWaypoints,
  ...dariusWaypoints,
  ...nearchusWaypoints
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

const egyptSatrapy = createPolygon([
  [32.5, 31.8],
  [29.6, 31.3],
  [27.8, 29.2],
  [29.0, 26.0],
  [32.8, 27.3],
  [34.0, 30.2]
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

const bactriaSogdiana = createPolygon([
  [61.0, 37.5],
  [67.5, 40.5],
  [71.0, 39.5],
  [69.5, 35.5],
  [63.0, 34.5]
]);

const indusValley = createPolygon([
  [66.5, 31.0],
  [74.2, 34.8],
  [76.5, 32.0],
  [70.5, 27.2]
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

const stageEgyptSecured: TerritoryFeature[] = [
  makeTerritory('territory-macedon-core', 'Kingdom of Macedon', 'macedon', macedonHeartland),
  makeTerritory('territory-macedon-anatolia', 'Anatolian Satrapies', 'macedon', anatoliaSatrapies),
  makeTerritory('territory-macedon-levant', 'Phoenicia and Syria', 'macedon', levantCoast),
  makeTerritory('territory-macedon-egypt', 'Egypt and Cyrenaica', 'macedon', egyptSatrapy),
  makeTerritory('territory-persia-mesopotamia', 'Mesopotamia', 'persia', mesopotamiaBasin),
  makeTerritory('territory-persia-core', 'Persis and Media', 'persia', persisHeartland)
];

const stageMesopotamiaSecured: TerritoryFeature[] = [
  makeTerritory('territory-macedon-core', 'Kingdom of Macedon', 'macedon', macedonHeartland),
  makeTerritory('territory-macedon-anatolia', 'Anatolian Satrapies', 'macedon', anatoliaSatrapies),
  makeTerritory('territory-macedon-levant', 'Phoenicia and Syria', 'macedon', levantCoast),
  makeTerritory('territory-macedon-egypt', 'Egypt and Cyrenaica', 'macedon', egyptSatrapy),
  makeTerritory('territory-macedon-mesopotamia', 'Mesopotamia', 'macedon', mesopotamiaBasin),
  makeTerritory('territory-persia-core', 'Persis and Media', 'persia', persisHeartland)
];

const stagePersiaConquered: TerritoryFeature[] = [
  makeTerritory('territory-macedon-core', 'Kingdom of Macedon', 'macedon', macedonHeartland),
  makeTerritory('territory-macedon-anatolia', 'Anatolian Satrapies', 'macedon', anatoliaSatrapies),
  makeTerritory('territory-macedon-levant', 'Phoenicia and Syria', 'macedon', levantCoast),
  makeTerritory('territory-macedon-egypt', 'Egypt and Cyrenaica', 'macedon', egyptSatrapy),
  makeTerritory('territory-macedon-mesopotamia', 'Mesopotamia', 'macedon', mesopotamiaBasin),
  makeTerritory('territory-macedon-persis', 'Persis and Media', 'macedon', persisHeartland)
];

const stageCentralAsiaSecured: TerritoryFeature[] = [
  ...stagePersiaConquered,
  makeTerritory('territory-macedon-bactria', 'Bactria and Sogdiana', 'macedon', bactriaSogdiana)
];

const stageIndiaReached: TerritoryFeature[] = [
  ...stageCentralAsiaSecured,
  makeTerritory('territory-macedon-indus', 'Indus Valley', 'macedon', indusValley)
];
const lifeTimeline: LifeEvent[] = [
  {
    id: "life-birth",
    title: "Birth of Alexander III",
    occurredOn: "0356-07-20",
    location: "Pella, Macedon",
    coordinates: [22.524, 40.758],
    description: "Alexander is born to Philip II and Olympias, inheriting the royal lineage of Macedon."
  },
  {
    id: "life-bucephalus",
    title: "Tames the Horse Bucephalus",
    occurredOn: "0344-01-01",
    location: "Pella, Macedon",
    coordinates: [22.524, 40.758],
    description: "Demonstrating courage and insight, the young prince tames the wild stallion Bucephalus, earning Philip II's admiration."
  },
  {
    id: "life-aristotle",
    title: "Tutored by Aristotle",
    occurredOn: "0343-01-01",
    location: "Mieza, Macedon",
    coordinates: [23.32, 40.72],
    description: "Alexander and other noble youths begin intensive studies under Aristotle, absorbing lessons in philosophy, science, and governance."
  },
  {
    id: "life-regent",
    title: "Serves as Regent of Macedon",
    occurredOn: "0340-01-01",
    location: "Pella, Macedon",
    coordinates: [22.524, 40.758],
    description: "While Philip II campaigns abroad, Alexander governs as regent and quells revolts, showcasing early administrative skill."
  },
  {
    id: "life-chaeronea",
    title: "Battle of Chaeronea",
    occurredOn: "0338-08-02",
    location: "Chaeronea, Boeotia",
    coordinates: [22.875, 38.482],
    description: "Alexander leads the Companion cavalry to decisive effect, helping Philip II defeat the Greek coalition and secure Macedonian hegemony."
  },
  {
    id: "life-ascension",
    title: "Ascends the Macedonian Throne",
    occurredOn: "0336-10-01",
    location: "Pella, Macedon",
    coordinates: [22.524, 40.758],
    description: "Following Philip II's assassination, Alexander suppresses rivals and is proclaimed king at age twenty."
  },
  {
    id: "life-thebes",
    title: "Sack of Thebes",
    occurredOn: "0335-09-01",
    location: "Thebes, Boeotia",
    coordinates: [23.319, 38.325],
    description: "Alexander swiftly destroys the rebelling city of Thebes, warning other Greek states and consolidating his authority."
  },
  {
    id: "life-hellespont",
    title: "Crosses the Hellespont",
    occurredOn: "0334-04-01",
    location: "Abydos, Hellespont",
    coordinates: [26.4, 40.2],
    description: "Leading nearly 40,000 troops, Alexander enters Asia Minor and begins his campaign against the Persian Empire."
  },
  {
    id: "life-granicus",
    title: "Battle of the Granicus",
    occurredOn: "0334-05-01",
    location: "Granicus River, Asia Minor",
    coordinates: [27.18, 40.45],
    description: "Alexander defeats the Persian satraps in his first major battle on Asian soil, securing Asia Minor."
  },
  {
    id: "life-gordian",
    title: "Cuts the Gordian Knot",
    occurredOn: "0333-05-15",
    location: "Gordium, Phrygia",
    coordinates: [31.18, 39.31],
    description: "According to legend, Alexander slices the Gordian Knot, fulfilling a prophecy that whoever untied it would rule Asia."
  },
  {
    id: "life-issus",
    title: "Battle of Issus",
    occurredOn: "0333-11-05",
    location: "Issus, Cilicia",
    coordinates: [36.6, 36.6],
    description: "Facing Darius III, Alexander wins a decisive victory, capturing the Persian royal family and securing Syria."
  },
  {
    id: "life-tyre",
    title: "Siege of Tyre",
    occurredOn: "0332-07-29",
    location: "Tyre, Phoenicia",
    coordinates: [35.2, 33.27],
    description: "After a seven-month siege, Alexander captures the island city of Tyre, opening the Eastern Mediterranean to his fleet."
  },
  {
    id: "life-egypt",
    title: "Crowned Pharaoh in Egypt",
    occurredOn: "0332-11-14",
    location: "Memphis, Egypt",
    coordinates: [31.25, 29.85],
    description: "Welcomed as a liberator, Alexander is proclaimed pharaoh and later founds Alexandria on the Nile Delta."
  },
  {
    id: "life-siwa",
    title: "Consults the Oracle of Ammon",
    occurredOn: "0331-02-01",
    location: "Siwa Oasis, Egypt",
    coordinates: [25.54, 29.2],
    description: "At the Siwa Oasis, priests hail Alexander as the son of Zeus-Ammon, reinforcing his divine authority among troops and subjects."
  },
  {
    id: "life-gaugamela",
    title: "Battle of Gaugamela",
    occurredOn: "0331-10-01",
    location: "Near Gaugamela, Assyria",
    coordinates: [43.25, 36.36],
    description: "Alexander's tactical brilliance destroys Darius III's main army, effectively ending Persian resistance in Mesopotamia."
  },
  {
    id: "life-babylon",
    title: "Triumphal Entry into Babylon",
    occurredOn: "0331-10-22",
    location: "Babylon, Mesopotamia",
    coordinates: [44.42, 32.54],
    description: "Babylon submits peacefully and becomes Alexander's administrative capital in Asia."
  },
  {
    id: "life-persepolis",
    title: "Burning of Persepolis",
    occurredOn: "0330-05-01",
    location: "Persepolis, Persis",
    coordinates: [52.88, 29.94],
    description: "Alexander seizes the Persian ceremonial capital and later burns the palace complex, symbolically ending the Achaemenid dynasty."
  },
  {
    id: "life-hindu-kush",
    title: "Campaigns in Bactria and Sogdiana",
    occurredOn: "0329-01-01",
    location: "Bactria and Sogdiana",
    coordinates: [68.8, 37.2],
    description: "Alexander wages prolonged guerilla warfare in Central Asia, founding cities and securing the empire's northeastern frontier."
  },
  {
    id: "life-roxana",
    title: "Marriage to Roxana",
    occurredOn: "0327-03-01",
    location: "Bactra, Bactria",
    coordinates: [66.9, 36.7],
    description: "To legitimize rule in Central Asia, Alexander marries Roxana, a noble Sogdian woman."
  },
  {
    id: "life-hydaspes",
    title: "Battle of the Hydaspes",
    occurredOn: "0326-05-01",
    location: "Hydaspes River, Punjab",
    coordinates: [73.7, 32.7],
    description: "Alexander defeats King Porus after a difficult battle, extending Macedonian control into the Indus Valley."
  },
  {
    id: "life-mutiny",
    title: "Troops Mutiny on the Hyphasis",
    occurredOn: "0326-08-15",
    location: "Hyphasis River, Punjab",
    coordinates: [75.1, 31.45],
    description: "Exhausted Macedonian troops refuse to march deeper into India, compelling Alexander to turn back toward the west."
  },
  {
    id: "life-gedrosia",
    title: "Crossing the Gedrosian Desert",
    occurredOn: "0325-10-01",
    location: "Gedrosia (Makran Desert)",
    coordinates: [63.0, 26.0],
    description: "During the return journey, Alexander leads a perilous march along the southern coast, losing thousands to heat and thirst."
  },
  {
    id: "life-susa-weddings",
    title: "Mass Weddings at Susa",
    occurredOn: "0324-02-01",
    location: "Susa, Susiana",
    coordinates: [48.25, 32.93],
    description: "Alexander stages mass marriages between Macedonian officers and Persian noblewomen to fuse the cultures of his empire."
  },
  {
    id: "life-hephaestion",
    title: "Death of Hephaestion",
    occurredOn: "0324-10-01",
    location: "Ecbatana, Media",
    coordinates: [48.68, 34.8],
    description: "Hephaestion, Alexander's closest companion and general, dies suddenly, plunging the king into intense mourning."
  },
  {
    id: "life-babylon-return",
    title: "Returns to Babylon for Imperial Plans",
    occurredOn: "0324-11-01",
    location: "Babylon, Mesopotamia",
    coordinates: [44.42, 32.54],
    description: "Alexander begins reorganizing the empire, planning new campaigns toward Arabia and maritime projects."
  },
  {
    id: "life-death",
    title: "Death of Alexander the Great",
    occurredOn: "0323-06-10",
    location: "Babylon, Mesopotamia",
    coordinates: [44.42, 32.54],
    description: "After a sudden illness, Alexander dies at age thirty-two, leaving a vast empire without a clear successor."
  }
];
const territoryTimeline: TerritorySnapshot[] = [
  createSnapshot('wp-pella', stageInitialTerritories, 'Alexander\'s Macedon before the Asian campaign (336–334 BCE)'),
  createSnapshot('wp-hellespont', stageInitialTerritories, 'Crossing into Asia while Macedon secures Greece.'),
  createSnapshot('wp-granicus', stageAnatoliaSecured, 'After the Battle of the Granicus (334 BCE).'),
  createSnapshot('wp-halicarnassus', stageAnatoliaSecured, 'Caria and the southwestern coast brought under Macedonian control.'),
  createSnapshot('wp-gordium', stageAnatoliaSecured, 'Phrygia reorganized under Macedonian administration.'),
  createSnapshot('wp-issus', stageAnatoliaSecured, 'Following the victory at Issus (333 BCE).'),
  createSnapshot('wp-tyre', stageLevantSecured, 'After the Siege of Tyre (332 BCE).'),
  createSnapshot('wp-gaza', stageLevantSecured, 'Gaza captured and the road to Egypt opened.'),
  createSnapshot('wp-alexandria', stageEgyptSecured, 'Alexandria founded and Egypt annexed.'),
  createSnapshot('wp-siwa', stageEgyptSecured, 'Siwa oracle affirms Alexander\'s rule over Egypt.'),
  createSnapshot('wp-gaugamela', stageMesopotamiaSecured, 'Persian field armies broken at Gaugamela (331 BCE).'),
  createSnapshot('wp-babylon', stageMesopotamiaSecured, 'Babylon submitted to Alexander.'),
  createSnapshot('wp-susa', stagePersiaConquered, 'Royal treasuries at Susa transferred to Macedonian control.'),
  createSnapshot('wp-persepolis', stagePersiaConquered, 'Persepolis taken and the Achaemenid core subdued.'),
  createSnapshot('wp-ecbatana', stagePersiaConquered, 'Median capital secured and Darius III deposed.'),
  createSnapshot('wp-maracanda', stageCentralAsiaSecured, 'Bactria and Sogdiana pacified with new garrisons.'),
  createSnapshot('wp-bucephala', stageIndiaReached, 'Punjab territories incorporated after the Hydaspes victory.'),
  createSnapshot('wp-hyphasis', stageIndiaReached, 'Eastern frontier established on the Hyphasis River.'),
  createSnapshot('wp-gedrosia', stageIndiaReached, 'Return march through Gedrosia consolidates the southern routes.'),
  createSnapshot('wp-susa-weddings', stageIndiaReached, 'Imperial integration policies formalized at Susa.'),
  createSnapshot('wp-opis', stageIndiaReached, 'Army reorganization and reconciliation at Opis.'),
  createSnapshot('wp-babylon-finale', stageIndiaReached, 'Extent of Alexander\'s empire at his death in Babylon (323 BCE).'),
  createSnapshot('wp-parmenion-granicus', stageAnatoliaSecured, 'Parmenion secures the left wing during the Granicus crossing.'),
  createSnapshot('wp-parmenion-issus', stageAnatoliaSecured, 'Parmenion holds the Issus coastline for Alexander.'),
  createSnapshot('wp-darius-issus', stageAnatoliaSecured, 'Darius musters Persian forces in Cilicia.'),
  createSnapshot('wp-darius-gaugamela', stageMesopotamiaSecured, 'Darius prepares his final field army near Gaugamela.'),
  createSnapshot('wp-nearchus-tyre', stageLevantSecured, 'Nearchus commands the fleet during the siege of Tyre.'),
  createSnapshot('wp-nearchus-babylon', stageMesopotamiaSecured, 'Nearchus delivers supplies to the new capital at Babylon.')
];
const ancientLabels: AncientLabel[] = [
  { id: 'label-macedon', name: 'Macedon', kind: 'territory', coordinates: [22.3, 40.9] },
  { id: 'label-hellas', name: 'Hellas', kind: 'region', coordinates: [21.5, 38.5] },
  { id: 'label-anatolia', name: 'Anatolia', kind: 'region', coordinates: [29.2, 38.5] },
  { id: 'label-phoenicia', name: 'Phoenicia', kind: 'region', coordinates: [35.2, 33.7] },
  { id: 'label-egypt', name: 'Egypt', kind: 'territory', coordinates: [30.9, 30.9] },
  { id: 'label-mesopotamia', name: 'Mesopotamia', kind: 'region', coordinates: [43.0, 34.3] },
  { id: 'label-persis', name: 'Persis', kind: 'territory', coordinates: [52.5, 30.2] },
  { id: 'label-bactria', name: 'Bactria', kind: 'territory', coordinates: [66.0, 36.5] },
  { id: 'label-indus', name: 'Indus Valley', kind: 'region', coordinates: [72.2, 30.5] },
  { id: 'label-tyre', name: 'Tyre', kind: 'city', coordinates: [35.2, 33.3] },
  { id: 'label-alexandria', name: 'Alexandria', kind: 'city', coordinates: [29.91, 31.2] },
  { id: 'label-susa', name: 'Susa', kind: 'city', coordinates: [48.3, 32.9] },
  { id: 'label-persepolis', name: 'Persepolis', kind: 'city', coordinates: [53.1, 29.94] },
  { id: 'label-ecbatana', name: 'Ecbatana', kind: 'city', coordinates: [48.5, 34.8] },
  { id: 'label-maracanda', name: 'Maracanda', kind: 'city', coordinates: [66.97, 39.63] },
  { id: 'label-bucephala', name: 'Bucephala', kind: 'city', coordinates: [73.7, 32.95] },
  { id: 'label-opis', name: 'Opis', kind: 'city', coordinates: [44.4, 33.7] },
  { id: 'label-babylon', name: 'Babylon', kind: 'city', coordinates: [44.4, 32.5] }
];
const segments: RouteSegment[] = [
  {
    id: 'seg-pella-hellespont',
    trackId: alexanderTrack.id,
    fromWaypointId: 'wp-pella',
    toWaypointId: 'wp-hellespont',
    geometry: createLineString([
      [22.524, 40.758],
      [23.8, 40.6],
      [25.1, 40.4],
      [26.4, 40.2]
    ]),
    transportMode: 'horse',
    estDurationMinutes: 28800
  },
  {
    id: 'seg-hellespont-granicus',
    trackId: alexanderTrack.id,
    fromWaypointId: 'wp-hellespont',
    toWaypointId: 'wp-granicus',
    geometry: createLineString([
      [26.4, 40.2],
      [26.9, 40.3],
      [27.033, 40.444]
    ]),
    transportMode: 'horse',
    estDurationMinutes: 14400
  },
  {
    id: 'seg-granicus-halicarnassus',
    trackId: alexanderTrack.id,
    fromWaypointId: 'wp-granicus',
    toWaypointId: 'wp-halicarnassus',
    geometry: createLineString([
      [27.033, 40.444],
      [27.8, 39.5],
      [27.4, 38.4],
      [27.43, 37.037]
    ]),
    transportMode: 'horse',
    estDurationMinutes: 129600
  },
  {
    id: 'seg-halicarnassus-gordium',
    trackId: alexanderTrack.id,
    fromWaypointId: 'wp-halicarnassus',
    toWaypointId: 'wp-gordium',
    geometry: createLineString([
      [27.43, 37.037],
      [29.0, 37.2],
      [30.5, 37.6],
      [31.99, 37.511]
    ]),
    transportMode: 'horse',
    estDurationMinutes: 172800
  },
  {
    id: 'seg-gordium-issus',
    trackId: alexanderTrack.id,
    fromWaypointId: 'wp-gordium',
    toWaypointId: 'wp-issus',
    geometry: createLineString([
      [31.99, 37.511],
      [33.5, 37.2],
      [34.8, 36.9],
      [35.9807, 36.587]
    ]),
    transportMode: 'horse',
    estDurationMinutes: 144000
  },
  {
    id: 'seg-issus-tyre',
    trackId: alexanderTrack.id,
    fromWaypointId: 'wp-issus',
    toWaypointId: 'wp-tyre',
    geometry: createLineString([
      [35.9807, 36.587],
      [35.6, 35.8],
      [35.3, 34.8],
      [35.195, 33.27]
    ]),
    transportMode: 'horse',
    estDurationMinutes: 345600
  },
  {
    id: 'seg-tyre-gaza',
    trackId: alexanderTrack.id,
    fromWaypointId: 'wp-tyre',
    toWaypointId: 'wp-gaza',
    geometry: createLineString([
      [35.195, 33.27],
      [34.9, 32.4],
      [34.301, 31.5]
    ]),
    transportMode: 'horse',
    estDurationMinutes: 129600
  },
  {
    id: 'seg-gaza-alexandria',
    trackId: alexanderTrack.id,
    fromWaypointId: 'wp-gaza',
    toWaypointId: 'wp-alexandria',
    geometry: createLineString([
      [34.301, 31.5],
      [32.4, 31.1],
      [30.5, 31.1],
      [29.9187, 31.2001]
    ]),
    transportMode: 'horse',
    estDurationMinutes: 86400
  },
  {
    id: 'seg-alexandria-siwa',
    trackId: alexanderTrack.id,
    fromWaypointId: 'wp-alexandria',
    toWaypointId: 'wp-siwa',
    geometry: createLineString([
      [29.9187, 31.2001],
      [28.4, 30.3],
      [26.8, 29.6],
      [25.52, 29.2]
    ]),
    transportMode: 'foot',
    estDurationMinutes: 64800
  },
  {
    id: 'seg-siwa-gaugamela',
    trackId: alexanderTrack.id,
    fromWaypointId: 'wp-siwa',
    toWaypointId: 'wp-gaugamela',
    geometry: createLineString([
      [25.52, 29.2],
      [30.0, 32.5],
      [35.0, 33.4],
      [39.5, 34.6],
      [43.2505, 36.3636]
    ]),
    transportMode: 'horse',
    estDurationMinutes: 432000
  },
  {
    id: 'seg-gaugamela-babylon',
    trackId: alexanderTrack.id,
    fromWaypointId: 'wp-gaugamela',
    toWaypointId: 'wp-babylon',
    geometry: createLineString([
      [43.2505, 36.3636],
      [43.9, 35.0],
      [44.42, 32.538]
    ]),
    transportMode: 'horse',
    estDurationMinutes: 28800
  },
  {
    id: 'seg-babylon-susa',
    trackId: alexanderTrack.id,
    fromWaypointId: 'wp-babylon',
    toWaypointId: 'wp-susa',
    geometry: createLineString([
      [44.42, 32.538],
      [46.0, 33.2],
      [48.257, 32.941]
    ]),
    transportMode: 'horse',
    estDurationMinutes: 86400
  },
  {
    id: 'seg-susa-persepolis',
    trackId: alexanderTrack.id,
    fromWaypointId: 'wp-susa',
    toWaypointId: 'wp-persepolis',
    geometry: createLineString([
      [48.257, 32.941],
      [50.5, 31.5],
      [53.086, 29.934]
    ]),
    transportMode: 'horse',
    estDurationMinutes: 129600
  },
  {
    id: 'seg-persepolis-ecbatana',
    trackId: alexanderTrack.id,
    fromWaypointId: 'wp-persepolis',
    toWaypointId: 'wp-ecbatana',
    geometry: createLineString([
      [53.086, 29.934],
      [51.2, 32.5],
      [49.4, 33.8],
      [48.516, 34.806]
    ]),
    transportMode: 'horse',
    estDurationMinutes: 216000
  },
  {
    id: 'seg-ecbatana-maracanda',
    trackId: alexanderTrack.id,
    fromWaypointId: 'wp-ecbatana',
    toWaypointId: 'wp-maracanda',
    geometry: createLineString([
      [48.516, 34.806],
      [54.2, 36.8],
      [60.5, 38.2],
      [66.972, 39.627]
    ]),
    transportMode: 'horse',
    estDurationMinutes: 345600
  },
  {
    id: 'seg-maracanda-bucephala',
    trackId: alexanderTrack.id,
    fromWaypointId: 'wp-maracanda',
    toWaypointId: 'wp-bucephala',
    geometry: createLineString([
      [66.972, 39.627],
      [70.0, 37.5],
      [72.5, 34.5],
      [73.7, 32.9]
    ]),
    transportMode: 'horse',
    estDurationMinutes: 432000
  },
  {
    id: 'seg-bucephala-hyphasis',
    trackId: alexanderTrack.id,
    fromWaypointId: 'wp-bucephala',
    toWaypointId: 'wp-hyphasis',
    geometry: createLineString([
      [73.7, 32.9],
      [74.3, 32.3],
      [75.1, 31.45]
    ]),
    transportMode: 'foot',
    estDurationMinutes: 43200
  },
  {
    id: 'seg-hyphasis-gedrosia',
    trackId: alexanderTrack.id,
    fromWaypointId: 'wp-hyphasis',
    toWaypointId: 'wp-gedrosia',
    geometry: createLineString([
      [75.1, 31.45],
      [72.0, 29.0],
      [68.0, 27.5],
      [64.0, 26.0]
    ]),
    transportMode: 'foot',
    estDurationMinutes: 345600
  },
  {
    id: 'seg-gedrosia-susa-weddings',
    trackId: alexanderTrack.id,
    fromWaypointId: 'wp-gedrosia',
    toWaypointId: 'wp-susa-weddings',
    geometry: createLineString([
      [64.0, 26.0],
      [58.0, 28.0],
      [52.0, 30.0],
      [48.25, 32.93]
    ]),
    transportMode: 'horse',
    estDurationMinutes: 302400
  },
  {
    id: 'seg-susa-weddings-opis',
    trackId: alexanderTrack.id,
    fromWaypointId: 'wp-susa-weddings',
    toWaypointId: 'wp-opis',
    geometry: createLineString([
      [48.25, 32.93],
      [46.0, 33.2],
      [44.4, 33.7]
    ]),
    transportMode: 'horse',
    estDurationMinutes: 43200
  },
  {
    id: 'seg-opis-babylon',
    trackId: alexanderTrack.id,
    fromWaypointId: 'wp-opis',
    toWaypointId: 'wp-babylon-finale',
    geometry: createLineString([
      [44.4, 33.7],
      [44.5, 33.1],
      [44.42, 32.54]
    ]),
    transportMode: 'horse',
    estDurationMinutes: 21600
  },
  {
    id: 'seg-parmenion-support',
    trackId: parmenionTrack.id,
    fromWaypointId: 'wp-parmenion-granicus',
    toWaypointId: 'wp-parmenion-issus',
    geometry: createLineString([
      [27.02, 40.45],
      [28.2, 39.5],
      [31.0, 37.6],
      [35.98, 36.6]
    ]),
    transportMode: 'horse'
  },
  {
    id: 'seg-darius-retreat',
    trackId: dariusTrack.id,
    fromWaypointId: 'wp-darius-issus',
    toWaypointId: 'wp-darius-gaugamela',
    geometry: createLineString([
      [36.05, 36.6],
      [38.5, 36.5],
      [41.2, 36.6],
      [43.3, 36.37]
    ]),
    transportMode: 'horse'
  },
  {
    id: 'seg-nearchus-fleet',
    trackId: nearchusTrack.id,
    fromWaypointId: 'wp-nearchus-tyre',
    toWaypointId: 'wp-nearchus-babylon',
    geometry: createLineString([
      [35.19, 33.27],
      [34.0, 32.0],
      [32.0, 31.0],
      [34.5, 30.5],
      [44.42, 32.538]
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
      id: 'event-halicarnassus',
      name: 'Siege of Halicarnassus',
      kind: 'siege',
      occurredOn: '0334-11-01',
      area: {
        type: 'Polygon',
        coordinates: [
          [
            [27.35, 37.12],
            [27.52, 37.12],
            [27.52, 36.96],
            [27.35, 36.96],
            [27.35, 37.12]
          ]
        ]
      },
      summary: 'Macedonian siegecraft reduces the Persian naval base at Halicarnassus.',
      sourceCitation: 'Arrian, *Anabasis* 1.21-23'
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
      id: 'event-gaza',
      name: 'Siege of Gaza',
      kind: 'siege',
      occurredOn: '0332-10-01',
      area: {
        type: 'Polygon',
        coordinates: [
          [
            [34.24, 31.58],
            [34.36, 31.58],
            [34.36, 31.44],
            [34.24, 31.44],
            [34.24, 31.58]
          ]
        ]
      },
      summary: 'Alexander captures Gaza after repeated assaults, clearing the way to Egypt.',
      sourceCitation: 'Curtius Rufus 4.6'
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
    },
    {
      id: 'event-hydaspes',
      name: 'Battle of the Hydaspes',
      kind: 'battle',
      occurredOn: '0326-05-01',
      area: {
        type: 'Polygon',
        coordinates: [
          [
            [73.60, 33.05],
            [73.84, 33.05],
            [73.84, 32.75],
            [73.60, 32.75],
            [73.60, 33.05]
          ]
        ]
      },
      summary: 'Alexander defeats Porus on the Hydaspes River and founds Bucephala.',
      sourceCitation: 'Arrian, *Anabasis* 5.8-19'
    },
    {
      id: 'event-opis',
      name: 'Mutiny at Opis',
      kind: 'treaty',
      occurredOn: '0324-09-01',
      area: {
        type: 'Polygon',
        coordinates: [
          [
            [44.32, 33.80],
            [44.48, 33.80],
            [44.48, 33.60],
            [44.32, 33.60],
            [44.32, 33.80]
          ]
        ]
      },
      summary: 'Alexander reconciles with his troops and integrates Persian contingents at Opis.',
      sourceCitation: 'Arrian, *Anabasis* 7.8-12'
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
  const fallback =
    dataset.territoryTimeline.length > 0
      ? dataset.territoryTimeline[dataset.territoryTimeline.length - 1]
      : undefined;
  if (!fallback) {
    return { waypointId, description: '', territories: [] };
  }
  return createSnapshot(waypointId, fallback.territories, fallback.description ?? '');
};

export const getLifeTimeline = (): LifeEvent[] => dataset.lifeTimeline;
