// Profile.jsx — player profile page + shared settings menu list.
//
// The settings menu list is used in two places:
//   1. Web: a flyout from the avatar in the top chrome bar — opens with
//      a "My Profile" header link that navigates to the profile page,
//      followed by the 9-item settings list.
//   2. Mobile: the gear icon in the top-right of the mobile profile page
//      opens the same list as a full-screen sheet.
//
// The profile page itself is a single layout that renders on both desktop
// (centered, max-width 720) and mobile (full-bleed) — content is the same;
// only outer padding + the chrome around it change.

const { useState: useStateP } = React;

// ---------------------------------------------------------------------------
// SettingsMenu — the 9-item list of account links.
// ---------------------------------------------------------------------------
// Two surfaces share this list — the desktop avatar dropdown (compact:
// icon + label + caret only) and the mobile full-screen settings sheet
// (which still shows the sub-copy for context). `SettingsRow` honours the
// `compact` flag passed down by the parent.
const SETTINGS_ITEMS = [
{ id: "account", icon: "User", label: "My Account", sub: "Email, phone, address, and personal info" },
{ id: "ratings", icon: "Award", label: "My Sport Ratings", sub: "DUPR, NTRP, and club ratings" },
{ id: "equipment", icon: "Swords", label: "My Equipment Locker", sub: "Racquets, paddles, and gear shown on your profile" },
{ id: "family", icon: "Users", label: "My Family", sub: "Linked family members and dependents" },
{ id: "membership", icon: "CreditCard", label: "My Membership", sub: "Old Coast Pickleball · Individual Membership" },
{ id: "billing", icon: "Receipt", label: "Billing & Payments", sub: "Transactions, packages, invoices, payment plans" },
{ id: "comms", icon: "Bell", label: "Communication Preferences", sub: "Push, email, and marketing preferences" },
{ id: "privacy", icon: "Lock", label: "Privacy and Security", sub: "Password, 2FA, and player linking" }];


function SettingsRow({ item, onClick, theme, compact = false }) {
  // Compact = icon + label + caret only. Tighter padding, smaller icon
  // chip, no sub-copy. Used in the desktop avatar dropdown.
  return (
    <button onClick={onClick} style={{
      width: "100%",
      display: "flex", alignItems: "center", gap: compact ? 12 : 14,
      padding: compact ? "10px 8px" : "14px 4px",
      border: 0, background: "transparent",
      cursor: "pointer", fontFamily: "inherit", textAlign: "left",
      borderRadius: 8,
      transition: "background 120ms"
    }}
    onMouseEnter={(e) => {e.currentTarget.style.background = "#F4F5F6";}}
    onMouseLeave={(e) => {e.currentTarget.style.background = "transparent";}}>
      <span style={{
        width: compact ? 32 : 44, height: compact ? 32 : 44, borderRadius: compact ? 8 : 10, flexShrink: 0,
        background: compact ? "transparent" : "#F4F5F6",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        color: "#0F1214"
      }}>
        <Icon name={item.icon} size={compact ? 16 : 20} strokeWidth={1.8} color="#0F1214" />
      </span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: "block", fontFamily: "inherit", fontWeight: compact ? 600 : 700, fontSize: compact ? 13 : 14, color: "#0F1214", lineHeight: "18px" }}>{item.label}</span>
        {!compact &&
        <span style={{ display: "block", fontSize: 12, color: "#858F8F", fontWeight: 500, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.sub}</span>
        }
      </span>
      <Icon name="ChevronRight" size={14} strokeWidth={1.8} color="#BBBFC1" />
    </button>);

}

// Reusable list — renders rows + a divider + Log Out at the bottom.
// `compact` strips sub-copy and tightens vertical rhythm (used by the
// desktop avatar dropdown). `showProfileLink` adds a header row that
// jumps to the profile page.
function SettingsList({ theme, onItemClick, onLogout, onViewProfile, showProfileLink = false, compact = false }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {showProfileLink &&
      <button onClick={onViewProfile} style={{
        width: "100%",
        display: "flex", alignItems: "center", gap: compact ? 12 : 14,
        padding: compact ? "10px 8px" : "14px 4px",
        border: 0, background: "transparent",
        cursor: "pointer", fontFamily: "inherit", textAlign: "left",
        borderRadius: 8,
        borderBottom: "1px solid #E9EBEC", marginBottom: 4,
        transition: "background 120ms"
      }}
      onMouseEnter={(e) => {e.currentTarget.style.background = "#F4F5F6";}}
      onMouseLeave={(e) => {e.currentTarget.style.background = "transparent";}}>
          <span style={{
          width: compact ? 32 : 44, height: compact ? 32 : 44, borderRadius: 999, flexShrink: 0,
          background: theme.primary, color: "#fff",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          fontFamily: theme.display, fontWeight: 800, fontSize: compact ? 11 : 14
        }}>NC</span>
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: "block", fontFamily: theme.display, fontWeight: 800, fontSize: compact ? 14 : 15, color: "#0F1214", letterSpacing: -0.2 }}>My profile</span>
            {!compact &&
          <span style={{ display: "block", fontSize: 12, color: theme.primary, fontWeight: 600, marginTop: 2 }}>View profile →</span>
          }
          </span>
          <Icon name="ChevronRight" size={14} strokeWidth={1.8} color={compact ? "#BBBFC1" : theme.primary} />
        </button>
      }
      {SETTINGS_ITEMS.map((item) =>
      <SettingsRow key={item.id} item={item} theme={theme} compact={compact} onClick={() => onItemClick && onItemClick(item.id)} />
      )}
      {/* Log Out — visually distinct row in red. */}
      <div style={{ borderTop: "1px solid #E9EBEC", marginTop: compact ? 4 : 8, paddingTop: compact ? 4 : 8 }}>
        <button onClick={onLogout} style={{
          width: "100%",
          display: "flex", alignItems: "center", gap: compact ? 12 : 14,
          padding: compact ? "10px 8px" : "14px 4px",
          border: 0, background: "transparent",
          cursor: "pointer", fontFamily: "inherit", textAlign: "left",
          borderRadius: 8,
          transition: "background 120ms"
        }}
        onMouseEnter={(e) => {e.currentTarget.style.background = "#FDEDED";}}
        onMouseLeave={(e) => {e.currentTarget.style.background = "transparent";}}>
          <span style={{
            width: compact ? 32 : 44, height: compact ? 32 : 44, borderRadius: compact ? 8 : 10, flexShrink: 0,
            background: compact ? "transparent" : "#FDEDED",
            display: "inline-flex", alignItems: "center", justifyContent: "center"
          }}>
            <Icon name="LogOut" size={compact ? 16 : 20} strokeWidth={1.8} color="#E11D2A" />
          </span>
          <span style={{ flex: 1, fontFamily: "inherit", fontWeight: compact ? 600 : 700, fontSize: compact ? 13 : 14, color: "#E11D2A" }}>Log Out</span>
        </button>
      </div>
    </div>);

}

