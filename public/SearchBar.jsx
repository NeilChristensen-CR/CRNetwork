// SearchBar.jsx — Network discovery search pill
// ----------------------------------------------------------------------------
// Airbnb-style 4-segment pill (WHERE / WHAT / WHEN / WHO) with a circular
// submit button on the right. Six interactive states:
//
//   1. Default              — unified white pill, no segment highlighted
//   2. Hover (per segment)  — subtle gray fill on the hovered segment
//   3. WHERE focused        — track turns gray; WHERE lifts as a white pill
//                              + popover with city list opens below it
//   4. WHAT focused         — same lift; popover with sport list
//   5. WHEN focused         — same lift; popover with date/time options
//   6. WHO focused          — same lift; popover with player stepper; AND
//                              the submit button expands to a labeled pill
//
// Mounted in the page hero on the logged-out CourtReserve home (and inside
// ChromeBar on logged-in surfaces) so a single discovery affordance lives at
// the top of every screen.
// ----------------------------------------------------------------------------

const { useState: useStateSB, useRef: useRefSB, useEffect: useEffectSB } = React;

// ---- Popover options ------------------------------------------------------
// Static option lists — kept in this file so the SearchBar is self-contained
// and doesn't depend on neighboring modules to render.
const SB_LOCATIONS = [
  "Current location",
  "Oakland, CA",
  "San Francisco, CA",
  "Berkeley, CA",
  "St. Augustine, FL",
  "Jacksonville, FL",
  "Vilano Beach, FL",
  "Ponte Vedra, FL",
];

// Type-ahead corpus for the WHERE segment. Each entry has a `kind` that
// drives the row icon + label, a primary `name` (what becomes the value
// when picked), and a secondary `sub` line for disambiguation. The filter
// matches against name + sub so a user can type "32084" to find any club
// or city that resolves to that zip.
const SB_WHERE_SUGGESTIONS = [
  // Clubs — `distance` is rendered alongside the city on mobile rows
  // so the user sees how far each match is from them at a glance.
  { kind: "club", name: "Old Coast Pickleball",       sub: "St. Augustine, FL · 32084",      distance: "2.1" },
  { kind: "club", name: "Anastasia Tennis Club",      sub: "St. Augustine, FL · 32080",      distance: "2.4" },
  { kind: "club", name: "Vilano Beach Racquet",       sub: "Vilano Beach, FL · 32084",       distance: "2.6" },
  { kind: "club", name: "Dill Dinkers Jacksonville",  sub: "Jacksonville, FL · 32256",       distance: "8.4" },
  { kind: "club", name: "Treaty Park Tennis",         sub: "St. Augustine, FL · 32084",      distance: "3.2" },
  { kind: "club", name: "South St. Augustine",        sub: "St. Augustine, FL · 32086",      distance: "3.6" },
  { kind: "club", name: "The Hub Padel",              sub: "Jacksonville Beach, FL · 32250", distance: "5.1" },
  { kind: "club", name: "World Golf Village Tennis",  sub: "St. Augustine, FL · 32092",      distance: "6.8" },
  // Cities
  { kind: "city", name: "Oakland, CA",                sub: "Alameda County" },
  { kind: "city", name: "San Francisco, CA",          sub: "Bay Area" },
  { kind: "city", name: "Berkeley, CA",               sub: "Alameda County" },
  { kind: "city", name: "St. Augustine, FL",          sub: "St. Johns County" },
  { kind: "city", name: "Jacksonville, FL",           sub: "Duval County" },
  { kind: "city", name: "Vilano Beach, FL",           sub: "St. Johns County" },
  { kind: "city", name: "Ponte Vedra, FL",            sub: "St. Johns County" },
  { kind: "city", name: "Jacksonville Beach, FL",     sub: "Duval County" },
  // Zip codes
  { kind: "zip", name: "94609",                       sub: "Oakland, CA" },
  { kind: "zip", name: "94110",                       sub: "San Francisco, CA" },
  { kind: "zip", name: "94704",                       sub: "Berkeley, CA" },
  { kind: "zip", name: "32084",                       sub: "St. Augustine, FL" },
  { kind: "zip", name: "32080",                       sub: "St. Augustine, FL" },
  { kind: "zip", name: "32086",                       sub: "St. Augustine, FL" },
  { kind: "zip", name: "32092",                       sub: "St. Augustine, FL" },
  { kind: "zip", name: "32250",                       sub: "Jacksonville Beach, FL" },
  { kind: "zip", name: "32256",                       sub: "Jacksonville, FL" },
];

// Icon name + label noun for each suggestion kind.
const SB_WHERE_KIND_ICON = { club: "Building2", city: "MapPin", zip: "Hash" };

// Case-insensitive filter — query matches if it appears in name OR sub.
// Returns up to `limit` results so the popover doesn't balloon.
function filterWhereSuggestions(query, limit = 8) {
  const q = (query || "").trim().toLowerCase();
  if (!q) return SB_WHERE_SUGGESTIONS.slice(0, limit);
  const out = [];
  for (const s of SB_WHERE_SUGGESTIONS) {
    if (s.name.toLowerCase().includes(q) || s.sub.toLowerCase().includes(q)) {
      out.push(s);
      if (out.length >= limit) break;
    }
  }
  return out;
}
const SB_SPORTS = [
  { id: "Any Sport",   icon: "LayoutGrid" },
  { id: "Pickleball",  icon: "Hexagon" },
  { id: "Tennis",      icon: "Circle" },
  { id: "Padel",       icon: "Square" },
  { id: "Badminton",   icon: "Feather" },
  { id: "Platform Tennis", icon: "Grid3X3" },
];
const SB_WHEN_OPTIONS = [
  { id: "Any day",      label: "Any day" },
  { id: "Today",        label: "Today" },
  { id: "Tomorrow",     label: "Tomorrow" },
  { id: "This weekend", label: "This weekend" },
  { id: "Next 7 days",  label: "Next 7 days" },
];
const SB_WHEN_TIME_BUCKETS = [
  { id: "Any time",  sub: "Whenever you can play" },
  { id: "Morning",   sub: "6 AM – 12 PM" },
  { id: "Afternoon", sub: "12 PM – 5 PM" },
  { id: "Evening",   sub: "5 PM – 10 PM" },
];

// Rich club dataset for the search-results modal/sheet. Shape matches
// what BookNowCard expects so the desktop modal can render the full
// "club card" UI from the logged-out home (MiniMap header, sport tag,
// booked count, 2x2 time slots, "See Events & Info" footer).
const SB_RESULTS_CLUBS = [
  { id: "old-coast",      name: "Old Coast Pickleball",      city: "St. Augustine",      state: "FL", sport: "Pickleball", booked: 23, distance: "2.1", times: ["9:00 AM", "9:30 AM", "10:00 AM", "11:30 AM"] },
  { id: "anastasia",      name: "Anastasia Tennis Club",     city: "St. Augustine",      state: "FL", sport: "Tennis",     booked: 14, distance: "2.4", times: ["8:00 AM", "8:30 AM", "12:00 PM",  "2:00 PM"] },
  { id: "vilano-beach",   name: "Vilano Beach Racquet",      city: "Vilano Beach",       state: "FL", sport: "Tennis",     booked: 41, distance: "2.6", times: ["10:00 AM", "10:30 AM", "11:00 AM", "12:30 PM"] },
  { id: "dill-dinkers",   name: "Dill Dinkers Jacksonville", city: "Jacksonville",       state: "FL", sport: "Pickleball", booked: 18, distance: "8.4", times: ["8:00 AM", "12:00 PM", "2:30 PM", "4:00 PM"] },
  { id: "treaty-park",    name: "Treaty Park Tennis",        city: "St. Augustine",      state: "FL", sport: "Tennis",     booked: 9,  distance: "3.2", times: ["7:00 AM", "9:00 AM", "3:00 PM", "5:30 PM"] },
  { id: "south-st-aug",   name: "South St. Augustine",       city: "St. Augustine",      state: "FL", sport: "Pickleball", booked: 27, distance: "3.6", times: ["8:30 AM", "11:00 AM", "1:30 PM", "4:30 PM"] },
  { id: "the-hub-padel",  name: "The Hub Padel",             city: "Jacksonville Beach", state: "FL", sport: "Padel",      booked: 12, distance: "5.1", times: ["9:00 AM", "10:30 AM", "1:00 PM", "6:00 PM"] },
  { id: "world-golf",     name: "World Golf Village Tennis", city: "St. Augustine",      state: "FL", sport: "Tennis",     booked: 31, distance: "6.8", times: ["7:30 AM", "9:00 AM", "2:00 PM", "6:30 PM"] },
];

// ---- Stars helper ---------------------------------------------------------
// (Currently unused but ready for future enhancements like recently-played-at
// suggestions in the WHERE popover.)

// ---- Hover-aware segment shell -------------------------------------------
// Tracks its own hover state so we can apply a subtle background fill without
// pushing parent re-renders. Forwarded to the SearchBar's Segment via render
// prop so popovers can anchor to the same ref.
function SBHoverable({ children, onMouseEnter, onMouseLeave, style, ...rest }) {
  const [hover, setHover] = useStateSB(false);
  return (
    <div
      onMouseEnter={(e) => { setHover(true); onMouseEnter && onMouseEnter(e); }}
      onMouseLeave={(e) => { setHover(false); onMouseLeave && onMouseLeave(e); }}
      data-hover={hover ? "true" : "false"}
      style={style}
      {...rest}
    >
      {typeof children === "function" ? children(hover) : children}
    </div>
  );
}

