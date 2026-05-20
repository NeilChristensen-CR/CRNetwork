// ---- BookNow segment ----
// A discovery carousel of immediate booking openings. Sits at the top of the
// dashboard so the most time-pressing decision — "I want to play in the next
// hour, where can I go?" — is one click away.
//
// Anatomy:
//   1. Filter bar (Today · Any Time · 2 Players · location) that makes the
//      current filter state explicit and editable. Mirrors the pattern in
//      the screenshot reference.
//   2. Sport facet chips with live counts.
//   3. Horizontal carousel of compact venue cards. NO imagery — each card is
//      a tight row of: venue, rating, sport/price/city, then 4 bookable time
//      pills. Clicking a time opens the Customize modal, pre-filled with
//      that slot as a template the player can tweak before confirming.
function BookNowSegment({ theme, viewport = "desktop" }) {
  const t = theme.t || { bg: "#fff", surface: "#fff", surfaceSoft: "#F4F5F6", text: "#0F1214", textMuted: "#4B5052", textSubtle: "#858F8F", textInverted: "#fff", line: "#E9EBEC", rule: "#0F1214", chip: "#F4F5F6" };
  const isMobile = viewport === "mobile";

  // ---- Filter state ----------------------------------------------------
  // All four filters are first-class so the bar reflects the current
  // narrowing. "Sport" lives separately as the visual chip strip below.
  const [day, setDay] = React.useState("Today");
  const [time, setTime] = React.useState("Any Time");
  const [players, setPlayers] = React.useState("2 Players");
  const [location, setLocation] = React.useState("");
  const [sport, setSport] = React.useState("all");

  // Which slot the user just clicked — drives the customize modal.
  const [pendingSlot, setPendingSlot] = React.useState(null);

  // ---- Venue data ------------------------------------------------------
  // Realistic Florida-coast venues that match the existing PLAYER context
  // (Old Coast Pickleball, Vilano Beach, etc). Each venue has 4 bookable
  // openings; we surface the soonest 4 in the card.
  const venues = [
  {
    id: "v1",
    name: "Old Coast Pickleball",
    rating: 4.9, reviews: 471,
    sport: "Pickleball", price: "$$", city: "St. Augustine", state: "FL", zip: "32084",
    booked: 23,
    myClub: true,
    times: ["9:00 AM", "9:30 AM", "10:00 AM", "11:30 AM"]
  },
  {
    id: "v2",
    name: "Vilano Beach Racquet",
    rating: 4.6, reviews: 218,
    sport: "Tennis", price: "$", city: "Vilano Beach", state: "FL", zip: "32084",
    booked: 41,
    times: ["10:00 AM", "10:30 AM", "11:00 AM", "12:30 PM"]
  },
  {
    id: "v3",
    name: "Dill Dinkers Jacksonville",
    rating: 4.8, reviews: 156,
    sport: "Pickleball", price: "$$", city: "Jacksonville", state: "FL", zip: "32256",
    booked: 18,
    myClub: true,
    times: ["8:00 AM", "12:00 PM", "2:30 PM", "4:00 PM"]
  },
  {
    id: "v4",
    name: "Greenfield Racquet Club",
    rating: 4.5, reviews: 89,
    sport: "Tennis", price: "$$", city: "Ponte Vedra", state: "FL", zip: "32082",
    booked: 12,
    times: ["9:30 AM", "10:00 AM", "1:00 PM", "3:00 PM"]
  },
  {
    id: "v5",
    name: "The Hub Padel",
    rating: 4.7, reviews: 134,
    sport: "Padel", price: "$$$", city: "Jacksonville Beach", state: "FL", zip: "32250",
    booked: 8,
    times: ["7:00 AM", "9:00 AM", "2:00 PM", "3:30 PM"]
  },
  {
    id: "v6",
    name: "Anastasia Sports Club",
    rating: 4.4, reviews: 102,
    sport: "Tennis", price: "$$", city: "Anastasia Island", state: "FL", zip: "32080",
    booked: 15,
    times: ["8:30 AM", "11:00 AM", "1:30 PM", "5:00 PM"]
  },
  {
    id: "v7",
    name: "World Golf Village Tennis",
    rating: 4.7, reviews: 287,
    sport: "Tennis", price: "$$$", city: "St. Augustine", state: "FL", zip: "32092",
    booked: 9,
    times: ["10:30 AM", "12:30 PM", "3:30 PM", "5:30 PM"]
  }];


  // ---- Sport facets ----------------------------------------------------
  // Counts are derived from the venue pool. "All Sports" shows the union
  // count so the player sees what they're trading off by filtering.
  const sports = [
  { k: "all", label: "All Sports", icon: "Globe" },
  { k: "Tennis", label: "Tennis", icon: "Circle" },
  { k: "Pickleball", label: "Pickleball", icon: "Hexagon" },
  { k: "Padel", label: "Padel", icon: "Square" },
  { k: "Platform", label: "Platform Tennis", icon: "Grid" }];

  const counts = {
    all: 842 + 1204 + 186 + 94,
    Tennis: 842,
    Pickleball: 1204,
    Padel: 186,
    Platform: 94
  };

  // ---- Apply Day / Time / Players filters ------------------------------
  // Time → time-of-day bucket on each venue's openings.
  const parseHour = (label) => {
    const m = /^(\d{1,2}):(\d{2})\s*(AM|PM)/i.exec(label || "");
    if (!m) return null;
    let h = Number(m[1]) % 12;
    if (m[3].toUpperCase() === "PM") h += 12;
    return h + Number(m[2]) / 60;
  };
  const timeFits = (label) => {
    const h = parseHour(label);
    if (h == null) return true;
    const slot = String(time).toLowerCase();
    if (slot === "any time") return true;
    if (slot === "next hour") return h <= 11; // demo: treat "next hour" as the earliest band
    if (slot === "morning") return h < 12;
    if (slot === "afternoon") return h >= 12 && h < 17;
    if (slot === "evening") return h >= 17;
    return true;
  };
  // Day → a deterministic per-venue hash decides which venues have any
  // availability that day. "Today" keeps the full set so the initial view
  // is dense; the other days hide a stable subset so toggling has a
  // visible effect.
  const dayHides = (vid) => {
    if (day === "Today") return false;
    const h = [...String(vid)].reduce((a, c) => a + c.charCodeAt(0), 0);
    if (day === "Tomorrow") return h % 3 === 0;
    if (day === "This weekend") return h % 4 === 0;
    if (day === "Next 7 days") return false;
    return false;
  };
  // Players → "Open play group" widens; specific counts narrow to venues
  // whose first slot has at least that many seats (mock — even ids vs odd).
  const playersFits = (v) => {
    const slot = String(players).toLowerCase();
    if (slot === "open play group") return true;
    if (slot === "1 player" || slot === "2 players") return true;
    // 3-4 players: filter out the smallest "boutique" venues
    const h = [...String(v.id)].reduce((a, c) => a + c.charCodeAt(0), 0);
    if (slot === "3 players") return h % 5 !== 0;
    if (slot === "4 players") return h % 6 !== 0;
    return true;
  };

  // Project the filtered venues — each venue may have a reduced `times`
  // list after the Time filter; venues with no remaining slots drop out.
  const projected = venues.
  filter((v) => !dayHides(v.id)).
  filter(playersFits).
  map((v) => ({ ...v, times: (v.times || []).filter(timeFits) })).
  filter((v) => v.times.length > 0);
  const filtered = sport === "all" ? projected : projected.filter((v) => v.sport === sport);
  // My clubs lead the carousel; nearby clubs follow. Same-group order
  // preserved from the source array so we keep an editorially curated
  // sequence inside each bucket rather than re-sorting alphabetically.
  const ordered = React.useMemo(() => {
    const mine = filtered.filter((v) => v.myClub);
    const other = filtered.filter((v) => !v.myClub);
    return [...mine, ...other];
  }, [filtered]);
  // Index where the "around me" group begins — drives a soft inline
  // divider chip in the carousel so the prioritization is legible.
  const firstOtherIdx = ordered.findIndex((v) => !v.myClub);

  // ---- Carousel scroll -------------------------------------------------
  const trackRef = React.useRef(null);
  // useDragScroll is exposed on window from Apps.jsx so this cross-script
  // carousel still gets drag-to-pan on desktop (mobile mock).
  if (typeof window !== "undefined" && typeof window.useDragScroll === "function") window.useDragScroll(trackRef);
  const scrollBy = (dir) => {
    const el = trackRef.current;if (!el) return;
    el.scrollBy({ left: dir * Math.round(el.clientWidth * 0.7), behavior: "smooth" });
  };

  return (
    <div>
      {/* ---- Header — title + filter cluster. On desktop the two share a
              single row; on mobile the title and filters stack so neither has
              to compete for horizontal space and the filters can sit edge-to-
              edge under the heading. */}
      <div style={{
        display: "flex", flexDirection: isMobile ? "column" : "row",
        alignItems: isMobile ? "stretch" : "center",
        justifyContent: "space-between",
        gap: isMobile ? 12 : 16,
        paddingTop: 0, paddingBottom: 4,
        marginBottom: 4
      }}>
        <h2 style={{
          margin: 0,
          fontFamily: theme.display, fontWeight: 800,
          fontSize: isMobile ? 20 : 28, lineHeight: 1.15, letterSpacing: isMobile ? -0.4 : -0.8,
          color: t.text,
          minWidth: 0,
          flex: "0 1 auto",
          whiteSpace: "nowrap"
        }}>Available to play now</h2>
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          justifyContent: isMobile ? "flex-start" : "flex-end",
          flex: "0 1 auto", minWidth: 0,
          // Don't clip the dropdown popovers on mobile — on phones the
          // filter row sits flush with the page edge, so any overflow is
          // visual hiding via the page bounds, not a clipped popover.
          overflowX: "visible",
          width: isMobile ? "100%" : "auto",
          flexWrap: isMobile ? "wrap" : "nowrap"
        }}>
          {/* Day / Time / Players filters were removed — the global hero
              SearchBar carries the same filter intent (WHERE / ACTIVITY /
              WHEN / WHO), so this section now stays clean and the carousel
              arrows sit alone on the right. */}
          {!isMobile &&
          <div style={{ display: "inline-flex", gap: 8 }}>
              <button onClick={() => scrollBy(-1)} aria-label="Previous" style={{ width: 44, height: 44, borderRadius: 8, border: 0, background: "transparent", display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <Icon name="ChevronLeft" size={18} strokeWidth={2} />
              </button>
              <button onClick={() => scrollBy(1)} aria-label="Next" style={{ width: 44, height: 44, borderRadius: 8, border: 0, background: "transparent", display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <Icon name="ChevronRight" size={18} strokeWidth={2} />
              </button>
            </div>
          }
        </div>
      </div>

      {/* ---- Carousel of compact venue cards ----
              Cards are split into two labeled groups inside the same horizontal
              scroll track. Each group has its title above the row of cards
              with a hairline extending to the right of the title so the eye
              can trace what's grouped under it. A vertical line between the
              two groups makes the separation explicit. */}
      {(() => {
        // Logged-out network view: one continuous list of venues, no
        // "My clubs / Clubs around me" subgrouping (signed-out users have
        // no club affiliation to split by).
        return (
          <div style={{ position: "relative", margin: isMobile ? "-8px -16px -8px" : "-16px -4px -16px" }}>
          <div ref={trackRef} style={{
            display: "flex", gap: 16, overflowX: "auto", scrollSnapType: "x mandatory",
            paddingTop: isMobile ? 12 : 28, paddingBottom: isMobile ? 16 : 32, scrollbarWidth: "none",
            paddingLeft: isMobile ? 20 : 4,
            paddingRight: isMobile ? 20 : 4,
            alignItems: "stretch"
          }}>
            {ordered.map((v) => (
              <div key={v.id} style={{ flex: "0 0 280px", scrollSnapAlign: "start", display: "flex" }}>
                <BookNowCard v={v} theme={theme} onPickSlot={(timeLabel) => setPendingSlot({ venue: v, time: timeLabel })} />
              </div>
            ))}
          </div>
          {/* Right-edge fade — 16px gradient so the last partially visible
              card dissolves into the page background instead of hard-clipping. */}
          <div aria-hidden="true" style={{
            position: "absolute",
            top: 0, bottom: 0, right: 0,
            width: 16,
            background: `linear-gradient(to left, ${t.bg} 0%, rgba(244,245,246,0) 100%)`,
            pointerEvents: "none",
          }} />
          </div>);

      })()}

      {/* ---- Customize modal ---- */}
      {pendingSlot &&
      <CustomizeReservationModal
        slot={pendingSlot}
        theme={theme}
        defaultPlayers={players}
        defaultDay={day}
        onClose={() => setPendingSlot(null)} />

      }
    </div>);

}

// ---- FilterPill — dropdown filter with options popover.
// Each pill is a button that opens a small menu below it. The current value
// is shown inline so the bar reads as the live filter state, and tapping
// any option swaps the value (and closes the menu).
function FilterPill({ icon, label, value, options, onChange, divider, theme }) {
  const t = theme.t || {};
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  // Close on outside click so the menu doesn't sit open between interactions.
  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {if (ref.current && !ref.current.contains(e.target)) setOpen(false);};
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);
  const hasMenu = Array.isArray(options) && options.length > 0;
  return (
    <div ref={ref} style={{ position: "relative", display: "inline-flex" }}>
      <button onClick={() => hasMenu && setOpen((v) => !v)} style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        height: 34, padding: "0 12px",
        background: open ? t.surfaceSoft : "transparent", border: 0,
        borderRight: divider ? `1px solid ${t.line}` : 0,
        cursor: hasMenu ? "pointer" : "default", fontFamily: "inherit",
        color: t.text, fontSize: 13, fontWeight: 600,
        whiteSpace: "nowrap",
        transition: "background 120ms"
      }}>
        <Icon name={icon} size={14} strokeWidth={2} color={t.textMuted} />
        {value || label}
        <Icon name="ChevronDown" size={12} strokeWidth={2.2} color={t.textMuted} style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 180ms" }} />
      </button>
      {open && hasMenu &&
      <div style={{
        position: "absolute", top: "calc(100% + 6px)", left: 0, zIndex: 30,
        minWidth: 180,
        background: t.surface,
        border: `1px solid ${t.line}`,
        borderRadius: 8,
        boxShadow: "0 12px 32px rgba(15,18,20,.12), 0 2px 6px rgba(15,18,20,.04)",
        padding: 6
      }}>
          {options.map((o) => {
          const on = o === value;
          return (
            <button key={o} onClick={() => {onChange && onChange(o);setOpen(false);}} style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
              padding: "10px 12px", borderRadius: 8, border: 0,
              background: on ? t.surfaceSoft : "transparent",
              color: t.text, fontFamily: "inherit", fontSize: 13, fontWeight: on ? 700 : 600,
              cursor: "pointer", textAlign: "left"
            }}
            onMouseEnter={(e) => {if (!on) e.currentTarget.style.background = t.surfaceSoft;}}
            onMouseLeave={(e) => {if (!on) e.currentTarget.style.background = "transparent";}}>
                <span>{o}</span>
                {on && <Icon name="Check" size={12} strokeWidth={2.6} color={theme.primary} />}
              </button>);

        })}
        </div>
      }
    </div>);

}

