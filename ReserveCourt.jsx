// ─────────────────────────────────────────────────────────────────────────────
// ReserveCourtPage — the "Book a Court" reservation flow.
//
// Architecture (per implementation spec):
//   - One screen state lives at the root of Combined (`screen === "reserve-court"`).
//   - Internal sub-routing — booking ↔ confirmation — lives inside this
//     component as `flowScreen`, since Combined never needs to read it.
//   - All reservation data sits in one `reservation` object; sections write
//     into it, the confirmation screen reads off it.
//
// Session 2 — page shell + headers (booking & confirmation variants) +
// body scaffold. BookingBody / ConfirmationBody are stubbed; they'll be
// fleshed out in Sessions 3+.
//
// Notes on design-system substitutions:
//   - Icons: spec calls for Phosphor (`weight="light"`). The prototype-wide
//     standard is Lucide via the shared <Icon /> component, so we map names
//     (CaretLeft → ChevronLeft, etc) and keep stroke widths at 1.5 to match
//     Phosphor's Light feel.
//   - Tokens: color values use the Pickle Pixels primitives from
//     colors_and_type.css. Most are duplicated as inline hex for parity
//     with the rest of the prototype's style.
// ─────────────────────────────────────────────────────────────────────────────

// Pickle Pixels primitives — local alias so we don't re-type hex codes. Named
// with an RC_ prefix because each <script type="text/babel"> file shares
// implicit window-scope and we want to avoid name collisions with the rest
// of the prototype.
const RC_TOKENS = {
  surface: "#F4F5F6", // neutral-100 — page background
  elevated: "#FFFFFF", // card / header background
  subtle: "#F4F5F6", // subtle bg (same as surface for now)
  border: "#E9EBEC", // neutral-250 — hairline border
  borderStrong: "#DEE1E5", // neutral-300
  ink: "#0F1214", // primary text
  inkSoft: "#4B5052", // secondary text
  inkMuted: "#6F7476", // muted text / inactive icons
  inkDisabled: "#BBBFC1",
  primary: "#222424", // primary action surface per spec
  primaryHover: "#0F1214",
  success: "#2E7D32",
  warning: "#BD591F",
  warningBg: "#F9F3EE",
  warningFg: "#8F3C14",
  error: "#DA0B0B",
  errorBg: "#F7ECEB",
  errorFg: "#860606",
  onPrimary: "#FFFFFF"
};

// ── tiny shared toast ────────────────────────────────────────────────────
// Used by the Scheduler ghost button + a few "coming soon" stubs in the
// flow. Lives at the page root so the toast positions over the whole
// device frame.
function useRcToast() {
  const [msg, setMsg] = React.useState(null);
  const timerRef = React.useRef(null);
  const show = (text) => {
    setMsg(text);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setMsg(null), 2400);
  };
  React.useEffect(() => () => {if (timerRef.current) clearTimeout(timerRef.current);}, []);
  return { msg, show };
}

