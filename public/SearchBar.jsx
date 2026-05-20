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
const SB_SPORTS = [
  { id: "Any Sport",   icon: "LayoutGrid" },
  { id: "Pickleball",  icon: "Hexagon" },
  { id: "Tennis",      icon: "Circle" },
  { id: "Padel",       icon: "Square" },
  { id: "Badminton",   icon: "Feather" },
  { id: "Platform Tennis", icon: "Grid3X3" },
];
const SB_WHEN_OPTIONS = [
  { id: "Any Day • Any Time", label: "Any time" },
  { id: "Today",              label: "Today" },
  { id: "Tomorrow",           label: "Tomorrow" },
  { id: "This Weekend",       label: "This weekend" },
  { id: "Next 7 Days",        label: "Next 7 days" },
];
const SB_WHEN_TIME_BUCKETS = [
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
  const setValue = (key, val) => {
    if (values && onChange) onChange({ ...values, [key]: val });
    else setInternal((prev) => ({ ...prev, [key]: val }));
  };

  // Which segment is currently focused. `null` = default state.
  const [active, setActive] = useStateSB(null);
  const containerRef = useRefSB(null);

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
  const segments = [
    { key: "where",    label: "WHERE",    value: v.where,    icon: "Navigation", anchorRef: whereRef },
    { key: "activity", label: "ACTIVITY", value: v.activity, icon: null,         anchorRef: activityRef },
    { key: "when",     label: "WHEN",     value: v.when,     icon: null,         anchorRef: whenRef },
    { key: "who",      label: "WHO",      value: v.who,      icon: null,         anchorRef: whoRef },
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
                  fontWeight: 600,
                  fontSize: SIZES.valueFs,
                  color: COLORS.value,
                  lineHeight: 1.2,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{seg.value}</span>
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
      return (
        <SBPopover anchorRef={anchorRef}>
          <div style={{ padding: "8px 12px 4px", fontSize: 10.5, fontWeight: 800, letterSpacing: 1.2, textTransform: "uppercase", color: "#4B5052" }}>
            Search by location
          </div>
          {SB_LOCATIONS.map((loc) => (
            <SBRow
              key={loc}
              icon={loc === "Current location" ? "Navigation" : "MapPin"}
              label={loc}
              selected={v.where === loc}
              onClick={() => { setValue("where", loc); setActive(null); }}
            />
          ))}
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

// ---- Mobile compact variant ----------------------------------------------
// Single-row pill that taps open the full SearchBar. Used in tight mobile
// chrome where the full 4-segment bar is too tall.
function SearchBarCompact({ theme, viewport = "mobile", values, onExpand }) {
  const v = values || {
    where: "Oakland, CA", activity: "Any Sport",
    when: "Any Day • Any Time", who: "1 Player",
  };
  return (
    <button
      type="button"
      onClick={onExpand}
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
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2, overflow: "hidden", flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "Axiforma, Inter", fontWeight: 800, fontSize: 13, color: "#0F1214", letterSpacing: -0.1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "100%" }}>
          {v.where}
        </div>
        <div style={{ fontSize: 11, fontWeight: 500, color: "#4B5052", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "100%" }}>
          {v.activity} · {v.when} · {v.who}
        </div>
      </div>
      <span style={{
        width: 36, height: 36, borderRadius: 999, background: "#0F1214",
        display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        {window.Icon && <window.Icon name="Search" size={16} strokeWidth={2.2} color="#fff" />}
      </span>
    </button>
  );
}

Object.assign(window, { SearchBar, SearchBarCompact });