// ---- SearchPill — text input for location filter ----
function SearchPill({ placeholder, value, onChange, theme }) {
  const t = theme.t || {};
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 8,
      height: 40, padding: "0 14px"
    }}>
      <Icon name="Search" size={14} strokeWidth={2} color={t.textMuted} />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          flex: 1, minWidth: 0,
          border: 0, outline: 0, background: "transparent",
          fontFamily: "inherit", fontSize: 13, fontWeight: 500,
          color: t.text
        }} />
    </div>);

}

// ---- BookNowCard — shared venue card used by "Available to play now"
// AND by "Popular clubs near you". MiniMap header on top, pin + stacked
// name/city block, sport + booked caption, 2x2 time-slot grid, and a
// grey footer CTA. Pure presentational — parents own the slot/CTA wiring.
function BookNowCard({ v, theme, onPickSlot, onOpenClub }) {
  const t = theme.t || {};

  // Deterministic distance + active-players count per venue. These are
  // prototype demo numbers — stable across renders so the cards don't churn.
  const hash = (() => { let h = 0; for (let i = 0; i < v.id.length; i++) h = (h * 31 + v.id.charCodeAt(i)) >>> 0; return h; })();
  const distance = v.distance != null ? v.distance : ((hash % 30) / 10 + 0.5).toFixed(1);
  const activePlayers = v.activePlayers != null ? v.activePlayers : (30 + hash % 35);
  const venueForMap = { ...v, distance, activePlayers };

  return (
    <div style={{
      width: "100%",
      padding: 0,
      background: t.surface,
      border: `1px solid ${t.line}`,
      borderRadius: 8,
      display: "flex", flexDirection: "column",
      overflow: "hidden",
      transition: "box-shadow 160ms, transform 160ms"
    }}
    onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 8px 24px rgba(15,18,20,0.10)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
    onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}>
      
      {/* Mini map — distance pill top-left, "X Active" green pill top-right.
              Same SVG illustration underneath. */}
      <MiniMap venue={venueForMap} theme={theme} />

      {/* Card body — equal top and bottom padding so the time slots have
          breathing room before the gray footer below them. */}
      <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
        {/* Title + location block — single row anchored by a pin icon on the
            left, stacked text on the right. align-items: flex-start keeps the
            icon glued to the first line of the name even when long titles
            wrap to two or three lines. */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
          <span style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            // marginTop nudges the icon onto the cap-height of the title
            // (the 17px display font sits a few px below its container top).
            marginTop: 3,
            flexShrink: 0,
          }}>
            <Icon name="MapPin" size={14} strokeWidth={2.2} color="#0F1214" />
          </span>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{
              fontFamily: theme.display, fontWeight: 800, fontSize: 17,
              color: "#0F1214", letterSpacing: -0.3, lineHeight: 1.2,
            }}>{v.name}</div>
            <div style={{
              marginTop: 2,
              fontSize: 13, fontWeight: 500, color: "#4B5052",
              lineHeight: 1.3,
            }}>{v.city}{v.state ? `, ${v.state}` : ""}</div>
          </div>
        </div>

        {/* Sport tag + booked-today caption. Sport is rendered as a pill
            tag matching the Popular clubs styling so the metadata reads as
            a discrete attribute. */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          fontSize: 13, color: "#4B5052", fontWeight: 500,
        }}>
          <span style={{
            display: "inline-flex", alignItems: "center",
            height: 22, padding: "0 8px", borderRadius: 6,
            background: "#F4F5F6", color: "#0F1214",
            fontSize: 11, fontWeight: 600,
            whiteSpace: "nowrap",
          }}>{v.sport}</span>
          <span>Booked {v.booked} × Today</span>
        </div>

        {/* Time slot pills — 2x2 grid, simple gray outlined boxes. Clicking
            opens the customize modal pre-filled with this slot. */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 4 }}>
          {v.times.slice(0, 4).map((time) =>
            <button key={time} onClick={() => onPickSlot(time)} style={{
              height: 40, padding: "0 8px", borderRadius: 8,
              border: "1px solid #DEE1E5",
              background: "#FFFFFF", color: "#0F1214",
              fontFamily: "inherit", fontWeight: 600, fontSize: 12,
              cursor: "pointer",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              transition: "border-color 120ms, background 120ms"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#0F1214";
              e.currentTarget.style.background = "#F4F5F6";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#DEE1E5";
              e.currentTarget.style.background = "#FFFFFF";
            }}>
              {time}
            </button>
          )}
        </div>
      </div>

      {/* See Events & Info — full-width footer with subtle grey background,
          matching the Popular clubs / Trending events footers + the
          SearchBar's selected-state track for cross-section consistency. */}
      <button onClick={(e) => {e.stopPropagation();onOpenClub && onOpenClub(v.id);}} style={{
        marginTop: "auto",
        padding: "12px 16px",
        border: 0,
        borderTopWidth: 1, borderTopStyle: "solid", borderTopColor: "#E9EBEC",
        background: "#F4F5F6",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        fontFamily: "inherit", fontSize: 13, fontWeight: 600, color: "#0F1214",
        cursor: "pointer",
        transition: "background 120ms",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "#E9EBEC"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "#F4F5F6"; }}>
        See Events & Info
        <Icon name="ArrowRight" size={14} strokeWidth={2} color="#0F1214" />
      </button>
    </div>);

}