function RcToastSlot({ msg }) {
  if (!msg) return null;
  return (
    <div style={{
      position: "absolute", left: 0, right: 0, bottom: 24, zIndex: 80,
      display: "flex", justifyContent: "center", pointerEvents: "none"
    }}>
      <div style={{
        pointerEvents: "auto",
        background: RC_TOKENS.ink, color: "#fff",
        fontSize: 13, fontWeight: 500, lineHeight: 1.4,
        padding: "10px 16px", borderRadius: 8,
        boxShadow: "0 8px 24px rgba(0,0,0,0.18), 0 2px 4px rgba(0,0,0,0.06)",
        maxWidth: 320,
        animation: "rcToastIn 180ms ease-out"
      }}>{msg}</div>
      <style>{`
        @keyframes rcToastIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>);

}

// ── Header ───────────────────────────────────────────────────────────────
// One component, two variants. Booking: Back triggers cancel-confirmation.
// Confirmation: Back goes home immediately (no half-finished booking to
// lose — the reservation is already submitted in the prototype's happy path).
function RcHeader({ variant, isMobile, onLeft, onScheduler }) {
  const height = isMobile ? 56 : 72;
  const isBooking = variant === "booking";
  const leftLabel = isBooking ? "Back" : "Home";
  const centerLabel = isBooking ? "Book a Court" : "Reservation Details";

  return (
    <div style={{
      position: "sticky", top: 0, zIndex: 30,
      height,
      background: RC_TOKENS.elevated,
      borderBottom: `1px solid ${RC_TOKENS.border}`,
      // 3-column grid keeps the center title optically centered even when
      // the side actions are different widths.
      display: "grid",
      gridTemplateColumns: "1fr auto 1fr",
      alignItems: "center",
      padding: isMobile ? "0 12px" : "0 20px"
    }}>
      {/* Left — back / home */}
      <div style={{ justifySelf: "start" }}>
        <button
          onClick={onLeft}
          aria-label={leftLabel}
          style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            height: 36, padding: "0 10px 0 6px", borderRadius: 8,
            background: "transparent", border: 0,
            color: RC_TOKENS.ink, fontFamily: "inherit",
            fontSize: 14, fontWeight: 600, lineHeight: 1,
            cursor: "pointer", transition: "background 120ms"
          }}
          onMouseEnter={(e) => {e.currentTarget.style.background = RC_TOKENS.surface;}}
          onMouseLeave={(e) => {e.currentTarget.style.background = "transparent";}}>
          
          <Icon name="ChevronLeft" size={20} strokeWidth={1.5} color={RC_TOKENS.ink} />
          <span>{leftLabel}</span>
        </button>
      </div>

      {/* Center — page title */}
      <div style={{
        justifySelf: "center",
        fontWeight: 600, color: RC_TOKENS.ink,
        letterSpacing: -0.1, fontSize: "16px"
      }}>
        {centerLabel}
      </div>

      {/* Right — Scheduler ghost button */}
      <div style={{ justifySelf: "end" }}>
        <button
          onClick={onScheduler}
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            height: 32, padding: "0 12px", borderRadius: 6,
            background: "transparent",
            border: `1px solid ${RC_TOKENS.border}`,
            color: RC_TOKENS.inkSoft, fontFamily: "inherit",
            fontSize: 13, fontWeight: 600, lineHeight: 1,
            cursor: "pointer", transition: "background 120ms, border-color 120ms, color 120ms"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = RC_TOKENS.surface;
            e.currentTarget.style.borderColor = RC_TOKENS.borderStrong;
            e.currentTarget.style.color = RC_TOKENS.ink;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.borderColor = RC_TOKENS.border;
            e.currentTarget.style.color = RC_TOKENS.inkSoft;
          }}>
          
          <Icon name="CalendarRange" size={14} strokeWidth={1.5} color="currentColor" />
          <span>Scheduler</span>
        </button>
      </div>
    </div>);

}

// ── Stub panels — Sessions 4-8 will fill these in ────────────────────────
function RcStubPanel({ label, sub }) {
  return (
    <div style={{
      background: RC_TOKENS.elevated,
      border: `1px dashed ${RC_TOKENS.borderStrong}`,
      borderRadius: 8,
      padding: "28px 24px",
      textAlign: "center"
    }}>
      <div style={{
        fontFamily: "Axiforma, Inter, sans-serif", fontWeight: 800,
        fontSize: 10, letterSpacing: 1.4, textTransform: "uppercase",
        color: RC_TOKENS.inkMuted, marginBottom: 10
      }}>{label}</div>
      <div style={{
        fontSize: 14, lineHeight: 1.55, color: RC_TOKENS.inkSoft
      }}>{sub}</div>
    </div>);

}

// ── Shared accordion primitives (Session 3) ──────────────────────────────
// These get reused by every section in the booking flow. Kept inside this
// file because they encode the spec's exact tokens & states — no broader
// design-system contract yet (see "Design System Gaps" notes in the spec).

// SectionCard — the white container each section group sits inside.
function RcSectionCard({ children, disabled = false }) {
  return (
    <div style={{
      background: RC_TOKENS.elevated,
      border: `1px solid ${RC_TOKENS.border}`,
      borderRadius: 8,
      boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
      opacity: disabled ? 0.5 : 1,
      pointerEvents: disabled ? "none" : "auto",
      transition: "opacity 160ms",
      overflow: "hidden"
    }}>
      {children}
    </div>);

}

// 1px full-width hairline between rows.
function RcSectionDivider() {
  return <div style={{ height: 1, background: RC_TOKENS.border }} aria-hidden="true" />;
}

// OptionChip — interactive selection chip used inside expanded rows.
// `border/radius/xxs` (4px) per spec; pill shape is reserved for Tags.
function RcOptionChip({ label, selected, disabled, onClick }) {
  const bg = selected ? RC_TOKENS.primary : disabled ? RC_TOKENS.surface : RC_TOKENS.elevated;
  const border = selected ? RC_TOKENS.primary : disabled ? RC_TOKENS.border : RC_TOKENS.borderStrong;
  const fg = selected ? RC_TOKENS.onPrimary : disabled ? RC_TOKENS.inkDisabled : RC_TOKENS.ink;
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={{
        height: 40,
        padding: "10px 16px",
        borderRadius: 4,
        background: bg,
        border: `1px solid ${border}`,
        color: fg,
        fontFamily: "inherit",
        fontSize: 14,
        fontWeight: 600,
        lineHeight: 1,
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "background 150ms, border-color 150ms, color 150ms",
        textAlign: "center",
        whiteSpace: "nowrap"
      }}
      onMouseEnter={(e) => {
        if (disabled || selected) return;
        e.currentTarget.style.background = RC_TOKENS.subtle;
        e.currentTarget.style.borderColor = RC_TOKENS.inkDisabled;
      }}
      onMouseLeave={(e) => {
        if (disabled || selected) return;
        e.currentTarget.style.background = RC_TOKENS.elevated;
        e.currentTarget.style.borderColor = RC_TOKENS.borderStrong;
      }}>
      
      {label}
    </button>);

}

// SelectionChip — the pill summary on a collapsed/idle row that shows the
// row's current value with an inline clear button.
function RcSelectionChip({ value, onClear }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      height: 26, padding: "0 4px 0 10px",
      borderRadius: 9999,
      background: RC_TOKENS.subtle,
      border: `1px solid ${RC_TOKENS.borderStrong}`,
      color: "#2F3436",
      fontFamily: "inherit", fontSize: 12, fontWeight: 600,
      maxWidth: 220
    }}>
      <span style={{
        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
      }}>{value}</span>
      <button
        onClick={(e) => {e.stopPropagation();onClear && onClear();}}
        aria-label="Clear selection"
        style={{
          width: 18, height: 18, borderRadius: 9999,
          background: "transparent", border: 0, padding: 0,
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          color: RC_TOKENS.inkMuted, cursor: "pointer",
          transition: "background 120ms, color 120ms"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = RC_TOKENS.border;
          e.currentTarget.style.color = RC_TOKENS.ink;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = RC_TOKENS.inkMuted;
        }}>
        
        <Icon name="X" size={11} strokeWidth={1.6} color="currentColor" />
      </button>
    </span>);

}

// SectionRow — accordion row wrapper. Provides the tap target (icon +
// label + right-side chip/chevron), and on `expanded` renders `children`
// in a padded panel below. Each row owns a trailing SectionDivider unless
// `isLast` is set.
function RcSectionRow({ icon, label, chip, onClearChip, expanded, onToggle, disabled, isLast, children }) {
  const iconColor = disabled ? RC_TOKENS.inkDisabled : RC_TOKENS.inkMuted;
  const labelColor = disabled ? RC_TOKENS.inkDisabled : RC_TOKENS.inkSoft;
  return (
    <React.Fragment>
      <button
        onClick={disabled ? undefined : onToggle}
        disabled={disabled}
        style={{
          width: "100%", padding: "14px 16px",
          display: "flex", alignItems: "center", gap: 12,
          background: "transparent", border: 0,
          textAlign: "left", fontFamily: "inherit",
          cursor: disabled ? "not-allowed" : "pointer",
          minHeight: 56
        }}>
        
        <Icon name={icon} size={18} strokeWidth={1.5} color={iconColor} />
        <span style={{
          flex: 1, minWidth: 0,
          fontSize: 14, fontWeight: 600, color: labelColor, lineHeight: 1.25
        }}>{label}</span>
        {chip ?
        <RcSelectionChip value={chip} onClear={onClearChip} /> :

        <Icon name={expanded ? "ChevronUp" : "ChevronDown"} size={16} strokeWidth={1.5} color={RC_TOKENS.inkMuted} />
        }
      </button>
      {expanded && children &&
      <div style={{ padding: "0 16px 16px" }}>
          {children}
        </div>
      }
      {!isLast && <RcSectionDivider />}
    </React.Fragment>);

}

// Section header — the non-interactive title row at the top of each
// section card ("What Would You Like to Reserve?" etc).
// Section header — the title row at the top of each section card. When
// `onCollapse` is provided (i.e., the section is in a completable state
// and currently expanded), the whole row becomes clickable and shows a
// chevron-up affordance on the right so the user can collapse the
// section again. Without `onCollapse` it renders as a static title.
function RcSectionHeader({ title, disabled = false, onCollapse }) {
  const clickable = !!onCollapse && !disabled;
  return (
    <React.Fragment>
      <button
        type="button"
        onClick={clickable ? onCollapse : undefined}
        disabled={!clickable}
        style={{
          width: "100%",
          padding: "16px 16px 12px",
          background: "transparent", border: 0,
          textAlign: "left",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
          cursor: clickable ? "pointer" : "default",
          fontFamily: "inherit"
        }}>
        
        <span style={{
          fontSize: 14, fontWeight: 700, letterSpacing: -0.1,
          color: disabled ? RC_TOKENS.inkDisabled : RC_TOKENS.ink
        }}>{title}</span>
        {clickable &&
        <Icon name="ChevronUp" size={16} strokeWidth={1.5} color={RC_TOKENS.inkMuted} />
        }
      </button>
      <RcSectionDivider />
    </React.Fragment>);

}

// ── Section 1 — What to Reserve (Activity → Court Type → Format) ─────────
// Activity-driven option sets. Centralizing here keeps the row component
// (RcSection1) tidy.
const RC_COURT_TYPES = {
  Tennis: ["Hard", "Clay"],
  Pickleball: ["Indoor", "Outdoor"]
};
const RC_FORMATS = {
  Tennis: ["Tennis Doubles", "Tennis Singles"],
  Pickleball: ["Pickleball Doubles", "Pickleball Singles"]
};

function RcSection1({ reservation, setReservation, collapsed, setCollapsed }) {
  // Which row is open. "act" | "ct" | "fmt" | null.
  // Default opens Activity since nothing's picked yet.
  const [openRow, setOpenRow] = React.useState(reservation.activity ? null : "act");

  // When the whole section collapses (format complete) we lose track of
  // the open row; re-expanding the card should reopen wherever the user
  // last needs to revisit. Keep it lazy — only mutate when re-expanding.
  const reopen = () => {
    setCollapsed(false);
    // Default to the row whose value is missing first.
    if (!reservation.activity) setOpenRow("act");else
    if (!reservation.courtType) setOpenRow("ct");else
    if (!reservation.format) setOpenRow("fmt");else
    setOpenRow("fmt"); // re-edit format by default
  };

  // ── Handlers — each selection writes its own field, clears the
  // downstream fields, and advances the open row.
  const pickActivity = (a) => {
    setReservation((r) => ({ ...r, activity: a, courtType: null, format: null }));
    setOpenRow("ct");
  };
  const pickCourtType = (c) => {
    setReservation((r) => ({ ...r, courtType: c, format: null }));
    setOpenRow("fmt");
  };
  const pickFormat = (f) => {
    setReservation((r) => ({ ...r, format: f }));
    setOpenRow(null);
    // Collapse the whole section — useEffect would also do this but
    // setting directly here makes the intent legible.
    setCollapsed(true);
  };

  // Clear handlers wired to the SelectionChip X. Each cascades to the
  // downstream fields and reopens the row that's now unset.
  const clearActivity = () => {
    setReservation((r) => ({ ...r, activity: null, courtType: null, format: null }));
    setCollapsed(false);
    setOpenRow("act");
  };
  const clearCourtType = () => {
    setReservation((r) => ({ ...r, courtType: null, format: null }));
    setCollapsed(false);
    setOpenRow("ct");
  };
  const clearFormat = () => {
    setReservation((r) => ({ ...r, format: null }));
    setCollapsed(false);
    setOpenRow("fmt");
  };

  // Collapsed summary card — single-tap re-expansion. Shown only when the
  // section has a finished selection (format chosen) and collapsed=true.
  if (collapsed && reservation.format) {
    return (
      <RcSectionCard>
        <button
          onClick={reopen}
          style={{
            width: "100%", padding: "14px 16px",
            display: "flex", alignItems: "center", gap: 12,
            background: "transparent", border: 0,
            textAlign: "left", fontFamily: "inherit",
            cursor: "pointer"
          }}>
          
          <Icon name="Check" size={18} strokeWidth={1.5} color={RC_TOKENS.success} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 14, fontWeight: 700, color: RC_TOKENS.ink, letterSpacing: -0.1,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
            }}>{reservation.format}</div>
            <div style={{
              marginTop: 2,
              fontSize: 12, color: RC_TOKENS.inkMuted, fontWeight: 500,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
            }}>{reservation.activity} · {reservation.courtType}</div>
          </div>
          <Icon name="ChevronDown" size={16} strokeWidth={1.5} color={RC_TOKENS.inkMuted} />
        </button>
      </RcSectionCard>);

  }

  return (
    <RcSectionCard>
      <RcSectionHeader
        title="What Would You Like to Reserve?"
        onCollapse={reservation.format ? () => setCollapsed(true) : undefined} />
      

      {/* Row 1 — Activity */}
      <RcSectionRow
        icon="Search"
        label="Activity"
        chip={reservation.activity}
        onClearChip={clearActivity}
        expanded={openRow === "act"}
        onToggle={() => setOpenRow(openRow === "act" ? null : "act")}>
        
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8
        }}>
          {["Tennis", "Pickleball"].map((a) =>
          <RcOptionChip
            key={a}
            label={a}
            selected={reservation.activity === a}
            onClick={() => pickActivity(a)} />

          )}
        </div>
      </RcSectionRow>

      {/* Row 2 — Court Type (gated on activity) */}
      <RcSectionRow
        icon="Grid3x3"
        label="Type & Court"
        chip={reservation.courtType}
        onClearChip={clearCourtType}
        expanded={openRow === "ct"}
        onToggle={() => setOpenRow(openRow === "ct" ? null : "ct")}
        disabled={!reservation.activity}>
        
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8
        }}>
          {(RC_COURT_TYPES[reservation.activity] || []).map((c) =>
          <RcOptionChip
            key={c}
            label={c}
            selected={reservation.courtType === c}
            onClick={() => pickCourtType(c)} />

          )}
        </div>
      </RcSectionRow>

      {/* Row 3 — Format (gated on court type), last row → no trailing divider */}
      <RcSectionRow
        icon="Users"
        label="Format"
        chip={reservation.format}
        onClearChip={clearFormat}
        expanded={openRow === "fmt"}
        onToggle={() => setOpenRow(openRow === "fmt" ? null : "fmt")}
        disabled={!reservation.courtType}
        isLast>
        
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8
        }}>
          {(RC_FORMATS[reservation.activity] || []).map((f) =>
          <RcOptionChip
            key={f}
            label={f}
            selected={reservation.format === f}
            onClick={() => pickFormat(f)} />

          )}
        </div>
      </RcSectionRow>
    </RcSectionCard>);

}

// ── Section 2 — When to Reserve (Duration + Date & Time) ─────────────────
// Per spec: duration first (6 options), date pills (next 3 days from
// today + month nav), then time tabs (Morning/Afternoon/Evening) with a
// 3-col grid of slot chips. The whole section is gated on Section 1
// being complete (reservation.format set).

const RC_DURATIONS = ["30 min", "45 min", "1 hr", "1 hr 15 min", "1 hr 30 min", "2 hr"];

const RC_DURATION_MINUTES = {
  "30 min": 30, "45 min": 45, "1 hr": 60,
  "1 hr 15 min": 75, "1 hr 30 min": 90, "2 hr": 120
};

// Reference date — May 17, 2026 per the spec/prototype's current frame.
const RC_TODAY = new Date(2026, 4, 17);

// Time slot pool — grouped by tod tab.
const RC_TIME_SLOTS = {
  Morning: ["7:00 AM", "7:30 AM", "8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM"],
  Afternoon: ["12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM"],
  Evening: ["5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM"]
};

// addMinutes("7:00 AM", 75) → "8:15 AM". Helper for the collapsed
// summary + confirmation screen.
function rcAddMinutes(timeStr, mins) {
  const [time, period] = timeStr.split(" ");
  const [h, m] = time.split(":").map(Number);
  let total = (period === "PM" && h !== 12 ? h + 12 : period === "AM" && h === 12 ? 0 : h) * 60 + m + mins;
  total = (total % (24 * 60) + 24 * 60) % (24 * 60);
  const nh = Math.floor(total / 60) % 24;
  const nm = total % 60;
  const disp = nh % 12 === 0 ? 12 : nh % 12;
  return `${disp}:${String(nm).padStart(2, "0")} ${nh >= 12 ? "PM" : "AM"}`;
}

function rcSameDate(a, b) {
  return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

// Day label used in the collapsed summary + confirmation ticket.
function rcGetDateLabel(date) {
  if (!date) return "";
  const diff = Math.round((date - RC_TODAY) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}

function rcFormatDateChip(date) {
  if (!date) return "";
  const diff = Math.round((date - RC_TODAY) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

// Generate the 3-day strip starting today. Spec says "next 3 days from
// today" — we always anchor at the calMonth's "first picked-able date"
// when navigating months. For today's month we start at RC_TODAY; for
// future months we start at the 1st of that month.
function rcDateStrip(calMonth) {
  const isCurrentMonth =
  calMonth.getFullYear() === RC_TODAY.getFullYear() &&
  calMonth.getMonth() === RC_TODAY.getMonth();
  const start = isCurrentMonth ?
  new Date(RC_TODAY) :
  new Date(calMonth.getFullYear(), calMonth.getMonth(), 1);
  return [0, 1, 2].map((d) => {
    const dt = new Date(start);
    dt.setDate(start.getDate() + d);
    return dt;
  });
}

function RcSection2({ reservation, setReservation, disabled, collapsed, setCollapsed }) {
  // Local row state — duration first; date & time as one logical row.
  const [openRow, setOpenRow] = React.useState(reservation.duration ? "dt" : "dur");
  const [calMonth, setCalMonth] = React.useState(new Date(RC_TODAY.getFullYear(), RC_TODAY.getMonth(), 1));
  const [todTab, setTodTab] = React.useState("Morning");

  // Reset open row when the section unlocks for the first time — i.e.
  // user just completed Section 1.
  React.useEffect(() => {
    if (!disabled && !reservation.duration) setOpenRow("dur");
  }, [disabled, reservation.duration]);

  const reopen = () => {
    setCollapsed(false);
    if (!reservation.duration) setOpenRow("dur");else
    if (!reservation.date || !reservation.timeSlot) setOpenRow("dt");else
    setOpenRow("dt");
  };

  // ── Handlers ────────────────────────────────────────────────────────
  const pickDuration = (d) => {
    // Pre-select today as the default date the moment the user picks a
    // duration. Saves a click in the common path; the user can always
    // pick a different pill or step the month.
    setReservation((r) => ({
      ...r,
      duration: d,
      date: r.date || new Date(RC_TODAY)
    }));
    setOpenRow("dt");
  };
  const pickDate = (dt) => {
    setReservation((r) => ({ ...r, date: dt, timeSlot: null }));
  };
  const pickSlot = (s) => {
    setReservation((r) => ({ ...r, timeSlot: s }));
    setOpenRow(null);
    setCollapsed(true);
  };

  const clearDuration = () => {
    setReservation((r) => ({ ...r, duration: null, date: null, timeSlot: null }));
    setCollapsed(false);
    setOpenRow("dur");
  };
  const clearDateTime = () => {
    setReservation((r) => ({ ...r, date: null, timeSlot: null }));
    setCollapsed(false);
    setOpenRow("dt");
  };

  // ── Collapsed summary ───────────────────────────────────────────────
  if (collapsed && reservation.duration && reservation.date && reservation.timeSlot) {
    const mins = RC_DURATION_MINUTES[reservation.duration] || 60;
    const endTime = rcAddMinutes(reservation.timeSlot, mins);
    return (
      <RcSectionCard>
        <button
          onClick={reopen}
          style={{
            width: "100%", padding: "14px 16px",
            display: "flex", alignItems: "center", gap: 12,
            background: "transparent", border: 0,
            textAlign: "left", fontFamily: "inherit",
            cursor: "pointer"
          }}>
          
          <Icon name="Check" size={18} strokeWidth={1.5} color={RC_TOKENS.success} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 14, fontWeight: 700, color: RC_TOKENS.ink, letterSpacing: -0.1,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
            }}>{rcGetDateLabel(reservation.date)}</div>
            <div style={{
              marginTop: 2,
              fontSize: 12, color: RC_TOKENS.inkMuted, fontWeight: 500,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
            }}>{reservation.timeSlot} – {endTime} · {reservation.duration}</div>
          </div>
          <Icon name="ChevronDown" size={16} strokeWidth={1.5} color={RC_TOKENS.inkMuted} />
        </button>
      </RcSectionCard>);

  }

  // Date strip for the calMonth.
  const dateStrip = rcDateStrip(calMonth);
  const monthLabel = calMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <RcSectionCard disabled={disabled}>
      <RcSectionHeader
        title="When Would You Like to Reserve?"
        disabled={disabled}
        onCollapse={reservation.duration && reservation.date && reservation.timeSlot ?
        () => setCollapsed(true) :
        undefined} />
      

      {/* Row 1 — Duration */}
      <RcSectionRow
        icon="Clock"
        label="Duration"
        chip={reservation.duration}
        onClearChip={clearDuration}
        expanded={openRow === "dur"}
        onToggle={() => setOpenRow(openRow === "dur" ? null : "dur")}
        disabled={disabled}>
        
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8
        }}>
          {RC_DURATIONS.map((d) =>
          <RcOptionChip
            key={d}
            label={d}
            selected={reservation.duration === d}
            onClick={() => pickDuration(d)} />

          )}
        </div>
      </RcSectionRow>

      {/* Row 2 — Date & Time (gated on duration, last row → no trailing divider) */}
      <RcSectionRow
        icon="Calendar"
        label="Date & Time"
        chip={reservation.date && reservation.timeSlot ?
        `${rcFormatDateChip(reservation.date)} · ${reservation.timeSlot}` :
        null}
        onClearChip={clearDateTime}
        expanded={openRow === "dt"}
        onToggle={() => setOpenRow(openRow === "dt" ? null : "dt")}
        disabled={disabled || !reservation.duration}
        isLast>
        
        {/* Month nav row */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: 10
        }}>
          <button
            onClick={() => {
              // Only step back if doing so wouldn't land before the
              // current month — we don't allow past months.
              const prev = new Date(calMonth.getFullYear(), calMonth.getMonth() - 1, 1);
              const minMonth = new Date(RC_TODAY.getFullYear(), RC_TODAY.getMonth(), 1);
              if (prev >= minMonth) setCalMonth(prev);
            }}
            aria-label="Previous month"
            style={{
              width: 28, height: 28, borderRadius: 8,
              background: "transparent", border: 0, padding: 0,
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              color: RC_TOKENS.ink, cursor: "pointer", transition: "background 120ms"
            }}
            onMouseEnter={(e) => {e.currentTarget.style.background = RC_TOKENS.subtle;}}
            onMouseLeave={(e) => {e.currentTarget.style.background = "transparent";}}>
            
            <Icon name="ChevronLeft" size={16} strokeWidth={1.5} color="currentColor" />
          </button>
          <div style={{ fontSize: 14, fontWeight: 600, color: RC_TOKENS.ink, letterSpacing: -0.1 }}>
            {monthLabel}
          </div>
          <button
            onClick={() => setCalMonth(new Date(calMonth.getFullYear(), calMonth.getMonth() + 1, 1))}
            aria-label="Next month"
            style={{
              width: 28, height: 28, borderRadius: 8,
              background: "transparent", border: 0, padding: 0,
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              color: RC_TOKENS.ink, cursor: "pointer", transition: "background 120ms"
            }}
            onMouseEnter={(e) => {e.currentTarget.style.background = RC_TOKENS.subtle;}}
            onMouseLeave={(e) => {e.currentTarget.style.background = "transparent";}}>
            
            <Icon name="ChevronRight" size={16} strokeWidth={1.5} color="currentColor" />
          </button>
        </div>

        {/* Date pills — 3-col grid, "next 3 days" of the active month */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8
        }}>
          {dateStrip.map((dt) => {
            const on = rcSameDate(reservation.date, dt);
            const weekday = dt.toLocaleDateString("en-US", { weekday: "short" });
            return (
              <button
                key={dt.toISOString()}
                onClick={() => pickDate(dt)}
                style={{
                  height: 64, padding: "8px 0", borderRadius: 8,
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4,
                  background: on ? RC_TOKENS.primary : RC_TOKENS.elevated,
                  border: `1px solid ${on ? RC_TOKENS.primary : RC_TOKENS.borderStrong}`,
                  color: on ? RC_TOKENS.onPrimary : RC_TOKENS.ink,
                  fontFamily: "inherit", cursor: "pointer",
                  transition: "background 150ms, border-color 150ms, color 150ms"
                }}
                onMouseEnter={(e) => {
                  if (on) return;
                  e.currentTarget.style.background = RC_TOKENS.subtle;
                  e.currentTarget.style.borderColor = RC_TOKENS.inkDisabled;
                }}
                onMouseLeave={(e) => {
                  if (on) return;
                  e.currentTarget.style.background = RC_TOKENS.elevated;
                  e.currentTarget.style.borderColor = RC_TOKENS.borderStrong;
                }}>
                
                <span style={{
                  fontSize: 11, fontWeight: 600,
                  letterSpacing: 0.4, textTransform: "uppercase",
                  opacity: on ? 0.85 : 0.7
                }}>{weekday}</span>
                <span style={{
                  fontFamily: "inherit", fontWeight: 800, fontSize: 18, letterSpacing: -0.3, lineHeight: 1
                }}>{dt.getDate()}</span>
              </button>);

          })}
        </div>

        {/* Time tabs + slot grid — only after a date is picked. */}
        {reservation.date &&
        <div style={{ marginTop: 16 }}>
            {/* Segmented control */}
            <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 4,
            background: RC_TOKENS.subtle,
            padding: 4, borderRadius: 8,
            marginBottom: 12
          }}>
              {["Morning", "Afternoon", "Evening"].map((p) => {
              const on = todTab === p;
              return (
                <button
                  key={p}
                  onClick={() => setTodTab(p)}
                  style={{
                    height: 32, borderRadius: 6,
                    background: on ? RC_TOKENS.primary : "transparent",
                    border: 0, padding: 0,
                    color: on ? RC_TOKENS.onPrimary : RC_TOKENS.inkMuted,
                    fontFamily: "inherit", fontSize: 12, fontWeight: 700,
                    letterSpacing: 0.2,
                    cursor: "pointer",
                    transition: "background 150ms, color 150ms"
                  }}
                  onMouseEnter={(e) => {
                    if (on) return;
                    // Spec: hover on inactive tab tints green per DS.
                    e.currentTarget.style.background = "#E7F2EC";
                    e.currentTarget.style.color = RC_TOKENS.success;
                  }}
                  onMouseLeave={(e) => {
                    if (on) return;
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = RC_TOKENS.inkMuted;
                  }}>
                  
                    {p}
                  </button>);

            })}
            </div>

            {/* Slot grid */}
            <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8
          }}>
              {(RC_TIME_SLOTS[todTab] || []).map((slot) =>
            <RcOptionChip
              key={slot}
              label={slot}
              selected={reservation.timeSlot === slot}
              onClick={() => pickSlot(slot)} />

            )}
            </div>
          </div>
        }
      </RcSectionRow>
    </RcSectionCard>);

}

// ── Section 3 — Who's Playing (player picker + bottom sheet) ─────────────
// Pool drawn from the prototype's existing PLAYER.network (4 entries),
// supplemented with two extra mock members so we can show "people you
// may know" with a few unselected rows alongside the picked ones.
const RC_PLAYER_POOL = [
// From PLAYER.network — same colors/initials/dupr so the rest of the
// app and this picker agree on identity.
{ id: "p1", name: "Mia Castellanos", first: "Mia", avatar: "MC", color: "#D6573B", club: "Old Coast", dupr: 4.3, friend: true },
{ id: "p2", name: "Reese Tanaka", first: "Reese", avatar: "RT", color: "#1F4ED8", club: "Old Coast", dupr: 4.1, friend: true },
{ id: "p3", name: "Sam Becker", first: "Sam", avatar: "SB", color: "#0F1214", club: "Old Coast", dupr: 4.2, friend: false },
{ id: "p4", name: "Priya Shah", first: "Priya", avatar: "PS", color: "#8E5BE8", club: "Dill Dinkers", dupr: 4.4, friend: true },
// Two more so the unselected list has variety.
{ id: "p5", name: "Tom Becker", first: "Tom", avatar: "TB", color: "#C77700", club: "Old Coast", dupr: 4.0, friend: false },
{ id: "p6", name: "Coach Reid", first: "Reid", avatar: "CR", color: "#2E5D52", club: "Old Coast", dupr: 4.6, friend: true }];


function rcMinPlayers(format) {
  if (!format) return 2;
  return format.includes("Doubles") ? 4 : 2;
}

function RcSection3({ reservation, setReservation, disabled, collapsed, setCollapsed, onOpenSheet }) {
  const min = rcMinPlayers(reservation.format);
  const pickedCount = (reservation.players || []).length + (reservation.guests || []).length;
  const labelText = pickedCount === 0 ? "Add players" : `${pickedCount + 1} players selected`;

  const reopen = () => {
    setCollapsed(false);
    onOpenSheet();
  };

  if (collapsed && pickedCount >= min - 1) {
    // Names list (other than self). Falls back to "Solo booking".
    const otherNames = [
    ...(reservation.players || []).map((id) => {
      const p = RC_PLAYER_POOL.find((x) => x.id === id);
      return p ? p.first : null;
    }).filter(Boolean),
    ...(reservation.guests || []).map((g) => g.first)];

    return (
      <RcSectionCard>
        <button
          onClick={reopen}
          style={{
            width: "100%", padding: "14px 16px",
            display: "flex", alignItems: "center", gap: 12,
            background: "transparent", border: 0,
            textAlign: "left", fontFamily: "inherit",
            cursor: "pointer"
          }}>
          
          <Icon name="Check" size={18} strokeWidth={1.5} color={RC_TOKENS.success} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 14, fontWeight: 700, color: RC_TOKENS.ink, letterSpacing: -0.1,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
            }}>Joshua Barriga</div>
            <div style={{
              marginTop: 2,
              fontSize: 12, color: RC_TOKENS.inkMuted, fontWeight: 500,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
            }}>{otherNames.length ? otherNames.join(" · ") : "Solo booking"}</div>
          </div>
          <Icon name="ChevronDown" size={16} strokeWidth={1.5} color={RC_TOKENS.inkMuted} />
        </button>
      </RcSectionCard>);

  }

  return (
    <RcSectionCard disabled={disabled}>
      <RcSectionHeader
        title="Who's Playing?"
        disabled={disabled}
        onCollapse={pickedCount >= min - 1 ? () => setCollapsed(true) : undefined} />
      
      <button
        onClick={disabled ? undefined : onOpenSheet}
        disabled={disabled}
        style={{
          width: "100%", padding: "14px 16px",
          display: "flex", alignItems: "center", gap: 12,
          background: "transparent", border: 0,
          textAlign: "left", fontFamily: "inherit",
          cursor: disabled ? "not-allowed" : "pointer",
          minHeight: 56
        }}>
        
        <Icon name="Users" size={18} strokeWidth={1.5}
        color={disabled ? RC_TOKENS.inkDisabled : RC_TOKENS.inkMuted} />
        <span style={{
          flex: 1, minWidth: 0,
          fontSize: 14, fontWeight: 600,
          color: disabled ? RC_TOKENS.inkDisabled : RC_TOKENS.inkSoft
        }}>{labelText}</span>
        <Icon name="ChevronRight" size={16} strokeWidth={1.5} color={RC_TOKENS.inkMuted} />
      </button>
    </RcSectionCard>);

}

// ── PlayersSheet (bottom sheet) ─────────────────────────────────────────
// Has two internal "pages": the player picker (list) and the add-guest
// form. The sheet swaps its content in place rather than stacking a
// second modal — back arrow returns to the list.
function RcPlayersSheet({ open, reservation, setReservation, onClose }) {
  const [query, setQuery] = React.useState("");
  const [showError, setShowError] = React.useState(false);
  // "list" | "addGuest" — internal page within the sheet.
  const [sheetPage, setSheetPage] = React.useState("list");
  // Working copies so the user can cancel out by closing — we only commit
  // on Confirm. The sheet is intentionally non-destructive until then.
  const [draftPlayers, setDraftPlayers] = React.useState(reservation.players || []);
  const [draftGuests, setDraftGuests] = React.useState(reservation.guests || []);
  // Add-guest form fields. Live in the sheet so they survive a swap
  // back to the list and forward to the form (e.g. accidental tap).
  const [guestFirst, setGuestFirst] = React.useState("");
  const [guestLast, setGuestLast] = React.useState("");
  const [guestEmail, setGuestEmail] = React.useState("");
  const [guestPhone, setGuestPhone] = React.useState("");

  // Sync when the sheet (re)opens.
  React.useEffect(() => {
    if (open) {
      setDraftPlayers(reservation.players || []);
      setDraftGuests(reservation.guests || []);
      setQuery("");
      setShowError(false);
      setSheetPage("list");
      setGuestFirst("");setGuestLast("");setGuestEmail("");setGuestPhone("");
    }
  }, [open, reservation.players, reservation.guests]);

  if (!open) return null;

  const togglePlayer = (id) => {
    setShowError(false);
    setDraftPlayers((cur) => cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]);
  };
  const removeGuest = (id) => {
    setShowError(false);
    setDraftGuests((cur) => cur.filter((g) => g.id !== id));
  };
  const onConfirm = () => {
    const min = rcMinPlayers(reservation.format);
    const total = 1 + draftPlayers.length + draftGuests.length;
    if (total < min) {
      setShowError(true);
      return;
    }
    setReservation((r) => ({ ...r, players: draftPlayers, guests: draftGuests }));
    onClose();
  };
  const canAddGuest = guestFirst.trim().length > 0 && guestLast.trim().length > 0;
  const submitGuest = () => {
    if (!canAddGuest) return;
    const guest = {
      id: `g-${Date.now()}`,
      first: guestFirst.trim(),
      last: guestLast.trim(),
      email: guestEmail.trim() || null,
      phone: guestPhone.trim() || null
    };
    setDraftGuests((g) => [...g, guest]);
    // Reset form + return to list — feels like a push-pop nav.
    setGuestFirst("");setGuestLast("");setGuestEmail("");setGuestPhone("");
    setSheetPage("list");
  };
  const cancelGuest = () => {
    setGuestFirst("");setGuestLast("");setGuestEmail("");setGuestPhone("");
    setSheetPage("list");
  };

  const min = rcMinPlayers(reservation.format);
  const total = 1 + draftPlayers.length + draftGuests.length;
  const canConfirm = total >= min;

  const q = query.trim().toLowerCase();
  const selectedPool = RC_PLAYER_POOL.filter((p) => draftPlayers.includes(p.id));
  const unselectedPool = RC_PLAYER_POOL.
  filter((p) => !draftPlayers.includes(p.id)).
  filter((p) => !q || p.name.toLowerCase().includes(q) || p.club.toLowerCase().includes(q));

  const onAddGuests = () => setSheetPage("addGuest");

  return (
    <div
      onClick={onClose}
      style={{
        position: "absolute", inset: 0, zIndex: 70,
        background: "rgba(0,0,0,0.45)",
        display: "flex", alignItems: "flex-end", justifyContent: "center",
        animation: "rcSheetFade 180ms ease-out"
      }}>
      
      <style>{`
        @keyframes rcSheetFade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes rcSheetUp { from { transform: translateY(16px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes rcSheetSwap { from { opacity: 0; transform: translateX(8px); } to { opacity: 1; transform: translateX(0); } }
      `}</style>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: 560, maxHeight: "88%",
          background: RC_TOKENS.elevated,
          borderTopLeftRadius: 8, borderTopRightRadius: 8,
          display: "flex", flexDirection: "column",
          boxShadow: "0 -4px 32px rgba(0,0,0,0.18)",
          animation: "rcSheetUp 220ms cubic-bezier(.2,.8,.2,1)"
        }}>
        
        {/* Drag handle */}
        <div style={{ width: 36, height: 4, borderRadius: 999, background: RC_TOKENS.subtle, margin: "12px auto 4px" }} />

        {sheetPage === "list" ?
        <RcPlayersListPage
          query={query} setQuery={setQuery}
          showError={showError} min={min} total={total} canConfirm={canConfirm}
          format={reservation.format}
          selectedPool={selectedPool} unselectedPool={unselectedPool}
          draftGuests={draftGuests}
          onClose={onClose}
          togglePlayer={togglePlayer}
          removeGuest={removeGuest}
          onConfirm={onConfirm}
          onAddGuests={onAddGuests} /> :


        <RcAddGuestPage
          first={guestFirst} setFirst={setGuestFirst}
          last={guestLast} setLast={setGuestLast}
          email={guestEmail} setEmail={setGuestEmail}
          phone={guestPhone} setPhone={setGuestPhone}
          canAdd={canAddGuest}
          onBack={cancelGuest}
          onSubmit={submitGuest} />

        }
      </div>
    </div>);

}

// "List" page — original picker UI extracted into a sub-component so the
// in-sheet page swap reads cleanly.
function RcPlayersListPage({
  query, setQuery, showError, min, total, canConfirm, format,
  selectedPool, unselectedPool, draftGuests,
  onClose, togglePlayer, removeGuest, onConfirm, onAddGuests
}) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", flex: 1, minHeight: 0,
      animation: "rcSheetSwap 200ms cubic-bezier(.2,.8,.2,1)"
    }}>
      {/* Header */}
      <div style={{ padding: "8px 16px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontFamily: "inherit", fontWeight: 700, fontSize: 18, letterSpacing: -0.2, color: RC_TOKENS.ink }}>Players</div>
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            width: 32, height: 32, borderRadius: 9999,
            background: "transparent", border: 0,
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: RC_TOKENS.ink, transition: "background 120ms"
          }}
          onMouseEnter={(e) => {e.currentTarget.style.background = RC_TOKENS.subtle;}}
          onMouseLeave={(e) => {e.currentTarget.style.background = "transparent";}}>
          
          <Icon name="X" size={16} strokeWidth={1.6} color="currentColor" />
        </button>
      </div>

      {/* Search */}
      <div style={{ padding: "0 16px 12px" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          height: 40, padding: "0 12px", borderRadius: 8,
          background: RC_TOKENS.subtle
        }}>
          <Icon name="Search" size={15} strokeWidth={1.5} color={RC_TOKENS.inkMuted} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find or Add a Player…"
            style={{
              flex: 1, height: "100%", padding: 0, border: 0,
              background: "transparent", outline: "none",
              fontFamily: "inherit", fontSize: 13, fontWeight: 500, color: RC_TOKENS.ink
            }} />
          
        </div>
      </div>

      {/* Scroll body */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 16px 0" }}>
        <div style={{
          padding: "8px 0", fontSize: 10, fontWeight: 700, letterSpacing: 1.6, textTransform: "uppercase",
          color: RC_TOKENS.inkMuted
        }}>Selected</div>

        <RcPlayerRow
          avatar="JB"
          color={RC_TOKENS.primary}
          name="Joshua Barriga"
          sub="You · Old Coast Pickleball member"
          selected
          locked />
        

        {selectedPool.map((p) =>
        <RcPlayerRow
          key={p.id}
          avatar={p.avatar}
          color={p.color}
          name={p.name}
          sub={`${p.club} · DUPR ${p.dupr.toFixed(1)}`}
          selected
          friend={p.friend}
          onToggle={() => togglePlayer(p.id)} />

        )}

        {draftGuests.map((g) =>
        <RcPlayerRow
          key={g.id}
          guest
          name={`${g.first} ${g.last}`}
          sub="Guest"
          selected
          onRemove={() => removeGuest(g.id)} />

        )}

        <RcSectionDivider />

        <div style={{
          padding: "12px 0 8px", fontSize: 10, fontWeight: 700, letterSpacing: 1.6, textTransform: "uppercase",
          color: RC_TOKENS.inkMuted
        }}>People you may know</div>

        {unselectedPool.length === 0 &&
        <div style={{ padding: "16px 0", fontSize: 13, color: RC_TOKENS.inkMuted, textAlign: "center" }}>
            No matches for "{query}".
          </div>
        }
        {unselectedPool.map((p) =>
        <RcPlayerRow
          key={p.id}
          avatar={p.avatar}
          color={p.color}
          name={p.name}
          sub={`${p.club} · DUPR ${p.dupr.toFixed(1)}`}
          friend={p.friend}
          onToggle={() => togglePlayer(p.id)} />

        )}

        <button
          onClick={onAddGuests}
          style={{
            width: "100%", height: 48, marginTop: 12, marginBottom: 12,
            borderRadius: 8, padding: "0 16px",
            background: RC_TOKENS.elevated,
            border: `1px solid ${RC_TOKENS.primary}`,
            color: RC_TOKENS.primary,
            fontFamily: "inherit", fontWeight: 600, fontSize: 14,
            cursor: "pointer",
            display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
            transition: "background 120ms"
          }}
          onMouseEnter={(e) => {e.currentTarget.style.background = RC_TOKENS.subtle;}}
          onMouseLeave={(e) => {e.currentTarget.style.background = RC_TOKENS.elevated;}}>
          
          <Icon name="UserPlus" size={15} strokeWidth={1.5} color={RC_TOKENS.primary} />
          Add Guests
        </button>
      </div>

      {showError && total < min &&
      <div style={{
        margin: "0 16px 12px",
        display: "flex", alignItems: "flex-start", gap: 10,
        padding: "10px 12px", borderRadius: 8,
        background: RC_TOKENS.errorBg,
        border: `1px solid ${RC_TOKENS.error}`,
        color: RC_TOKENS.errorFg
      }}>
          <Icon name="AlertTriangle" size={15} strokeWidth={1.5} color={RC_TOKENS.errorFg} />
          <span style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.4 }}>
            Add at least {min} players for {format?.includes("Doubles") ? "doubles" : "singles"}.
          </span>
        </div>
      }

      <div style={{ padding: "12px 16px 16px" }}>
        <button
          onClick={onConfirm}
          disabled={!canConfirm}
          style={{
            width: "100%", height: 48, borderRadius: 8,
            background: canConfirm ? RC_TOKENS.primary : RC_TOKENS.border,
            color: canConfirm ? RC_TOKENS.onPrimary : RC_TOKENS.inkDisabled,
            border: 0, fontFamily: "inherit", fontWeight: 700, fontSize: 14,
            cursor: canConfirm ? "pointer" : "not-allowed"
          }}>
          
          Confirm Players
        </button>
      </div>
    </div>);

}

// "Add a Guest" sub-page — same sheet, swapped body. Back arrow returns
// to the list page so there's no nested modal.
function RcAddGuestPage({ first, setFirst, last, setLast, email, setEmail, phone, setPhone, canAdd, onBack, onSubmit }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", flex: 1, minHeight: 0,
      animation: "rcSheetSwap 200ms cubic-bezier(.2,.8,.2,1)"
    }}>
      {/* Header — back chevron on the left, title centered. Functions as
             the page-level "navbar" inside the sheet. */}
      <div style={{
        padding: "8px 16px 12px",
        display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center"
      }}>
        <button
          onClick={onBack}
          aria-label="Back to players"
          style={{
            justifySelf: "start",
            display: "inline-flex", alignItems: "center", gap: 4,
            height: 32, padding: "0 8px 0 4px", borderRadius: 6,
            background: "transparent", border: 0, cursor: "pointer",
            color: RC_TOKENS.ink, fontFamily: "inherit", fontWeight: 600, fontSize: 13,
            transition: "background 120ms"
          }}
          onMouseEnter={(e) => {e.currentTarget.style.background = RC_TOKENS.subtle;}}
          onMouseLeave={(e) => {e.currentTarget.style.background = "transparent";}}>
          
          <Icon name="ChevronLeft" size={18} strokeWidth={1.5} color="currentColor" />
          Players
        </button>
        <div style={{
          justifySelf: "center",
          fontFamily: "inherit", fontWeight: 700, fontSize: 16,
          color: RC_TOKENS.ink, letterSpacing: -0.1
        }}>Add a Guest</div>
        <div style={{ justifySelf: "end", width: 32 }} aria-hidden="true" />
      </div>

      <RcSectionDivider />

      {/* Form body — scrollable to handle the iOS keyboard intruding. */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <RcInput label="First name" value={first} onChange={setFirst} required />
          <RcInput label="Last name" value={last} onChange={setLast} required />
          <RcInput label="Email" value={email} onChange={setEmail} type="email" />
          <RcInput label="Phone" value={phone} onChange={setPhone} type="tel" />
        </div>
      </div>

      {/* Footer — Cancel + Add Guest, mirrors the modal's button row but
             docked to the sheet. */}
      <div style={{
        padding: "12px 16px 16px",
        display: "flex", gap: 12,
        borderTop: `1px solid ${RC_TOKENS.border}`
      }}>
        <button
          onClick={onBack}
          style={{
            flex: 1, height: 44, borderRadius: 8,
            background: RC_TOKENS.elevated, border: `1px solid ${RC_TOKENS.borderStrong}`,
            color: RC_TOKENS.ink, fontFamily: "inherit", fontWeight: 600, fontSize: 14,
            cursor: "pointer"
          }}>
          Cancel</button>
        <button
          onClick={onSubmit}
          disabled={!canAdd}
          style={{
            flex: 1, height: 44, borderRadius: 8,
            background: canAdd ? RC_TOKENS.primary : RC_TOKENS.border,
            color: canAdd ? RC_TOKENS.onPrimary : RC_TOKENS.inkDisabled,
            border: 0, fontFamily: "inherit", fontWeight: 700, fontSize: 14,
            cursor: canAdd ? "pointer" : "not-allowed"
          }}>
          Add Guest</button>
      </div>
    </div>);

}

// Single player row used inside the sheet.
function RcPlayerRow({ avatar, color, name, sub, selected, locked, friend, guest, onToggle, onRemove }) {
  return (
    <div
      onClick={onToggle && !locked ? onToggle : undefined}
      style={{
        display: "flex", alignItems: "center", gap: 14,
        padding: "12px 12px",
        // Hairline divider between rows on a transparent background so
        // the picker reads as a clean list rather than a wall of pills.
        // Selected rows still get the subtle fill for grouping.
        borderRadius: selected ? 8 : 0,
        borderBottom: selected ? "none" : `1px solid ${RC_TOKENS.border}`,
        background: selected ? RC_TOKENS.subtle : "transparent",
        marginBottom: selected ? 6 : 0,
        cursor: onToggle && !locked ? "pointer" : "default",
        transition: "background 120ms"
      }}
      onMouseEnter={(e) => {
        if (!onToggle || locked || selected) return;
        e.currentTarget.style.background = "rgba(15,18,20,.02)";
      }}
      onMouseLeave={(e) => {
        if (!onToggle || locked || selected) return;
        e.currentTarget.style.background = "transparent";
      }}>
      
      {/* Avatar — sized up a touch so the row has a clear visual anchor. */}
      <div style={{
        width: 44, height: 44, borderRadius: 9999, flexShrink: 0,
        background: guest ? RC_TOKENS.inkMuted : color || RC_TOKENS.primary,
        color: RC_TOKENS.onPrimary,
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        fontFamily: "inherit", fontWeight: 700, fontSize: 14, letterSpacing: 0.2
      }}>
        {guest ?
        <Icon name="UserPlus" size={18} strokeWidth={1.5} color="#fff" /> :
        avatar}
      </div>

      {/* Name + sub. Friend status shows as a small filled heart pinned
             to the right of the name — a low-noise indicator that doesn't
             need its own row slot. Generous gap between rows so two-line
             content doesn't feel cramped. */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 3 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
          <span style={{
            fontSize: 15, fontWeight: 600, color: RC_TOKENS.ink, letterSpacing: -0.1,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            minWidth: 0, lineHeight: 1.2
          }}>{name}</span>
          {friend &&
          <span
            aria-label="Friend"
            title="Friend"
            style={{
              display: "inline-flex", flexShrink: 0,
              color: RC_TOKENS.error
            }}>
            
              <svg width={12} height={12} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 21s-7-4.5-9.5-9A5 5 0 0 1 12 6a5 5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z" />
              </svg>
            </span>
          }
        </div>
        <div style={{
          fontSize: 12, color: RC_TOKENS.inkMuted, fontWeight: 500,
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          lineHeight: 1.35
        }}>{sub}</div>
      </div>

      {/* Right slot — uniform remove affordance for any selected row.
             Locked self uses a spacer so columns align; unselected rows
             keep an empty slot since tapping the whole row adds them. */}
      <div style={{ display: "inline-flex", alignItems: "center", flexShrink: 0 }}>
        {locked ?
        <div style={{ width: 36, height: 36 }} aria-hidden="true" /> :
        selected ?
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (guest) {onRemove && onRemove();} else
            {onToggle && onToggle();}
          }}
          aria-label={guest ? "Remove guest" : "Remove player"}
          style={{
            width: 36, height: 36, borderRadius: 9999,
            background: "transparent", border: 0,
            color: RC_TOKENS.inkMuted, cursor: "pointer",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            transition: "background 120ms, color 120ms"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = RC_TOKENS.errorBg;
            e.currentTarget.style.color = RC_TOKENS.error;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = RC_TOKENS.inkMuted;
          }}>
          
            <Icon name="X" size={16} strokeWidth={1.6} color="currentColor" />
          </button> :

        // Subtle ChevronRight on unselected rows hints at the tap
        // target without competing with the avatar / name.
        <Icon name="ChevronRight" size={16} strokeWidth={1.4} color={RC_TOKENS.inkDisabled} />
        }
      </div>
    </div>);

}

// ── Add-guest form input ────────────────────────────────────────────────
// Tiny labeled input used by the in-sheet "Add a Guest" page.
function RcInput({ label, value, onChange, type = "text", required }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <span style={{
        fontFamily: "inherit", fontWeight: 600, fontSize: 11,
        color: RC_TOKENS.inkMuted, letterSpacing: 0.3, textTransform: "uppercase"
      }}>
        {label}{required && <span style={{ color: RC_TOKENS.error }}> *</span>}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          height: 40, padding: "0 12px", borderRadius: 8,
          background: RC_TOKENS.elevated,
          border: `1px solid ${RC_TOKENS.borderStrong}`,
          fontFamily: "inherit", fontSize: 14, fontWeight: 500, color: RC_TOKENS.ink,
          outline: "none"
        }} />
      
    </label>);

}

// ── Section 4 — More Reservation Options (toggles) ──────────────────────
// Two simple switches that write into the reservation. Disabled until
// Section 3 has enough players to satisfy the format's minimum.
function RcSection4({ reservation, setReservation, disabled }) {
  const setCustomize = (v) => setReservation((r) => ({ ...r, customizeCourts: v }));
  const setPublic = (v) => setReservation((r) => ({ ...r, publicMatchmaking: v }));
  return (
    <RcSectionCard disabled={disabled}>
      <RcSectionHeader title="More Reservation Options" disabled={disabled} />

      <RcToggleRow
        icon="Grid3x3"
        label="Customize Your Courts"
        value={!!reservation.customizeCourts}
        onChange={setCustomize}
        disabled={disabled} />
      
      <RcSectionDivider />
      <RcToggleRow
        icon="Globe"
        label="Public Match Making"
        helper="Publicly allow others find and join your game with empty slots"
        value={!!reservation.publicMatchmaking}
        onChange={setPublic}
        disabled={disabled}
        isLast />
      
    </RcSectionCard>);

}

// Toggle row — icon + label (+ optional helper) on the left, DS-style
// switch on the right. Spec uses green when ON.
function RcToggleRow({ icon, label, helper, value, onChange, disabled, isLast }) {
  const iconColor = disabled ? RC_TOKENS.inkDisabled : RC_TOKENS.inkMuted;
  const labelColor = disabled ? RC_TOKENS.inkDisabled : RC_TOKENS.ink;
  const helperColor = disabled ? RC_TOKENS.inkDisabled : RC_TOKENS.inkMuted;
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "14px 16px",
      minHeight: helper ? 64 : 56
    }}>
      <Icon name={icon} size={18} strokeWidth={1.5} color={iconColor} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 14, fontWeight: 600, color: labelColor, lineHeight: 1.25
        }}>{label}</div>
        {helper &&
        <div style={{
          marginTop: 4, fontSize: 12, fontWeight: 500,
          color: helperColor, lineHeight: 1.4
        }}>{helper}</div>
        }
      </div>
      <RcSwitch value={value} onChange={onChange} disabled={disabled} />
    </div>);

}

// Minimal DS-style switch. Track color flips to green when ON per spec.
function RcSwitch({ value, onChange, disabled }) {
  return (
    <button
      role="switch"
      aria-checked={value}
      disabled={disabled}
      onClick={() => !disabled && onChange(!value)}
      style={{
        width: 44, height: 24, borderRadius: 9999,
        background: value ? RC_TOKENS.success : RC_TOKENS.borderStrong,
        border: 0, padding: 0,
        position: "relative",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition: "background 150ms",
        flexShrink: 0
      }}>
      
      <span style={{
        position: "absolute", top: 2, left: value ? 22 : 2,
        width: 20, height: 20, borderRadius: 9999,
        background: "#fff",
        boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
        transition: "left 180ms cubic-bezier(.2,.8,.2,1)"
      }} />
    </button>);

}

// ── Payment + timer + Reserve CTA ────────────────────────────────────────
function RcPaymentBlock({ canReserve, onReserve }) {
  // Live countdown — 15:00 → 0:00. Resets every time the block first
  // mounts (i.e., once the user has started a reservation).
  const [seconds, setSeconds] = React.useState(15 * 60);
  React.useEffect(() => {
    if (seconds <= 0) return;
    const t = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [seconds]);
  const mm = Math.floor(seconds / 60);
  const ss = seconds % 60;
  const timeStr = `${mm}:${String(ss).padStart(2, "0")}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Payment Info card */}
      <RcSectionCard>
        <RcSectionHeader title="Payment Info" />
        <RcPayRow label="Court fees" value="$30.00" />
        <RcSectionDivider />
        <RcPayRow label="Total Due" value="$30.00" bold isLast />
      </RcSectionCard>

      {/* 15-minute timer banner */}
      <div style={{
        background: RC_TOKENS.warningBg,
        border: `1px solid ${RC_TOKENS.warning}`,
        borderRadius: 8,
        padding: "12px 16px",
        display: "flex", alignItems: "center", gap: 10,
        color: RC_TOKENS.warningFg
      }}>
        <Icon name="Timer" size={16} strokeWidth={1.5} color={RC_TOKENS.warningFg} />
        <span style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.4 }}>
          You have <span style={{ fontWeight: 700 }}>{timeStr}</span> to finalize payment
        </span>
      </div>

      {/* Reserve CTA */}
      <button
        onClick={canReserve ? onReserve : undefined}
        disabled={!canReserve}
        style={{
          height: 56, width: "100%", borderRadius: 8,
          background: canReserve ? RC_TOKENS.primary : RC_TOKENS.border,
          color: canReserve ? RC_TOKENS.onPrimary : RC_TOKENS.inkDisabled,
          border: 0, fontFamily: "inherit", fontWeight: 700, fontSize: 16,
          letterSpacing: -0.1,
          cursor: canReserve ? "pointer" : "not-allowed",
          transition: "background 150ms"
        }}>
        Reserve — $30.00</button>
    </div>);

}

function RcPayRow({ label, value, bold, isLast }) {
  return (
    <React.Fragment>
      <div style={{
        padding: "14px 16px",
        display: "flex", alignItems: "center", justifyContent: "space-between"
      }}>
        <span style={{
          fontSize: 14, fontWeight: bold ? 700 : 500,
          color: bold ? RC_TOKENS.ink : RC_TOKENS.inkSoft
        }}>{label}</span>
        <span style={{
          fontSize: 14, fontWeight: bold ? 700 : 600, color: RC_TOKENS.ink,
          fontVariantNumeric: "tabular-nums"
        }}>{value}</span>
      </div>
      {!isLast && <RcSectionDivider />}
    </React.Fragment>);

}

function RcBookingBody({ onReserve, reservation, setReservation, app, setApp }) {
  // Collapsed state for each section card. Pushed up here so the
  // downstream sections (Sec 2/3/4) can read whether Sec 1 is complete
  // and gate themselves accordingly once we wire them up.
  const [sec1Collapsed, setSec1Collapsed] = React.useState(false);
  const [sec2Collapsed, setSec2Collapsed] = React.useState(false);
  const [sec3Collapsed, setSec3Collapsed] = React.useState(false);
  const [showPlayersSheet, setShowPlayersSheet] = React.useState(false);

  // Auto-collapse Section 1 when a format is picked. Mirrors the spec's
  // explicit useEffect callout — also catches the case where state is
  // mutated outside the section's own handlers.
  React.useEffect(() => {
    if (reservation.format) setSec1Collapsed(true);
  }, [reservation.format]);
  // Same pattern for Section 2 — collapse once date+time+duration are
  // all locked in.
  React.useEffect(() => {
    if (reservation.duration && reservation.date && reservation.timeSlot) {
      setSec2Collapsed(true);
    }
  }, [reservation.duration, reservation.date, reservation.timeSlot]);
  // Section 3 collapses once enough players are picked to meet the
  // format's minimum.
  React.useEffect(() => {
    const min = rcMinPlayers(reservation.format);
    const total = 1 + (reservation.players || []).length + (reservation.guests || []).length;
    if (total >= min && !showPlayersSheet) setSec3Collapsed(true);
  }, [reservation.players, reservation.guests, reservation.format, showPlayersSheet]);

  // Section 2 unlocks once Section 1 picks a format; Section 3 unlocks
  // once Section 2's date+time+duration are locked in.
  const sec1Complete = !!reservation.format;
  const sec2Complete = !!(reservation.duration && reservation.date && reservation.timeSlot);
  const sec3Complete = 1 + (reservation.players || []).length + (reservation.guests || []).length >=
  rcMinPlayers(reservation.format);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <RcLocationBanner app={app} setApp={setApp} />
      <RcSection1
        reservation={reservation}
        setReservation={setReservation}
        collapsed={sec1Collapsed}
        setCollapsed={setSec1Collapsed} />
      
      {/* Future-step cards are hidden — not disabled — until the
             upstream section completes. Once unlocked they slide in.
             Each section continues to render as a collapsed summary card
             once filled in, giving the user a way to revisit it. */}
      {sec1Complete &&
      <RcSection2
        reservation={reservation}
        setReservation={setReservation}
        disabled={false}
        collapsed={sec2Collapsed}
        setCollapsed={setSec2Collapsed} />

      }
      {sec2Complete &&
      <RcSection3
        reservation={reservation}
        setReservation={setReservation}
        disabled={false}
        collapsed={sec3Collapsed}
        setCollapsed={setSec3Collapsed}
        onOpenSheet={() => {setSec3Collapsed(false);setShowPlayersSheet(true);}} />

      }
      {sec3Complete &&
      <RcSection4
        reservation={reservation}
        setReservation={setReservation}
        disabled={false} />

      }
      {/* Payment + timer + Reserve only appears once both Section 1
             (what) and Section 2 (when) are complete — so the user has
             committed to enough specifics to make the payment block
             meaningful. */}
      {sec1Complete && sec2Complete &&
      <RcPaymentBlock
        canReserve={sec1Complete && sec2Complete && sec3Complete}
        onReserve={onReserve} />

      }
      <RcPlayersSheet
        open={showPlayersSheet}
        reservation={reservation}
        setReservation={setReservation}
        onClose={() => setShowPlayersSheet(false)} />
      
    </div>);

}