// ---- Popover shell --------------------------------------------------------
// Anchored to a segment, opens below the bar with a soft drop-shadow and a
// fade-in. Defaults to matching the anchor segment's width so each popover
// sits directly under its trigger. Callers can override with `width` (and
// `minWidth` / `maxWidth` clamps still apply when matching) for popovers
// whose content needs different breathing room.
function SBPopover({ anchorRef, width = "match", minWidth = 220, maxWidth = 360, children }) {
  const [pos, setPos] = useStateSB({ top: 0, left: 0, w: 280 });
  useEffectSB(() => {
    const update = () => {
      const a = anchorRef && anchorRef.current;
      if (!a) return;
      const r = a.getBoundingClientRect();
      const containerRect = a.closest("[data-searchbar-root]")?.getBoundingClientRect() || { left: 0, top: 0 };
      setPos({
        top: r.bottom - containerRect.top + 10,
        left: r.left - containerRect.left,
        w: r.width,
      });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [anchorRef]);
  const resolvedWidth = width === "match"
    ? Math.min(maxWidth, Math.max(minWidth, pos.w))
    : width;
  return (
    <div
      role="dialog"
      style={{
        position: "absolute",
        top: pos.top,
        left: pos.left,
        width: resolvedWidth,
        background: "var(--pp-bg-default)",
        borderRadius: 16,
        boxShadow: "0 12px 40px rgba(15,18,20,.14), 0 2px 8px rgba(15,18,20,.06)",
        border: "1px solid rgba(15,18,20,.06)",
        padding: 8,
        zIndex: 80,
        fontFamily: "Inter, system-ui, sans-serif",
        animation: "sbPopIn 180ms cubic-bezier(.2,.8,.2,1)",
      }}
    >
      <style>{`
        @keyframes sbPopIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
      {children}
    </div>
  );
}

// Generic row used inside popovers — left icon + label + optional selected
// dot on the right. Hover background. Click handler comes from parent.
function SBRow({ icon, label, sub, selected, onClick }) {
  const [hover, setHover] = useStateSB(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 12px",
        borderRadius: 10,
        border: 0,
        background: hover || selected ? "var(--pp-bg-subtle)" : "transparent",
        cursor: "pointer",
        fontFamily: "inherit",
        textAlign: "left",
        transition: "background 120ms",
      }}
    >
      {icon && window.Icon && (
        <span style={{ display: "inline-flex", flexShrink: 0 }}>
          <window.Icon name={icon} size={16} strokeWidth={2} color="var(--pp-fg-default)" />
        </span>
      )}
      <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={{ fontSize: 13, fontWeight: selected ? 700 : 500, color: "var(--pp-fg-default)", lineHeight: 1.2 }}>
          {label}
        </span>
        {sub && (
          <span style={{ fontSize: 11, color: "var(--pp-fg-muted)", lineHeight: 1.2 }}>{sub}</span>
        )}
      </span>
      {selected && (
        <span style={{ width: 6, height: 6, borderRadius: 999, background: "var(--pp-fg-default)", flexShrink: 0 }} />
      )}
    </button>
  );
}

// Stepper used in the WHO popover — minus / count / plus.
function SBStepper({ value, min = 1, max = 8, onChange, label }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 14px",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--pp-fg-default)" }}>{label}</span>
        <span style={{ fontSize: 11, color: "var(--pp-fg-muted)" }}>Including you</span>
      </div>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onChange(Math.max(min, value - 1)); }}
          disabled={value <= min}
          aria-label="Decrement"
          style={{
            width: 30, height: 30, borderRadius: 999,
            border: "1px solid var(--pp-border-default)", background: "var(--pp-bg-default)",
            color: value <= min ? "var(--pp-fg-subtle)" : "var(--pp-fg-default)",
            cursor: value <= min ? "not-allowed" : "pointer",
            fontSize: 16, lineHeight: 1, fontFamily: "inherit",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
          }}
        >−</button>
        <span style={{ minWidth: 18, textAlign: "center", fontWeight: 700, fontSize: 14, color: "var(--pp-fg-default)", fontVariantNumeric: "tabular-nums" }}>{value}</span>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onChange(Math.min(max, value + 1)); }}
          disabled={value >= max}
          aria-label="Increment"
          style={{
            width: 30, height: 30, borderRadius: 999,
            border: "1px solid var(--pp-border-default)", background: "var(--pp-bg-default)",
            color: value >= max ? "var(--pp-fg-subtle)" : "var(--pp-fg-default)",
            cursor: value >= max ? "not-allowed" : "pointer",
            fontSize: 16, lineHeight: 1, fontFamily: "inherit",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
          }}
        >+</button>
      </div>
    </div>
  );
}

// ---- Main SearchBar -------------------------------------------------------
function SearchBar({ theme, viewport = "desktop", values, onChange, onSubmit }) {
  const desktop = viewport === "desktop";

  // Controlled-or-uncontrolled — callers can pass `values` to drive the bar;
  // otherwise the bar keeps its own state with sensible defaults that match
  // the mock copy.
  const [internal, setInternal] = useStateSB({
    where: "Oakland, CA",
    // WHAT is now a multiselect — `activities` is the source of truth
    // (array of sport ids) and `activity` is the derived display
    // string the rest of the page reads. Empty array == "Any Sport".
    activities: [],
    activity: "Any Sport",
    // WHEN is two-dimensional — `whenDay` and `whenTime` track each
    // sub-facet independently so the user can pick both; `when` is the
    // combined display string the rest of the page reads.
    whenDay: "Any day",
    whenTime: "Any time",
    when: "Any day · Any time",
    who: "1 Player",
    whoCount: 1,
  });
  const v = values || internal;
  // Per-segment "touched" tracker. Until a user picks a value the segment
  // renders its placeholder text in grey (watermark style). Once selected,
  // the value renders in normal dark text.
  const [touched, setTouched] = useStateSB({ where: false, activity: false, when: false, who: false });
  const setValue = (key, val) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
    if (values && onChange) onChange({ ...values, [key]: val });
    else setInternal((prev) => ({ ...prev, [key]: val }));
  };
  // Multi-key update so the WHEN popover can write both whenDay/whenTime
  // and the combined `when` display string in a single onChange — avoids
  // stale-closure clobber when each row commits.
  const setValues = (updates) => {
    setTouched((prev) => {
      const next = { ...prev };
      Object.keys(updates).forEach((k) => {
        // Touch the parent facet ("when") whenever any of its
        // sub-facets are written through.
        if (k === "whenDay" || k === "whenTime") next.when = true;
        else next[k] = true;
      });
      return next;
    });
    if (values && onChange) onChange({ ...values, ...updates });
    else setInternal((prev) => ({ ...prev, ...updates }));
  };

  // WHAT multiselect — derive the user-visible display string from
  // the activities array. Three rules:
  //   0 selected → "Any Sport" (everything matches)
  //   1 selected → the sport name ("Pickleball")
  //   2 selected → comma-joined ("Pickleball, Tennis")
  //   3+ selected → count summary ("3 sports")
  const activityDisplay = (arr) => {
    if (!arr || arr.length === 0) return "Any Sport";
    if (arr.length === 1) return arr[0];
    if (arr.length === 2) return arr.join(", ");
    return `${arr.length} sports`;
  };
  // Toggle a sport in/out of v.activities. "Any Sport" is a sentinel
  // that clears the multiselect back to the empty (all) state.
  const toggleActivity = (sportId) => {
    if (sportId === "Any Sport") {
      setValues({ activities: [], activity: "Any Sport" });
      return;
    }
    const current = Array.isArray(v.activities) ? v.activities : [];
    const next = current.includes(sportId)
      ? current.filter((s) => s !== sportId)
      : [...current, sportId];
    setValues({ activities: next, activity: activityDisplay(next) });
  };

  // Placeholder copy per segment — shown until the user selects something.
  // Where placeholder is "Location, City, Zip Code" per spec; the others
  // double as their natural defaults so the prompt reads as a guide.
  const PLACEHOLDERS = {
    where: "Location, City, Zip Code",
    activity: "Any Sport",
    when: "Any Day • Any Time",
    who: "1 Player",
  };

  // Which segment is currently focused. `null` = default state.
  const [active, setActive] = useStateSB(null);

  // Desktop results modal — opens after the user taps Search. Mirrors
  // the mobile flow: filter values are committed first, then the user
  // picks a club from a modal listing matched clubs, then we route into
  // the booking flow.
  const [resultsOpen, setResultsOpen] = useStateSB(false);
  // Expose a global opener so non-SearchBar triggers (the bottom action
  // bar's "Find an Event", trending event card arrows, etc) can route
  // through the same modal instead of jumping straight to the booking
  // flow. Cleared on unmount.
  useEffectSB(() => {
    if (!desktop) return;
    window.__openResultsModal = () => setResultsOpen(true);
    return () => { if (window.__openResultsModal) delete window.__openResultsModal; };
  }, [desktop]);
  const containerRef = useRefSB(null);

  // Type-ahead state for the WHERE segment. The query is the user's
  // in-progress text; the committed value lives in v.where.
  const [whereQuery, setWhereQuery] = useStateSB("");
  const whereInputRef = useRefSB(null);
  // When the WHERE popover opens, seed the query with the current value
  // (so the user sees what they last picked + can edit) and focus the
  // input. Reset on close.
  useEffectSB(() => {
    if (active === "where") {
      setWhereQuery(touched.where ? v.where : "");
      // Defer focus until the popover has actually rendered.
      const t = setTimeout(() => { whereInputRef.current && whereInputRef.current.focus(); }, 50);
      return () => clearTimeout(t);
    }
    setWhereQuery("");
  }, [active]);

  // Refs for each segment so popovers can anchor + position to them.
  const whereRef    = useRefSB(null);
  const activityRef = useRefSB(null);
  const whenRef     = useRefSB(null);
  const whoRef      = useRefSB(null);
  const refByKey = { where: whereRef, activity: activityRef, when: whenRef, who: whoRef };

  // Click-outside collapses the focused segment back to default.
  useEffectSB(() => {
    if (!active) return;
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setActive(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [active]);

  // Escape closes the popover.
  useEffectSB(() => {
    if (!active) return;
    const onKey = (e) => { if (e.key === "Escape") setActive(null); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [active]);

  // ---- Color tokens ------------------------------------------------------
  // trackBg uses the design system's surfaceSoft tone (#F4F5F6) so the
  // selected-state recede is subtle — segments still stand out as lifted
  // white pills, but the surrounding track no longer looks heavy.
  // Tokens here are aligned to the Figma px.club SearchBar spec
  // (node 8059-57624). The focused track uses #EDF3F3 (system/bg/default/
  // primary), label takes the secondary text token #4B5052, value uses
  // #0F1214 (inputs/neutral/fg/default), and the submit pill takes the
  // buttons/primary/bg/default token #222424 — slightly lighter than
  // pure black so it reads as a soft dark capsule.
  const COLORS = {
    pillBg:        "var(--pp-bg-default)",
    trackBg:       "var(--pp-bg-muted)",
    focusBg:       "var(--pp-bg-default)",
    hoverBg:       "rgba(15,18,20,.04)",  // unfocused-segment hover fill
    label:         "var(--pp-fg-muted)",
    value:         "var(--pp-fg-default)",
    divider:       "var(--pp-border-subtle)",              // visible 1px segment dividers
    arrowAccent:   "#5B7CFA",
    submitBg:      "var(--pp-bg-inverse)",
    submitFg:      "var(--pp-bg-default)",
    border:        "var(--pp-border-subtle)",
  };

  // ---- Geometry ----------------------------------------------------------
  // Static bar height — all 4 segments are equal width and live inside a
  // container with 8px padding all around and 8px gap between them. WHO
  // is treated as one segment that contains the search submit button on
  // its right side, so no segment reserves extra space outside itself.
  // Interior padding is 24px horizontal and 12px vertical, except WHO
  // shrinks its right padding to 12px to match the circle button's top /
  // bottom insets.
  // Container padding stays 8px (the user-spec outer gutter) so the bar's
  // overall height = segH (64) + pad*2 (16) = 80. Each segment ends up at
  // a clean 64 internal height.
  // Per Figma spec — label is `overline` (10/0.8 ls, lh 12), value is `p1
  // medium` (16/0 ls, lh 24). Mobile drops one notch on each (9/0.7 ls,
  // 14/0 ls) so the bar still fits within a 360px column without crushing
  // the value text.
  // Per the updated Figma spec (revisited node 8059-57624), each segment
  // wrapper has only 4px padding (vs the 8px first pass) — the bar reads
  // tighter and the lifted-pill focus state sits closer to its neighbors.
  // Container height shrinks accordingly: segH 60 (=12+24-text+12+4*2) →
  // overall pillH 68 desktop.
  const SIZES = desktop
    ? { pillH: 68, pad: 4, gap: 0,
        segPadX: 24, segPadY: 12, whoPadRight: 8,
        segGapY: 4, labelFs: 10, labelLs: 0.8,
        // Submit button: 40h circle (was 32) — the smaller iconly state
        // was reading as a control accessory rather than the primary
        // hero action. Expanded width 120 leaves room for the "Search"
        // label + 16px icon + p-12 horizontal padding without crowding.
        valueFs: 16, btn: 40, btnExpW: 120, radius: 999 }
    : { pillH: 64, pad: 4, gap: 0,
        segPadX: 16, segPadY: 10, whoPadRight: 8,
        segGapY: 3, labelFs: 9, labelLs: 0.7,
        valueFs: 14, btn: 36, btnExpW: 104, radius: 999 };
  const pillH = SIZES.pillH;

  // ---- Segments ----------------------------------------------------------
  // `display` resolves to the placeholder when the segment hasn't been
  // touched yet; the watermark color is applied at render time.
  const segments = [
    { key: "where",    label: "WHERE",    value: v.where,    display: touched.where    ? v.where    : PLACEHOLDERS.where,    icon: "Navigation", anchorRef: whereRef },
    { key: "activity", label: "WHAT",     value: v.activity, display: touched.activity ? v.activity : PLACEHOLDERS.activity, icon: null,         anchorRef: activityRef },
    { key: "when",     label: "WHEN",     value: v.when,     display: touched.when     ? v.when     : PLACEHOLDERS.when,     icon: null,         anchorRef: whenRef },
    { key: "who",      label: "WHO",      value: v.who,      display: touched.who      ? v.who      : PLACEHOLDERS.who,      icon: null,         anchorRef: whoRef },
  ];

  // Track background flips to the mint surfaceSoft tone (#EDF3F3) once any
  // segment is focused — matches the Figma spec's `bg/default/primary`
  // token. The unfocused track is plain white with the buttons/primary
  // elevation/200 shadow (0/2/4 alpha 8) — no border. Focused state adds
  // a subtle inset white highlight per the spec's elevation/subtle/inset
  // recipe so the mint track reads as a frame around the lifted pill.
  const trackBg = active ? COLORS.trackBg : COLORS.pillBg;
  const trackShadow = active
    ? "inset 0 1px 0 rgba(255,255,255,.12), inset 0 1px 1px rgba(0,0,0,.08)"
    : "0 2px 4px rgba(0,0,0,.08)";

  // ---- Search submit button (lives inside the WHO segment) ---------------
  // Default state: 40px dark capsule with a search icon. When WHO is the
  // focused segment, the button rolls out horizontally to a 112px pill
  // with "Search" label + ArrowRight icon. Stays fully rounded (999) in
  // both states — capsule throughout, never a rectangle.
  const renderSubmit = (expanded) => (
    <button
      type="button"
      aria-label="Search"
      onClick={(e) => {
        e.stopPropagation();
        // Desktop: tapping Search opens the results modal (user picks a
        // club, then the parent's onSubmit fires to route into booking).
        // Mobile bar (rare — mobile uses SearchBarCompact instead) falls
        // back to the parent's onSubmit immediately.
        if (desktop) {
          // Stash the committed filter set so the booking flow can
          // pick it up after the user selects a club.
          window.__searchPrefill = {
            where: v.where || null,
            sport: v.activity || null,
            whenDay: v.whenDay || null,
            whenTime: v.whenTime || null,
            players: v.whoCount || 1,
          };
          setResultsOpen(true);
        } else {
          onSubmit && onSubmit(v);
        }
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "var(--pp-bg-inverse)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = COLORS.submitBg; }}
      style={{
        // Submit button matches the Figma spec's p-8 + min-w-72
        // recipe — 8px padding all sides, 16px icon glyph, so unfocused
        // state is 32×32 with a 72px min-width that only applies once
        // the "Search" label rolls out. Stays fully rounded (999).
        height: SIZES.btn,
        width: expanded ? SIZES.btnExpW : SIZES.btn,
        borderRadius: SIZES.radius,
        background: COLORS.submitBg,
        color: COLORS.submitFg,
        border: 0,
        padding: expanded ? "0 12px" : 0,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        cursor: "pointer",
        flexShrink: 0,
        // elevation/200 (buttons): 0 2px 4px alpha 8.
        boxShadow: "0 2px 4px rgba(0,0,0,.08)",
        fontFamily: "Inter, system-ui, sans-serif",
        // Per Figma label is p3/medium = 13/0.2 ls / 16 lh.
        fontWeight: 500,
        fontSize: 13,
        letterSpacing: 0.2,
        whiteSpace: "nowrap",
        overflow: "hidden",
        transition: "background 160ms ease, width 220ms cubic-bezier(.2,.8,.2,1), padding 220ms ease",
      }}
    >
      {window.Icon && (
        <window.Icon name="Search" size={16} strokeWidth={2} color={COLORS.submitFg} />
      )}
      {expanded && <span>Search</span>}
    </button>
  );

  // ---- Segment renderer --------------------------------------------------
  // All 4 segments are sized identically via flex: 1 1 0 + min-width: 0 and
  // never change their dimensions when interacted with. The focus state only
  // changes the segment's background + shadow (lifted white pill); nothing
  // about the layout shifts.
  //
  // Special case: when WHO is focused, its lifted pill VISUALLY extends to
  // wrap around the submit button (so the button reads as encapsulated by
  // the WHO container). That extension is drawn as an absolute child that
  // overhangs the segment's right edge into the bar's reserved submit area
  // — it doesn't change WHO's own flex width.
  const Segment = ({ seg, focused, isWho, isLast }) => {
    const onClick = (e) => { e.stopPropagation(); setActive(focused ? null : seg.key); };
    // WHO has asymmetric padding (12px right vs 24px elsewhere) because
    // the right side is occupied by the submit circle button; matching its
    // 12px top / bottom insets keeps the button perfectly centered with
    // equal breathing room on three sides.
    const padding = isWho
      ? `${SIZES.segPadY}px ${SIZES.whoPadRight}px ${SIZES.segPadY}px ${SIZES.segPadX}px`
      : `${SIZES.segPadY}px ${SIZES.segPadX}px`;
    return (
      <SBHoverable
        style={{
          position: "relative",
          flex: "1 1 0",
          minWidth: 0,
          display: "flex",
          // Segment dividers — 1px vertical line between segments, matching
          // Figma spec. The last segment (WHO) skips the border so the bar
          // doesn't render a trailing line into the submit area.
          borderRight: isLast ? "none" : `1px solid ${COLORS.divider}`,
          // Each segment owns 8px of inner padding (Figma "1/interactive"
          // wrapper) so its lifted-white-pill state has breathing room
          // before the divider.
          padding: SIZES.pad,
          boxSizing: "border-box",
        }}
      >
        {(hover) => (
          <div
            ref={seg.anchorRef}
            role="button"
            tabIndex={0}
            aria-expanded={focused}
            onClick={onClick}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(e); } }}
            style={{
              position: "relative",
              flex: "1 1 0",
              minWidth: 0,
              borderRadius: SIZES.radius,
              padding,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              cursor: "pointer",
              background: focused
                ? COLORS.focusBg
                : hover
                  ? COLORS.hoverBg
                  : "transparent",
              // Focused-segment elevation matches the bar's own
              // elevation/200 token (0 2px 4px alpha 8) so the lifted
              // pill reads as the same material as the bar, not a heavier
              // popover on top of it.
              boxShadow: focused
                ? "0 2px 4px rgba(0,0,0,.08)"
                : "none",
              transition: "background 160ms ease, box-shadow 200ms ease",
            }}
          >
            {/* Text stack (label + value, vertically stacked) — sits on the
                left of the segment. For non-WHO segments it spans the full
                width; for WHO it shares the row with the submit button on
                the right. */}
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: SIZES.segGapY, minWidth: 0, flex: 1 }}>
              <div
                style={{
                  fontFamily: "Axiforma, Inter, system-ui, sans-serif",
                  fontWeight: 800,
                  fontSize: SIZES.labelFs,
                  letterSpacing: SIZES.labelLs,
                  textTransform: "uppercase",
                  color: COLORS.label,
                  lineHeight: 1,
                }}
              >
                {seg.label}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontFamily: "Inter, system-ui, sans-serif",
                  // Untouched segments render with a lighter weight + grey
                  // watermark color; once touched they jump to the
                  // selected-value style.
                  fontWeight: touched[seg.key] ? 600 : 500,
                  fontSize: SIZES.valueFs,
                  color: touched[seg.key] ? COLORS.value : COLORS.label,
                  lineHeight: 1.2,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", flex: 1, minWidth: 0 }}>{seg.display}</span>
                {/* Per Figma, the trailing icon (WHERE only) lives at the
                    value-row level inside a 20px box at the right edge of
                    the segment — same size as the WHO submit button glyph
                    so the two right-side affordances feel paired. */}
                {seg.icon && window.Icon && (
                  <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 20, height: 20, flexShrink: 0, color: COLORS.arrowAccent }}>
                    <window.Icon name={seg.icon} size={16} strokeWidth={2} color={COLORS.arrowAccent} />
                  </span>
                )}
              </div>
            </div>
            {/* WHO segment also contains the search submit button on its
                right side. When WHO is focused the button expands to show
                "Search" + icon CONTAINED inside the dark pill — no separate
                external label. */}
            {isWho && (
              <div onClick={(e) => e.stopPropagation()}>
                {renderSubmit(focused)}
              </div>
            )}
          </div>
        )}
      </SBHoverable>
    );
  };

  // ---- Popovers ---------------------------------------------------------
  const renderPopover = () => {
    if (!active) return null;
    const anchorRef = refByKey[active];
    if (active === "where") {
      const matches = filterWhereSuggestions(whereQuery);
      const commit = (val) => { setValue("where", val); setActive(null); };
      return (
        <SBPopover anchorRef={anchorRef} minWidth={320}>
          {/* Type-ahead input — anchored at the top of the popover, gets
              focus on open. Free-text Enter commits whatever's typed; an
              arrow key flow / explicit picks come from the rows below. */}
          <div style={{ padding: "6px 10px 8px" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "0 12px",
              height: 40, borderRadius: 10,
              border: "1px solid var(--pp-border-subtle)",
              background: "var(--pp-bg-default)",
            }}>
              <window.Icon name="Search" size={14} strokeWidth={2} color="var(--pp-fg-muted)" />
              <input
                ref={whereInputRef}
                type="text"
                value={whereQuery}
                onChange={(e) => setWhereQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (matches[0]) commit(matches[0].name);
                    else if (whereQuery.trim()) commit(whereQuery.trim());
                  }
                  if (e.key === "Escape") { setActive(null); }
                }}
                placeholder="Club, city, or zip"
                aria-label="Search location"
                style={{
                  flex: 1, minWidth: 0,
                  border: 0, outline: "none", background: "transparent",
                  fontFamily: "inherit", fontSize: 14, color: "var(--pp-fg-default)",
                }}
              />
              {whereQuery && (
                <button
                  type="button"
                  onClick={() => { setWhereQuery(""); whereInputRef.current && whereInputRef.current.focus(); }}
                  aria-label="Clear"
                  style={{
                    width: 20, height: 20, borderRadius: 999, border: 0,
                    background: "var(--pp-bg-subtle)", cursor: "pointer",
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <window.Icon name="X" size={12} strokeWidth={2.4} color="var(--pp-fg-muted)" />
                </button>
              )}
            </div>
          </div>

          {/* Always-on "Use current location" affordance, sits above results. */}
          <SBRow
            icon="Navigation"
            label="Use current location"
            selected={v.where === "Current location"}
            onClick={() => commit("Current location")}
          />

          {/* Section divider */}
          <div style={{ height: 1, background: "var(--pp-bg-subtle)", margin: "4px 12px" }} />

          {matches.length === 0 ? (
            <div style={{ padding: "12px 14px", fontSize: 12.5, color: "var(--pp-fg-subtle)" }}>
              No matches for "{whereQuery}"
            </div>
          ) : (
            matches.map((s) => (
              <SBRow
                key={`${s.kind}-${s.name}`}
                icon={SB_WHERE_KIND_ICON[s.kind] || "MapPin"}
                label={s.name}
                sub={s.sub}
                selected={touched.where && v.where === s.name}
                onClick={() => commit(s.name)}
              />
            ))
          )}
        </SBPopover>
      );
    }
    if (active === "activity") {
      // Multiselect — each row toggles its sport in/out of v.activities.
      // Popover stays OPEN so the user can pick multiple before closing.
      // "Any Sport" acts as a clear-all sentinel: selecting it empties
      // the array (and is shown as selected when the array is empty).
      const selectedSet = new Set(Array.isArray(v.activities) ? v.activities : []);
      return (
        <SBPopover anchorRef={anchorRef}>
          {SB_SPORTS.map((s) => {
            const isAny = s.id === "Any Sport";
            const isSelected = isAny ? selectedSet.size === 0 : selectedSet.has(s.id);
            return (
              <SBRow
                key={s.id}
                icon={s.icon}
                label={s.id}
                selected={isSelected}
                onClick={() => toggleActivity(s.id)}
              />
            );
          })}
        </SBPopover>
      );
    }
    if (active === "when") {
      // Dual-select: WHEN has two independent sub-facets (day range +
      // time of day). Each row commits its own facet and recomputes
      // the combined `when` display string. The popover stays OPEN so
      // the user can also set the other sub-facet before tabbing out.
      const day = v.whenDay || "Any day";
      const time = v.whenTime || "Any time";
      const recombine = (d, t) => `${d} · ${t}`;
      return (
        <SBPopover anchorRef={anchorRef}>
          <div style={{ padding: "8px 12px 4px", fontSize: 10.5, fontWeight: 800, letterSpacing: 1.2, textTransform: "uppercase", color: "var(--pp-fg-muted)" }}>
            Day range
          </div>
          {SB_WHEN_OPTIONS.map((opt) => (
            <SBRow
              key={opt.id}
              icon="Calendar"
              label={opt.label}
              selected={day === opt.id}
              onClick={() => setValues({ whenDay: opt.id, when: recombine(opt.id, time) })}
            />
          ))}
          <div style={{ height: 1, background: "var(--pp-border-subtle)", margin: "6px 4px" }} />
          <div style={{ padding: "8px 12px 4px", fontSize: 10.5, fontWeight: 800, letterSpacing: 1.2, textTransform: "uppercase", color: "var(--pp-fg-muted)" }}>
            Time of day
          </div>
          {SB_WHEN_TIME_BUCKETS.map((b) => (
            <SBRow
              key={b.id}
              icon="Clock"
              label={b.id}
              sub={b.sub}
              selected={time === b.id}
              onClick={() => setValues({ whenTime: b.id, when: recombine(day, b.id) })}
            />
          ))}
        </SBPopover>
      );
    }
    if (active === "who") {
      // Desktop Who popover — uses the same contained pill stepper as
      // the mobile sheet's Who row. Single grey rounded capsule holding
      // [− N players +]; minus and plus glyphs sit inside without their
      // own strokes.
      const whoCount = v.whoCount || 1;
      const setWhoCount = (n) => {
        const next = Math.max(1, Math.min(8, n));
        const label = next === 1 ? "1 Player" : `${next} Players`;
        if (values && onChange) onChange({ ...values, who: label, whoCount: next });
        else setInternal((prev) => ({ ...prev, who: label, whoCount: next }));
        setTouched((prev) => ({ ...prev, who: true }));
      };
      return (
        <SBPopover anchorRef={anchorRef} minWidth={260}>
          {/* WHO popover — the "Players" eyebrow above the stepper was
              dropped (the segment label already says WHO + "N Player(s)",
              and the only control is the stepper, so a second label is
              redundant). The stepper pill now fills the popover width
              instead of hugging right, so the +/- targets sit at the
              edges where players' thumbs naturally land.
              Wrapper padding matches SBRow's 10/12 pattern so the WHO
              popover sits flush with the WHERE / WHAT / WHEN row
              rhythm. */}
          <div style={{
            padding: "10px 12px",
            display: "flex",
          }}>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              flex: 1, minWidth: 0,
              background: "var(--pp-bg-subtle)",
              borderRadius: 999,
              padding: 4,
              height: 44,
            }}>
              <button
                type="button"
                onClick={() => setWhoCount(whoCount - 1)}
                disabled={whoCount <= 1}
                aria-label="Fewer players"
                style={{
                  width: 36, height: 36, borderRadius: 999,
                  border: 0, background: "transparent",
                  color: "var(--pp-fg-default)",
                  cursor: whoCount <= 1 ? "not-allowed" : "pointer",
                  opacity: whoCount <= 1 ? 0.35 : 1,
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  padding: 0,
                  flexShrink: 0,
                }}
              >
                {window.Icon && <window.Icon name="Minus" size={16} strokeWidth={2.4} color="var(--pp-fg-default)" />}
              </button>
              <span style={{
                flex: 1, textAlign: "center",
                fontFamily: "Axiforma, Inter, system-ui, sans-serif",
                fontWeight: 700, fontSize: 14, color: "var(--pp-fg-default)",
                fontVariantNumeric: "tabular-nums",
                padding: "0 6px",
                whiteSpace: "nowrap",
              }}>{whoCount} {whoCount === 1 ? "player" : "players"}</span>
              <button
                type="button"
                onClick={() => setWhoCount(whoCount + 1)}
                disabled={whoCount >= 8}
                aria-label="More players"
                style={{
                  width: 36, height: 36, borderRadius: 999,
                  border: 0, background: "transparent",
                  color: "var(--pp-fg-default)",
                  cursor: whoCount >= 8 ? "not-allowed" : "pointer",
                  opacity: whoCount >= 8 ? 0.35 : 1,
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  padding: 0,
                  flexShrink: 0,
                }}
              >
                {window.Icon && <window.Icon name="Plus" size={16} strokeWidth={2.4} color="var(--pp-fg-default)" />}
              </button>
            </div>
          </div>
        </SBPopover>
      );
    }
    return null;
  };

  return (
    <div
      ref={containerRef}
      data-searchbar-root
      data-theme-lock="light"
      style={{
        width: "100%",
        maxWidth: desktop ? 1040 : "100%",
        margin: "0 auto",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "relative",
          height: pillH,
          borderRadius: SIZES.radius,
          background: trackBg,
          boxShadow: trackShadow,
          // Track itself has no inner padding — each segment owns its 8px
          // gutter so the divider lines can sit cleanly between adjacent
          // segments (per Figma spec node 8059-57624).
          padding: 0,
          display: "flex",
          alignItems: "stretch",
          gap: SIZES.gap,
          overflow: "hidden",
          transition: "background 200ms ease, box-shadow 200ms ease",
        }}
      >
        {segments.map((seg, i) => (
          <Segment
            key={seg.key}
            seg={seg}
            focused={active === seg.key}
            isWho={seg.key === "who"}
            isLast={i === segments.length - 1}
          />
        ))}
      </div>
      {renderPopover()}
      {/* Desktop results modal — picks a club after Search is tapped.
          Renders only on desktop; mobile uses SearchBarCompact +
          SearchResultsSheet instead. */}
      {desktop && (
        <SearchResultsModal
          open={resultsOpen}
          onClose={() => setResultsOpen(false)}
          values={v}
          onSelectClub={(clubName, clubId) => {
            // Stash both human-readable club + the canonical id on the
            // prefill payload. The parent's onBookCourt(prefill) is then
            // expected to setSelectedClubId(prefill.clubId) before
            // routing to the reserve-court screen, so the user lands
            // directly on the picked club's booking flow.
            window.__searchPrefill = {
              ...(window.__searchPrefill || {}),
              club: clubName,
              clubId,
            };
            setResultsOpen(false);
            onSubmit && onSubmit({ ...v, club: clubName, clubId });
          }}
          theme={theme}
        />
      )}
    </div>
  );
}

