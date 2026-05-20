// data.jsx — minimal sample data with longer event names
const INITIALS = ["JB", "MA", "RK", "TS", "PD", "LH", "EN", "OW"];
const SAMPLE_EVENTS = [
  { id: "e1", type: "dropin", name: "Thursday Night Round Robin · 3.0–3.5", format: "Doubles", dateShort: "Today", timeShort: "6:30 PM", skill: "3.0–3.5", coach: "Mike Alvarado", priceLabel: "$22", spotsLeft: 6, spotsTotal: 24, when: "today", going: 18, friends: ["JB","MA","RK"], hot: true, club: "Old Coast", clubColor: "#2E5D52", myClub: true },
  { id: "e2", type: "dropin", name: "Sunrise Open Play & Coffee Social", format: "Open play", dateShort: "Today", timeShort: "10:00 AM", skill: "All levels", coach: "Open court", priceLabel: "$8", spotsLeft: 11, spotsTotal: 16, when: "today", going: 5, friends: ["TS"], hot: false, club: "Dill Dinkers", clubColor: "#8E5BE8", myClub: true },
  { id: "e3", type: "series", name: "Dink Lab: Soft Game Fundamentals", format: "Clinic", dateShort: "Today", timeShort: "12:00 PM", skill: "2.5–3.5", coach: "Priya Shah", priceLabel: "$32", spotsLeft: 2, spotsTotal: 8, when: "today", going: 6, friends: ["PD","LH"], hot: true, club: "South St. Augustine", clubColor: "#1F4ED8", myClub: false },
  { id: "e4", type: "hybrid", name: "Thursday Competitive Ladder Night", format: "League", dateShort: "Today", timeShort: "6:30 PM", skill: "3.5–4.0", coach: "Coach Reid", priceLabel: "$18", spotsLeft: 1, spotsTotal: 20, when: "today", going: 19, friends: ["EN","OW","MA","JB"], hot: true, club: "Old Coast", clubColor: "#2E5D52", myClub: true },
  { id: "e5", type: "single", name: "Beginner Welcome Clinic & Paddle Demo", format: "Clinic", dateShort: "Sat May 9", timeShort: "9:00 AM", skill: "1.0–2.5", coach: "Jamie O'Connell", priceLabel: "Free", spotsLeft: 7, spotsTotal: 12, when: "week", going: 5, friends: [], hot: false, club: "Wrightsville Courts", clubColor: "#1F4ED8", myClub: false },
  { id: "e6", type: "dropin", name: "DUPR-Rated Match Play Saturday", format: "Rated", dateShort: "Sat May 9", timeShort: "1:00 PM", skill: "3.5+", coach: "Tom Becker", priceLabel: "$28", spotsLeft: 4, spotsTotal: 16, when: "week", going: 12, friends: ["RK","JB"], hot: false, club: "Dill Dinkers", clubColor: "#8E5BE8", myClub: true },
  { id: "e7", type: "hybrid", name: "Sunday Mixed Doubles Round Robin", format: "Round robin", dateShort: "Sun May 10", timeShort: "10:00 AM", skill: "3.0–4.0", coach: "Mike Alvarado", priceLabel: "$20", spotsLeft: 9, spotsTotal: 24, when: "week", going: 15, friends: ["MA"], hot: false, club: "Cape Valley Club", clubColor: "#D6573B", myClub: false },
  { id: "e8", type: "single", name: "Old Coast Spring Championship Bracket", format: "Bracket", dateShort: "Sat May 16", timeShort: "8:00 AM", skill: "By bracket", coach: "Coach Reid", priceLabel: "$45", spotsLeft: 18, spotsTotal: 64, when: "next", going: 46, friends: ["JB","TS","PD"], hot: true, badge: "Featured", club: "Old Coast", clubColor: "#2E5D52", myClub: true },
];
const HERO_EVENT = {
  id: "hero", name: "Thursday Competitive Ladder Night", format: "League · Doubles", dateShort: "Tonight", timeShort: "6:30 PM",
  skill: "3.5 – 4.0", coach: "Coach Reid", priceLabel: "$18", spotsLeft: 1, spotsTotal: 20,
  going: 19, friends: ["EN","OW","MA","JB"], court: "Court 3 · Old Coast",
};
// ---- Detail page data ----
// One canonical event with content for all four registration types.
// The detail page picks fields based on the selected `type`.
const DETAIL_EVENT = {
  id: "ev-detail",
  name: "Intermediate Strategies with Coach Ray",
  sport: "Pickleball",
  surface: "Indoor",
  openSpots: 14,
  totalSpots: 16,
  schedule: [
    { days: "Mon, Wed, Fri", time: "6:00 – 7:00 AM" },
    { days: "Tue, Thu",       time: "6:00 – 7:00 PM" },
  ],
  courts: ["Osprey Court · hard", "Osprey Court · green grass"],
  requirements: [
    { icon: "Star",   text: "3.0 – 3.5 DUPR rating" },
    { icon: "Star",   text: "3.0 – 3.5 Self rating" },
    { icon: "Star",   text: "3.0 – 3.5 Club rating" },
    { icon: "Users",  text: "Male only" },
    { icon: "Lock",   text: "Members & Groups only" },
    { icon: "Clock4", text: "Ages 15 – 20" },
  ],
  about:
    "Sharpen your game with structured sessions. Covers soft game fundamentals, third-shot drops, and transition zone control. Each week builds on the previous session, so consistent attendance is recommended for best results.",
  tags: ["drill", "weekly", "tournament", "openplay", "beginners", "education"],
  instructor: {
    name: "Jonathan Doe",
    rating: "3.5 DUPR",
    experience: "2 yrs Exp",
    avatar: "JD",
  },
  registered: [
    { name: "Neil C.",  rating: "4.0 DUPR Rating", avatar: "NC" },
    { name: "Josh W.",  rating: "4.0 DUPR Rating", avatar: "JW" },
  ],
  note:
    "Palm Court and Osprey Court are scheduled for resurfacing March 10th. Events may be relocated to alternate courts. We'll notify registered players of any changes via email.",
  // Type-specific:
  single: { date: "Sat, Mar 14, 2026", time: "9:00 – 11:00 AM", price: "$15.00" },
  dropIn: {
    pricePerSession: "$15.00",
    dates: [
      { id: "d1", label: "This Week",  sub: "Wed, Mar 4" },
      { id: "d2", label: "Next Week",  sub: "Wed, Mar 11" },
      { id: "d3", label: "in 2 weeks", sub: "Wed, Mar 18" },
      { id: "d4", label: "in 3 weeks", sub: "Wed, Mar 25" },
    ],
  },
  series: {
    totalSessions: 5,
    totalPrice: "$60.00",
    range: "Mar 4 – Apr 2, 2026",
    sessions: [
      { id: "s1", label: "Wednesday, March 4, 2026" },
      { id: "s2", label: "Wednesday, March 11, 2026" },
      { id: "s3", label: "Wednesday, March 18, 2026" },
      { id: "s4", label: "Wednesday, March 25, 2026" },
      { id: "s5", label: "Wednesday, April 2, 2026" },
    ],
    totalActivities: 99,
  },
  hybrid: {
    pricePerSession: "$15.00",
    bundlePrice: "$60.00",
    dates: [
      { id: "h1", label: "Wed, Mar 4",  weekday: "WED", date: "MAR 4" },
      { id: "h2", label: "Wed, Mar 11", weekday: "WED", date: "MAR 11" },
      { id: "h3", label: "Wed, Mar 18", weekday: "WED", date: "MAR 18" },
      { id: "h4", label: "Wed, Mar 25", weekday: "WED", date: "MAR 25" },
      { id: "h5", label: "Wed, Apr 2",  weekday: "WED", date: "APR 2" },
    ],
  },
};