// Web — avatar-anchored dropdown.
function ProfileDropdown({ theme, onViewProfile, onClose, onLogout }) {
  React.useEffect(() => {
    const onKey = (e) => {if (e.key === "Escape") onClose();};
    const onDoc = (e) => {
      // Close on outside click; we use a sentinel data attribute.
      if (!e.target.closest("[data-profile-dropdown]") && !e.target.closest("[data-profile-trigger]")) onClose();
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDoc);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDoc);
    };
  }, [onClose]);
  return (
    <div data-profile-dropdown style={{
      position: "absolute", top: "calc(100% + 8px)", right: 0, zIndex: 100,
      width: 280, maxHeight: "calc(100vh - 120px)",
      background: "#fff", borderRadius: 8,
      border: "1px solid #E9EBEC",
      boxShadow: "0 16px 40px rgba(15,18,20,.16), 0 2px 8px rgba(15,18,20,.06)",
      padding: 6,
      overflowY: "auto",
      animation: "profileDropdownIn 180ms cubic-bezier(.2,.8,.2,1)"
    }}>
      <style>{`
        @keyframes profileDropdownIn {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <SettingsList theme={theme} showProfileLink={true} compact={true}
      onViewProfile={() => {onClose();onViewProfile && onViewProfile();}}
      onItemClick={(id) => {
        onClose();
        // Equipment locker + Privacy & Security each have dedicated
        // pages; the rest are still wired through onViewProfile. Route
        // these through globals so the dropdown / sheet stay decoupled
        // from the screen router.
        if (id === "equipment" && window.__navigateEquipmentLocker) {window.__navigateEquipmentLocker();return;}
        if (id === "privacy" && window.__navigatePrivacySecurity) {window.__navigatePrivacySecurity();return;}
        onViewProfile && onViewProfile(id);
      }}
      onLogout={onLogout} />
    </div>);

}

// Mobile — full-screen settings sheet.
function SettingsSheet({ theme, onClose, onItemClick, onLogout }) {
  React.useEffect(() => {
    const onKey = (e) => {if (e.key === "Escape") onClose();};
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 200,
      background: "#fff",
      display: "flex", flexDirection: "column",
      animation: "settingsSheetIn 200ms ease-out"
    }}>
      <style>{`@keyframes settingsSheetIn { from { opacity: 0 } to { opacity: 1 } }`}</style>
      <div style={{
        padding: "16px 16px 12px",
        display: "flex", alignItems: "center", gap: 12,
        borderBottom: "1px solid #E9EBEC",
        flexShrink: 0
      }}>
        <button onClick={onClose} aria-label="Close" style={{
          width: 32, height: 32, borderRadius: 999,
          background: "transparent", border: 0, cursor: "pointer",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          color: "#0F1214"
        }}>
          <Icon name="X" size={20} strokeWidth={2} color="#0F1214" />
        </button>
        <span style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 22, letterSpacing: -0.4, color: "#0F1214" }}>Settings</span>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 16px 32px" }}>
        <SettingsList theme={theme} onLogout={onLogout}
        onItemClick={(id) => {
          // Forward equipment locker + privacy taps to globals so the
          // mobile sheet closes and navigates to the dedicated page.
          if (id === "equipment" && window.__navigateEquipmentLocker) {
            onClose && onClose();
            window.__navigateEquipmentLocker();
            return;
          }
          if (id === "privacy" && window.__navigatePrivacySecurity) {
            onClose && onClose();
            window.__navigatePrivacySecurity();
            return;
          }
          onItemClick && onItemClick(id);
        }} />
      </div>
    </div>);

}

// ---------------------------------------------------------------------------
// PROFILE PAGE — header, identity card, stats, equipment, activity chart,
// availability heatmap, badges, clubs, friends, privacy footer.
// ---------------------------------------------------------------------------
const PROFILE = {
  name: "Neil Christensen",
  firstName: "Neil",
  lastName: "Christensen",
  pronouns: "he/him",
  handle: "@neilc",
  avatar: "NC",
  location: "St. Augustine area",
  email: "neil.christensen@gmail.com",
  phone: "+1 (904) 555-0142",
  completion: 85,
  sports: ["Tennis", "Pickleball", "Recreational", "Open Play"],
  bio: "1-year CR member finding my game. Mostly weekend tennis and Tuesday-night drills at Old Coast.",
  // Tags applied TO this player by coaches, captains, and other players.
  // Each tag carries an author so we can show "from <name>" for trust.
  tagsFromOthers: [
  { label: "Reliable partner", by: "Mia C.", sport: "PB" },
  { label: "Good Dinker", by: "Coach Reid", sport: "TN" },
  { label: "Coachable", by: "Coach Reid", sport: "TN" },
  { label: "Friendly", by: "Reese T.", sport: "PB" },
  { label: "Punctual", by: "Mia C.", sport: "PB" }],

  // Tags this player applies to themselves (their public profile vibe).
  tagsByMe: [
  "Looking for partners",
  "Drills regular",
  "Weekend warrior",
  "Open to coaching"],

  // Trophy cabinet — tournament wins, league titles, championship runs.
  // Each item carries a place (1st/2nd/Finalist) so the cabinet can
  // visually rank them, plus the event + year for context.
  trophies: [
  { place: 1, event: "St. Augustine Spring Open", bracket: "3.5 Men's Doubles", year: 2025, partner: "Mia C." },
  { place: 2, event: "Old Coast Members' League", bracket: "Tennis 3.5+", year: 2025 },
  { place: 1, event: "Tuesday Night Drills League", bracket: "Pickleball Rec", year: 2024 },
  { place: 3, event: "Anastasia Beach Classic", bracket: "Mixed Doubles", year: 2024, partner: "Reese T." }],

  // Top plays — highlight videos. Each carries the social context the
  // homepage match cards have: opponents (with avatar initials), final
  // score, the venue. Lets the highlight read as "I won this point
  // against these people" instead of just a clip title.
  topPlays: [
  {
    id: "p1", title: "Match-point ace · v Reese T.",
    durationSec: 24, plays: 312, surface: "#E9EBEC",
    score: "11-7, 11-9, 11-6", result: "W", venue: "Old Coast",
    against: [{ i: "RT", c: "#1F4ED8" }]
  },
  {
    id: "p2", title: "Cross-court dig at Old Coast",
    durationSec: 18, plays: 187, surface: "#E4E6E8",
    score: "11-9, 9-11", result: "D", venue: "Old Coast",
    against: [{ i: "MC", c: "#D6573B" }, { i: "PS", c: "#8E5BE8" }]
  },
  {
    id: "p3", title: "Final-game rally · spring open",
    durationSec: 32, plays: 502, surface: "#EDEFF1",
    score: "11-8, 11-6", result: "W", venue: "Anastasia",
    against: [{ i: "TB", c: "#C77700" }, { i: "MA", c: "#1F4ED8" }]
  },
  {
    id: "p4", title: "Drop-shot lob combo",
    durationSec: 12, plays: 96, surface: "#E0E2E5",
    score: "11-3, 11-5", result: "W", venue: "Old Coast",
    against: [{ i: "AR", c: "#1F4ED8" }, { i: "ML", c: "#8E5BE8" }]
  },
  {
    id: "p5", title: "Comeback in the third",
    durationSec: 28, plays: 219, surface: "#E6E8EA",
    score: "9-11, 11-7, 11-9", result: "W", venue: "Dill Dinkers",
    against: [{ i: "TS", c: "#0F1214" }]
  }],

  // Top games — signature match results. Same shape as the homepage's
  // RecentMatchCards (result + W/L/D pill, club tag, when, headline,
  // blurb, score line, DUPR delta, Rate / Rematch actions).
  topGames: [
  {
    id: "tg1", result: "W", score: "11-7, 11-9, 11-6",
    club: "oc", clubName: "Old Coast Pickleball",
    when: "May 4, 2026", duprDelta: 0.12,
    partner: "Mia C.", opponent: "Reese T.",
    kind: "Spring Open · Finals",
    headline: "Took the spring open in three",
    blurb: "Closed out the third set after dropping Reese's reset game. Best run yet.",
    rated: true
  },
  {
    id: "tg2", result: "W", score: "6-4, 6-3",
    club: "at", clubName: "Anastasia Tennis Center",
    when: "Apr 12, 2026", duprDelta: 0.08,
    partner: "Coach Reid", opponent: "Tom B./Ana R.",
    kind: "Mixed Doubles",
    headline: "Clean doubles win with Coach Reid",
    blurb: "Held serve every game; broke twice. Crosscourt forehand was on.",
    rated: false
  },
  {
    id: "tg3", result: "L", score: "9-11, 5-11",
    club: "oc", clubName: "Old Coast Pickleball",
    when: "Mar 28, 2026", duprDelta: -0.05,
    partner: "Solo", opponent: "Tom S.",
    kind: "Singles · Stretch",
    headline: "Stretch loss to a 4.0",
    blurb: "Pushed Tom hard in the first; ran out of steam. Good film though.",
    rated: true
  }],

  // Communities — groups, leagues, clinics, ladders this player is in.
  communities: [
  { id: "tnd", name: "Tuesday Night Drills", mark: "TN", color: "#2E5D52", members: 18, role: "Captain" },
  { id: "smdl", name: "Spring Mixed Doubles Lge", mark: "SM", color: "#1F4ED8", members: 32, role: "Player" },
  { id: "ocrr", name: "OC Roundnet & Racquets", mark: "OR", color: "#8E5BE8", members: 56, role: "Member" }],

  // Coaches the player works with — supports "do they use trainers".
  trainers: [
  { avatar: "CR", name: "Coach Reid", title: "Tennis · PTR Pro", sessions: 18, primary: "#1F4ED8" },
  { avatar: "MA", name: "Mike Alvarado", title: "Pickleball · Head Pro", sessions: 6, primary: "#2E5D52" }],

  // Mentions — short testimonials from coaches / partners.
  mentions: [
  { quote: "Reliable partner. Shows up on time, plays smart, gives feedback.", by: "Mia C.", role: "Doubles partner · 14 matches", avatar: "MC", color: "#D6573B" },
  { quote: "Coachable and consistent — has lifted his serve a full level.", by: "Coach Reid", role: "Tennis · PTR Pro · since '24", avatar: "CR", color: "#1F4ED8" }],

  // Friend preview avatars — shown inline with the Friends stat cell so
  // the dashboard reads as a "show off" community signal, not just a
  // number. Initials + brand-distinct colors.
  friendsPreview: [
  { i: "MC", c: "#D6573B" },
  { i: "RT", c: "#1F4ED8" },
  { i: "TS", c: "#0F1214" },
  { i: "PS", c: "#8E5BE8" },
  { i: "JB", c: "#2E5D52" }],

  stats: {
    ntrp: 3.75, dupr: 3.6, duprReliability: 65,
    sessions: 31, clubsPlayedAt: 2,
    reliability: "B+", memberSince: "May 2025",
    friends: 28,
    rivalries: 3, rivalryWindow: "12 months"
  },
  // Engagement dashboard — four "scoreboard" trends comparing Neil to
  // the club average + the area-wide average, so a visitor can size up
  // whether he's a good match to play against. Each row carries a
  // metric, the player's value, club + area benchmarks, and a directional
  // signal (up/even/down vs club).
  engageTrends: [
  {
    id: "dupr",
    label: "DUPR",
    icon: "TrendingUp",
    value: "3.60",
    vsClub: { value: "3.42", delta: "+0.18", direction: "up" },
    vsArea: { value: "3.55", delta: "+0.05", direction: "up" },
    caption: "Above club avg · within range for a competitive match"
  },
  {
    id: "form",
    label: "Form (last 10)",
    icon: "Flame",
    value: "7-3",
    vsClub: { value: "5-5", delta: "+2 wins", direction: "up" },
    vsArea: { value: "6-4", delta: "+1 win", direction: "up" },
    caption: "Hot — won 4 of last 5 matches"
  },
  {
    id: "reliability",
    label: "Show-up rate",
    icon: "ShieldCheck",
    value: "96%",
    vsClub: { value: "88%", delta: "+8 pts", direction: "up" },
    vsArea: { value: "84%", delta: "+12 pts", direction: "up" },
    caption: "Never no-shown · top 10% at Old Coast"
  },
  {
    id: "schedule",
    label: "Best window",
    icon: "Clock",
    value: "Sat AM",
    vsClub: { value: "Tue PM", delta: "Different", direction: "even" },
    vsArea: { value: "Sun AM", delta: "1 hour off", direction: "even" },
    caption: "Free Saturdays · matches your morning availability"
  }],

  // Equipment — product cards modeled on Airbnb listing tiles. Each
  // carries a photo placeholder (gradient-free flat color so it matches
  // the rest of the page), brand, model, key specs, condition status,
  // and a primary CTA either to restring/replace or to buy.
  equipment: [
  {
    id: "racquet",
    sport: "Tennis",
    brand: "Wilson",
    name: "Blade 98 v9",
    meta: "16×19 · 305g · 4⅜ grip",
    condition: "Needs restring",
    conditionTone: "warn",
    surface: "#E9EBEC",
    ctaLabel: "Find a shop",
    ctaIcon: "Scissors",
    shopPrice: "$28 / restring"
  },
  {
    id: "paddle",
    sport: "Pickleball",
    brand: "Joola",
    name: "Ben Johns Hyperion CFS 16",
    meta: "16mm · Elongated · 8.0oz",
    condition: "Active",
    conditionTone: "good",
    surface: "#E4E6E8",
    ctaLabel: "Shop replacement",
    ctaIcon: "ShoppingBag",
    shopPrice: "From $229"
  },
  {
    id: "shoes",
    sport: "Tennis",
    brand: "Asics",
    name: "Gel-Resolution 9",
    meta: "Size 10.5 · 8 mo of use",
    condition: "Rotate soon",
    conditionTone: "warn",
    surface: "#EDEFF1",
    ctaLabel: "Shop replacement",
    ctaIcon: "ShoppingBag",
    shopPrice: "From $145"
  },
  {
    id: "bag",
    sport: "All sports",
    brand: "Wilson",
    name: "Pro Staff 9-Pack",
    meta: "Carries 9 racquets · Thermo",
    condition: "Active",
    conditionTone: "good",
    surface: "#E0E2E5",
    ctaLabel: "View locker",
    ctaIcon: "ArrowRight",
    shopPrice: null
  },
  {
    id: "string",
    sport: "Tennis",
    brand: "Luxilon",
    name: "ALU Power 16L",
    meta: "Polyester · 1.25mm",
    condition: "1.2 reels left",
    conditionTone: "info",
    surface: "#E6E8EA",
    ctaLabel: "Reorder",
    ctaIcon: "ShoppingBag",
    shopPrice: "$18 / set"
  }],

  // 12 months of session counts (Jun → May)
  activity: [3, 4, 5, 7, 9, 8, 4, 5, 9, 11, 10, 7],
  activityMonths: ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May"],
  // Availability: 0 = unavailable, 1 = sometimes, 2 = usually, 3 = always
  availability: {
    Mon: [0, 0, 2], Tue: [0, 0, 3], Wed: [0, 0, 2], Thu: [0, 0, 2],
    Fri: [0, 0, 2], Sat: [3, 3, 2], Sun: [3, 3, 0]
  },
  badges: [
  { icon: "Award", title: "1-Year Member", sub: "Joined May 2025" },
  { icon: "ShieldCheck", title: "Reliable Player", sub: "Consistent show-up rate" },
  { icon: "Layers", title: "Multi-Sport", sub: "Tennis + Pickleball" },
  { icon: "Target", title: "Drills Regular", sub: "Tue night drills" },
  { icon: "Flame", title: "5-Match Streak", sub: "Won 5 in a row · Mar" }],

  clubsPlayedAt: [
  { id: "oc", mark: "OC", name: "Old Coast Pickleball", city: "St. Augustine, FL", sessions: 24, color: "#2E5D52" },
  { id: "at", mark: "AT", name: "Anastasia Tennis Center", city: "St. Augustine Beach, FL", sessions: 7, color: "#1F4ED8" }]

};

// ──────────────────────────────────────────────────────────────────────
// Engagement trends — 4 "scoreboard" comparison cards that surface the
// signals most likely to get a visitor to challenge / message / invite
// this player. Each card shows the player's value flanked by club +
// area averages with a directional delta chip (a boxing-match score
// card vibe), and a one-line caption that says what the comparison
// means in context.
// ──────────────────────────────────────────────────────────────────────
function EngageTrendsCard({ theme, desktop = false }) {
  const dirStyles = {
    up: { color: "#7CE0B5", icon: "ArrowUpRight" },
    down: { color: "#FF8B8B", icon: "ArrowDownRight" },
    even: { color: "rgba(255,255,255,.6)", icon: "Minus" }
  };
  const items = PROFILE.engageTrends;
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: desktop ? "repeat(2, 1fr)" : "1fr",
      gap: 12
    }}>
      {items.map((tr) => {
        const club = dirStyles[tr.vsClub.direction] || dirStyles.even;
        const area = dirStyles[tr.vsArea.direction] || dirStyles.even;
        return (
          <div key={tr.id} style={{
            background: "#0F1214", color: "#fff",
            borderRadius: 8,
            padding: desktop ? "22px 24px" : "18px 18px",
            display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 20
          }}>
            {/* LEFT — eyebrow, scoreboard, caption stacked. */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12, minWidth: 0, flex: 1 }}>
              <span style={{
                fontFamily: theme.display, fontWeight: 800, fontSize: 10,
                letterSpacing: 1.2, textTransform: "uppercase",
                color: "rgba(255,255,255,.55)"
              }}>{tr.label}</span>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <ScoreRow label="Club avg" value={tr.vsClub.value} delta={tr.vsClub.delta} style={club} />
                <ScoreRow label="Area avg" value={tr.vsArea.value} delta={tr.vsArea.delta} style={area} />
              </div>
              <div style={{
                fontSize: 12, lineHeight: "16px", fontWeight: 500,
                color: "rgba(255,255,255,.62)"
              }}>{tr.caption}</div>
            </div>
            {/* RIGHT — big called-out value, icon stacked underneath. */}
            <div style={{
              flexShrink: 0,
              display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8
            }}>
              <div style={{
                fontFamily: theme.display, fontWeight: 800,
                fontSize: desktop ? 48 : 36,
                letterSpacing: -1.6, lineHeight: 1, color: "#fff"
              }}>{tr.value}</div>
              <Icon name={tr.icon} size={16} strokeWidth={2} color="rgba(255,255,255,.55)" />
            </div>
          </div>);

      })}
    </div>);

}
function ScoreRow({ label, value, delta, style }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
      <span style={{ fontSize: 11, color: "rgba(255,255,255,.55)", fontWeight: 600 }}>{label}</span>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
        <span style={{
          fontFamily: "Axiforma", fontWeight: 700, fontSize: 12,
          color: "rgba(255,255,255,.85)", fontVariantNumeric: "tabular-nums"
        }}>{value}</span>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 3,
          height: 18, padding: "0 6px", borderRadius: 999,
          background: "rgba(255,255,255,.08)", color: style.color,
          fontFamily: "Axiforma", fontWeight: 800, fontSize: 10, letterSpacing: 0.3,
          whiteSpace: "nowrap"
        }}>
          <Icon name={style.icon} size={9} strokeWidth={2.6} color={style.color} />
          {delta}
        </span>
      </div>
    </div>);

}
window.EngageTrendsCard = EngageTrendsCard;

// ──────────────────────────────────────────────────────────────────────
// Engagement action bar — sticky bottom strip on a player profile that
// reads like a sports-game / boxing-match scoreboard. Left side: the
// scoreboard ticker (your DUPR vs theirs, head-to-head record, last
// match result). Right side: the four primary actions — Connect /
// Message / Challenge / Invite — in escalating commitment order.
// ──────────────────────────────────────────────────────────────────────
function EngageActionBar({ theme, desktop = false }) {
  // Ticker items — fast-scrolling "tale of the tape" pairs.
  const ticker = [
  { label: "Your DUPR", a: "3.45", b: PROFILE.stats.dupr.toFixed(2), bWin: true },
  { label: "Head-to-head", a: "1W", b: "2W", bWin: true },
  { label: "Last match", a: "Apr 12", b: "W · 11-7", bWin: true },
  { label: "Form (10)", a: "6-4", b: "7-3", bWin: true },
  { label: "Reliability", a: "92%", b: "96%", bWin: true }];

  return (
    <div style={{
      position: "fixed", left: 0, right: 0, bottom: 16, zIndex: 50,
      display: "flex", justifyContent: "center",
      padding: "0 16px", pointerEvents: "none"
    }}>
      <div style={{
        pointerEvents: "auto",
        width: "100%", maxWidth: desktop ? 1080 : 720,
        background: "#0F1214", color: "#fff",
        borderRadius: 8, overflow: "hidden",
        boxShadow: "0 18px 48px rgba(15,18,20,.30), 0 4px 12px rgba(15,18,20,.18)",
        display: "flex", flexDirection: "column"
      }}>
        {/* Top — identity + action cluster, all on one line. Simplified
                identity (avatar + name only) sits to the left of the four
                primary actions. */}
        <div style={{
          padding: desktop ? "12px 18px" : "10px 14px",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12
        }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 12, minWidth: 0 }}>
            <span style={{
              width: 36, height: 36, borderRadius: 999, flexShrink: 0,
              background: theme.primary, color: "#fff",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              fontFamily: theme.display, fontWeight: 800, fontSize: 13
            }}>{PROFILE.avatar}</span>
            <div style={{
              fontFamily: theme.display, fontWeight: 800, fontSize: 14, color: "#fff",
              letterSpacing: -0.2,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
            }}>{PROFILE.name}</div>
          </div>
          <div style={{ display: "inline-flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
            {/* Connect — icon-only ghost (add friend). */}
            <BarBtn icon="UserPlus" ariaLabel="Connect" theme={theme} variant="icon" />
            {/* Message — icon-only ghost. */}
            <BarBtn icon="MessageSquare" ariaLabel="Message" theme={theme} variant="icon" />
            {/* Invite — text only, no icon. */}
            <BarBtn label="Invite" theme={theme} variant="text" />
            {/* Challenge — called-out primary CTA. */}
            <BarBtn icon="Swords" label="Challenge" theme={theme} variant="cta" />
            {/* Edit profile — icon-only ghost. Dispatches a window event
                    that IdentityCard listens for so it can flip to edit mode.
                    Lives in the action bar so all profile-level actions cluster
                    in one consistent location. */}
            <BarBtn icon="Pencil" ariaLabel="Edit profile" theme={theme} variant="icon"
            onClick={() => window.dispatchEvent(new Event("profile:toggle-edit"))} />
          </div>
        </div>
        {/* Bottom — auto-scrolling "tale of the tape" ticker. Now sits
                UNDER the identity + actions row. */}
        <div style={{
          position: "relative", overflow: "hidden",
          padding: "8px 0",
          borderTop: "1px solid rgba(255,255,255,.08)",
          background: "linear-gradient(0deg, rgba(255,255,255,.02) 0%, transparent 100%)"
        }}>
          <style>{`
            @keyframes engageTicker {
              from { transform: translateX(0); }
              to   { transform: translateX(-50%); }
            }
            .engage-ticker-track { animation: engageTicker 28s linear infinite; }
          `}</style>
          <div className="engage-ticker-track" style={{
            display: "inline-flex", gap: 28,
            whiteSpace: "nowrap"
          }}>
            {[...ticker, ...ticker].map((t, i) =>
            <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontFamily: "Axiforma", fontWeight: 800, fontSize: 9, letterSpacing: 1.4, textTransform: "uppercase", color: "rgba(255,255,255,.55)" }}>{t.label}</span>
                <span style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 12, color: t.bWin ? "rgba(255,255,255,.5)" : "#fff" }}>{t.a}</span>
                <Icon name="ArrowLeftRight" size={10} strokeWidth={2.2} color="rgba(255,255,255,.3)" />
                <span style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 12, color: t.bWin ? "#7CE0B5" : "rgba(255,255,255,.5)" }}>{t.b}</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>);

}
function BarBtn({ icon, label, ariaLabel, theme, variant, onClick }) {
  // icon: 36x36 round ghost, icon only
  // text: ghost pill with text only
  // cta:  primary brand pill, taller + bolder, called out
  if (variant === "icon") {
    return (
      <button onClick={onClick} aria-label={ariaLabel || label} title={ariaLabel || label} style={{
        width: 36, height: 36, borderRadius: 999, border: 0,
        background: "rgba(255,255,255,.10)", color: "#fff",
        cursor: "pointer",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        transition: "background 120ms, transform 140ms"
      }}
      onMouseEnter={(e) => {e.currentTarget.style.background = "rgba(255,255,255,.20)";}}
      onMouseLeave={(e) => {e.currentTarget.style.background = "rgba(255,255,255,.10)";}}>
        <Icon name={icon} size={15} strokeWidth={2} color="#fff" />
      </button>);

  }
  if (variant === "cta") {
    return (
      <button onClick={onClick} style={{
        height: 40, padding: "0 18px", borderRadius: 999, border: 0,
        background: theme.primary, color: "#fff",
        fontFamily: "inherit", fontWeight: 800, fontSize: 13, letterSpacing: 0.2,
        cursor: "pointer",
        display: "inline-flex", alignItems: "center", gap: 8,
        boxShadow: `0 6px 16px ${theme.primary}55`,
        transition: "transform 140ms, box-shadow 140ms"
      }}
      onMouseEnter={(e) => {e.currentTarget.style.transform = "translateY(-1px)";e.currentTarget.style.boxShadow = `0 8px 22px ${theme.primary}77`;}}
      onMouseLeave={(e) => {e.currentTarget.style.transform = "translateY(0)";e.currentTarget.style.boxShadow = `0 6px 16px ${theme.primary}55`;}}>
        {icon && <Icon name={icon} size={14} strokeWidth={2.4} color="#fff" />}
        {label}
      </button>);

  }
  // Default — text-only ghost pill.
  return (
    <button onClick={onClick} style={{
      height: 36, padding: "0 14px", borderRadius: 999, border: 0,
      background: "transparent", color: "rgba(255,255,255,.85)",
      fontFamily: "inherit", fontWeight: 700, fontSize: 12,
      cursor: "pointer", whiteSpace: "nowrap",
      transition: "background 120ms, color 120ms"
    }}
    onMouseEnter={(e) => {e.currentTarget.style.background = "rgba(255,255,255,.10)";e.currentTarget.style.color = "#fff";}}
    onMouseLeave={(e) => {e.currentTarget.style.background = "transparent";e.currentTarget.style.color = "rgba(255,255,255,.85)";}}>
      {label}
    </button>);

}
window.EngageActionBar = EngageActionBar;

function PCard({ children, label, action }) {
  return (
    <div style={{
      background: "#fff", border: "1px solid #E9EBEC", borderRadius: 8,
      padding: 18,
      display: "flex", flexDirection: "column", gap: 14
    }}>
      {label &&
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "Axiforma", fontWeight: 800, fontSize: 10, letterSpacing: 1.4, textTransform: "uppercase", color: "#858F8F" }}>{label}</span>
          {action}
        </div>
      }
      {children}
    </div>);

}

// ClubDetail-style section head — uppercase title + extending hairline rule
// + optional sub. Used on the desktop profile page so sections read as
// continuations of the page rather than stacked card boxes.
function PSectionHead({ children, sub, action, theme }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 8, paddingBottom: 14, marginBottom: 8 }}>
      <span style={{
        fontFamily: theme.display, fontWeight: 800,
        fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase",
        color: "#0F1214", whiteSpace: "nowrap"
      }}>{children}</span>
      <span style={{ flex: 1, height: 1, background: "#E9EBEC" }} aria-hidden="true" />
      {sub && <span style={{ fontSize: 12, color: "#858F8F", fontWeight: 500, whiteSpace: "nowrap" }}>{sub}</span>}
      {action}
    </div>);

}

// ──────────────────────────────────────────────────────────────────────
// Trophy cabinet — celebratory grid of championship cards. Each tile
// reads like a small medal: ribbon color encodes place (gold/silver/
// bronze), event name + bracket + year. Designed to dominate the
// upper page so visitors see this player's wins first.
// ──────────────────────────────────────────────────────────────────────
function TrophyCabinetCard({ theme, desktop = false }) {
  // Solid medal tints — no gradients. Matches the ClubDetail design
  // language: flat fills, hairline emphasis instead of decoration.
  const palette = {
    1: { bg: "#FBE9B5", accent: "#B58B1F", text: "#5B4011", icon: "#7B5915", label: "1st" },
    2: { bg: "#ECEEF1", accent: "#7B8089", text: "#363B41", icon: "#4B5052", label: "2nd" },
    3: { bg: "#EFCFAE", accent: "#9B5A28", text: "#3F2310", icon: "#62330F", label: "3rd" }
  };
  return (
    <div style={{
      display: "grid", gap: desktop ? 12 : 10,
      gridTemplateColumns: desktop ? "repeat(4, 1fr)" : "1fr 1fr"
    }}>
      {PROFILE.trophies.map((t, i) => {
        const p = palette[t.place] || palette[3];
        return (
          <div key={i} style={{
            background: p.bg,
            borderRadius: 8,
            padding: desktop ? "18px 16px" : "14px 12px",
            display: "flex", flexDirection: "column", gap: 10,
            position: "relative", overflow: "hidden"
          }}>
            {/* Place chip — solid, no ribbon. */}
            <span style={{
              position: "absolute", top: 12, right: 12,
              fontFamily: theme.display, fontWeight: 800, fontSize: 10,
              letterSpacing: 0.6, color: p.text,
              padding: "3px 8px", borderRadius: 999,
              background: "rgba(255,255,255,.55)"
            }}>{p.label}</span>
            <span style={{
              width: 48, height: 48, borderRadius: 999,
              background: "rgba(255,255,255,.6)", color: p.icon,
              display: "inline-flex", alignItems: "center", justifyContent: "center"
            }}>
              <Icon name={t.place === 1 ? "Trophy" : "Medal"} size={22} strokeWidth={2} color={p.icon} />
            </span>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: theme.display, fontWeight: 800, fontSize: desktop ? 15 : 13, letterSpacing: -0.2, color: "#0F1214", lineHeight: "20px" }}>{t.event}</div>
              <div style={{ marginTop: 4, fontSize: 12, color: "#4B5052", fontWeight: 600 }}>{t.bracket}</div>
              <div style={{ marginTop: 4, fontSize: 11, color: "#858F8F", fontWeight: 500 }}>
                {t.year}{t.partner ? ` · with ${t.partner}` : ""}
              </div>
            </div>
          </div>);

      })}
    </div>);

}
window.TrophyCabinetCard = TrophyCabinetCard;

// ──────────────────────────────────────────────────────────────────────
// Top plays — horizontal carousel of highlight-reel cards. Each card is
// a 16:9 video placeholder with a play overlay, duration chip, view
// count, then a footer with opponent avatars + final score (the social
// proof: "I won this point against these people, score was X").
// ──────────────────────────────────────────────────────────────────────
function TopPlaysCarousel({ theme, desktop = false }) {
  const resultPalette = {
    W: "#1F8A5B",
    L: "#C8243A",
    D: "#1F6DD1"
  };
  const Card = ({ p }) =>
  <div style={{
    flex: desktop ? "0 0 320px" : "0 0 260px",
    scrollSnapAlign: "start",
    borderRadius: 8, overflow: "hidden",
    background: "#fff",
    // Soft elevation shadow + 1px hairline so each tile reads as a
    // proper card on the page surface, not a flat image strip.
    border: "1px solid #E9EBEC",
    boxShadow: "0 8px 24px rgba(15,18,20,.10), 0 2px 6px rgba(15,18,20,.04)",
    cursor: "pointer",
    display: "flex", flexDirection: "column"
  }}>
      {/* 16:9 thumbnail */}
      <div style={{
      position: "relative", aspectRatio: "16 / 9",
      background: p.surface
    }}>
        {/* Faint monogram bottom-right placeholder treatment */}
        <div style={{
        position: "absolute", inset: 0,
        display: "flex", alignItems: "flex-end", justifyContent: "flex-end",
        padding: 14,
        fontFamily: theme.display, fontWeight: 900, fontSize: 64, letterSpacing: -2,
        color: "rgba(15,18,20,.10)",
        lineHeight: 1
      }}>NC</div>
        <div style={{
        position: "absolute", inset: 0,
        display: "flex", alignItems: "center", justifyContent: "center"
      }}>
          <span style={{
          width: 52, height: 52, borderRadius: 999,
          background: "rgba(255,255,255,.96)",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 12px rgba(15,18,20,.30)",
          color: "#0F1214"
        }}>
            <Icon name="Play" size={22} strokeWidth={0} color="#0F1214" fill="#0F1214" />
          </span>
        </div>
        <span style={{
        position: "absolute", bottom: 10, right: 10,
        display: "inline-flex", alignItems: "center",
        height: 20, padding: "0 6px", borderRadius: 4,
        background: "rgba(15,18,20,.72)", color: "#fff",
        fontFamily: theme.display, fontWeight: 800, fontSize: 10, letterSpacing: 0.3
      }}>0:{String(p.durationSec).padStart(2, "0")}</span>
        <span style={{
        position: "absolute", top: 10, left: 10,
        display: "inline-flex", alignItems: "center", gap: 4,
        height: 20, padding: "0 8px", borderRadius: 999,
        background: "rgba(255,255,255,.92)", color: "#0F1214",
        fontFamily: theme.display, fontWeight: 800, fontSize: 10, letterSpacing: 0.3
      }}>
          <Icon name="Eye" size={10} strokeWidth={2.2} color="#0F1214" />
          {p.plays.toLocaleString()}
        </span>
      </div>
      {/* Footer — title, then opponent avatars + score row */}
      <div style={{ padding: "12px 14px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{
        fontFamily: "inherit", fontWeight: 700, fontSize: 13,
        color: "#0F1214", lineHeight: "18px",
        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
      }}>{p.title}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Opponent avatars — stack of initials */}
          <div style={{ display: "inline-flex", alignItems: "center" }}>
            {p.against.map((a, i) =>
          <span key={i} style={{
            width: 22, height: 22, borderRadius: 999,
            background: a.c, color: "#fff",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            fontFamily: theme.display, fontWeight: 800, fontSize: 9,
            border: "2px solid #fff",
            marginLeft: i === 0 ? 0 : -8
          }}>{a.i}</span>
          )}
          </div>
          {/* Result chip — W/L/D */}
          <span style={{
          display: "inline-flex", alignItems: "center",
          height: 18, padding: "0 6px", borderRadius: 4,
          background: resultPalette[p.result] || "#0F1214", color: "#fff",
          fontFamily: theme.display, fontWeight: 800, fontSize: 9, letterSpacing: 0.6
        }}>{p.result}</span>
          <span style={{
          fontFamily: theme.display, fontWeight: 800, fontSize: 12,
          color: "#0F1214",
          fontVariantNumeric: "tabular-nums",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          flex: 1, minWidth: 0
        }}>{p.score}</span>
        </div>
      </div>
    </div>;

  // Always a horizontal scroll carousel — desktop just gives it a touch
  // more padding so it doesn't kiss the page edge.
  return (
    <div style={{
      display: "flex", gap: 14,
      overflowX: "auto", scrollSnapType: "x mandatory",
      scrollbarWidth: "none",
      // Bottom padding leaves room for the cards' drop-shadow to render
      // without being clipped by the scroll container.
      paddingTop: 4, paddingBottom: 16,
      margin: desktop ? "0 -4px" : "0 -16px",
      paddingLeft: desktop ? 4 : 16, paddingRight: desktop ? 4 : 16
    }}>
      {PROFILE.topPlays.map((p) => <Card key={p.id} p={p} />)}
    </div>);

}
window.TopPlaysCarousel = TopPlaysCarousel;

// ──────────────────────────────────────────────────────────────────────
// Top games — modeled 1:1 on the homepage's RecentMatchCards. Dark
// semantic bgs (W/L/D), result pill + club tag + when, headline + blurb,
// score + DUPR delta, Rate / Rematch actions. Horizontal scroll
// carousel matching the homepage's "Recent matches" layout.
// ──────────────────────────────────────────────────────────────────────
function TopGamesCard({ theme, desktop = false }) {
  const palette = {
    W: { label: "Win", bg: "#0F3D2A", accent: "#7CE0B5", pillBg: "#1F8A5B" },
    L: { label: "Loss", bg: "#3D1218", accent: "#FF8B8B", pillBg: "#C8243A" },
    D: { label: "Draw", bg: "#0F2B4D", accent: "#8AB6FF", pillBg: "#1F6DD1" }
  };
  return (
    <div style={{
      display: "flex", gap: 12,
      overflowX: "auto", scrollSnapType: "x mandatory",
      scrollbarWidth: "none", paddingBottom: 4,
      margin: desktop ? "0 -4px" : "0 -16px",
      paddingLeft: desktop ? 4 : 16, paddingRight: desktop ? 4 : 16
    }}>
      {PROFILE.topGames.map((m) => {
        const p = palette[m.result] || palette.W;
        const rated = !!m.rated;
        return (
          <div key={m.id} style={{
            flex: "0 0 360px", scrollSnapAlign: "start",
            background: p.bg, color: "#fff",
            border: 0, borderRadius: 8, padding: "20px 22px 18px",
            position: "relative", overflow: "hidden",
            display: "flex", flexDirection: "column", gap: 12, minHeight: 240
          }}>
            <div style={{ position: "absolute", top: -50, right: -50, width: 180, height: 180, borderRadius: 999, background: p.accent, opacity: 0.10, pointerEvents: "none" }} />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, position: "relative" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                <span style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  height: 22, padding: "0 10px", borderRadius: 8,
                  background: p.pillBg, color: "#fff",
                  fontFamily: theme.display, fontWeight: 800, fontSize: 10, letterSpacing: 1, textTransform: "uppercase",
                  flexShrink: 0
                }}>{p.label}</span>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                  <span style={{
                    display: "inline-flex", alignItems: "center",
                    height: 20, padding: "0 8px", borderRadius: 6,
                    background: "rgba(255,255,255,.10)",
                    fontFamily: theme.display, fontWeight: 800, fontSize: 10, letterSpacing: 0.6, textTransform: "uppercase",
                    color: "rgba(255,255,255,.85)",
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 140
                  }}>{m.clubName}</span>
                  <span style={{ width: 3, height: 3, borderRadius: 999, background: "rgba(255,255,255,.3)", flexShrink: 0 }} />
                  <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,.6)", whiteSpace: "nowrap" }}>{m.when}</span>
                </div>
              </div>
              <span aria-label="Share match" style={{
                width: 28, height: 28, borderRadius: 999,
                background: "rgba(255,255,255,.12)", color: "#fff",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0
              }}>
                <Icon name="Share2" size={13} strokeWidth={2} color="#fff" />
              </span>
            </div>
            {m.kind &&
            <div style={{
              display: "inline-flex", alignItems: "center",
              position: "absolute", top: 56, left: 22,
              padding: "2px 8px", borderRadius: 8,
              background: "rgba(255,255,255,.10)",
              fontSize: 10, fontWeight: 700, letterSpacing: 0.6, textTransform: "uppercase",
              color: "rgba(255,255,255,.85)"
            }}>{m.kind}</div>
            }
            <div style={{ position: "relative", marginTop: m.kind ? 16 : 0 }}>
              <div style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 18, lineHeight: "22px", letterSpacing: -0.4 }}>{m.headline}.</div>
              <div style={{ marginTop: 6, fontSize: 12, color: "rgba(255,255,255,.7)", lineHeight: 1.45, fontWeight: 500 }}>{m.blurb}</div>
            </div>
            <div style={{ marginTop: "auto", position: "relative" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 14, fontVariantNumeric: "tabular-nums" }}>{m.score}</span>
                <span style={{ width: 3, height: 3, borderRadius: 999, background: "rgba(255,255,255,.3)" }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: p.accent }}>
                  DUPR {m.duprDelta >= 0 ? "+" : ""}{m.duprDelta.toFixed(2)}
                </span>
              </div>
              <div style={{ marginTop: 12, display: "flex", gap: 6 }}>
                {!rated &&
                <button style={{
                  flex: 1, height: 34, padding: "0 12px", borderRadius: 8,
                  border: 0, background: "#fff", color: "#0F1214",
                  fontFamily: "inherit", fontWeight: 700, fontSize: 11, cursor: "pointer",
                  display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6
                }}>
                    <Icon name="Star" size={12} color="#0F1214" strokeWidth={2.4} /> Rate match
                  </button>
                }
                <button style={{
                  flex: 1, height: 34, padding: "0 12px", borderRadius: 8,
                  border: rated ? 0 : "1px solid rgba(255,255,255,.3)",
                  background: rated ? "#fff" : "transparent",
                  color: rated ? "#0F1214" : "#fff",
                  fontFamily: "inherit", fontWeight: 700, fontSize: 11, cursor: "pointer",
                  display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
                  whiteSpace: "nowrap"
                }}>
                  <Icon name="RotateCcw" size={12} strokeWidth={2.2} color={rated ? "#0F1214" : "#fff"} /> Rematch {m.opponent.split(" ")[0].replace(/\.$/, "")}
                </button>
              </div>
            </div>
          </div>);

      })}
    </div>);

}
window.TopGamesCard = TopGamesCard;

// ──────────────────────────────────────────────────────────────────────
// Communities — leagues, ladders, drills, groups this player belongs to.
// Each row reads like the friends-in-club avatars on a club page:
// monogram tile, name, role chip, member count.
// ──────────────────────────────────────────────────────────────────────
function CommunitiesCard({ theme, desktop = false }) {
  return (
    <div style={{
      display: "grid",
      // Wrap to additional rows once cards would dip below ~280px.
      // Keeps each card readable instead of squeezing 3 items into a
      // narrow viewport.
      gridTemplateColumns: desktop ? "repeat(auto-fit, minmax(280px, 1fr))" : "1fr",
      gap: desktop ? 12 : 8
    }}>
      {PROFILE.communities.map((c) =>
      <button key={c.id} style={{
        width: "100%", minWidth: 0, boxSizing: "border-box",
        background: "#fff", border: "1px solid #E9EBEC", borderRadius: 8,
        padding: 14, cursor: "pointer", fontFamily: "inherit", textAlign: "left",
        display: "flex", alignItems: "center", gap: 12
      }}>
          <span style={{
          width: 44, height: 44, borderRadius: 8, flexShrink: 0,
          background: c.color, color: "#fff",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          fontFamily: theme.display, fontWeight: 800, fontSize: 13, letterSpacing: 0.4
        }}>{c.mark}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: "inherit", fontWeight: 700, fontSize: 13, color: "#0F1214", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</div>
            <div style={{ marginTop: 3, display: "inline-flex", alignItems: "center", gap: 6 }}>
              <span style={{
              display: "inline-flex", alignItems: "center",
              height: 18, padding: "0 6px", borderRadius: 4,
              background: c.role === "Captain" ? "#0F1214" : "#F4F5F6",
              color: c.role === "Captain" ? "#fff" : "#4B5052",
              fontFamily: theme.display, fontSize: 9, fontWeight: 800, letterSpacing: 0.6, textTransform: "uppercase"
            }}>{c.role}</span>
              <span style={{ fontSize: 11, color: "#858F8F", fontWeight: 600 }}>{c.members} members</span>
            </div>
          </div>
          <Icon name="ChevronRight" size={14} strokeWidth={1.8} color="#BBBFC1" />
        </button>
      )}
    </div>);

}
window.CommunitiesCard = CommunitiesCard;

// ──────────────────────────────────────────────────────────────────────
// Trainers — coaches this player works with. Same row shape as
// communities so they cluster visually.
// ──────────────────────────────────────────────────────────────────────
function TrainersCard({ theme, desktop = false }) {
  return (
    <div style={{
      display: "grid", gridTemplateColumns: desktop ? "repeat(2, 1fr)" : "1fr",
      gap: desktop ? 12 : 8
    }}>
      {PROFILE.trainers.map((t) =>
      <div key={t.name} style={{
        background: "#fff", border: "1px solid #E9EBEC", borderRadius: 8,
        padding: 14, fontFamily: "inherit",
        display: "flex", alignItems: "center", gap: 12
      }}>
          <span style={{
          width: 44, height: 44, borderRadius: 999, flexShrink: 0,
          background: t.primary, color: "#fff",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          fontFamily: theme.display, fontWeight: 800, fontSize: 13, letterSpacing: 0.4
        }}>{t.avatar}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: "inherit", fontWeight: 700, fontSize: 13, color: "#0F1214" }}>{t.name}</div>
            <div style={{ marginTop: 3, fontSize: 11, color: "#858F8F", fontWeight: 600 }}>{t.title} · {t.sessions} sessions</div>
          </div>
          <button style={{
          height: 30, padding: "0 12px", borderRadius: 8, border: `1px solid ${t.primary}`,
          background: "#fff", color: t.primary,
          fontFamily: "inherit", fontWeight: 700, fontSize: 11, cursor: "pointer",
          whiteSpace: "nowrap"
        }}>Book</button>
        </div>
      )}
    </div>);

}
window.TrainersCard = TrainersCard;

// ──────────────────────────────────────────────────────────────────────
// Mentions — quoted testimonials from partners and coaches. Quote-led
// cards with an author chip below. Reads as social proof from the
// player's own network.
// ──────────────────────────────────────────────────────────────────────
function MentionsCard({ theme, desktop = false }) {
  return (
    <div style={{
      display: "grid", gridTemplateColumns: desktop ? "repeat(2, 1fr)" : "1fr",
      gap: desktop ? 12 : 8
    }}>
      {PROFILE.mentions.map((m, i) =>
      <div key={i} style={{
        background: "#FAFAFA", border: "1px solid #E9EBEC", borderRadius: 8,
        padding: 18, display: "flex", flexDirection: "column", gap: 12
      }}>
          <Icon name="Quote" size={16} strokeWidth={2} color={theme.primary} />
          <div style={{ fontSize: 14, color: "#0F1214", fontWeight: 500, lineHeight: "22px" }}>“{m.quote}”</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: 8, borderTop: "1px solid #E9EBEC" }}>
            <span style={{
            width: 32, height: 32, borderRadius: 999, flexShrink: 0,
            background: m.color, color: "#fff",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            fontFamily: theme.display, fontWeight: 800, fontSize: 11
          }}>{m.avatar}</span>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: "inherit", fontWeight: 700, fontSize: 12, color: "#0F1214" }}>{m.by}</div>
              <div style={{ fontSize: 11, color: "#858F8F", fontWeight: 500 }}>{m.role}</div>
            </div>
          </div>
        </div>
      )}
    </div>);

}
window.MentionsCard = MentionsCard;

function StatCell({ label, value, sub }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
      <span style={{ fontSize: 11, color: "#858F8F", fontWeight: 600, letterSpacing: 0.2 }}>{label}</span>
      <span style={{ fontFamily: "Axiforma", fontWeight: 800, fontSize: 22, letterSpacing: -0.6, color: "#0F1214", lineHeight: "26px" }}>{value}</span>
      {sub && <span style={{ fontSize: 11, color: "#858F8F", fontWeight: 500 }}>{sub}</span>}
    </div>);

}

// Identity surface — desktop renders a strong hero with a completion
// banner, big page-title name, contact row, clubs, and a tags panel.
// View/Edit modes are tracked via local state; edit reveals inline
// inputs for the editable fields (name, email, phone, self-tags).
// Mobile renders the original compact card.
function IdentityCard({ theme, desktop = false }) {
  const [mode, setMode] = useStateP("view");
  const editing = mode === "edit";
  // Listen for Edit Profile triggered from elsewhere (currently the
  // bottom action bar) so the user can enter edit mode without the
  // affordance being attached to this component.
  React.useEffect(() => {
    const onEdit = () => setMode((m) => m === "edit" ? "view" : "edit");
    window.addEventListener("profile:toggle-edit", onEdit);
    return () => window.removeEventListener("profile:toggle-edit", onEdit);
  }, []);
  // Hero renders the same flowing layout on both desktop and mobile so
  // the mobile page mirrors the web experience. Sizes scale internally
  // via the `desktop` flag.
  const complete = PROFILE.completion >= 100;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {/* Top bar — completion progress on the left, Edit button on the
              right. When editing, the bar swaps to an "Editing profile"
              indicator with Save / Cancel actions inline so the player has
              a single anchored place for editing controls. */}
      {editing ?
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
        padding: "12px 16px",
        background: theme.softTint || "rgba(31,140,90,.08)",
        borderRadius: 8
      }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, minWidth: 0 }}>
            <Icon name="Pencil" size={14} strokeWidth={2.2} color={theme.primary} />
            <span style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 13, letterSpacing: -0.2, color: "#0F1214" }}>Editing your profile</span>
            <span style={{ fontSize: 12, color: "#4B5052", fontWeight: 500 }}>Update your name, photo, bio, contact info, and tags.</span>
          </div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <button onClick={() => setMode("view")} style={{
            height: 34, padding: "0 14px",
            background: "transparent", border: 0,
            color: "#4B5052", fontFamily: "inherit", fontWeight: 600, fontSize: 13,
            cursor: "pointer"
          }}>Cancel</button>
            <button onClick={() => setMode("view")} style={{
            height: 34, padding: "0 18px", borderRadius: 999, border: 0,
            background: "#0F1214", color: "#fff",
            fontFamily: "inherit", fontWeight: 700, fontSize: 13,
            cursor: "pointer",
            display: "inline-flex", alignItems: "center", gap: 6
          }}>
              Save changes
              <Icon name="Check" size={12} color="#fff" strokeWidth={2.6} />
            </button>
          </div>
        </div> :

      !complete &&
      <div style={{
        background: "#F4F5F6",
        borderRadius: 8,
        padding: "14px 20px",
        display: "flex", flexDirection: "column", gap: 10
      }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
              <div style={{ fontSize: 13, color: "#4B5052", fontWeight: 500, textAlign: "center" }}>
                Your profile is <span style={{ color: "#0F1214", fontWeight: 700 }}>{PROFILE.completion}% complete</span>. Add your DUPR rating to finish.
              </div>
              {/* Add rating link — Edit moved to the bottom action bar. */}
              <a href="#" style={{ color: theme.primary, fontWeight: 700, fontSize: 13, textDecoration: "none", whiteSpace: "nowrap" }}>
                Add rating →
              </a>
            </div>
            <div style={{ height: 3, borderRadius: 999, background: "rgba(15,18,20,.06)", overflow: "hidden" }}>
              <div style={{ width: `${PROFILE.completion}%`, height: "100%", background: theme.primary, borderRadius: 999, transition: "width 240ms" }} />
            </div>
          </div>

      }

      {/* Hero — typography-first, all type left-aligned. Avatar pinned
              to the RIGHT, opposite the name, so the heading + meta + bio
              form a single clean left edge for the page. Sizes scale down
              on mobile. */}
      <div style={{ display: "flex", gap: desktop ? 28 : 14, alignItems: "flex-start" }}>
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            {editing ?
            <div style={{ display: "flex", gap: 12 }}>
                <input defaultValue={PROFILE.firstName} aria-label="First name" style={inputBase(desktop)} />
                <input defaultValue={PROFILE.lastName} aria-label="Last name" style={inputBase(desktop)} />
              </div> :

            <h1 style={{
              margin: 0,
              fontFamily: theme.display, fontWeight: 800,
              fontSize: desktop ? 64 : 30,
              lineHeight: desktop ? "64px" : "34px",
              letterSpacing: desktop ? -2 : -0.8,
              color: "#0F1214"
            }}>{PROFILE.name}</h1>
            }
            {/* Meta line — handle · location · active indicator. */}
            <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
              <span style={{ fontSize: 14, color: "#4B5052", fontWeight: 500 }}>{PROFILE.handle}</span>
              <span style={{ width: 3, height: 3, borderRadius: 999, background: "#DEE1E5" }} />
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 14, color: "#4B5052", fontWeight: 500 }}>
                <Icon name="MapPin" size={13} strokeWidth={2} color="#858F8F" />
                {PROFILE.location}
              </span>
              <span style={{ width: 3, height: 3, borderRadius: 999, background: "#DEE1E5" }} />
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: "#1F8A5B", fontWeight: 700 }}>
                <span style={{ width: 6, height: 6, borderRadius: 999, background: "#1F8A5B", boxShadow: "0 0 0 3px rgba(31,138,91,.20)" }} />
                Active member
              </span>
            </div>
          </div>

          {/* Bio — runs as body copy beneath the name. */}
          {editing ?
          <textarea defaultValue={PROFILE.bio} aria-label="Bio" style={{
            width: "100%", minHeight: 60, padding: "10px 0",
            fontFamily: "inherit", fontSize: 15, lineHeight: "24px",
            color: "#0F1214", border: 0, borderBottom: "1px solid #E9EBEC",
            outline: "none", resize: "vertical", background: "transparent"
          }} /> :

          <p style={{
            margin: 0, fontSize: 15, color: "#4B5052",
            fontWeight: 500, lineHeight: "24px",
            maxWidth: 640
          }}>{PROFILE.bio}</p>
          }
        </div>

        {/* Right cluster — avatar only. Edit button lives in the top
                completion header now, so the right side stays clean. */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 12, flexShrink: 0 }}>
          <div style={{
            width: desktop ? 112 : 64, height: desktop ? 112 : 64, borderRadius: 999,
            background: theme.primary, color: "#fff",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            fontFamily: theme.display, fontWeight: 800, fontSize: desktop ? 40 : 22, letterSpacing: -1,
            position: "relative"
          }}>
            {PROFILE.avatar}
            {editing &&
            <button aria-label="Change photo" style={{
              position: "absolute", right: -2, bottom: -2,
              width: 32, height: 32, borderRadius: 999,
              background: "#fff", color: "#0F1214",
              border: 0, cursor: "pointer",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 12px rgba(15,18,20,.16)"
            }}>
                <Icon name="Camera" size={14} strokeWidth={2} color="#0F1214" />
              </button>
            }
          </div>
        </div>
      </div>

      {/* Two-column layout — LEFT: Contact + Clubs stacked. RIGHT:
              titled tag groups so the source of each chip cluster is
              legible: your self-applied tags & most-played sports vs. tags
              applied to you by other players. */}
      <div style={{ display: "grid", gridTemplateColumns: desktop ? "1fr 1fr" : "1fr", gap: desktop ? 48 : 24 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          <ContactCard theme={theme} editing={editing} />
          <ClubsLinkedCard theme={theme} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Group 1 — Your tags: self-applied tags + sports the
                  player plays most. Brand-tinted self tags lead so the
                  "your voice" cluster reads first. Edit mode reveals X
                  buttons + an "Add tag" affordance. */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <span style={{
              fontFamily: theme.display, fontWeight: 800, fontSize: 11,
              letterSpacing: 1.2, textTransform: "uppercase", color: "#858F8F"
            }}>YOUR TAGS</span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {PROFILE.tagsByMe.map((t) =>
              <span key={t} style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                height: 28, padding: editing ? "0 6px 0 12px" : "0 12px",
                borderRadius: 999,
                background: "rgba(31,140,90,.22)",
                color: "#1A5A38",
                fontFamily: "inherit", fontWeight: 700, fontSize: 12
              }}>
                  {t}
                  {editing &&
                <button aria-label={`Remove ${t}`} style={{
                  width: 18, height: 18, borderRadius: 999,
                  background: "rgba(15,18,20,.08)", border: 0, cursor: "pointer",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  color: theme.primary
                }}>
                      <Icon name="X" size={10} strokeWidth={2.4} color={theme.primary} />
                    </button>
                }
                </span>
              )}
              {/* Sports played — neutral chips, paired with self tags
                      since they're both "your voice" identity attributes. */}
              {PROFILE.sports.map((s) =>
              <span key={s} style={{
                display: "inline-flex", alignItems: "center",
                height: 28, padding: "0 12px", borderRadius: 999,
                background: "#E9EBEC", color: "#0F1214",
                fontSize: 12, fontWeight: 600
              }}>{s}</span>
              )}
              {editing &&
              <button style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                height: 28, padding: "0 12px", borderRadius: 999,
                background: "#F4F5F6", color: theme.primary, border: 0,
                fontSize: 12, fontWeight: 700, cursor: "pointer"
              }}>
                  <Icon name="Plus" size={11} strokeWidth={2.4} color={theme.primary} />
                  Add tag
                </button>
              }
            </div>
          </div>

          {/* Group 2 — Tagged by other players. Each chip carries the
                  author's initials so the attribution is legible at a glance. */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <span style={{
              fontFamily: theme.display, fontWeight: 800, fontSize: 11,
              letterSpacing: 1.2, textTransform: "uppercase", color: "#858F8F"
            }}>Tagged by other players</span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {PROFILE.tagsFromOthers.map((t, i) =>
              <span key={`${t.label}-${i}`} style={{
                display: "inline-flex", alignItems: "center",
                height: 28, padding: "0 12px",
                borderRadius: 999,
                background: "#E9EBEC", color: "#0F1214",
                fontFamily: "inherit", fontWeight: 600, fontSize: 12
              }}>
                  {t.label}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Save/Cancel handled by the top editing header — no duplicate
              row needed at the bottom. */}
    </div>);

}

// Inline edit input style — large, borderless, underlined. Same look
// & feel as ClubDetail's typography-first inputs.
function inputBase(desktop = true) {
  return {
    flex: 1, height: desktop ? 64 : 40, padding: 0,
    fontFamily: "Axiforma, Inter, system-ui, sans-serif",
    fontWeight: 800,
    fontSize: desktop ? 56 : 28,
    letterSpacing: desktop ? -1.8 : -0.8, lineHeight: 1,
    color: "#0F1214",
    border: 0, borderBottom: "1px solid #E9EBEC",
    background: "transparent", outline: "none"
  };
}

// Mobile version — kept compact, original-style.
function IdentityCardMobile({ theme }) {
  return (
    <PCard>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
        <span style={{
          display: "inline-flex", alignItems: "center",
          height: 24, padding: "0 12px", borderRadius: 999,
          background: theme.softTint || "#E7F2EC",
          color: theme.primary,
          fontFamily: theme.display, fontSize: 11, fontWeight: 800, letterSpacing: 0.3
        }}>My profile</span>
        <div style={{ display: "inline-flex", gap: 4 }}>
          {["Pencil", "Lock"].map((i) =>
          <button key={i} aria-label={i} style={{
            width: 32, height: 32, borderRadius: 8,
            background: "#F4F5F6", border: 0, cursor: "pointer",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            color: "#4B5052"
          }}>
              <Icon name={i} size={14} strokeWidth={2} color="#4B5052" />
            </button>
          )}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, paddingTop: 4 }}>
        <div style={{
          width: 96, height: 96, borderRadius: 999,
          background: theme.primary, color: "#fff",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          fontFamily: theme.display, fontWeight: 800, fontSize: 32, letterSpacing: -0.5,
          boxShadow: "0 6px 16px rgba(15,18,20,.10)"
        }}>{PROFILE.avatar}</div>
        <div style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 22, letterSpacing: -0.6, color: "#0F1214" }}>{PROFILE.name}</div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 13, color: "#4B5052", fontWeight: 500 }}>
          <Icon name="MapPin" size={13} strokeWidth={2} color="#4B5052" />
          {PROFILE.location}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#4B5052", fontWeight: 600 }}>
          <span>Profile completion</span>
          <span style={{ color: theme.primary, fontFamily: theme.display, fontWeight: 800 }}>{PROFILE.completion}%</span>
        </div>
        <div style={{ height: 6, borderRadius: 999, background: "#E9EBEC", overflow: "hidden" }}>
          <div style={{ width: `${PROFILE.completion}%`, height: "100%", background: theme.primary, borderRadius: 999 }} />
        </div>
        <div style={{ fontSize: 12, color: "#858F8F", fontWeight: 500, textAlign: "center", marginTop: 2 }}>
          Add your DUPR rating to complete your profile.
        </div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>
        {PROFILE.sports.map((s) =>
        <span key={s} style={{
          display: "inline-flex", alignItems: "center",
          height: 26, padding: "0 12px", borderRadius: 999,
          background: "#F4F5F6", color: "#4B5052",
          fontSize: 12, fontWeight: 600
        }}>{s}</span>
        )}
      </div>
      <div style={{ fontSize: 13, color: "#4B5052", lineHeight: "20px", textAlign: "center", fontWeight: 500 }}>{PROFILE.bio}</div>
    </PCard>);

}

// Compact contact card — typography-first, no border. Email + phone
// stacked, optional in-place editing.
function ContactCard({ theme, editing }) {
  const rows = [
  { icon: "Mail", label: "Email", value: PROFILE.email },
  { icon: "Phone", label: "Phone", value: PROFILE.phone }];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <span style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase", color: "#858F8F" }}>Contact</span>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {rows.map((r) =>
        <div key={r.label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Icon name={r.icon} size={16} strokeWidth={1.8} color="#858F8F" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, color: "#858F8F", fontWeight: 600, letterSpacing: 0.2 }}>{r.label}</div>
              {editing ?
            <input defaultValue={r.value} aria-label={r.label} style={{
              width: "100%", height: 26, padding: 0, marginTop: 2,
              fontFamily: "inherit", fontWeight: 700, fontSize: 14, color: "#0F1214",
              border: 0, borderBottom: "1px solid #E9EBEC", outline: "none",
              background: "transparent"
            }} /> :

            <div style={{ fontFamily: "inherit", fontWeight: 700, fontSize: 14, color: "#0F1214" }}>{r.value}</div>
            }
            </div>
          </div>
        )}
      </div>
    </div>);

}

// Clubs associated with — typography-first, no border. Plain rows of
// monogram + name + city.
function ClubsLinkedCard({ theme }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <span style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase", color: "#858F8F" }}>FAVORITED LOCATIONS</span>
        <span style={{ fontSize: 11, color: "#858F8F", fontWeight: 600 }}>{PROFILE.clubsPlayedAt.length}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {PROFILE.clubsPlayedAt.map((c) =>
        <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{
            width: 28, height: 28, borderRadius: 6, flexShrink: 0,
            background: c.color, color: "#fff",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            fontFamily: theme.display, fontWeight: 800, fontSize: 10, letterSpacing: 0.5
          }}>{c.mark}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "inherit", fontWeight: 700, fontSize: 14, color: "#0F1214", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</div>
              <div style={{ fontSize: 12, color: "#858F8F", fontWeight: 500 }}>{c.city} · {c.sessions} sessions</div>
            </div>
          </div>
        )}
      </div>
    </div>);

}

// Tags from coaches/partners — typography-first, no border on the
// container. Tag chips remain soft-filled (no stroke).
function TagsFromOthersCard({ theme }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <span style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase", color: "#858F8F" }}>Tags from your network</span>
        <span style={{ fontSize: 11, color: "#858F8F", fontWeight: 600 }}>{PROFILE.tagsFromOthers.length}</span>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {PROFILE.tagsFromOthers.map((t, i) =>
        <span key={`${t.label}-${i}`} style={{
          display: "inline-flex", alignItems: "center",
          height: 28, padding: "0 12px",
          borderRadius: 999,
          background: "#E9EBEC", color: "#0F1214",
          fontFamily: "inherit", fontWeight: 600, fontSize: 12
        }}>
            {t.label}
          </span>
        )}
      </div>
    </div>);

}

// Self-applied tags — typography-first, no border on the container.
function TagsByMeCard({ theme, editing }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <span style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase", color: "#858F8F" }}>Tags from you</span>
        <span style={{ fontSize: 11, color: "#858F8F", fontWeight: 600 }}>{PROFILE.tagsByMe.length}</span>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {PROFILE.tagsByMe.map((t) =>
        <span key={t} style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          height: 28, padding: editing ? "0 6px 0 12px" : "0 12px",
          borderRadius: 999,
          background: theme.softTint || "rgba(31,140,90,.10)",
          color: theme.primary,
          fontFamily: "inherit", fontWeight: 700, fontSize: 12
        }}>
            {t}
            {editing &&
          <button aria-label={`Remove ${t}`} style={{
            width: 18, height: 18, borderRadius: 999,
            background: "rgba(15,18,20,.08)", border: 0, cursor: "pointer",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            color: theme.primary
          }}>
                <Icon name="X" size={10} strokeWidth={2.4} color={theme.primary} />
              </button>
          }
          </span>
        )}
        {editing &&
        <button style={{
          display: "inline-flex", alignItems: "center", gap: 4,
          height: 28, padding: "0 12px", borderRadius: 999,
          background: "#F4F5F6", color: theme.primary,
          border: 0,
          fontSize: 12, fontWeight: 700, cursor: "pointer"
        }}>
            <Icon name="Plus" size={11} strokeWidth={2.4} color={theme.primary} />
            Add tag
          </button>
        }
      </div>
    </div>);

}

// Stats — rendered as a dashboard-style hairline strip matching the
// homepage's KPIStrip. Two rows of 3 cells each, with a single 1px rule
// running through the middle and per-cell dividers on the right. Big
// display numbers up top, uppercase label, muted sub-copy below.
function StatsCard({ theme, desktop = false }) {
  const s = PROFILE.stats;
  const line = "#E9EBEC";
  // Friends cell renders avatar previews instead of plain text so it
  // reads as a community signal — a small show-off detail on the
  // dashboard. Other cells render text-only.
  const FriendAvatars = () =>
  <div style={{ display: "inline-flex", alignItems: "center", marginTop: 8 }}>
      {(PROFILE.friendsPreview || []).slice(0, 4).map((a, i) =>
    <span key={i} style={{
      width: 22, height: 22, borderRadius: 999,
      background: a.c, color: "#fff",
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      fontFamily: theme.display, fontWeight: 800, fontSize: 9,
      border: "2px solid #fff",
      marginLeft: i === 0 ? 0 : -8
    }}>{a.i}</span>
    )}
      <span style={{
      marginLeft: 6,
      fontSize: 11, fontWeight: 600, color: theme.primary
    }}>View all →</span>
    </div>;

  const cells = [
  { k: s.ntrp.toFixed(2), v: "USTA NTRP", sub: "Self-reported" },
  { k: s.dupr.toFixed(1), v: "DUPR", sub: `Reliability: ${s.duprReliability}%` },
  { k: s.sessions, v: "Sessions", sub: "Last 12 months" },
  { k: s.reliability, v: "Reliability", sub: "Show-up grade" },
  { k: s.friends, v: "Friends", sub: <FriendAvatars />, link: true },
  { k: s.rivalries, v: "Rivalries", sub: `5+ matches in ${s.rivalryWindow}` },
  { k: s.clubsPlayedAt, v: "Clubs", sub: "Played at" },
  { k: s.memberSince, v: "Member Since", sub: "1 year" }];

  const grid =
  <div style={{
    display: "grid",
    gridTemplateColumns: desktop ? "repeat(4, 1fr)" : "repeat(2, 1fr)",
    borderTop: `1px solid ${line}`,
    borderBottom: `1px solid ${line}`
  }}>
      {cells.map((c, i) => {
      const cols = desktop ? 4 : 2;
      const isRightEdge = (i + 1) % cols === 0;
      const inLastRow = i >= cells.length - cols;
      return (
        <div key={c.v} style={{
          padding: "20px 18px",
          borderRight: isRightEdge ? 0 : `1px solid ${line}`,
          borderBottom: inLastRow ? 0 : `1px solid ${line}`,
          cursor: c.link ? "pointer" : "default",
          transition: "background 120ms"
        }}>
            <div style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 28, color: "#0F1214", letterSpacing: -0.6, lineHeight: 1 }}>{c.k}</div>
            <div style={{ marginTop: 10, fontSize: 11, color: "#0F1214", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>{c.v}</div>
            {typeof c.sub === "string" ?
          <div style={{ marginTop: 4, fontSize: 12, color: "#858F8F", fontWeight: 500 }}>{c.sub}</div> :
          c.sub
          }
          </div>);

    })}
    </div>;

  if (desktop) return grid;
  return (
    <div style={{
      background: "#fff", border: `1px solid ${line}`, borderRadius: 8,
      padding: 18,
      display: "flex", flexDirection: "column", gap: 14
    }}>
      <span style={{ fontFamily: "Axiforma", fontWeight: 800, fontSize: 10, letterSpacing: 1.4, textTransform: "uppercase", color: "#858F8F" }}>Stats</span>
      <div style={{ margin: "0 -18px" }}>{grid}</div>
    </div>);

}

// Equipment — minimal product cards in a horizontal carousel. Photo on
// top, identity below, and a subtle text-link CTA at the bottom (no
// bold filled button). Soft hairline border + light shadow so each card
// reads as a tile without competing with the rest of the page.
function EquipmentCard({ theme, desktop = false }) {
  const rows = PROFILE.equipment;
  const conditionStyles = {
    good: { color: "#1F8A5B", icon: "Check" },
    warn: { color: "#A06A12", icon: "AlertTriangle" },
    info: { color: "#1F4ED8", icon: "Info" }
  };
  return (
    <div style={{
      display: "flex", gap: desktop ? 14 : 12,
      overflowX: "auto", scrollSnapType: "x mandatory",
      scrollbarWidth: "none",
      paddingTop: 4, paddingBottom: 16,
      margin: desktop ? "0 -4px" : "0 -16px",
      paddingLeft: desktop ? 4 : 16, paddingRight: desktop ? 4 : 16
    }}>
      {rows.map((eq) => {
        const cs = conditionStyles[eq.conditionTone] || conditionStyles.good;
        return (
          <div key={eq.id} style={{
            flex: desktop ? "0 0 240px" : "0 0 210px",
            scrollSnapAlign: "start",
            display: "flex", flexDirection: "column",
            background: "#fff",
            border: "1px solid #E9EBEC",
            borderRadius: 8, overflow: "hidden",
            boxShadow: "0 1px 2px rgba(15,18,20,.04)",
            cursor: "pointer", fontFamily: "inherit"
          }}>
            {/* Photo — 4:3, flat surface field with a faint brand
                    monogram. No chip overlays — keeps the card minimal. */}
            <div style={{
              position: "relative", aspectRatio: "4 / 3",
              background: eq.surface
            }}>
              <div style={{
                position: "absolute", inset: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: theme.display, fontWeight: 900, fontSize: 88, letterSpacing: -3,
                color: "rgba(15,18,20,.10)", lineHeight: 1
              }}>{eq.brand[0]}</div>
            </div>
            {/* Body — sport eyebrow, brand + model, meta, condition, then
                    a subtle underline-link CTA at the bottom. */}
            <div style={{ padding: "14px 14px 16px", display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{
                fontFamily: "Axiforma", fontWeight: 800, fontSize: 10,
                letterSpacing: 1.2, textTransform: "uppercase", color: "#858F8F"
              }}>{eq.sport}</div>
              <div style={{
                fontFamily: theme.display, fontWeight: 700, fontSize: 14,
                letterSpacing: -0.2, color: "#0F1214",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
              }}>{eq.brand} {eq.name}</div>
              <div style={{
                fontSize: 12, color: "#858F8F", fontWeight: 500,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
              }}>{eq.meta}</div>
              <div style={{
                marginTop: 6,
                display: "inline-flex", alignItems: "center", gap: 5,
                fontSize: 11, fontWeight: 700, color: cs.color
              }}>
                <Icon name={cs.icon} size={11} strokeWidth={2.4} color={cs.color} />
                {eq.condition}
              </div>
              {/* Subtle link-style CTA — replaces the heavy filled button. */}
              <a href="#" style={{
                marginTop: 10,
                display: "inline-flex", alignItems: "center", gap: 5,
                fontFamily: "inherit", fontWeight: 600, fontSize: 12,
                color: "#0F1214", textDecoration: "underline", textUnderlineOffset: 3,
                cursor: "pointer", whiteSpace: "nowrap"
              }}>
                {eq.ctaLabel}
                <Icon name="ArrowRight" size={11} strokeWidth={2.2} color="#0F1214" />
              </a>
            </div>
          </div>);

      })}
    </div>);

}

// Combined activity × availability heatmap — one chart that shows both
// "when in the year you play" (X axis: 12 months) AND "what time of day
// you play" (Y axis: morning / afternoon / evening). Cell intensity is
// derived from PROFILE.activity (monthly session totals) split across
// time-of-day bands using PROFILE.availability as a relative weighting.
// Easier to compare and contrast in one digestible view than two
// stacked / side-by-side charts.
function ActivityHeatmapCard({ theme, desktop = false }) {
  // Simple monthly bar chart + typical-availability grid. Both panels
  // share the same intensity scale so the bars and the availability
  // pills read as the same data language.
  const monthlyTotals = PROFILE.activity;
  const months = PROFILE.activityMonths;
  const max = Math.max(1, ...monthlyTotals);

  // Map an intensity (0..1) to a brand-green tint. Five steps so we can
  // render a discrete legend that matches the bar fills.
  const STEPS = 5;
  const stepIndex = (v) => {
    if (v <= 0) return 0;
    const t = v / max; // 0..1
    return Math.min(STEPS - 1, Math.max(0, Math.ceil(t * (STEPS - 1))));
  };
  const PRIMARY = theme.primary || "#1F8A5B";
  // Both panels use the system's canonical green so activity and
  // availability share a single visual language.
  const GREEN = "#1F8A5B";
  // Brand-green scale — 5 steps from neutral to saturated. Drives the
  // monthly bar fills + the Less … More legend.
  const stepFill = [
    "#E9EBEC",
    `color-mix(in oklch, ${GREEN} 22%, #F4F5F6)`,
    `color-mix(in oklch, ${GREEN} 42%, #fff)`,
    `color-mix(in oklch, ${GREEN} 65%, #fff)`,
    GREEN,
  ];

  // Availability — three discrete intensity steps in the system green.
  const availFill = (v) => {
    if (v <= 0) return "#F4F5F6";
    if (v === 1) return `color-mix(in oklch, ${GREEN} 28%, #F4F5F6)`;
    if (v === 2) return `color-mix(in oklch, ${GREEN} 60%, #fff)`;
    return GREEN;
  };

  // Day labels for the availability grid below.
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28, fontFamily: "inherit" }}>
      <div>
        <div style={{
          fontFamily: "Axiforma", fontWeight: 800, fontSize: 11,
          letterSpacing: 1.4, textTransform: "uppercase", color: "#858F8F",
          marginBottom: 14,
        }}>Activity (12 months)</div>

        {/* Bars row */}
        <div style={{
          display: "grid", gridTemplateColumns: `repeat(${months.length}, 1fr)`,
          gap: desktop ? 8 : 4, alignItems: "flex-end",
          height: desktop ? 160 : 120,
        }}>
          {monthlyTotals.map((v, i) => {
            const h = (v / max) * 100;
            return (
              <div key={i} style={{
                width: "100%", height: "100%",
                display: "flex", alignItems: "flex-end", justifyContent: "center",
              }}>
                <div style={{
                  width: "100%",
                  height: `${Math.max(h, 12)}%`,
                  background: stepFill[stepIndex(v)],
                  borderRadius: 6,
                }} title={`${months[i]}: ${v} sessions`} />
              </div>
            );
          })}
        </div>

        {/* Month labels */}
        <div style={{
          display: "grid", gridTemplateColumns: `repeat(${months.length}, 1fr)`,
          gap: desktop ? 8 : 4, marginTop: 10,
        }}>
          {months.map((m, i) => (
            <span key={i} style={{
              fontSize: 11, fontWeight: 600, color: "#858F8F",
              textAlign: "center",
            }}>{m}</span>
          ))}
        </div>

        {/* Legend — Less … More with 5 swatches matching the bar fills. */}
        <div style={{
          marginTop: 14,
          display: "flex", alignItems: "center", justifyContent: "flex-end",
          gap: 8, fontSize: 11, color: "#858F8F", fontWeight: 600,
        }}>
          Less
          <div style={{ display: "flex", gap: 4 }}>
            {stepFill.map((c, i) => (
              <span key={i} style={{
                width: 16, height: 16, borderRadius: 4,
                background: c,
              }} />
            ))}
          </div>
          More
        </div>
      </div>

      {/* ── Typical availability grid ─────────────────────────────── */}
      <div>
        <div style={{
          fontFamily: "Axiforma", fontWeight: 800, fontSize: 11,
          letterSpacing: 1.4, textTransform: "uppercase", color: "#858F8F",
          marginBottom: 14,
        }}>Typical availability</div>

        {/* Column header row — labels above the 3 band columns. */}
        <div style={{
          display: "grid",
          gridTemplateColumns: desktop ? "64px 1fr 1fr 1fr" : "52px 1fr 1fr 1fr",
          gap: 10, alignItems: "center", marginBottom: 10,
        }}>
          <div />
          {["Morning", "Afternoon", "Evening"].map((p) => (
            <div key={p} style={{
              fontSize: 12, fontWeight: 600, color: "#4B5052",
              textAlign: "center",
            }}>{p}</div>
          ))}
        </div>

        {/* 7 day rows × 3 band cells. */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {days.map((d) => (
            <div key={d} style={{
              display: "grid",
              gridTemplateColumns: desktop ? "64px 1fr 1fr 1fr" : "52px 1fr 1fr 1fr",
              gap: 10, alignItems: "center",
            }}>
              <div style={{
                fontSize: 13, fontWeight: 600, color: "#4B5052",
              }}>{d}</div>
              {PROFILE.availability[d].map((v, i) => (
                <div key={i} style={{
                  height: desktop ? 24 : 20,
                  borderRadius: 999,
                  background: availFill(v),
                }} title={`${d} ${["Morning", "Afternoon", "Evening"][i]}: ${["Off", "Light", "Usually", "Always"][v] || ""}`} />
              ))}
            </div>
          ))}
        </div>

        <div style={{
          marginTop: 14, fontSize: 12, color: "#858F8F", fontWeight: 500,
        }}>
          Based on booking patterns — not a real-time schedule.
        </div>
      </div>
    </div>
  );
}
window.ActivityHeatmapCard = ActivityHeatmapCard;