// ---- Mobile bottom sheet --------------------------------------------------
// Full-height sheet that slides up from the bottom of the viewport. Renders
// the four facets stacked in segment order (Where → What → When → Who)
// with the option lists from the desktop SearchBar so the discovery model
// stays consistent.
//
// Pure presentational — the parent owns `values` + `onChange`. Selecting
// an option commits immediately; tapping "Search" runs `onSubmit` (which
// also dismisses the sheet via the parent setting `open = false`).
function MobileSearchSheet({ open, onClose, values, onChange, onSubmit, theme }) {
  // Locked body scroll while the sheet is open so the underlying page can't
  // scroll behind the overlay.
  useEffectSB(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  const v = values;
  const set = (k, val) => onChange({ ...v, [k]: val });

  // ---- Accordion state ----------------------------------------------------
  // openSection: which accordion is expanded. null = all closed.
  // The sheet enters with everything collapsed so the user sees a clean
  // four-section list; tapping a row opens that section. Selecting a value
  // auto-advances (where → what → when → who).
  const [openSection, setOpenSection] = useStateSB(null);

  // ---- WHERE state --------------------------------------------------------
  // Type-ahead query (separate from the committed v.where value) +
  // show-all toggle (renders the "5mi radius" expansion).
  const [whereQuery, setWhereQuery] = useStateSB("");

  // ---- WHAT / WHEN single-select state -----------------------------------
  // Every facet is single-select now — tapping a row commits and
  // auto-advances to the next section. WHEN has two sub-facets (day range
  // + time of day) that work the same way: pick a day range → focus
  // shifts to time of day → pick a time → advance to WHO.
  const [activity, setActivity] = useStateSB("");
  const [whenDay, setWhenDay] = useStateSB("");
  const [whenTime, setWhenTime] = useStateSB("");
  // Which WHEN sub-accordion is open. "day" by default when WHEN opens.
  const [openWhenSub, setOpenWhenSub] = useStateSB("day");

  // Reset on open — every facet starts with a sensible default so the
  // sheet shows a populated "what you'd search for if you tapped Search
  // right now" state. The user only edits what they want to refine.
  //
  // WHERE opens by default since it's the most common refinement; the
  // other three sections sit collapsed with their default chips visible.
  //
  // Parent-owned facets (where, activity, who) are all written through a
  // SINGLE onChange call to avoid stale-closure clobber — multiple
  // independent set/setPlayers calls inside the same effect each see the
  // pre-effect `v` and the last one wins.
  useEffectSB(() => {
    if (open) {
      setOpenSection("where");
      setWhereQuery("");
      setActivity("Any Sport");
      setWhenDay("Any day");
      setWhenTime("Any time");
      setOpenWhenSub("day");
      onChange({
        ...v,
        where: "Current location",
        activity: "Any Sport",
        who: "1 Player",
        whoCount: 1,
      });
    }
  }, [open]);

  // Mirror single-select state back to the committed values so the pill
  // subtitle reflects what the user picked.
  useEffectSB(() => {
    if (activity) set("activity", activity);
  }, [activity]);
  useEffectSB(() => {
    if (!whenDay && !whenTime) return;
    const combined = whenDay && whenTime ? `${whenDay} · ${whenTime}` : (whenDay || whenTime);
    set("when", combined);
  }, [whenDay, whenTime]);

  // ---- Player stepper -----------------------------------------------------
  const playerCount = (() => {
    const m = /^(\d+)/.exec(v.who || "");
    return m ? Number(m[1]) : 1;
  })();
  const setPlayers = (n) => {
    const next = Math.max(1, Math.min(8, n));
    set("who", `${next} ${next === 1 ? "Player" : "Players"}`);
  };

  // ---- Section accordion shell --------------------------------------------
  // Section header reads as a full question ("Where would you like to
  // reserve") so the type carries the intent. Size 16/800 gives clean
  // hierarchy below the 22px sheet title without crowding row labels at
  // 15. No chevron — chip on the right shows the current pick when
  // collapsed, and tapping the header (with min-height: 56 hit area)
  // toggles. No inter-section borders.
  const SectionAccordion = ({ id, label, chip, children }) => {
    const isOpen = openSection === id;
    return (
      <section>
        <button
          type="button"
          onClick={() => setOpenSection(isOpen ? null : id)}
          aria-expanded={isOpen}
          style={{
            width: "100%", minHeight: 56,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            gap: 12,
            padding: "12px 0",
            border: 0, background: "transparent",
            fontFamily: "inherit", cursor: "pointer", textAlign: "left",
          }}
        >
          <span style={{
            fontFamily: "Axiforma, Inter, system-ui, sans-serif",
            fontWeight: 800,
            fontSize: 16, lineHeight: 1.25, letterSpacing: -0.2,
            color: "var(--pp-fg-default)",
            // Long section labels — keep on one line, ellipsize if the
            // chip + label combine wider than the row.
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            flex: 1, minWidth: 0,
          }}>{label}</span>
          {chip && !isOpen && (
            <span style={{
              height: 22, padding: "0 10px", borderRadius: 6,
              background: "var(--pp-bg-subtle)", color: "var(--pp-fg-default)",
              fontSize: 11.5, fontWeight: 600,
              display: "inline-flex", alignItems: "center",
              maxWidth: 160,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              flexShrink: 0,
            }}>{chip}</span>
          )}
        </button>
        {isOpen && (
          <div style={{ paddingBottom: 16 }}>
            {children}
          </div>
        )}
      </section>
    );
  };

  // ---- List row ----------------------------------------------------------
  // Uniform anatomy across every section so the list reads as a single
  // group regardless of which facet you're looking at:
  //
  //   [leading icon, optional]   Label                       (radio)
  //                              Sub line (optional)
  //
  // Radio sits on the RIGHT — primary content reads left-to-right
  // naturally, the selection state lives at the trailing edge.
  // min-height: 56 keeps 1-line and 2-line rows visually balanced.
  // Picked rows get a subtle #F4F5F6 fill so the selection reads even
  // without looking at the dot.
  const Row = ({ active, icon, label, sub, onClick, accent = "var(--pp-fg-default)" }) => (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 12,
        width: "100%",
        minHeight: 56,
        // 12px horizontal padding insets the selected-state fill from
        // the sheet edges, so picked rows visibly inset while any
        // section-level strokes (eyebrow border, etc.) sit edge-to-edge.
        // Radio still aligns with the close X (both at sheet right - 16
        // - 12 = body content right - 12 from the row's right edge).
        padding: "10px 12px",
        border: 0,
        background: active ? "var(--pp-bg-subtle)" : "transparent",
        borderRadius: 10,
        color: "var(--pp-fg-default)",
        fontFamily: "inherit", textAlign: "left", cursor: "pointer",
        transition: "background 120ms ease",
      }}
    >
      {icon && window.Icon && (
        <span style={{ display: "inline-flex", flexShrink: 0 }}>
          <window.Icon name={icon} size={18} strokeWidth={2} color={accent === "var(--pp-blue-600)" ? accent : "var(--pp-fg-muted)"} />
        </span>
      )}
      <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={{
          fontSize: 15,
          fontWeight: active ? 600 : 500,
          color: accent === "var(--pp-blue-600)" ? accent : "var(--pp-fg-default)",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          lineHeight: 1.3,
        }}>{label}</span>
        {sub && (
          <span style={{
            fontSize: 13, color: "var(--pp-fg-muted)", lineHeight: 1.3,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>{sub}</span>
        )}
      </span>
      {/* Trailing radio indicator — outline ring with a filled dot when
          active. `accent` lets specialty rows (e.g. blue actions) swap in. */}
      <span style={{
        width: 20, height: 20, borderRadius: 999,
        border: `2px solid ${active ? accent : "var(--pp-border-default)"}`,
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
        transition: "border-color 120ms ease",
      }}>
        {active && (
          <span style={{
            width: 8, height: 8, borderRadius: 999,
            background: accent,
          }} />
        )}
      </span>
    </button>
  );

  // ---- Chip text per section ---------------------------------------------
  // Every section ALWAYS shows its current value as a chip on the closed
  // accordion — even when that value is the default (Current location,
  // Any Sport, Any day · Any time, 1 Player). Reads as "here's what
  // you'd be searching for; tap to refine."
  const whereChip = v.where || null;
  const whatChip = activity || null;
  const whenChip = whenDay && whenTime ? `${whenDay} · ${whenTime}`
    : (whenDay || whenTime || null);
  const whoChip = v.who || null;

  // ---- WHERE suggestions -------------------------------------------------
  // Mobile sheet shows the 3 nearest clubs/cities at rest — bigger
  // selection surface, faster to tap. Zip-code matches are filtered
  // out entirely (clubs and cities cover the same physical area; the
  // raw zip codes added noise). Typing in the input still filters,
  // and the cap lifts so the user can see all matching results.
  const whereMatches = filterWhereSuggestions(whereQuery, 50)
    .filter((s) => s.kind !== "zip");
  const whereVisible = whereQuery ? whereMatches : whereMatches.slice(0, 3);

  // Portal target — the device frame's inner container has
  // `position: relative` and `overflow: hidden`, so anchoring the sheet
  // there gives us a clean modal overlay scoped to the mobile frame.
  // Without the portal the sheet inherits the sticky-shelf's containing
  // block and leaks through as a sliver under the search bar.
  const portalTarget = typeof document !== "undefined"
    ? document.getElementById("device-frame-inner")
    : null;
  if (!portalTarget) return null;

  const sheet = (
    <>
      {/* Backdrop — fades in/out. Tapping it dismisses the sheet. */}
      <div
        onClick={onClose}
        aria-hidden={!open}
        style={{
          position: "absolute", inset: 0,
          background: "rgba(15,18,20,.45)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 220ms ease",
          zIndex: 100,
        }}
      />
      {/* Sheet — slides up from the bottom of the device frame. 92% of the
          frame height so a peek of the backdrop remains visible at the top,
          signaling the sheet is modal and dismissible. */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        data-theme-lock="light"
        style={{
          position: "absolute", left: 0, right: 0, bottom: 0,
          height: "92%",
          background: "var(--pp-bg-default)",
          borderTopLeftRadius: 20, borderTopRightRadius: 20,
          boxShadow: "0 -8px 32px rgba(15,18,20,.22)",
          transform: open ? "translateY(0)" : "translateY(100%)",
          transition: "transform 320ms cubic-bezier(.2,.8,.2,1)",
          zIndex: 101,
          display: "flex", flexDirection: "column",
          fontFamily: "Inter, system-ui, sans-serif",
          // Disable pointer events when closed so the backdrop's
          // pointerEvents: none is honored — otherwise the off-screen
          // sheet still intercepts taps in some browsers.
          pointerEvents: open ? "auto" : "none",
        }}
      >
        {/* Drag handle */}
        <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 4px 0" }}>
          <div style={{ width: 40, height: 4, borderRadius: 999, background: "var(--pp-border-subtle)" }} />
        </div>
        {/* Header row — sheet title (largest in the hierarchy) + ghost X.
            Hierarchy now reads:
              Title (24/800)  ──  largest
              Section (17/800) ──  step down
              Subsection (11.5/800 uppercase) ── eyebrow
            so the user's eye lands on the title first, then the section
            currently in focus. */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "8px 16px 12px 16px",
        }}>
          <h2 style={{
            margin: 0,
            fontFamily: "Axiforma, Inter, system-ui, sans-serif",
            fontWeight: 800, fontSize: 24, lineHeight: 1.15, letterSpacing: -0.6,
            color: "var(--pp-fg-default)",
          }}>Search for anything</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              width: 44, height: 44, border: 0,
              padding: 0,
              background: "transparent",
              // Icon right-aligned inside the button so its right edge
              // sits at the body content's right edge (16px from sheet
              // right) — matches the row radios' right edge for a clean
              // vertical alignment down the trailing column.
              display: "inline-flex", alignItems: "center", justifyContent: "flex-end",
              cursor: "pointer",
            }}
          >
            {window.Icon && <window.Icon name="X" size={22} strokeWidth={2} color="var(--pp-fg-default)" />}
          </button>
        </div>

        {/* Scrollable body — four accordion sections, all start closed.
            Selecting a value in one auto-advances to the next; multiselect
            sections (WHAT, WHEN) advance via Continue. */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          padding: "0 16px 8px 16px",
        }}>
          {/* ---- WHERE ----------------------------------------------------- */}
          <SectionAccordion id="where" label="Where" chip={whereChip}>
            {/* Search input with the new copy. */}
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "0 14px",
              height: 48, borderRadius: 10,
              border: "1px solid var(--pp-border-subtle)",
              background: "var(--pp-bg-default)",
              marginBottom: 4,
            }}>
              {window.Icon && <window.Icon name="Search" size={16} strokeWidth={2} color="var(--pp-fg-muted)" />}
              <input
                type="text"
                value={whereQuery}
                onChange={(e) => setWhereQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const first = filterWhereSuggestions(whereQuery)[0];
                    if (first) { set("where", first.name); setOpenSection("what"); }
                    else if (whereQuery.trim()) { set("where", whereQuery.trim()); setOpenSection("what"); }
                  }
                }}
                placeholder="Search for location, club, zip code..."
                aria-label="Search location"
                style={{
                  flex: 1, minWidth: 0,
                  border: 0, outline: "none", background: "transparent",
                  fontFamily: "inherit", fontSize: 14, color: "var(--pp-fg-default)",
                }}
              />
              {whereQuery && (
                <button
                  type="button"
                  onClick={() => setWhereQuery("")}
                  aria-label="Clear"
                  style={{
                    width: 24, height: 24, borderRadius: 999, border: 0,
                    background: "var(--pp-bg-subtle)", cursor: "pointer",
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  {window.Icon && <window.Icon name="X" size={14} strokeWidth={2.4} color="var(--pp-fg-muted)" />}
                </button>
              )}
            </div>

            {/* Borderless stacked list — Current location at the top
                (with the user's resolved address as sub line), then the
                nearby club / city / zip matches. 16px gap between the
                search input above and the list below. No "Show more"
                row — typing in the input is the way to surface more. */}
            <div style={{ paddingTop: 16 }}>
              <Row
                active={v.where === "Current location"}
                icon="Navigation"
                label="Current location"
                sub="Oakland, CA"
                onClick={() => { set("where", "Current location"); setOpenSection("what"); }}
              />
              {whereVisible.length === 0 ? (
                <div style={{ padding: "16px 0", fontSize: 13, color: "var(--pp-fg-subtle)" }}>
                  No matches for "{whereQuery}"
                </div>
              ) : (
                whereVisible.map((s) => (
                  <Row
                    key={`${s.kind}-${s.name}`}
                    active={v.where === s.name}
                    icon={SB_WHERE_KIND_ICON[s.kind] || "MapPin"}
                    label={s.name}
                    // Strip the trailing zip code from the sub and append
                    // the distance so the row reads "City, ST · 2.1 mi".
                    // Desktop popover still gets the full sub from the
                    // same data.
                    sub={`${(s.sub || "").replace(/\s·\s\d{5}.*$/, "")}${s.distance ? ` · ${s.distance} mi` : ""}`}
                    onClick={() => { set("where", s.name); setOpenSection("what"); }}
                  />
                ))
              )}
            </div>
          </SectionAccordion>

          {/* ---- WHAT — radio single-select, auto-advance to WHEN -------- */}
          <SectionAccordion id="what" label="What" chip={whatChip}>
            <div>
              {SB_SPORTS.map((s) => (
                <Row
                  key={s.id}

                  active={activity === s.id}
                  label={s.id}
                  onClick={() => {
                    setActivity(s.id);
                    setOpenSection("when");
                    setOpenWhenSub("day");
                  }}
                />
              ))}
            </div>
          </SectionAccordion>

          {/* ---- WHEN — two radio subsections, always visible ----------- */}
          {/* Subsection labels are now eyebrows (small uppercase + 1px
              underline). Both lists are rendered at once so the user can
              jump between Day range and Time of day without an extra tap.
              Defaults are seeded to "Any day" / "Any time" on open. */}
          <SectionAccordion id="when" label="When" chip={whenChip}>
            {/* ---- Day range eyebrow ---- */}
            <div style={{
              // Extend the eyebrow's border-bottom edge-to-edge: -16px
              // margins on each side reach the sheet edges (body has
              // padding-right: 16). The label keeps its 16px inset via
              // padding so it lines up vertically with row content.
              margin: "0 -16px",
              padding: "12px 16px 6px 16px",
              borderBottom: "1px solid var(--pp-border-subtle)",
              fontFamily: "Axiforma, Inter, system-ui, sans-serif",
              fontSize: 10.5, fontWeight: 800,
              letterSpacing: 1.2, textTransform: "uppercase",
              color: "var(--pp-fg-subtle)", lineHeight: 1,
            }}>Day range</div>
            <div style={{ paddingTop: 4, paddingBottom: 8 }}>
              {SB_WHEN_OPTIONS.map((w) => (
                <Row
                  key={w.id}
                  active={whenDay === w.id}
                  label={w.label}
                  onClick={() => {
                    setWhenDay(w.id);
                    // Time of day already defaults to "Any time", so
                    // picking a day satisfies both WHEN sub-facets and
                    // advances to WHO. User can re-open WHEN to refine.
                    setOpenSection("who");
                  }}
                />
              ))}
            </div>

            {/* ---- Time of day eyebrow ---- */}
            <div style={{
              // Extend the eyebrow's border-bottom edge-to-edge: -16px
              // margins on each side reach the sheet edges (body has
              // padding-right: 16). The label keeps its 16px inset via
              // padding so it lines up vertically with row content.
              margin: "0 -16px",
              padding: "12px 16px 6px 16px",
              borderBottom: "1px solid var(--pp-border-subtle)",
              fontFamily: "Axiforma, Inter, system-ui, sans-serif",
              fontSize: 10.5, fontWeight: 800,
              letterSpacing: 1.2, textTransform: "uppercase",
              color: "var(--pp-fg-subtle)", lineHeight: 1,
            }}>Time of day</div>
            <div style={{ paddingTop: 4 }}>
              {SB_WHEN_TIME_BUCKETS.map((tb) => (
                <Row
                  key={tb.id}
                  active={whenTime === tb.id}
                  label={tb.id}
                  sub={tb.sub}
                  onClick={() => {
                    setWhenTime(tb.id);
                    // Picking from Time of day advances to WHO since both
                    // sub-facets have a committed value at that point.
                    setOpenSection("who");
                  }}
                />
              ))}
            </div>
          </SectionAccordion>

          {/* ---- WHO — inline header, no accordion expand ----------------- */}
          {/* The stepper pill lives directly across from the "Who" title;
              no expanded body. Counter renders as "N players" and caps
              at 8. Matches the section-header height + typography of the
              accordion sections above so the row reads as part of the
              same list. */}
          <section style={{
            minHeight: 56,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            gap: 12,
            padding: "12px 0",
          }}>
            <span style={{
              fontFamily: "Axiforma, Inter, system-ui, sans-serif",
              fontWeight: 800,
              fontSize: 16, lineHeight: 1.25, letterSpacing: -0.2,
              color: "var(--pp-fg-default)",
            }}>Who</span>
            {/* Single contained pill: [−] [N players] [+]. Cap at 8. */}
            <div style={{
              display: "inline-flex", alignItems: "center",
              background: "var(--pp-bg-subtle)",
              borderRadius: 999,
              padding: 4,
              gap: 0,
              height: 44,
            }}>
              <button
                type="button"
                onClick={() => setPlayers(playerCount - 1)}
                disabled={playerCount <= 1}
                aria-label="Fewer players"
                style={{
                  width: 36, height: 36, borderRadius: 999,
                  border: 0, background: "transparent",
                  color: "var(--pp-fg-default)",
                  cursor: playerCount <= 1 ? "not-allowed" : "pointer",
                  opacity: playerCount <= 1 ? 0.35 : 1,
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  padding: 0,
                }}
              >
                {window.Icon && <window.Icon name="Minus" size={16} strokeWidth={2.4} color="var(--pp-fg-default)" />}
              </button>
              <span style={{
                minWidth: 76, textAlign: "center",
                fontFamily: "Axiforma, Inter, system-ui, sans-serif",
                fontWeight: 700, fontSize: 14, color: "var(--pp-fg-default)",
                fontVariantNumeric: "tabular-nums",
                padding: "0 6px",
                whiteSpace: "nowrap",
              }}>{playerCount} players</span>
              <button
                type="button"
                onClick={() => setPlayers(playerCount + 1)}
                disabled={playerCount >= 8}
                aria-label="More players"
                style={{
                  width: 36, height: 36, borderRadius: 999,
                  border: 0, background: "transparent",
                  color: "var(--pp-fg-default)",
                  cursor: playerCount >= 8 ? "not-allowed" : "pointer",
                  opacity: playerCount >= 8 ? 0.35 : 1,
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  padding: 0,
                }}
              >
                {window.Icon && <window.Icon name="Plus" size={16} strokeWidth={2.4} color="var(--pp-fg-default)" />}
              </button>
            </div>
          </section>
        </div>

        {/* Sticky footer — Search button sits on a gradient fade so the
            scrolling content above dissolves into white instead of clipping
            against a hard hairline. No top border. */}
        <div style={{
          padding: "20px 16px calc(12px + env(safe-area-inset-bottom)) 16px",
          // Gradient fades into the sheet's bg-default surface. Using
          // the canvas token directly so the fade lands on the right
          // tone in both themes.
          background: "linear-gradient(to bottom, transparent 0%, var(--pp-bg-default) 60%, var(--pp-bg-default) 100%)",
        }}>
          <button
            type="button"
            onClick={() => {
              // Build a normalized prefill payload — the booking flow can
              // pick up `where / sport / day / time / players` and pre-
              // populate its fields. We also stash on window for the
              // prototype's navigation handoff, since onBookCourt currently
              // calls setScreen("reserve-court") without a data channel.
              const prefill = {
                where: v.where || null,
                sport: activity || v.activity || null,
                whenDay: whenDay || null,
                whenTime: whenTime || null,
                players: playerCount,
              };
              window.__searchPrefill = prefill;
              onSubmit && onSubmit(prefill);
              onClose && onClose();
            }}
            style={{
              width: "100%", height: 52, borderRadius: 12,
              border: 0, background: "var(--pp-fg-default)", color: "var(--pp-bg-default)",
              fontFamily: "inherit", fontSize: 15, fontWeight: 700,
              display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
              cursor: "pointer",
            }}
          >
            {window.Icon && <window.Icon name="Search" size={16} strokeWidth={2.2} color="var(--pp-bg-default)" />}
            Search
          </button>
        </div>
      </div>
    </>
  );
  // Render the sheet into the device-frame portal target so it escapes the
  // sticky search shelf's containing block and overlays the full mobile
  // viewport. ReactDOM.createPortal is exposed globally by the React UMD
  // bundle loaded in networkPOC.html.
  return ReactDOM.createPortal(sheet, portalTarget);
}