// ---- Recurring (ongoing) events — surfaced as a carousel to avoid repeating
// the same series across every weekly bucket below.
const RECURRING_EVENTS = [
  { id: "r1", type: "series", name: "Intermediate Strategies with Coach Ray", format: "Clinic series", cadence: "Every Wed", timeShort: "6:00 PM", skill: "3.0 – 3.5", coach: "Coach Ray", priceLabel: "$15", spotsLeft: 14, spotsTotal: 16, going: 12, friends: ["JB","MA"], runningSince: "Mar 4", nextSessions: 8 },
  { id: "r2", type: "hybrid", name: "Wednesday Open Play Ladder", format: "Ladder", cadence: "Every Wed", timeShort: "7:30 PM", skill: "3.5 – 4.5", coach: "Coach Reid", priceLabel: "$18", spotsLeft: 4, spotsTotal: 20, going: 16, friends: ["EN","OW","JB"], runningSince: "ongoing", nextSessions: 12 },
  { id: "r3", type: "dropin", name: "Sunrise Drop-In · 3.0+", format: "Drop-in doubles", cadence: "Mon · Wed · Fri", timeShort: "6:30 AM", skill: "3.0+", coach: "Open court", priceLabel: "$8", spotsLeft: 9, spotsTotal: 16, going: 7, friends: ["TS"], runningSince: "ongoing", nextSessions: 24 },
  { id: "r4", type: "series", name: "Beginner Path: Six-Week Fundamentals", format: "Skills series", cadence: "Tuesdays", timeShort: "6:30 PM", skill: "1.0 – 2.5", coach: "Jamie O'Connell", priceLabel: "$120", spotsLeft: 6, spotsTotal: 10, going: 4, friends: [], runningSince: "starts Mar 17", nextSessions: 6 },
  { id: "r5", type: "dropin", name: "Lunch Hour Open Play", format: "Open play", cadence: "Mon – Fri", timeShort: "12:00 PM", skill: "All levels", coach: "Open court", priceLabel: "$6", spotsLeft: 11, spotsTotal: 16, going: 3, friends: [], runningSince: "ongoing", nextSessions: 20 },
  { id: "r6", type: "hybrid", name: "Saturday Doubles Ladder", format: "Ladder", cadence: "Saturdays", timeShort: "9:00 AM", skill: "3.0 – 4.0", coach: "Mike Alvarado", priceLabel: "$20", spotsLeft: 8, spotsTotal: 24, going: 14, friends: ["MA","RK"], runningSince: "ongoing", nextSessions: 10 },
];

