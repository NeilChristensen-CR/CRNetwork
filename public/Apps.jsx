// Apps.jsx — Minimal player dashboard: typographic, single-color, sparse.
// Same direction as the event list (Uber-minimal, Axiforma display, hairline rules).

const { useState: useStateAP, useMemo: useMemoAP } = React;

// ---- Themes ----
const LIGHT_TOKENS = {
  bg: "#fff",
  surface: "#fff",
  surfaceSoft: "#F4F5F6",
  text: "#0F1214",
  textMuted: "#4B5052",
  textSubtle: "#858F8F",
  textInverted: "#fff",
  line: "#E9EBEC",
  rule: "#0F1214",
  chip: "#F4F5F6"
};
const DARK_TOKENS = {
  bg: "#0a0a0c",
  surface: "#1c2026",
  surfaceSoft: "#14171b",
  text: "#f5f5f7",
  textMuted: "#a8adb5",
  textSubtle: "#71757d",
  textInverted: "#0F1214",
  line: "rgba(255,255,255,.08)",
  rule: "rgba(255,255,255,.45)",
  chip: "#14171b"
};
const THEMES = {
  cr: {
    id: "cr",
    name: "CourtReserve",
    primary: "#0F1214",
    accent: "#FFDA44",
    surface: "#fff",
    softTint: "#F4F5F6",
    display: "Axiforma",
    logoMark: "▲",
    logoText: "All Locations",
    cityTag: "St. Augustine, FL",
    universal: true,
    dark: false,
    t: LIGHT_TOKENS
  },
  oc: {
    id: "oc",
    name: "Old Coast Pickleball",
    primary: "#2E5D52",
    accent: "#F2A93B",
    surface: "#fff",
    softTint: "#F1EFE9",
    display: "Axiforma",
    logoMark: "OC",
    logoText: "Old Coast",
    cityTag: "St. Augustine, FL",
    dark: false,
    t: { ...LIGHT_TOKENS, surfaceSoft: "#F1EFE9", chip: "#F1EFE9" }
  },
  dd: {
    id: "dd",
    name: "Dill Dinkers Jacksonville",
    primary: "#A78BFA",
    accent: "#FFD166",
    surface: "#16181c",
    softTint: "#1f2228",
    display: "Axiforma",
    logoMark: "DD",
    logoText: "Dill Dinkers",
    cityTag: "Jacksonville, FL",
    dark: true,
    t: DARK_TOKENS
  }
};

const PLAYER = {
  name: "Neil",
  fullName: "Neil Christensen",
  avatar: "JB",
  dupr: 4.25,
  duprDelta: +0.3,
  streak: 3,
  sessions: 24,
  hours: 36,
  wl: "18-6",
  clubsPlayedAt: [
  { id: "oc", name: "Old Coast Pickleball", logoMark: "OC", color: "#2E5D52", miles: 2.1, sessions: 22, joined: true, tier: "Diamond", tierColor: "#2E5D52", courts: 8 },
  { id: "dd", name: "Dill Dinkers Jacksonville", logoMark: "DD", color: "#8E5BE8", miles: 8.4, sessions: 7, joined: true, tier: "Gold", tierColor: "#8E5BE8", courts: 14 },
  { id: "sa", name: "South St. Augustine Tennis", logoMark: "SA", color: "#1F4ED8", miles: 3.6, sessions: 4, joined: false, tier: "Guest", tierColor: "#1F4ED8", courts: 6 }],

  upNext: {
    name: "Thursday Round Robin · 3.0–3.5",
    when: "Tonight", time: "6:30 PM", countdown: "in 4h 12m",
    court: "Court 3 · Old Coast", partner: "Mia C."
  },
  network: [
  { id: "p1", name: "Mia Castellanos", avatar: "MC", color: "#D6573B", dupr: 4.3, club: "Old Coast", clubColor: "#2E5D52", reason: "4 wins together", proof: "Last played 3 days ago at Old Coast", action: "Rebook" },
  { id: "p2", name: "Reese Tanaka", avatar: "RT", color: "#1F4ED8", dupr: 4.1, club: "Old Coast", clubColor: "#2E5D52", reason: "Same skill, same weeknights", proof: "You’d be a balanced doubles team for Apr 6 tournament", action: "Invite to tournament" },
  { id: "p3", name: "Sam Becker", avatar: "SB", color: "#0F1214", dupr: 4.2, club: "Old Coast", clubColor: "#2E5D52", reason: "Plays Old Coast at your time", proof: "Mia recommends Sam — friend of a friend", action: "Send hello" },
  { id: "p4", name: "Priya Shah", avatar: "PS", color: "#8E5BE8", dupr: 4.4, club: "Dill Dinkers", clubColor: "#8E5BE8", reason: "Stretch partner — closes your gap to 4.4", proof: "Beat you 11-9 in last open play", action: "Challenge" }],

  recentMatches: [
  { id: "m1", result: "W", score: "11-7, 11-9", partner: "Mia C.", partnerInit: "MC", partnerColor: "#D6573B", oppA: "Tom B.", oppB: "Priya S.", oppAColor: "#C77700", oppBColor: "#8E5BE8", when: "3d ago", duprDelta: +0.08, club: "Old Coast", headline: "Closed it out 11-9", blurb: "Mia’s third-shot drops kept Tom out of the kitchen.", highlight: "Best dink rally: 23 shots", rated: false },
  { id: "m2", result: "D", score: "11-9, 9-11", partner: "Reese T.", partnerInit: "RT", partnerColor: "#1F4ED8", oppA: "Sam B.", oppB: "Jane W.", oppAColor: "#0F1214", oppBColor: "#2E7D32", when: "5d ago", duprDelta: +0.01, club: "Old Coast", headline: "Split — couldn't break serve", blurb: "Time ran out at 1-1. Stayed within 2 points the whole night.", highlight: "First match with Reese", rated: true },
  { id: "m3", result: "L", score: "9-11, 11-7, 7-11", partner: "Mia C.", partnerInit: "MC", partnerColor: "#D6573B", oppA: "Priya S.", oppB: "Coach Reid", oppAColor: "#8E5BE8", oppBColor: "#2E5D52", when: "1w ago", duprDelta: -0.02, club: "Dill Dinkers", headline: "Tight 3-game battle", blurb: "Your serves stayed in 92% — the kind of game you learn from.", highlight: "Most rallies over 10 shots: 7", rated: false },
  { id: "m4", result: "W", score: "11-3, 11-5", partner: "Sam B.", partnerInit: "SB", partnerColor: "#0F1214", oppA: "Ana R.", oppB: "Marcus L.", oppAColor: "#1F4ED8", oppBColor: "#8E5BE8", when: "9d ago", duprDelta: +0.12, club: "Old Coast", headline: "Cleanest win of the month", blurb: "Sam's volley game shut down the lobs. You held the line.", highlight: "Won 11 of last 12 points", rated: true, kind: "Tournament · Round 1" },
  { id: "m5", result: "L", score: "10-12, 6-11", partner: "Solo", partnerInit: "JB", partnerColor: "#0F1214", oppA: "Coach Reid", oppAColor: "#2E5D52", when: "11d ago", duprDelta: -0.06, club: "Old Coast", headline: "Coaching session vs. Reid", blurb: "Lost the close one then ran out of gas. Backhand returns to drill.", highlight: "Singles practice match", rated: true, kind: "Singles" },
  { id: "m6", result: "D", score: "8-11, 11-7", partner: "Mia C.", partnerInit: "MC", partnerColor: "#D6573B", oppA: "Priya S.", oppB: "Sam B.", oppAColor: "#8E5BE8", oppBColor: "#0F1214", when: "2w ago", duprDelta: +0.00, club: "Old Coast", headline: "Even at the buzzer", blurb: "Daylight ran out — you took game 2, they took game 1.", highlight: "First match together this season", rated: false },
  { id: "m7", result: "W", score: "11-8, 11-6", partner: "Reese T.", partnerInit: "RT", partnerColor: "#1F4ED8", oppA: "Tom B.", oppB: "Mike A.", oppAColor: "#C77700", oppBColor: "#1F4ED8", when: "2w ago", duprDelta: +0.04, club: "Dill Dinkers", headline: "Locked in from point one", blurb: "Reese set, you closed. Cleanest doubles execution all month.", highlight: "Zero unforced errors in game 2", rated: true },
  { id: "m8", result: "L", score: "5-11, 8-11", partner: "Priya S.", partnerInit: "PS", partnerColor: "#8E5BE8", oppA: "Coach Reid", oppB: "Lena P.", oppAColor: "#2E5D52", oppBColor: "#D6573B", when: "3w ago", duprDelta: -0.09, club: "South St. Augustine", headline: "Outpaced by the pros", blurb: "Stretch match against higher-rated team. Lots to learn from the tape.", highlight: "Stretch match · +0.6 DUPR opponents", rated: true, kind: "Stretch" }],

  friendActivity: [
  { id: "a1", who: "Mia C.", avatar: "MC", color: "#D6573B", verb: "is on court at", what: "Open Play", where: "Court 2", club: "Old Coast", clubColor: "#2E5D52", when: "on court now", live: true, action: "Join" },
  { id: "a2", who: "Reese T.", avatar: "RT", color: "#1F4ED8", verb: "registered for", what: "Spring Doubles Bracket", where: "Apr 6", club: "Old Coast", clubColor: "#2E5D52", when: "2h ago", action: "Team up" },
  { id: "a3", who: "Sam B.", avatar: "SB", color: "#0F1214", verb: "hit a new DUPR", what: "4.3", where: "+0.15 this week", club: "Old Coast", clubColor: "#2E5D52", when: "yesterday", action: "Congratulate" },
  { id: "a4", who: "Priya S.", avatar: "PS", color: "#8E5BE8", verb: "opened a slot for", what: "Wed 6 PM doubles", where: "Looking for a partner", club: "Dill Dinkers", clubColor: "#8E5BE8", when: "3h ago", action: "Offer to play" }],

  drills: [
  { id: "d1", title: "Third-shot drop consistency", why: "Your weakest shot in your last 5 matches", duration: "15 min", coach: "Coach Reid" },
  { id: "d2", title: "Soft-game pacing at the kitchen", why: "Won 78% of points when you held the line longer", duration: "20 min", coach: "Priya Shah" },
  { id: "d3", title: "Backhand return depth", why: "Returns sat short in 3 of last 4 losses", duration: "10 min", coach: "Mike Alvarado" }]

};

// ---- Experience switcher — sits beside the dashboard title. Lets the user
// flip between the universal CourtReserve player-focused experience and
// individual club-focused experiences they're a member of.
function ExperienceSwitcher({ theme, app, setApp, compact = false }) {
  const t = theme.t || LIGHT_TOKENS;
  const [open, setOpen] = useStateAP(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {if (ref.current && !ref.current.contains(e.target)) setOpen(false);};
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);
  const options = [
  { id: "cr", name: "CourtReserve", tagline: "Universal experience",
    sub: "Across every club you play at",
    pitch: "Your player profile, DUPR, matches and growth — wherever you play.",
    logoMark: "▲", color: "#0F1214", universal: true },
  { id: "oc", name: "Old Coast Pickleball", tagline: "Diamond member",
    sub: "Their courts, events & community",
    pitch: "Focused on the Old Coast experience — bookings, regulars and events.",
    logoMark: "OC", color: "#2E5D52" },
  { id: "dd", name: "Dill Dinkers Jacksonville", tagline: "Gold member",
    sub: "Their courts, events & community",
    pitch: "Focused on Dill Dinkers — purple-rich dark experience tuned for night play.",
    logoMark: "DD", color: "#8E5BE8" }];

  const current = options.find((o) => o.id === app) || options[0];
  return (
    <div ref={ref} style={{ position: "relative", flexShrink: 0 }}>
      <button onClick={() => setOpen((o) => !o)} aria-expanded={open} style={{
        display: "inline-flex", alignItems: "center", gap: compact ? 8 : 12,
        height: compact ? 36 : 56, padding: compact ? "0 12px 0 4px" : "0 16px 0 8px", borderRadius: compact ? 999 : 14,
        border: `1px solid ${t.line}`,
        background: open ? t.surfaceSoft : t.surface,
        cursor: "pointer", fontFamily: "inherit",
        transition: "border-color 140ms, background 140ms"
      }}>
        <span style={{
          width: compact ? 28 : 40, height: compact ? 28 : 40, borderRadius: compact ? 8 : 10,
          background: current.color, color: "#fff",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          fontFamily: theme.display, fontWeight: 800, fontSize: compact ? current.universal ? 13 : 10 : current.universal ? 18 : 13,
          flexShrink: 0
        }}>{current.logoMark}</span>
        {compact ?
        <span style={{ fontFamily: theme.display, fontWeight: 700, fontSize: 12, color: t.text, letterSpacing: -0.1 }}>{current.name}</span> :

        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", lineHeight: 1.1, textAlign: "left" }}>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: t.textSubtle }}>Experience</span>
            <span style={{ marginTop: 4, fontFamily: theme.display, fontWeight: 800, fontSize: 16, letterSpacing: -0.3, color: t.text }}>{current.name}</span>
          </div>
        }
        <Icon name="ChevronDown" size={compact ? 14 : 16} strokeWidth={2.2} color={t.textMuted} />
      </button>

      {open &&
      <div style={{
        position: "absolute", top: "calc(100% + 8px)", right: 0, zIndex: 50,
        width: 360, background: t.surface, border: `1px solid ${t.line}`, borderRadius: 8,
        boxShadow: theme.dark ? "0 24px 60px rgba(0,0,0,.6), 0 2px 8px rgba(0,0,0,.3)" : "0 24px 60px rgba(15,18,20,.16), 0 2px 8px rgba(15,18,20,.06)",
        padding: 8
      }}>
          <div style={{ padding: "10px 12px 6px", fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", color: t.textSubtle }}>Switch experience</div>
          {options.map((o) => {
          const on = app === o.id;
          return (
            <button key={o.id} onClick={() => {setApp(o.id);setOpen(false);}} style={{
              width: "100%", display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 14, alignItems: "flex-start",
              padding: "12px 12px", borderRadius: 8, border: `1px solid ${on ? t.line : "transparent"}`,
              background: on ? t.surfaceSoft : "transparent",
              cursor: "pointer", fontFamily: "inherit", textAlign: "left",
              transition: "background 120ms",
              marginBottom: 2
            }}
            onMouseEnter={(e) => {if (!on) e.currentTarget.style.background = t.surfaceSoft;}}
            onMouseLeave={(e) => {if (!on) e.currentTarget.style.background = "transparent";}}>
                <span style={{
                width: 40, height: 40, borderRadius: 8,
                background: o.universal ? "#fff" : o.color,
                color: "#fff",
                border: o.universal ? "1px solid #E9EBEC" : 0,
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                fontFamily: theme.display, fontWeight: 800, fontSize: o.universal ? 18 : 13,
                flexShrink: 0
              }}>{o.universal ? <CRVerifiedMark size={28} /> : o.logoMark}</span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 14, color: t.text, letterSpacing: -0.2 }}>{o.name}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.6, textTransform: "uppercase", color: o.universal ? t.textSubtle : o.color, padding: "2px 6px", borderRadius: 8, background: o.universal ? t.chip : "transparent", border: o.universal ? "0" : `1px solid ${o.color}` }}>{o.tagline}</span>
                  </div>
                  <div style={{ marginTop: 4, fontSize: 12, color: t.textMuted, fontWeight: 500, lineHeight: 1.4 }}>{o.pitch}</div>
                </div>
                <span style={{
                width: 20, height: 20, borderRadius: 999, marginTop: 4,
                border: on ? "6px solid currentColor" : `1px solid ${t.line}`,
                background: t.surface, flexShrink: 0,
                color: theme.primary,
                transition: "all 120ms"
              }} />
              </button>);

        })}
          <div style={{ height: 1, background: t.line, margin: "6px 4px" }} />
          <button style={{
          width: "100%", display: "flex", alignItems: "center", gap: 10,
          padding: "10px 12px", borderRadius: 8, border: 0, background: "transparent",
          cursor: "pointer", fontFamily: "inherit", textAlign: "left", color: t.textMuted, fontSize: 12, fontWeight: 600
        }}>
            <Icon name="Search" size={14} strokeWidth={2} color={t.textMuted} /> Find a club to join
          </button>
        </div>
      }
    </div>);

}

// Stylized CourtReserve "verified" mark — a green scalloped seal with
// a black check, recreating the uploaded brand icon. Sits on a white
// chip background so the colors match the source artwork.
function CRVerifiedMark({ size = 22 }) {
  // 12 small circles + a central disc form the scalloped silhouette.
  // We render the silhouette twice — once in green, then a slightly
  // inset copy in white — to produce a hollow "outline" effect while
  // keeping the soft scalloped edge. The black check sits on top.
  const cx = 16,cy = 16;
  const ringR = 9; // radius of the ring on which bumps sit
  const buildSeal = (centerR, bumpR) => {
    const positions = [];
    for (let i = 0; i < 12; i++) {
      const a = i / 12 * Math.PI * 2 - Math.PI / 2;
      positions.push({ x: cx + ringR * Math.cos(a), y: cy + ringR * Math.sin(a) });
    }
    return (
      <React.Fragment>
        <circle cx={cx} cy={cy} r={centerR} />
        {positions.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={bumpR} />)}
      </React.Fragment>);

  };
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true" style={{ display: "block" }}>
      {/* Outer green silhouette */}
      <g fill="#5BD16D">{buildSeal(11.2, 4.4)}</g>
      {/* Inset white silhouette — produces a ~1.6px green outline */}
      <g fill="#fff">{buildSeal(9.6, 2.8)}</g>
      {/* Black check on top */}
      <path d="M9.5 16.8 l 3.6 3.6 L 22.5 11.6" stroke="#0F1214" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>);

}

function ClubSwitcher({ theme, app, setApp, onFindClubs }) {
  const t = theme.t || { bg: "#fff", surface: "#fff", surfaceSoft: "#F4F5F6", text: "#0F1214", textMuted: "#4B5052", textSubtle: "#858F8F", textInverted: "#fff", line: "#E9EBEC", rule: "#0F1214", chip: "#F4F5F6" };
  const [open, setOpen] = useStateAP(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {if (ref.current && !ref.current.contains(e.target)) setOpen(false);};
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);
  const options = [
  { id: "cr", name: "All Locations", sub: "CourtReserve Verified", logoMark: "▲", color: "#0F1214", universal: true },
  { id: "oc", name: "Old Coast Pickleball", sub: "Diamond member · 2.1 mi", logoMark: "OC", color: "#2E5D52" },
  { id: "dd", name: "Dill Dinkers Jacksonville", sub: "Gold member · 8.4 mi", logoMark: "DD", color: "#8E5BE8" }];

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button onClick={() => setOpen((o) => !o)} style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        height: 36, padding: "0 12px", borderRadius: 999,
        border: `1px solid ${open ? t.text : t.line}`,
        background: t.surface,
        cursor: "pointer", fontFamily: "inherit",
        boxShadow: open ? "0 6px 14px rgba(15,18,20,.06), 0 1px 3px rgba(15,18,20,.05)" : "none",
        transition: "border-color 140ms, background 140ms, box-shadow 140ms",
        maxWidth: 240
      }}
      onMouseEnter={(e) => {if (!open) e.currentTarget.style.borderColor = t.textMuted;}}
      onMouseLeave={(e) => {if (!open) e.currentTarget.style.borderColor = t.line;}}>
        {/* Leading icon — map pin reads as "location," with a small
                       green dot overlaid only for the verified CR universal
                       experience. */}
        <span style={{ position: "relative", display: "inline-flex" }}>
          <Icon name="MapPin" size={16} strokeWidth={2} color={t.text} />
          {theme.id === "cr" &&
          <span aria-hidden style={{
            position: "absolute", right: -2, bottom: -2,
            width: 8, height: 8, borderRadius: 999,
            background: "#1F8A5B",
            boxShadow: `0 0 0 2px ${t.surface}`
          }} />
          }
        </span>
        <span style={{
          fontFamily: theme.display, fontWeight: 700, fontSize: 13,
          letterSpacing: -0.1, color: t.text,
          minWidth: 0,
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
        }}>{theme.logoText}</span>
        <Icon name="ChevronDown" size={13} strokeWidth={2.2} color={t.textMuted} />
      </button>
      {open &&
      <div style={{
        position: "absolute", top: "calc(100% + 6px)", left: 0, zIndex: 50,
        width: 320, background: "#fff", border: "1px solid #E9EBEC", borderRadius: 8,
        boxShadow: "0 18px 50px rgba(15,18,20,.16), 0 2px 8px rgba(15,18,20,.06)",
        padding: 6
      }}>
          <div style={{ padding: "8px 12px 6px", fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", color: "#858F8F" }}>Switch view</div>
          {options.map((o) => {
          const on = app === o.id;
          return (
            <button key={o.id} onClick={() => {setApp(o.id);setOpen(false);}} style={{
              width: "100%", display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 12, alignItems: "center",
              padding: "10px 12px", borderRadius: 8, border: 0,
              background: on ? "#F4F5F6" : "transparent",
              cursor: "pointer", fontFamily: "inherit", textAlign: "left"
            }}
            onMouseEnter={(e) => {if (!on) e.currentTarget.style.background = "#FAFAFA";}}
            onMouseLeave={(e) => {if (!on) e.currentTarget.style.background = "transparent";}}>
                <span style={{
                width: 36, height: 36, borderRadius: 8,
                background: o.id === "cr" ? "#fff" : o.color,
                color: "#fff",
                border: o.id === "cr" ? "1px solid #E9EBEC" : 0,
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                fontFamily: theme.display, fontWeight: 800, fontSize: o.id === "cr" ? 16 : 12
              }}>{o.id === "cr" ? <CRVerifiedMark size={26} /> : o.logoMark}</span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: theme.display, fontWeight: 700, fontSize: 13, color: "#0F1214", letterSpacing: -0.1 }}>{o.name}</div>
                  <div style={{ fontSize: 11, color: "#858F8F", fontWeight: 500, marginTop: 1 }}>{o.sub}</div>
                </div>
                {on && <Icon name="Check" size={14} strokeWidth={2.5} color="#0F1214" />}
              </button>);

        })}
          <div style={{ height: 1, background: "#F4F5F6", margin: "4px 0" }} />
          <button onClick={() => {setOpen(false);onFindClubs && onFindClubs();}} style={{
          width: "100%", display: "flex", alignItems: "center", gap: 10,
          padding: "10px 12px", borderRadius: 8, border: 0, background: "transparent",
          cursor: "pointer", fontFamily: "inherit", textAlign: "left", color: "#4B5052", fontSize: 12, fontWeight: 600
        }}>
            <Icon name="Search" size={14} strokeWidth={2} color="#4B5052" /> Find a location
          </button>
        </div>
      }
    </div>);

}

function ChromeBar({ theme, viewport, app, setApp, onOpenQR, onFindClubs, onOpenProfile, active = "Home", onNav }) {
  const t = theme.t || { bg: "#fff", surface: "#fff", surfaceSoft: "#F4F5F6", text: "#0F1214", textMuted: "#4B5052", textSubtle: "#858F8F", textInverted: "#fff", line: "#E9EBEC", rule: "#0F1214", chip: "#F4F5F6" };
  const desktop = viewport === "desktop";
  const [profileOpen, setProfileOpen] = useStateAP(false);
  // ----- Logged-out branch -----
  // When the player is browsing the universal CourtReserve surface (app === "cr"),
  // the chrome adopts the "find anything" hero shape: brandmark + center nav +
  // Sign Up / Sign In on the right. No SearchBar in chrome on this branch —
  // the SearchBar moves into the page hero on the logged-out home, matching
  // the north-star design.
  const loggedOut = app === "cr";
  if (loggedOut && window.ChromeBarLoggedOut) {
    return <window.ChromeBarLoggedOut theme={theme} viewport={viewport} active={active} onNav={onNav} />;
  }
  return (
    <div style={{
      background: t.surface, borderBottom: `1px solid ${t.line}`,
      // Anchor the chrome to the top of the scrolling container — sticky on
      // both desktop and mobile so the header stays visible while scrolling.
      position: "sticky",
      top: 0, zIndex: 50,
      // Subtle frosted-glass effect when sticky so content scrolling
      // beneath shows through faintly.
      backdropFilter: "blur(12px)",
      background: theme.dark ? "rgba(10,10,12,.85)" : "rgba(255,255,255,.92)"
    }}>
      <div style={{
        maxWidth: desktop ? 1280 : "100%", margin: "0 auto",
        padding: desktop ? "0 24px" : "0 12px",
        height: desktop ? 68 : 60,
        display: "flex", alignItems: "center", gap: desktop ? 20 : 8,
        position: "relative"
      }}>
        <ClubSwitcher theme={theme} app={app} setApp={setApp} onFindClubs={onFindClubs} />
        {desktop &&
        <nav style={{
          position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)",
          display: "flex", gap: 26
        }}>
            {["Home", "Reserve", "Events", "Activity", "Messages"].map((l) => {
            const on = l === active;
            const disabled = l === "Activity"; // Activity screen not built yet
            return (
              <button key={l} type="button" disabled={disabled}
              onClick={() => !disabled && onNav && onNav(l)} style={{
                background: "transparent", border: 0, padding: "6px 0",
                cursor: disabled ? "not-allowed" : "pointer",
                color: on ? t.text : disabled ? "#BBBFC1" : t.textSubtle,
                fontFamily: "inherit", fontSize: 14, fontWeight: on ? 700 : 500,
                position: "relative",
                letterSpacing: -0.1,
                opacity: disabled ? 0.55 : 1,
                transition: "color 140ms"
              }}
              title={disabled ? "Coming soon" : undefined}
              onMouseEnter={(e) => {if (!on && !disabled) e.currentTarget.style.color = t.text;}}
              onMouseLeave={(e) => {if (!on && !disabled) e.currentTarget.style.color = t.textSubtle;}}>
                {l}
                {/* Underline indicator for the active route — sits 2px under
                               the label so the nav reads like a tab strip. */}
                {on &&
                <span aria-hidden style={{
                  position: "absolute", left: 0, right: 0, bottom: -10, height: 2,
                  background: theme.primary, borderRadius: 2
                }} />
                }
              </button>);

          })}
          </nav>
        }
        <div style={{ flex: 1 }} />
        <button onClick={onOpenQR} aria-label="Show member QR code" style={{ width: desktop ? 40 : 36, height: desktop ? 40 : 36, borderRadius: 999, background: t.surfaceSoft, border: 0, display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
            <Icon name="QrCode" size={desktop ? 18 : 16} />
          </button>
        <button style={{ width: 36, height: 36, borderRadius: 999, background: t.surfaceSoft, border: 0, display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative" }}>
          <Icon name="Bell" size={15} />
          <span style={{ position: "absolute", top: 8, right: 9, width: 7, height: 7, borderRadius: 999, background: "#E11D2A" }} />
        </button>
        <div data-profile-trigger style={{ position: "relative" }}>
          <button onClick={() => setProfileOpen((o) => !o)} aria-label="Profile menu" aria-expanded={profileOpen} style={{
            width: 32, height: 32, borderRadius: 999, background: theme.primary, color: "#fff",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            fontFamily: theme.display, fontWeight: 800, fontSize: 12,
            border: 0, padding: 0, cursor: "pointer",
            boxShadow: profileOpen ? `0 0 0 3px ${theme.softTint || "rgba(15,140,90,.20)"}` : "none",
            transition: "box-shadow 140ms"
          }}>JB</button>
          {profileOpen && desktop && window.ProfileDropdown &&
          <window.ProfileDropdown
            theme={theme}
            onClose={() => setProfileOpen(false)}
            onViewProfile={() => {setProfileOpen(false);onOpenProfile && onOpenProfile();}}
            onLogout={() => setProfileOpen(false)} />

          }
        </div>
      </div>
      {/* Second row — global Airbnb-style search pill (WHERE / ACTIVITY /
          WHEN / WHO). Lives inside the sticky chrome so it follows the
          user across every route. Desktop renders the full 4-segment pill;
          mobile uses the compact single-line variant which expands into
          the full bar on tap. */}
      {window.SearchBar && (
        <div style={{
          maxWidth: desktop ? 1280 : "100%",
          margin: "0 auto",
          padding: desktop ? "0 24px 16px" : "0 12px 12px",
        }}>
          {desktop
            ? <window.SearchBar theme={theme} viewport="desktop" />
            : window.SearchBarCompact
              ? <window.SearchBarCompact theme={theme} viewport="mobile" />
              : <window.SearchBar theme={theme} viewport="mobile" />}
        </div>
      )}
    </div>);

}

// ---- Member QR modal (mobile) — full-screen modal with check-in QR + member info ----
// Portals up to the artboard's .dc-card so it covers the visible phone area
// (rather than the scrollable dashboard root, which extends past the card's
// clipped viewport).
function MemberQRSheet({ theme, onClose }) {
  const t = theme.t || { bg: "#fff", surface: "#fff", surfaceSoft: "#F4F5F6", text: "#0F1214", textMuted: "#4B5052", textSubtle: "#858F8F", textInverted: "#fff", line: "#E9EBEC", rule: "#0F1214", chip: "#F4F5F6" };
  const anchorRef = React.useRef(null);
  const [mount, setMount] = React.useState(null);
  // Pick the player's primary membership for the pass — match the active
  // branded experience when in one, otherwise default to the club with the
  // most sessions (typically Old Coast).
  const memberships = (PLAYER.clubsPlayedAt || []).filter((c) => c.joined);
  const themed = memberships.find((c) => c.id === theme.id);
  const primary = themed || memberships.sort((a, b) => (b.sessions || 0) - (a.sessions || 0))[0] ||
  { name: "Old Coast Pickleball", color: "#2E5D52", tier: "Diamond" };
  // Soft mint info-card tint, biased toward the club's brand color so the
  // card reads as part of that membership.
  const tintBg = (primary.color || "#2E5D52") + "14";
  const tintFg = primary.color || "#2E5D52";
  const memberCode = `CR-2024-${(PLAYER.fullName || "").split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 3) || "MEM"}-00847`;
  React.useEffect(() => {
    const onKey = (e) => {if (e.key === "Escape") onClose();};
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  React.useEffect(() => {
    // Anchor to the artboard card so the overlay is scoped to this design
    // (not the whole canvas). The card is a scroll container, so we measure
    // its currently-visible viewport on each scroll/resize and position the
    // modal in that band rather than at the absolute center of a very tall
    // card. This keeps the check-in code on screen no matter where the user
    // scrolled to when they tapped the QR button.
    const el = anchorRef.current;
    if (!el) return;
    const card = el.closest(".dc-card") || el.parentElement;
    if (!card) {setMount(document.body);return;}
    const prevPos = card.style.position;
    if (getComputedStyle(card).position === "static") card.style.position = "relative";
    setMount(card);
    return () => {card.style.position = prevPos;};
  }, []);
  // Track the visible band of the card on scroll so the modal stays on screen.
  const [band, setBand] = React.useState({ top: 0, height: 0 });
  React.useEffect(() => {
    if (!mount || mount === document.body) return;
    const scroller = (() => {
      let n = mount;
      while (n && n !== document.body) {
        const cs = getComputedStyle(n);
        if (cs.overflowY === "auto" || cs.overflowY === "scroll") return n;
        n = n.parentElement;
      }
      return null;
    })();
    const update = () => {
      const cardRect = mount.getBoundingClientRect();
      // Visible portion of the card in viewport coords, intersected with
      // either its scrolling parent or the window.
      const vTop = scroller ? scroller.getBoundingClientRect().top : 0;
      const vBottom = scroller ? scroller.getBoundingClientRect().bottom : window.innerHeight;
      const top = Math.max(0, vTop - cardRect.top);
      const bottom = Math.min(cardRect.height, vBottom - cardRect.top);
      setBand({ top, height: Math.max(0, bottom - top) });
    };
    update();
    const target = scroller || window;
    target.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      target.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [mount]);
  const modal =
  <div style={{
    position: "absolute", left: 0, right: 0,
    top: band.top, height: band.height || "100%",
    zIndex: 1000,
    background: "rgba(15,18,20,.55)",
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: 24,
    animation: "qrFadeIn 180ms ease-out"
  }}
  onClick={(e) => {if (e.target === e.currentTarget) onClose();}}>
      <style>{`
        @keyframes qrFadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes qrCardIn { from { opacity: 0; transform: translateY(8px) scale(.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
      `}</style>
      {/* Card — centered modal with the check-in code as its hero. */}
      <div role="dialog" aria-label="Check-in code" style={{
      width: "100%", maxWidth: 420,
      background: "#fff", color: t.text,
      borderRadius: 24,
      padding: "24px 24px 28px",
      boxShadow: "0 32px 80px rgba(15,18,20,.32), 0 8px 24px rgba(15,18,20,.18)",
      animation: "qrCardIn 220ms cubic-bezier(.2,.8,.2,1)"
    }}>
        {/* Header — title + close */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 22, letterSpacing: -0.4, color: t.text }}>Check-in code</div>
          <button onClick={onClose} aria-label="Close" style={{
          width: 32, height: 32, borderRadius: 999,
          background: "transparent", border: 0,
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", color: t.textMuted
        }}>
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* QR code — large enough to be scanned from a phone held up to a
        kiosk reader. White panel with subtle shadow so the code
        stays readable on any background tint behind it. */}
        <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "8px 8px 12px"
      }}>
          <div style={{
          background: "#fff", borderRadius: 16, padding: 12,
          display: "inline-flex", alignItems: "center", justifyContent: "center"
        }}>
            <QrCodeArt size={300} />
          </div>
        </div>

        {/* Member ID — monospace so it reads as a scannable serial */}
        <div style={{
        textAlign: "center",
        fontFamily: "ui-monospace, Menlo, monospace",
        fontSize: 14, letterSpacing: 2, color: t.textSubtle,
        marginTop: 4, marginBottom: 20
      }}>{memberCode}</div>

        {/* Identity card — tinted with the club's brand color */}
        <div style={{
        background: tintBg, borderRadius: 16,
        padding: "16px 18px",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 4, textAlign: "center"
      }}>
          <div style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 18, letterSpacing: -0.3, color: t.text }}>{PLAYER.fullName}</div>
          <div style={{ fontSize: 13, color: t.textMuted, fontWeight: 500 }}>
            {primary.name} <span style={{ color: t.textSubtle }}>·</span> {primary.tier} Membership
          </div>
          <div style={{ marginTop: 6, fontFamily: theme.display, fontWeight: 700, fontSize: 13, color: tintFg, letterSpacing: -0.1 }}>
            Show this at check-in
          </div>
        </div>
      </div>
    </div>;

  return (
    <React.Fragment>
      <span ref={anchorRef} style={{ display: "none" }} aria-hidden />
      {mount && ReactDOM.createPortal(modal, mount)}
    </React.Fragment>);
}