// ---- CustomizeReservationModal ----
// Pre-filled with the picked slot as a "template reservation" — every field
// is editable before confirming. Mirrors the modal density of the rest of
// the page: full-width sheet on mobile, centered card on desktop.
function CustomizeReservationModal({ slot, theme, defaultPlayers, defaultDay, onClose }) {
  const t = theme.t || {};
  const v = slot.venue;
  const [duration, setDuration] = React.useState(60);
  const [court, setCourt] = React.useState("Any court");
  const [format, setFormat] = React.useState(v.sport === "Tennis" ? "Singles" : "Doubles");
  const [players, setPlayers] = React.useState(defaultPlayers || "2 Players");
  const [notes, setNotes] = React.useState("");

  // Esc closes
  React.useEffect(() => {
    const onKey = (e) => {if (e.key === "Escape") onClose();};
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: "rgba(15,18,20,.5)",
      backdropFilter: "blur(2px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24
    }}
    onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: "100%", maxWidth: 520,
        background: t.surface, borderRadius: 8,
        border: `1px solid ${t.line}`,
        boxShadow: "0 24px 60px rgba(15,18,20,.24), 0 2px 8px rgba(15,18,20,.08)",
        overflow: "hidden",
        display: "flex", flexDirection: "column",
        maxHeight: "90vh"
      }}>
        {/* Header */}
        <div style={{
          padding: "20px 24px 16px",
          borderBottom: `1px solid ${t.line}`,
          display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12
        }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.4, textTransform: "uppercase", color: theme.primary, marginBottom: 6 }}>
              Customize reservation
            </div>
            <h3 style={{ margin: 0, fontFamily: theme.display, fontWeight: 800, fontSize: 20, color: t.text, letterSpacing: -0.4, lineHeight: 1.2 }}>
              {v.name}
            </h3>
            <div style={{ marginTop: 6, fontSize: 12, color: t.textMuted, fontWeight: 500 }}>
              {defaultDay || "Today"} at <b style={{ color: t.text }}>{slot.time}</b> · {v.sport} · {v.city}
            </div>
          </div>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: 999, border: 0, background: t.surfaceSoft,
            display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
            flexShrink: 0
          }}>
            <Icon name="X" size={14} strokeWidth={2.2} color={t.textMuted} />
          </button>
        </div>

        {/* Form body */}
        <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 18, overflowY: "auto" }}>
          {/* Duration — radio chips */}
          <FormField label="Duration" theme={theme}>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {[30, 60, 90, 120].map((d) =>
              <ChipRadio key={d} on={duration === d} onClick={() => setDuration(d)} theme={theme}>
                  {d === 60 ? "1 hour" : d === 120 ? "2 hours" : `${d} min`}
                </ChipRadio>
              )}
            </div>
          </FormField>

          {/* Court */}
          <FormField label="Court preference" theme={theme}>
            <SelectInput value={court} onChange={setCourt} theme={theme} options={["Any court", "Court 1 (outdoor)", "Court 2 (outdoor)", "Court 3 (covered)", "Court 4 (covered)"]} />
          </FormField>

          {/* Format */}
          <FormField label="Format" theme={theme}>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {["Singles", "Doubles", "Mixed doubles", "Open play"].map((f) =>
              <ChipRadio key={f} on={format === f} onClick={() => setFormat(f)} theme={theme}>{f}</ChipRadio>
              )}
            </div>
          </FormField>

          {/* Players */}
          <FormField label="Players" theme={theme}>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {["1 Player", "2 Players", "3 Players", "4 Players"].map((p) =>
              <ChipRadio key={p} on={players === p} onClick={() => setPlayers(p)} theme={theme}>{p}</ChipRadio>
              )}
            </div>
          </FormField>

          {/* Notes */}
          <FormField label="Note for the club (optional)" theme={theme}>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. need ball machine, prefer covered court if rain…"
              rows={2}
              style={{
                width: "100%", padding: "10px 12px",
                background: t.surfaceSoft, border: `1px solid ${t.line}`, borderRadius: 8,
                fontFamily: "inherit", fontSize: 13, color: t.text,
                resize: "vertical", outline: 0
              }} />
          </FormField>
        </div>

        {/* Footer */}
        <div style={{
          padding: "16px 24px",
          borderTop: `1px solid ${t.line}`,
          background: t.surfaceSoft,
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap"
        }}>
          <div>
            <div style={{ fontSize: 11, color: t.textSubtle, fontWeight: 500 }}>Estimated total</div>
            <div style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 18, color: t.text, marginTop: 2 }}>
              ${(duration / 60 * (v.price === "$" ? 18 : v.price === "$$" ? 32 : 48)).toFixed(0)}
              <span style={{ fontSize: 11, color: t.textMuted, fontWeight: 600, marginLeft: 6 }}>· {duration} min</span>
            </div>
          </div>
          <div style={{ display: "inline-flex", gap: 8 }}>
            <button onClick={onClose} style={{
              height: 40, padding: "0 16px", borderRadius: 999,
              border: `1px solid ${t.line}`, background: t.surface,
              color: t.text, fontFamily: "inherit", fontWeight: 700, fontSize: 13, cursor: "pointer"
            }}>Cancel</button>
            <button onClick={onClose} style={{
              height: 40, padding: "0 18px", borderRadius: 999, border: 0,
              background: theme.primary, color: "#fff",
              fontFamily: "inherit", fontWeight: 700, fontSize: 13, cursor: "pointer",
              display: "inline-flex", alignItems: "center", gap: 8
            }}>
              Confirm booking
              <Icon name="ArrowRight" size={13} strokeWidth={2.4} color="#fff" />
            </button>
          </div>
        </div>
      </div>
    </div>);

}