// ---- Mobile results sheet ------------------------------------------------
// Slides up after the user taps Search in MobileSearchSheet. Shows the
// clubs that match the committed filter set (Where / What / When / Who).
// Tapping a club closes the sheet and routes the user into the booking
// flow with the prefill payload already on window.__searchPrefill.
//
// Visual model mirrors MobileSearchSheet so the two read as one design:
// same backdrop + slide animation, same 24/800 title, same ghost X,
// same row anatomy. Difference: no radios — each club row is a direct
// navigation target with a trailing chevron.
function SearchResultsSheet({ open, onClose, values, onSelectClub, theme }) {
  useEffectSB(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  const portalTarget = typeof document !== "undefined"
    ? document.getElementById("device-frame-inner")
    : null;
  if (!portalTarget) return null;

  // For the prototype, all clubs in SB_RESULTS_CLUBS are considered
  // "matched" — real filtering against where/activity/when isn't wired
  // through. SB_RESULTS_CLUBS carries the canonical `id` field so the
  // booking flow downstream can set selectedClubId from the prefill
  // payload after the user picks one.
  const clubs = SB_RESULTS_CLUBS;
  const v = values || {};
  const filterChips = [v.where, v.activity, v.when, v.who].filter(Boolean);

  const sheet = (
    <>
      <div
        onClick={onClose}
        aria-hidden={!open}
        style={{
          position: "absolute", inset: 0,
          background: "rgba(15,18,20,.45)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 220ms ease",
          zIndex: 100,
        }}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Available clubs"
        data-theme-lock="light"
        style={{
          position: "absolute", left: 0, right: 0, bottom: 0,
          height: "92%",
          background: "var(--pp-bg-default)",
          borderTopLeftRadius: 20, borderTopRightRadius: 20,
          boxShadow: "0 -8px 32px rgba(15,18,20,.22)",
          transform: open ? "translateY(0)" : "translateY(100%)",
          transition: "transform 320ms cubic-bezier(.2,.8,.2,1)",
          zIndex: 101,
          display: "flex", flexDirection: "column",
          fontFamily: "Inter, system-ui, sans-serif",
          pointerEvents: open ? "auto" : "none",
        }}
      >
        {/* Drag handle */}
        <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 4px 0" }}>
          <div style={{ width: 40, height: 4, borderRadius: 999, background: "var(--pp-border-subtle)" }} />
        </div>
        {/* Header — same scale as MobileSearchSheet's title */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "8px 16px 12px 16px",
        }}>
          <h2 style={{
            margin: 0,
            fontFamily: "Axiforma, Inter, system-ui, sans-serif",
            fontWeight: 800, fontSize: 24, lineHeight: 1.15, letterSpacing: -0.6,
            color: "var(--pp-fg-default)",
          }}>Available clubs</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              width: 44, height: 44, border: 0, padding: 0,
              background: "transparent",
              display: "inline-flex", alignItems: "center", justifyContent: "flex-end",
              cursor: "pointer",
            }}
          >
            {window.Icon && <window.Icon name="X" size={22} strokeWidth={2} color="var(--pp-fg-default)" />}
          </button>
        </div>

        {/* Filter chip row — surfaces the committed filters at the top
            so the user sees the connection from search to results. */}
        {filterChips.length > 0 && (
          <div style={{
            padding: "0 16px 12px 16px",
            display: "flex", flexWrap: "wrap", gap: 6,
          }}>
            {filterChips.map((c, i) => (
              <span key={i} style={{
                height: 22, padding: "0 10px", borderRadius: 6,
                background: "var(--pp-bg-subtle)", color: "var(--pp-fg-default)",
                fontSize: 11.5, fontWeight: 600,
                display: "inline-flex", alignItems: "center",
                whiteSpace: "nowrap",
              }}>{c}</span>
            ))}
          </div>
        )}

        {/* Scrollable club list — each row navigates on tap. */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0 16px 16px 16px" }}>
          {clubs.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => onSelectClub && onSelectClub(c.name, c.id)}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                width: "100%",
                minHeight: 56,
                padding: "12px 12px",
                border: 0, background: "transparent",
                borderRadius: 10,
                color: "var(--pp-fg-default)",
                fontFamily: "inherit", textAlign: "left", cursor: "pointer",
                transition: "background 120ms ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--pp-bg-subtle)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              {window.Icon && <window.Icon name="Building2" size={18} strokeWidth={2} color="var(--pp-fg-muted)" />}
              <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{
                  fontSize: 15, fontWeight: 600, color: "var(--pp-fg-default)",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  lineHeight: 1.3,
                }}>{c.name}</span>
                <span style={{
                  fontSize: 13, color: "var(--pp-fg-muted)", lineHeight: 1.3,
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {c.city}{c.state ? `, ${c.state}` : ""}
                  {c.distance ? ` · ${c.distance} mi` : ""}
                </span>
              </span>
              {window.Icon && <window.Icon name="ChevronRight" size={18} strokeWidth={2} color="var(--pp-fg-muted)" />}
            </button>
          ))}
        </div>
      </div>
    </>
  );

  return ReactDOM.createPortal(sheet, portalTarget);
}