function AvailabilityCard({ theme, desktop = false }) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const fill = (v) => v === 0 ? "#F4F5F6" : `color-mix(in oklch, ${theme.primary} ${20 + v * 28}%, #fff)`;
  const grid =
  <>
      <div style={{ display: "grid", gridTemplateColumns: "44px 1fr 1fr 1fr", gap: 8, alignItems: "center" }}>
        <div />
        {["Morning", "Afternoon", "Evening"].map((p) =>
      <div key={p} style={{ fontSize: 11, fontWeight: 700, color: "#858F8F", textAlign: "center" }}>{p}</div>
      )}
        {days.map((d) =>
      <React.Fragment key={d}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#4B5052" }}>{d}</div>
            {PROFILE.availability[d].map((v, i) =>
        <div key={i} style={{ height: 26, borderRadius: 6, background: fill(v) }} />
        )}
          </React.Fragment>
      )}
      </div>
      <div style={{ fontSize: 11, color: "#858F8F", fontWeight: 500, textAlign: "center", marginTop: 12 }}>
        Based on booking patterns — not a real-time schedule.
      </div>
    </>;

  if (desktop) return <div>{grid}</div>;
  return <PCard label="Typical availability">{grid}</PCard>;
}

function BadgesCard({ theme, desktop = false }) {
  // Subtle horizontal rows — icon on the left, title + sub stacked
  // beside it. 2 per row on both desktop & mobile so the cluster reads
  // as quiet metadata rather than a celebratory grid.
  const badges =
  <div style={{ display: "grid", gridTemplateColumns: desktop ? "repeat(3, 1fr)" : "1fr 1fr", gap: desktop ? "16px 24px" : "12px 20px" }}>
      {PROFILE.badges.map((b) =>
    <div key={b.title} style={{
      display: "flex", alignItems: "center", gap: 12,
      minWidth: 0
    }}>
          <span style={{
        width: 34, height: 34, borderRadius: 999, flexShrink: 0,
        background: "#F4F5F6",
        display: "inline-flex", alignItems: "center", justifyContent: "center"
      }}>
            <Icon name={b.icon} size={16} strokeWidth={1.8} color="#4B5052" />
          </span>
          <div style={{ minWidth: 0 }}>
            <div style={{
          fontFamily: "inherit", fontWeight: 700, fontSize: 13,
          color: "#0F1214",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
        }}>{b.title}</div>
            <div style={{
          fontSize: 11, color: "#858F8F", fontWeight: 500, marginTop: 2,
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
        }}>{b.sub}</div>
          </div>
        </div>
    )}
    </div>;

  if (desktop) return badges;
  return <PCard label="Badges & achievements">{badges}</PCard>;
}