// ── Confirmation screen ─────────────────────────────────────────────────
// Built from the data sitting in `reservation` — the booking flow writes
// into it, and this body just reads off it. Keeps the confirmation
// independent of the section components.

// Single reusable detail-row pill ("DetailChip" in spec). DS Tag neutral
// variant — pill shape, no border, soft fill, p3 semibold.
function RcDetailChip({ children }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      height: 24, padding: "0 10px", borderRadius: 9999,
      background: RC_TOKENS.subtle, color: RC_TOKENS.ink,
      fontFamily: "inherit", fontWeight: 600, fontSize: 12, letterSpacing: 0.1,
      maxWidth: "100%"
    }}>
      <span style={{
        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
      }}>{children}</span>
    </span>);

}

function RcDetailRow({ icon, label, value, isLast }) {
  return (
    <React.Fragment>
      <div style={{
        padding: "14px 16px",
        display: "flex", alignItems: "flex-start", gap: 12,
        minHeight: 56
      }}>
        <Icon name={icon} size={16} strokeWidth={1.5} color={RC_TOKENS.inkMuted} />
        <span style={{
          flex: 1, minWidth: 0,
          fontSize: 14, fontWeight: 500, color: RC_TOKENS.inkSoft, lineHeight: 1.5
        }}>{label}</span>
        <div style={{
          flexShrink: 0, display: "flex", flexDirection: "column",
          alignItems: "flex-end", gap: 6, maxWidth: "60%"
        }}>
          {value}
        </div>
      </div>
      {!isLast && <RcSectionDivider />}
    </React.Fragment>);

}