// ---- Map thumbnail (SearchResultsModal) ---------------------------------
// 96×96 square preview rendered as a stylized SVG (cross-streets +
// centered pin). Reads as a quick "where is this" anchor on the left
// of each club row without pulling in a real map tile API. Distance
// pill in the corner gives the same at-a-glance signal the
// BookNowCard's MiniMap carries.
function SBClubMapThumb({ club }) {
  // Deterministic per-club layout — stable across renders so the
  // streets don't churn between mounts of the same row. Hash the id.
  const hash = (() => { let h = 0; const s = String(club.id || ""); for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; })();
  const xPin = 40 + (hash % 20);          // jitter the pin x-position
  const yPin = 40 + ((hash >> 3) % 20);   // jitter the pin y-position
  const xRoad1 = 25 + (hash % 30);
  const yRoad1 = 30 + ((hash >> 2) % 30);
  return (
    <div style={{
      position: "relative",
      width: 96, height: 96,
      borderRadius: 8,
      overflow: "hidden",
      background: "var(--pp-bg-muted)",
      flexShrink: 0,
    }}>
      <svg viewBox="0 0 96 96" width="96" height="96" style={{ display: "block" }} aria-hidden="true">
        {/* base tone */}
        <rect width="96" height="96" fill="var(--pp-bg-muted)" />
        {/* park / blocks */}
        <rect x="0" y="0" width="50" height="36" fill="var(--pp-map-block)" />
        <rect x="56" y="58" width="40" height="38" fill="var(--pp-map-block)" />
        {/* streets */}
        <line x1="0" y1={yRoad1} x2="96" y2={yRoad1} stroke="var(--pp-bg-default)" strokeWidth="3" />
        <line x1={xRoad1} y1="0" x2={xRoad1} y2="96" stroke="var(--pp-bg-default)" strokeWidth="3" />
        <line x1="0" y1="72" x2="96" y2="72" stroke="var(--pp-bg-default)" strokeWidth="2.4" />
        {/* pin */}
        <g transform={`translate(${xPin} ${yPin})`}>
          <ellipse cx="0" cy="11" rx="6" ry="2" fill="rgba(15,18,20,.18)" />
          <path d="M 0 -10 C -6 -10 -10 -6 -10 0 C -10 6 0 14 0 14 C 0 14 10 6 10 0 C 10 -6 6 -10 0 -10 Z" fill="var(--pp-green-700)" stroke="var(--pp-bg-default)" strokeWidth="1.4" />
          <circle cx="0" cy="-1" r="3" fill="var(--pp-bg-default)" />
        </g>
      </svg>
      {/* Distance pill — neutral chip in the top-left of the map. */}
      <span style={{
        position: "absolute", top: 6, left: 6,
        padding: "2px 6px", borderRadius: 9999,
        background: "var(--pp-bg-subtle)", color: "var(--pp-fg-muted)",
        fontSize: 11, lineHeight: "14px", letterSpacing: 0.3,
        fontWeight: 500,
        whiteSpace: "nowrap",
      }}>{club.distance}mi</span>
    </div>
  );
}