function ClubsPlayedAtCard({ theme, desktop = false }) {
  // Rich club cards mirroring the FindClubs list — map thumb + identity
  // stack + a primary "Visit this club" CTA on the right. Desktop renders
  // a 2-column grid; mobile stacks them.
  const cards =
  <div style={{
    display: "grid",
    // Wrap once cards would shrink below ~320px so each club row keeps
    // its map thumb + identity + Visit button laid out cleanly.
    gridTemplateColumns: desktop ? "repeat(auto-fit, minmax(320px, 1fr))" : "1fr",
    gap: desktop ? 14 : 10
  }}>
      {PROFILE.clubsPlayedAt.map((c) =>
    <div key={c.id} style={{
      width: "100%", minWidth: 0, boxSizing: "border-box",
      background: "#fff", border: "1px solid #E9EBEC", borderRadius: 8,
      padding: 16,
      display: "flex", alignItems: "center", gap: 14,
      fontFamily: "inherit"
    }}>
          {/* Map-thumb-style monogram tile — square map paper background
        with the club's mark stamped in the corner, mirroring the
        FindClubs row's MapThumb but kept smaller and self-contained
        so we don't take a dependency on that component here. */}
          <div style={{
        position: "relative",
        width: 72, height: 72, borderRadius: 8, overflow: "hidden", flexShrink: 0,
        background: "#F2EFE8"
      }}>
            <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
              <ellipse cx="35" cy="40" rx="28" ry="16" fill="#CFE7DA" opacity="0.7" />
              <line x1="-4" y1="56" x2="104" y2="48" stroke="#E8E2D2" strokeWidth="6" />
              <line x1="62" y1="-4" x2="58" y2="104" stroke="#E8E2D2" strokeWidth="5" />
              <line x1="-4" y1="56" x2="104" y2="48" stroke="#FFFFFF" strokeWidth="1" />
              <line x1="62" y1="-4" x2="58" y2="104" stroke="#FFFFFF" strokeWidth="1" />
            </svg>
            <span style={{
          position: "absolute", left: "50%", top: "50%",
          transform: "translate(-50%, -55%)",
          width: 26, height: 26, borderRadius: "50% 50% 50% 0",
          background: c.color, rotate: "-45deg",
          boxShadow: "0 2px 6px rgba(15,18,20,.3), 0 0 0 2px #fff",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
              <span style={{
            rotate: "45deg",
            fontFamily: theme.display, fontWeight: 800,
            fontSize: 9, color: "#fff"
          }}>{c.mark}</span>
            </span>
          </div>
          <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{
            fontFamily: theme.display, fontWeight: 700, fontSize: desktop ? 16 : 14,
            color: "#0F1214", letterSpacing: -0.2,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
          }}>{c.name}</span>
            </div>
            <span style={{ fontSize: 12, color: "#4B5052", fontWeight: 500 }}>{c.city}</span>
            <div style={{ marginTop: 2, display: "inline-flex", alignItems: "center", gap: 8 }}>
              <span style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            height: 22, padding: "0 8px", borderRadius: 8,
            background: "#F4F5F6", color: "#4B5052",
            fontSize: 11, fontWeight: 600
          }}>
                <Icon name="Calendar" size={10} strokeWidth={2.2} color="#858F8F" />
                {c.sessions} sessions
              </span>
            </div>
          </div>
          <button style={{
        flexShrink: 0,
        height: 36, padding: "0 14px", borderRadius: 8, border: 0,
        background: "#0F1214", color: "#fff",
        fontFamily: "inherit", fontWeight: 600, fontSize: 12,
        cursor: "pointer", whiteSpace: "nowrap",
        display: "inline-flex", alignItems: "center", gap: 6
      }}>
            Visit
            <Icon name="ArrowRight" size={11} color="#fff" strokeWidth={2.5} />
          </button>
        </div>
    )}
    </div>;

  if (desktop) return cards;
  return <PCard label="Clubs played at">{cards}</PCard>;
}

