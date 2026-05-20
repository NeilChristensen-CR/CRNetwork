// SearchBar.jsx — Network discovery search pill
// ----------------------------------------------------------------------------
// Airbnb-style 4-segment pill (WHERE / ACTIVITY / WHEN / WHO) with a circular
// submit button on the right. Six interactive states:
//
//   1. Default              — unified white pill, no segment highlighted
//   2. Hover (per segment)  — subtle gray fill on the hovered segment
//   3. WHERE focused        — track turns gray; WHERE lifts as a white pill
//                              + popover with city list opens below it
//   4. ACTIVITY focused     — same lift; popover with sport list
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
  // Clubs
  { kind: "club", name: "Old Coast Pickleball",       sub: "St. Augustine, FL · 32084" },
  { kind: "club", name: "Anastasia Tennis Club",      sub: "St. Augustine, FL · 32080" },
  { kind: "club", name: "Vilano Beach Racquet",       sub: "Vilano Beach, FL · 32084" },
  { kind: "club", name: "Dill Dinkers Jacksonville",  sub: "Jacksonville, FL · 32256" },
  { kind: "club", name: "Treaty Park Tennis",         sub: "St. Augustine, FL · 32084" },
  { kind: "club", name: "South St. Augustine",        sub: "St. Augustine, FL · 32086" },
  { kind: "club", name: "The Hub Padel",              sub: "Jacksonville Beach, FL · 32250" },
  { kind: "club", name: "World Golf Village Tennis",  sub: "St. Augustine, FL · 32092" },
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
        background: "#FFFFFF",
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
        background: hover || selected ? "#F4F5F6" : "transparent",
        cursor: "pointer",
        fontFamily: "inherit",
        textAlign: "left",
        transition: "background 120ms",
      }}
    >
      {icon && window.Icon && (
        <span style={{ display: "inline-flex", flexShrink: 0 }}>
          <window.Icon name={icon} size={16} strokeWidth={2} color="#0F1214" />
        </span>
      )}
      <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={{ fontSize: 13, fontWeight: selected ? 700 : 500, color: "#0F1214", lineHeight: 1.2 }}>
          {label}
        </span>
        {sub && (
          <span style={{ fontSize: 11, color: "#4B5052", lineHeight: 1.2 }}>{sub}</span>
        )}
      </span>
      {selected && (
        <span style={{ width: 6, height: 6, borderRadius: 999, background: "#0F1214", flexShrink: 0 }} />
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
        <span style={{ fontSize: 13, fontWeight: 700, color: "#0F1214" }}>{label}</span>
        <span style={{ fontSize: 11, color: "#4B5052" }}>Including you</span>
      </div>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onChange(Math.max(min, value - 1)); }}
          disabled={value <= min}
          aria-label="Decrement"
          style={{
            width: 30, height: 30, borderRadius: 999,
            border: "1px solid #DEE1E5", background: "#fff",
            color: value <= min ? "#BBBFC1" : "#0F1214",
            cursor: value <= min ? "not-allowed" : "pointer",
            fontSize: 16, lineHeight: 1, fontFamily: "inherit",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
          }}
        >−</button>
        <span style={{ minWidth: 18, textAlign: "center", fontWeight: 700, fontSize: 14, color: "#0F1214", fontVariantNumeric: "tabular-nums" }}>{value}</span>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onChange(Math.min(max, value + 1)); }}
          disabled={value >= max}
          aria-label="Increment"
          style={{
            width: 30, height: 30, borderRadius: 999,
            border: "1px solid #DEE1E5", background: "#fff",
            color: value >= max ? "#BBBFC1" : "#0F1214",
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
    activity: "Any Sport",
    when: "Any Day • Any Time",
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
  const COLORS = {
    pillBg:        "#FFFFFF",
    trackBg:       "#F4F5F6",
    focusBg:       "#FFFFFF",
    hoverBg:       "rgba(15,18,20,.04)",  // unfocused-segment hover fill
    label:         "#858F8F",
    value:         "#0F1214",
    divider:       "rgba(15,18,20,.06)",
    arrowAccent:   "#5B7CFA",
    submitBg:      "#0F1214",
    submitFg:      "#FFFFFF",
    border:        "rgba(15,18,20,.06)",
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
  const SIZES = desktop
    ? { pillH: 80, pad: 8, gap: 8,
        segPadX: 22, segPadY: 12, whoPadRight: 8,
        segGapY: 4, labelFs: 10.5, labelLs: 1.3,
        valueFs: 14, btn: 40, btnExpW: 112, radius: 999 }
    : { pillH: 76, pad: 8, gap: 8,
        segPadX: 16, segPadY: 10, whoPadRight: 8,
        segGapY: 3, labelFs: 9.5, labelLs: 1.2,
        valueFs: 13, btn: 36, btnExpW: 100, radius: 999 };
  const pillH = SIZES.pillH;

  // ---- Segments ----------------------------------------------------------
  // `display` resolves to the placeholder when the segment hasn't been
  // touched yet; the watermark color is applied at render time.
  const segments = [
    { key: "where",    label: "WHERE",    value: v.where,    display: touched.where    ? v.where    : PLACEHOLDERS.where,    icon: "Navigation", anchorRef: whereRef },
    { key: "activity", label: "ACTIVITY", value: v.activity, display: touched.activity ? v.activity : PLACEHOLDERS.activity, icon: null,         anchorRef: activityRef },
    { key: "when",     label: "WHEN",     value: v.when,     display: touched.when     ? v.when     : PLACEHOLDERS.when,     icon: null,         anchorRef: whenRef },
    { key: "who",      label: "WHO",      value: v.who,      display: touched.who      ? v.who      : PLACEHOLDERS.who,      icon: null,         anchorRef: whoRef },
  ];

  // Track background flips to gray once any segment is focused.
  const trackBg = active ? COLORS.trackBg : COLORS.pillBg;
  const trackShadow = active
    ? "inset 0 0 0 1px " + COLORS.border
    : "0 1px 2px rgba(15,18,20,.04), 0 4px 14px rgba(15,18,20,.06), inset 0 0 0 1px " + COLORS.border;

  // ---- Search submit button (lives inside the WHO segment) ---------------
  // Default state: 40px dark capsule with a search icon. When WHO is the
  // focused segment, the button rolls out horizontally to a 112px pill
  // with "Search" label + ArrowRight icon. Stays fully rounded (999) in
  // both states — capsule throughout, never a rectangle.
  const renderSubmit = (expanded) => (
    <button
      type="button"
      aria-label="Search"
      onClick={(e) => { e.stopPropagation(); onSubmit && onSubmit(v); }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "#212425"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = COLORS.submitBg; }}
      style={{
        height: SIZES.btn,
        width: expanded ? SIZES.btnExpW : SIZES.btn,
        borderRadius: SIZES.radius,
        background: COLORS.submitBg,
        color: COLORS.submitFg,
        border: 0,
        padding: expanded ? "0 14px 0 16px" : 0,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: expanded ? "space-between" : "center",
        gap: expanded ? 8 : 0,
        cursor: "pointer",
        flexShrink: 0,
        boxShadow: "0 2px 6px rgba(15,18,20,.18)",
        fontFamily: "Inter, system-ui, sans-serif",
        fontWeight: 700,
        fontSize: 13,
        whiteSpace: "nowrap",
        overflow: "hidden",
        transition: "background 160ms ease, width 220ms cubic-bezier(.2,.8,.2,1), padding 220ms ease",
      }}
    >
      {expanded && <span>Search</span>}
      {window.Icon && (
        <window.Icon name={expanded ? "ArrowRight" : "Search"} size={14} strokeWidth={2.2} color={COLORS.submitFg} />
      )}
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
  const Segment = ({ seg, focused, isWho }) => {
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
              height: pillH - SIZES.pad * 2,
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
              boxShadow: focused
                ? "0 2px 8px rgba(15,18,20,.08), 0 8px 24px rgba(15,18,20,.10)"
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
                <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{seg.display}</span>
                {seg.icon && window.Icon && (
                  <span style={{ display: "inline-flex", color: COLORS.arrowAccent }}>
                    <window.Icon name={seg.icon} size={13} strokeWidth={2.2} color={COLORS.arrowAccent} />
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
              border: "1px solid #E9EBEC",
              background: "#FFFFFF",
            }}>
              <window.Icon name="Search" size={14} strokeWidth={2} color="#4B5052" />
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
                  fontFamily: "inherit", fontSize: 14, color: "#0F1214",
                }}
              />
              {whereQuery && (
                <button
                  type="button"
                  onClick={() => { setWhereQuery(""); whereInputRef.current && whereInputRef.current.focus(); }}
                  aria-label="Clear"
                  style={{
                    width: 20, height: 20, borderRadius: 999, border: 0,
                    background: "#F4F5F6", cursor: "pointer",
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <window.Icon name="X" size={12} strokeWidth={2.4} color="#4B5052" />
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
          <div style={{ height: 1, background: "#F4F5F6", margin: "4px 12px" }} />

          {matches.length === 0 ? (
            <div style={{ padding: "12px 14px", fontSize: 12.5, color: "#858F8F" }}>
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
      return (
        <SBPopover anchorRef={anchorRef}>
          {SB_SPORTS.map((s) => (
            <SBRow
              key={s.id}
              icon={s.icon}
              label={s.id}
              selected={v.activity === s.id}
              onClick={() => { setValue("activity", s.id); setActive(null); }}
            />
          ))}
        </SBPopover>
      );
    }
    if (active === "when") {
      return (
        <SBPopover anchorRef={anchorRef}>
          <div style={{ padding: "8px 12px 4px", fontSize: 10.5, fontWeight: 800, letterSpacing: 1.2, textTransform: "uppercase", color: "#4B5052" }}>
            When
          </div>
          {SB_WHEN_OPTIONS.map((opt) => (
            <SBRow
              key={opt.id}
              icon="Calendar"
              label={opt.label}
              selected={v.when === opt.id}
              onClick={() => { setValue("when", opt.id); setActive(null); }}
            />
          ))}
          <div style={{ height: 1, background: "#F0F0F0", margin: "6px 4px" }} />
          <div style={{ padding: "8px 12px 4px", fontSize: 10.5, fontWeight: 800, letterSpacing: 1.2, textTransform: "uppercase", color: "#4B5052" }}>
            Time of day
          </div>
          {SB_WHEN_TIME_BUCKETS.map((b) => (
            <SBRow
              key={b.id}
              icon="Clock"
              label={b.id}
              sub={b.sub}
              selected={v.when === b.id}
              onClick={() => { setValue("when", b.id); setActive(null); }}
            />
          ))}
        </SBPopover>
      );
    }
    if (active === "who") {
      return (
        <SBPopover anchorRef={anchorRef}>
          <SBStepper
            value={v.whoCount || 1}
            min={1}
            max={8}
            label="Players"
            onChange={(n) => {
              const label = n === 1 ? "1 Player" : `${n} Players`;
              if (values && onChange) onChange({ ...values, who: label, whoCount: n });
              else setInternal((prev) => ({ ...prev, who: label, whoCount: n }));
            }}
          />
        </SBPopover>
      );
    }
    return null;
  };

  return (
    <div
      ref={containerRef}
      data-searchbar-root
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
          padding: SIZES.pad,
          display: "flex",
          alignItems: "stretch",
          gap: SIZES.gap,
          transition: "background 200ms ease, box-shadow 200ms ease",
        }}
      >
        {segments.map((seg) => (
          <Segment
            key={seg.key}
            seg={seg}
            focused={active === seg.key}
            isWho={seg.key === "who"}
          />
        ))}
      </div>
      {renderPopover()}
    </div>
  );
}

// ---- Mobile bottom sheet --------------------------------------------------
// Full-height sheet that slides up from the bottom of the viewport. Renders
// the four facets stacked in segment order (Where → Activity → When → Who)
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
  const [showAllWhere, setShowAllWhere] = useStateSB(false);

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

  // Reset on open — clean slate every time the sheet appears. WHEN's two
  // sub-facets default to "Any day" / "Any time" so the user can submit
  // without explicitly picking — and they read as set state in their
  // respective subsection lists.
  useEffectSB(() => {
    if (open) {
      setOpenSection(null);
      setWhereQuery("");
      setShowAllWhere(false);
      setActivity("");
      setWhenDay("Any day");
      setWhenTime("Any time");
      setOpenWhenSub("day");
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
  // Section title sits one step BELOW the sheet's main heading. No
  // chevron — the chip on the right doubles as the affordance ("there's
  // a selection here, tap to change it"). No borderBottom between
  // sections either; the sheet reads as a flat list.
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
            padding: "14px 0",
            border: 0, background: "transparent",
            fontFamily: "inherit", cursor: "pointer", textAlign: "left",
          }}
        >
          <span style={{
            fontFamily: "Axiforma, Inter, system-ui, sans-serif",
            fontWeight: 800,
            // Section header: one step down from the 24px sheet title.
            fontSize: 17, lineHeight: 1.2, letterSpacing: -0.3,
            color: "#0F1214",
          }}>{label}</span>
          {chip && !isOpen && (
            <span style={{
              height: 22, padding: "0 10px", borderRadius: 6,
              background: "#F4F5F6", color: "#0F1214",
              fontSize: 11.5, fontWeight: 600,
              display: "inline-flex", alignItems: "center",
              maxWidth: 200,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
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
  // Every body row carries a radio indicator on the left so the list
  // reads as a single-select group at a glance. The selected row also
  // gets a subtle grey fill so the picked state is visible without
  // relying solely on the dot. WHERE rows still use a leading list-icon
  // (MapPin / Building2 / Hash) — the radio sits BEFORE that icon.
  const Row = ({ active, icon, label, sub, onClick, accent = "#0F1214" }) => (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 12,
        width: "100%",
        padding: "10px 12px",
        margin: "0 -12px",
        border: 0,
        // Picked rows get a subtle grey fill so the selection reads even
        // without looking at the radio glyph.
        background: active ? "#F4F5F6" : "transparent",
        borderRadius: 10,
        color: "#0F1214",
        fontFamily: "inherit", textAlign: "left", cursor: "pointer",
        transition: "background 120ms ease",
      }}
    >
      {/* Radio indicator — outline ring with a filled dot when active.
          `accent` lets WHERE's "Show more" row swap in blue. */}
      <span style={{
        width: 18, height: 18, borderRadius: 999,
        border: `2px solid ${active ? accent : "#C8CDCD"}`,
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
      {icon && window.Icon && (
        <span style={{ display: "inline-flex", flexShrink: 0 }}>
          <window.Icon name={icon} size={18} strokeWidth={2} color={accent === "#1F4ED8" ? accent : "#4B5052"} />
        </span>
      )}
      <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={{
          fontSize: 15,
          fontWeight: active ? 600 : 500,
          color: accent === "#1F4ED8" ? accent : "#0F1214",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          lineHeight: 1.3,
        }}>{label}</span>
        {sub && (
          <span style={{
            fontSize: 12.5, color: "#4B5052", lineHeight: 1.3,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>{sub}</span>
        )}
      </span>
    </button>
  );

  // ---- Chip text per section ---------------------------------------------
  // Show committed value as a chip on the closed accordion. Single-select
  // now, so the chip is just the picked id (or a "Day · Time" join for
  // WHEN when both subsections have a value).
  const whereChip = v.where && v.where !== "Oakland, CA" ? v.where : null;
  const whatChip = activity || null;
  const whenChip = whenDay && whenTime ? `${whenDay} · ${whenTime}`
    : (whenDay || whenTime || null);
  const whoChip = v.who && v.who !== "1 Player" ? v.who : null;

  // ---- WHERE suggestion ranking ------------------------------------------
  // For the prototype we treat order in SB_WHERE_SUGGESTIONS as proximity
  // (clubs are pre-sorted by distance from the user's region). When the
  // user hasn't searched, show the 3 nearest + a "Show more within 5 mi"
  // expand trigger that reveals the rest of the corpus.
  const whereMatches = filterWhereSuggestions(whereQuery, 50);
  const visibleWhere = whereQuery
    ? whereMatches
    : showAllWhere
    ? whereMatches
    : whereMatches.slice(0, 3);
  const hiddenCount = !whereQuery && !showAllWhere ? whereMatches.length - visibleWhere.length : 0;

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
        style={{
          position: "absolute", left: 0, right: 0, bottom: 0,
          height: "92%",
          background: "#FFFFFF",
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
          <div style={{ width: 40, height: 4, borderRadius: 999, background: "#E9EBEC" }} />
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
            color: "#0F1214",
          }}>Search for anything</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              width: 44, height: 44, border: 0,
              background: "transparent",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer",
            }}
          >
            {window.Icon && <window.Icon name="X" size={22} strokeWidth={2} color="#0F1214" />}
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
              border: "1px solid #E9EBEC",
              background: "#FFFFFF",
              marginBottom: 4,
            }}>
              {window.Icon && <window.Icon name="Search" size={16} strokeWidth={2} color="#4B5052" />}
              <input
                type="text"
                value={whereQuery}
                onChange={(e) => { setWhereQuery(e.target.value); setShowAllWhere(false); }}
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
                  fontFamily: "inherit", fontSize: 14, color: "#0F1214",
                }}
              />
              {whereQuery && (
                <button
                  type="button"
                  onClick={() => setWhereQuery("")}
                  aria-label="Clear"
                  style={{
                    width: 24, height: 24, borderRadius: 999, border: 0,
                    background: "#F4F5F6", cursor: "pointer",
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  {window.Icon && <window.Icon name="X" size={14} strokeWidth={2.4} color="#4B5052" />}
                </button>
              )}
            </div>

            {/* Borderless stacked list — Current location pinned, then up
                to 3 nearest, then "Show more within 5 mi" expand. */}
            <div>
              <Row
                active={v.where === "Current location"}
                icon="Navigation"
                label="Use current location"
                onClick={() => { set("where", "Current location"); setOpenSection("what"); }}
              />
              {visibleWhere.length === 0 ? (
                <div style={{ padding: "16px 0", fontSize: 13, color: "#858F8F" }}>
                  No matches for "{whereQuery}"
                </div>
              ) : (
                visibleWhere.map((s) => (
                  <Row
                    key={`${s.kind}-${s.name}`}
                    active={v.where === s.name}
                    icon={SB_WHERE_KIND_ICON[s.kind] || "MapPin"}
                    label={s.name}
                    sub={s.sub}
                    onClick={() => { set("where", s.name); setOpenSection("what"); }}
                  />
                ))
              )}
              {hiddenCount > 0 && (
                // "Show more" — matches the Row layout exactly so it
                // aligns with the list items above. Plus icon sits where
                // the radio would sit (18px round, same -12px hit area),
                // label uses the blue accent.
                <button
                  type="button"
                  onClick={() => setShowAllWhere(true)}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    width: "100%",
                    padding: "10px 12px",
                    margin: "0 -12px",
                    border: 0, background: "transparent",
                    borderRadius: 10,
                    fontFamily: "inherit", textAlign: "left", cursor: "pointer",
                  }}
                >
                  <span style={{
                    width: 18, height: 18, borderRadius: 999,
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    {window.Icon && <window.Icon name="Plus" size={16} strokeWidth={2.4} color="#1F4ED8" />}
                  </span>
                  <span style={{
                    flex: 1, minWidth: 0,
                    fontSize: 15, fontWeight: 600, color: "#1F4ED8",
                    lineHeight: 1.3,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    Show more within 5 mi ({hiddenCount})
                  </span>
                </button>
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
              padding: "12px 0 6px 0",
              borderBottom: "1px solid #E9EBEC",
              fontFamily: "Axiforma, Inter, system-ui, sans-serif",
              fontSize: 10.5, fontWeight: 800,
              letterSpacing: 1.2, textTransform: "uppercase",
              color: "#858F8F", lineHeight: 1,
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
              padding: "12px 0 6px 0",
              borderBottom: "1px solid #E9EBEC",
              fontFamily: "Axiforma, Inter, system-ui, sans-serif",
              fontSize: 10.5, fontWeight: 800,
              letterSpacing: 1.2, textTransform: "uppercase",
              color: "#858F8F", lineHeight: 1,
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

          {/* ---- WHO — borderless row + contained pill stepper ----------- */}
          <SectionAccordion id="who" label="Who" chip={whoChip}>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "12px 0",
            }}>
              <span style={{
                fontFamily: "inherit", fontSize: 15, fontWeight: 500, color: "#0F1214",
              }}>Players (1 – 8)</span>
              {/* Single contained pill: [−] [N] [+] joined as one
                  borderless rounded capsule against a subtle grey fill.
                  The minus and plus glyphs sit inside without their own
                  strokes — the outer pill is the only container. */}
              <div style={{
                display: "inline-flex", alignItems: "center",
                background: "#F4F5F6",
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
                    color: "#0F1214",
                    cursor: playerCount <= 1 ? "not-allowed" : "pointer",
                    opacity: playerCount <= 1 ? 0.35 : 1,
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    padding: 0,
                  }}
                >
                  {window.Icon && <window.Icon name="Minus" size={16} strokeWidth={2.4} color="#0F1214" />}
                </button>
                <span style={{
                  minWidth: 32, textAlign: "center",
                  fontFamily: "Axiforma, Inter, system-ui, sans-serif",
                  fontWeight: 800, fontSize: 16, color: "#0F1214",
                  fontVariantNumeric: "tabular-nums",
                  padding: "0 4px",
                }}>{playerCount}</span>
                <button
                  type="button"
                  onClick={() => setPlayers(playerCount + 1)}
                  disabled={playerCount >= 8}
                  aria-label="More players"
                  style={{
                    width: 36, height: 36, borderRadius: 999,
                    border: 0, background: "transparent",
                    color: "#0F1214",
                    cursor: playerCount >= 8 ? "not-allowed" : "pointer",
                    opacity: playerCount >= 8 ? 0.35 : 1,
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    padding: 0,
                  }}
                >
                  {window.Icon && <window.Icon name="Plus" size={16} strokeWidth={2.4} color="#0F1214" />}
                </button>
              </div>
            </div>
          </SectionAccordion>
        </div>

        {/* Sticky footer — Search button sits on a gradient fade so the
            scrolling content above dissolves into white instead of clipping
            against a hard hairline. No top border. */}
        <div style={{
          padding: "20px 16px calc(12px + env(safe-area-inset-bottom)) 16px",
          background: "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.85) 35%, #FFFFFF 100%)",
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
              border: 0, background: "#0F1214", color: "#FFFFFF",
              fontFamily: "inherit", fontSize: 15, fontWeight: 700,
              display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
              cursor: "pointer",
            }}
          >
            {window.Icon && <window.Icon name="Search" size={16} strokeWidth={2.2} color="#fff" />}
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
  return (
    <>
    <button
      type="button"
      onClick={() => {
        // Tap opens the bottom sheet for editing facets. The legacy
        // `onExpand` prop still fires for callers that want a navigation
        // side-effect (kept for backwards compat).
        setOpen(true);
        onExpand && onExpand();
      }}
      style={{
        width: "100%",
        height: 52,
        borderRadius: 999,
        background: "#fff",
        border: 0,
        boxShadow: "0 1px 2px rgba(15,18,20,.06), 0 4px 14px rgba(15,18,20,.08), inset 0 0 0 1px rgba(15,18,20,.06)",
        padding: "0 8px 0 18px",
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
          fontSize: 10.5, color: "#858F8F",
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
          fontSize: 14, fontWeight: 500, color: "#0F1214",
          lineHeight: 1.2,
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          maxWidth: "100%", width: "100%",
        }}>
          {v.where}<span style={{ color: "#C8CDCD", margin: "0 6px" }}>•</span>{v.activity}<span style={{ color: "#C8CDCD", margin: "0 6px" }}>•</span>{v.when}<span style={{ color: "#C8CDCD", margin: "0 6px" }}>•</span>{v.who}
        </div>
      </div>
      <span style={{
        width: 36, height: 36, borderRadius: 999, background: "#0F1214",
        display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        {window.Icon && <window.Icon name="Search" size={16} strokeWidth={2.2} color="#fff" />}
      </span>
    </button>
    <MobileSearchSheet
      open={open}
      onClose={() => setOpen(false)}
      values={v}
      onChange={update}
      onSubmit={(committed) => onSubmit && onSubmit(committed)}
      theme={theme}
    />
    </>
  );
}

Object.assign(window, { SearchBar, SearchBarCompact, MobileSearchSheet });