function RcConfirmationBody({ reservation, onBack, onReserveMore, app, setApp }) {
  const { msg, show: showToast } = useRcToast();
  const dateLabel = rcGetDateLabel(reservation.date);
  const playerCount = 1 + (reservation.players || []).length + (reservation.guests || []).length;

  // Resolve picked players + guests for the under-Players list.
  const allPlayers = [
  { id: "self", name: "Joshua Barriga", avatar: "JB", color: RC_TOKENS.primary },
  ...(reservation.players || []).map((id) => {
    const p = RC_PLAYER_POOL.find((x) => x.id === id);
    return p ? { id: p.id, name: p.name, avatar: p.avatar, color: p.color } : null;
  }).filter(Boolean),
  ...(reservation.guests || []).map((g) => ({
    id: g.id, name: `${g.first} ${g.last}`,
    avatar: (g.first[0] + (g.last[0] || "")).toUpperCase(),
    color: RC_TOKENS.inkMuted, guest: true
  }))];


  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, position: "relative" }}>
      <RcLocationBanner app={app} setApp={setApp} />
      {/* ── Hero ticket — full-width dark card with a perforated divider
               and a stub row for COURT / DATE / TIME. */}
      <div style={{
        position: "relative", overflow: "visible",
        background: RC_TOKENS.primary, color: "#fff",
        borderRadius: 8
      }}>
        {/* Top — celebratory header */}
        <div style={{
          padding: "24px 24px 0",
          display: "flex", alignItems: "center", gap: 16
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: 9999, flexShrink: 0,
            background: "#fff", color: RC_TOKENS.primary,
            display: "inline-flex", alignItems: "center", justifyContent: "center"
          }}>
            <Icon name="Smile" size={32} strokeWidth={1.5} color="currentColor" />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontFamily: "inherit", fontWeight: 700, fontSize: 20,
              letterSpacing: -0.4, color: "#fff"
            }}>Congratulations!</div>
            <div style={{
              marginTop: 4,
              fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.75)",
              lineHeight: 1.4
            }}>Your reservation is confirmed.</div>
          </div>
        </div>

        {/* Perforated divider — dashed rule across, two surface-colored
               "notches" punched into each side to fake the ticket cutouts. */}
        <div style={{ position: "relative", marginTop: 20, height: 1 }}>
          <div style={{
            position: "absolute", left: -12, top: -12,
            width: 24, height: 24, borderRadius: 9999,
            background: RC_TOKENS.surface
          }} />
          <div style={{
            position: "absolute", right: -12, top: -12,
            width: 24, height: 24, borderRadius: 9999,
            background: RC_TOKENS.surface
          }} />
          <div style={{
            height: 0, margin: "0 24px",
            borderTop: "2px dashed rgba(255,255,255,0.25)"
          }} />
        </div>

        {/* Stub row — 3 columns, court / date / time. */}
        <div style={{
          padding: "16px 24px",
          display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{
              fontSize: 10, fontWeight: 700, letterSpacing: 1.4, textTransform: "uppercase",
              color: "rgba(255,255,255,0.5)"
            }}>Court</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#fff", letterSpacing: -0.1 }}>Court #1</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end" }}>
            <span style={{
              fontSize: 10, fontWeight: 700, letterSpacing: 1.4, textTransform: "uppercase",
              color: "rgba(255,255,255,0.5)"
            }}>Date</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#fff", letterSpacing: -0.1 }}>
              {dateLabel || "—"}
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end" }}>
            <span style={{
              fontSize: 10, fontWeight: 700, letterSpacing: 1.4, textTransform: "uppercase",
              color: "rgba(255,255,255,0.5)"
            }}>Time</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#fff", letterSpacing: -0.1 }}>
              {reservation.timeSlot || "—"}
            </span>
          </div>
        </div>
      </div>

      {/* ── Details card — 8 rows with chip values + the player list. */}
      <RcSectionCard>
        <RcDetailRow
          icon="Tag"
          label="Activity"
          value={<RcDetailChip>{`Book ${reservation.activity || "—"}`}</RcDetailChip>} />
        
        <RcDetailRow
          icon="Grid3x3"
          label="Court Type"
          value={<RcDetailChip>{reservation.courtType || "—"}</RcDetailChip>} />
        
        <RcDetailRow
          icon="Users"
          label="Reservation Type"
          value={<RcDetailChip>{reservation.format || "—"}</RcDetailChip>} />
        
        <RcDetailRow
          icon="Clock"
          label="Duration"
          value={<RcDetailChip>{reservation.duration || "—"}</RcDetailChip>} />
        
        <RcDetailRow
          icon="Calendar"
          label="Date & Time"
          value={<RcDetailChip>{dateLabel || "—"}</RcDetailChip>} />
        
        <RcDetailRow
          icon="Clock"
          label="Time"
          value={<RcDetailChip>{reservation.timeSlot || "—"}</RcDetailChip>} />
        
        <RcDetailRow
          icon="MapPin"
          label="Court"
          value={<RcDetailChip>Court #1</RcDetailChip>} />
        
        <RcDetailRow
          icon="Users"
          label="Players"
          value={<RcDetailChip>{`${playerCount} ${playerCount === 1 ? "Player" : "Players"}`}</RcDetailChip>} />
        
        {/* Full-width player roster — lives outside the right-aligned
               value slot so the avatars and names get to use the whole row.
               Rendered as a 2-column responsive grid so 4+ players don't
               stack into a tall list inside the right rail. */}
        <div style={{
          padding: "0 16px 16px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 10, margin: "12px 0px 0px"
        }}>
          {allPlayers.map((p) =>
          <div key={p.id} style={{
            display: "inline-flex", alignItems: "center", gap: 10, minWidth: 0
          }}>
              <span style={{
              width: 32, height: 32, borderRadius: 9999, flexShrink: 0,
              background: p.color, color: "#fff",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              fontFamily: "inherit", fontWeight: 700, fontSize: 12, letterSpacing: 0.2
            }}>
                {p.guest ?
              <Icon name="UserPlus" size={14} strokeWidth={1.5} color="#fff" /> :
              p.avatar}
              </span>
              <span style={{
              fontSize: 13, fontWeight: 500, color: RC_TOKENS.inkSoft,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              minWidth: 0
            }}>{p.name}</span>
            </div>
          )}
        </div>

        {/* Total Due — separator + bold pay row. */}
        <RcSectionDivider />
        <div style={{
          padding: "14px 16px",
          display: "flex", alignItems: "center", justifyContent: "space-between"
        }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: RC_TOKENS.ink, letterSpacing: -0.1 }}>Total Due</span>
          <span style={{
            fontSize: 16, fontWeight: 700, color: RC_TOKENS.ink, letterSpacing: -0.1,
            fontVariantNumeric: "tabular-nums"
          }}>$30.00</span>
        </div>
      </RcSectionCard>

      {/* Action buttons — Share + Reserve More on one row. */}
      <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
        <button
          onClick={() => showToast("Sharing coming soon")}
          style={{
            flex: 1, height: 48, borderRadius: 8,
            background: RC_TOKENS.elevated,
            border: `1px solid ${RC_TOKENS.borderStrong}`,
            color: RC_TOKENS.ink,
            fontFamily: "inherit", fontWeight: 600, fontSize: 14,
            cursor: "pointer",
            display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
            transition: "background 120ms, border-color 120ms"
          }}
          onMouseEnter={(e) => {e.currentTarget.style.background = RC_TOKENS.subtle;}}
          onMouseLeave={(e) => {e.currentTarget.style.background = RC_TOKENS.elevated;}}>
          
          <Icon name="Share2" size={14} strokeWidth={1.5} color="currentColor" />
          Share
        </button>
        <button
          onClick={onReserveMore}
          style={{
            flex: 1, height: 48, borderRadius: 8,
            background: RC_TOKENS.primary, border: 0,
            color: RC_TOKENS.onPrimary,
            fontFamily: "inherit", fontWeight: 700, fontSize: 14,
            cursor: "pointer",
            transition: "background 120ms"
          }}
          onMouseEnter={(e) => {e.currentTarget.style.background = RC_TOKENS.primaryHover;}}
          onMouseLeave={(e) => {e.currentTarget.style.background = RC_TOKENS.primary;}}>
          Reserve More</button>
      </div>

      {/* Tertiary — back to home link in secondary green. */}
      <button
        onClick={onBack}
        style={{
          marginTop: 4, padding: 8,
          background: "transparent", border: 0,
          color: RC_TOKENS.success,
          fontFamily: "inherit", fontWeight: 600, fontSize: 14,
          cursor: "pointer",
          alignSelf: "center"
        }}>
        Back to Home</button>

      <RcToastSlot msg={msg} />
    </div>);

}