// ---------------------------------------------------------------------------
// MAIN — ProfilePage. Renders the column of cards for both desktop & mobile.
// On mobile, also renders the page chrome (top bar + gear icon → SettingsSheet)
// and a sticky bottom nav at the bottom. On desktop the parent layout (Dashboard)
// supplies its own chrome.
// ---------------------------------------------------------------------------
function ProfilePage({ theme, viewport = "desktop", onBack }) {
  const desktop = viewport === "desktop";
  const [settingsOpen, setSettingsOpen] = useStateP(false);
  const [editOpen, setEditOpen] = useStateP(false);
  // Mobile content — mirrors the desktop flow with the same section
  // heads and inline (cardless) layout so mobile reads as a continuous
  // page rather than a stack of contained cards. Internal components
  // accept `desktop={false}` and tighten their sizes accordingly.
  const mobileContent =
  <div style={{ display: "flex", flexDirection: "column" }}>
      <IdentityCard theme={theme} desktop={false} />

      <div style={{ marginTop: 24 }}>
        <PSectionHead theme={theme} sub="Last 12 months">Performance & community</PSectionHead>
        <StatsCard theme={theme} desktop={false} />
      </div>

      <div style={{ marginTop: 24 }}>
        <PSectionHead theme={theme} sub="Synced from your gear locker">Equipment</PSectionHead>
        <EquipmentCard theme={theme} desktop={false} />
      </div>

      <div style={{ marginTop: 24 }}>
        <PSectionHead theme={theme} sub="This week · monthly trend">Activity</PSectionHead>
        <ActivityHeatmapCard theme={theme} desktop={false} />
      </div>

      <div style={{ marginTop: 24 }}>
        <PSectionHead theme={theme} sub={`${PROFILE.trophies.length} championships · ${PROFILE.badges.length} badges`}>Recognition</PSectionHead>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 10 }}>
              <span style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 13, letterSpacing: -0.2, color: "#0F1214" }}>Trophies</span>
              <span style={{ fontSize: 11, color: "#858F8F", fontWeight: 500 }}>Championship wins</span>
            </div>
            <TrophyCabinetCard theme={theme} desktop={false} />
          </div>
          <div style={{ height: 1, background: "#E9EBEC" }} />
          <div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 10 }}>
              <span style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 13, letterSpacing: -0.2, color: "#0F1214" }}>Badges</span>
              <span style={{ fontSize: 11, color: "#858F8F", fontWeight: 500 }}>Earned through play</span>
            </div>
            <BadgesCard theme={theme} desktop={false} />
          </div>
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <PSectionHead theme={theme} sub="From partners & coaches">Mentions</PSectionHead>
        <MentionsCard theme={theme} desktop={false} />
      </div>

      <div style={{ marginTop: 24 }}>
        <PSectionHead theme={theme} sub={`${PROFILE.communities.length} groups`}>Communities</PSectionHead>
        <CommunitiesCard theme={theme} desktop={false} />
      </div>

      <div style={{ marginTop: 24 }}>
        <PSectionHead theme={theme} sub={`${PROFILE.clubsPlayedAt.length} clubs`}>Clubs played at</PSectionHead>
        <ClubsPlayedAtCard theme={theme} desktop={false} />
      </div>

      <div style={{
      marginTop: 32, paddingTop: 20, borderTop: "1px solid #E9EBEC",
      display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
      textAlign: "center", paddingBottom: 100
    }}>
        <Icon name="Lock" size={14} strokeWidth={1.8} color="#858F8F" />
        <span style={{ fontSize: 12, color: "#858F8F", fontWeight: 500, lineHeight: "18px" }}>
          This profile only shows information the player has chosen to share. Full name, contact info, and exact location are never visible.
        </span>
        <a href="#" style={{ color: theme.primary, fontWeight: 700, fontSize: 12, textDecoration: "none" }}>Learn about privacy →</a>
      </div>
    </div>;


  // Desktop content — flowing page modeled on ClubDetailBody:
  // uppercase eyebrow + hairline-rule section heads, content flows
  // inline (no white card chrome around each section) so the page reads
  // as one continuous, clean surface.
  const desktopContent =
  <div style={{ display: "flex", flexDirection: "column" }}>
      <IdentityCard theme={theme} desktop={true} />

      {/* Stats dashboard — at-a-glance numbers. */}
      <div style={{ marginTop: 32 }}>
        <PSectionHead theme={theme} sub="Last 12 months">Performance & community</PSectionHead>
        <StatsCard theme={theme} desktop={true} />
      </div>

      <div style={{ marginTop: 32 }}>
        <PSectionHead theme={theme} sub="Synced from your gear locker">Equipment</PSectionHead>
        <EquipmentCard theme={theme} desktop={true} />
      </div>

      <div style={{ marginTop: 32 }}>
        <PSectionHead theme={theme} sub="This week · monthly trend">Activity</PSectionHead>
        <ActivityHeatmapCard theme={theme} desktop={true} />
      </div>

      {/* Trophies + Badges — single recognition area, visually
       differentiated by a sub-head + their own tile styling
       (medal-tinted vs neutral). */}
      <div style={{ marginTop: 32 }}>
        <PSectionHead theme={theme} sub={`${PROFILE.trophies.length} championships · ${PROFILE.badges.length} badges`}>Recognition</PSectionHead>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Sub-head — Trophies */}
          <div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 10 }}>
              <span style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 14, letterSpacing: -0.2, color: "#0F1214" }}>Trophies</span>
              <span style={{ fontSize: 12, color: "#858F8F", fontWeight: 500 }}>Championship wins & podium finishes</span>
            </div>
            <TrophyCabinetCard theme={theme} desktop={true} />
          </div>
          {/* Hairline divider between the two sub-areas. */}
          <div style={{ height: 1, background: "#E9EBEC" }} />
          {/* Sub-head — Badges */}
          <div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 10 }}>
              <span style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 14, letterSpacing: -0.2, color: "#0F1214" }}>Badges</span>
              <span style={{ fontSize: 12, color: "#858F8F", fontWeight: 500 }}>Earned through participation & reliability</span>
            </div>
            <BadgesCard theme={theme} desktop={true} />
          </div>
        </div>
      </div>

      {/* Mentions — quoted testimonials. */}
      <div style={{ marginTop: 32 }}>
        <PSectionHead theme={theme} sub={`From partners & coaches`}>Mentions</PSectionHead>
        <MentionsCard theme={theme} desktop={true} />
      </div>

      {/* Communities. */}
      <div style={{ marginTop: 32 }}>
        <PSectionHead theme={theme} sub={`${PROFILE.communities.length} groups`}>Communities</PSectionHead>
        <CommunitiesCard theme={theme} desktop={true} />
      </div>

      <div style={{ marginTop: 32 }}>
        <PSectionHead theme={theme} sub={`${PROFILE.clubsPlayedAt.length} clubs`}>Clubs played at</PSectionHead>
        <ClubsPlayedAtCard theme={theme} desktop={true} />
      </div>

      {/* Privacy footer */}
      <div style={{
      marginTop: 40, paddingTop: 24, borderTop: "1px solid #E9EBEC",
      display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
      textAlign: "center"
    }}>
        <Icon name="Lock" size={14} strokeWidth={1.8} color="#858F8F" />
        <span style={{ fontSize: 12, color: "#858F8F", fontWeight: 500, lineHeight: "18px", maxWidth: 480 }}>
          This profile only shows information the player has chosen to share. Full name, contact info, and exact location are never visible.
        </span>
        <a href="#" style={{ color: theme.primary, fontWeight: 700, fontSize: 12, textDecoration: "none" }}>Learn about privacy on CourtReserve →</a>
      </div>
    </div>;


  if (desktop) {
    return (
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "32px 32px 64px" }}>
        {/* Desktop header — page title + edit pencil + settings. */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: 20
        }}>
          <span style={{
            fontFamily: theme.display, fontWeight: 800, fontSize: 22, letterSpacing: -0.4,
            color: "#0F1214"
          }}>My Profile</span>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <button onClick={() => setEditOpen(true)} aria-label="Edit profile" style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              height: 36, padding: "0 12px", borderRadius: 8,
              background: "#F4F5F6", border: 0, cursor: "pointer",
              color: "#0F1214", fontFamily: "inherit", fontWeight: 600, fontSize: 13
            }}
            onMouseEnter={(e) => {e.currentTarget.style.background = "#E9EBEC";}}
            onMouseLeave={(e) => {e.currentTarget.style.background = "#F4F5F6";}}>
              <Icon name="Pencil" size={14} strokeWidth={2} color="#0F1214" />
              Edit profile
            </button>
            <button onClick={() => setSettingsOpen(true)} aria-label="Settings" style={{
              width: 36, height: 36, borderRadius: 999,
              background: "#F4F5F6", border: 0, cursor: "pointer",
              display: "inline-flex", alignItems: "center", justifyContent: "center"
            }}
            onMouseEnter={(e) => {e.currentTarget.style.background = "#E9EBEC";}}
            onMouseLeave={(e) => {e.currentTarget.style.background = "#F4F5F6";}}>
              <Icon name="Settings" size={16} strokeWidth={2} color="#0F1214" />
            </button>
          </div>
        </div>
        {desktopContent}
        {settingsOpen &&
        <SettingsSheet theme={theme} onClose={() => setSettingsOpen(false)} onItemClick={() => {}} onLogout={() => {}} />
        }
        {editOpen &&
        <EditProfileSheet theme={theme} onClose={() => setEditOpen(false)} />
        }
      </div>);

  }

  // Mobile — full screen with top bar, scrollable body, bottom nav.
  return (
    <div style={{ background: "#F8F9FA", flex: 1, display: "flex", flexDirection: "column", minHeight: 0, fontFamily: "Inter, system-ui, sans-serif", position: "relative" }}>
      <div style={{
        background: "#fff", height: 52, flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 16px",
        borderBottom: "1px solid #E9EBEC"
      }}>
        <div style={{ width: 72 }} />
        <span style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 14, letterSpacing: -0.2, color: "#0F1214" }}>My Profile</span>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
          <button onClick={() => setEditOpen(true)} aria-label="Edit profile" style={{
            width: 32, height: 32, borderRadius: 999,
            background: "transparent", border: 0, cursor: "pointer",
            display: "inline-flex", alignItems: "center", justifyContent: "center"
          }}>
            <Icon name="Pencil" size={18} strokeWidth={2} color="#0F1214" />
          </button>
          <button onClick={() => setSettingsOpen(true)} aria-label="Settings" style={{
            width: 32, height: 32, borderRadius: 999,
            background: "transparent", border: 0, cursor: "pointer",
            display: "inline-flex", alignItems: "center", justifyContent: "center"
          }}>
            <Icon name="Settings" size={18} strokeWidth={2} color="#0F1214" />
          </button>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 12px 12px" }}>
        {mobileContent}
      </div>
      {window.MobileBottomNav &&
      <div style={{ flexShrink: 0 }}>
          <window.MobileBottomNav theme={theme} flow={true} active="profile"
        onChange={(k) => {
          // Mirror the wiring used elsewhere (FindClubs, Dashboard):
          // Profile tab is a no-op here (we're already on it), every
          // other tab routes via the global mobile navigator.
          if (k === "profile") return;
          if (window.__navigateMobile) window.__navigateMobile(k);
        }} />
        </div>
      }
      {settingsOpen &&
      <SettingsSheet theme={theme} onClose={() => setSettingsOpen(false)} onItemClick={() => {}} onLogout={() => {}} />
      }
      {editOpen &&
      <EditProfileSheet theme={theme} onClose={() => setEditOpen(false)} />
      }
    </div>);

}