// Deterministic faux-QR art — 25×25 grid w/ corner finder squares. Visual placeholder
// only; not an actual scannable code. Stable across renders so it doesn't shimmer.
function QrCodeArt({ size = 220 }) {
  const N = 25;
  const cells = React.useMemo(() => {
    // Mulberry32-style PRNG seeded so the pattern is stable.
    let s = 0x9e3779b9;
    const rnd = () => {s = s + 0x6D2B79F5 | 0;let t = s;t = Math.imul(t ^ t >>> 15, t | 1);t ^= t + Math.imul(t ^ t >>> 7, t | 61);return ((t ^ t >>> 14) >>> 0) / 4294967296;};
    const grid = [];
    for (let y = 0; y < N; y++) {
      const row = [];
      for (let x = 0; x < N; x++) row.push(rnd() > 0.52 ? 1 : 0);
      grid.push(row);
    }
    // Clear three finder regions (8×8 incl. quiet)
    const clearBox = (cx, cy) => {
      for (let y = cy; y < cy + 8; y++) for (let x = cx; x < cx + 8; x++) {
        if (x >= 0 && y >= 0 && x < N && y < N) grid[y][x] = 0;
      }
    };
    clearBox(0, 0);clearBox(N - 7, 0);clearBox(0, N - 7);
    return grid;
  }, []);
  const cell = size / N;
  const Finder = ({ x, y }) =>
  <g transform={`translate(${x * cell} ${y * cell})`}>
      <rect width={cell * 7} height={cell * 7} fill="#0F1214" rx={cell * 0.6} />
      <rect x={cell} y={cell} width={cell * 5} height={cell * 5} fill="#fff" rx={cell * 0.4} />
      <rect x={cell * 2} y={cell * 2} width={cell * 3} height={cell * 3} fill="#0F1214" rx={cell * 0.3} />
    </g>;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Member QR code">
      {cells.map((row, y) => row.map((v, x) => v ?
      <rect key={`${x}-${y}`} x={x * cell + cell * 0.1} y={y * cell + cell * 0.1} width={cell * 0.8} height={cell * 0.8} fill="#0F1214" rx={cell * 0.15} /> :
      null))}
      <Finder x={0} y={0} />
      <Finder x={N - 7} y={0} />
      <Finder x={0} y={N - 7} />
    </svg>);

}


// ---- Mobile hero carousel — desktop UpNextHero, multiplied & swipeable ----
function MobileHeroCarousel({ theme, isCR }) {
  const t = theme.t || { bg: "#fff", surface: "#fff", surfaceSoft: "#F4F5F6", text: "#0F1214", textMuted: "#4B5052", textSubtle: "#858F8F", textInverted: "#fff", line: "#E9EBEC", rule: "#0F1214", chip: "#F4F5F6" };
  const u = PLAYER.upNext;
  const slides = [
  {
    eyebrow: `Up next · ${u.countdown}`,
    title: u.name + ".",
    meta: `${u.time} · ${u.court}`,
    footer: `with ${u.partner} · 14 more going`,
    cta: "Check in",
    bg: isCR ? "#0F1214" : theme.primary,
    accent: theme.accent
  },
  {
    eyebrow: "Live · 23 on court",
    live: true,
    title: "Mia C. is at Open Play.",
    meta: "Court 2 · Old Coast · 2 spots left",
    footer: "Walk-in welcome until 7 PM",
    cta: "Join",
    bg: "#0F1214",
    accent: "#E11D2A"
  },
  {
    eyebrow: "Recommended · 3.0–3.5",
    title: "Spring Doubles Bracket.",
    meta: "Sat Apr 6 · Dill Dinkers",
    footer: "Team up with Reese — same skill, same nights",
    cta: "Register",
    bg: theme.primary,
    accent: theme.accent
  }];

  const scrollRef = React.useRef(null);
  const [idx, setIdx] = useStateAP(0);
  React.useEffect(() => {
    const el = scrollRef.current;if (!el) return;
    const onScroll = () => setIdx(Math.round(el.scrollLeft / el.clientWidth));
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div style={{ margin: "0 -20px" }}>
      <div ref={scrollRef} style={{
        display: "flex", gap: 10, overflowX: "auto", overflowY: "hidden",
        scrollSnapType: "x mandatory", scrollbarWidth: "none",
        paddingInline: 20, paddingBottom: 4
      }}>
        {slides.map((s, i) =>
        <div key={i} style={{
          flex: "0 0 calc(100% - 36px)", scrollSnapAlign: "center",
          background: s.bg, color: "#fff", borderRadius: 8,
          padding: "20px 22px 22px", minHeight: 192,
          display: "flex", flexDirection: "column", justifyContent: "space-between",
          position: "relative", overflow: "hidden"
        }}>
            <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: 999, background: s.accent || t.surface, opacity: 0.08, pointerEvents: "none" }} />
            <div style={{ position: "relative" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", color: s.accent || "rgba(255,255,255,.85)", marginBottom: 12 }}>
                {s.live && <span style={{ width: 6, height: 6, borderRadius: 999, background: "#E11D2A", display: "inline-block" }} />}
                {s.eyebrow}
              </div>
              <h3 style={{ margin: 0, fontFamily: theme.display, fontWeight: 800, fontSize: 24, lineHeight: "26px", letterSpacing: -0.7, color: "#fff" }}>{s.title}</h3>
              <div style={{ marginTop: 8, fontSize: 12, color: "rgba(255,255,255,.7)", fontWeight: 500 }}>{s.meta}</div>
            </div>
            <div style={{ position: "relative", marginTop: 16, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,.7)", fontWeight: 500, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.footer}</span>
              <button style={{
              flexShrink: 0, height: 34, padding: "0 14px", borderRadius: 8, border: 0,
              background: t.surface, color: t.text, fontFamily: "inherit", fontWeight: 700, fontSize: 12, cursor: "pointer",
              display: "inline-flex", alignItems: "center", gap: 6
            }}>{s.cta} <Icon name="ArrowRight" size={12} strokeWidth={2.5} /></button>
            </div>
          </div>
        )}
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 12 }}>
        {slides.map((_, i) =>
        <span key={i} style={{
          width: i === idx ? 18 : 6, height: 6, borderRadius: 8,
          background: i === idx ? "#0F1214" : t.line, transition: "all 140ms"
        }} />
        )}
      </div>
    </div>);

}

// ---- Mobile KPI strip — matches desktop's hairline grid, scaled down ----
function MobileKPIStrip({ theme }) {
  const t = theme.t || { bg: "#fff", surface: "#fff", surfaceSoft: "#F4F5F6", text: "#0F1214", textMuted: "#4B5052", textSubtle: "#858F8F", textInverted: "#fff", line: "#E9EBEC", rule: "#0F1214", chip: "#F4F5F6" };
  const kpis = [
  { k: PLAYER.dupr.toFixed(2), v: "DUPR", delta: `↑ +${PLAYER.duprDelta.toFixed(1)}` },
  { k: PLAYER.wl, v: "W / L", delta: "75% win" },
  { k: PLAYER.sessions, v: "Sessions", delta: `${PLAYER.hours} hrs` },
  { k: "🔥 " + PLAYER.streak, v: "Streak", delta: "weeks" }];

  return (
    <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", borderTop: `1px solid ${t.line}`, borderBottom: `1px solid ${t.line}` }}>
      {kpis.map((s, i) =>
      <div key={i} style={{
        padding: "14px 10px",
        borderRight: i < 3 ? `1px solid ${t.line}` : 0
      }}>
          <div style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 20, color: t.text, letterSpacing: -0.4, lineHeight: 1 }}>{s.k}</div>
          <div style={{ marginTop: 6, fontSize: 9, color: t.text, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>{s.v}</div>
          <div style={{ marginTop: 2, fontSize: 10, color: t.textSubtle, fontWeight: 500 }}>{s.delta}</div>
        </div>
      )}
    </div>);

}

// ---- Player slab — minimal, typographic, single dark surface ----
function PlayerSlab({ theme }) {
  return (
    <div style={{
      background: "#0F1214", color: "#fff", borderRadius: 8,
      padding: "20px 22px"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
        <div style={{ width: 44, height: 44, borderRadius: 999, background: "#fff", color: "#0F1214", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: theme.display, fontWeight: 800, fontSize: 14, flexShrink: 0 }}>{PLAYER.avatar}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: theme.display, fontWeight: 700, fontSize: 18, letterSpacing: -0.3 }}>{PLAYER.name}</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,.6)", marginTop: 2 }}>Plays at {PLAYER.clubsPlayedAt.length} clubs · {PLAYER.clubsPlayedAt.filter((c) => c.joined).length} memberships</div>
        </div>
        <div style={{ fontFamily: theme.display, fontWeight: 700, fontSize: 16 }}>🔥 {PLAYER.streak}</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr 1fr 1fr", gap: 12, borderTop: "1px solid rgba(255,255,255,.1)", paddingTop: 14 }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, color: "rgba(255,255,255,.5)" }}>DUPR</div>
          <div style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 26, lineHeight: 1, marginTop: 4 }}>{PLAYER.dupr.toFixed(2)}</div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#7CE0B5", marginTop: 2 }}>↑ +{PLAYER.duprDelta.toFixed(1)}</div>
        </div>
        {[{ k: "SESSIONS", v: PLAYER.sessions }, { k: "HOURS", v: PLAYER.hours }, { k: "W/L", v: PLAYER.wl }].map((s) =>
        <div key={s.k}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, color: "rgba(255,255,255,.5)" }}>{s.k}</div>
            <div style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 22, lineHeight: 1, marginTop: 4 }}>{s.v}</div>
          </div>
        )}
      </div>
    </div>);

}

// ---- Primary tiles — minimal hairline rows, not chunky cards ----
function PrimaryRows({ theme, isCR, onOpenEventList, onFindClubs, onBookCourt }) {
  const t = theme.t || { bg: "#fff", surface: "#fff", surfaceSoft: "#F4F5F6", text: "#0F1214", textMuted: "#4B5052", textSubtle: "#858F8F", textInverted: "#fff", line: "#E9EBEC", rule: "#0F1214", chip: "#F4F5F6" };
  // Match the desktop PrimaryActionGrid action set so mobile has the same 4
  // entry points. CR universal swaps "Open play" for "Find clubs near me"
  // since the player isn't tied to a single venue.
  const rows = isCR ?
  [
  { label: "Book a court", sub: "148 courts near you · open now", icon: "Calendar", onClick: onBookCourt || onOpenEventList },
  { label: "Find an event", sub: "23 this week · 8 tonight", icon: "Trophy", onClick: onOpenEventList },
  { label: "Find clubs near me", sub: "6 clubs within 10 mi", icon: "MapPin", onClick: onFindClubs },
  { label: "Book a pro lesson", sub: "34 pros within 10 mi", icon: "GraduationCap" }] :

  [
  { label: "Book a court", sub: "148 courts near you · open now", icon: "Calendar", onClick: onBookCourt || onOpenEventList },
  { label: "Find an event", sub: "23 this week · 8 tonight", icon: "Trophy", onClick: onOpenEventList },
  { label: "Open play & ladders", sub: "4 tonight · all levels", icon: "Users" },
  { label: "Book a pro lesson", sub: "34 pros within 10 mi", icon: "GraduationCap" }];

  return (
    <div>
      {rows.map((r, i) =>
      <button key={r.label} onClick={r.onClick} style={{
        width: "100%", display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 16, alignItems: "center",
        padding: "18px 4px", background: "transparent", border: 0,
        borderTop: i === 0 ? "0" : `1px solid ${t.line}`,
        cursor: r.onClick ? "pointer" : "default", fontFamily: "inherit", textAlign: "left"
      }}>
          <span style={{ width: 32, height: 32, borderRadius: 999, background: theme.softTint, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name={r.icon} size={15} color={theme.primary} strokeWidth={2} />
          </span>
          <div>
            <div style={{ fontFamily: theme.display, fontWeight: 700, fontSize: 16, color: t.text, letterSpacing: -0.3 }}>{r.label}</div>
            <div style={{ fontSize: 12, color: t.textMuted, fontWeight: 500, marginTop: 2 }}>{r.sub}</div>
          </div>
          <Icon name="ArrowRight" size={16} strokeWidth={2} color={t.text} />
        </button>
      )}
    </div>);

}

function SectionHeader({ title, action, theme }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", paddingTop: 36, paddingBottom: 14, borderBottom: "1px solid #0F1214" }}>
      <h2 style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 14, letterSpacing: 1.2, textTransform: "uppercase", color: "#0F1214", margin: 0 }}>{title}</h2>
      {action && <a href="#" style={{ fontSize: 12, color: "#4B5052", fontWeight: 600, textDecoration: "none" }}>{action} ›</a>}
    </div>);

}

function ClubsRow({ theme, isCR, onOpenClub, items }) {
  const t = theme.t || { bg: "#fff", surface: "#fff", surfaceSoft: "#F4F5F6", text: "#0F1214", textMuted: "#4B5052", textSubtle: "#858F8F", textInverted: "#fff", line: "#E9EBEC", rule: "#0F1214", chip: "#F4F5F6" };
  const list = items || PLAYER.clubsPlayedAt;
  return (
    <div>
      {list.map((c, i) =>
      <button key={c.id} onClick={onOpenClub} style={{
        width: "100%", display: "grid", gridTemplateColumns: "auto 1fr auto auto", gap: 14, alignItems: "center",
        padding: "16px 4px", background: "transparent", border: 0,
        borderBottom: `1px solid ${t.line}`,
        cursor: "pointer", fontFamily: "inherit", textAlign: "left"
      }}>
          <span style={{ width: 32, height: 32, borderRadius: 8, background: c.color, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: theme.display, fontWeight: 800, fontSize: 11 }}>{c.logoMark}</span>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: theme.display, fontWeight: 700, fontSize: 14, color: t.text, letterSpacing: -0.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.name}</div>
            <div style={{ fontSize: 11, color: t.textMuted, fontWeight: 500, marginTop: 2 }}>{c.miles} mi · {c.sessions} sessions · {c.courts} courts</div>
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: c.joined ? c.tierColor : "#858F8F", letterSpacing: 0.3, textTransform: "uppercase" }}>{c.tier}</div>
          <Icon name="ChevronRight" size={14} color="#858F8F" strokeWidth={2} />
        </button>
      )}
    </div>);

}

function DiscoverClubsRow({ theme }) {
  const nearby = [
  { id: "wc", name: "Wrightsville Courts", logoMark: "WC", color: "#0F1214", miles: 2.4, courts: 6 },
  { id: "cv", name: "Cape Valley Club", logoMark: "CV", color: "#D6573B", miles: 5.1, courts: 4 }];

  return (
    <div>
      {nearby.map((c) =>
      <button key={c.id} style={{
        width: "100%", display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 14, alignItems: "center",
        padding: "16px 4px", background: "transparent", border: 0,
        borderBottom: "1px solid #E9EBEC",
        cursor: "pointer", fontFamily: "inherit", textAlign: "left"
      }}>
          <span style={{ width: 32, height: 32, borderRadius: 8, background: c.color, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: theme.display, fontWeight: 800, fontSize: 11 }}>{c.logoMark}</span>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: theme.display, fontWeight: 700, fontSize: 14, color: "#0F1214", letterSpacing: -0.2 }}>{c.name}</div>
            <div style={{ fontSize: 11, color: "#4B5052", fontWeight: 500, marginTop: 2 }}>{c.miles} mi · {c.courts} courts · <span style={{ color: "#2E7D32", fontWeight: 600 }}>Booking open</span></div>
          </div>
          <Icon name="ChevronRight" size={14} color="#858F8F" strokeWidth={2} />
        </button>
      )}
    </div>);

}

// ---- Mobile For-you / Upcoming — segmented pair on mobile ----
function MobileForYouUpcoming({ theme }) {
  const [tab, setTab] = useStateAP("foryou");
  return (
    <div>
      <SegmentedHeading
        tabs={[
        { k: "foryou", label: "For you" },
        { k: "upcoming", label: "My upcoming" }]
        }
        value={tab} onChange={setTab} theme={theme}
        action={<a href="#" style={{ fontSize: 12, color: theme.primary, fontWeight: 600, textDecoration: "none" }}>
          {tab === "foryou" ? "See all" : "View all"} ›
        </a>} />
      {tab === "foryou" ? <ForYouRow theme={theme} /> : <MyUpcomingList theme={theme} />}
    </div>);

}

function ForYouRow({ theme }) {
  return (
    <div style={{ padding: "18px 4px", borderBottom: "1px solid #E9EBEC", display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 16, alignItems: "center" }}>
      <span style={{ width: 32, height: 32, borderRadius: 999, background: theme.softTint, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
        <Icon name="Sparkles" size={14} color={theme.primary} strokeWidth={2} />
      </span>
      <div>
        <div style={{ fontFamily: theme.display, fontWeight: 700, fontSize: 15, color: "#0F1214", letterSpacing: -0.2 }}>Your dink game is improving fast</div>
        <div style={{ fontSize: 12, color: "#4B5052", fontWeight: 500, marginTop: 4, lineHeight: 1.45 }}>
          Try the Intermediate Drilling session at Club Pickleball USA — targets exactly where you're growing.
        </div>
      </div>
      <a href="#" style={{ fontSize: 12, color: "#0F1214", fontWeight: 600, textDecoration: "underline" }}>View</a>
    </div>);

}

function MyUpcomingList({ theme }) {
  const items = [
  { title: "Court 3 reserved", club: "Old Coast Pickleball", clubColor: "#2E5D52", time: "Today · 4:30 PM", meta: "1 hr · Singles · 2.1 mi" },
  { title: "3.0–3.25 Round Robin", club: "Old Coast Pickleball", clubColor: "#2E5D52", time: "Today · 6:00 PM", meta: "3 hrs · $15 · 1 spot left" },
  { title: "Lesson w/ Coach Ryan", club: "Dill Dinkers Jax", clubColor: "#8E5BE8", time: "Thu · 10:00 AM", meta: "1 hr · Private · $85" }];

  return (
    <div>
      {items.map((it, i) =>
      <button key={i} style={{
        width: "100%", display: "grid", gridTemplateColumns: "92px 1fr auto", gap: 16, alignItems: "center",
        padding: "18px 4px", background: "transparent", border: 0,
        borderBottom: "1px solid #E9EBEC",
        cursor: "pointer", fontFamily: "inherit", textAlign: "left"
      }}>
          <div>
            <div style={{ fontFamily: theme.display, fontWeight: 700, fontSize: 14, color: "#0F1214", letterSpacing: -0.2 }}>{it.time.split(" · ")[0]}</div>
            <div style={{ fontSize: 11, color: "#4B5052", fontWeight: 500, marginTop: 2 }}>{it.time.split(" · ")[1]}</div>
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: theme.display, fontWeight: 700, fontSize: 15, color: "#0F1214", letterSpacing: -0.2 }}>{it.title}</div>
            <div style={{ marginTop: 6 }}>
              <ClubTag club={it.club} color={it.clubColor} size="sm" variant="tag" />
            </div>
            <div style={{ fontSize: 12, color: "#4B5052", fontWeight: 500, marginTop: 4 }}>
              {it.meta}
            </div>
          </div>
          <Icon name="ChevronRight" size={14} color="#858F8F" strokeWidth={2} />
        </button>
      )}
    </div>);

}

// ---- Messages screen — takeover view shown when the Messages tab in
// the mobile bottom nav is active. Header with title + compose action,
// search field, and a list of conversation rows (avatar, name, last
// message preview, last-activity date, unread badge). Group threads
// stack two mini avatars in the same slot.
function MessagesScreen({ theme }) {
  const t = theme.t || { bg: "#fff", surface: "#fff", surfaceSoft: "#F4F5F6", text: "#0F1214", textMuted: "#4B5052", textSubtle: "#858F8F", textInverted: "#fff", line: "#E9EBEC", rule: "#0F1214", chip: "#F4F5F6" };
  const [query, setQuery] = useStateAP("");
  const [view, setView] = useStateAP("list"); // "list" | "compose" | "thread"
  const [activeThread, setActiveThread] = useStateAP(null);
  const [toast, setToast] = useStateAP("");
  // Show a transient toast after a successful send. Self-clears after 2.4s
  // so the user lands back on the conversation list with a soft confirm.
  React.useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(""), 2400);
    return () => clearTimeout(id);
  }, [toast]);
  const initialThreads = [
  { id: "t1", who: "Marcus Reyes", avatar: "MR", preview: "Perfect. See you there!", date: "May 10", unread: 1,
    online: true,
    messages: [
    { from: "them", text: "Hey Joshua! You up for doubles Saturday morning?", date: "May 10 · 9:42 AM" },
    { from: "me", text: "Absolutely, what time were you thinking?", date: "May 10 · 9:45 AM", status: "read", readAt: "9:46 AM" },
    { from: "them", text: "9am at Old Coast \u2014 I can book the court if you grab a fourth", date: "May 10 · 9:47 AM" },
    { from: "me", text: "I'll ask Tim, he's been looking for a game", date: "May 10 · 9:52 AM", status: "read", readAt: "9:53 AM" },
    { from: "them", text: "Perfect. See you there!", date: "May 10 · 10:01 AM" }],
    dayLabel: "Sunday, May 10" },
  { id: "t2", who: "Sarah Chen", avatar: "SC", preview: "Maybe I will! Is it every Tuesday?", date: "May 9", unread: 1,
    online: false, lastSeen: "Last seen 2h ago",
    messages: [
    { from: "them", text: "Saw you on the 3.5 ladder \u2014 nice climb!", date: "May 9 · 6:14 PM" },
    { from: "me", text: "Thanks! Been grinding the round robins.", date: "May 9 · 6:16 PM", status: "read", readAt: "6:18 PM" },
    { from: "them", text: "You should come to the Tuesday clinic, Coach Reid is great.", date: "May 9 · 6:20 PM" },
    { from: "me", text: "I'll check my schedule. What time?", date: "May 9 · 6:21 PM", status: "read", readAt: "6:22 PM" },
    { from: "them", text: "Maybe I will! Is it every Tuesday?", date: "May 9 · 6:25 PM" }],
    dayLabel: "Saturday, May 9" },
  { id: "t3", who: "Old Coast Courts Crew", avatar: "OC", avatarColor: "#2E5D52", preview: "Let me know when it reopens", date: "May 8", unread: 1, group: true,
    online: false, lastSeen: "4 members",
    messages: [
    { from: "them", sender: "Diana P.", text: "Heads up \u2014 court 4 is closed for resurfacing through Monday.", date: "May 8 · 11:02 AM" },
    { from: "them", sender: "Marcus R.", text: "Thanks for the heads up!", date: "May 8 · 11:15 AM" },
    { from: "me", text: "Good to know. Are the others open this weekend?", date: "May 8 · 11:30 AM", status: "read", readAt: "by Diana, Marcus" },
    { from: "them", sender: "Diana P.", text: "Yep, 1\u20133 are all good. Let me know when it reopens", date: "May 8 · 11:48 AM" }],
    dayLabel: "Friday, May 8" },
  { id: "t4", who: "Emma Johnson", avatar: "EJ", preview: "Thank you so much! I'd love that. Still learning the basics but sup\u2026", date: "May 7", unread: 1,
    online: false, lastSeen: "Last seen yesterday",
    messages: [
    { from: "me", text: "Hey! Mia mentioned you're picking up pickleball \u2014 welcome!", date: "May 7 · 8:02 PM", status: "read", readAt: "8:05 PM" },
    { from: "them", text: "Thank you! I'm pretty new \u2014 any tips on a paddle?", date: "May 7 · 8:08 PM" },
    { from: "me", text: "Old Coast pro shop will let you demo a few. Happy to play a casual session too.", date: "May 7 · 8:11 PM", status: "read", readAt: "8:14 PM" },
    { from: "them", text: "Thank you so much! I'd love that. Still learning the basics but super excited.", date: "May 7 · 8:16 PM" }],
    dayLabel: "Thursday, May 7" }];

  const [threads, setThreads] = useStateAP(initialThreads);
  // Sync the active thread reference whenever the threads list updates so
  // ConversationView sees the latest messages even after we mutate state
  // from outside the conversation (e.g. creating a new thread).
  const liveActiveThread = activeThread ? threads.find((th) => th.id === activeThread.id) || activeThread : null;

  const updateThread = (id, updater) => {
    setThreads((prev) => {
      const idx = prev.findIndex((th) => th.id === id);
      if (idx < 0) return prev;
      const next = [...prev];
      next[idx] = updater(next[idx]);
      // Move the touched thread to the top of the list so the most-recent
      // conversation always reads first \u2014 same as iOS Messages.
      const [moved] = next.splice(idx, 1);
      return [moved, ...next];
    });
  };

  const createThread = (contacts) => {
    const ids = contacts.map((c) => c.id).join("|");
    const id = "new-" + ids + "-" + Date.now();
    const isGroup = contacts.length > 1;
    const who = isGroup ?
    contacts.map((c) => c.name.split(" ")[0]).join(", ") :
    contacts[0].name;
    const avatar = isGroup ?
    contacts.slice(0, 2).map((c) => c.name[0]).join("").toUpperCase() :
    contacts[0].avatar;
    const avatarColor = isGroup ? "#0F1214" : contacts[0].color;
    const thread = {
      id, who, avatar, avatarColor,
      preview: "", date: "Now", unread: 0,
      online: !isGroup, lastSeen: isGroup ? `${contacts.length} members` : "",
      group: isGroup,
      messages: [], dayLabel: "Today"
    };
    setThreads((prev) => [thread, ...prev]);
    setActiveThread(thread);
    setView("thread");
  };
  const filtered = !query.trim() ? threads : threads.filter((th) =>
  th.who.toLowerCase().includes(query.toLowerCase()) ||
  (th.preview || "").toLowerCase().includes(query.toLowerCase()));

  return (
    <div style={{ background: t.surface, color: t.text, minHeight: "100%", fontFamily: "Inter, system-ui, sans-serif", position: "relative" }}>
      {view === "compose" ?
      <ComposeMessage theme={theme}
      onBack={() => setView("list")}
      onPicked={(contacts) => createThread(contacts)} /> :
      view === "thread" && liveActiveThread ?
      <ConversationView theme={theme} thread={liveActiveThread}
      onBack={() => {setView("list");setActiveThread(null);}}
      onMessageSent={(msg) => updateThread(liveActiveThread.id, (th) => ({
        ...th,
        messages: [...th.messages, msg],
        preview: msg.text,
        date: "Now",
        unread: 0
      }))}
      onUpdateMessage={(index, patch) => updateThread(liveActiveThread.id, (th) => {
        const next = [...th.messages];
        next[index] = { ...next[index], ...patch };
        return { ...th, messages: next };
      })} /> :

      <React.Fragment>
          {/* Title bar — centered title, compose action top-right. Hairline
          divider beneath sets the boundary from the list. */}
          <div style={{
          height: 56, padding: "0 20px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          borderBottom: `1px solid ${t.line}`
        }}>
            <div style={{ width: 36 }} aria-hidden />
            <div style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 17, letterSpacing: -0.2 }}>Messages</div>
            <button aria-label="New message" onClick={() => setView("compose")} style={{
            width: 36, height: 36, borderRadius: 8, border: 0, background: "transparent", color: t.text,
            display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
          }}>
              <Icon name="SquarePen" size={20} strokeWidth={2} />
            </button>
          </div>

          {/* Search */}
          <div style={{ padding: "20px 20px 12px" }}>
            <div style={{
            display: "flex", alignItems: "center", gap: 10,
            height: 44, padding: "0 16px",
            background: t.surfaceSoft, borderRadius: 999
          }}>
              <Icon name="Search" size={16} color={t.textSubtle} strokeWidth={2} />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search conversations"
            style={{ flex: 1, border: 0, outline: 0, background: "transparent", fontFamily: "inherit", fontSize: 15, color: t.text }} />
            </div>
          </div>

          {/* Conversation list */}
          <div style={{ padding: "4px 0 24px" }}>
            {filtered.map((th, i) =>
          <button key={th.id} onClick={() => {setActiveThread(th);setView("thread");}} style={{
            width: "100%", border: 0, background: "transparent", cursor: "pointer",
            display: "grid", gridTemplateColumns: "56px 1fr auto", gap: 14, alignItems: "center",
            padding: "16px 20px",
            borderBottom: i < filtered.length - 1 ? `1px solid ${t.line}` : 0,
            fontFamily: "inherit", textAlign: "left"
          }}>
                {/* Avatar slot — single circle, tinted with the contact's
              accent color when present (e.g. club color for groups). */}
                <div style={{ width: 48, height: 48, position: "relative" }}>
                  <span style={{
                width: 48, height: 48, borderRadius: 999,
                background: th.avatarColor || "#0F1214", color: "#fff",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                fontFamily: theme.display, fontWeight: 800, fontSize: 14
              }}>{th.avatar}</span>
                </div>

                {/* Name + last message preview */}
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 15, color: t.text, letterSpacing: -0.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{th.who}</div>
                  <div style={{ marginTop: 4, fontSize: 13, color: t.textMuted, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{th.preview}</div>
                </div>

                {/* Meta column — date + unread badge */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                  <span style={{ fontFamily: theme.display, fontWeight: 700, fontSize: 12, color: t.text, letterSpacing: -0.1 }}>{th.date}</span>
                  {th.unread > 0 &&
              <span style={{
                minWidth: 18, height: 18, padding: "0 6px",
                borderRadius: 999, background: "#E11D2A", color: "#fff",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                fontFamily: theme.display, fontWeight: 800, fontSize: 10
              }}>{th.unread}</span>
              }
                </div>
              </button>
          )}
          </div>
        </React.Fragment>
      }

      {/* Toast removed — read receipts now do the confirming work inline
                     beneath each outgoing message bubble (iOS Messages pattern). */}
    </div>);

}