// ── Page root ────────────────────────────────────────────────────────────
// ── Location prerequisite sheet ─────────────────────────────────────────
// Surfaced when the user enters the reserve flow with "All Locations"
// (universal CR app) active. They must pick one of their member clubs
// before the booking flow proceeds — reservations always require a
// specific venue. The sheet is dismissible via the back gesture (calls
// onBack), so the user can exit without committing.
// Static club list shared by the location prereq sheet and the
// location banner that sits atop the booking + confirmation views once
// the user has picked a single club.
const RC_LOCATIONS = [
{ id: "oc", name: "Old Coast Pickleball", logoMark: "OC", color: "#2E5D52", tier: "Diamond member", distance: "2.1 mi · 7 min", openCourts: 3, courtsTotal: 8 },
{ id: "dd", name: "Dill Dinkers Jacksonville", logoMark: "DD", color: "#8E5BE8", tier: "Gold member", distance: "8.4 mi · 18 min", openCourts: 5, courtsTotal: 14 }];

// Compact banner shown at the top of the booking + confirmation views
// to remind the user which club they're reserving at. Includes a
// "Change" affordance that resets the app back to "All Locations",
// re-triggering the prereq sheet so they can pick a different club
// without leaving the flow.
function RcLocationBanner({ app, setApp }) {
  const loc = RC_LOCATIONS.find((x) => x.id === app);
  if (!loc) return null;
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "10px 12px",
      background: RC_TOKENS.elevated,
      border: `1px solid ${RC_TOKENS.border}`,
      borderRadius: 8,
      marginBottom: 12
    }}>
      <span style={{
        width: 36, height: 36, borderRadius: 8, flexShrink: 0,
        background: loc.color, color: "#fff",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        fontFamily: "inherit", fontWeight: 800, fontSize: 11, letterSpacing: 0.4
      }}>{loc.logoMark}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 10, fontWeight: 700, letterSpacing: 1.2,
          textTransform: "uppercase", color: RC_TOKENS.inkMuted
        }}>Reserving at</div>
        <div style={{
          marginTop: 2,
          fontSize: 14, fontWeight: 700, color: RC_TOKENS.ink, letterSpacing: -0.1,
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
        }}>{loc.name}</div>
      </div>
      <button
        onClick={() => setApp && setApp("cr")}
        style={{
          flexShrink: 0,
          height: 32, padding: "0 12px", borderRadius: 6,
          background: "transparent", border: `1px solid ${RC_TOKENS.borderStrong}`,
          color: RC_TOKENS.ink, fontFamily: "inherit", fontWeight: 600, fontSize: 12,
          cursor: "pointer", transition: "background 120ms"
        }}
        onMouseEnter={(e) => {e.currentTarget.style.background = RC_TOKENS.subtle;}}
        onMouseLeave={(e) => {e.currentTarget.style.background = "transparent";}}>
        Change
      </button>
    </div>);

}