// ─────────────────────────────────────────────────────────────────────────
// Equipment Locker page — full settings-menu destination listing every
// piece of gear the player has logged. Renders the same `PROFILE.equipment`
// data already used by the profile carousel, but expanded into rich rows
// with care tasks, service history, and primary actions. Same chrome on
// desktop and mobile (full-bleed body, page-style top bar with a back
// affordance) so it matches the rest of the app's settings flows.
// ─────────────────────────────────────────────────────────────────────────

// Extra demo data layered on top of PROFILE.equipment so the locker rows
// have more to show — purchase date, next service, swap reminder, etc.
const EQUIPMENT_META = {
  racquet: { purchased: "Mar 2024", nextService: "Restring overdue", lastService: "Mar 3, 2026 · Old Coast Pro Shop", hours: 84, history: [
    { date: "Mar 3, 2026", note: "Restring · Luxilon ALU Power 16L @ 52 lbs" },
    { date: "Oct 14, 2025", note: "Grip replacement · Wilson Pro Overgrip" },
    { date: "Mar 12, 2024", note: "Purchased · Wilson Pro Shop online" }]
  },
  paddle: { purchased: "Nov 2024", nextService: "Active", lastService: null, hours: 26, history: [
    { date: "Nov 2, 2024", note: "Purchased · Joola direct" }]
  },
  shoes: { purchased: "Sep 2025", nextService: "Rotate within 4 weeks", lastService: null, hours: 62, history: [
    { date: "Sep 18, 2025", note: "Purchased · Tennis Warehouse" }]
  },
  bag: { purchased: "Jan 2024", nextService: "Active", lastService: null, hours: 110, history: [
    { date: "Jan 4, 2024", note: "Purchased · Wilson outlet" }]
  },
  string: { purchased: "Feb 2026", nextService: "1.2 reels remaining", lastService: null, hours: 0, history: [
    { date: "Feb 19, 2026", note: "Purchased · Old Coast Pro Shop" }]
  }
};

const EQUIPMENT_SPORTS = ["All", "Tennis", "Pickleball"];

function EquipmentLockerPage({ theme, viewport = "desktop", onBack }) {
  const desktop = viewport === "desktop";
  const [sportFilter, setSportFilter] = React.useState("All");
  const [openId, setOpenId] = React.useState(null);
  // Condition tone → color tokens. Mirrors the chip palette used on the
  // profile carousel so visiting the locker reads as a continuation.
  const toneStyles = {
    good: { color: "#1F8A5B", bg: "rgba(31,138,91,.10)", icon: "Check" },
    warn: { color: "#A06A12", bg: "rgba(160,106,18,.10)", icon: "AlertTriangle" },
    info: { color: "#1F4ED8", bg: "rgba(31,78,216,.08)", icon: "Info" }
  };

  const filtered = PROFILE.equipment.filter((eq) =>
  sportFilter === "All" || eq.sport === sportFilter
  );

  // Stats strip — total items + how many need attention.
  const totalItems = PROFILE.equipment.length;
  const needsAttention = PROFILE.equipment.filter((e) => e.conditionTone === "warn").length;
  const activeCount = PROFILE.equipment.filter((e) => e.conditionTone === "good").length;

  const body =
  <div style={{ display: "flex", flexDirection: "column", gap: desktop ? 28 : 18 }}>
      {/* Top intro — title + subtitle + summary stats row. */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div>
          <h1 style={{
          margin: 0,
          fontFamily: theme.display, fontWeight: 800,
          fontSize: desktop ? 36 : 24,
          letterSpacing: desktop ? -1 : -0.6,
          color: "#0F1214", lineHeight: 1.05
        }}>My Equipment Locker</h1>
          <p style={{
          margin: "8px 0 0", maxWidth: 580,
          fontSize: 14, color: "#4B5052", fontWeight: 500, lineHeight: 1.5
        }}>
            Track racquets, paddles, shoes, and string. Schedule restrings, log service, and reorder gear without leaving CourtReserve.
          </p>
        </div>

        {/* Stats row */}
        <div style={{
        display: "grid",
        gridTemplateColumns: desktop ? "repeat(3, 1fr)" : "repeat(3, 1fr)",
        gap: 0,
        border: "1px solid #E9EBEC",
        borderRadius: 8,
        overflow: "hidden",
        background: "#fff"
      }}>
          {[
        { v: totalItems, l: "In locker" },
        { v: activeCount, l: "Active gear" },
        { v: needsAttention, l: "Needs attention" }].
        map((s, i) =>
        <div key={s.l} style={{
          padding: desktop ? "16px 20px" : "12px 14px",
          borderRight: i < 2 ? "1px solid #E9EBEC" : 0
        }}>
              <div style={{ fontFamily: theme.display, fontWeight: 800, fontSize: desktop ? 24 : 20, letterSpacing: -0.5, color: "#0F1214", lineHeight: 1 }}>{s.v}</div>
              <div style={{ marginTop: 6, fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "#858F8F" }}>{s.l}</div>
            </div>
        )}
        </div>
      </div>

      {/* Sport filter — segmented control. */}
      <div style={{
      display: "inline-flex", padding: 3, background: "#F4F5F6",
      borderRadius: 999, gap: 2, alignSelf: "flex-start",
      overflowX: "auto", maxWidth: "100%"
    }}>
        {EQUIPMENT_SPORTS.map((s) => {
        const on = sportFilter === s;
        return (
          <button key={s} onClick={() => setSportFilter(s)} style={{
            height: 32, padding: "0 14px", borderRadius: 999, border: 0,
            background: on ? "#fff" : "transparent",
            color: on ? "#0F1214" : "#4B5052",
            fontFamily: "inherit", fontSize: 12, fontWeight: on ? 700 : 600,
            boxShadow: on ? "0 1px 2px rgba(15,18,20,.08)" : "none",
            cursor: "pointer", whiteSpace: "nowrap",
            transition: "background 140ms, color 140ms"
          }}>{s}</button>);

      })}
      </div>

      {/* Equipment list — full rows, expandable for service history. */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.map((eq) => {
        const meta = EQUIPMENT_META[eq.id] || {};
        const tone = toneStyles[eq.conditionTone] || toneStyles.good;
        const isOpen = openId === eq.id;
        return (
          <div key={eq.id} style={{
            background: "#fff", border: "1px solid #E9EBEC", borderRadius: 8,
            overflow: "hidden"
          }}>
              {/* Row header — photo placeholder + identity + condition + chevron */}
              <button
              onClick={() => setOpenId(isOpen ? null : eq.id)}
              style={{
                width: "100%", padding: 0, border: 0, background: "transparent",
                cursor: "pointer", fontFamily: "inherit", textAlign: "left",
                display: "grid", gridTemplateColumns: desktop ? "112px 1fr auto" : "84px 1fr auto",
                gap: desktop ? 20 : 12, alignItems: "center"
              }}>
              
                {/* Photo placeholder */}
                <div style={{
                position: "relative",
                width: "100%", aspectRatio: "1 / 1",
                background: eq.surface
              }}>
                  <div style={{
                  position: "absolute", inset: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: theme.display, fontWeight: 900, fontSize: desktop ? 44 : 32, letterSpacing: -2,
                  color: "rgba(15,18,20,.16)", lineHeight: 1
                }}>{eq.brand[0]}</div>
                </div>
                {/* Identity */}
                <div style={{ minWidth: 0, padding: desktop ? "16px 0" : "12px 0" }}>
                  <div style={{
                  fontFamily: "Axiforma", fontWeight: 800, fontSize: 10,
                  letterSpacing: 1.2, textTransform: "uppercase", color: "#858F8F",
                  marginBottom: 4
                }}>{eq.sport}</div>
                  <div style={{
                  fontFamily: theme.display, fontWeight: 700, fontSize: desktop ? 16 : 14,
                  color: "#0F1214", letterSpacing: -0.2, lineHeight: 1.25
                }}>{eq.brand} {eq.name}</div>
                  <div style={{ marginTop: 4, fontSize: 12, color: "#858F8F", fontWeight: 500 }}>{eq.meta}</div>
                  {/* Condition chip */}
                  <div style={{
                  marginTop: 8,
                  display: "inline-flex", alignItems: "center", gap: 5,
                  height: 22, padding: "0 8px", borderRadius: 999,
                  background: tone.bg, color: tone.color,
                  fontSize: 11, fontWeight: 700
                }}>
                    <Icon name={tone.icon} size={11} strokeWidth={2.4} color={tone.color} />
                    {eq.condition}
                  </div>
                </div>
                {/* Chevron + price hint */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, paddingRight: desktop ? 20 : 14 }}>
                  {eq.shopPrice &&
                <div style={{ fontSize: 12, color: "#0F1214", fontWeight: 700, whiteSpace: "nowrap" }}>{eq.shopPrice}</div>
                }
                  <Icon name={isOpen ? "ChevronUp" : "ChevronDown"} size={16} strokeWidth={2} color="#858F8F" />
                </div>
              </button>

              {/* Expanded detail */}
              {isOpen &&
            <div style={{
              borderTop: "1px solid #E9EBEC",
              padding: desktop ? "20px 24px" : "16px 16px",
              display: "grid", gridTemplateColumns: desktop ? "1fr 1fr" : "1fr", gap: 20,
              background: "#FAFAFA"
            }}>
                  {/* Specs */}
                  <div>
                    <div style={{ fontFamily: "Axiforma", fontWeight: 800, fontSize: 10, letterSpacing: 1.4, textTransform: "uppercase", color: "#858F8F", marginBottom: 8 }}>Specs</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {[
                  { l: "Brand", v: eq.brand },
                  { l: "Model", v: eq.name },
                  { l: "Details", v: eq.meta },
                  { l: "Purchased", v: meta.purchased || "—" },
                  { l: "Hours of use", v: meta.hours != null ? `${meta.hours} h` : "—" }].
                  map((row) =>
                  <div key={row.l} style={{ display: "flex", justifyContent: "space-between", gap: 16, fontSize: 13 }}>
                          <span style={{ color: "#858F8F", fontWeight: 500 }}>{row.l}</span>
                          <span style={{ color: "#0F1214", fontWeight: 600, textAlign: "right" }}>{row.v}</span>
                        </div>
                  )}
                    </div>
                  </div>

                  {/* Service history */}
                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                      <div style={{ fontFamily: "Axiforma", fontWeight: 800, fontSize: 10, letterSpacing: 1.4, textTransform: "uppercase", color: "#858F8F" }}>Service history</div>
                      {meta.nextService &&
                  <span style={{ fontSize: 11, fontWeight: 700, color: tone.color }}>{meta.nextService}</span>
                  }
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {(meta.history || []).map((h, i) =>
                  <div key={i} style={{
                    display: "flex", gap: 10,
                    paddingBottom: 8,
                    borderBottom: i < meta.history.length - 1 ? "1px solid #E9EBEC" : 0
                  }}>
                          <span style={{ width: 8, height: 8, borderRadius: 999, background: "#DEE1E5", marginTop: 6, flexShrink: 0 }} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: "#0F1214" }}>{h.date}</div>
                            <div style={{ fontSize: 12, color: "#4B5052", fontWeight: 500, marginTop: 2 }}>{h.note}</div>
                          </div>
                        </div>
                  )}
                    </div>

                    {/* Action row */}
                    <div style={{ marginTop: 14, display: "flex", flexWrap: "wrap", gap: 8 }}>
                      <button style={{
                    height: 36, padding: "0 14px", borderRadius: 8, border: 0,
                    background: "#0F1214", color: "#fff",
                    fontFamily: "inherit", fontWeight: 700, fontSize: 12,
                    cursor: "pointer",
                    display: "inline-flex", alignItems: "center", gap: 6
                  }}>
                        <Icon name={eq.ctaIcon || "ArrowRight"} size={12} strokeWidth={2.2} color="#fff" />
                        {eq.ctaLabel || "Service this item"}
                      </button>
                      <button style={{
                    height: 36, padding: "0 14px", borderRadius: 8,
                    border: "1px solid #DEE1E5", background: "#fff", color: "#0F1214",
                    fontFamily: "inherit", fontWeight: 600, fontSize: 12,
                    cursor: "pointer"
                  }}>Log service</button>
                      <button style={{
                    height: 36, padding: "0 14px", borderRadius: 8,
                    border: "1px solid #DEE1E5", background: "#fff", color: "#0F1214",
                    fontFamily: "inherit", fontWeight: 600, fontSize: 12,
                    cursor: "pointer"
                  }}>Edit details</button>
                    </div>
                  </div>
                </div>
            }
            </div>);

      })}

        {/* Add new item — final dashed card */}
        <button
        onClick={() => {if (window.__navigateAddEquipment) window.__navigateAddEquipment();}}
        style={{
          background: "transparent",
          border: "1.5px dashed #DEE1E5",
          borderRadius: 8,
          padding: desktop ? "18px" : "16px",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          cursor: "pointer", fontFamily: "inherit",
          color: "#4B5052", fontSize: 14, fontWeight: 600
        }}>
          <Icon name="Plus" size={16} strokeWidth={2} color="#4B5052" />
          Add equipment to your locker
        </button>
      </div>
    </div>;


  // Page shell mirrors the Profile page: desktop renders inside the
  // dashboard chrome wrapper, mobile gets its own top bar.
  if (desktop) {
    return (
      <div style={{ maxWidth: 920, margin: "0 auto", padding: "32px 32px 64px" }}>
        {/* Back affordance */}
        <button
          onClick={onBack}
          style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            height: 32, padding: "0 12px 0 8px", borderRadius: 6,
            background: "transparent", border: 0, cursor: "pointer",
            color: "#4B5052", fontFamily: "inherit", fontWeight: 600, fontSize: 13,
            marginBottom: 16
          }}
          onMouseEnter={(e) => {e.currentTarget.style.background = "#F4F5F6";}}
          onMouseLeave={(e) => {e.currentTarget.style.background = "transparent";}}>
          
          <Icon name="ChevronLeft" size={16} strokeWidth={2} color="#4B5052" />
          Back to profile
        </button>
        {body}
      </div>);

  }

  // Mobile — full screen with sticky top bar + bottom nav.
  return (
    <div style={{
      background: "#fff", flex: 1, display: "flex", flexDirection: "column",
      minHeight: 0, fontFamily: "Inter, system-ui, sans-serif", position: "relative"
    }}>
      <div style={{
        background: "#fff", height: 52, flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 12px",
        borderBottom: "1px solid #E9EBEC"
      }}>
        <button onClick={onBack} aria-label="Back" style={{
          display: "inline-flex", alignItems: "center", gap: 4,
          height: 36, padding: "0 8px 0 4px", borderRadius: 6,
          background: "transparent", border: 0, cursor: "pointer",
          color: "#0F1214", fontFamily: "inherit", fontWeight: 600, fontSize: 13
        }}>
          <Icon name="ChevronLeft" size={18} strokeWidth={2} color="#0F1214" />
          Back
        </button>
        <div style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 14, letterSpacing: -0.2, color: "#0F1214" }}>Equipment Locker</div>
        <div style={{ width: 56 }} aria-hidden />
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 24px" }}>
        {body}
      </div>
      {window.MobileBottomNav &&
      <div style={{ flexShrink: 0 }}>
          <window.MobileBottomNav theme={theme} flow={true} active="profile"
        onChange={(k) => {
          if (k === "profile" && window.__navigateProfile) {window.__navigateProfile();return;}
          if (window.__navigateMobile) window.__navigateMobile(k);
        }} />
        </div>
      }
    </div>);

}

// ─────────────────────────────────────────────────────────────────────────
// Add Equipment page — the destination behind "Add equipment to your
// locker." Type selector at the top picks the form variant (racquet/
// paddle, shoes, bag, string); each variant shows the appropriate fields
// using the same input + sport-pill primitives as the rest of the app.
// Save returns to the locker; Cancel is the back button.
// ─────────────────────────────────────────────────────────────────────────

const EQUIPMENT_TYPES = [
{ id: "racquet", label: "Racquet or Paddle", icon: "Swords", title: "Add Racquet or Paddle" },
{ id: "shoes", label: "Shoes", icon: "Footprints", title: "Add Shoes" },
{ id: "bag", label: "Bag", icon: "Briefcase", title: "Add Bag" },
{ id: "string", label: "String / Reel", icon: "Layers", title: "Add String or Reel" }];


// Tiny field label + helper utility.
function FormField({ label, optional, children }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span style={{ fontSize: 13, color: "#4B5052", fontWeight: 600 }}>
        {label}{optional && <span style={{ color: "#858F8F", fontWeight: 500 }}> (optional)</span>}
      </span>
      {children}
    </label>);

}