// ---- Conversation view — opened by tapping any thread on the Messages
// list, or transitioned into immediately after picking a recipient in
// compose. Header has back arrow, avatar circle, name + online status.
// Body shows a day-divider followed by message bubbles (outgoing
// right-aligned black, incoming left-aligned with the sender avatar +
// hairline border). The composer at the bottom is the only place to send
// — there is no header send action, matching iOS Messages. Outgoing
// bubbles render a small status footer underneath: "Sending…" → "Delivered"
// → "Read at 2:14 PM". Newly sent messages simulate this progression with
// timers; seeded messages render their final state immediately.
function ConversationView({ theme, thread, onBack, onMessageSent, onUpdateMessage }) {
  const t = theme.t || { bg: "#fff", surface: "#fff", surfaceSoft: "#F4F5F6", text: "#0F1214", textMuted: "#4B5052", textSubtle: "#858F8F", textInverted: "#fff", line: "#E9EBEC", rule: "#0F1214", chip: "#F4F5F6" };
  const [draft, setDraft] = useStateAP("");
  const scrollerRef = React.useRef(null);
  const messages = thread.messages || [];
  // Auto-scroll to the bottom on mount and whenever the message count
  // changes so the latest message stays visible.
  React.useLayoutEffect(() => {
    const el = scrollerRef.current;if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages.length]);

  // Format a timestamp like "2:14 PM" for the current moment — used as a
  // realistic "read at" stamp on simulated reads.
  const nowStamp = () => {
    const d = new Date();
    let h = d.getHours();
    const m = String(d.getMinutes()).padStart(2, "0");
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h}:${m} ${ampm}`;
  };

  const canSend = draft.trim().length > 0;
  const send = () => {
    if (!canSend) return;
    const text = draft.trim();
    const newMsg = { from: "me", text, date: "Now", status: "sending" };
    setDraft("");
    // Snapshot the position the message will land at so the followup
    // status updates target the right index.
    const insertIndex = messages.length;
    onMessageSent && onMessageSent(newMsg);
    // Simulate delivery → read receipts. Stagger so the user sees the
    // status transition in real time, matching iOS behavior.
    setTimeout(() => onUpdateMessage && onUpdateMessage(insertIndex, { status: "delivered" }), 900);
    setTimeout(() => onUpdateMessage && onUpdateMessage(insertIndex, { status: "read", readAt: nowStamp() }), 3000);
  };
  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {e.preventDefault();send();}
  };

  // Render the small status line below outgoing bubbles. Falls back to the
  // bubble's date when no status is set (paranoia path — every outgoing
  // message in the seed has an explicit status).
  const statusLine = (m) => {
    if (m.status === "sending") return "Sending\u2026";
    if (m.status === "delivered") return "Delivered";
    if (m.status === "read") return m.readAt ? `Read ${m.readAt}` : "Read";
    return m.date;
  };

  return (
    <div style={{ minHeight: "100%", display: "flex", flexDirection: "column", background: t.surface }}>
      {/* Header — back, avatar, name, online status. Hairline divider
                     beneath sets it off from the message stream. */}
      <div style={{
        height: 64, padding: "0 12px 0 4px",
        display: "flex", alignItems: "center", gap: 12,
        borderBottom: `1px solid ${t.line}`, flexShrink: 0
      }}>
        <button onClick={onBack} aria-label="Back" style={{
          width: 44, height: 44, borderRadius: 8, border: 0, background: "transparent", color: t.text,
          display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0
        }}>
          <Icon name="ChevronLeft" size={22} strokeWidth={2.2} />
        </button>
        <span style={{
          width: 40, height: 40, borderRadius: 999, flexShrink: 0,
          background: thread.avatarColor || "#0F1214", color: "#fff",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          fontFamily: theme.display, fontWeight: 800, fontSize: 12
        }}>{thread.avatar}</span>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 17, letterSpacing: -0.2, color: t.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{thread.who}</div>
          <div style={{ marginTop: 1, display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: t.textSubtle, fontWeight: 500 }}>
            <span style={{ width: 6, height: 6, borderRadius: 999, background: thread.online ? "#1F8A5B" : "#BBBFC1", flexShrink: 0 }} />
            {thread.online ? "Online" : thread.lastSeen || "Offline"}
          </div>
        </div>
      </div>

      {/* Message stream */}
      <div ref={scrollerRef} style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "16px 16px 20px" }}>
        {/* Day divider — soft hairline rule with the day inline */}
        {thread.dayLabel && messages.length > 0 &&
        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "4px 4px 16px" }}>
            <div style={{ flex: 1, height: 1, background: t.line }} />
            <span style={{ fontSize: 11, color: t.textSubtle, fontWeight: 500 }}>{thread.dayLabel}</span>
            <div style={{ flex: 1, height: 1, background: t.line }} />
          </div>
        }

        {messages.length === 0 &&
        <div style={{ marginTop: 40, textAlign: "center", color: t.textSubtle, fontSize: 13, fontWeight: 500 }}>
            New conversation \u2014 say hi.
          </div>
        }

        {messages.map((m, i) => {
          const me = m.from === "me";
          // Only the most recent outgoing message shows its status footer.
          // Older outgoing bubbles in a long thread don't need to keep the
          // receipt visible \u2014 matches iOS Messages where only the last
          // sent message reads "Read at\u2026".
          const isLatestMine = me && messages.slice(i + 1).every((x) => x.from !== "me");
          return (
            <div key={i} style={{
              display: "flex", alignItems: "flex-end", gap: 8, marginBottom: 12,
              flexDirection: me ? "row-reverse" : "row"
            }}>
              {!me &&
              <span style={{
                width: 28, height: 28, borderRadius: 999, flexShrink: 0,
                background: thread.avatarColor || "#0F1214", color: "#fff",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                fontFamily: theme.display, fontWeight: 800, fontSize: 10,
                // Hide the avatar for back-to-back messages from the same
                // sender so the column stays clean.
                visibility: i > 0 && messages[i - 1].from === "them" && messages[i - 1].sender === m.sender ? "hidden" : "visible"
              }}>{thread.avatar}</span>
              }
              <div style={{
                maxWidth: "78%",
                display: "flex", flexDirection: "column", alignItems: me ? "flex-end" : "flex-start", minWidth: 0
              }}>
                {/* Sender name on group threads — only on first message in
                               a run from that person. */}
                {!me && thread.group && m.sender && (i === 0 || messages[i - 1].sender !== m.sender) &&
                <span style={{ fontSize: 10, fontWeight: 700, color: t.textSubtle, marginBottom: 4, letterSpacing: 0.3 }}>{m.sender}</span>
                }
                <div style={{
                  padding: "12px 16px", borderRadius: 18,
                  background: me ? "#0F1214" : t.surface,
                  color: me ? "#fff" : t.text,
                  border: me ? 0 : `1px solid ${t.line}`,
                  borderBottomRightRadius: me ? 6 : 18,
                  borderBottomLeftRadius: me ? 18 : 6,
                  fontSize: 14, lineHeight: 1.45,
                  whiteSpace: "pre-wrap", wordBreak: "break-word"
                }}>{m.text}</div>
                {/* Footer under each bubble: outgoing shows status (only
                               on the latest mine bubble), incoming shows date. */}
                <span style={{ marginTop: 4, fontSize: 10, color: t.textSubtle, fontWeight: 500 }}>
                  {me ? isLatestMine ? statusLine(m) : m.date : m.date}
                </span>
              </div>
            </div>);

        })}
      </div>

      {/* Composer — message input pill + send button. Active state flips
                     when the input has any non-whitespace content. */}
      <div style={{
        borderTop: `1px solid ${t.line}`, background: t.surface,
        padding: "12px 16px 16px", flexShrink: 0,
        display: "flex", alignItems: "center", gap: 10
      }}>
        <div style={{
          flex: 1, height: 40, padding: "0 16px",
          background: t.surfaceSoft, borderRadius: 999,
          display: "flex", alignItems: "center"
        }}>
          <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={onKeyDown}
          placeholder="Message"
          style={{ flex: 1, border: 0, outline: 0, background: "transparent", fontFamily: "inherit", fontSize: 14, color: t.text }} />
        </div>
        <button onClick={send} disabled={!canSend} aria-label="Send" style={{
          width: 40, height: 40, borderRadius: 999, border: 0,
          background: canSend ? theme.primary : t.surfaceSoft,
          color: canSend ? "#fff" : t.textSubtle,
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          cursor: canSend ? "pointer" : "not-allowed",
          transition: "background 160ms, color 160ms",
          flexShrink: 0
        }}>
          <Icon name="Send" size={16} color={canSend ? "#fff" : t.textSubtle} strokeWidth={2.2} />
        </button>
      </div>
    </div>);

}

// ---- Compose new message — minimal recipient picker. As soon as the
// user picks a contact (or contacts), the parent transitions to a real
// ConversationView so the rest of the flow matches replying to any
// existing thread: typing happens in the bottom composer, sending appends
// to the conversation with simulated Delivered / Read receipts.
function ComposeMessage({ theme, onBack, onPicked }) {
  const t = theme.t || { bg: "#fff", surface: "#fff", surfaceSoft: "#F4F5F6", text: "#0F1214", textMuted: "#4B5052", textSubtle: "#858F8F", textInverted: "#fff", line: "#E9EBEC", rule: "#0F1214", chip: "#F4F5F6" };
  const [recipientQuery, setRecipientQuery] = useStateAP("");
  const inputRef = React.useRef(null);

  // Contact pool — pulled from existing player network + friend activity so
  // the dropdown shows recognizable names from the rest of the dashboard.
  const contacts = React.useMemo(() => {
    const map = new Map();
    (PLAYER.network || []).forEach((p) => map.set(p.name, { id: "n-" + p.name, name: p.name, avatar: p.avatar, color: p.color, sub: p.club ? `${p.club} \u00b7 ${p.dupr.toFixed(1)} DUPR` : `${p.dupr.toFixed(1)} DUPR` }));
    (PLAYER.friendActivity || []).forEach((a) => {
      if (!map.has(a.who)) map.set(a.who, { id: "f-" + a.who, name: a.who, avatar: a.avatar, color: a.color, sub: a.club || "" });
    });
    return Array.from(map.values());
  }, []);
  const suggestions = !recipientQuery.trim() ?
  contacts.slice(0, 8) :
  contacts.filter((c) => c.name.toLowerCase().includes(recipientQuery.toLowerCase())).slice(0, 10);

  // Picking a contact immediately transitions the parent into a real
  // ConversationView \u2014 no separate compose body, no send-in-header.
  // The body of the conversation is empty until the user types their first
  // message in the bottom composer, matching iOS Messages exactly.
  const pick = (c) => onPicked && onPicked([c]);

  return (
    <div style={{ minHeight: "100%", display: "flex", flexDirection: "column", background: t.surface }}>
      {/* Title bar \u2014 back arrow on the left, centered "New message"
                     title. NO send button here; sending happens from the bottom of
                     the conversation view once a recipient is picked. */}
      <div style={{
        height: 56, padding: "0 12px 0 4px",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
        borderBottom: `1px solid ${t.line}`, flexShrink: 0
      }}>
        <button onClick={onBack} aria-label="Back" style={{
          width: 44, height: 44, borderRadius: 8, border: 0, background: "transparent", color: t.text,
          display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
        }}>
          <Icon name="ChevronLeft" size={22} strokeWidth={2.2} />
        </button>
        <div style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 17, letterSpacing: -0.2 }}>New message</div>
        <div style={{ width: 44 }} aria-hidden />
      </div>

      {/* To: search field. As the user types, the list below filters in
                     real time. Tapping a result immediately starts the conversation. */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10, padding: "12px 20px",
        borderBottom: `1px solid ${t.line}`, flexShrink: 0
      }}>
        <span style={{ fontFamily: theme.display, fontWeight: 700, fontSize: 13, color: t.textSubtle, flexShrink: 0 }}>To:</span>
        <input ref={inputRef} value={recipientQuery} onChange={(e) => setRecipientQuery(e.target.value)}
        placeholder="Search by name" autoFocus
        style={{ flex: 1, height: 34, border: 0, outline: 0, background: "transparent", fontFamily: "inherit", fontSize: 15, color: t.text }} />
      </div>

      {/* Suggested contacts \u2014 always visible. Filtered as the user types. */}
      <div style={{ flex: 1, overflowY: "auto", padding: "4px 0 16px" }}>
        {suggestions.length === 0 ?
        <div style={{ padding: "32px 20px", textAlign: "center", color: t.textSubtle, fontSize: 13, fontWeight: 500 }}>
            No matches for "{recipientQuery}"
          </div> :

        <React.Fragment>
            <div style={{ padding: "12px 20px 6px", fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", color: t.textSubtle }}>
              {recipientQuery ? "Players" : "Suggested"}
            </div>
            {suggestions.map((c) =>
          <button key={c.id} onClick={() => pick(c)} style={{
            width: "100%", border: 0, background: "transparent", cursor: "pointer",
            display: "grid", gridTemplateColumns: "48px 1fr auto", gap: 12, alignItems: "center",
            padding: "10px 20px",
            fontFamily: "inherit", textAlign: "left"
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = t.surfaceSoft}
          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                <span style={{
              width: 40, height: 40, borderRadius: 999,
              background: c.color || "#0F1214", color: "#fff",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              fontFamily: theme.display, fontWeight: 800, fontSize: 12
            }}>{c.avatar}</span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: theme.display, fontWeight: 700, fontSize: 14, color: t.text, letterSpacing: -0.2 }}>{c.name}</div>
                  {c.sub && <div style={{ marginTop: 2, fontSize: 12, color: t.textSubtle, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.sub}</div>}
                </div>
                <Icon name="ChevronRight" size={16} strokeWidth={2} color={t.textSubtle} />
              </button>
          )}
          </React.Fragment>
        }
      </div>
    </div>);

}

function MobileBottomNav({ theme, flow = false, active = "home", onChange }) {
  const t = theme.t || { bg: "#fff", surface: "#fff", surfaceSoft: "#F4F5F6", text: "#0F1214", textMuted: "#4B5052", textSubtle: "#858F8F", textInverted: "#fff", line: "#E9EBEC", rule: "#0F1214", chip: "#F4F5F6" };
  const [sheetOpen, setSheetOpen] = useStateAP(false);
  // Five-slot nav: home / activity / add (called-out FAB) / messages / profile.
  // Icons only — no labels — to keep the bar lean and let the center action
  // breathe. The middle item is rendered as a raised primary-colored circle.
  const items = [
  { key: "home", icon: "Home", label: "Home" },
  { key: "activity", icon: "Activity", label: "Activity" },
  { key: "add", icon: "Plus", label: "Add", callout: true },
  { key: "messages", icon: "MessageSquare", label: "Messages", badge: 3 },
  { key: "profile", icon: "User", label: "Profile" }];

  return (
    <React.Fragment>
      <div style={{
        position: flow ? "relative" : "absolute", left: 0, right: 0, bottom: 0,
        background: t.surface, borderTop: `1px solid ${t.line}`,
        // Bar content height ~60px. The bottom inset is a separate safe-
        // area cushion, not part of the bar height — keeps the nav from
        // feeling like an oversized panel.
        padding: "2px 8px 10px",
        display: "grid", gridTemplateColumns: "repeat(5, 1fr)", alignItems: "center",
        zIndex: 60
      }}>
        {items.map((item) => item.callout ?
        <button key={item.label} aria-label={item.label}
        onClick={() => setSheetOpen((s) => !s)}
        style={{
          justifySelf: "center",
          width: 56, height: 56, borderRadius: 999,
          background: theme.primary, color: "#fff",
          border: 0, cursor: "pointer",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          // Stronger lift shadow — sells the "raised" affordance against
          // the bar without needing a notch cutout.
          boxShadow: "0 6px 18px rgba(15,18,20,.22), 0 2px 6px rgba(15,18,20,.12)",
          // Overlap the bar's top edge by ~50% of the FAB's height so the
          // button visually sits in the bar, not floating above it.
          transform: sheetOpen ? "translateY(-20px) rotate(45deg)" : "translateY(-20px)",
          transition: "transform 180ms cubic-bezier(.2,.8,.2,1)"
        }}>
            <Icon name={item.icon} size={26} color="#fff" strokeWidth={2.6} />
          </button> :

        <button key={item.label} aria-label={item.label}
        onClick={() => onChange && onChange(item.key)}
        style={{
          background: "transparent", border: 0, cursor: "pointer",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          padding: "4px 0", position: "relative"
        }}>
            <span style={{ position: "relative", display: "inline-flex" }}>
              <Icon name={item.icon} size={22} color={active === item.key ? theme.primary : "#858F8F"} strokeWidth={active === item.key ? 2.4 : 1.8} />
              {item.badge &&
            <span style={{ position: "absolute", top: -4, right: -8, minWidth: 16, height: 16, padding: "0 4px", borderRadius: 8, background: "#E11D2A", color: "#fff", fontSize: 9, fontWeight: 800, fontFamily: theme.display, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{item.badge}</span>
            }
            </span>
          </button>
        )}
      </div>
      {sheetOpen && <MobileAddSheet theme={theme} onClose={() => setSheetOpen(false)} />}
    </React.Fragment>);

}

// Bottom action sheet — surfaced when the called-out "+" in the bottom nav
// is tapped. Anchored to the bottom of the dashboard root (the nav's parent
// is position:relative), so the scrim covers the artboard, not the whole page.
function MobileAddSheet({ theme, onClose }) {
  const t = theme.t || { bg: "#fff", surface: "#fff", surfaceSoft: "#F4F5F6", text: "#0F1214", textMuted: "#4B5052", textSubtle: "#858F8F", textInverted: "#fff", line: "#E9EBEC", rule: "#0F1214", chip: "#F4F5F6" };
  React.useEffect(() => {
    const onKey = (e) => {if (e.key === "Escape") onClose();};
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  // Each action navigates via the window-level escape hatches registered
  // in Combined (no prop-drilling needed since this sheet floats over
  // any screen). "Book a pro" doesn't have a destination yet — we keep
  // it inert so taps just dismiss the sheet.
  const actions = [
  { icon: "CalendarPlus", label: "Book a court", sub: "Reserve a court at one of your clubs", onClick: () => window.__openReserveCourt && window.__openReserveCourt() },
  { icon: "Trophy", label: "Find an event", sub: "Tournaments, leagues, open play", onClick: () => window.__navigate && window.__navigate("Events") },
  { icon: "MapPin", label: "Find a location near me", sub: "Discover new places to play", onClick: () => window.__navigate && window.__navigate("Club") },
  { icon: "GraduationCap", label: "Book a pro", sub: "Lessons, clinics and private coaching", onClick: null }];

  return (
    <div onClick={onClose} style={{
      position: "absolute", inset: 0, zIndex: 200,
      background: "rgba(15,18,20,.45)",
      display: "flex", flexDirection: "column", justifyContent: "flex-end",
      animation: "addSheetFade 160ms ease-out"
    }}>
      <style>{`
        @keyframes addSheetFade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes addSheetSlide { from { transform: translateY(20px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
      `}</style>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: t.surface, color: t.text,
        borderTopLeftRadius: 16, borderTopRightRadius: 16,
        padding: "10px 8px 18px",
        animation: "addSheetSlide 220ms cubic-bezier(.2,.8,.2,1)",
        boxShadow: "0 -8px 24px rgba(0,0,0,.10)"
      }}>
        <div style={{ width: 36, height: 4, borderRadius: 999, background: t.line, margin: "4px auto 10px" }} />
        <div style={{ padding: "4px 12px 10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 18, letterSpacing: -0.3 }}>What's next?</div>
          <button onClick={onClose} aria-label="Close" style={{ width: 28, height: 28, borderRadius: 999, background: t.surfaceSoft, border: 0, display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: t.text }}>
            <Icon name="X" size={14} />
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {actions.map((a, i) =>
          <button key={a.label}
          onClick={() => {if (a.onClick) a.onClick();onClose();}}
          disabled={!a.onClick}
          style={{
            background: "transparent", border: 0,
            cursor: a.onClick ? "pointer" : "not-allowed",
            opacity: a.onClick ? 1 : 0.55,
            padding: "14px 12px",
            display: "flex", alignItems: "center", gap: 14,
            borderTop: i === 0 ? "none" : `1px solid ${t.line}`,
            textAlign: "left"
          }}>
              <span style={{
              width: 40, height: 40, borderRadius: 10,
              background: t.surfaceSoft, color: theme.primary,
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0
            }}>
                <Icon name={a.icon} size={20} color={theme.primary} strokeWidth={1.8} />
              </span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: "block", fontFamily: "inherit", fontWeight: 700, fontSize: 15, color: t.text, lineHeight: "20px" }}>{a.label}</span>
                <span style={{ display: "block", fontSize: 12, color: t.textSubtle, fontWeight: 500, marginTop: 2 }}>{a.sub}</span>
              </span>
              <Icon name="ChevronRight" size={16} color={t.textSubtle} strokeWidth={1.8} />
            </button>
          )}
        </div>
      </div>
    </div>);

}

// ---- Mobile primary-action floater — appears after the user scrolls past
// the PrimaryRows block so the 3 main actions stay reachable. Sits above
// the absolute-positioned MobileBottomNav. Fades in/slides up on activation.
function MobilePrimaryFloater({ theme, visible, onOpenEventList, onFindClubs, onBookCourt, isCR }) {
  const t = theme.t || { bg: "#fff", surface: "#fff", surfaceSoft: "#F4F5F6", text: "#0F1214", textMuted: "#4B5052", textSubtle: "#858F8F", textInverted: "#fff", line: "#E9EBEC", rule: "#0F1214", chip: "#F4F5F6" };
  // 4 actions matching PrimaryRows + the desktop PrimaryActionGrid. First is
  // brand-primary; the rest are quiet icon-only-ish pills sized small so the
  // floater stays narrow enough for the phone frame.
  const items = isCR ?
  [
  { icon: "Calendar", label: "Book", aria: "Book a court", onClick: onBookCourt || onOpenEventList, primary: true },
  { icon: "Trophy", label: "Events", aria: "Find an event", onClick: onOpenEventList },
  { icon: "MapPin", label: "Clubs", aria: "Find clubs near me", onClick: onFindClubs },
  { icon: "GraduationCap", label: "Pro", aria: "Book a pro lesson" }] :

  [
  { icon: "Calendar", label: "Book", aria: "Book a court", onClick: onBookCourt || onOpenEventList, primary: true },
  { icon: "Trophy", label: "Events", aria: "Find an event", onClick: onOpenEventList },
  { icon: "Users", label: "Open", aria: "Open play & ladders" },
  { icon: "GraduationCap", label: "Pro", aria: "Book a pro lesson" }];

  return (
    <div style={{
      // Sits above the bottom nav (the nav is ~78px tall). Anchored to the
      // dashboard root so it scrolls in place.
      position: "absolute", left: 12, right: 12, bottom: 88,
      transform: visible ? "translateY(0)" : "translateY(24px)",
      opacity: visible ? 1 : 0,
      pointerEvents: visible ? "auto" : "none",
      transition: "transform 260ms cubic-bezier(.2,.8,.2,1), opacity 200ms ease",
      display: "flex", gap: 6, alignItems: "stretch",
      // In CR (universal) mode the floater stays neutral black; inside a
      // branded experience it picks up the club's primary color so the bar
      // reads as part of the venue's identity.
      background: isCR ?
      theme.dark ? "rgba(20,23,27,.92)" : "rgba(15,18,20,.96)" :
      theme.primary,
      backdropFilter: "blur(14px)",
      padding: 6, borderRadius: 999,
      boxShadow: "0 14px 36px rgba(15,18,20,.32), 0 2px 8px rgba(15,18,20,.18)",
      zIndex: 40
    }}>
      {items.map((it) =>
      <button key={it.label} aria-label={it.aria} onClick={it.onClick} style={{
        flex: it.primary ? 1.3 : 1, height: 40, padding: "0 10px", borderRadius: 999,
        border: 0,
        background: it.primary ? "#fff" : "transparent",
        color: it.primary ? isCR ? "#0F1214" : theme.primary : "#fff",
        fontFamily: "inherit", fontWeight: 700, fontSize: 12, cursor: "pointer",
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 5,
        whiteSpace: "nowrap", minWidth: 0
      }}>
          <Icon name={it.icon} size={13} color={it.primary ? isCR ? "#0F1214" : theme.primary : "#fff"} strokeWidth={2.2} />
          {it.label}
        </button>
      )}
    </div>);

}

function Dashboard({ theme, viewport, onOpenEventList, onOpenClub, onFindClubs, onBookCourt, mode = "branded", app, setApp }) {
  const desktop = viewport === "desktop";
  const isCR = mode === "cr";

  // Desktop always uses the network-discovery layout. Logged-out CR also
  // routes mobile through the same layout (with viewport="mobile" so the
  // section components adapt) — the goal is for the mobile experience to
  // mirror the logged-out home end-to-end. Logged-in / branded mobile
  // surfaces continue to use the legacy mobile dashboard below.
  if (desktop || isCR) return <DashboardDesktop theme={theme} viewport={viewport} onOpenEventList={onOpenEventList} onOpenClub={onOpenClub} onFindClubs={onFindClubs} onBookCourt={onBookCourt} isCR={isCR} app={app} setApp={setApp} />;

  // Track scroll-past of PrimaryRows to reveal the floating CTA bar.
  const primaryRef = React.useRef(null);
  const [pastPrimary, setPastPrimary] = React.useState(false);
  const [qrOpen, setQrOpen] = React.useState(false);
  const [racquetAlertOpen, setRacquetAlertOpen] = React.useState(false);
  // Initial mobile tab — if a route handed us a pending tab on its way
  // home (e.g. user tapped Messages from Find Clubs), pick it up so the
  // dashboard lands on that tab. One-shot — cleared right after.
  const initialTab = typeof window !== "undefined" && window.__pendingMobileTab || "home";
  if (typeof window !== "undefined") delete window.__pendingMobileTab;
  const [mobileTab, setMobileTab] = React.useState(initialTab);
  React.useEffect(() => {
    const el = primaryRef.current;if (!el) return;
    const findScroll = (n) => {
      while (n && n !== document.body) {
        const cs = getComputedStyle(n);
        if (cs.overflowY === "auto" || cs.overflowY === "scroll") return n;
        n = n.parentElement;
      }
      return null;
    };
    const container = findScroll(el.parentElement);
    if (!container) return;
    const onScroll = () => {
      const elRect = el.getBoundingClientRect();
      const cRect = container.getBoundingClientRect();
      // Show floater once PrimaryRows' bottom edge has scrolled out the
      // top of the visible scroll area.
      setPastPrimary(elRect.bottom < cRect.top + 12);
    };
    onScroll();
    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div data-dark={theme.dark ? "true" : undefined} style={{
      background: theme.t.bg, fontFamily: "Inter, system-ui, sans-serif",
      color: theme.t.text,
      // Lock the dashboard to the artboard's viewport so the bottom nav
      // and primary floater can pin to the bottom edge instead of sitting
      // at the end of the scrolling content. Content scrolls inside the
      // middle flex:1 region; chrome stays put.
      height: "100%", display: "flex", flexDirection: "column",
      position: "relative", overflow: "hidden",
      "--bg": theme.t.bg, "--surface": theme.t.surface, "--surface-soft": theme.t.surfaceSoft,
      "--text": theme.t.text, "--text-muted": theme.t.textMuted, "--text-subtle": theme.t.textSubtle,
      "--text-inverted": theme.t.textInverted, "--line": theme.t.line, "--rule": theme.t.rule, "--chip": theme.t.chip
    }}>
      <ChromeBar theme={theme} viewport={viewport} app={app} setApp={setApp} onOpenQR={() => setQrOpen(true)} onFindClubs={onFindClubs} onOpenProfile={() => {if (window.__navigateProfile) window.__navigateProfile();}} active="Home" onNav={(l) => {if (window.__navigate) window.__navigate(l);}} />
      {mobileTab === "messages" ?
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
          <MessagesScreen theme={theme} />
        </div> :
      mobileTab === "activity" || mobileTab === "profile" ?
      // Placeholder for tabs we haven't built yet — keeps the bottom
      // nav functional from any route by always rendering something.
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "40px 24px", textAlign: "center" }}>
          <div style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 22, color: theme.t.text, marginBottom: 8 }}>
            {mobileTab === "activity" ? "Activity" : "Profile"}
          </div>
          <div style={{ fontSize: 13, color: theme.t.textSubtle, fontWeight: 500 }}>
            Coming soon. Tap Home to return to the dashboard.
          </div>
        </div> :

      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "0 20px 110px" }}>
        {racquetAlertOpen && window.ProShopAlert &&
        <div style={{ paddingTop: 16 }}>
            <window.ProShopAlert theme={theme} desktop={false} onDismiss={() => setRacquetAlertOpen(false)} />
          </div>
        }
        <div style={{ paddingTop: racquetAlertOpen ? 4 : 20, marginBottom: 8 }}>
          <h1 style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 30, lineHeight: "34px", letterSpacing: -1, color: theme.t.text, margin: 0 }}>
            {isCR ?
            <>Hi {PLAYER.name}.<br /><span style={{ color: theme.t.textSubtle }}></span></> :
            <>Hi {PLAYER.name}.<br /><span style={{ color: theme.t.textSubtle }}>Welcome back to</span><br /><span style={{ color: theme.t.textSubtle }}>{theme.logoText}.</span></>}
          </h1>
          <div style={{ marginTop: 12, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 10, flexWrap: "nowrap" }}>
            {!isCR &&
            <button onClick={onOpenClub} style={{
              height: 22, padding: 0, border: 0, background: "transparent",
              color: theme.t.textMuted, fontFamily: "inherit", fontSize: 11, fontWeight: 600,
              display: "inline-flex", alignItems: "center", gap: 4, flexShrink: 0,
              cursor: "pointer", whiteSpace: "nowrap"
            }}>
                See club info
                <Icon name="ArrowRight" size={11} strokeWidth={2.2} color="currentColor" />
              </button>
            }
          </div>
        </div>
        <MobileKPIStrip theme={theme} />
        <div style={{ marginTop: 18 }}>
          <MobileHeroCarousel theme={theme} isCR={isCR} />
        </div>
        <div ref={primaryRef} style={{ marginTop: 24 }}>
          <PrimaryRows theme={theme} isCR={isCR} onOpenEventList={onOpenEventList} onFindClubs={onFindClubs} onBookCourt={onBookCourt} />
        </div>
        {/* Cross-club discovery — only shown in the universal CR view.
                           In branded experiences these would be a conflict of interest
                           (showing other clubs' events / players / "for you" items). */}
        {isCR && <BookNowSegment theme={theme} viewport="mobile" />}
        {isCR && <MatchesSegment theme={theme} viewport="mobile" />}
        {isCR && <PeopleSegment theme={theme} viewport="mobile" />}
        {isCR && <ForYouSegment theme={theme} viewport="mobile" />}
        {/* My-club booking panel takes over the booking surface in
                           branded mode — sits right after the primary action grid so
                           the most common action (book a court at your home club) is
                           reachable in one tap. */}
        {!isCR && window.MyClubBookingPanel &&
        <window.MyClubBookingPanel
          theme={theme}
          viewport="mobile"
          hideRail={true}
          club={{
            name: theme.logoText || "Old Coast Pickleball",
            city: theme.cityTag || "St. Augustine, FL",
            rating: 4.9, reviews: 471,
            tier: "Diamond", courts: 8,
            primary: theme.primary, accent: theme.accent
          }} />

        }
        <NextStepsList theme={theme} viewport="mobile" />
        <SuggestedSegment theme={theme} viewport="mobile" />
        {isCR && <EventsFeedSegment theme={theme} onOpenEventList={onOpenEventList} viewport="mobile" />}
        <ClubLeaderboardSegment theme={theme} isCR={isCR} />
      </div>
      }
      <MobileBottomNav theme={theme} active={mobileTab} onChange={(k) => {
        // The Profile tab routes to the dedicated profile screen rather
        // than a placeholder; everything else swaps the inline tab.
        if (k === "profile" && window.__navigateProfile) {window.__navigateProfile();return;}
        setMobileTab(k);
      }} />
      {qrOpen && <MemberQRSheet theme={theme} onClose={() => setQrOpen(false)} />}
    </div>);

}

// ---- Desktop primary-action floater — sticky bottom pill that reveals
// after the user scrolls past PrimaryActionGrid. Modeled on the EventDetails
// sticky CTA. Centered, max 720px, dark surface, 4 actions matching the
// grid above. Hidden when the grid is still in view.
function DesktopActionFloater({ theme, visible, onOpenEventList, onFindClubs, isCR, viewport = "desktop" }) {
  const isMobile = viewport === "mobile";
  // Each action carries a long label (desktop) and a short label (mobile) so
  // the 4-action bar fits inside the 410px device frame without truncating.
  const items = isCR ?
  [
  { icon: "Calendar",  label: "Book a Court",  shortLabel: "Book Court", onClick: onOpenEventList, primary: true },
  { icon: "Lightbulb", label: "Find an Event", shortLabel: "Find Event", onClick: onOpenEventList },
  { icon: "MapPin",    label: "Find a Club",   shortLabel: "Find Club",  onClick: onFindClubs },
  { icon: "User",      label: "Book a Pro",    shortLabel: "Book Pro",   onClick: null }] :

  [
  { icon: "Calendar",  label: "Book a Court",  shortLabel: "Book Court", onClick: onOpenEventList, primary: true },
  { icon: "Lightbulb", label: "Find an Event", shortLabel: "Find Event", onClick: onOpenEventList },
  { icon: "Users",     label: "Open Play",     shortLabel: "Open Play",  onClick: null },
  { icon: "User",      label: "Book a Pro",    shortLabel: "Book Pro",   onClick: null }];

  // On the logged-out CourtReserve home the floater is persistent — it acts
  // as the primary action selector pinned to the bottom of the viewport
  // throughout the page. On branded / logged-in surfaces it keeps its
  // original scroll-revealed behavior.
  const persistent = isCR;
  const shown = persistent || visible;
  // Hover-driven selection — when nothing is hovered the white "active"
  // pill stays on whichever item is marked primary. As the cursor moves
  // across items the pill snaps to the hovered one and that item's text /
  // icon invert to black so they read against the new white background.
  const [hovered, setHovered] = React.useState(null);
  const primaryIdx = items.findIndex((it) => it.primary);
  const activeIdx = hovered != null ? hovered : (primaryIdx === -1 ? 0 : primaryIdx);

  return (
    // Sticky positioning differs per viewport:
    //  - Desktop: bottom: 24 with a compact, content-sized pill centered
    //    inside the row. Items hug their labels.
    //  - Mobile: bottom: 0 so the bar attaches to the screen edge; pill
    //    stretches to fill the row and items distribute evenly (flex: 1).
    <div style={{
      position: "sticky",
      bottom: isMobile ? 0 : 24,
      zIndex: 30,
      display: "flex", justifyContent: "center", pointerEvents: "none",
      // Mobile: 16 top, 12 sides, 8 bottom — pill sits near the bottom of
      // the viewport with a small cushion. Desktop: floats inset.
      padding: isMobile ? "16px 12px 8px 12px" : "0 24px",
      marginTop: isMobile ? -88 : -88,
      // Gradient on mobile so the page content visibly fades into the
      // sticky action shelf instead of cutting at a hard edge.
      background: isMobile
        ? "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.85) 35%, #FFFFFF 100%)"
        : "transparent",
      transform: shown ? "translateY(0)" : "translateY(28px)",
      opacity: shown ? 1 : 0,
      transition: "transform 320ms cubic-bezier(.2,.8,.2,1), opacity 240ms ease",
    }}>
      <div
        onMouseLeave={() => setHovered(null)}
        style={{
          pointerEvents: "auto",
          display: isMobile ? "flex" : "inline-flex",
          width: isMobile ? "100%" : "auto",
          alignItems: "center",
          gap: isMobile ? 4 : 6,
          background: theme.dark ? "rgba(20,23,27,.92)" : "rgba(15,18,20,.96)",
          backdropFilter: "blur(14px)",
          color: "#fff",
          padding: 6, borderRadius: 999,
          boxShadow: "0 14px 40px rgba(15,18,20,.28), 0 2px 8px rgba(15,18,20,.18)",
        }}
      >
        {items.map((it, idx) => {
          const isActive = idx === activeIdx;
          return (
            <button
              key={it.label}
              onClick={it.onClick || undefined}
              onMouseEnter={() => setHovered(idx)}
              style={{
                // Desktop hugs content; mobile fills the row evenly.
                flex: isMobile ? 1 : "0 0 auto",
                minWidth: 0,
                height: isMobile ? 36 : 44,
                padding: isMobile ? "0 8px" : "0 18px",
                borderRadius: 999, border: 0,
                background: isActive ? "#fff" : "transparent",
                color: isActive ? "#0F1214" : "#fff",
                fontFamily: "inherit", fontWeight: 700,
                fontSize: isMobile ? 12 : 13,
                cursor: it.onClick ? "pointer" : "default",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                gap: isMobile ? 0 : 8,
                whiteSpace: "nowrap",
                transition: "background 140ms ease, color 140ms ease",
              }}
            >
              {/* Icons appear only on desktop; mobile hides them so labels
                  fit comfortably across the 4-item row. */}
              {!isMobile && (
                <Icon name={it.icon} size={14} color={isActive ? "#0F1214" : "#fff"} strokeWidth={2.2} />
              )}
              {it.shortLabel}
            </button>
          );
        })}
      </div>
    </div>);

}

// ---- Verified popular clubs near you — horizontal carousel of map-image
// venue cards. Each card: map preview with distance badge, club name,
// rating + price, sport tag, and a See Events & Info link.
function VerifiedPopularClubs({ theme, onOpenClub, viewport = "desktop" }) {
  const isMobile = viewport === "mobile";
  const trackRef = React.useRef(null);
  // Varied club data per card so the carousel reads as a real list rather
  // than a repeated placeholder. Each club carries multiple sport tags so
  // the multi-sport venues read accurately.
  const clubs = [
    { id: "old-coast",      name: "Old Coast Pickelball",      rating: 4.8, reviews: 256, price: "$$$", sports: ["Pickleball", "Tennis"],            distance: "2.1mi" },
    { id: "anastasia",      name: "Anastasia Tennis Club",     rating: 4.6, reviews: 132, price: "$$",  sports: ["Tennis"],                          distance: "2.4mi" },
    { id: "vilano-beach",   name: "Vilano Beach Racquet",      rating: 4.5, reviews: 96,  price: "$$$", sports: ["Tennis", "Pickleball", "Padel"],   distance: "2.6mi" },
    { id: "dill-dinkers",   name: "Dill Dinkers Jacksonville", rating: 4.7, reviews: 312, price: "$$$", sports: ["Pickleball"],                      distance: "8.4mi" },
    { id: "treaty-park",    name: "Treaty Park Tennis",        rating: 4.3, reviews: 41,  price: "$",   sports: ["Tennis"],                          distance: "3.2mi" },
    { id: "south-st-aug",   name: "South St. Augustine",       rating: 4.4, reviews: 87,  price: "$$",  sports: ["Tennis", "Pickleball"],            distance: "3.6mi" },
    { id: "the-hub-padel",  name: "The Hub Padel",             rating: 4.7, reviews: 134, price: "$$$", sports: ["Padel"],                           distance: "5.1mi" },
    { id: "world-golf",     name: "World Golf Village Tennis", rating: 4.7, reviews: 287, price: "$$$", sports: ["Tennis", "Pickleball"],            distance: "6.8mi" },
  ];
  const scrollBy = (dx) => {
    const el = trackRef.current; if (!el) return;
    el.scrollBy({ left: dx, behavior: "smooth" });
  };
  // Inline-SVG stars (Lucide can't render a fill via the Icon component, so
  // we draw the star path ourselves). Matches the BookNowCard layout so the
  // ratings read the same across Popular clubs and Available to play now.
  const Stars = ({ rating }) => {
    const full = Math.floor(rating);
    const half = rating - full >= 0.4 && rating - full < 0.9;
    return (
      <span style={{ display: "inline-flex", alignItems: "center", gap: 1 }}>
        {[0, 1, 2, 3, 4].map((i) => {
          let fill = "#E9EBEC";
          if (i < full) fill = "#FFB400";
          else if (i === full && half) fill = "#FFB400";
          return (
            <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill={fill} style={{ flexShrink: 0 }}>
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77 5.82 21l1.18-6.88-5-4.87 6.91-1.01z" />
            </svg>
          );
        })}
      </span>
    );
  };
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
        <h2 style={{ fontFamily: theme.display, fontWeight: 800, fontSize: isMobile ? 20 : 28, lineHeight: 1.15, letterSpacing: isMobile ? -0.4 : -0.8, color: theme.t.text, margin: 0 }}>
          Popular clubs near you
        </h2>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <button onClick={() => scrollBy(-340)} aria-label="Previous" style={{
            width: 36, height: 36, borderRadius: 8, border: 0,
            background: "transparent", cursor: "pointer",
            display: "inline-flex", alignItems: "center", justifyContent: "center"
          }}>
            <Icon name="ChevronLeft" size={18} strokeWidth={2} color="#0F1214" />
          </button>
          <button onClick={() => scrollBy(340)} aria-label="Next" style={{
            width: 36, height: 36, borderRadius: 8, border: 0,
            background: "transparent", cursor: "pointer",
            display: "inline-flex", alignItems: "center", justifyContent: "center"
          }}>
            <Icon name="ChevronRight" size={18} strokeWidth={2} color="#0F1214" />
          </button>
        </div>
      </div>
      {/* Carousel wrapper — `position: relative` so the right-edge gradient
          fade can sit absolutely on top, and y-padding gives card hover
          shadows room to render without getting clipped by the scroll
          container's overflow box. */}
      <div style={{ position: "relative", margin: isMobile ? "-8px -16px -8px" : "-16px -4px -16px" }}>
      <div ref={trackRef} style={{
        display: "flex", gap: 16, overflowX: "auto", scrollSnapType: "x mandatory",
        paddingTop: isMobile ? 12 : 28, paddingBottom: isMobile ? 16 : 32, scrollbarWidth: "none",
        paddingLeft: 4, paddingRight: 4
      }}>
        {clubs.map((c) => (
          <button key={c.id} onClick={() => onOpenClub && onOpenClub(c.id)} style={{
            flex: "0 0 280px", scrollSnapAlign: "start",
            background: "#fff", border: "1px solid #E9EBEC", borderRadius: 8,
            overflow: "hidden", textAlign: "left", padding: 0,
            cursor: "pointer", fontFamily: "inherit", color: "inherit",
            display: "flex", flexDirection: "column",
            transition: "box-shadow 160ms, transform 160ms"
          }}
          onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 8px 24px rgba(15,18,20,0.10)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}>
            <div style={{
              position: "relative", height: 140,
              backgroundImage: `linear-gradient(135deg, rgba(232,240,229,0.92) 0%, rgba(223,233,219,0.92) 40%, rgba(241,235,217,0.92) 100%), url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 280 140'><g fill='none' stroke='%23B6C2A8' stroke-width='1.2'><path d='M-20 30 Q60 20 140 50 T300 40'/><path d='M-20 90 Q60 80 140 110 T300 100'/><path d='M40 -10 Q60 60 100 80 T140 160'/><path d='M180 -10 Q200 50 220 90 T240 160'/></g><circle cx='140' cy='70' r='8' fill='%231F4ED8' stroke='%23fff' stroke-width='3'/></svg>")`,
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}>
              <div style={{
                position: "absolute", top: 12, left: 12,
                height: 24, padding: "0 10px", borderRadius: 6,
                background: "#fff", color: "#0F1214",
                fontSize: 11, fontWeight: 700,
                display: "inline-flex", alignItems: "center",
                boxShadow: "0 1px 2px rgba(15,18,20,0.08)"
              }}>{c.distance}</div>
            </div>
            {/* Card content — 12px padding all around, vertical stack
                of title / rating / sport tag, all left-aligned. The
                "See Events & Info" CTA is intentionally OUTSIDE this
                container so it can sit on the card's blue footer. */}
            <div style={{
              padding: 12,
              display: "flex", flexDirection: "column", alignItems: "flex-start",
              gap: 8,
            }}>
              <div style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 17, color: "#0F1214", letterSpacing: -0.3 }}>
                {c.name}
              </div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: "#0F1214" }}>
                <Stars rating={c.rating} />
                <span style={{ fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{c.rating}</span>
                <span style={{ color: "#858F8F" }}>({c.reviews})</span>
                <span style={{ color: "#858F8F" }}>•</span>
                <span style={{ fontWeight: 700, color: "#0F1214" }}>{c.price}</span>
              </div>
              {/* Sport tag row — multiple tags can render but the row is
                  capped at one line via flex nowrap + overflow hidden, so
                  cards with many sports clip rather than break the layout. */}
              <div style={{
                display: "flex",
                gap: 6,
                flexWrap: "nowrap",
                overflow: "hidden",
                width: "100%",
              }}>
                {c.sports.map((s) => (
                  <span key={s} style={{
                    display: "inline-flex", alignItems: "center",
                    height: 24, padding: "0 10px", borderRadius: 6,
                    background: "#F4F5F6", color: "#0F1214",
                    fontSize: 11, fontWeight: 600,
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}>{s}</span>
                ))}
              </div>
            </div>
            {/* Card footer — sits at the bottom edge of the card, full-width,
                subtle grey background matching the SearchBar's selected-state
                track so the design system reads consistently. */}
            <div style={{
              marginTop: "auto",
              padding: "12px 16px",
              borderTop: "1px solid #E9EBEC",
              background: "#F4F5F6",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              fontSize: 12, fontWeight: 600, color: "#0F1214",
            }}>
              See Events & Info
              <Icon name="ArrowRight" size={14} strokeWidth={2} color="#0F1214" />
            </div>
          </button>
        ))}
      </div>
      {/* Right-edge fade — 16px gradient hides the hard clip of the last
          partially-visible card so it dissolves into the page background. */}
      <div aria-hidden="true" style={{
        position: "absolute",
        top: 0, bottom: 0, right: 0,
        width: 16,
        background: `linear-gradient(to left, ${theme.t.bg} 0%, rgba(244,245,246,0) 100%)`,
        pointerEvents: "none",
      }} />
      </div>
    </div>
  );
}