function RcLocationPrereqSheet({ app, setApp, prevLocation, onClose }) {
  const locations = RC_LOCATIONS;

  return (
    <div
      style={{
        position: "absolute", inset: 0, zIndex: 70,
        background: "rgba(0,0,0,0.45)",
        display: "flex", alignItems: "flex-end", justifyContent: "center",
        animation: "rcSheetFade 180ms ease-out"
      }}>

      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: 560, maxHeight: "88%",
          background: RC_TOKENS.elevated,
          borderTopLeftRadius: 8, borderTopRightRadius: 8,
          display: "flex", flexDirection: "column",
          boxShadow: "0 -4px 32px rgba(0,0,0,0.18)",
          animation: "rcSheetUp 220ms cubic-bezier(.2,.8,.2,1)"
        }}>

        {/* Drag handle */}
        <div style={{ width: 36, height: 4, borderRadius: 999, background: RC_TOKENS.subtle, margin: "12px auto 4px" }} />

        {/* Header — title left-aligned, close X on the right (only
             shown when the user has previously committed to a club; on
             first entry the user MUST pick one to proceed). The close
             action only dismisses the overlay — restoring the previously
             picked club — it does NOT exit the reserve flow. */}
        <div style={{
          padding: "8px 16px 12px",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12
        }}>
          <div style={{
            flex: 1, minWidth: 0,
            fontFamily: "inherit", fontWeight: 700, fontSize: 16,
            color: RC_TOKENS.ink, letterSpacing: -0.1
          }}>
            Where would you like to play?
          </div>
          {prevLocation && onClose &&
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              flexShrink: 0,
              width: 32, height: 32, borderRadius: 9999,
              background: "transparent", border: 0,
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: RC_TOKENS.ink,
              transition: "background 120ms"
            }}
            onMouseEnter={(e) => {e.currentTarget.style.background = RC_TOKENS.subtle;}}
            onMouseLeave={(e) => {e.currentTarget.style.background = "transparent";}}>
            <Icon name="X" size={16} strokeWidth={1.6} color="currentColor" />
          </button>
          }
        </div>

        {/* Subtitle — explains why we're asking. */}
        <div style={{
          padding: "0 16px 12px",
          fontSize: 13, color: RC_TOKENS.inkMuted, lineHeight: 1.5
        }}>
          You're browsing All Locations. Pick a specific club to reserve a court at.
        </div>

        <RcSectionDivider />

        {/* List of clubs */}
        <div style={{ flex: 1, overflowY: "auto", padding: "8px" }}>
          {locations.map((loc) =>
          <button
            key={loc.id}
            onClick={() => setApp(loc.id)}
            style={{
              width: "100%", padding: "14px 12px",
              background: "transparent", border: 0,
              borderRadius: 8, cursor: "pointer", fontFamily: "inherit",
              display: "flex", alignItems: "center", gap: 14,
              textAlign: "left",
              transition: "background 120ms"
            }}
            onMouseEnter={(e) => {e.currentTarget.style.background = RC_TOKENS.subtle;}}
            onMouseLeave={(e) => {e.currentTarget.style.background = "transparent";}}>

              {/* Logo mark — square, brand-colored, matches the location
                 selector chip elsewhere in the app. */}
              <span style={{
              width: 48, height: 48, borderRadius: 8, flexShrink: 0,
              background: loc.color, color: "#fff",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              fontFamily: "inherit", fontWeight: 800, fontSize: 14, letterSpacing: 0.4
            }}>
                {loc.logoMark}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                fontFamily: "inherit", fontWeight: 700, fontSize: 15,
                color: RC_TOKENS.ink, letterSpacing: -0.1,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
              }}>
                  {loc.name}
                </div>
                {/* Meta line: tier · distance · live availability. */}
                <div style={{
                marginTop: 4,
                display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap",
                fontSize: 12, color: RC_TOKENS.inkMuted, fontWeight: 500
              }}>
                  <span>{loc.tier}</span>
                  <span style={{ width: 3, height: 3, borderRadius: 999, background: RC_TOKENS.border }} />
                  <span>{loc.distance}</span>
                </div>
                <div style={{
                marginTop: 4,
                display: "inline-flex", alignItems: "center", gap: 5,
                fontSize: 12, color: RC_TOKENS.success, fontWeight: 600
              }}>
                  <span style={{ width: 6, height: 6, borderRadius: 999, background: RC_TOKENS.success }} />
                  {loc.openCourts} of {loc.courtsTotal} courts open now
                </div>
              </div>
              <Icon name="ChevronRight" size={16} strokeWidth={1.5} color={RC_TOKENS.inkMuted} />
            </button>
          )}
        </div>
      </div>
    </div>);

}

