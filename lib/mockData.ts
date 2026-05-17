import type { Scene } from "@/types";

export const scenes: Scene[] = [
  {
    id: "shawshank-oakwood",
    title: "Oak of Hope",
    movie: "The Shawshank Redemption",
    year: 1994,
    director: "Frank Darabont",
    coordinates: [-82.4537, 40.6189],
    city: "Lucas, Ohio",
    country: "United States",
    imageUrl:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80",
    description:
      "The hayfield where Red finds Andy's letter and a tin box buried beneath a sprawling oak tree.",
    rarity: "legendary",
    xp: 800,
    captureRadiusMeters: 120,
  },
  {
    id: "dark-knight-lasalle",
    title: "Lower Wacker Chase",
    movie: "The Dark Knight",
    year: 2008,
    director: "Christopher Nolan",
    coordinates: [-87.6332, 41.8853],
    city: "Chicago, IL",
    country: "United States",
    imageUrl:
      "https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=1200&q=80",
    description:
      "The subterranean streets that doubled as Gotham during the Batpod's iconic chase sequence.",
    rarity: "epic",
    xp: 500,
    captureRadiusMeters: 80,
  },
  {
    id: "inception-bir-hakeim",
    title: "Folded Boulevard",
    movie: "Inception",
    year: 2010,
    director: "Christopher Nolan",
    coordinates: [2.2861, 48.8551],
    city: "Paris",
    country: "France",
    imageUrl:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=80",
    description:
      "Pont de Bir-Hakeim — where Cobb teaches Ariadne the rules of the dream and reality folds in on itself.",
    rarity: "legendary",
    xp: 750,
    captureRadiusMeters: 60,
  },
  {
    id: "skyfall-glencoe",
    title: "Skyfall Pass",
    movie: "Skyfall",
    year: 2012,
    director: "Sam Mendes",
    coordinates: [-4.9831, 56.6743],
    city: "Glencoe",
    country: "Scotland",
    imageUrl:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
    description:
      "The Highland glen Bond drives through with M on his way to the family estate.",
    rarity: "epic",
    xp: 550,
    captureRadiusMeters: 300,
  },
  {
    id: "lotr-hobbiton",
    title: "Hobbiton Set",
    movie: "The Lord of the Rings: The Fellowship of the Ring",
    year: 2001,
    director: "Peter Jackson",
    coordinates: [175.6815, -37.8722],
    city: "Matamata",
    country: "New Zealand",
    imageUrl:
      "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=1200&q=80",
    description:
      "The Shire — 44 permanent hobbit holes nestled in the rolling Waikato countryside.",
    rarity: "legendary",
    xp: 900,
    captureRadiusMeters: 200,
  },
  {
    id: "lalaland-griffith",
    title: "Planetarium Waltz",
    movie: "La La Land",
    year: 2016,
    director: "Damien Chazelle",
    coordinates: [-118.3004, 34.1184],
    city: "Los Angeles, CA",
    country: "United States",
    imageUrl:
      "https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=1200&q=80",
    description:
      "Griffith Observatory — where Mia and Sebastian dance among the stars.",
    rarity: "rare",
    xp: 350,
    captureRadiusMeters: 100,
  },
  {
    id: "harry-potter-alnwick",
    title: "Broom Lessons",
    movie: "Harry Potter and the Philosopher's Stone",
    year: 2001,
    director: "Chris Columbus",
    coordinates: [-1.7060, 55.4156],
    city: "Alnwick",
    country: "United Kingdom",
    imageUrl:
      "https://images.unsplash.com/photo-1599619351208-3e6c839d6828?w=1200&q=80",
    description:
      "Alnwick Castle — first-year Gryffindors learning to fly on the outer bailey.",
    rarity: "epic",
    xp: 600,
    captureRadiusMeters: 150,
  },
  {
    id: "the-beach-maya",
    title: "Maya Bay",
    movie: "The Beach",
    year: 2000,
    director: "Danny Boyle",
    coordinates: [98.7711, 7.6781],
    city: "Ko Phi Phi Le",
    country: "Thailand",
    imageUrl:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80",
    description:
      "Limestone cliffs guarding the hidden lagoon Leonardo DiCaprio's character chases.",
    rarity: "rare",
    xp: 400,
    captureRadiusMeters: 250,
  },
  {
    id: "lost-translation-park-hyatt",
    title: "Park Hyatt Bar",
    movie: "Lost in Translation",
    year: 2003,
    director: "Sofia Coppola",
    coordinates: [139.6920, 35.6855],
    city: "Tokyo",
    country: "Japan",
    imageUrl:
      "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=1200&q=80",
    description:
      "The 52nd-floor New York Bar where Bob and Charlotte first share a drink.",
    rarity: "rare",
    xp: 380,
    captureRadiusMeters: 50,
  },
  {
    id: "forrest-chippewa",
    title: "Chippewa Bench",
    movie: "Forrest Gump",
    year: 1994,
    director: "Robert Zemeckis",
    coordinates: [-81.0934, 32.0772],
    city: "Savannah, GA",
    country: "United States",
    imageUrl:
      "https://images.unsplash.com/photo-1568454537842-d933259bb1ce?w=1200&q=80",
    description:
      "Chippewa Square — life is like a box of chocolates, told from a bus stop bench.",
    rarity: "common",
    xp: 220,
    captureRadiusMeters: 80,
  },
  {
    id: "godfather-savoca",
    title: "Bar Vitelli",
    movie: "The Godfather",
    year: 1972,
    director: "Francis Ford Coppola",
    coordinates: [15.3625, 37.8113],
    city: "Savoca, Sicily",
    country: "Italy",
    imageUrl:
      "https://images.unsplash.com/photo-1533777324565-a040eb52facd?w=1200&q=80",
    description:
      "Michael Corleone's Sicilian exile — where he meets Apollonia for the first time.",
    rarity: "epic",
    xp: 620,
    captureRadiusMeters: 60,
  },
  {
    id: "notting-portobello",
    title: "Travel Book Co.",
    movie: "Notting Hill",
    year: 1999,
    director: "Roger Michell",
    coordinates: [-0.2058, 51.5152],
    city: "London",
    country: "United Kingdom",
    imageUrl:
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&q=80",
    description:
      "The blue door and bookshop where Will and Anna's story begins on Portobello Road.",
    rarity: "common",
    xp: 240,
    captureRadiusMeters: 40,
  },
];

export function getSceneById(id: string): Scene | undefined {
  return scenes.find((s) => s.id === id);
}