// ---- Popular events near you — carousel of event cards. Each card:
// club brand mark, spots-left badge, title, club row, distance, schedule,
// tag pills, and price + spots-remaining footer.
function PopularEventsNearYou({ theme, onOpenEvent, title = "Popular events near you", showLocationFilter = false, viewport = "desktop" }) {
  const isMobile = viewport === "mobile";
  const trackRef = React.useRef(null);
  // Varied event data — distinct clubs, titles, dates, prices, and tags per
  // card so the carousel reads as a real list rather than a repeated stub.
  // Each event carries its own brandmark colors so the header logo varies
  // per card.
  const events = [
    { id: "e1", logoMark: "OC", logoBg: "#2E5D52", logoFg: "#F2A93B", logoLine1: "OLD COAST",  logoLine2: "PICKLEBALL", title: "Intermediate Strategies with Coach Ray", club: "Old Coast Pickleball",      city: "St. Augustine, FL", distance: "2.1 mi", date: "Wed, May 13", duration: "6:00 PM – 7:00 PM",  spotsLeft: 2, totalSpots: 16, taken: 14, price: "$15 - $60", tags: ["3.0 - 3.25 DUPR", "Men's Only", "Ages 12-15"] },
    { id: "e2", logoMark: "VB", logoBg: "#7C3AED", logoFg: "#FBBF24", logoLine1: "VILANO",     logoLine2: "BEACH",      title: "Saturday Morning Doubles League",          club: "Vilano Beach Racquet",      city: "Vilano Beach, FL",  distance: "2.6 mi", date: "Sat, May 16", duration: "8:00 AM – 10:00 AM", spotsLeft: 4, totalSpots: 24, taken: 20, price: "$25",       tags: ["3.5 - 4.0 DUPR", "Mixed", "League"] },
    { id: "e3", logoMark: "DD", logoBg: "#8E5BE8", logoFg: "#FFD166", logoLine1: "DILL",       logoLine2: "DINKERS",    title: "Beginner-Friendly Open Play",              club: "Dill Dinkers Jacksonville", city: "Jacksonville, FL",  distance: "8.4 mi", date: "Thu, May 14", duration: "5:30 PM – 7:00 PM", spotsLeft: 6, totalSpots: 12, taken: 6,  price: "$10",       tags: ["2.5 - 3.0 DUPR", "All Ages", "Open Play"] },
    { id: "e4", logoMark: "AT", logoBg: "#1F4ED8", logoFg: "#8AB6FF", logoLine1: "ANASTASIA",  logoLine2: "TENNIS",     title: "Singles Ladder Match Night",               club: "Anastasia Tennis Club",     city: "St. Augustine, FL", distance: "2.4 mi", date: "Tue, May 12", duration: "6:30 PM – 9:00 PM", spotsLeft: 3, totalSpots: 8,  taken: 5,  price: "$20",       tags: ["4.0+ DUPR", "Singles", "Ladder"] },
    { id: "e5", logoMark: "TP", logoBg: "#0F1214", logoFg: "#FFDA44", logoLine1: "TREATY",     logoLine2: "PARK",       title: "Kids Pickleball Clinic",                   club: "Treaty Park Tennis",        city: "St. Augustine, FL", distance: "3.2 mi", date: "Sat, May 16", duration: "10:00 AM – 11:00 AM", spotsLeft: 5, totalSpots: 10, taken: 5,  price: "Free",      tags: ["Ages 8-12", "Coach-led", "Free"] },
    { id: "e6", logoMark: "HP", logoBg: "#D6573B", logoFg: "#FFFFFF", logoLine1: "THE HUB",    logoLine2: "PADEL",      title: "Padel Drop-In Round Robin",                club: "The Hub Padel",             city: "Jacksonville Beach, FL", distance: "5.1 mi", date: "Fri, May 15", duration: "7:00 PM – 9:00 PM", spotsLeft: 2, totalSpots: 8,  taken: 6,  price: "$30",       tags: ["3.0 - 4.0 DUPR", "Doubles", "Drop-In"] },
  ];
  const scrollBy = (dx) => {
    const el = trackRef.current; if (!el) return;
    el.scrollBy({ left: dx, behavior: "smooth" });
  };
  return (
    <div style={{ marginTop: isMobile ? 8 : 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
        <h2 style={{ fontFamily: theme.display, fontWeight: 800, fontSize: isMobile ? 20 : 28, lineHeight: 1.15, letterSpacing: isMobile ? -0.4 : -0.8, color: theme.t.text, margin: 0 }}>
          {title}
        </h2>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
          {showLocationFilter && (
            <button style={{
              height: 40, padding: "0 14px", borderRadius: 8,
              border: "1px solid #E9EBEC", background: "#fff",
              display: "inline-flex", alignItems: "center", gap: 8,
              fontFamily: "inherit", fontSize: 13, fontWeight: 500, color: "#0F1214",
              cursor: "pointer"
            }}>
              <Icon name="Navigation" size={13} strokeWidth={2.2} color="#5B7CFA" />
              Oakland, CA
            </button>
          )}
          <button onClick={() => scrollBy(-340)} aria-label="Previous" style={{
            width: 36, height: 36, borderRadius: 8, border: 0,
            background: "transparent", cursor: "pointer",
            display: "inline-flex", alignItems: "center", justifyContent: "center"
          }}>
            <Icon name="ChevronLeft" size={18} strokeWidth={2} color="#0F1214" />
          </button>
          <button onClick={() => scrollBy(340)} aria-label="Next" style={{
            width: 36, height: 36, borderRadius: 8, border: 0,
            background: "transparent", cursor: "pointer",
            display: "inline-flex", alignItems: "center", justifyContent: "center"
          }}>
            <Icon name="ChevronRight" size={18} strokeWidth={2} color="#0F1214" />
          </button>
        </div>
      </div>
      {/* Carousel wrapper — relative for the right-edge fade overlay, y
          padding so card hover shadows aren't clipped. */}
      <div style={{ position: "relative", margin: isMobile ? "-8px -16px -8px" : "-16px -4px -16px" }}>
      <div ref={trackRef} style={{
        display: "flex", gap: 16, overflowX: "auto", scrollSnapType: "x mandatory",
        paddingTop: isMobile ? 12 : 28, paddingBottom: isMobile ? 16 : 32, scrollbarWidth: "none",
        paddingLeft: 4, paddingRight: 4,
        alignItems: "stretch"
      }}>
        {events.map((ev) => (
          <div
            key={ev.id}
            style={{
              flex: "0 0 320px", scrollSnapAlign: "start",
              background: "#fff", border: "1px solid #E9EBEC", borderRadius: 8,
              overflow: "hidden",
              display: "flex", flexDirection: "column",
              transition: "box-shadow 160ms, transform 160ms",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 8px 24px rgba(15,18,20,0.10)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            {/* Header — brandmark logo on the left, spots-left tag opposite
                on the right. Logo colors vary per club. */}
            <div style={{ padding: "16px 16px 0", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <div style={{
                  width: 22, height: 22, borderRadius: 4,
                  background: ev.logoBg,
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                }}>
                  <span style={{ fontSize: 9, fontWeight: 800, color: ev.logoFg, lineHeight: 1 }}>{ev.logoMark}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
                  <span style={{ fontFamily: theme.display, fontSize: 11, fontWeight: 800, color: ev.logoBg, letterSpacing: 0.4 }}>{ev.logoLine1}</span>
                  <span style={{ fontFamily: theme.display, fontSize: 9, fontWeight: 700, color: ev.logoBg, letterSpacing: 1.4, marginTop: 2 }}>{ev.logoLine2}</span>
                </div>
              </div>
              <span style={{
                height: 22, padding: "0 10px", borderRadius: 999,
                background: "#DC2626", color: "#fff",
                fontSize: 11, fontWeight: 700,
                display: "inline-flex", alignItems: "center",
              }}>{ev.spotsLeft} Spots Left</span>
            </div>
            {/* Content — strict vertical rhythm:
                  24px → title
                  12px → club name
                   8px → city • distance
                   8px → date — duration
                  24px → tag pills */}
            <div style={{ padding: "0 16px" }}>
              <div style={{
                marginTop: 24,
                fontFamily: theme.display, fontWeight: 800,
                fontSize: 18, lineHeight: "22px", letterSpacing: -0.3,
                color: "#0F1214",
              }}>
                {ev.title}
              </div>
              <div style={{ marginTop: 12, fontSize: 13, color: "#0F1214", fontWeight: 600 }}>
                {ev.club}
              </div>
              <div style={{ marginTop: 8, fontSize: 12.5, color: "#4B5052" }}>
                {ev.city} • {ev.distance}
              </div>
              <div style={{ marginTop: 8, fontSize: 12.5, color: "#4B5052" }}>
                {ev.date} — {ev.duration}
              </div>
              <div style={{ marginTop: 24, marginBottom: 16, display: "flex", flexWrap: "wrap", gap: 6 }}>
                {ev.tags.map((tag, i) => (
                  <span key={i} style={{
                    height: 24, padding: "0 10px", borderRadius: 6,
                    background: "#F4F5F6", color: "#0F1214",
                    fontSize: 11.5, fontWeight: 600,
                    display: "inline-flex", alignItems: "center",
                  }}>{tag}</span>
                ))}
              </div>
            </div>
            <div style={{
              marginTop: "auto",
              padding: "14px 16px",
              borderTop: "1px solid #E9EBEC",
              background: "#F4F5F6",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <div>
                <div style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 16, color: "#0F1214" }}>{ev.price}</div>
                <div style={{ marginTop: 2, fontSize: 10.5, fontWeight: 700, letterSpacing: 0.6, textTransform: "uppercase", color: "#858F8F" }}>
                  {ev.taken} of {ev.totalSpots} spots remaining
                </div>
              </div>
              <button onClick={() => onOpenEvent && onOpenEvent(ev.id)} aria-label="Open event" style={{
                width: 40, height: 40, borderRadius: 8,
                background: "#0F1214", color: "#fff", border: 0, cursor: "pointer",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon name="ArrowRight" size={16} strokeWidth={2.2} color="#fff" />
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Right-edge fade — 16px gradient hides the hard clip of the last
          partially-visible card so it dissolves into the page background. */}
      <div aria-hidden="true" style={{
        position: "absolute",
        top: 0, bottom: 0, right: 0,
        width: 16,
        background: `linear-gradient(to left, ${theme.t.bg} 0%, rgba(244,245,246,0) 100%)`,
        pointerEvents: "none",
      }} />
      </div>
    </div>
  );
}

// ---- More events near you — date-grouped list of upcoming sessions.
// Each row: time + status on the left, title + spots-left pill + meta + avatars
// in the middle, price + arrow CTA on the right. Date headers carry a count
// chip showing how many sessions fall under that day.
function MoreEventsNearYou({ theme, onOpenEvent, viewport = "desktop" }) {
  const isMobile = viewport === "mobile";
  // Avatar stack — three overlapping player avatars. The "+X attending"
  // count is rendered separately by the caller so the number can vary per
  // row without re-rendering the avatar stack.
  const Avatars = () => {
    const bgs = [
      "linear-gradient(135deg, #60A5FA, #2563EB)",
      "linear-gradient(135deg, #F87171, #DC2626)",
      "linear-gradient(135deg, #FBBF24, #D97706)"
    ];
    return (
      <span style={{ display: "inline-flex", alignItems: "center" }}>
        {bgs.map((bg, i) => (
          <span key={i} style={{
            width: 22, height: 22, borderRadius: 999,
            background: bg, border: "2px solid #fff",
            marginLeft: i === 0 ? 0 : -8
          }} />
        ))}
      </span>
    );
  };
  // Varied event rows — each event reads as a distinct session so the list
  // doesn't repeat the same placeholder over and over.
  const allRows = [
    // ---- Today ----------------------------------------------------------
    { time: "6:00 AM",  spotsLeft: 2, title: "Open Play: All Levels Welcome",   attending: 8,  club: "Old Coast Pickleball",      city: "St. Augustine, FL", distance: "2.1 mi", meta: "Doubles • 3.0 - 3.5 DUPR • Coach Mike Alvarado", price: "$15 - $25" },
    { time: "9:00 AM",  spotsLeft: 4, title: "Intermediate Skills Clinic",      attending: 6,  club: "Vilano Beach Racquet",      city: "Vilano Beach, FL",  distance: "2.6 mi", meta: "Doubles • 3.5 - 4.0 DUPR • Coach Priya Shah",    price: "$30" },
    { time: "12:00 PM", spotsLeft: 1, title: "Round Robin Doubles",             attending: 11, club: "Dill Dinkers Jacksonville", city: "Jacksonville, FL",  distance: "8.4 mi", meta: "Doubles • 3.0+ DUPR • All Levels",               price: "$20" },
    { time: "5:30 PM",  spotsLeft: 6, title: "Drill & Play Session",            attending: 4,  club: "Old Coast Pickleball",      city: "St. Augustine, FL", distance: "2.1 mi", meta: "Doubles • 3.0 - 4.0 DUPR • Coach Reid Anders",   price: "$25 - $40" },
    // ---- Tomorrow -------------------------------------------------------
    { time: "6:30 AM",  spotsLeft: 3, title: "Sunrise Pickleball",              attending: 9,  club: "Old Coast Pickleball",      city: "St. Augustine, FL", distance: "2.1 mi", meta: "Doubles • All Levels • Coach Mike Alvarado",     price: "$15" },
    { time: "10:00 AM", spotsLeft: 8, title: "Beginner Bootcamp",               attending: 2,  club: "Treaty Park Tennis",        city: "St. Augustine, FL", distance: "3.2 mi", meta: "Singles & Doubles • 2.5 - 3.0 DUPR • Coach Jana Ellis", price: "$45" },
    { time: "6:00 PM",  spotsLeft: 2, title: "Open Play: All Levels Welcome",   attending: 12, club: "Dill Dinkers Jacksonville", city: "Jacksonville, FL",  distance: "8.4 mi", meta: "Doubles • 2.5 - 4.5 DUPR • League Director Sam B.", price: "$15 - $35" },
  ];
  const groups = [
    { id: "today",    label: "Today, Monday, May 11, 2026",     rows: allRows.slice(0, 4) },
    { id: "tomorrow", label: "Tomorrow, Tuesday, May 12, 2026", rows: allRows.slice(4) },
  ];
  // Single combo-filter button replacing the three separate pills. Reads
  // as "<window> · <time> · <location>" and opens an inline dropdown with
  // all three controls on tap.
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [filterWindow, setFilterWindow] = React.useState("This Week");
  const [filterTime, setFilterTime] = React.useState("Any Time");
  const [filterLoc, setFilterLoc] = React.useState("Oakland, CA");
  const filterRef = React.useRef(null);
  React.useEffect(() => {
    if (!filterOpen) return;
    const onDoc = (e) => { if (filterRef.current && !filterRef.current.contains(e.target)) setFilterOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [filterOpen]);
  return (
    <div style={{ marginTop: isMobile ? 8 : 16 }}>
      <div style={{
        display: "flex",
        // Stack title above combo filter on mobile so the filter has full
        // row width to itself.
        flexDirection: isMobile ? "column" : "row",
        alignItems: isMobile ? "stretch" : "center",
        justifyContent: "space-between",
        gap: isMobile ? 12 : 16,
        marginBottom: 12,
      }}>
        <h2 style={{ fontFamily: theme.display, fontWeight: 800, fontSize: isMobile ? 20 : 28, lineHeight: 1.15, letterSpacing: isMobile ? -0.4 : -0.8, color: theme.t.text, margin: 0 }}>
          {isMobile ? "More Events" : "More events near you"}
        </h2>
        <div ref={filterRef} style={{ position: "relative" }}>
          <button onClick={() => setFilterOpen((o) => !o)} aria-expanded={filterOpen} style={{
            height: 40, padding: "0 14px 0 18px", borderRadius: 8,
            border: "1px solid #E9EBEC", background: "#fff",
            display: "inline-flex", alignItems: "center", gap: 18,
            fontFamily: "inherit", fontSize: 13, fontWeight: 500, color: "#0F1214",
            cursor: "pointer",
          }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <Icon name="Calendar" size={14} strokeWidth={2} color="#0F1214" />
              {filterWindow}
            </span>
            <span style={{ width: 1, height: 18, background: "#E9EBEC", flexShrink: 0 }} />
            <span>{filterTime}</span>
            <span style={{ width: 1, height: 18, background: "#E9EBEC", flexShrink: 0 }} />
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <Icon name="Navigation" size={13} strokeWidth={2.2} color="#5B7CFA" />
              {filterLoc}
            </span>
            <Icon name="ChevronDown" size={14} strokeWidth={2} color="#858F8F" />
          </button>
          {filterOpen && (
            <div role="dialog" style={{
              position: "absolute", top: "100%", right: 0, marginTop: 8,
              minWidth: 280, padding: 12,
              background: "#fff", border: "1px solid #E9EBEC", borderRadius: 8,
              boxShadow: "0 12px 40px rgba(15,18,20,.12), 0 2px 8px rgba(15,18,20,.06)",
              zIndex: 30,
              display: "flex", flexDirection: "column", gap: 10,
            }}>
              <FilterSelect label="Window" value={filterWindow} onChange={setFilterWindow} options={["Today", "This Week", "Next 2 Weeks", "This Month"]} />
              <FilterSelect label="Time" value={filterTime} onChange={setFilterTime} options={["Any Time", "Morning", "Afternoon", "Evening"]} />
              <FilterSelect label="Location" value={filterLoc} onChange={setFilterLoc} options={["Oakland, CA", "Berkeley, CA", "San Francisco, CA", "St. Augustine, FL"]} />
            </div>
          )}
        </div>
      </div>
      {groups.map((g) => (
        <div key={g.id} style={{ marginBottom: 28 }}>
          {/* Subsection title — smaller weight + a subtle muted badge that
              auto-reflects the row count instead of a hardcoded number. */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <span style={{ fontFamily: theme.display, fontWeight: 700, fontSize: 12, letterSpacing: 0, color: "#4B5052" }}>{g.label}</span>
            <span style={{
              minWidth: 20, height: 20, padding: "0 6px", borderRadius: 6,
              background: "#F4F5F6", color: "#4B5052",
              fontSize: 11, fontWeight: 700,
              display: "inline-flex", alignItems: "center", justifyContent: "center",
            }}>{g.rows.length}</span>
          </div>
          <div>
            {g.rows.map((r, i) => (
              <EventRow key={i} r={r} first={i === 0} onOpenEvent={onOpenEvent} theme={theme} Avatars={Avatars} viewport={viewport} />
            ))}
          </div>
        </div>
      ))}
      {/* Show more — neutral pill at the end of the section. Could load a
          next page of events; for the prototype it's a static affordance. */}
      <div style={{ marginTop: 8, display: "flex", justifyContent: "center" }}>
        <button style={{
          height: 40, padding: "0 18px", borderRadius: 8,
          border: "1px solid #E9EBEC", background: "#fff",
          display: "inline-flex", alignItems: "center", gap: 8,
          fontFamily: "inherit", fontSize: 13, fontWeight: 600, color: "#0F1214",
          cursor: "pointer",
          transition: "background 120ms",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "#F4F5F6"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; }}>
          Show more
          <Icon name="ChevronDown" size={14} strokeWidth={2} color="#0F1214" />
        </button>
      </div>
    </div>
  );
}

// ---- FilterSelect — labeled select wrapper used inside the combo dropdown
// on MoreEventsNearYou. Keeps the layout consistent across the three
// (window / time / location) sub-controls without prop-drilling theme.
function FilterSelect({ label, value, onChange, options }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "#858F8F" }}>{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          height: 36, padding: "0 12px", borderRadius: 8,
          border: "1px solid #E9EBEC", background: "#fff",
          fontFamily: "inherit", fontSize: 13, color: "#0F1214",
          cursor: "pointer",
        }}
      >
        {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </label>
  );
}

// ---- EventRow — one row in MoreEventsNearYou's date-grouped list.
// Sub-component so each row can carry its own hover state (subtle background
// tint) without re-rendering the whole list on hover. Time + spots-left tag
// top-align with the title/location/meta column.
function EventRow({ r, first, onOpenEvent, theme, Avatars, viewport = "desktop" }) {
  const [hover, setHover] = React.useState(false);
  const isMobile = viewport === "mobile";

  // ---- Mobile layout ------------------------------------------------------
  // Stacks the event content vertically: title → avatars+attending →
  // location → metadata → bottom row with time + spots-left on the left
  // and price + Reserve CTA on the right. No two-column grid — better fit
  // for narrow viewports where the 96px reserved left column would chew
  // up half the available width.
  if (isMobile) {
    return (
      <div
        onClick={() => onOpenEvent && onOpenEvent()}
        style={{
          display: "flex", flexDirection: "column", gap: 6,
          padding: "16px 0",
          borderTop: first ? "1px solid #E9EBEC" : "1px solid #F4F5F6",
          cursor: "pointer",
        }}
      >
        <div style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 16, color: "#0F1214", letterSpacing: -0.2, lineHeight: 1.25 }}>
          {r.title}
        </div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <Avatars />
          <span style={{ fontSize: 12, color: "#4B5052", fontWeight: 600 }}>+{r.attending} attending</span>
        </div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: "#4B5052" }}>
          <Icon name="MapPin" size={13} strokeWidth={1.75} color="#858F8F" />
          <span>{r.club} · {r.city} · {r.distance}</span>
        </div>
        <div style={{ fontSize: 12, color: "#4B5052" }}>
          {r.meta}
        </div>
        {/* Bottom row — time + spots tag on the left, price + Reserve CTA
            on the right, balanced via space-between. */}
        <div style={{
          marginTop: 6,
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
        }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 14, color: "#0F1214" }}>{r.time}</span>
            <span style={{
              height: 20, padding: "0 8px", borderRadius: 6,
              background: "#FEE2E2", color: "#DC2626",
              fontSize: 11, fontWeight: 700,
              display: "inline-flex", alignItems: "center",
            }}>{r.spotsLeft} Spots Left</span>
          </div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 15, color: "#0F1214", whiteSpace: "nowrap" }}>{r.price}</span>
            <button
              onClick={(e) => { e.stopPropagation(); onOpenEvent && onOpenEvent(); }}
              aria-label="Reserve event"
              style={{
                height: 36, padding: "0 12px 0 14px",
                borderRadius: 8,
                background: "#0F1214", color: "#fff", border: 0, cursor: "pointer",
                display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
                fontFamily: "inherit", fontWeight: 700, fontSize: 12.5,
                whiteSpace: "nowrap",
              }}
            >
              Reserve
              <Icon name="ArrowRight" size={14} strokeWidth={2.2} color="#fff" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---- Desktop layout (unchanged) -----------------------------------------
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => onOpenEvent && onOpenEvent()}
      style={{
        display: "grid",
        gridTemplateColumns: "96px 1fr auto auto",
        gap: 20,
        alignItems: "start",
        padding: "18px 12px",
        margin: "0 -12px",
        borderTop: first ? "1px solid #E9EBEC" : "1px solid #F4F5F6",
        borderRadius: 10,
        background: hover ? "#F4F5F6" : "transparent",
        cursor: "pointer",
        transition: "background 140ms ease",
      }}
    >
      <div>
        <div style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 17, color: "#0F1214", lineHeight: "21px" }}>{r.time}</div>
        <div style={{ marginTop: 6 }}>
          <span style={{
            height: 22, padding: "0 8px", borderRadius: 6,
            background: "#FEE2E2", color: "#DC2626",
            fontSize: 11, fontWeight: 700,
            display: "inline-flex", alignItems: "center",
          }}>{r.spotsLeft} Spots Left</span>
        </div>
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", lineHeight: "21px" }}>
          <span style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 17, color: "#0F1214", letterSpacing: -0.2 }}>{r.title}</span>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <Avatars />
            <span style={{ fontSize: 12, color: "#4B5052", fontWeight: 600 }}>+{r.attending} attending</span>
          </div>
        </div>
        <div style={{ marginTop: 6, display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, color: "#4B5052" }}>
          <Icon name="MapPin" size={14} strokeWidth={1.75} color="#858F8F" />
          <span>{r.club} · {r.city} · {r.distance}</span>
        </div>
        <div style={{ marginTop: 4, fontSize: 12.5, color: "#4B5052" }}>
          {r.meta}
        </div>
      </div>
      <div style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 17, color: "#0F1214", whiteSpace: "nowrap", alignSelf: "center" }}>{r.price}</div>
      <button
        onClick={(e) => { e.stopPropagation(); onOpenEvent && onOpenEvent(); }}
        aria-label="Reserve event"
        style={{
          height: 40,
          width: hover ? 112 : 40,
          padding: hover ? "0 14px 0 16px" : 0,
          borderRadius: 8,
          background: "#0F1214", color: "#fff", border: 0, cursor: "pointer",
          display: "inline-flex", alignItems: "center",
          justifyContent: hover ? "space-between" : "center",
          gap: hover ? 8 : 0,
          alignSelf: "center",
          fontFamily: "inherit", fontWeight: 700, fontSize: 13,
          whiteSpace: "nowrap", overflow: "hidden",
          transition: "width 220ms cubic-bezier(.2,.8,.2,1), padding 220ms ease",
        }}
      >
        {hover && <span>Reserve</span>}
        <Icon name="ArrowRight" size={16} strokeWidth={2.2} color="#fff" />
      </button>
    </div>
  );
}