function FormField({ label, theme, children }) {
  const t = theme.t || {};
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 700, color: t.textMuted, letterSpacing: 0.4, textTransform: "uppercase", marginBottom: 8 }}>
        {label}
      </div>
      {children}
    </div>);

}

function ChipRadio({ on, onClick, theme, children }) {
  const t = theme.t || {};
  return (
    <button onClick={onClick} style={{
      height: 32, padding: "0 12px", borderRadius: 999,
      border: on ? `1px solid ${theme.primary}` : `1px solid ${t.line}`,
      background: on ? theme.primary : t.surface,
      color: on ? "#fff" : t.text,
      fontFamily: "inherit", fontSize: 12, fontWeight: on ? 700 : 600,
      cursor: "pointer",
      transition: "background 120ms, color 120ms, border-color 120ms"
    }}>
      {children}
    </button>);

}

function SelectInput({ value, onChange, options, theme }) {
  const t = theme.t || {};
  return (
    <div style={{ position: "relative" }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%", height: 40,
          padding: "0 36px 0 12px",
          background: t.surfaceSoft, border: `1px solid ${t.line}`, borderRadius: 8,
          fontFamily: "inherit", fontSize: 13, fontWeight: 600, color: t.text,
          appearance: "none", outline: 0, cursor: "pointer"
        }}>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
        <Icon name="ChevronDown" size={14} strokeWidth={2.2} color={t.textMuted} />
      </span>
    </div>);

}