// Events further out — revealed when the user scrolls past the regular sections.
const NEXT_MONTH_EVENTS = [
  { id: "n1", type: "single", name: "May Spring Mixer & Paddle Demo Night", format: "Social", dateShort: "Fri May 22", timeShort: "6:00 PM", skill: "All levels", coach: "Old Coast staff", priceLabel: "$12", spotsLeft: 22, spotsTotal: 60, when: "month", going: 28, friends: ["MA","RK"], hot: false, club: "Old Coast", clubColor: "#2E5D52", myClub: true },
  { id: "n2", type: "single", name: "Memorial Day Round Robin Marathon", format: "Round robin", dateShort: "Mon May 26", timeShort: "9:00 AM", skill: "3.0 – 4.0", coach: "Coach Reid", priceLabel: "$35", spotsLeft: 14, spotsTotal: 32, when: "month", going: 18, friends: ["JB","TS","PD"], hot: true, club: "Old Coast", clubColor: "#2E5D52", myClub: true },
  { id: "n3", type: "series", name: "DUPR Boost Camp · 4 Weeks", format: "Clinic series", dateShort: "Starts Jun 2", timeShort: "6:00 PM", skill: "3.0 – 4.0", coach: "Priya Shah", priceLabel: "$160", spotsLeft: 5, spotsTotal: 8, when: "month", going: 3, friends: [], hot: false, club: "South St. Augustine", clubColor: "#1F4ED8", myClub: false },
  { id: "n4", type: "dropin", name: "Friday Night Lights Drop-In", format: "Drop-in", dateShort: "Fri Jun 6", timeShort: "7:30 PM", skill: "3.5+", coach: "Tom Becker", priceLabel: "$22", spotsLeft: 12, spotsTotal: 20, when: "month", going: 6, friends: ["RK"], hot: false, club: "Dill Dinkers", clubColor: "#8E5BE8", myClub: true },
  { id: "n5", type: "hybrid", name: "Summer Ladder · June Session", format: "Ladder", dateShort: "Starts Jun 10", timeShort: "6:30 PM", skill: "3.5 – 4.5", coach: "Coach Reid", priceLabel: "$60", spotsLeft: 9, spotsTotal: 16, when: "month", going: 11, friends: ["EN","OW"], hot: false, club: "Cape Valley Club", clubColor: "#D6573B", myClub: false },
  { id: "n6", type: "single", name: "Father's Day Family Doubles Bracket", format: "Bracket", dateShort: "Sun Jun 15", timeShort: "10:00 AM", skill: "All levels", coach: "Jamie O'Connell", priceLabel: "$30", spotsLeft: 18, spotsTotal: 48, when: "month", going: 9, friends: ["JB"], hot: false, club: "Pinetop Tennis Center", clubColor: "#2E7D32", myClub: false },
];

window.HERO_EVENT = HERO_EVENT;
window.SAMPLE_EVENTS = SAMPLE_EVENTS;
window.RECURRING_EVENTS = RECURRING_EVENTS;
window.NEXT_MONTH_EVENTS = NEXT_MONTH_EVENTS;
window.DETAIL_EVENT = DETAIL_EVENT;