// ---- Web-optimized dashboard ----
// Now also drives logged-out CR mobile so the experience mirrors desktop.
// All dimensional tokens swap based on the viewport flag below.
function DashboardDesktop({ theme, viewport = "desktop", onOpenEventList, onOpenClub, onFindClubs, onBookCourt, isCR, app, setApp }) {
  const isMobile = viewport === "mobile";
  // Reveal the floating CTA once PrimaryActionGrid has scrolled out of view
  // at the top of the scroll container. Same pattern as the mobile floater.
  const actionGridRef = React.useRef(null);
  const [racquetAlertOpen, setRacquetAlertOpen] = React.useState(false);
  const [qrOpen, setQrOpen] = React.useState(false);
  const [pastActions, setPastActions] = React.useState(false);
  React.useEffect(() => {
    const el = actionGridRef.current;if (!el) return;
    const findScroll = (n) => {
      while (n && n !== document.body) {
        const cs = getComputedStyle(n);
        if (cs.overflowY === "auto" || cs.overflowY === "scroll") return n;
        n = n.parentElement;
      }
      return null;
    };
    const container = findScroll(el.parentElement);
    if (!container) return;
    const onScroll = () => {
      const elRect = el.getBoundingClientRect();
      const cRect = container.getBoundingClientRect();
      setPastActions(elRect.bottom < cRect.top + 12);
    };
    onScroll();
    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div data-dark={theme.dark ? "true" : undefined} style={{
      background: theme.t.bg,
      // On mobile the device frame's inner container has overflow: hidden,
      // so DashboardDesktop has to be its own scroll context for sticky to
      // function and for the page to actually scroll vertically. On desktop
      // the parent already provides overflow-y so min-height: 100% suffices.
      height: isMobile ? "100%" : undefined,
      minHeight: isMobile ? undefined : "100%",
      overflowY: isMobile ? "auto" : undefined,
      // Clip any horizontal overflow on mobile so nothing — extended sticky
      // shelves, off-screen carousel tails, etc — induces a horizontal
      // scrollbar inside the device frame.
      overflowX: isMobile ? "hidden" : undefined,
      fontFamily: "Inter, system-ui, sans-serif",
      // paddingBottom on the scroll container shifts sticky-bottom anchors
      // OFF the visual bottom edge (sticky aligns to the padding box). Drop
      // it on mobile so the action bar actually pins to the viewport edge;
      // desktop keeps it for trailing breathing room.
      paddingBottom: isMobile ? 0 : 64,
      color: theme.t.text,
      "--bg": theme.t.bg, "--surface": theme.t.surface, "--surface-soft": theme.t.surfaceSoft,
      "--text": theme.t.text, "--text-muted": theme.t.textMuted, "--text-subtle": theme.t.textSubtle,
      "--text-inverted": theme.t.textInverted, "--line": theme.t.line, "--rule": theme.t.rule, "--chip": theme.t.chip
    }}>
      <ChromeBar theme={theme} viewport={viewport} app={app} setApp={setApp} onOpenQR={() => setQrOpen(true)} onFindClubs={onFindClubs} onOpenProfile={() => {if (window.__navigateProfile) window.__navigateProfile();}} active="Home" onNav={(l) => {if (window.__navigate) window.__navigate(l);}} />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: isMobile ? "16px 16px 80px" : "48px 32px 64px" }}>
        {racquetAlertOpen && window.ProShopAlert &&
        <div style={{ marginBottom: 24 }}>
            <window.ProShopAlert theme={theme} desktop={!isMobile} onDismiss={() => setRacquetAlertOpen(false)} />
          </div>
        }
        <div style={{ marginBottom: isMobile ? 20 : 32, display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: isMobile ? 16 : 32, flexWrap: "wrap" }}>
          <h1 style={{ fontFamily: theme.display, fontWeight: 800, fontSize: isMobile ? 32 : 64, lineHeight: isMobile ? "38px" : "76px", letterSpacing: isMobile ? -0.6 : -1.8, color: theme.t.text, margin: 0 }}>
            {isCR ?
            <>Welcome to Court Reserve<br /><span style={{ color: "#858F8F" }}>Let's Play.</span></> :
            <>Hi {PLAYER.name}.<br /><span style={{ color: theme.t.textSubtle }}>Welcome back to {theme.logoText}!</span></>}
          </h1>
          <div style={{ paddingBottom: 8, display: "inline-flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
            {!isCR &&
            <button onClick={onOpenClub} style={{
              height: 36, padding: "0 14px", borderRadius: 8,
              border: `1px solid ${theme.t.line}`,
              background: "transparent",
              color: theme.t.text, fontFamily: "inherit", fontSize: 12, fontWeight: 600,
              display: "inline-flex", alignItems: "center", gap: 6,
              cursor: "pointer",
              transition: "border-color 120ms"
            }}
            onMouseEnter={(e) => {e.currentTarget.style.borderColor = theme.t.text;}}
            onMouseLeave={(e) => {e.currentTarget.style.borderColor = theme.t.line;}}>
                More info about {theme.logoText}
                <Icon name="ArrowRight" size={12} strokeWidth={2.2} color="currentColor" />
              </button>
            }
          </div>
        </div>
        {/* Hero search affordance. On the logged-out CourtReserve surface
            this is the new north-star SearchBar. The sticky wrapper uses
            negative horizontal margins to escape the page's maxWidth and
            extend across the device frame (which has overflow: hidden, so
            the wrapper safely clips at the frame edges). The background is
            a top-down gradient — transparent at the very top fading to
            solid white just above the bar — so content scrolling past
            dissolves smoothly into the sticky shelf instead of clipping
            against a hard edge. */}
        {isCR && window.SearchBar &&
        <div style={{
          position: "sticky",
          // 64 desktop matches the logged-out ChromeBar; 56 on mobile.
          top: isMobile ? 56 : 64,
          zIndex: 40,
          // Negative margins escape the maxWidth parent so the sticky shelf
          // spans full device-frame width. Desktop has 120px gutter; mobile
          // has 16px container padding so we only need -16 there.
          marginLeft: isMobile ? -16 : -120,
          marginRight: isMobile ? -16 : -120,
          paddingLeft: isMobile ? 16 : 120,
          paddingRight: isMobile ? 16 : 120,
          background: "linear-gradient(to bottom, #FFFFFF 0%, #FFFFFF 80%, rgba(255,255,255,0) 100%)",
          marginBottom: isMobile ? 0 : 40,
          paddingTop: isMobile ? 32 : 16,
          paddingBottom: isMobile ? 32 : 16,
        }}>
            {isMobile && window.SearchBarCompact
              ? <window.SearchBarCompact theme={theme} viewport={viewport} onExpand={() => onBookCourt && onBookCourt()} />
              : <window.SearchBar theme={theme} viewport={viewport} onSubmit={() => onBookCourt && onBookCourt()} />}
          </div>
        }
        {/* Location blurb — sits BELOW the sticky SearchBar shelf (not
            inside it). Confirms the auto-detected region and offers an
            emphasized "Get Current Location" link to override. */}
        {isCR &&
        <div style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "flex-start" : "center",
          justifyContent: "center",
          gap: isMobile ? 6 : 12,
          fontSize: 13,
          color: "#4B5052",
          marginBottom: isMobile ? 20 : 32,
          padding: isMobile ? "0 4px" : 0,
          fontFamily: "Inter, system-ui, sans-serif",
        }}>
          <span>
            It looks like you're in the <b style={{ color: "#0F1214", fontWeight: 700 }}>East Bay</b>. Not Correct?
          </span>
          <button
            type="button"
            style={{
              background: "transparent",
              border: 0,
              padding: 0,
              cursor: "pointer",
              fontFamily: "inherit",
              fontSize: 13,
              fontWeight: 700,
              color: "#1F4ED8",
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              textDecoration: "underline",
              textUnderlineOffset: 3,
            }}
          >
            <Icon name="Navigation" size={13} strokeWidth={2.4} color="#1F4ED8" />
            Get Current Location
          </button>
        </div>
        }
        {!isCR && window.BookCourtWidget &&
        <div style={{ marginBottom: 40 }}>
            <window.BookCourtWidget onSubmit={() => onBookCourt && onBookCourt()} />
          </div>
        }
        <div ref={actionGridRef} aria-hidden="true" style={{ marginTop: 8 }} />
        {isCR &&
        <VerifiedPopularClubs theme={theme} viewport={viewport} onOpenClub={onOpenClub} />
        }
        {isCR &&
        <div style={{ marginTop: 32 }}>
            <BookNowSegment theme={theme} />
          </div>
        }
        {isCR &&
        <PopularEventsNearYou theme={theme} viewport={viewport} title="Trending events near you" onOpenEvent={() => onOpenEventList && onOpenEventList()} />
        }
        {isCR &&
        <MoreEventsNearYou theme={theme} viewport={viewport} onOpenEvent={() => onOpenEventList && onOpenEventList()} />
        }
        {isCR &&
        <PopularEventsNearYou theme={theme} viewport={viewport} title="Recurring Events" onOpenEvent={() => onOpenEventList && onOpenEventList()} />
        }
        {!isCR && window.MyClubBookingPanel &&
        <window.MyClubBookingPanel
          theme={theme}
          hideRail={true}
          club={{
            name: theme.logoText || "Old Coast Pickleball",
            city: theme.cityTag || "St. Augustine, FL",
            rating: 4.9, reviews: 471,
            tier: "Diamond", courts: 8,
            primary: theme.primary, accent: theme.accent
          }} />

        }
        {!isCR &&
        <div style={{ marginTop: 8, display: "grid", gridTemplateColumns: "1fr 1px 1fr", gap: 40, alignItems: "stretch" }}>
          <NextStepsList theme={theme} viewport="desktop" />
          <div style={{ background: theme.t.line, width: 1 }} aria-hidden="true" />
          <SuggestedSegment theme={theme} viewport="desktop" />
        </div>
        }
        {!isCR && <ClubLeaderboardSegment theme={theme} isCR={isCR} />}
      </div>
      <DesktopActionFloater theme={theme} viewport={viewport} visible={pastActions} onOpenEventList={onOpenEventList} onFindClubs={onFindClubs} isCR={isCR} />
      {qrOpen && <MemberQRSheet theme={theme} onClose={() => setQrOpen(false)} />}
    </div>);

}

function UpNextHero({ theme, onOpenEventList, isCR }) {
  const u = PLAYER.upNext;
  // "Upcoming sessions" carousel — every slide is something the player is
  // already on the books for. Same structural fields per slide so the
  // layout is consistent: day chip, surface, format, venue, weather,
  // social proof, then a Share-led CTA with quick Calendar/Map icons.
  const slides = [
  {
    title: u.name,
    day: "Today",
    dateLabel: "Apr 4th",
    timeRange: `${u.time} – 8:00 PM`,
    dayDetail: `${u.time} · in ${u.countdown}`,
    surface: "Hard court",
    format: "Doubles",
    venue: "Old Coast Pickleball",
    weather: { temp: "76°", cond: "Sunny", icon: "Sun" },
    proof: "Mia, Reese + 14 more going · 3 from your network",
    avatars: [
    { i: "MC", c: "#D6573B" }, { i: "RT", c: "#1F4ED8" },
    { i: "SB", c: "#0F1214" }, { i: "PS", c: "#8E5BE8" }],

    bg: isCR ? "#0F1214" : theme.primary
  },
  {
    title: "Saturday open play",
    day: "Tomorrow",
    dateLabel: "Apr 5th",
    timeRange: "9:00 AM – 11:00 AM",
    dayDetail: "9:00 AM · 2 hrs",
    surface: "Clay court",
    format: "Open play",
    venue: "Anastasia Tennis Club",
    weather: { temp: "72°", cond: "Partly cloudy", icon: "CloudSun" },
    proof: "Mia + 7 others on the list · 2 friends going",
    avatars: [{ i: "MC", c: "#D6573B" }, { i: "TS", c: "#0F1214" }, { i: "RT", c: "#1F4ED8" }],
    bg: "#0F1214"
  },
  {
    title: "Spring Doubles Bracket",
    day: "This Saturday",
    dateLabel: "Sat, Apr 6th",
    timeRange: "10:00 AM – 11:00 AM",
    dayDetail: "Apr 6 · 10:00 AM",
    surface: "Hard court",
    format: "Tournament · Doubles",
    venue: "Old Coast Pickleball",
    weather: { temp: "74°", cond: "Sunny", icon: "Sun" },
    proof: "You & Reese seeded #5 of 32 · 8 friends registered",
    avatars: [{ i: "RT", c: "#1F4ED8" }, { i: "JB", c: theme.primary }, { i: "MC", c: "#D6573B" }],
    bg: isCR ? "#0F1214" : theme.primary
  }];

  const [idx, setIdx] = useStateAP(0);
  const [paused, setPaused] = useStateAP(false);
  React.useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % slides.length), 6000);
    return () => clearInterval(id);
  }, [paused, slides.length]);
  const go = (n) => setIdx((n % slides.length + slides.length) % slides.length);
  return (
    <div
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      style={{
        background: slides[idx].bg, color: "#fff", borderRadius: 8,
        /* No inner padding on the card — content uses absolute inset:40
           below so it can fully fill the box top-to-bottom. */
        padding: 0,
        position: "relative",
        aspectRatio: "4 / 1",
        minHeight: 280,
        transition: "background 360ms ease"
      }}>
      {/* Decorative-blob layer — positioned absolute, clips itself so the
                         ambient circles don't bleed out of the card while leaving the
                         actual content unclipped above. */}
      <div style={{ position: "absolute", inset: 0, borderRadius: 8, overflow: "hidden", pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: -80, right: -80, width: 320, height: 320, borderRadius: 999, background: theme.accent, opacity: 0.10 }} />
        <div style={{ position: "absolute", bottom: -120, left: 40, width: 240, height: 240, borderRadius: 999, background: theme.accent, opacity: 0.04 }} />
      </div>

      {/* Flex column — stretched to fill the card. top block holds the
                         identity (eyebrow + title + detail), bottom block holds social
                         proof + actions. Absolute positioning with inset: 40 anchors the
                         column to the padded inset of the card so the bottom row reliably
                         sits at the bottom edge no matter the content height. */}
      <div key={idx} style={{
        position: "absolute", inset: 40, zIndex: 1,
        display: "flex", flexDirection: "column", justifyContent: "space-between",
        gap: 24, minWidth: 0,
        animation: "fadeIn 320ms ease"
      }}>
        <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>

        {/* TOP — eyebrow, day pill, weather, then title + meta */}
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 11, fontWeight: 700, letterSpacing: 1.4, textTransform: "uppercase", color: theme.accent }}>
              <span style={{
                width: 8, height: 8, borderRadius: 999, background: theme.accent,
                boxShadow: `0 0 0 4px ${theme.accent}33, 0 0 12px ${theme.accent}cc`,
                animation: "upNextGlow 1.6s ease-in-out infinite",
                display: "inline-block"
              }} />
              <span>Upcoming sessions</span>
            </div>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 22, padding: "0 10px", borderRadius: 8, background: "rgba(255,255,255,.14)", color: "#fff", fontFamily: theme.display, fontSize: 10, fontWeight: 800, letterSpacing: 0.8, textTransform: "uppercase" }}>
              {slides[idx].day}
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,.85)" }}>
              <Icon name={slides[idx].weather.icon} size={13} color="#FFD166" strokeWidth={2} /> {slides[idx].weather.temp} · {slides[idx].weather.cond}
            </span>
            <style>{`@keyframes upNextGlow {
              0%, 100% { box-shadow: 0 0 0 3px ${theme.accent}33, 0 0 8px ${theme.accent}aa; }
              50%      { box-shadow: 0 0 0 5px ${theme.accent}26, 0 0 16px ${theme.accent}ee; }
            }`}</style>
          </div>
          <h2 style={{ margin: 0, fontFamily: theme.display, fontWeight: 800, fontSize: 40, lineHeight: "44px", letterSpacing: -1.2, color: "#fff" }}>{slides[idx].title}</h2>
          <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 14, fontSize: 13, color: "rgba(255,255,255,.78)", flexWrap: "wrap" }}>
            <ClubTag club={slides[idx].venue} tone="dark" size="sm" variant="tag" />
            <span style={{ width: 3, height: 3, borderRadius: 999, background: "rgba(255,255,255,.3)" }} />
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <Icon name="Calendar" size={12} color="rgba(255,255,255,.65)" strokeWidth={2} /> {slides[idx].dateLabel} · {slides[idx].timeRange}
            </span>
            <span style={{ width: 3, height: 3, borderRadius: 999, background: "rgba(255,255,255,.3)" }} />
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <svg width="13" height="13" viewBox="0 0 20 20" fill="none" stroke="rgba(255,255,255,.65)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2.5" y="4" width="15" height="12" rx="1" />
                <line x1="10" y1="4" x2="10" y2="16" />
                <line x1="2.5" y1="10" x2="17.5" y2="10" />
              </svg>
              {slides[idx].format}
            </span>
          </div>
        </div>

        {/* BOTTOM — social proof left, actions right. Both pinned to the
                           bottom edge of the hero so the call-to-action band reads as a
                           consistent footer rail across all slides. */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: 16, flexWrap: "wrap"
        }}>
          {/* Social proof pill — avatar stack + count */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "8px 14px 8px 8px", background: "rgba(255,255,255,.08)", borderRadius: 8, minWidth: 0, flex: "0 1 auto" }}>
            <div style={{ display: "inline-flex", flexShrink: 0 }}>
              {slides[idx].avatars.map((a, k) =>
              <div key={k} style={{
                width: 24, height: 24, borderRadius: 999, background: a.c, color: "#fff",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                fontFamily: theme.display, fontWeight: 800, fontSize: 9,
                border: "2px solid #0F1214", marginLeft: k === 0 ? 0 : -8
              }}>{a.i}</div>
              )}
            </div>
            <span style={{ fontSize: 12, fontWeight: 500, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{slides[idx].proof}</span>
          </div>

          {/* Action cluster — Calendar / Map quick icons + Share primary */}
          <div style={{ display: "flex", gap: 8, flexShrink: 0, alignItems: "center" }}>
            <button aria-label="Add to calendar" style={{
              width: 44, height: 44, borderRadius: 8, border: "1px solid rgba(255,255,255,.22)",
              background: "transparent", color: "#fff", cursor: "pointer",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              transition: "background 160ms"
            }}
            onMouseEnter={(e) => {e.currentTarget.style.background = "rgba(255,255,255,.08)";}}
            onMouseLeave={(e) => {e.currentTarget.style.background = "transparent";}}>
              <Icon name="Calendar" size={16} color="#fff" strokeWidth={2.2} />
            </button>
            <button aria-label="View on map" style={{
              width: 44, height: 44, borderRadius: 8, border: "1px solid rgba(255,255,255,.22)",
              background: "transparent", color: "#fff", cursor: "pointer",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              transition: "background 160ms"
            }}
            onMouseEnter={(e) => {e.currentTarget.style.background = "rgba(255,255,255,.08)";}}
            onMouseLeave={(e) => {e.currentTarget.style.background = "transparent";}}>
              <Icon name="MapPin" size={16} color="#fff" strokeWidth={2.2} />
            </button>
            <button style={{ height: 44, padding: "0 22px", borderRadius: 8, border: 0, background: "#fff", color: "#0F1214", fontFamily: "inherit", fontWeight: 700, fontSize: 14, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 }}>
              <Icon name="Share" size={14} color="#0F1214" strokeWidth={2.5} /> Share
            </button>
          </div>
        </div>
      </div>

      {/* Slide indicator dots — anchored to the top-right corner of the
                         hero card. */}
      <div style={{
        position: "absolute", top: 28, right: 28, zIndex: 3,
        display: "inline-flex", alignItems: "center", gap: 6
      }}>
        {slides.map((_, i) =>
        <button key={i} onClick={() => go(i)} aria-label={`Slide ${i + 1}`} style={{
          width: i === idx ? 22 : 6, height: 6, borderRadius: 8,
          background: i === idx ? "#fff" : "rgba(255,255,255,.4)",
          border: 0, cursor: "pointer", padding: 0, transition: "all 220ms"
        }} />
        )}
      </div>
    </div>);

}