function ReserveCourtPage({ theme, viewport, onBack, app, setApp }) {
  const isMobile = viewport === "mobile";
  // Universal CR experience uses app id "cr" + the universal flag —
  // there's no single club selected, so we can't book until they pick one.
  const needsLocation = app === "cr";
  // Track the most-recent club the user picked while in this reserve
  // flow. Used by the location prereq sheet to know whether the user
  // has *ever* committed to a club — if so, the sheet shows a close
  // affordance (restores the prior pick); if not, the sheet must be
  // resolved by picking a club before they can do anything else.
  const [prevLocation, setPrevLocation] = React.useState(
    // First entry from a branded experience pre-selects that club; from
    // CR universal it starts empty.
    app && app !== "cr" ? app : null
  );
  React.useEffect(() => {
    if (app && app !== "cr") setPrevLocation(app);
  }, [app]);

  // Internal sub-routing.
  const [flowScreen, setFlowScreen] = React.useState("booking"); // "booking" | "confirmation"
  // Cancel confirmation modal (a real version lands in Session 7; this
  // session ships a minimal placeholder so the back gesture has somewhere
  // to land).
  const [showCancelModal, setShowCancelModal] = React.useState(false);
  // The reservation. Future sections write into this; the confirmation
  // body reads off it.
  const [reservation, setReservation] = React.useState({
    activity: null,
    courtType: null,
    format: null,
    duration: null,
    date: null,
    timeSlot: null,
    players: [],
    customizeCourts: false,
    publicMatchmaking: false
  });

  const { msg, show: showToast } = useRcToast();

  // Header handlers — booking variant intercepts back with the cancel
  // modal, confirmation goes straight home.
  const onHeaderLeft = () => {
    if (flowScreen === "booking") {
      setShowCancelModal(true);
    } else {
      onBack();
    }
  };
  const onScheduler = () => {
    showToast("Court availability grid coming soon");
  };

  return (
    <div style={{
      position: "relative", // anchor for the toast + cancel-modal scrim
      background: RC_TOKENS.surface,
      minHeight: "100%",
      fontFamily: "Inter, system-ui, sans-serif",
      display: "flex", flexDirection: "column"
    }}>
      <RcHeader
        variant={flowScreen}
        isMobile={isMobile}
        onLeft={onHeaderLeft}
        onScheduler={onScheduler} />
      

      {/* Body — outer wrapper caps at 1440 so on the desktop frame we get
             a centered content column; inner column is 480 per spec. */}
      <div style={{
        flex: 1, minHeight: 0,
        width: "100%", maxWidth: 1440,
        margin: "0 auto",
        padding: isMobile ? "16px 12px 32px" : "24px 16px 48px"
      }}>
        <div style={{
          width: "100%", maxWidth: 480,
          margin: "0 auto"
        }}>
          {flowScreen === "booking" ?
          <RcBookingBody
            onReserve={() => setFlowScreen("confirmation")}
            reservation={reservation}
            setReservation={setReservation}
            app={app}
            setApp={setApp} /> :

          <RcConfirmationBody
            reservation={reservation}
            app={app}
            setApp={setApp}
            onBack={onBack}
            onReserveMore={() => {
              // Reset reservation state + return to booking. Spec calls
              // for sectionCollapsed flags to reset too — those live
              // inside RcBookingBody, which remounts on flowScreen
              // change because of its parent re-render, so they reset
              // automatically.
              setReservation({
                activity: null, courtType: null, format: null,
                duration: null, date: null, timeSlot: null,
                players: [], guests: [],
                customizeCourts: false, publicMatchmaking: false
              });
              setFlowScreen("booking");
            }} />
          }
        </div>
      </div>

      {/* Cancel confirmation modal — Session 7. Matches the DS hard-
             constraints used by the Add Guest modal: no decorative top bar,
             no header border-bottom, content slot uses a 4% scrim tint,
             footer has no border-top, scrim is rgba(0,0,0,0.45), corners
             radius/xs (8 per the rest of the prototype). */}
      {showCancelModal &&
      <div
        onClick={() => setShowCancelModal(false)}
        style={{
          position: "absolute", inset: 0, zIndex: 90,
          background: "rgba(0,0,0,0.45)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: 16,
          animation: "rcModalFade 180ms ease-out"
        }}>
        
          <style>{`@keyframes rcModalFade { from { opacity: 0; } to { opacity: 1; } }`}</style>
          <div
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "100%", maxWidth: 360,
            background: RC_TOKENS.elevated,
            borderRadius: 8,
            boxShadow: "0 16px 48px rgba(0,0,0,0.16)",
            overflow: "hidden"
          }}>
          
            {/* Body — single content slot (no separate header / footer
             regions) so the modal reads as one quiet question. */}
            <div style={{
            background: "rgba(0,0,0,0.04)",
            padding: "20px 20px 16px"
          }}>
              <div style={{
              fontFamily: "inherit", fontWeight: 700, fontSize: 16,
              color: RC_TOKENS.ink, letterSpacing: -0.1
            }}>Cancel this reservation?</div>
              <div style={{
              marginTop: 8,
              fontSize: 14, fontWeight: 500, lineHeight: 1.4,
              color: RC_TOKENS.inkMuted
            }}>Your selections won't be saved.</div>
            </div>
            {/* Footer button row — no top border (spec). */}
            <div style={{
            padding: "16px 20px 20px",
            display: "flex", gap: 12
          }}>
              <button
              onClick={() => setShowCancelModal(false)}
              style={{
                flex: 1, height: 44, borderRadius: 8,
                background: RC_TOKENS.elevated,
                border: `1px solid ${RC_TOKENS.borderStrong}`,
                color: RC_TOKENS.ink,
                fontFamily: "inherit", fontWeight: 600, fontSize: 14,
                cursor: "pointer",
                transition: "background 120ms, border-color 120ms"
              }}
              onMouseEnter={(e) => {e.currentTarget.style.background = RC_TOKENS.subtle;}}
              onMouseLeave={(e) => {e.currentTarget.style.background = RC_TOKENS.elevated;}}>
              Keep editing</button>
              <button
              onClick={() => {setShowCancelModal(false);onBack();}}
              style={{
                flex: 1, height: 44, borderRadius: 8,
                background: RC_TOKENS.primary, border: 0,
                color: RC_TOKENS.onPrimary,
                fontFamily: "inherit", fontWeight: 600, fontSize: 14,
                cursor: "pointer",
                transition: "background 120ms"
              }}
              onMouseEnter={(e) => {e.currentTarget.style.background = RC_TOKENS.primaryHover;}}
              onMouseLeave={(e) => {e.currentTarget.style.background = RC_TOKENS.primary;}}>
              Discard</button>
            </div>
          </div>
        </div>
      }

      <RcToastSlot msg={msg} />
      {/* Location prerequisite — when "All Locations" is the active
           experience, the user must pick a single club before the
           booking flow can start. Sheet sits above all other reserve-
           flow content; back exits the flow entirely. */}
      {needsLocation &&
      <RcLocationPrereqSheet
        app={app}
        setApp={setApp}
        prevLocation={prevLocation}
        onClose={prevLocation ? () => setApp(prevLocation) : null} />
      }
    </div>);

}

// Belt-and-braces global export — top-level function declarations in a
// Babel-standalone <script> already land on window, but other prototype
// files explicitly mirror them onto window.X so we follow suit.
window.ReserveCourtPage = ReserveCourtPage;