// Expose for cross-script access
window.BookNowSegment = BookNowSegment;
window.BookNowCard = BookNowCard;
window.CustomizeReservationModal = CustomizeReservationModal;

// ---- MiniMap ----
// Decorative-but-on-brand spatial anchor. A 3:1 SVG illustration with a
// tinted "ground" plane, a few abstract road strokes, and a centered pin —
// enough to communicate "here is a place" without the weight of a real
// tile fetch. The city/state/zip rides on top as an overlay tag.
//
// Layout is seeded from the venue id so each card varies just enough that
// the row reads as several distinct places, not seven copies of the same
// graphic.
function MiniMap({ venue, theme }) {
  const t = theme.t || {};
  // Tiny string-hash → deterministic 0-1 floats so each venue has its own
  // road layout without us hand-authoring it.
  const seed = React.useMemo(() => {
    let h = 0;
    for (let i = 0; i < venue.id.length; i++) h = h * 31 + venue.id.charCodeAt(i) >>> 0;
    return h;
  }, [venue.id]);
  const r = (n) => {
    // LCG step
    let x = (seed + n * 9301 + 49297) % 233280;
    return x / 233280;
  };

  // Colors — keep the map soft so the pin + label tag remain the focal
  // points. Slight green tint to anchor it to the brand without competing
  // with the time-slot CTAs below.
  const water = theme.dark ? "#1B252A" : "#E8F0EC";
  const land = theme.dark ? "#222F35" : "#F2F6F3";
  const road = theme.dark ? "#3A4A52" : "#FFFFFF";
  const block = theme.dark ? "#1F2A30" : "#E1E9E3";

  // Generate a couple of "blocks" (faint rectangles) and "roads" (lines)
  // from the seed.
  const blocks = [
  { x: 6 + r(1) * 60, y: 6 + r(2) * 18, w: 30 + r(3) * 30, h: 14 + r(4) * 14 },
  { x: 110 + r(5) * 80, y: 38 + r(6) * 10, w: 50 + r(7) * 30, h: 18 + r(8) * 10 },
  { x: 200 + r(9) * 40, y: 8 + r(10) * 14, w: 40 + r(11) * 20, h: 18 + r(12) * 12 }];

  const yRoad1 = 30 + r(20) * 12;
  const yRoad2 = 56 + r(21) * 12;
  const xDiag = 80 + r(22) * 100;

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <svg viewBox="0 0 280 90" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: 90, background: land }}>
        {/* a subtle "water" wedge on one edge so the map reads as a real
                place rather than a uniform plate */}
        <path d={`M 0 ${60 + r(30) * 20} Q 60 ${50 + r(31) * 30} 140 ${70 + r(32) * 15} T 280 ${75 + r(33) * 10} L 280 90 L 0 90 Z`} fill={water} opacity="0.65" />

        {/* faint block shapes */}
        {blocks.map((b, i) =>
        <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} fill={block} rx="2" />
        )}

        {/* roads — two horizontals + one diagonal, white strokes */}
        <line x1="0" y1={yRoad1} x2="280" y2={yRoad1} stroke={road} strokeWidth="3" />
        <line x1="0" y1={yRoad2} x2="280" y2={yRoad2} stroke={road} strokeWidth="2.4" />
        <line x1={xDiag - 40} y1="0" x2={xDiag + 40} y2="90" stroke={road} strokeWidth="2.4" />

        {/* center pin */}
        <g transform="translate(140 50)">
          <ellipse cx="0" cy="14" rx="7" ry="2" fill="rgba(15,18,20,.18)" />
          <path d="M 0 -12 C -7 -12 -12 -7 -12 0 C -12 8 0 16 0 16 C 0 16 12 8 12 0 C 12 -7 7 -12 0 -12 Z" fill={theme.primary} stroke="#fff" strokeWidth="1.5" />
          <circle cx="0" cy="-1" r="3.5" fill="#fff" />
        </g>
      </svg>

      {/* Top-left distance pill — anchored to where players sit relative to
          the club. Falls back to city/state/zip if no distance is provided
          so the legacy callers still render. */}
      <span style={{
        position: "absolute", top: 10, left: 10,
        display: "inline-flex", alignItems: "center",
        height: 24, padding: "0 10px", borderRadius: 6,
        background: "#FFFFFF",
        color: "#0F1214",
        fontSize: 11, fontWeight: 700,
        boxShadow: "0 1px 3px rgba(15,18,20,.12)",
        whiteSpace: "nowrap",
      }}>
        {venue.distance != null ? `${venue.distance}mi` : `${venue.city}, ${venue.state} ${venue.zip}`}
      </span>
      {/* Top-right active-players pill — green badge with a pulse dot, matches
          the "X Active" pattern from the target. Only renders when the venue
          carries an `activePlayers` count. */}
      {venue.activePlayers != null && (
        <span style={{
          position: "absolute", top: 10, right: 10,
          display: "inline-flex", alignItems: "center", gap: 6,
          height: 24, padding: "0 10px 0 8px", borderRadius: 999,
          background: "#1F8C5A",
          color: "#FFFFFF",
          fontSize: 11, fontWeight: 700,
          boxShadow: "0 1px 3px rgba(15,18,20,.12)",
          whiteSpace: "nowrap",
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: 999, background: "#FFFFFF", flexShrink: 0,
          }} />
          {venue.activePlayers} Active
        </span>
      )}
    </div>);

}