function KPIStrip({ theme }) {
  const t = theme.t || { bg: "#fff", surface: "#fff", surfaceSoft: "#F4F5F6", text: "#0F1214", textMuted: "#4B5052", textSubtle: "#858F8F", textInverted: "#fff", line: "#E9EBEC", rule: "#0F1214", chip: "#F4F5F6" };
  const kpis = [
  { k: PLAYER.dupr.toFixed(2), v: "DUPR", delta: "+0.3 this month" },
  { k: PLAYER.wl, v: "W / L", delta: "75% win rate" },
  { k: PLAYER.sessions, v: "Sessions", delta: `${PLAYER.hours} hrs played` },
  { k: "\uD83D\uDD25 " + PLAYER.streak, v: "Week streak", delta: "Keep it going" }];

  return (
    <div style={{ marginTop: 24, marginBottom: 32, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0, borderTop: `1px solid ${t.line}`, borderBottom: `1px solid ${t.line}` }}>
      {kpis.map((s, i) =>
      <div key={i} style={{
        padding: "22px 24px",
        borderRight: i < 3 ? `1px solid ${t.line}` : 0
      }}>
          <div style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 32, color: t.text, letterSpacing: -0.6, lineHeight: 1 }}>{s.k}</div>
          <div style={{ marginTop: 10, fontSize: 11, color: t.text, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>{s.v}</div>
          <div style={{ marginTop: 4, fontSize: 12, color: t.textSubtle, fontWeight: 500 }}>{s.delta}</div>
        </div>
      )}
    </div>);

}

function PrimaryActionGrid({ theme, onOpenEventList, onFindClubs, onBookCourt, isCR }) {
  const t = theme.t || { bg: "#fff", surface: "#fff", surfaceSoft: "#F4F5F6", text: "#0F1214", textMuted: "#4B5052", textSubtle: "#858F8F", textInverted: "#fff", line: "#E9EBEC", rule: "#0F1214", chip: "#F4F5F6" };
  // Two-tier action set. The primaries — book a court, find an event — are
  // what a player almost always wants and get full visual weight (brand fill,
  // size, accent halo, explicit arrow). The secondaries — open play, book a
  // pro — stay nearby as quiet text rows so a focused player isn't distracted
  // but anyone hunting for them can still find them.
  const primaries = [
  { icon: "Calendar", label: "Book a court", sub: "148 courts near you · open now", onClick: onBookCourt || onOpenEventList },
  { icon: "Trophy", label: "Find an event", sub: "23 this week · 8 tonight", onClick: onOpenEventList }];

  // In the universal CourtReserve experience, the first secondary swaps to
  // "Find clubs near me" — the player isn't tied to a single venue, so
  // discovering clubs is the natural next move. Branded experiences keep
  // open play / ladders since the venue's already chosen.
  const secondaries = isCR ?
  [
  { icon: "MapPin", label: "Find clubs near me", sub: "6 clubs within 10 mi", onClick: onFindClubs },
  { icon: "GraduationCap", label: "Book a pro", sub: "34 pros within 10 mi" }] :

  [
  { icon: "Users", label: "Open play & ladders", sub: "4 tonight · all levels" },
  { icon: "GraduationCap", label: "Book a pro", sub: "34 pros within 10 mi" }];

  return (
    <div>
      {/* Primary pair — equal width, brand-filled, with arrow affordance */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {primaries.map((p) =>
        <button key={p.label} onClick={p.onClick} style={{
          padding: "20px 22px", borderRadius: 8, border: 0,
          background: theme.primary, color: "#fff",
          cursor: "pointer", textAlign: "left", fontFamily: "inherit",
          display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 16, alignItems: "center",
          position: "relative", overflow: "hidden",
          transition: "transform 140ms"
        }}
        onMouseEnter={(e) => {e.currentTarget.style.transform = "translateY(-1px)";}}
        onMouseLeave={(e) => {e.currentTarget.style.transform = "translateY(0)";}}>
          
            <span style={{ position: "absolute", top: -50, right: -50, width: 200, height: 200, borderRadius: 999, background: theme.accent, opacity: 0.12, pointerEvents: "none" }} />
            <span style={{ width: 44, height: 44, borderRadius: 8, background: "rgba(255,255,255,.14)", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0, position: "relative" }}>
              <Icon name={p.icon} size={22} color="#fff" strokeWidth={1.8} />
            </span>
            <div style={{ minWidth: 0, position: "relative" }}>
              <div style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 18, letterSpacing: -0.3 }}>{p.label}</div>
              <div style={{ marginTop: 4, fontSize: 12, color: "rgba(255,255,255,.72)", fontWeight: 500 }}>{p.sub}</div>
            </div>
            <span style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(255,255,255,.16)", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0, position: "relative" }}>
              <Icon name="ArrowRight" size={16} color="#fff" strokeWidth={2.4} />
            </span>
          </button>
        )}
      </div>

      {/* Secondaries — same dimensions as primaries (2-col grid, same padding
                         and icon scale) so the four read as one consistent block. Ghost
                         style — outlined card on the page bg, muted text — keeps them
                         visually quieter than the brand-filled pair above. */}
      <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {secondaries.map((s) =>
        <button key={s.label} onClick={s.onClick} style={{
          padding: "20px 22px", borderRadius: 8,
          border: `1px solid ${t.line}`, background: "transparent", color: t.text,
          cursor: "pointer", textAlign: "left", fontFamily: "inherit",
          display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 16, alignItems: "center",
          transition: "background 140ms, border-color 140ms"
        }}
        onMouseEnter={(e) => {e.currentTarget.style.background = t.surfaceSoft;e.currentTarget.style.borderColor = t.text;}}
        onMouseLeave={(e) => {e.currentTarget.style.background = "transparent";e.currentTarget.style.borderColor = t.line;}}>
          
            <span style={{ width: 44, height: 44, borderRadius: 8, background: t.surfaceSoft, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon name={s.icon} size={20} color={t.textMuted} strokeWidth={1.8} />
            </span>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: theme.display, fontWeight: 700, fontSize: 18, letterSpacing: -0.3, color: t.text }}>{s.label}</div>
              <div style={{ marginTop: 4, fontSize: 12, color: t.textSubtle, fontWeight: 500 }}>{s.sub}</div>
            </div>
            <span style={{ width: 36, height: 36, borderRadius: 8, background: t.surfaceSoft, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon name="ArrowRight" size={14} color={t.textMuted} strokeWidth={2.2} />
            </span>
          </button>
        )}
      </div>
    </div>);

}

function ClubLeaderboardSegment({ theme, isCR, viewport = "desktop" }) {
  const t = theme.t || { bg: "#fff", surface: "#fff", surfaceSoft: "#F4F5F6", text: "#0F1214", textMuted: "#4B5052", textSubtle: "#858F8F", textInverted: "#fff", line: "#E9EBEC", rule: "#0F1214", chip: "#F4F5F6" };
  const isMobile = viewport === "mobile";
  const playerClubs = [
  { k: "oc", label: "Old Coast" },
  { k: "dd", label: "Dill Dinkers" }];

  const [tab, setTab] = useStateAP("friends");
  if (!isCR && !isMobile) {
    // Branded — two columns side by side. Each column gets its own
    // uppercase eyebrow header so the eye picks up "Friends" / "Club".
    return (
      <div style={{ paddingTop: 32 }}>
        {/* Section title — anchors both columns under one umbrella header
                           so the page reads as "this is the leaderboard section" rather
                           than two unrelated tables. */}
        <h2 style={{
          margin: 0, paddingBottom: 16,
          fontFamily: theme.display, fontWeight: 800,
          fontSize: 28, lineHeight: 1.1, letterSpacing: -0.6,
          color: t.text
        }}>Leaderboard</h2>
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1px 1fr", gap: 40, alignItems: "stretch"
        }}>
          <div>
            <LeaderboardHeader theme={theme} title="Friends" />
            <ClubLeaderboard theme={theme} view="friends" />
          </div>
          <div style={{ background: t.line, width: 1 }} aria-hidden="true" />
          <div>
            <LeaderboardHeader theme={theme} title="Club" />
            <ClubLeaderboard theme={theme} view="club" />
          </div>
        </div>
      </div>);

  }
  // Branded mobile + CourtReserve (any viewport) — segmented control.
  // Tabs include Friends + Club (branded) or Friends + each player club (CR).
  const segTabs = isCR ?
  [{ k: "friends", label: "Friends" }, ...playerClubs.map((p) => ({ k: p.k, label: p.label }))] :
  [{ k: "friends", label: "Friends" }, { k: "club", label: "Club" }];
  return (
    <div>
      <SegmentedHeading
        tabs={segTabs}
        value={tab} onChange={setTab} theme={theme}
        action={<a href="#" style={{ fontSize: 12, color: theme.primary, fontWeight: 600, textDecoration: "none" }}>Full board ›</a>} />
      <ClubLeaderboard theme={theme} view={tab === "friends" ? "friends" : "club"} clubKey={tab} />
    </div>);

}

// Hairline eyebrow header for the side-by-side branded layout. Matches
// the dashboard's existing uppercase title + extending rule pattern.
function LeaderboardHeader({ theme, title }) {
  const t = theme.t || {};
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      paddingTop: 8, paddingBottom: 14, marginBottom: 4
    }}>
      <span style={{
        fontFamily: theme.display, fontWeight: 800,
        fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase",
        color: t.text, whiteSpace: "nowrap"
      }}>{title}</span>
      <span style={{ flex: 1, height: 1, background: t.line }} aria-hidden="true" />
      <a href="#" style={{ fontSize: 12, color: theme.primary, fontWeight: 600, textDecoration: "none" }}>Full board ›</a>
    </div>);

}

function ClubLeaderboard({ theme, view = "friends" }) {
  const t = theme.t || { bg: "#fff", surface: "#fff", surfaceSoft: "#F4F5F6", text: "#0F1214", textMuted: "#4B5052", textSubtle: "#858F8F", textInverted: "#fff", line: "#E9EBEC", rule: "#0F1214", chip: "#F4F5F6" };
  // ---- Friends leaderboard — personal ranking among the player's
  // network. Position change vs. last week drives the up/down arrow.
  const friends = [
  { rank: 1, name: "Reese Tanaka", avatar: "RT", color: "#1F4ED8", dupr: 4.3, delta: +2 },
  { rank: 2, name: "Mia Chen", avatar: "MC", color: "#D6573B", dupr: 4.2, delta: 0 },
  { rank: 3, name: "You", avatar: "JB", color: null, dupr: 4.2, delta: +1, isYou: true },
  { rank: 4, name: "Sam Brewer", avatar: "SB", color: "#0F1214", dupr: 4.1, delta: -2 },
  { rank: 5, name: "Priya Shah", avatar: "PS", color: "#8E5BE8", dupr: 4.0, delta: -1 }];

  // ---- Club-wide leaderboard — same shape, broader pool.
  const club = [
  { rank: 8, name: "Tom Becker", avatar: "TB", color: "#C77700", dupr: 4.6, delta: +1 },
  { rank: 9, name: "Priya Shah", avatar: "PS", color: "#8E5BE8", dupr: 4.5, delta: -2 },
  { rank: 10, name: "Mike Alvarado", avatar: "MA", color: "#1F4ED8", dupr: 4.4, delta: +3 },
  { rank: 11, name: "Reese Tanaka", avatar: "RT", color: "#1F4ED8", dupr: 4.3, delta: 0 },
  { rank: 12, name: "You", avatar: "JB", color: null, dupr: 4.2, delta: +2, isYou: true }];

  const rows = view === "club" ? club : friends;
  return (
    <div>
      {rows.map((r, i) => {
        const up = r.delta > 0;
        const down = r.delta < 0;
        const same = r.delta === 0;
        return (
          <div key={r.rank} style={{
            display: "grid", gridTemplateColumns: "36px 56px auto 1fr auto", gap: 12, alignItems: "center",
            padding: "12px 4px",
            borderBottom: i < rows.length - 1 ? `1px solid ${t.line}` : 0,
            background: r.isYou ? t.surfaceSoft : "transparent",
            borderRadius: r.isYou ? 8 : 0
          }}>
            <span style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 13, color: r.isYou ? theme.primary : "#858F8F" }}>#{r.rank}</span>
            {/* Position change indicator — up/down arrow + delta count, or a
                               neutral dash when unchanged. Color signals direction. */}
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 3,
              fontSize: 11, fontWeight: 700, fontVariantNumeric: "tabular-nums",
              color: up ? "#1FA868" : down ? "#E11D2A" : t.textSubtle
            }}>
              {same ?
              <span style={{ width: 8, height: 2, background: t.textSubtle, borderRadius: 8, display: "inline-block" }} /> :

              <Icon name={up ? "ArrowUp" : "ArrowDown"} size={11} strokeWidth={2.6} color="currentColor" />
              }
              {!same && Math.abs(r.delta)}
            </span>
            <div style={{ width: 28, height: 28, borderRadius: 999, background: r.color || theme.primary, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: theme.display, fontWeight: 800, fontSize: 10 }}>{r.avatar}</div>
            <span style={{ fontFamily: theme.display, fontWeight: r.isYou ? 800 : 600, fontSize: 13, color: t.text }}>{r.name}</span>
            <span style={{ fontFamily: theme.display, fontWeight: 700, fontSize: 13, color: t.text, fontVariantNumeric: "tabular-nums" }}>{r.dupr.toFixed(1)}</span>
          </div>);

      })}
    </div>);

}

function PlayerNetwork({ theme }) {
  return (
    <div>
      {PLAYER.network.map((p, i) =>
      <div key={p.id} style={{
        display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 16, alignItems: "center",
        padding: "18px 4px",
        borderBottom: i < PLAYER.network.length - 1 ? "1px solid #E9EBEC" : 0
      }}>
          <div style={{ width: 48, height: 48, borderRadius: 999, background: p.color, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: theme.display, fontWeight: 800, fontSize: 14 }}>{p.avatar}</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontFamily: theme.display, fontWeight: 700, fontSize: 15, color: "#0F1214", letterSpacing: -0.2 }}>{p.name}</span>
              <span style={{ fontSize: 12, color: "#858F8F", fontWeight: 500 }}>{p.dupr.toFixed(1)} DUPR · {p.reason}</span>
            </div>
            <div style={{ marginTop: 4, fontSize: 12, color: "#4B5052", fontWeight: 500, lineHeight: 1.45 }}>{p.proof}</div>
          </div>
          <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
            <button style={{ width: 36, height: 36, borderRadius: 999, border: 0, background: "transparent", display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Icon name="MessageCircle" size={16} strokeWidth={1.8} color="#4B5052" />
            </button>
            <button style={{ height: 36, padding: "0 14px", borderRadius: 8, border: 0, background: theme.primary, color: "#fff", fontFamily: "inherit", fontWeight: 600, fontSize: 12, cursor: "pointer" }}>{p.action}</button>
          </div>
        </div>
      )}
    </div>);

}

function NextStepsList({ theme, viewport = "desktop" }) {
  const t = theme.t || { bg: "#fff", surface: "#fff", surfaceSoft: "#F4F5F6", text: "#0F1214", textMuted: "#4B5052", textSubtle: "#858F8F", textInverted: "#fff", line: "#E9EBEC", rule: "#0F1214", chip: "#F4F5F6" };
  // Items now live in component state so clicking a row toggles its done
  // status and moves it between the two tabs (Next steps ⇄ Completed).
  const [items, setItems] = useStateAP([
  { id: "t1", done: false, title: "Confirm tonight’s match", why: "No-shows cost 0.05 DUPR — takes 5 sec." },
  { id: "t2", done: false, title: "Rate your last match with Mia", why: "Helps your DUPR settle. 4 quick taps." },
  { id: "t3", done: false, title: "Add Mia as a regular partner", why: "You’ve played 6× — unlock partner shortcuts." },
  { id: "t4", done: false, title: "Try the third-shot drill", why: "Targets your weakest shot this month." },
  { id: "t5", done: true, title: "Set your usual play times", why: "Better suggestions, faster bookings." },
  { id: "t6", done: true, title: "Connect your DUPR account", why: "Pulls match history automatically." }]
  );
  const toggle = (id) => setItems((prev) => prev.map((it) => it.id === id ? { ...it, done: !it.done } : it));
  const [tab, setTab] = useStateAP("open");
  const open = items.filter((i) => !i.done);
  const done = items.filter((i) => i.done);
  const total = items.length;
  const pct = (total - open.length) / total * 100;
  const list = tab === "open" ? open : done;
  const [expanded, setExpanded] = useStateAP(false);
  const desktop = viewport === "desktop";
  // On mobile, collapsed view shows the first 3 items + "Show more" toggle.
  const shown = desktop ? list : expanded ? list : list.slice(0, 3);
  // Reset expansion when switching tabs so each tab starts collapsed.
  React.useEffect(() => {setExpanded(false);}, [tab]);
  return (
    <div>
      <SegmentedHeading
        tabs={[
        { k: "open", label: "Next steps" },
        { k: "done", label: "Completed" }]
        }
        value={tab} onChange={setTab} theme={theme}
        action={
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 12, color: t.textSubtle, fontWeight: 500, whiteSpace: "nowrap", fontStyle: "italic" }}>{open.length} of {total}</span>
            <div style={{ width: 80, height: 4, background: t.surfaceSoft, borderRadius: 8, overflow: "hidden", flexShrink: 0 }}>
              <div style={{ width: `${pct}%`, height: "100%", background: theme.primary, transition: "width 400ms" }} />
            </div>
          </div>
        } />
      {/* Vertical-scroll container — caps height on desktop so a long list
                         doesn't push the rest of the dashboard down. The list area scrolls
                         internally; clicking a row toggles its done status, which moves it
                         between the two tabs. */}
      <div style={desktop ?
      { maxHeight: 290, overflowY: "auto", scrollbarWidth: "thin", paddingRight: 6, paddingBottom: 4 } :
      { maxHeight: expanded ? 420 : "none", overflowY: expanded ? "auto" : "visible", scrollbarWidth: "thin" }
      }>
        {shown.length === 0 ?
        <div style={{ padding: "32px 4px", textAlign: "center", fontSize: 12, color: t.textSubtle, fontWeight: 500 }}>
            {tab === "open" ? "All caught up — nothing left to do." : "Nothing completed yet."}
          </div> :
        shown.map((it, i, arr) =>
        <button key={it.id} onClick={() => toggle(it.id)} style={{
          width: "100%", display: "grid", gridTemplateColumns: "auto 1fr", gap: 16, alignItems: "center",
          height: 80,
          padding: "0 4px", background: "transparent", border: 0,
          borderBottom: i < arr.length - 1 ? `1px solid ${t.line}` : 0,
          cursor: "pointer", fontFamily: "inherit", textAlign: "left",
          opacity: it.done ? 0.55 : 1,
          transition: "opacity 160ms, background 120ms"
        }}
        onMouseEnter={(e) => {e.currentTarget.style.background = t.surfaceSoft;}}
        onMouseLeave={(e) => {e.currentTarget.style.background = "transparent";}}>
          
            {/* Checkbox sits inside a 36px column footprint so the title
            baselines line up with the suggested-row icons in the next
            column over, but the actual check target is 24px to read
            as a checkbox, not a button. */}
            <span style={{
            width: 36, height: 36,
            display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0
          }}>
              <span style={{
              width: 24, height: 24, borderRadius: 999,
              border: it.done ? 0 : `1.5px solid ${t.line}`,
              background: it.done ? theme.primary : t.surface,
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              transition: "background 160ms, border-color 160ms"
            }}>
                {it.done && <Icon name="Check" size={12} color="#fff" strokeWidth={3} />}
              </span>
            </span>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: theme.display, fontWeight: 700, fontSize: 15, color: t.text, letterSpacing: -0.2, textDecoration: it.done ? "line-through" : "none", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{it.title}</div>
              <div style={{ marginTop: 3, fontSize: 12, color: t.textMuted, fontWeight: 500, lineHeight: 1.45, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{it.why}</div>
            </div>
          </button>
        )}
      </div>
      {!desktop && list.length > 3 &&
      <div style={{ marginTop: 12, display: "flex", justifyContent: "center" }}>
          <button onClick={() => setExpanded((e) => !e)} style={{
          height: 34, padding: "0 16px", borderRadius: 8,
          border: `1px solid ${t.line}`, background: t.surface, color: t.text,
          fontFamily: "inherit", fontSize: 12, fontWeight: 600, cursor: "pointer",
          display: "inline-flex", alignItems: "center", gap: 8
        }}
        onMouseEnter={(e) => {e.currentTarget.style.borderColor = "#0F1214";}}
        onMouseLeave={(e) => {e.currentTarget.style.borderColor = "#E9EBEC";}}>
            {expanded ? "Show less" : `Show ${list.length - 3} more`}
            <Icon name={expanded ? "ChevronUp" : "ChevronDown"} size={12} strokeWidth={2.4} color={t.text} />
          </button>
        </div>
      }
    </div>);

}

function PersonCard({ p, theme }) {
  const t = theme.t || { bg: "#fff", surface: "#fff", surfaceSoft: "#F4F5F6", text: "#0F1214", textMuted: "#4B5052", textSubtle: "#858F8F", textInverted: "#fff", line: "#E9EBEC", rule: "#0F1214", chip: "#F4F5F6" };
  return (
    <div style={{
      width: "100%",
      padding: "18px 20px 16px", background: t.surface, border: `1px solid ${t.line}`, borderRadius: 8,
      display: "flex", flexDirection: "column", gap: 14, minHeight: 200
    }}>
      {/* Header — avatar, name, last active */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ position: "relative" }}>
          <div style={{ width: 40, height: 40, borderRadius: 999, background: p.color, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: theme.display, fontWeight: 800, fontSize: 12 }}>{p.avatar}</div>
          {p.live && <span style={{ position: "absolute", bottom: -2, right: -2, width: 12, height: 12, borderRadius: 999, background: "#E11D2A", border: "2px solid #fff" }} />}
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontFamily: theme.display, fontWeight: 700, fontSize: 14, color: t.text, letterSpacing: -0.1 }}>{p.name}</div>
          <div style={{ fontSize: 11, color: p.live ? "#E11D2A" : "#858F8F", fontWeight: 600, marginTop: 1 }}>{p.status}</div>
        </div>
      </div>

      {/* Activity callout, with the club affiliation always on its own
                         line as a tag so every card in this section anchors visually
                         to a place. */}
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: theme.display, fontWeight: 700, fontSize: 15, color: t.text, letterSpacing: -0.2, lineHeight: 1.3 }}>{p.activity}</div>
        <div style={{ marginTop: 4, fontSize: 12, color: t.textMuted, fontWeight: 500, lineHeight: 1.45 }}>{p.detail}</div>
        {p.club &&
        <div style={{ marginTop: 8 }}>
            <ClubTag club={p.club} color={p.clubColor || t.text} size="sm" variant="tag" />
          </div>
        }
      </div>

      {/* Subdued action */}
      <div style={{ display: "flex", gap: 6 }}>
        {p.secondary &&
        <button style={{ width: 36, height: 36, borderRadius: 999, border: 0, background: t.surfaceSoft, display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
            <Icon name={p.secondary} size={14} strokeWidth={1.8} color="#4B5052" />
          </button>
        }
        <button style={{
          flex: 1, height: 36, padding: "0 14px", borderRadius: 8,
          border: `1px solid ${t.line}`, background: t.surface, color: t.text,
          fontFamily: "inherit", fontWeight: 600, fontSize: 12, cursor: "pointer",
          display: "inline-flex", alignItems: "center", justifyContent: "center"
        }}
        onMouseEnter={(e) => {e.currentTarget.style.borderColor = "#0F1214";}}
        onMouseLeave={(e) => {e.currentTarget.style.borderColor = "#E9EBEC";}}>
          {p.action}
        </button>
      </div>
    </div>);

}

