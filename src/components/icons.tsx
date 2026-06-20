/** Minimal original line-icon set (stroke-based, no external assets). */
type P = { size?: number; color?: string };
const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.9,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

export const IconHome = ({ size = 22 }: P) => (
  <svg {...base(size)}>
    <path d="M3 11l9-8 9 8" />
    <path d="M5 10v10h14V10" />
  </svg>
);
export const IconNutrition = ({ size = 22 }: P) => (
  <svg {...base(size)}>
    <path d="M12 3c4 0 7 3 7 8 0 6-4 10-7 10S5 17 5 11c0-5 3-8 7-8z" />
    <path d="M12 3v8" />
  </svg>
);
export const IconDumbbell = ({ size = 22 }: P) => (
  <svg {...base(size)}>
    <path d="M6.5 8v8M3.5 9.5v5M17.5 8v8M20.5 9.5v5M6.5 12h11" />
  </svg>
);
export const IconCoach = ({ size = 22 }: P) => (
  <svg {...base(size)}>
    <path d="M4 5h16v11H8l-4 4z" />
    <path d="M8 9h8M8 12h5" />
  </svg>
);
export const IconCalendar = ({ size = 22 }: P) => (
  <svg {...base(size)}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 9h18M8 3v4M16 3v4" />
  </svg>
);
export const IconCamera = ({ size = 22 }: P) => (
  <svg {...base(size)}>
    <path d="M3 8h4l2-2h6l2 2h4v11H3z" />
    <circle cx="12" cy="13" r="3.4" />
  </svg>
);
export const IconWatch = ({ size = 22 }: P) => (
  <svg {...base(size)}>
    <rect x="7" y="7" width="10" height="10" rx="3" />
    <path d="M9 7l.5-3h5l.5 3M9 17l.5 3h5l.5-3M12 11v2.5l1.5 1" />
  </svg>
);
export const IconFeed = ({ size = 22 }: P) => (
  <svg {...base(size)}>
    <circle cx="6" cy="18" r="2" />
    <path d="M4 4a16 16 0 0116 16M4 11a9 9 0 019 9" />
  </svg>
);
export const IconInfo = ({ size = 22 }: P) => (
  <svg {...base(size)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5M12 8h.01" />
  </svg>
);
export const IconChevron = ({ size = 20 }: P) => (
  <svg {...base(size)}>
    <path d="M9 6l6 6-6 6" />
  </svg>
);
export const IconCheck = ({ size = 18 }: P) => (
  <svg {...base(size)}>
    <path d="M4 12l5 5L20 6" />
  </svg>
);
export const IconFlame = ({ size = 22 }: P) => (
  <svg {...base(size)}>
    <path d="M12 3c1 3-1 4-2 6s0 4 2 4 3-2 2-4c2 1 3 3 3 5a5 5 0 11-10 0c0-4 3-6 5-11z" />
  </svg>
);
export const IconPlus = ({ size = 20 }: P) => (
  <svg {...base(size)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);
export const IconTrash = ({ size = 18 }: P) => (
  <svg {...base(size)}>
    <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" />
  </svg>
);
export const IconShare = ({ size = 22 }: P) => (
  <svg {...base(size)}>
    <circle cx="6" cy="12" r="2.5" />
    <circle cx="18" cy="6" r="2.5" />
    <circle cx="18" cy="18" r="2.5" />
    <path d="M8.2 10.8l7.6-3.6M8.2 13.2l7.6 3.6" />
  </svg>
);
export const IconFlip = ({ size = 20 }: P) => (
  <svg {...base(size)}>
    <path d="M4 8a8 8 0 0114-4M20 16a8 8 0 01-14 4" />
    <path d="M18 3v4h-4M6 21v-4h4" />
  </svg>
);