// ---- Club list row (SearchResultsModal) ---------------------------------
// Mirrors the logged-out home's MoreEventsNearYou EventRow pattern: 24px
// padding, gap 24, white-rest / soft-tint-hover zebra, dark icon-only
// Reserve square that expands to "Reserve" on hover. Each row is one
// club — 96×96 map square on the left, then `name` headline, location
// line, and the sport/booked caption.
function SBClubListRow({ club, onSelect }) {
  const [hover, setHover] = useStateSB(false);
  return (
    <div
      data-card-hover
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => onSelect && onSelect(club.name, club.id)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 24,
        padding: 24,
        borderBottom: "1px solid var(--pp-border-subtle)",
        background: hover ? "rgba(0,0,0,.04)" : "var(--pp-bg-default)",
        cursor: "pointer",
        transition: "background 140ms ease",
      }}
    >
      <SBClubMapThumb club={club} />
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{
          fontFamily: "Axiforma, Inter, system-ui, sans-serif", fontWeight: 700,
          fontSize: 20, lineHeight: "28px", letterSpacing: 0,
          color: "var(--pp-fg-default)",
        }}>{club.name}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, lineHeight: "16px", letterSpacing: 0.2, color: "var(--pp-fg-muted)" }}>
          {window.Icon && <window.Icon name="MapPin" size={16} strokeWidth={1.75} color="var(--pp-fg-muted)" />}
          <span>{club.city}, {club.state}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{
            padding: "2px 6px", borderRadius: 9999,
            background: "var(--pp-bg-subtle)", color: "var(--pp-fg-muted)",
            fontSize: 12, lineHeight: "16px", letterSpacing: 0.3, fontWeight: 400,
            whiteSpace: "nowrap",
          }}>{club.sport}</span>
          <span style={{ fontSize: 12, lineHeight: "16px", letterSpacing: 0.3, color: "var(--pp-fg-muted)" }}>
            · Booked {club.booked} x Today
          </span>
        </div>
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onSelect && onSelect(club.name, club.id); }}
        aria-label="Select club"
        style={{
          minWidth: hover ? 132 : 48,
          height: 48,
          padding: hover ? "0 16px" : 0,
          borderRadius: 8,
          background: "var(--pp-bg-inverse)", color: "var(--pp-bg-default)", border: 0, cursor: "pointer",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          gap: hover ? 8 : 0,
          fontFamily: "inherit", fontWeight: 500, fontSize: 16, lineHeight: "24px",
          whiteSpace: "nowrap", flexShrink: 0, overflow: "hidden",
          boxShadow: "0 2px 4px rgba(0,0,0,.08)",
          transition: "min-width 220ms cubic-bezier(.2,.8,.2,1), padding 220ms ease",
        }}
      >
        {hover && <span>Reserve</span>}
        {window.Icon && <window.Icon name="ArrowRight" size={24} strokeWidth={1.75} color="var(--pp-bg-default)" />}
      </button>
    </div>
  );
}