function PeopleSegment({ theme, viewport = "desktop" }) {
  const t = theme.t || { bg: "#fff", surface: "#fff", surfaceSoft: "#F4F5F6", text: "#0F1214", textMuted: "#4B5052", textSubtle: "#858F8F", textInverted: "#fff", line: "#E9EBEC", rule: "#0F1214", chip: "#F4F5F6" };
  const isMobile = viewport === "mobile";
  const [tab, setTab] = useStateAP("live");
  const liveCards = PLAYER.friendActivity.map((a) => ({
    avatar: a.avatar, color: a.color, name: a.who,
    status: a.live ? "Live now" : a.when,
    activity: a.what,
    detail: `${a.verb} · ${a.where}`,
    club: a.club, clubColor: a.clubColor,
    action: a.action,
    secondary: "MessageCircle",
    live: a.live
  }));
  const networkCards = PLAYER.network.map((p) => ({
    avatar: p.avatar, color: p.color, name: p.name,
    status: `${p.dupr.toFixed(1)} DUPR`,
    activity: p.reason,
    detail: p.proof,
    club: p.club, clubColor: p.clubColor,
    action: p.action,
    secondary: "MessageCircle"
  }));
  const items = tab === "live" ? liveCards : networkCards;
  const trackRef = React.useRef(null);
  useDragScroll(trackRef);
  const scrollBy = (dir) => {
    const el = trackRef.current;if (!el) return;
    el.scrollBy({ left: dir * Math.round(el.clientWidth * 0.7), behavior: "smooth" });
  };
  return (
    <div>
      <SegmentedHeading
        tabs={[
        { k: "live", label: "Friends activity", dot: true },
        { k: "network", label: "Recommended players" }]
        }
        value={tab} onChange={setTab} theme={theme}
        action={isMobile ? null :
        <div style={{ display: "inline-flex", gap: 6 }}>
            <button onClick={() => scrollBy(-1)} style={{ width: 36, height: 36, borderRadius: 8, border: `1px solid ${t.line}`, background: t.surface, display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Icon name="ChevronLeft" size={14} strokeWidth={2.2} />
            </button>
            <button onClick={() => scrollBy(1)} style={{ width: 36, height: 36, borderRadius: 8, border: `1px solid ${t.line}`, background: t.surface, display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Icon name="ChevronRight" size={14} strokeWidth={2.2} />
            </button>
          </div>
        } />
      <div ref={trackRef} style={{
        display: "flex", gap: 14, overflowX: "auto", scrollSnapType: "x mandatory",
        paddingBottom: 4, scrollbarWidth: "none",
        margin: isMobile ? "0 -20px" : "0 -4px",
        paddingLeft: isMobile ? 20 : 4,
        paddingRight: isMobile ? 20 : 4
      }}>
        {items.map((p, i) =>
        <div key={i} style={{ flex: "0 0 300px", scrollSnapAlign: "start", display: "flex" }}>
            <PersonCard p={p} theme={theme} />
          </div>
        )}
      </div>
    </div>);

}

// ---- Events feed — replaces clubs segment on dashboard. Pulls from the
// real event list with infinite scroll. Segmented between "events at my
// clubs" and "other clubs near you".
function EventsFeedSegment({ theme, onOpenEventList, viewport = "desktop" }) {
  const isMobile = viewport === "mobile";
  const t = theme.t || { bg: "#fff", surface: "#fff", surfaceSoft: "#F4F5F6", text: "#0F1214", textMuted: "#4B5052", textSubtle: "#858F8F", textInverted: "#fff", line: "#E9EBEC", rule: "#0F1214", chip: "#F4F5F6" };
  const [tab, setTab] = useStateAP("mine");
  const [limit, setLimit] = useStateAP(4);
  const [filterOpen, setFilterOpen] = useStateAP(false);
  const [whenFacet, setWhenFacet] = useStateAP(new Set());
  const [formatFacet, setFormatFacet] = useStateAP(new Set());
  const [sort, setSort] = useStateAP("recommended");
  const all = useMemoAP(() => [...(window.SAMPLE_EVENTS || []), ...(window.NEXT_MONTH_EVENTS || [])], []);
  const minePool = useMemoAP(() => all.filter((e) => e.myClub), [all]);
  const otherPool = useMemoAP(() => all.filter((e) => !e.myClub), [all]);
  const basePool = tab === "mine" ? minePool : otherPool;
  const filtered = useMemoAP(() => {
    let list = basePool.filter((ev) => {
      if (whenFacet.size && !whenFacet.has(ev.when)) return false;
      if (formatFacet.size) {
        const f = (ev.format || "").toLowerCase();
        let ok = false;
        formatFacet.forEach((k) => {if (f.includes(k)) ok = true;});
        if (!ok) return false;
      }
      return true;
    });
    const priceVal = (e) => parseFloat((e.priceLabel || "").replace(/[^0-9.]/g, "") || "0");
    const whenOrder = { today: 0, week: 1, next: 2, month: 3 };
    if (sort === "soonest") list = [...list].sort((a, b) => (whenOrder[a.when] || 9) - (whenOrder[b.when] || 9));else
    if (sort === "popular") list = [...list].sort((a, b) => (b.going || 0) - (a.going || 0));else
    if (sort === "price") list = [...list].sort((a, b) => priceVal(a) - priceVal(b));else
    if (sort === "spots") list = [...list].sort((a, b) => (b.spotsLeft || 0) - (a.spotsLeft || 0));
    return list;
  }, [basePool, whenFacet, formatFacet, sort]);
  const pool = filtered;
  const items = pool.slice(0, limit);
  const hasMore = limit < pool.length;
  const sentinelRef = React.useRef(null);
  React.useEffect(() => {setLimit(4);}, [tab, whenFacet, formatFacet, sort]);
  React.useEffect(() => {
    if (!hasMore) return;
    const el = sentinelRef.current;if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) setLimit((L) => L + 3);
    }, { rootMargin: "240px" });
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasMore, tab, limit]);

  const toggle = (set, key, setter) => {
    const next = new Set(set);
    if (next.has(key)) next.delete(key);else next.add(key);
    setter(next);
  };
  const activeFilters = whenFacet.size + formatFacet.size + (sort !== "recommended" ? 1 : 0);
  const clearAll = () => {setWhenFacet(new Set());setFormatFacet(new Set());setSort("recommended");};

  const openDetail = (ev) => {
    if (window.__openEventDetail) window.__openEventDetail(ev.type || "single");
  };

  const WHEN = [{ k: "today", l: "Today" }, { k: "week", l: "This week" }, { k: "next", l: "Next week" }, { k: "month", l: "Next month" }];
  const FORMAT = [{ k: "open play", l: "Open play" }, { k: "round robin", l: "Round robin" }, { k: "clinic", l: "Clinic" }, { k: "bracket", l: "Bracket" }, { k: "ladder", l: "Ladder" }, { k: "social", l: "Social" }];
  const SORTS = [{ k: "recommended", l: "Recommended" }, { k: "soonest", l: "Soonest" }, { k: "popular", l: "Most popular" }, { k: "spots", l: "Spots available" }, { k: "price", l: "Price" }];

  return (
    <div>
      <SegmentedHeading
        tabs={[
        { k: "mine", label: "My club events", count: minePool.length },
        { k: "other", label: "Events near me", count: otherPool.length }]
        }
        value={tab} onChange={setTab} theme={theme}
        action={
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
            <button onClick={() => setFilterOpen((o) => !o)} aria-label="Filter & sort" style={{
            position: "relative",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: 36, height: 36, borderRadius: 8,
            border: `1px solid ${filterOpen || activeFilters ? t.text : t.line}`,
            background: filterOpen ? t.text : t.surface,
            color: filterOpen ? "#fff" : t.text,
            cursor: "pointer",
            transition: "all 140ms"
          }}
          onMouseEnter={(e) => {if (!filterOpen) e.currentTarget.style.borderColor = t.text;}}
          onMouseLeave={(e) => {if (!filterOpen) e.currentTarget.style.borderColor = activeFilters ? t.text : t.line;}}>
              <Icon name="SlidersHorizontal" size={14} strokeWidth={2.2} color={filterOpen ? "#fff" : t.text} />
              {activeFilters > 0 &&
            <span style={{ position: "absolute", top: -4, right: -4, display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 16, height: 16, padding: "0 4px", borderRadius: 999, background: theme.primary, color: "#fff", fontSize: 9, fontWeight: 800, fontFamily: theme.display, border: `1.5px solid ${t.surface}` }}>{activeFilters}</span>
            }
            </button>
            <a href="#" onClick={(e) => {e.preventDefault();onOpenEventList && onOpenEventList();}} style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            height: 36, padding: "0 14px", borderRadius: 8,
            border: `1px solid ${t.line}`, background: t.surface,
            color: t.text, fontFamily: "inherit", fontWeight: 600, fontSize: 12,
            textDecoration: "none", cursor: "pointer", whiteSpace: "nowrap",
            transition: "background 120ms, border-color 120ms"
          }}
          onMouseEnter={(e) => {e.currentTarget.style.background = t.surfaceSoft;e.currentTarget.style.borderColor = t.text;}}
          onMouseLeave={(e) => {e.currentTarget.style.background = t.surface;e.currentTarget.style.borderColor = t.line;}}>
              Browse all
              <Icon name="ArrowRight" size={12} strokeWidth={2.2} color={t.text} />
            </a>
          </div>
        } />
      {/* Layout: left filter sidebar (slides in) + events column. Mirrors
                         the BrowseDesktop event-list filter pattern — when the Filter button
                         is toggled on, a sticky 240px filter aside slides in from the left
                         and the events column shrinks. On mobile, the sidebar collapses to
                         a stacked panel above the list (no slide animation). */}
      <div style={{
        marginTop: 4,
        display: "grid",
        gridTemplateColumns: filterOpen ? "240px 1fr" : "0px 1fr",
        gap: filterOpen ? 32 : 0,
        transition: "grid-template-columns 320ms cubic-bezier(.2,.8,.2,1), gap 320ms cubic-bezier(.2,.8,.2,1)",
        alignItems: "flex-start"
      }}>
        <aside style={{
          overflow: "hidden",
          transform: filterOpen ? "translateX(0)" : "translateX(-16px)",
          opacity: filterOpen ? 1 : 0,
          transition: "transform 320ms cubic-bezier(.2,.8,.2,1), opacity 220ms ease",
          pointerEvents: filterOpen ? "auto" : "none",
          position: "sticky", top: 92
        }}>
          <div style={{
            padding: "18px 16px", borderRadius: 8,
            background: t.surfaceSoft,
            display: "flex", flexDirection: "column", gap: 18,
            minWidth: 0
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 12, letterSpacing: 1.2, textTransform: "uppercase", color: t.text }}>Filters</span>
              {activeFilters > 0 &&
              <button onClick={clearAll} style={{ border: 0, background: "transparent", fontFamily: "inherit", fontSize: 11, fontWeight: 600, color: t.textMuted, textDecoration: "underline", cursor: "pointer", padding: 0 }}>Reset</button>
              }
            </div>

            <div>
              <div style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 10, letterSpacing: 1.2, textTransform: "uppercase", color: t.textSubtle, marginBottom: 10 }}>When</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {WHEN.map((o) => {
                  const on = whenFacet.has(o.k);
                  return (
                    <button key={o.k} onClick={() => toggle(whenFacet, o.k, setWhenFacet)} style={{
                      height: 28, padding: "0 12px", borderRadius: 8,
                      border: on ? 0 : `1px solid ${t.line}`,
                      background: on ? t.text : t.surface,
                      color: on ? "#fff" : t.text,
                      fontFamily: "inherit", fontSize: 11, fontWeight: 600, cursor: "pointer"
                    }}>{o.l}</button>);

                })}
              </div>
            </div>

            <div>
              <div style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 10, letterSpacing: 1.2, textTransform: "uppercase", color: t.textSubtle, marginBottom: 10 }}>Format</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {FORMAT.map((o) => {
                  const on = formatFacet.has(o.k);
                  return (
                    <button key={o.k} onClick={() => toggle(formatFacet, o.k, setFormatFacet)} style={{
                      height: 28, padding: "0 12px", borderRadius: 8,
                      border: on ? 0 : `1px solid ${t.line}`,
                      background: on ? t.text : t.surface,
                      color: on ? "#fff" : t.text,
                      fontFamily: "inherit", fontSize: 11, fontWeight: 600, cursor: "pointer"
                    }}>{o.l}</button>);

                })}
              </div>
            </div>

            <div>
              <div style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 10, letterSpacing: 1.2, textTransform: "uppercase", color: t.textSubtle, marginBottom: 10 }}>Sort by</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {SORTS.map((o) => {
                  const on = sort === o.k;
                  return (
                    <button key={o.k} onClick={() => setSort(o.k)} style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "8px 10px", borderRadius: 8, border: 0,
                      background: on ? t.surface : "transparent",
                      color: t.text, fontFamily: "inherit", fontSize: 12, fontWeight: on ? 700 : 500, cursor: "pointer", textAlign: "left"
                    }}>
                      <span style={{ width: 14, height: 14, borderRadius: 999, border: `1.5px solid ${on ? theme.primary : t.line}`, background: on ? theme.primary : "transparent", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {on && <span style={{ width: 6, height: 6, borderRadius: 999, background: "#fff" }} />}
                      </span>
                      {o.l}
                    </button>);

                })}
              </div>
            </div>

            <div style={{ fontSize: 11, color: t.textSubtle, fontWeight: 500, paddingTop: 6, borderTop: `1px solid ${t.line}` }}>
              {filtered.length} {filtered.length === 1 ? "match" : "matches"} · {tab === "mine" ? "across your clubs" : "from clubs near you"}
            </div>
          </div>
        </aside>
      {/* Event rows — desktop uses the full EventCard; mobile uses a
                                                       compact row (time / title / format / price) so the dashboard feed
                                                       matches the mobile event-list style and doesn't depend on hover
                                                       to surface a CTA. */}
      <div>
        {items.map((ev) => isMobile ?
          <MobileFeedRow key={ev.id} ev={ev} theme={theme} onClick={() => openDetail(ev)} /> :

          <EventCard key={ev.id} ev={ev} onClick={() => openDetail(ev)} theme={theme} />
          )}
        {items.length === 0 &&
          <div style={{ padding: "32px 0", textAlign: "center" }}>
            <div style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 18, color: t.text }}>No matches.</div>
            <div style={{ marginTop: 4, fontSize: 12, color: t.textMuted }}>Try removing a filter or switching tabs.</div>
          </div>
          }
      </div>
      {hasMore ?
        <div ref={sentinelRef} style={{ gridColumn: "1 / -1", padding: "16px 0 0", display: "flex", justifyContent: "center", alignItems: "center", gap: 8, fontSize: 11, color: t.textSubtle, fontWeight: 500, letterSpacing: 0.4, textTransform: "uppercase" }}>
          <span style={{ width: 14, height: 14, borderRadius: 999, border: `1.5px solid ${t.line}`, borderTopColor: "#0F1214", animation: "spin 700ms linear infinite" }} />
          Loading more
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div> :
        items.length > 0 &&
        <div style={{ gridColumn: "1 / -1", padding: "10px 0 0", textAlign: "center", fontSize: 11, color: t.textSubtle, fontWeight: 500 }}>That's everything in this view.</div>
        }
      </div>
    </div>);

}

// ---- Compact event row for the mobile dashboard feed. Mirrors the layout
// of MobileEventRow in Mobile.jsx: 62px time column, title + club/format
// line, optional urgency or going row, price on the right. No hover-reveal
// CTA — tap on the row opens the detail page.
function MobileFeedRow({ ev, theme, onClick }) {
  const t = theme.t || { bg: "#fff", surface: "#fff", surfaceSoft: "#F4F5F6", text: "#0F1214", textMuted: "#4B5052", textSubtle: "#858F8F", textInverted: "#fff", line: "#E9EBEC", rule: "#0F1214", chip: "#F4F5F6" };
  const urg = window.urgencyOf && window.urgencyOf(ev);
  return (
    <div onClick={onClick} style={{
      padding: "18px 0", borderBottom: `1px solid ${t.line}`,
      display: "grid", gridTemplateColumns: "62px 1fr auto", gap: 14, alignItems: "center",
      cursor: "pointer"
    }}>
      <div>
        <div style={{ fontFamily: theme.display, fontWeight: 700, fontSize: 15, color: t.text }}>{ev.timeShort}</div>
        <div style={{ fontSize: 10, color: t.textMuted, marginTop: 2 }}>{ev.dateShort}</div>
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: theme.display, fontWeight: 700, fontSize: 15, color: t.text, letterSpacing: -0.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ev.name}</div>
        <div style={{ marginTop: 3, display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: t.textMuted, overflow: "hidden", whiteSpace: "nowrap" }}>
          {ev.club &&
          <React.Fragment>
              <ClubTag club={ev.club} color={ev.clubColor || t.text} size="sm" variant="tag" style={{ flexShrink: 0 }} />
              <span style={{ width: 3, height: 3, borderRadius: 999, background: t.line, flexShrink: 0 }} />
            </React.Fragment>
          }
          <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{ev.format} · {ev.skill}</span>
        </div>
        {(urg || ev.going > 0) &&
        <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 8 }}>
            {urg &&
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10, fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase",
            color: urg.tone === "alert" ? "#E11D2A" : urg.tone === "warn" ? "#C77700" : t.text }}>
                {urg.live && window.LiveDot && <window.LiveDot tone={urg.tone} />}
                {urg.text}
              </span>
          }
            {ev.going > 0 && !urg &&
          <span style={{ fontSize: 10, color: t.textMuted, fontWeight: 600 }}>{ev.going} going</span>
          }
          </div>
        }
      </div>
      <div style={{ fontFamily: theme.display, fontWeight: 700, fontSize: 14, color: t.text }}>{ev.priceLabel}</div>
    </div>);

}

function ClubsSegment({ theme, isCR, onOpenClub, onFindClubs }) {
  const t = theme.t || { bg: "#fff", surface: "#fff", surfaceSoft: "#F4F5F6", text: "#0F1214", textMuted: "#4B5052", textSubtle: "#858F8F", textInverted: "#fff", line: "#E9EBEC", rule: "#0F1214", chip: "#F4F5F6" };
  const [tab, setTab] = useStateAP("mine");
  const nearby = [
  { id: "wc", name: "Wrightsville Courts", logoMark: "WC", color: "#1F4ED8", miles: 2.4, sessions: 0, joined: false, tier: "Guest", tierColor: "#1F4ED8", courts: 6 },
  { id: "cv", name: "Cape Valley Club", logoMark: "CV", color: "#D6573B", miles: 5.1, sessions: 0, joined: false, tier: "Open booking", tierColor: "#D6573B", courts: 4 },
  { id: "pn", name: "Pinetop Tennis Center", logoMark: "PN", color: "#2E7D32", miles: 7.3, sessions: 0, joined: false, tier: "Open booking", tierColor: "#2E7D32", courts: 8 }];

  const items = tab === "mine" ? PLAYER.clubsPlayedAt : nearby;
  return (
    <div>
      <SegmentedHeading
        tabs={[
        { k: "mine", label: "Clubs you play at" },
        { k: "nearby", label: "Clubs you might like" }]
        }
        value={tab} onChange={setTab} theme={theme}
        action={<a href="#" onClick={(e) => {e.preventDefault();onFindClubs && onFindClubs();}} style={{ fontSize: 12, color: theme.primary, fontWeight: 600, textDecoration: "none" }}>
          {tab === "mine" ? "View all" : "Find more"} ›
        </a>} />
      <ClubsRow theme={theme} isCR={isCR} onOpenClub={onOpenClub} items={items} />
    </div>);

}

function FriendActivity({ theme }) {
  return (
    <div>
      {PLAYER.friendActivity.map((a, i) =>
      <div key={a.id} style={{
        display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 14, alignItems: "center",
        padding: "16px 4px",
        borderBottom: i < PLAYER.friendActivity.length - 1 ? "1px solid #E9EBEC" : 0
      }}>
          <div style={{ position: "relative" }}>
            <div style={{ width: 40, height: 40, borderRadius: 999, background: a.color, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: theme.display, fontWeight: 800, fontSize: 12 }}>{a.avatar}</div>
            {a.live && <span style={{ position: "absolute", bottom: 0, right: 0, width: 12, height: 12, borderRadius: 999, background: "#E11D2A", border: "2px solid #fff" }} />}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 14, color: "#0F1214", lineHeight: 1.4 }}>
              <b style={{ fontFamily: theme.display, fontWeight: 700 }}>{a.who}</b>{" "}
              <span style={{ color: "#4B5052" }}>{a.verb}</span>{" "}
              <b style={{ fontFamily: theme.display, fontWeight: 700 }}>{a.what}</b>
            </div>
            <div style={{ marginTop: 2, fontSize: 12, color: "#858F8F", fontWeight: 500 }}>{a.where} · {a.when}</div>
          </div>
          <button style={{ height: 34, padding: "0 14px", borderRadius: 8, border: 0, background: a.live ? theme.primary : "transparent", color: a.live ? "#fff" : theme.primary, fontFamily: "inherit", fontWeight: 700, fontSize: 12, cursor: "pointer", flexShrink: 0 }}>{a.action}</button>
        </div>
      )}
    </div>);

}