// Same chrome as the EquipmentLockerPage so the two pages feel like
// siblings inside the settings flow.
function EquipmentAddPage({ theme, viewport = "desktop", onBack }) {
  const desktop = viewport === "desktop";
  const [type, setType] = React.useState("racquet");
  const [sport, setSport] = React.useState("Tennis");
  // Common fields (kept in one bag so toggling type doesn't lose user
  // input that's still relevant).
  const [name, setName] = React.useState("");
  const [specs, setSpecs] = React.useState("");
  const [lastService, setLastService] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [size, setSize] = React.useState("");
  const [purchased, setPurchased] = React.useState("");
  const [stringTension, setStringTension] = React.useState("");

  const typeMeta = EQUIPMENT_TYPES.find((t) => t.id === type) || EQUIPMENT_TYPES[0];

  // Save is a stub — in a real app this would post to the locker; here
  // we just return to the locker so the prototype flow lands. The user
  // can wire actual storage later.
  const canSave = name.trim().length > 0;
  const onSave = () => {if (canSave) onBack && onBack();};

  const inputStyle = {
    width: "100%", height: 44, padding: "0 14px",
    background: "#fff", border: "1px solid #DEE1E5", borderRadius: 999,
    fontFamily: "inherit", fontSize: 14, fontWeight: 500, color: "#0F1214",
    outline: "none"
  };

  // Pill chip identical visual treatment to the locker's sport filter so
  // the form feels native. Selected = brand-primary fill + white text.
  const PillChip = ({ label, selected, onClick }) =>
  <button
    type="button"
    onClick={onClick}
    style={{
      height: 36, padding: "0 18px", borderRadius: 999,
      background: selected ? theme.primary : "#fff",
      color: selected ? "#fff" : "#0F1214",
      border: selected ? `1px solid ${theme.primary}` : "1px solid #DEE1E5",
      fontFamily: "inherit", fontSize: 14, fontWeight: selected ? 700 : 600,
      cursor: "pointer", whiteSpace: "nowrap",
      transition: "background 140ms, border-color 140ms, color 140ms"
    }}>
    {label}</button>;


  // Per-type field set. Keeps the page focused on what's relevant.
  const fields = (() => {
    if (type === "racquet") {
      return (
        <React.Fragment>
          <FormField label="Equipment name">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Wilson Blade 98 v9" style={inputStyle} />
          </FormField>
          <FormField label="String pattern · Weight · Grip size">
            <input value={specs} onChange={(e) => setSpecs(e.target.value)} placeholder="e.g. 16×19 · 305g · 4 3/8" style={inputStyle} />
          </FormField>
          {sport === "Tennis" &&
          <FormField label="String tension" optional>
              <input value={stringTension} onChange={(e) => setStringTension(e.target.value)} placeholder="e.g. 52 lbs" style={inputStyle} />
            </FormField>
          }
          <FormField label="Last restrung" optional>
            <input type="date" value={lastService} onChange={(e) => setLastService(e.target.value)} style={inputStyle} />
          </FormField>
        </React.Fragment>);

    }
    if (type === "shoes") {
      return (
        <React.Fragment>
          <FormField label="Model name">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Asics Gel-Resolution 9" style={inputStyle} />
          </FormField>
          <FormField label="Size">
            <input value={size} onChange={(e) => setSize(e.target.value)} placeholder="e.g. 10.5" style={inputStyle} />
          </FormField>
          <FormField label="Purchased" optional>
            <input type="date" value={purchased} onChange={(e) => setPurchased(e.target.value)} style={inputStyle} />
          </FormField>
        </React.Fragment>);

    }
    if (type === "bag") {
      return (
        <React.Fragment>
          <FormField label="Bag name">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Wilson Pro Staff 9-Pack" style={inputStyle} />
          </FormField>
          <FormField label="Capacity · Type" optional>
            <input value={specs} onChange={(e) => setSpecs(e.target.value)} placeholder="e.g. 9 racquets · Thermo" style={inputStyle} />
          </FormField>
          <FormField label="Purchased" optional>
            <input type="date" value={purchased} onChange={(e) => setPurchased(e.target.value)} style={inputStyle} />
          </FormField>
        </React.Fragment>);

    }
    // string / reel
    return (
      <React.Fragment>
        <FormField label="String / reel name">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Luxilon ALU Power 16L" style={inputStyle} />
        </FormField>
        <FormField label="Gauge · Type" optional>
          <input value={specs} onChange={(e) => setSpecs(e.target.value)} placeholder="e.g. 1.25mm · Polyester" style={inputStyle} />
        </FormField>
        <FormField label="Reels remaining" optional>
          <input value={size} onChange={(e) => setSize(e.target.value)} placeholder="e.g. 1.2" style={inputStyle} />
        </FormField>
      </React.Fragment>);

  })();

  const body =
  <div style={{ display: "flex", flexDirection: "column", gap: desktop ? 24 : 18 }}>
      <div>
        <h1 style={{
        margin: 0,
        fontFamily: theme.display, fontWeight: 800,
        fontSize: desktop ? 32 : 22,
        letterSpacing: desktop ? -0.8 : -0.5,
        color: "#0F1214", lineHeight: 1.1
      }}>{typeMeta.title}</h1>
        <p style={{ margin: "6px 0 0", fontSize: 13, color: "#858F8F", fontWeight: 500 }}>
          Track this item in your locker so you can schedule service, reorder, and show it on your profile.
        </p>
      </div>

      {/* Equipment type — segmented control matching the locker filter. */}
      <FormField label="Equipment type">
        <div style={{
        display: "inline-flex", padding: 3, background: "#F4F5F6",
        borderRadius: 999, gap: 2, alignSelf: "flex-start",
        overflowX: "auto", maxWidth: "100%"
      }}>
          {EQUIPMENT_TYPES.map((t) => {
          const on = type === t.id;
          return (
            <button key={t.id} onClick={() => setType(t.id)} style={{
              height: 32, padding: "0 14px", borderRadius: 999, border: 0,
              background: on ? "#fff" : "transparent",
              color: on ? "#0F1214" : "#4B5052",
              fontFamily: "inherit", fontSize: 12, fontWeight: on ? 700 : 600,
              boxShadow: on ? "0 1px 2px rgba(15,18,20,.08)" : "none",
              cursor: "pointer", whiteSpace: "nowrap",
              display: "inline-flex", alignItems: "center", gap: 6
            }}>
                <Icon name={t.icon} size={13} strokeWidth={1.8} color={on ? "#0F1214" : "#4B5052"} />
                {t.label}
              </button>);

        })}
        </div>
      </FormField>

      {/* Sport picker — pill chips, matching the reference screenshot. */}
      <FormField label="Sport">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          <PillChip label="Tennis" selected={sport === "Tennis"} onClick={() => setSport("Tennis")} />
          <PillChip label="Pickleball" selected={sport === "Pickleball"} onClick={() => setSport("Pickleball")} />
        </div>
      </FormField>

      {fields}

      <FormField label="Notes" optional>
        <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="String tension, customizations, etc."
        rows={4}
        style={{
          width: "100%", padding: "12px 14px",
          background: "#fff", border: "1px solid #DEE1E5", borderRadius: 12,
          fontFamily: "inherit", fontSize: 14, fontWeight: 500, color: "#0F1214",
          outline: "none", resize: "vertical", minHeight: 88
        }} />
      </FormField>

      {/* Action row — Save left-fills as the primary CTA, Cancel is the
        quieter sibling. Equal width to match other modal patterns. */}
      <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
        <button onClick={onBack} style={{
        flex: 1, height: 48, borderRadius: 999, border: "1px solid #DEE1E5",
        background: "#fff", color: "#0F1214",
        fontFamily: "inherit", fontWeight: 600, fontSize: 14, cursor: "pointer"
      }}>Cancel</button>
        <button onClick={onSave} disabled={!canSave} style={{
        flex: 1, height: 48, borderRadius: 999, border: 0,
        background: canSave ? "#0F1214" : "#E9EBEC",
        color: canSave ? "#fff" : "#BBBFC1",
        fontFamily: "inherit", fontWeight: 700, fontSize: 14,
        cursor: canSave ? "pointer" : "not-allowed"
      }}>Save to locker</button>
      </div>
    </div>;


  // Same page shell as EquipmentLockerPage so the back chevron and
  // mobile top bar feel identical.
  if (desktop) {
    return (
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 32px 64px" }}>
        <button
          onClick={onBack}
          style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            height: 32, padding: "0 12px 0 8px", borderRadius: 6,
            background: "transparent", border: 0, cursor: "pointer",
            color: "#4B5052", fontFamily: "inherit", fontWeight: 600, fontSize: 13,
            marginBottom: 16
          }}
          onMouseEnter={(e) => {e.currentTarget.style.background = "#F4F5F6";}}
          onMouseLeave={(e) => {e.currentTarget.style.background = "transparent";}}>
          
          <Icon name="ChevronLeft" size={16} strokeWidth={2} color="#4B5052" />
          Back to locker
        </button>
        {body}
      </div>);

  }
  return (
    <div style={{
      background: "#fff", flex: 1, display: "flex", flexDirection: "column",
      minHeight: 0, fontFamily: "Inter, system-ui, sans-serif", position: "relative"
    }}>
      <div style={{
        background: "#fff", height: 52, flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 12px",
        borderBottom: "1px solid #E9EBEC"
      }}>
        <button onClick={onBack} aria-label="Back" style={{
          display: "inline-flex", alignItems: "center", gap: 4,
          height: 36, padding: "0 8px 0 4px", borderRadius: 6,
          background: "transparent", border: 0, cursor: "pointer",
          color: "#0F1214", fontFamily: "inherit", fontWeight: 600, fontSize: 13
        }}>
          <Icon name="ChevronLeft" size={18} strokeWidth={2} color="#0F1214" />
          Back
        </button>
        <div style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 14, letterSpacing: -0.2, color: "#0F1214" }}>{typeMeta.title}</div>
        <div style={{ width: 56 }} aria-hidden />
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 24px" }}>
        {body}
      </div>
    </div>);

}

// ─────────────────────────────────────────────────────────────────────────
// Privacy & Security page — destination for the "Privacy and Security"
// settings menu item. Profile Privacy section with three radio groups:
// who can view, who can find me, and how I appear. Same chrome as the
// other settings destinations (back chevron, top bar, mobile / desktop
// variants).
// ─────────────────────────────────────────────────────────────────────────
const PRIVACY_VIEW_OPTIONS = [
{ id: "anyone", label: "Anyone on CourtReserve", sub: "Any CourtReserve player can view your profile." },
{ id: "conns", label: "My Connections only", sub: "Only players you've connected with can view your profile." },
{ id: "mutual", label: "Mutual Connections only", sub: "Only players you and someone else both know can view your profile." },
{ id: "none", label: "No One", sub: "Your profile is invisible unless you share a club with someone." }];

const PRIVACY_FIND_OPTIONS = [
{ id: "anyone", label: "Anyone", sub: "Appears in club directories and platform-wide search." },
{ id: "clubs", label: "Anyone in my clubs only", sub: "Only co-members at your clubs can find you." },
{ id: "none", label: "No one", sub: "Not searchable. Not suggested. You'll need to share your profile link directly." }];

const PRIVACY_DISPLAY_OPTIONS = [
{ id: "full", label: "Full name", sub: "Neil Christensen" },
{ id: "initial", label: "First + last initial", sub: "Neil C." },
{ id: "initials", label: "Initials only", sub: "N. C." }];


// Radio row reused across all three groups. Selected = filled brand-green
// dot inside a hairline ring; unselected = empty hairline ring.
function PrivacyRadioRow({ option, selected, onSelect, theme }) {
  return (
    <button
      onClick={() => onSelect(option.id)}
      style={{
        width: "100%", padding: "14px 0",
        background: "transparent", border: 0, cursor: "pointer",
        display: "flex", alignItems: "flex-start", gap: 14,
        textAlign: "left", fontFamily: "inherit"
      }}>
      
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
          <span style={{
            fontFamily: "inherit", fontWeight: 700, fontSize: 14, color: "#0F1214", letterSpacing: -0.1
          }}>{option.label}</span>
          {/* Optional secondary text rendered inline (e.g. the display
                name preview "Neil Christensen" next to "Full name"). */}
        </div>
        <div style={{
          marginTop: 2,
          fontSize: 13, color: "#858F8F", fontWeight: 500, lineHeight: 1.4
        }}>{option.sub}</div>
      </div>
      {/* Custom radio — outlined when unselected, brand-green filled
            when selected to match the reference screenshot. */}
      <span style={{
        width: 22, height: 22, borderRadius: 999, flexShrink: 0,
        background: "transparent",
        border: `2px solid ${selected ? theme.primary || "#1F8A5B" : "#DEE1E5"}`,
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        transition: "border-color 140ms"
      }}>
        {selected &&
        <span style={{ width: 10, height: 10, borderRadius: 999, background: theme.primary || "#1F8A5B" }} />
        }
      </span>
    </button>);

}

function PrivacySection({ title, sub, options, value, onChange, theme }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{
        fontFamily: "Axiforma", fontWeight: 800, fontSize: 11,
        letterSpacing: 1.4, textTransform: "uppercase", color: "#858F8F",
        marginBottom: sub ? 8 : 12
      }}>{title}</div>
      {sub &&
      <p style={{
        margin: "0 0 8px", maxWidth: 560,
        fontSize: 13, color: "#858F8F", fontWeight: 500, lineHeight: 1.5
      }}>{sub}</p>
      }
      <div style={{ display: "flex", flexDirection: "column" }}>
        {options.map((opt, i) =>
        <React.Fragment key={opt.id}>
            <PrivacyRadioRow option={opt} selected={value === opt.id} onSelect={onChange} theme={theme} />
            {i < options.length - 1 && <div style={{ height: 1, background: "#E9EBEC" }} />}
          </React.Fragment>
        )}
      </div>
    </div>);

}

function ProfilePrivacyPage({ theme, viewport = "desktop", onBack }) {
  const desktop = viewport === "desktop";
  const [whoCanView, setWhoCanView] = React.useState("anyone");
  const [whoCanFind, setWhoCanFind] = React.useState("clubs");
  const [displayName, setDisplayName] = React.useState("initial");

  const body =
  <div style={{ display: "flex", flexDirection: "column", gap: desktop ? 32 : 22 }}>
      <div>
        <h1 style={{
        margin: 0,
        fontFamily: theme.display, fontWeight: 800,
        fontSize: desktop ? 32 : 22,
        letterSpacing: desktop ? -0.8 : -0.5,
        color: "#0F1214", lineHeight: 1.1
      }}>Profile Privacy</h1>
        <p style={{ margin: "10px 0 0", maxWidth: 580, fontSize: 14, color: "#4B5052", fontWeight: 500, lineHeight: 1.5 }}>
          Control what others see when they view your profile, and who can find you on CourtReserve.
        </p>
        <a href="#" style={{
        marginTop: 10, display: "inline-flex", alignItems: "center", gap: 4,
        color: theme.primary || "#1F8A5B", fontWeight: 700, fontSize: 13, textDecoration: "none"
      }}>
          Learn more about Privacy
        </a>
      </div>

      {/* Preview card — soft brand tint, lead with the eye icon. */}
      <button style={{
      display: "flex", alignItems: "center", gap: 14,
      padding: "16px 18px", borderRadius: 12,
      border: 0,
      cursor: "pointer", textAlign: "left", fontFamily: "inherit", background: "rgb(244, 245, 246)"
    }}>
        <span style={{
        width: 40, height: 40, borderRadius: 999, flexShrink: 0,

        display: "inline-flex", alignItems: "center", justifyContent: "center", background: "rgb(111, 116, 118)"
      }}>
          <Icon name="Eye" size={18} strokeWidth={1.8} color="#FFFFFF" />
        </span>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: "block", fontFamily: "inherit", fontWeight: 700, fontSize: 14, color: "#0F1214" }}>
            Preview my profile
          </span>
          <span style={{ display: "block", marginTop: 2, fontSize: 12, color: "#4B5052", fontWeight: 500 }}>
            See exactly how your profile appears to others
          </span>
        </span>
        <Icon name="ChevronRight" size={16} strokeWidth={2} color="#4B5052" />
      </button>

      <PrivacySection
      title="Who can view my profile"
      options={PRIVACY_VIEW_OPTIONS}
      value={whoCanView}
      onChange={setWhoCanView}
      theme={theme} />
    
      <PrivacySection
      title="Who can find me"
      sub="This is separate from who can view you. Find = appearing in search, directories, and suggestions."
      options={PRIVACY_FIND_OPTIONS}
      value={whoCanFind}
      onChange={setWhoCanFind}
      theme={theme} />
    
      <PrivacySection
      title="How I appear"
      sub="Display name"
      options={PRIVACY_DISPLAY_OPTIONS}
      value={displayName}
      onChange={setDisplayName}
      theme={theme} />
    
    </div>;


  // Page shell — mirrors EquipmentLockerPage / EquipmentAddPage so the
  // settings flow reads as one cohesive surface.
  if (desktop) {
    return (
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 32px 64px" }}>
        <button
          onClick={onBack}
          style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            height: 32, padding: "0 12px 0 8px", borderRadius: 6,
            background: "transparent", border: 0, cursor: "pointer",
            color: theme.primary || "#1F8A5B", fontFamily: "inherit", fontWeight: 700, fontSize: 13,
            marginBottom: 16
          }}
          onMouseEnter={(e) => {e.currentTarget.style.background = "rgba(31,138,91,.08)";}}
          onMouseLeave={(e) => {e.currentTarget.style.background = "transparent";}}>
          
          <Icon name="ChevronLeft" size={16} strokeWidth={2} color={theme.primary || "#1F8A5B"} />
          Privacy and Security
        </button>
        {body}
      </div>);

  }
  return (
    <div style={{
      background: "#fff", flex: 1, display: "flex", flexDirection: "column",
      minHeight: 0, fontFamily: "Inter, system-ui, sans-serif", position: "relative"
    }}>
      <div style={{
        background: "#fff", height: 52, flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 12px",
        borderBottom: "1px solid #E9EBEC"
      }}>
        <button onClick={onBack} aria-label="Back" style={{
          display: "inline-flex", alignItems: "center", gap: 4,
          height: 36, padding: "0 8px 0 4px", borderRadius: 6,
          background: "transparent", border: 0, cursor: "pointer",
          color: theme.primary || "#1F8A5B", fontFamily: "inherit", fontWeight: 700, fontSize: 13
        }}>
          <Icon name="ChevronLeft" size={18} strokeWidth={2} color={theme.primary || "#1F8A5B"} />
          Privacy and Security
        </button>
        <div style={{ width: 56 }} aria-hidden />
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 24px" }}>
        {body}
      </div>
    </div>);

}

Object.assign(window, { ProfilePage, ProfileDropdown, SettingsSheet, SettingsList, EquipmentLockerPage, EquipmentAddPage, PrivacySecurityPage, ProfilePrivacyPage, PasswordPage, TwoFactorPage });