// (SBClubListSection was used when the modal stacked per-cut H3
// section titles; that role moved to the segmented controller in the
// header so the section wrapper is no longer needed.)

// ---- Desktop results modal -----------------------------------------------
// Centered modal that opens after the user taps Search in the desktop
// SearchBar (or any "Find a club" / event-list trigger that calls
// window.__openResultsModal). Renders SB_RESULTS_CLUBS in themed
// carousel sections (Popular near you, Ready to book today, Closest)
// using the BookNowCard from the logged-out home.
//
// Picking a card stashes the club on window.__searchPrefill and calls
// onSelectClub (parent routes into the booking flow).
function SearchResultsModal({ open, onClose, values, onSelectClub, theme }) {
  useEffectSB(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  // Close on Escape — modal accessibility basics.
  useEffectSB(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose && onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (typeof document === "undefined") return null;
  const portalTarget = document.body;

  const v = values || {};
  const filterChips = [v.where, v.activity, v.when, v.who].filter(Boolean);

  // Tab segments — segmented controller replaces the previous H2 +
  // per-section H3 headings. Each tab filters SB_RESULTS_CLUBS by a
  // different intent so the modal stays a single scannable list at a
  // time instead of three stacked carousels.
  //   Recommended    full set; intentionally a curated "for you" mix
  //   Popular        booked ≥ 20 (the prior "Popular near you" cut)
  //   Closest to you distance ≤ 5 mi
  //   Relevant       narrowed to clubs matching the SearchBar's
  //                  activity filter when one is set; otherwise the
  //                  full set so the tab still renders content.
  const sportFilter = v.activity && v.activity !== "Any Sport" ? v.activity : null;
  const TABS = [
    { key: "recommended",  label: "Recommended",   clubs: SB_RESULTS_CLUBS },
    { key: "popular",      label: "Popular",       clubs: SB_RESULTS_CLUBS.filter((c) => c.booked >= 20) },
    { key: "closest",      label: "Closest to you", clubs: SB_RESULTS_CLUBS.filter((c) => parseFloat(c.distance) <= 5) },
    { key: "relevant",     label: "Relevant",      clubs: sportFilter ? SB_RESULTS_CLUBS.filter((c) => c.sport === sportFilter) : SB_RESULTS_CLUBS },
  ];
  const [activeTabKey, setActiveTabKey] = useStateSB("recommended");
  const activeTab = TABS.find((t) => t.key === activeTabKey) || TABS[0];

  const modal = (
    <>
      {/* Backdrop — covers the whole browser viewport on desktop.
          position: fixed (not absolute) so it anchors to the viewport,
          not the closest positioned ancestor. */}
      <div
        onClick={onClose}
        aria-hidden={!open}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(15,18,20,.55)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 220ms ease",
          zIndex: 200,
        }}
      />
      {/* Modal — capped at 640px wide. Rows are vertical-list shape now
          (no multi-card carousels), so a narrower column reads as a
          dialog rather than a full-bleed listing. 75vh tall caps the
          vertical so the modal stays inside even shorter windows. */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search results"
        data-theme-lock="light"
        style={{
          position: "fixed",
          left: "50%", top: "50%",
          transform: open ? "translate(-50%, -50%) scale(1)" : "translate(-50%, -50%) scale(.96)",
          opacity: open ? 1 : 0,
          width: "min(640px, calc(100vw - 48px))",
          maxHeight: "min(75vh, 720px)",
          background: "var(--pp-bg-default)",
          borderRadius: 16,
          boxShadow: "0 24px 64px rgba(15,18,20,.32), 0 4px 16px rgba(15,18,20,.16)",
          transition: "opacity 220ms ease, transform 220ms cubic-bezier(.2,.8,.2,1)",
          pointerEvents: open ? "auto" : "none",
          zIndex: 201,
          display: "flex", flexDirection: "column",
          fontFamily: "Inter, system-ui, sans-serif",
          overflow: "hidden",
        }}
      >
        {/* Header — segmented controller + close X. The H2 title is
            gone; the active tab label IS the title. */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 16px 12px 24px", gap: 12,
        }}>
          {/* Segmented controller — 4 tabs inside a #F4F5F6 track.
              Active tab lifts to a white pill with elevation/200
              shadow; inactive tabs sit transparent and recede. Same
              recipe as the hero SearchBar's segment track. */}
          <div role="tablist" aria-label="Filter clubs" style={{
            display: "inline-flex", alignItems: "center",
            padding: 4, gap: 4,
            background: "var(--pp-bg-subtle)", borderRadius: 999,
            flexShrink: 1, minWidth: 0,
            overflowX: "auto", scrollbarWidth: "none",
          }}>
            {TABS.map((tab) => {
              const isActive = tab.key === activeTabKey;
              return (
                <button
                  key={tab.key}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveTabKey(tab.key)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 999, border: 0,
                    background: isActive ? "var(--pp-bg-default)" : "transparent",
                    boxShadow: isActive ? "0 2px 4px rgba(0,0,0,.08)" : "none",
                    color: isActive ? "var(--pp-fg-default)" : "var(--pp-fg-muted)",
                    fontFamily: "inherit",
                    fontWeight: isActive ? 600 : 500, fontSize: 13, lineHeight: "20px",
                    letterSpacing: 0,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                    transition: "background 160ms ease, box-shadow 200ms ease, color 160ms ease",
                  }}
                >{tab.label}</button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              width: 40, height: 40, border: 0, padding: 0,
              background: "transparent",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", borderRadius: 999, flexShrink: 0,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--pp-bg-subtle)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
          >
            {window.Icon && <window.Icon name="X" size={20} strokeWidth={2} color="var(--pp-fg-default)" />}
          </button>
        </div>

        {/* Filter chip row — tokens match the homepage neutral tag
            (tagschips/neutral/sm): 2/6 padding, fully rounded, fontSize
            12 / 0.3 ls, #F4F5F6 bg, #2F3436 text. */}
        {filterChips.length > 0 && (
          <div style={{
            padding: "0 24px 16px 24px",
            display: "flex", flexWrap: "wrap", gap: 6,
          }}>
            {filterChips.map((c, i) => (
              <span key={i} data-tag="default" style={{
                padding: "2px 6px", borderRadius: 9999,
                background: "var(--pp-bg-subtle)", color: "var(--pp-fg-muted)",
                fontSize: 12, lineHeight: "16px", letterSpacing: 0.3, fontWeight: 400,
                display: "inline-flex", alignItems: "center",
                whiteSpace: "nowrap",
              }}>{c}</span>
            ))}
          </div>
        )}

        {/* Scrollable body — single list of rows for the active tab.
            No section H3 headings (the segmented controller above
            already names the cut), no carousels. Pure scannable list. */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          padding: "0 0 12px 0",
        }}>
          {activeTab.clubs.map((c) => (
            <SBClubListRow key={c.id} club={c} onSelect={onSelectClub} />
          ))}
        </div>
      </div>
    </>
  );

  return ReactDOM.createPortal(modal, portalTarget);
}

// ---- Mobile compact variant ----------------------------------------------
// Single-row pill that opens the MobileSearchSheet on tap. The pill shows
// the title "Search for anything" plus the four current facet values on a
// single line. Used in tight mobile chrome where the full 4-segment bar is
// too tall.
function SearchBarCompact({ theme, viewport = "mobile", values, onExpand, onSubmit }) {
  // Compact owns its own state by default so the bottom sheet's selections
  // persist between opens. Callers can hoist by passing `values` + a
  // matching change handler via `onExpand` (kept for backwards compat).
  const [internal, setInternal] = useStateSB({
    where: "Oakland, CA", activity: "Any Sport",
    when: "Any Day • Any Time", who: "1 Player",
  });
  const v = values || internal;
  const update = (next) => {
    if (values) {/* controlled — caller handles */ } else setInternal(next);
  };

  const [open, setOpen] = useStateSB(false);
  // Results sheet — shown after the user taps Search inside the filter
  // sheet. Listing matched clubs; selecting one routes to the booking
  // flow via the parent's onSubmit.
  const [resultsOpen, setResultsOpen] = useStateSB(false);
  return (
    <>
    <button
      type="button"
      data-theme-lock="light"
      onClick={() => {
        // Tap opens the bottom sheet for editing facets. The legacy
        // `onExpand` prop still fires for callers that want a navigation
        // side-effect (kept for backwards compat).
        setOpen(true);
        onExpand && onExpand();
      }}
      style={{
        width: "100%",
        // Auto height with 14px vertical padding lands the pill at
        // ~64px tall (content is two stacked lines ≈ 36px). Bumped
        // from 12 so the bar reads with the same visual weight as
        // the desktop 4-segment SearchBar (68 tall).
        borderRadius: 999,
        background: "var(--pp-bg-default)",
        border: 0,
        boxShadow: "0 1px 2px rgba(15,18,20,.06), 0 4px 14px rgba(15,18,20,.08), inset 0 0 0 1px rgba(15,18,20,.06)",
        padding: "14px 8px 14px 18px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        cursor: "pointer",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "flex-start",
        gap: 4,
        overflow: "hidden",
        flex: 1, minWidth: 0,
        // gutter so the truncating value text doesn't visually collide
        // with the search button on the right.
        paddingRight: 8,
      }}>
        {/* Label — matches the desktop segment label exactly:
            Axiforma 800 / 10.5px / letter-spacing 1.3 / uppercase /
            color #858F8F. */}
        <div style={{
          fontFamily: "Axiforma, Inter, system-ui, sans-serif",
          fontWeight: 800,
          fontSize: 10.5, color: "var(--pp-fg-subtle)",
          letterSpacing: 1.3, textTransform: "uppercase",
          lineHeight: 1,
          maxWidth: "100%",
        }}>
          Search for anything
        </div>
        {/* Value — matches the desktop segment value style:
            Inter 500 / 14px / color #0F1214. All four facet values join
            on a single line with bullets; ellipsis kicks in before the
            row reaches the search button so it never visually overlaps. */}
        <div style={{
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: 14, fontWeight: 500, color: "var(--pp-fg-default)",
          lineHeight: 1.2,
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          maxWidth: "100%", width: "100%",
        }}>
          {v.where}<span style={{ color: "var(--pp-fg-subtle)", margin: "0 6px" }}>•</span>{v.activity}<span style={{ color: "var(--pp-fg-subtle)", margin: "0 6px" }}>•</span>{v.when}<span style={{ color: "var(--pp-fg-subtle)", margin: "0 6px" }}>•</span>{v.who}
        </div>
      </div>
      <span style={{
        width: 36, height: 36, borderRadius: 999, background: "var(--pp-fg-default)",
        display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        {window.Icon && <window.Icon name="Search" size={16} strokeWidth={2.2} color="var(--pp-bg-default)" />}
      </span>
    </button>
    <MobileSearchSheet
      open={open}
      onClose={() => setOpen(false)}
      values={v}
      onChange={update}
      onSubmit={(committed) => {
        // Tapping Search in the filter sheet now opens the results
        // sheet listing matched clubs. Parent's onSubmit fires later,
        // once the user picks a club.
        setOpen(false);
        setResultsOpen(true);
      }}
      theme={theme}
    />
    <SearchResultsSheet
      open={resultsOpen}
      onClose={() => setResultsOpen(false)}
      values={v}
      onSelectClub={(clubName, clubId) => {
        // Stash club + canonical id so the booking flow can route the
        // user directly to that club's reservation screen.
        window.__searchPrefill = {
          ...(window.__searchPrefill || {}),
          club: clubName,
          clubId,
        };
        setResultsOpen(false);
        onSubmit && onSubmit({ ...v, club: clubName, clubId });
      }}
      theme={theme}
    />
    </>
  );
}

Object.assign(window, { SearchBar, SearchBarCompact, MobileSearchSheet, SearchResultsSheet, SearchResultsModal });