// Make a horizontal-scroll track click-and-drag scrollable with a mouse. The
// arrow buttons handle "next page"; this hook lets users grab anywhere on the
// track and pan, the way a touch device works. Returns props to spread on the
// track element.
function useDragScroll(ref) {
  React.useEffect(() => {
    const el = ref.current;if (!el) return;
    let isDown = false,startX = 0,startScroll = 0,moved = false;
    const onDown = (e) => {
      // Don't hijack drags that start on a button or link inside a card —
      // those need their own click semantics.
      if (e.target.closest("button, a")) return;
      isDown = true;moved = false;
      startX = e.pageX;startScroll = el.scrollLeft;
      el.style.cursor = "grabbing";
      el.style.userSelect = "none";
    };
    const onMove = (e) => {
      if (!isDown) return;
      const dx = e.pageX - startX;
      if (Math.abs(dx) > 4) moved = true;
      el.scrollLeft = startScroll - dx;
    };
    const stop = () => {
      isDown = false;
      el.style.cursor = "";
      el.style.userSelect = "";
    };
    // Click suppression: if user dragged, swallow the synthetic click on the
    // card so we don't accidentally open whatever it links to.
    const onClick = (e) => {if (moved) {e.preventDefault();e.stopPropagation();moved = false;}};
    el.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", stop);
    window.addEventListener("mouseleave", stop);
    el.addEventListener("click", onClick, true);
    el.style.cursor = "grab";
    return () => {
      el.removeEventListener("mousedown", onDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", stop);
      window.removeEventListener("mouseleave", stop);
      el.removeEventListener("click", onClick, true);
    };
  }, [ref]);
}

// Expose for cross-script carousels (BookNow, etc) that live in their own
// Babel script and otherwise can't see this hook.
window.useDragScroll = useDragScroll;

// ---- For you — mixed-type recommendations carousel. Smaller cards than
// the matches/people carousels (≥ 4 visible at once on desktop), each with a
// clear "why" reason. Mixed: players to connect with, clubs to try, events
// to register for. Uses the same drag-scroll + arrow-button pattern as
// MatchesSegment/PeopleSegment so the row feels native to the page.
function ForYouSegment({ theme, viewport = "desktop" }) {
  const t = theme.t || { bg: "#fff", surface: "#fff", surfaceSoft: "#F4F5F6", text: "#0F1214", textMuted: "#4B5052", textSubtle: "#858F8F", textInverted: "#fff", line: "#E9EBEC", rule: "#0F1214", chip: "#F4F5F6" };
  const isMobile = viewport === "mobile";
  const trackRef = React.useRef(null);
  useDragScroll(trackRef);
  const scrollBy = (dir) => {
    const el = trackRef.current;if (!el) return;
    el.scrollBy({ left: dir * Math.round(el.clientWidth * 0.7), behavior: "smooth" });
  };

  // Each item carries enough context to render a small card with a "why"
  // reason — the algorithmic surface area, in essence. Mixed types share the
  // same shell (icon + name + reason + meta + CTA).
  const items = [
  { id: "p1", kind: "player", icon: "Users", avatar: "TB", color: "#C77700",
    name: "Tom Becker", title: "4.6 DUPR · ↑0.2 this month",
    why: "Same level, played 2× with Mia",
    meta: "Old Coast · weeknights", cta: "Connect" },
  { id: "c1", kind: "club", icon: "MapPin", avatar: "WC", color: "#1F4ED8",
    name: "Wrightsville Courts", title: "Open booking · 6 courts",
    why: "2.4 mi away · matches your usual time",
    meta: "Booking open this week", cta: "View club" },
  { id: "e1", kind: "event", icon: "Trophy", avatar: "RR", color: "#2E5D52",
    name: "Sunday Mixed Doubles RR", title: "Round robin · 3.0–4.0",
    why: "Reese and Sam are going",
    meta: "Sun May 10 · 10 AM", cta: "Register" },
  { id: "p2", kind: "player", icon: "Users", avatar: "AR", color: "#1F4ED8",
    name: "Ana Ruiz", title: "4.3 DUPR · 12 wins this month",
    why: "Lives 1.2 mi from you",
    meta: "Plays Tue/Thu · open to doubles", cta: "Connect" },
  { id: "e2", kind: "event", icon: "Zap", avatar: "DL", color: "#8E5BE8",
    name: "Friday Night Lights", title: "Drop-in · 3.5+",
    why: "Open spot in your range",
    meta: "Dill Dinkers · Fri 7:30 PM", cta: "Register" },
  { id: "c2", kind: "club", icon: "MapPin", avatar: "CV", color: "#D6573B",
    name: "Cape Valley Club", title: "Outdoor · 4 courts",
    why: "Friend Mia played here last week",
    meta: "5.1 mi · open booking", cta: "View club" },
  { id: "p3", kind: "player", icon: "Users", avatar: "LP", color: "#D6573B",
    name: "Lena Park", title: "4.4 DUPR · regular at Old Coast",
    why: "Stretch partner — closes your gap",
    meta: "Same schedule · 3 mutuals", cta: "Connect" },
  { id: "e3", kind: "event", icon: "Trophy", avatar: "SB", color: "#2E5D52",
    name: "Spring Doubles Bracket", title: "Bracket · 32 teams",
    why: "You & Reese would seed #5",
    meta: "Apr 6 · Old Coast", cta: "Register" }];

  // Single-bucket section — every item shows. The kind tag on each card
  // already conveys what's a player / club / event, so a segmented filter
  // adds clutter without adding value here.
  const labelFor = { player: "Player", club: "Club", event: "Event" };

  return (
    <div>
      {/* Section header — title left, carousel arrows right. Same layout
                         as the BookNow "Available to play now" header so the dashboard's
                         discovery sections all read as siblings. */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 16, paddingTop: 32, paddingBottom: 16
      }}>
        <h2 style={{
          margin: 0,
          fontFamily: theme.display, fontWeight: 800,
          fontSize: isMobile ? 24 : 28, lineHeight: 1.1, letterSpacing: -0.6,
          color: t.text
        }}>Recommended for you</h2>
        {!isMobile &&
        <div style={{ display: "inline-flex", gap: 6 }}>
            <button onClick={() => scrollBy(-1)} style={{ width: 36, height: 36, borderRadius: 8, border: `1px solid ${t.line}`, background: t.surface, display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Icon name="ChevronLeft" size={14} strokeWidth={2.2} />
            </button>
            <button onClick={() => scrollBy(1)} style={{ width: 36, height: 36, borderRadius: 8, border: `1px solid ${t.line}`, background: t.surface, display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Icon name="ChevronRight" size={14} strokeWidth={2.2} />
            </button>
          </div>
        }
      </div>
      <div ref={trackRef} style={{
        display: "flex", gap: 12, overflowX: "auto", scrollSnapType: "x mandatory",
        paddingBottom: 4, scrollbarWidth: "none",
        margin: isMobile ? "0 -20px" : "0 -4px",
        paddingLeft: isMobile ? 20 : 4,
        paddingRight: isMobile ? 20 : 4
      }}>
        {items.map((it) =>
        <div key={it.id} style={{
          flex: isMobile ? "0 0 220px" : "0 0 340px",
          scrollSnapAlign: "start",
          background: t.surface, color: t.text,
          border: `1px solid ${t.line}`,
          borderRadius: 8, padding: "16px 16px 14px",
          display: "flex", flexDirection: "column"
        }}>
            {/* Kind tag — colored pill at the top of the card so the card
            type reads at a glance (Player / Club / Event). */}
            <span style={{
            alignSelf: "flex-start",
            display: "inline-flex", alignItems: "center", gap: 6,
            height: 22, padding: "0 10px", borderRadius: 8,
            background: it.color, color: "#fff",
            fontFamily: theme.display, fontWeight: 800, fontSize: 9, letterSpacing: 1, textTransform: "uppercase"
          }}>
              <Icon name={it.icon} size={10} color="#fff" strokeWidth={2.4} />
              {labelFor[it.kind]}
            </span>

            {/* Identity row — avatar, name + title metadata all on the
            same horizontal line. Avatar shape varies by kind (rounded
            square for clubs, circle for players, hex-feeling square
            for events). */}
            <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
              <div style={{
              width: 40, height: 40, flexShrink: 0,
              borderRadius: it.kind === "club" ? 10 : it.kind === "event" ? 8 : 999,
              background: it.color, color: "#fff",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              fontFamily: theme.display, fontWeight: 800, fontSize: 13
            }}>{it.avatar}</div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontFamily: theme.display, fontWeight: 700, fontSize: 14, color: t.text, letterSpacing: -0.2, lineHeight: 1.25, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{it.name}</div>
                <div style={{ marginTop: 2, fontSize: 11, color: t.textMuted, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{it.title}</div>
                {/* Meta tucked under the title so the identity block carries
                both the "what" (title) and the "where/when" (meta) in
                one tight stack. */}
                <div style={{ marginTop: 2, fontSize: 11, color: t.textSubtle, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{it.meta}</div>
              </div>
            </div>

            {/* Why-suggested line */}
            <div style={{
            marginTop: 10, padding: "8px 10px", borderRadius: 8,
            background: t.surfaceSoft,
            display: "flex", alignItems: "flex-start", gap: 6,
            fontSize: 11, color: t.textMuted, fontWeight: 500, lineHeight: 1.4
          }}>
              <Icon name="Sparkles" size={11} color={theme.primary} strokeWidth={2} />
              <span>{it.why}</span>
            </div>

            {/* Action button — matches the Friends Activity card button:
            full-width, h36, hairline outline, ghost fill. */}
            <button style={{
            marginTop: 12,
            width: "100%", height: 36, padding: "0 14px", borderRadius: 8,
            border: `1px solid ${t.line}`,
            background: t.surface, color: t.text,
            fontFamily: "inherit", fontWeight: 600, fontSize: 12, cursor: "pointer",
            display: "inline-flex", alignItems: "center", justifyContent: "center"
          }}>{it.cta}</button>
          </div>
        )}
      </div>
    </div>);

}

function MatchesSegment({ theme, viewport = "desktop" }) {
  const t = theme.t || { bg: "#fff", surface: "#fff", surfaceSoft: "#F4F5F6", text: "#0F1214", textMuted: "#4B5052", textSubtle: "#858F8F", textInverted: "#fff", line: "#E9EBEC", rule: "#0F1214", chip: "#F4F5F6" };
  const isMobile = viewport === "mobile";
  const [tab, setTab] = useStateAP("upcoming");
  const trackRef = React.useRef(null);
  useDragScroll(trackRef);
  const scrollBy = (dir) => {
    const el = trackRef.current;if (!el) return;
    el.scrollBy({ left: dir * Math.round(el.clientWidth * 0.7), behavior: "smooth" });
  };
  return (
    <div>
      <SegmentedHeading
        tabs={[
        { k: "upcoming", label: "My bookings" },
        { k: "recent", label: "Recent matches" }]
        }
        value={tab} onChange={setTab} theme={theme}
        action={isMobile ? null :
        <div style={{ display: "inline-flex", gap: 6 }}>
            <button onClick={() => scrollBy(-1)} style={{ width: 36, height: 36, borderRadius: 8, border: `1px solid ${t.line}`, background: t.surface, display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Icon name="ChevronLeft" size={14} strokeWidth={2.2} />
            </button>
            <button onClick={() => scrollBy(1)} style={{ width: 36, height: 36, borderRadius: 8, border: `1px solid ${t.line}`, background: t.surface, display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Icon name="ChevronRight" size={14} strokeWidth={2.2} />
            </button>
          </div>
        } />
      <div ref={trackRef} style={{ ...{
          display: "flex", gap: 14, overflowX: "auto", scrollSnapType: "x mandatory",
          paddingBottom: 4, scrollbarWidth: "none",
          // On mobile, bleed the track from the body's 20px inset out to the
          // screen edges so the next card visibly hangs off the right —
          // signaling "more here" without arrow buttons. Padding restores the
          // left alignment so the first card lines up with the title.
          margin: isMobile ? "0 -20px" : "0 -4px",
          paddingLeft: isMobile ? 20 : 4,
          paddingRight: isMobile ? 20 : 4, padding: "0px 20px 4px"
        }, margin: "0px -20px 0px -8px" }}>
        <style>{`.ms-track::-webkit-scrollbar { display: none; }`}</style>
        {tab === "upcoming" ? <UpcomingCards theme={theme} /> : <RecentMatchCards theme={theme} />}
      </div>
    </div>);

}

function UpcomingCards({ theme }) {
  const t = theme.t || { bg: "#fff", surface: "#fff", surfaceSoft: "#F4F5F6", text: "#0F1214", textMuted: "#4B5052", textSubtle: "#858F8F", textInverted: "#fff", line: "#E9EBEC", rule: "#0F1214", chip: "#F4F5F6" };
  const items = [
  { id: "u1", kind: "Court reservation", title: "Court 3 reserved", sub: "1 hr · Singles practice", club: "Old Coast", clubColor: "#2E5D52", time: "4:30 PM – 5:30 PM", day: "Today", urgent: "In 2h 14m", going: ["JB"], meta: "Just you · 2.1 mi", cta: "Check in" },
  { id: "u2", kind: "Round robin", title: "Thursday Night RR", sub: "3.0–3.5 · doubles", club: "Old Coast", clubColor: "#2E5D52", time: "6:30 PM – 8:30 PM", day: "Tonight", urgent: "Live · 1 spot left", going: ["MA", "RT", "SB"], goingTotal: 18, meta: "Mia + 17 going", cta: "Check in" },
  { id: "u3", kind: "Clinic", title: "Dink Lab", sub: "Soft game fundamentals", club: "Dill Dinkers", clubColor: "#8E5BE8", time: "10:00 AM – 11:30 AM", day: "Sat May 9", going: ["PD", "LH"], meta: "Priya + 4 going", cta: "Add to calendar" },
  { id: "u4", kind: "Tournament", title: "Spring Doubles Bracket", sub: "32 teams · $45", club: "Old Coast", clubColor: "#2E5D52", time: "All day", day: "Apr 6", going: ["RT", "MC", "PS"], goingTotal: 46, meta: "Reese + 45 going", cta: "View bracket" }];

  // Initials helper for the club color chip — keeps the card consistent
  // across "Old Coast" / "Dill Dinkers" / etc.
  const clubInitials = (n) => (n || "").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <React.Fragment>
      {items.map((it) =>
      <div key={it.id} style={{
        flex: "0 0 360px", scrollSnapAlign: "start",
        background: t.surface, color: t.text,
        border: `1px solid ${t.line}`,
        borderRadius: 8, padding: "20px 22px 18px",
        display: "flex", flexDirection: "column", gap: 12, minHeight: 240,
        position: "relative", overflow: "hidden"
      }}>
          {/* Top row — kind pill on left, urgent indicator (if any) +
          actions menu on right. Club is intentionally NOT here so
          the title doesn't compete with the venue identity. */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
            <span style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            height: 22, padding: "0 10px", borderRadius: 8,
            background: it.clubColor, color: "#fff",
            fontFamily: theme.display, fontWeight: 800, fontSize: 10, letterSpacing: 1, textTransform: "uppercase",
            flexShrink: 0
          }}>{it.kind}</span>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
              {it.urgent &&
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, color: "#E11D2A", whiteSpace: "nowrap" }}>
                  <span style={{ width: 6, height: 6, borderRadius: 999, background: "#E11D2A" }} />
                  {it.urgent}
                </span>
            }
              <button aria-label="More options" style={{
              width: 28, height: 28, borderRadius: 999, border: 0,
              background: t.surfaceSoft, color: t.textMuted,
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer"
            }}>
                <Icon name="MoreHorizontal" size={14} strokeWidth={2.2} color={t.textMuted} />
              </button>
            </div>
          </div>

          {/* Title, then the club identity as a tag on its own line, then
          format/skill on its own line. Keeping each "kind" of metadata
          on its own row mirrors how every other card on the dashboard
          renders the club affiliation. */}
          <div>
            <div style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 18, lineHeight: "22px", letterSpacing: -0.4, color: t.text }}>{it.title}.</div>
            <div style={{ marginTop: 8 }}>
              <ClubTag club={it.club} color={it.clubColor} variant="tag" />
            </div>
            <div style={{ marginTop: 6, fontSize: 12, color: t.textMuted, fontWeight: 500 }}>{it.sub}</div>
          </div>

          {/* Footer — time/date LEFT, social proof RIGHT, with hairline above */}
          <div style={{ marginTop: "auto", paddingTop: 12, borderTop: `1px solid ${t.line}`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 14, color: t.text }}>{it.day}</div>
              <div style={{ marginTop: 2, fontSize: 11, color: t.textSubtle, fontWeight: 500 }}>{it.time}</div>
            </div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              {(it.going || []).length > 0 &&
            <div style={{ display: "inline-flex" }}>
                  {(it.going || []).slice(0, 3).map((g, i) =>
              <span key={i} style={{
                width: 22, height: 22, borderRadius: 999,
                background: ["#D6573B", "#1F4ED8", "#0F1214", "#8E5BE8"][i % 4],
                color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center",
                fontFamily: theme.display, fontWeight: 800, fontSize: 9,
                border: `2px solid ${t.surface}`, marginLeft: i === 0 ? 0 : -8
              }}>{g}</span>
              )}
                </div>
            }
              <span style={{ fontSize: 11, color: t.textMuted, fontWeight: 500, textAlign: "right" }}>{it.meta}</span>
            </div>
          </div>

          {/* CTA row — primary action right-aligned, secondary icons on
          the left (Notify / Directions). Mirrors the rest of the
          dashboard: the most prominent action sits where the eye
          ends its scan. */}
          <div style={{ display: "flex", gap: 6 }}>
            <button aria-label="Remind me before this starts" title="Notify me prior" style={{
            width: 34, height: 34, borderRadius: 999,
            border: 0, background: t.surfaceSoft,
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", flexShrink: 0
          }}>
              <Icon name="Bell" size={13} strokeWidth={2.2} color={t.textMuted} />
            </button>
            <button aria-label="Get directions" title="Directions" style={{
            width: 34, height: 34, borderRadius: 999,
            border: 0, background: t.surfaceSoft,
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", flexShrink: 0
          }}>
              <Icon name="MapPin" size={13} strokeWidth={2.2} color={t.textMuted} />
            </button>
            <button style={{
            flex: 1, height: 34, padding: "0 12px", borderRadius: 8,
            border: `1px solid ${t.line}`, background: t.surface, color: t.text,
            fontFamily: "inherit", fontWeight: 600, fontSize: 11, cursor: "pointer",
            display: "inline-flex", alignItems: "center", justifyContent: "center"
          }}
          onMouseEnter={(e) => {e.currentTarget.style.borderColor = "#0F1214";}}
          onMouseLeave={(e) => {e.currentTarget.style.borderColor = "#E9EBEC";}}>
              {it.cta}
            </button>
          </div>
        </div>
      )}
    </React.Fragment>);

}

function RecentMatchCards({ theme }) {
  const t = theme.t || { bg: "#fff", surface: "#fff", surfaceSoft: "#F4F5F6", text: "#0F1214", textMuted: "#4B5052", textSubtle: "#858F8F", textInverted: "#fff", line: "#E9EBEC", rule: "#0F1214", chip: "#F4F5F6" };
  // Dark semantic backgrounds — saturated brand colors for each result so
  // the card is unmistakable at a glance.
  const palette = {
    W: { label: "Win", bg: "#0F3D2A", accent: "#7CE0B5", pillBg: "#1F8A5B", pillText: "#fff" },
    L: { label: "Loss", bg: "#3D1218", accent: "#FF8B8B", pillBg: "#C8243A", pillText: "#fff" },
    D: { label: "Draw", bg: "#0F2B4D", accent: "#8AB6FF", pillBg: "#1F6DD1", pillText: "#fff" }
  };
  return (
    <React.Fragment>
      {PLAYER.recentMatches.map((m) => {
        const p = palette[m.result] || palette.W;
        const rated = !!m.rated;
        return (
          <div key={m.id} style={{
            flex: "0 0 360px", scrollSnapAlign: "start",
            background: p.bg, color: "#fff",
            border: 0,
            borderRadius: 8, padding: "20px 22px 18px",
            position: "relative", overflow: "hidden",
            display: "flex", flexDirection: "column", gap: 12, minHeight: 240
          }}>
            <div style={{ position: "absolute", top: -50, right: -50, width: 180, height: 180, borderRadius: 999, background: p.accent, opacity: 0.10, pointerEvents: "none" }} />

            {/* Top row — result pill + meta on left, share top-right */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, position: "relative" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                <span style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  height: 22, padding: "0 10px", borderRadius: 8,
                  background: p.pillBg, color: p.pillText,
                  fontFamily: theme.display, fontWeight: 800, fontSize: 10, letterSpacing: 1, textTransform: "uppercase",
                  flexShrink: 0
                }}>{p.label}</span>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, minWidth: 0, overflow: "hidden" }}>
                  <ClubTag club={m.club} tone="dark" size="sm" variant="tag" />
                  <span style={{ width: 3, height: 3, borderRadius: 999, background: "rgba(255,255,255,.3)", flexShrink: 0 }} />
                  <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,.6)", whiteSpace: "nowrap" }}>{m.when}</span>
                </div>
              </div>
              <button aria-label="Share match" style={{
                width: 28, height: 28, borderRadius: 999, border: 0,
                background: "rgba(255,255,255,.12)", color: "#fff",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", flexShrink: 0
              }}>
                <Icon name="Share2" size={13} strokeWidth={2} color="#fff" />
              </button>
            </div>

            {/* Kind/tag — tournament, singles, stretch, etc. */}
            {m.kind &&
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
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
                  <Icon name="RotateCcw" size={12} strokeWidth={2.2} color={rated ? "#0F1214" : "#fff"} /> Rematch {m.partner.split(" ")[0]}
                </button>
              </div>
            </div>
          </div>);

      })}
    </React.Fragment>);

}

function RecentMatches({ theme }) {
  const t = theme.t || { bg: "#fff", surface: "#fff", surfaceSoft: "#F4F5F6", text: "#0F1214", textMuted: "#4B5052", textSubtle: "#858F8F", textInverted: "#fff", line: "#E9EBEC", rule: "#0F1214", chip: "#F4F5F6" };
  return (
    <div style={{
      display: "flex", gap: 14, overflowX: "auto", scrollSnapType: "x mandatory",
      paddingBottom: 4, scrollbarWidth: "none", margin: "0 -4px"
    }}>
      <style>{`.rm-track::-webkit-scrollbar { display: none; }`}</style>
      {PLAYER.recentMatches.map((m) => {
        const win = m.result === "W";
        return (
          <div key={m.id} style={{
            flex: "0 0 360px", scrollSnapAlign: "start",
            background: win ? "#0F1214" : t.surface,
            color: win ? t.surface : t.text,
            border: win ? 0 : `1px solid ${t.line}`,
            borderRadius: 8, padding: "20px 22px 18px",
            position: "relative", overflow: "hidden",
            display: "flex", flexDirection: "column", gap: 14, minHeight: 280
          }}>
            {win && <div style={{ position: "absolute", top: -50, right: -50, width: 180, height: 180, borderRadius: 999, background: theme.accent, opacity: 0.12, pointerEvents: "none" }} />}

            <div style={{ display: "flex", alignItems: "center", gap: 10, position: "relative" }}>
              <span style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                height: 22, padding: "0 10px", borderRadius: 8,
                background: win ? theme.accent : t.surfaceSoft,
                color: win ? "#0F1214" : "#4B5052",
                fontFamily: theme.display, fontWeight: 800, fontSize: 10, letterSpacing: 1, textTransform: "uppercase"
              }}>{win ? "✨ Win" : "Recap"}</span>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                <ClubTag club={m.club} tone={win ? "dark" : "light"} size="sm" variant="tag" />
                <span style={{ width: 3, height: 3, borderRadius: 999, background: win ? "rgba(255,255,255,.3)" : "#DEE1E5", flexShrink: 0 }} />
                <span style={{ fontSize: 11, fontWeight: 600, color: win ? "rgba(255,255,255,.6)" : "#858F8F" }}>{m.when}</span>
              </div>
            </div>

            <div style={{ position: "relative" }}>
              <div style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 20, lineHeight: "24px", letterSpacing: -0.4 }}>
                {m.headline}.
              </div>
              <div style={{ marginTop: 8, fontSize: 12, color: win ? "rgba(255,255,255,.7)" : "#4B5052", lineHeight: 1.5, fontWeight: 500 }}>
                {m.blurb}
              </div>
            </div>

            <div style={{ marginTop: "auto", position: "relative" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ display: "inline-flex" }}>
                  <span style={{ width: 22, height: 22, borderRadius: 999, background: m.partnerColor, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: theme.display, fontWeight: 800, fontSize: 9, border: win ? "2px solid #0F1214" : "2px solid #fff" }}>JB</span>
                  <span style={{ width: 22, height: 22, borderRadius: 999, background: m.partnerColor, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: theme.display, fontWeight: 800, fontSize: 9, marginLeft: -10, border: win ? "2px solid #0F1214" : "2px solid #fff" }}>{m.partnerInit}</span>
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, color: win ? "rgba(255,255,255,.85)" : "#0F1214" }}>You & {m.partner}</span>
              </div>
              <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 14, fontVariantNumeric: "tabular-nums" }}>{m.score}</span>
                <span style={{ width: 3, height: 3, borderRadius: 999, background: win ? "rgba(255,255,255,.3)" : "#BBBFC1" }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: m.duprDelta >= 0 ? "#7CE0B5" : "#FF8B8B" }}>
                  DUPR {m.duprDelta >= 0 ? "+" : ""}{m.duprDelta.toFixed(2)}
                </span>
              </div>
              <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 6 }}>
                <Icon name="Sparkles" size={11} color={win ? theme.accent : "#858F8F"} strokeWidth={2} />
                <span style={{ fontSize: 10, fontWeight: 700, color: win ? theme.accent : "#4B5052", letterSpacing: 0.4, textTransform: "uppercase" }}>{m.highlight}</span>
              </div>
              <div style={{ marginTop: 14, display: "flex", gap: 6 }}>
                <button style={{ flex: 1, height: 32, padding: "0 12px", borderRadius: 8, border: 0, background: win ? t.surface : theme.primary, color: win ? "#0F1214" : t.surface, fontFamily: "inherit", fontWeight: 700, fontSize: 11, cursor: "pointer", whiteSpace: "nowrap" }}>Rebook {m.partner.split(" ")[0]}</button>
                <button style={{ height: 32, padding: "0 12px", borderRadius: 8, border: win ? "1px solid rgba(255,255,255,.3)" : `1px solid ${t.line}`, background: "transparent", color: win ? t.surface : t.text, fontFamily: "inherit", fontWeight: 600, fontSize: 11, cursor: "pointer" }}>Share</button>
              </div>
            </div>
          </div>);

      })}
    </div>);

}

function SuggestedSegment({ theme, viewport = "desktop" }) {
  const t = theme.t || { bg: "#fff", surface: "#fff", surfaceSoft: "#F4F5F6", text: "#0F1214", textMuted: "#4B5052", textSubtle: "#858F8F", textInverted: "#fff", line: "#E9EBEC", rule: "#0F1214", chip: "#F4F5F6" };
  const [tab, setTab] = useStateAP("tournaments");
  const [expanded, setExpanded] = useStateAP(false);
  const desktop = viewport === "desktop";
  // Reset expansion when switching tabs so each tab starts collapsed on mobile.
  React.useEffect(() => {setExpanded(false);}, [tab]);
  return (
    <div>
      <SegmentedHeading
        tabs={[
        { k: "tournaments", label: "Tournaments" },
        { k: "events", label: "Events" },
        { k: "training", label: "Training" }]
        }
        value={tab} onChange={setTab} theme={theme} />
      {desktop ?
      <div style={{ maxHeight: 300, overflowY: "auto", scrollbarWidth: "thin", paddingRight: 4 }}>
          {tab === "tournaments" && <SuggestedTournaments theme={theme} />}
          {tab === "events" && <SuggestedEvents theme={theme} />}
          {tab === "training" && <PickedForYou theme={theme} />}
        </div> :

      <ListMoreShell theme={theme} viewport={viewport} expanded={expanded} setExpanded={setExpanded}>
          {tab === "tournaments" && <SuggestedTournaments theme={theme} expanded={expanded} />}
          {tab === "events" && <SuggestedEvents theme={theme} expanded={expanded} />}
          {tab === "training" && <PickedForYou theme={theme} expanded={expanded} />}
        </ListMoreShell>
      }
    </div>);

}

// Shared mobile shell: shows first N children; "Show more" reveals the rest.
function ListMoreShell({ theme, expanded, setExpanded, children }) {
  const t = theme.t || { bg: "#fff", surface: "#fff", surfaceSoft: "#F4F5F6", text: "#0F1214", textMuted: "#4B5052", textSubtle: "#858F8F", textInverted: "#fff", line: "#E9EBEC", rule: "#0F1214", chip: "#F4F5F6" };
  return (
    <div>
      {children}
      <div style={{ marginTop: 14, display: "flex", justifyContent: "center" }}>
        <button onClick={() => setExpanded((e) => !e)} style={{
          height: 36, padding: "0 18px", borderRadius: 8,
          border: `1px solid ${t.line}`, background: t.surface, color: t.text,
          fontFamily: "inherit", fontSize: 12, fontWeight: 600, cursor: "pointer",
          display: "inline-flex", alignItems: "center", gap: 8
        }}
        onMouseEnter={(e) => {e.currentTarget.style.borderColor = "#0F1214";}}
        onMouseLeave={(e) => {e.currentTarget.style.borderColor = "#E9EBEC";}}>
          {expanded ? "Show less" : "Show more"}
          <Icon name={expanded ? "ChevronUp" : "ChevronDown"} size={12} strokeWidth={2.4} color={t.text} />
        </button>
      </div>
    </div>);

}

function SegmentedHeading({ tabs, value, onChange, theme, action }) {
  const t = theme.t || { bg: "#fff", surface: "#fff", surfaceSoft: "#F4F5F6", text: "#0F1214", textMuted: "#4B5052", textSubtle: "#858F8F", textInverted: "#fff", line: "#E9EBEC", rule: "#0F1214", chip: "#F4F5F6" };
  // Detect a "narrow" container (a phone frame): once available width is
  // below the threshold, the control fills its row and each tab takes an
  // equal share so the segmented control reads as part of the page edge to
  // edge — mobile expectation. Desktop keeps the natural-width pill.
  const ref = React.useRef(null);
  const [narrow, setNarrow] = React.useState(false);
  React.useLayoutEffect(() => {
    const el = ref.current;if (!el) return;
    const measure = () => {
      const w = el.parentElement ? el.parentElement.clientWidth : 0;
      setNarrow(w > 0 && w < 440);
    };
    measure();
    let ro;
    if (typeof ResizeObserver !== "undefined" && el.parentElement) {
      ro = new ResizeObserver(measure);
      ro.observe(el.parentElement);
    }
    return () => {if (ro) ro.disconnect();};
  }, []);
  return (
    <div ref={ref} style={{ display: "flex", alignItems: "center", paddingTop: 32, paddingBottom: 16, marginBottom: 8, gap: 14, flexWrap: "wrap" }}>
      <div style={{
        display: "flex",
        // Pill becomes full-width on narrow viewports so its segments span
        // the page; on wide viewports it stays its natural width as a
        // compact section header.
        width: narrow ? "100%" : "auto",
        padding: 3, background: t.surfaceSoft, borderRadius: 8, gap: 2,
        border: `1px solid ${t.line}`
      }}>
        {tabs.map((tab) => {
          const on = value === tab.k;
          return (
            <button key={tab.k} onClick={() => onChange(tab.k)} style={{
              border: 0, padding: "0 14px", height: 32, borderRadius: 8, cursor: "pointer",
              flex: narrow ? "1 1 0" : "0 0 auto",
              background: on ? theme.dark ? "rgba(255,255,255,.12)" : t.surface : "transparent",
              color: on ? t.text : t.textMuted,
              boxShadow: on ? theme.dark ? "0 0 0 1px rgba(255,255,255,.08)" : "0 1px 2px rgba(15,18,20,.08), 0 0 0 1px rgba(15,18,20,.04)" : "none",
              fontFamily: theme.display, fontWeight: on ? 800 : 600, fontSize: 11,
              letterSpacing: 1.2, textTransform: "uppercase",
              display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
              transition: "background 160ms, color 160ms, box-shadow 160ms, font-weight 160ms",
              whiteSpace: "nowrap",
              minWidth: 0,
              overflow: "hidden",
              textOverflow: "ellipsis"
            }}>
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", minWidth: 0 }}>{tab.label}</span>
              {tab.count != null &&
              <span style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                minWidth: 18, height: 18, padding: "0 6px", borderRadius: 999,
                background: on ? t.text : t.line,
                color: on ? "#fff" : t.textMuted,
                fontFamily: theme.display, fontSize: 10, fontWeight: 800, letterSpacing: 0,
                textTransform: "none",
                flexShrink: 0,
                transition: "background 160ms, color 160ms"
              }}>{tab.count}</span>
              }
              {tab.dot && <span style={{ width: 6, height: 6, borderRadius: 999, background: "#E11D2A", flexShrink: 0 }} />}
            </button>);

        })}
      </div>
      {action && <div style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", flex: narrow ? "1 1 auto" : "0 0 auto", justifyContent: narrow ? "flex-end" : "flex-end" }}>{action}</div>}
    </div>);

}

function SuggestedRow({ icon, title, reason, meta, theme, last }) {
  const t = theme.t || { bg: "#fff", surface: "#fff", surfaceSoft: "#F4F5F6", text: "#0F1214", textMuted: "#4B5052", textSubtle: "#858F8F", textInverted: "#fff", line: "#E9EBEC", rule: "#0F1214", chip: "#F4F5F6" };
  return (
    <button style={{
      width: "100%", display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 16, alignItems: "center",
      padding: "18px 4px", background: "transparent", border: 0,
      borderBottom: last ? 0 : `1px solid ${t.line}`,
      cursor: "pointer", fontFamily: "inherit", textAlign: "left"
    }}>
      <span style={{ width: 36, height: 36, borderRadius: 8, background: theme.softTint, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon name={icon} size={15} color={theme.primary} strokeWidth={2} />
      </span>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: theme.display, fontWeight: 700, fontSize: 15, color: t.text, letterSpacing: -0.2 }}>{title}</div>
        <div style={{ marginTop: 3, fontSize: 12, color: t.textMuted, fontWeight: 500, lineHeight: 1.45 }}>{reason}</div>
        <div style={{ marginTop: 2, fontSize: 11, color: t.textSubtle, fontWeight: 500 }}>{meta}</div>
      </div>
      <Icon name="ArrowRight" size={14} strokeWidth={2} color={t.text} />
    </button>);

}

function SuggestedTournaments({ theme, expanded = true }) {
  const items = [
  { id: "t1", icon: "Trophy", title: "Spring Doubles Bracket", reason: "You & Reese would seed #5 of 32", meta: "Apr 6 · Old Coast · 32 teams" },
  { id: "t2", icon: "Trophy", title: "Coastal Pickleball Open", reason: "Mia is registered — needs a partner", meta: "May 18 · Vilano Beach · 64 teams" },
  { id: "t3", icon: "Trophy", title: "Summer Skills Shuffle", reason: "Random teams — your win rate jumps to 71% here", meta: "Jun 1 · Old Coast · 24 teams" },
  { id: "t4", icon: "Trophy", title: "Beachside Charity Doubles", reason: "Right at your level · benefits the youth program", meta: "Jun 22 · Vilano Beach · 48 teams" },
  { id: "t5", icon: "Trophy", title: "Florida State Invitational", reason: "Stretch event — invite-only · waitlist open", meta: "Jul 12 · St. Augustine · 96 teams" },
  { id: "t6", icon: "Trophy", title: "Twilight Mixed Doubles Series", reason: "Reese, Sam and Priya all going", meta: "Aug 3–24 · Dill Dinkers · 6 nights" }];

  const shown = expanded ? items : items.slice(0, 3);
  return (
    <div>
      {shown.map((it, i) =>
      <SuggestedRow key={it.id} {...it} theme={theme} last={i === shown.length - 1} />
      )}
    </div>);

}

function SuggestedEvents({ theme, expanded = true }) {
  const items = [
  { id: "e1", icon: "Users", title: "Thursday 3.0 Round Robin", reason: "Mia + 2 friends going", meta: "Old Coast · Tonight 6:30 PM · 1 spot left" },
  { id: "e2", icon: "Users", title: "Sunday Mixed Doubles", reason: "Same-level players you usually beat", meta: "Old Coast · Sun 10 AM · 9 of 24 open" },
  { id: "e3", icon: "Zap", title: "Friday Night Lights Drop-In", reason: "Reese plays here every Friday", meta: "Dill Dinkers · Fri 7:30 PM · 12 of 20 open" },
  { id: "e4", icon: "Users", title: "Saturday Morning Open Play", reason: "Light traffic — quick rotation", meta: "Old Coast · Sat 8 AM · 6 of 16 open" },
  { id: "e5", icon: "Activity", title: "Tuesday Skills & Drills", reason: "Targets your weakest shot", meta: "Old Coast · Tue 6 PM · 5 of 12 open" },
  { id: "e6", icon: "Users", title: "Wednesday Ladies Doubles", reason: "Priya is captain — looking for partners", meta: "Old Coast · Wed 6 PM · 7 of 16 open" }];

  const shown = expanded ? items : items.slice(0, 3);
  return (
    <div>
      {shown.map((it, i) =>
      <SuggestedRow key={it.id} {...it} theme={theme} last={i === shown.length - 1} />
      )}
    </div>);

}

function PickedForYou({ theme, expanded = true }) {
  const items = [
  { id: "i1", icon: "Activity", title: "Third-shot drop consistency", reason: "Your weakest shot in your last 5 matches", meta: "Drill · 15 min · Coach Reid" },
  { id: "i2", icon: "Sparkles", title: "Your dink game is improving", reason: "Won 78% of kitchen points last week", meta: "Insight · Try Intermediate Drilling at Club PB USA" },
  { id: "i3", icon: "Activity", title: "Backhand return depth", reason: "Returns sat short in 3 of last 4 losses", meta: "Drill · 10 min · Mike Alvarado" },
  { id: "i4", icon: "Activity", title: "Reset under pressure", reason: "Lost 4 of 5 long rallies in your last loss", meta: "Drill · 12 min · Coach Reid" },
  { id: "i5", icon: "Sparkles", title: "Court coverage trending up", reason: "Avg position 14% closer to NVZ this month", meta: "Insight · Keep it going" },
  { id: "i6", icon: "Activity", title: "Punch volley accuracy", reason: "Helps close out games at the kitchen line", meta: "Drill · 10 min · Mike Alvarado" }];

  const shown = expanded ? items : items.slice(0, 3);
  return (
    <div>
      {shown.map((it, i) =>
      <SuggestedRow key={it.id} {...it} theme={theme} last={i === shown.length - 1} />
      )}
    </div>);

}

function DrillsRecs({ theme }) {
  return (
    <div>
      {PLAYER.drills.map((d, i) =>
      <div key={d.id} style={{
        display: "grid", gridTemplateColumns: "1fr auto", gap: 14, alignItems: "center",
        padding: "16px 4px",
        borderBottom: i < PLAYER.drills.length - 1 ? "1px solid #E9EBEC" : 0
      }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: theme.display, fontWeight: 700, fontSize: 14, color: "#0F1214", letterSpacing: -0.1 }}>{d.title}</div>
            <div style={{ marginTop: 4, fontSize: 12, color: "#4B5052", fontWeight: 500, lineHeight: 1.45 }}>{d.why}</div>
            <div style={{ marginTop: 4, fontSize: 11, color: "#858F8F", fontWeight: 500 }}>{d.duration} · {d.coach}</div>
          </div>
          <button style={{ height: 34, padding: "0 14px", borderRadius: 8, border: 0, background: "transparent", color: theme.primary, fontFamily: "inherit", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>Try ›</button>
        </div>
      )}
    </div>);

}

function TournamentTeaser({ theme }) {
  return (
    <div style={{ padding: "18px 0", display: "flex", flexDirection: "column", gap: 14 }}>
      <div>
        <div style={{ fontFamily: theme.display, fontWeight: 700, fontSize: 15, color: "#0F1214", letterSpacing: -0.2 }}>Spring Doubles Bracket</div>
        <div style={{ fontSize: 11, color: "#858F8F", fontWeight: 500, marginTop: 2 }}>Apr 6 · Old Coast · 32 teams</div>
      </div>
      <div style={{ fontSize: 13, color: "#0F1214", fontWeight: 500, lineHeight: 1.5 }}>
        <b style={{ color: theme.primary }}>You &amp; Reese</b> would seed at <b>#5 of 32</b>. Combined DUPR 8.3 — sweet spot for this bracket.
      </div>
      <button style={{ alignSelf: "flex-start", height: 38, padding: "0 18px", borderRadius: 8, border: 0, background: theme.primary, color: "#fff", fontFamily: "inherit", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>Invite Reese</button>
    </div>);

}

function HomeCR({ viewport, theme, onOpenEventList, onOpenClub, onFindClubs, onBookCourt, app, setApp }) {
  return <Dashboard theme={theme} viewport={viewport} onOpenEventList={onOpenEventList} onOpenClub={onOpenClub} onFindClubs={onFindClubs} onBookCourt={onBookCourt} mode="cr" app={app} setApp={setApp} />;
}
function HomeOC({ viewport, theme, onOpenEventList, onOpenClub, onFindClubs, onBookCourt, app, setApp }) {
  return <Dashboard theme={theme} viewport={viewport} onOpenEventList={onOpenEventList} onOpenClub={onOpenClub} onFindClubs={onFindClubs} onBookCourt={onBookCourt} mode="branded" app={app} setApp={setApp} />;
}

Object.assign(window, { THEMES, HomeCR, HomeOC, MobileBottomNav, ChromeBar });