// ─────────────────────────────────────────────────────────────────────────
// Privacy & Security landing — 3 menu rows that route to dedicated pages
// (Profile Privacy, Password, Two-Factor Authentication). Same chrome as
// the rest of the settings flow.
// ─────────────────────────────────────────────────────────────────────────
function PrivacySecurityPage({ theme, viewport = "desktop", onBack }) {
  const desktop = viewport === "desktop";
  const rows = [
    {
      id: "profile-privacy",
      icon: "Eye",
      label: "Profile Privacy",
      sub: "Who can view and find you, what they see",
      onClick: () => window.__navigateProfilePrivacy && window.__navigateProfilePrivacy(),
    },
    {
      id: "password",
      icon: "Lock",
      label: "Password",
      sub: "Change your account password",
      onClick: () => window.__navigatePassword && window.__navigatePassword(),
    },
    {
      id: "two-factor",
      icon: "ShieldX",
      label: "Two-Factor Authentication",
      sub: "Add an extra layer of account security",
      onClick: () => window.__navigateTwoFactor && window.__navigateTwoFactor(),
    },
  ];

  const body = (
    <div style={{ display: "flex", flexDirection: "column", gap: desktop ? 24 : 18 }}>
      <div>
        <h1 style={{
          margin: 0,
          fontFamily: theme.display, fontWeight: 800,
          fontSize: desktop ? 32 : 22,
          letterSpacing: desktop ? -0.8 : -0.5,
          color: "#0F1214", lineHeight: 1.1,
        }}>Privacy and Security</h1>
        <p style={{ margin: "10px 0 0", maxWidth: 580, fontSize: 14, color: "#858F8F", fontWeight: 500, lineHeight: 1.5 }}>
          Manage your account security and control what others can see about you.
        </p>
      </div>

      {/* Section list — 3 menu rows in a clean column. */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        {rows.map((row) => (
          <button
            key={row.id}
            onClick={row.onClick}
            style={{
              width: "100%", padding: "16px 0",
              background: "transparent", border: 0, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 16,
              textAlign: "left", fontFamily: "inherit",
            }}
          >
            <span style={{
              width: 44, height: 44, borderRadius: 10, flexShrink: 0,
              background: "#F4F5F6",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
            }}>
              <Icon name={row.icon} size={18} strokeWidth={1.8} color="#4B5052" />
            </span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: "block", fontFamily: "inherit", fontWeight: 700, fontSize: 15, color: "#0F1214", letterSpacing: -0.1 }}>
                {row.label}
              </span>
              <span style={{ display: "block", marginTop: 2, fontSize: 13, color: "#858F8F", fontWeight: 500 }}>
                {row.sub}
              </span>
            </span>
            <Icon name="ChevronRight" size={16} strokeWidth={1.8} color="#BBBFC1" />
          </button>
        ))}
      </div>
    </div>
  );

  if (desktop) {
    return (
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 32px 64px" }}>
        <button
          onClick={onBack}
          style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            height: 32, padding: "0 12px 0 8px", borderRadius: 6,
            background: "transparent", border: 0, cursor: "pointer",
            color: theme.primary || "#1F8A5B", fontFamily: "inherit", fontWeight: 700, fontSize: 13,
            marginBottom: 16,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(31,138,91,.08)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
        >
          <Icon name="ChevronLeft" size={16} strokeWidth={2} color={theme.primary || "#1F8A5B"} />
          Settings
        </button>
        {body}
      </div>
    );
  }
  return (
    <div style={{
      background: "#fff", flex: 1, display: "flex", flexDirection: "column",
      minHeight: 0, fontFamily: "Inter, system-ui, sans-serif", position: "relative",
    }}>
      <div style={{
        background: "#fff", height: 52, flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 12px",
        borderBottom: "1px solid #E9EBEC",
      }}>
        <button onClick={onBack} aria-label="Back" style={{
          display: "inline-flex", alignItems: "center", gap: 4,
          height: 36, padding: "0 8px 0 4px", borderRadius: 6,
          background: "transparent", border: 0, cursor: "pointer",
          color: theme.primary || "#1F8A5B", fontFamily: "inherit", fontWeight: 700, fontSize: 13,
        }}>
          <Icon name="ChevronLeft" size={18} strokeWidth={2} color={theme.primary || "#1F8A5B"} />
          Settings
        </button>
        <div style={{ width: 56 }} aria-hidden />
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 24px" }}>
        {body}
      </div>
    </div>
  );
}

// Shared back-bar utility for the password + 2FA pages — keeps the
// "< Privacy and Security" affordance consistent across both children.
function PrivacyChildShell({ theme, viewport, onBack, title, children }) {
  const desktop = viewport === "desktop";
  if (desktop) {
    return (
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 32px 64px" }}>
        <button
          onClick={onBack}
          style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            height: 32, padding: "0 12px 0 8px", borderRadius: 6,
            background: "transparent", border: 0, cursor: "pointer",
            color: theme.primary || "#1F8A5B", fontFamily: "inherit", fontWeight: 700, fontSize: 13,
            marginBottom: 16,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(31,138,91,.08)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
        >
          <Icon name="ChevronLeft" size={16} strokeWidth={2} color={theme.primary || "#1F8A5B"} />
          Privacy and Security
        </button>
        <h1 style={{
          margin: 0, marginBottom: 18,
          fontFamily: theme.display, fontWeight: 800,
          fontSize: 32, letterSpacing: -0.8,
          color: "#0F1214", lineHeight: 1.1,
        }}>{title}</h1>
        {children}
      </div>
    );
  }
  return (
    <div style={{
      background: "#fff", flex: 1, display: "flex", flexDirection: "column",
      minHeight: 0, fontFamily: "Inter, system-ui, sans-serif", position: "relative",
    }}>
      <div style={{
        background: "#fff", height: 52, flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 12px",
        borderBottom: "1px solid #E9EBEC",
      }}>
        <button onClick={onBack} aria-label="Back" style={{
          display: "inline-flex", alignItems: "center", gap: 4,
          height: 36, padding: "0 8px 0 4px", borderRadius: 6,
          background: "transparent", border: 0, cursor: "pointer",
          color: theme.primary || "#1F8A5B", fontFamily: "inherit", fontWeight: 700, fontSize: 13,
        }}>
          <Icon name="ChevronLeft" size={18} strokeWidth={2} color={theme.primary || "#1F8A5B"} />
          Privacy and Security
        </button>
        <div style={{ width: 56 }} aria-hidden />
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 24px" }}>
        <h1 style={{
          margin: "0 0 14px 0",
          fontFamily: theme.display, fontWeight: 800,
          fontSize: 22, letterSpacing: -0.5,
          color: "#0F1214", lineHeight: 1.1,
        }}>{title}</h1>
        {children}
      </div>
    </div>
  );
}

// Password — current + new + confirm fields with a save row.
function PasswordPage({ theme, viewport = "desktop", onBack }) {
  const [cur, setCur] = React.useState("");
  const [next, setNext] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const canSave = next.length >= 8 && next === confirm && cur.length > 0;
  const input = {
    width: "100%", height: 44, padding: "0 14px",
    background: "#fff", border: "1px solid #DEE1E5", borderRadius: 999,
    fontFamily: "inherit", fontSize: 14, fontWeight: 500, color: "#0F1214",
    outline: "none",
  };
  return (
    <PrivacyChildShell theme={theme} viewport={viewport} onBack={onBack} title="Password">
      <p style={{ margin: "0 0 18px", maxWidth: 520, fontSize: 14, color: "#858F8F", fontWeight: 500, lineHeight: 1.5 }}>
        Use at least 8 characters. Pick something you don't use elsewhere — a mix of letters, numbers, and symbols is strongest.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <FormField label="Current password">
          <input type="password" value={cur} onChange={(e) => setCur(e.target.value)} style={input} />
        </FormField>
        <FormField label="New password">
          <input type="password" value={next} onChange={(e) => setNext(e.target.value)} style={input} />
        </FormField>
        <FormField label="Confirm new password">
          <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} style={input} />
        </FormField>
        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          <button onClick={onBack} style={{
            flex: 1, height: 48, borderRadius: 999, border: "1px solid #DEE1E5",
            background: "#fff", color: "#0F1214",
            fontFamily: "inherit", fontWeight: 600, fontSize: 14, cursor: "pointer",
          }}>Cancel</button>
          <button onClick={onBack} disabled={!canSave} style={{
            flex: 1, height: 48, borderRadius: 999, border: 0,
            background: canSave ? "#0F1214" : "#E9EBEC",
            color: canSave ? "#fff" : "#BBBFC1",
            fontFamily: "inherit", fontWeight: 700, fontSize: 14,
            cursor: canSave ? "pointer" : "not-allowed",
          }}>Update password</button>
        </div>
      </div>
    </PrivacyChildShell>
  );
}

// Two-Factor Authentication — toggle row + method picker. Stays as a
// scaffold; real verification flow isn't wired.
function TwoFactorPage({ theme, viewport = "desktop", onBack }) {
  const [enabled, setEnabled] = React.useState(false);
  const [method, setMethod] = React.useState("authenticator");
  const methods = [
    { id: "authenticator", label: "Authenticator app", sub: "Generate codes with Google Authenticator, Authy, or 1Password.", icon: "Smartphone" },
    { id: "sms", label: "Text message", sub: "We'll send a 6-digit code to your phone every time you sign in.", icon: "MessageSquare" },
    { id: "email", label: "Email", sub: "We'll email a 6-digit code to your account when needed.", icon: "Mail" },
  ];
  return (
    <PrivacyChildShell theme={theme} viewport={viewport} onBack={onBack} title="Two-Factor Authentication">
      <p style={{ margin: "0 0 18px", maxWidth: 520, fontSize: 14, color: "#858F8F", fontWeight: 500, lineHeight: 1.5 }}>
        Add an extra layer of account security by requiring a one-time code in addition to your password when you sign in.
      </p>

      {/* Master toggle row */}
      <div style={{
        display: "flex", alignItems: "center", gap: 14,
        padding: "14px 16px", borderRadius: 12,
        background: "#F4F5F6",
        marginBottom: 18,
      }}>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: "block", fontFamily: "inherit", fontWeight: 700, fontSize: 14, color: "#0F1214" }}>
            Two-factor authentication
          </span>
          <span style={{ display: "block", marginTop: 2, fontSize: 12, color: "#858F8F", fontWeight: 500 }}>
            {enabled ? `Enabled · ${methods.find(m => m.id === method)?.label}` : "Disabled"}
          </span>
        </span>
        <button
          onClick={() => setEnabled(!enabled)}
          aria-label={enabled ? "Disable 2FA" : "Enable 2FA"}
          role="switch" aria-checked={enabled}
          style={{
            width: 48, height: 28, borderRadius: 999, border: 0,
            background: enabled ? "#1F8A5B" : "#D6D9DA",
            position: "relative", cursor: "pointer",
            transition: "background 160ms",
          }}
        >
          <span style={{
            position: "absolute", top: 3,
            left: enabled ? 23 : 3,
            width: 22, height: 22, borderRadius: 999,
            background: "#fff",
            transition: "left 160ms",
            boxShadow: "0 1px 2px rgba(0,0,0,0.12)",
          }} />
        </button>
      </div>

      {/* Method picker — only meaningful when enabled. */}
      <div style={{ display: "flex", flexDirection: "column", opacity: enabled ? 1 : 0.55 }}>
        <div style={{
          fontFamily: "Axiforma", fontWeight: 800, fontSize: 11,
          letterSpacing: 1.4, textTransform: "uppercase", color: "#858F8F",
          marginBottom: 8,
        }}>Verification method</div>
        {methods.map((m, i) => (
          <React.Fragment key={m.id}>
            <button
              disabled={!enabled}
              onClick={() => setMethod(m.id)}
              style={{
                width: "100%", padding: "14px 0",
                background: "transparent", border: 0,
                cursor: enabled ? "pointer" : "not-allowed",
                display: "flex", alignItems: "center", gap: 14,
                textAlign: "left", fontFamily: "inherit",
              }}
            >
              <span style={{
                width: 36, height: 36, borderRadius: 999, flexShrink: 0,
                background: "#F4F5F6",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon name={m.icon} size={16} strokeWidth={1.8} color="#4B5052" />
              </span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: "block", fontFamily: "inherit", fontWeight: 700, fontSize: 14, color: "#0F1214" }}>{m.label}</span>
                <span style={{ display: "block", marginTop: 2, fontSize: 12, color: "#858F8F", fontWeight: 500, lineHeight: 1.4 }}>{m.sub}</span>
              </span>
              {/* Radio — outlined / brand-filled like ProfilePrivacy. */}
              <span style={{
                width: 22, height: 22, borderRadius: 999, flexShrink: 0,
                background: "transparent",
                border: `2px solid ${method === m.id ? theme.primary || "#1F8A5B" : "#DEE1E5"}`,
                display: "inline-flex", alignItems: "center", justifyContent: "center",
              }}>
                {method === m.id && (
                  <span style={{ width: 10, height: 10, borderRadius: 999, background: theme.primary || "#1F8A5B" }} />
                )}
              </span>
            </button>
            {i < methods.length - 1 && <div style={{ height: 1, background: "#E9EBEC" }} />}
          </React.Fragment>
        ))}
      </div>
    </PrivacyChildShell>
  );
}

// ---------------------------------------------------------------------------
// EditProfileSheet — bottom-sheet for editing display name, location,
// sports, bio, and privacy. Email / phone / address are intentionally
// excluded — those are managed under Settings → My Account, per the
// helper banner inside the sheet.
// ---------------------------------------------------------------------------
function EditProfileSheet({ theme, onClose }) {
  const [displayName, setDisplayName] = useStateP(PROFILE.name);
  const [location, setLocation] = useStateP(PROFILE.location);
  const [bio, setBio] = useStateP(PROFILE.bio);
  const [sports, setSports] = useStateP(new Set(PROFILE.sports.filter((s) => s === "Tennis" || s === "Pickleball")));
  const [privacy, setPrivacy] = useStateP("Friends only");
  const ALL_SPORTS = ["Tennis", "Pickleball", "Recreational", "Open Play"];
  const PRIVACY_OPTIONS = [
  { id: "Public", label: "Public", sub: "Anyone on CourtReserve can find your profile" },
  { id: "Friends only", label: "Friends only", sub: "Only friends and connected players can view" },
  { id: "Private", label: "Private", sub: "Only you can view your profile" }];

  const toggleSport = (s) => {
    setSports((cur) => {
      const next = new Set(cur);
      if (next.has(s)) next.delete(s);else
      next.add(s);
      return next;
    });
  };
  // Save is a no-op for the prototype; just close.
  const onSave = () => onClose();
  return (
    <div
      onClick={onClose}
      style={{
        position: "absolute", inset: 0, zIndex: 200,
        background: "rgba(15,18,20,0.45)",
        display: "flex", alignItems: "flex-end", justifyContent: "center",
        animation: "epSheetFade 180ms ease-out"
      }}>
      <style>{`
        @keyframes epSheetFade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes epSheetUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: 560, maxHeight: "92%",
          background: "#fff",
          borderTopLeftRadius: 16, borderTopRightRadius: 16,
          display: "flex", flexDirection: "column",
          boxShadow: "0 -8px 32px rgba(0,0,0,0.18)",
          animation: "epSheetUp 220ms cubic-bezier(.2,.8,.2,1)"
        }}>
        {/* Drag handle */}
        <div style={{ width: 36, height: 4, borderRadius: 999, background: "#E9EBEC", margin: "12px auto 12px" }} />
        {/* Header */}
        <div style={{
          padding: "4px 20px 16px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          borderBottom: "1px solid #E9EBEC"
        }}>
          <span style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 20, letterSpacing: -0.4, color: "#0F1214" }}>Edit Profile</span>
          <button onClick={onClose} aria-label="Close" style={{
            width: 32, height: 32, borderRadius: 999,
            background: "transparent", border: 0, cursor: "pointer",
            display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#858F8F"
          }}>
            <Icon name="X" size={18} strokeWidth={2} color="currentColor" />
          </button>
        </div>
        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
          {/* Info banner */}
          <div style={{
            background: "#EFF3F4", borderRadius: 12,
            padding: "14px 16px",
            display: "flex", alignItems: "flex-start", gap: 10,
            marginBottom: 24
          }}>
            <Icon name="Info" size={16} strokeWidth={2} color="#4B5052" />
            <span style={{ fontSize: 13, color: "#4B5052", lineHeight: "18px", fontWeight: 500 }}>
              Need to update your email, phone, or address? Go to <strong style={{ color: "#0F1214", fontWeight: 700 }}>My Account</strong> in Settings.
            </span>
          </div>
          {/* PHOTO */}
          <div style={{ marginBottom: 24 }}>
            <div style={{
              fontFamily: "Axiforma", fontWeight: 800, fontSize: 11,
              letterSpacing: 1.4, textTransform: "uppercase", color: "#858F8F", marginBottom: 10
            }}>Photo</div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{
                width: 64, height: 64, borderRadius: 999,
                background: "#0F1214", color: "#fff",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                fontFamily: theme.display, fontWeight: 800, fontSize: 20, letterSpacing: 0.5
              }}>{PROFILE.avatar}</div>
              <button style={{
                background: "transparent", border: 0, cursor: "pointer",
                fontFamily: "inherit", fontWeight: 700, fontSize: 14, color: "#0F1214"
              }}>Change photo</button>
            </div>
          </div>
          {/* BASICS */}
          <div style={{
            fontFamily: "Axiforma", fontWeight: 800, fontSize: 11,
            letterSpacing: 1.4, textTransform: "uppercase", color: "#858F8F", marginBottom: 12
          }}>Basics</div>
          <EpField label="Display name" value={displayName} onChange={setDisplayName} />
          <EpField label="Location" value={location} onChange={setLocation} />
          {/* Sports chips */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 13, color: "#4B5052", fontWeight: 600, marginBottom: 8 }}>Sports</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {ALL_SPORTS.map((s) => {
                const on = sports.has(s);
                return (
                  <button key={s} onClick={() => toggleSport(s)} style={{
                    height: 36, padding: "0 16px", borderRadius: 999,
                    background: on ? "#0F1214" : "#fff",
                    border: `1px solid ${on ? "#0F1214" : "#DEE1E5"}`,
                    color: on ? "#fff" : "#0F1214",
                    fontFamily: "inherit", fontWeight: 700, fontSize: 13,
                    cursor: "pointer", transition: "background 120ms, color 120ms, border-color 120ms"
                  }}>{s}</button>);
              })}
            </div>
          </div>
          {/* BIO */}
          <div style={{
            fontFamily: "Axiforma", fontWeight: 800, fontSize: 11,
            letterSpacing: 1.4, textTransform: "uppercase", color: "#858F8F", marginBottom: 8
          }}>Bio</div>
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} style={{
            width: "100%", minHeight: 96, padding: "12px 14px",
            border: "1px solid #DEE1E5", borderRadius: 12,
            fontFamily: "inherit", fontSize: 14, lineHeight: 1.5, color: "#0F1214",
            outline: "none", resize: "vertical", background: "#fff",
            marginBottom: 24
          }} />
          {/* PRIVACY */}
          <div style={{
            fontFamily: "Axiforma", fontWeight: 800, fontSize: 11,
            letterSpacing: 1.4, textTransform: "uppercase", color: "#858F8F", marginBottom: 8
          }}>Privacy</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {PRIVACY_OPTIONS.map((opt) => {
              const on = privacy === opt.id;
              return (
                <button key={opt.id} onClick={() => setPrivacy(opt.id)} style={{
                  width: "100%", padding: "14px 16px",
                  background: on ? "#EFF6F1" : "#fff",
                  border: `1px solid ${on ? "#0F1214" : "#DEE1E5"}`,
                  borderRadius: 12,
                  textAlign: "left", cursor: "pointer", fontFamily: "inherit",
                  display: "flex", flexDirection: "column", gap: 2,
                  transition: "background 120ms, border-color 120ms"
                }}>
                  <span style={{ fontWeight: 700, fontSize: 14, color: "#0F1214" }}>{opt.label}</span>
                  <span style={{ fontSize: 12, color: "#858F8F", fontWeight: 500 }}>{opt.sub}</span>
                </button>);
            })}
          </div>
        </div>
        {/* Footer */}
        <div style={{
          padding: "16px 20px 24px",
          borderTop: "1px solid #E9EBEC",
          display: "flex", gap: 12
        }}>
          <button onClick={onClose} style={{
            flex: 1, height: 48, borderRadius: 12,
            background: "#fff", border: "1px solid #DEE1E5",
            color: "#0F1214", fontFamily: "inherit", fontWeight: 700, fontSize: 15,
            cursor: "pointer"
          }}>Cancel</button>
          <button onClick={onSave} style={{
            flex: 1, height: 48, borderRadius: 12, border: 0,
            background: "#0F1214", color: "#fff",
            fontFamily: "inherit", fontWeight: 700, fontSize: 15,
            cursor: "pointer"
          }}>Save Changes</button>
        </div>
      </div>
    </div>);
}
function EpField({ label, value, onChange }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
      <span style={{ fontSize: 13, color: "#4B5052", fontWeight: 600 }}>{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} style={{
        height: 48, padding: "0 16px", borderRadius: 12,
        border: "1px solid #DEE1E5", background: "#fff",
        fontFamily: "inherit", fontSize: 15, color: "#0F1214",
        outline: "none"
      }} />
    </label>);
}
window.EditProfileSheet = EditProfileSheet;