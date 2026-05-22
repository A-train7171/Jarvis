export type MockLocation = {
  id: string;
  title: string;
  film: string;
  neighborhood: string;
  distanceMeters: number;
  points: number;
  checkedIn: boolean;
  scene: string;
};

export type MockBadge = {
  id: string;
  name: string;
  icon: string;
  earned: boolean;
  progress?: number;
  description: string;
  requirement: string;
};

export type MockBanner = {
  id: string;
  title: string;
  subtitle: string;
  locked: boolean;
  levelRequired?: number;
};

export const mockLocations: MockLocation[] = [
  {
    id: "griffith",
    title: "Griffith Observatory",
    film: "La La Land",
    neighborhood: "Los Feliz",
    distanceMeters: 420,
    points: 50,
    checkedIn: false,
    scene: "Mia and Sebastian dance through the planetarium at golden hour.",
  },
  {
    id: "bradbury",
    title: "Bradbury Building",
    film: "Blade Runner",
    neighborhood: "Downtown LA",
    distanceMeters: 1800,
    points: 75,
    checkedIn: true,
    scene: "Deckard climbs the iron lattice staircase to find J.F. Sebastian.",
  },
  {
    id: "union-station",
    title: "Union Station",
    film: "The Dark Knight Rises",
    neighborhood: "Downtown LA",
    distanceMeters: 2400,
    points: 60,
    checkedIn: false,
    scene: "Bruce Wayne arrives back in Gotham — exterior was filmed here.",
  },
  {
    id: "rialto",
    title: "Rialto Theatre",
    film: "The Player",
    neighborhood: "South Pasadena",
    distanceMeters: 8200,
    points: 100,
    checkedIn: false,
    scene: "Griffin Mill watches The Bicycle Thief in the closing sequence.",
  },
];

export const mockBadges: MockBadge[] = [
  {
    id: "first-spot",
    name: "First Spot",
    icon: "🎬",
    earned: true,
    description: "Welcome to the scouts.",
    requirement: "Check in to your first filming location.",
  },
  {
    id: "noir-nights",
    name: "Noir Nights",
    icon: "🕵️",
    earned: false,
    progress: 40,
    description: "Crack the shadow-lit corners of the city.",
    requirement: "Check in to 5 noir-era locations after sundown.",
  },
  {
    id: "musical-mile",
    name: "Musical Mile",
    icon: "🎷",
    earned: false,
    progress: 75,
    description: "Follow the soundtrack across the map.",
    requirement: "Check in to 3 musical locations in a single day.",
  },
  {
    id: "director-cut",
    name: "Director's Cut",
    icon: "🎞️",
    earned: false,
    progress: 10,
    description: "For the truly obsessive.",
    requirement: "Check in to every location in a single film.",
  },
  {
    id: "sunrise",
    name: "Sunrise Scout",
    icon: "🌅",
    earned: true,
    description: "First on set.",
    requirement: "Check in before 7am, three days running.",
  },
  {
    id: "city-of-stars",
    name: "City of Stars",
    icon: "⭐",
    earned: false,
    progress: 60,
    description: "All of LA, all of the time.",
    requirement: "Check in across 10 distinct LA neighborhoods.",
  },
];

export const mockBanners: MockBanner[] = [
  {
    id: "scout",
    title: "Set Scout",
    subtitle: "Default banner. You're just getting started.",
    locked: false,
  },
  {
    id: "director-cut-banner",
    title: "Director's Cut",
    subtitle: "Earned by completing every location in a single film.",
    locked: true,
    levelRequired: 8,
  },
  {
    id: "golden-hour",
    title: "Golden Hour",
    subtitle: "For scouts who chase the magic light.",
    locked: true,
    levelRequired: 10,
  },
];

export const mockPlayer = {
  displayName: "Reese",
  handle: "@reese",
  level: 4,
  points: 1820,
  pointsToNextLevel: 2000,
  streakDays: 7,
  spotsVisited: 12,
  badgesEarned: 2,
  avatar: "🕶️",
};

export const avatarOptions = ["🎬", "🎥", "🕶️", "🎩", "📽️", "🍿", "🌃", "🌅"];
