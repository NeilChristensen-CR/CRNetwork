// BookCourtWidget.jsx — OpenTable-style "Book a court" search bar.
// Quick "what / when / who / where" picker that lives at the top of the
// home page so anyone landing on CourtReserve sees one obvious path:
// pick a sport, a time, party size, optional location → tap go.
//
// Layout: a single white pill-row with hairline dividers between four
// fields and a blue CTA on the right. Each field opens a small popover
// (calendar, time list, stepper, sport / location picker). On narrow
// viewports the row wraps to a 2x2 grid and the CTA spans full width.
const { useState: useStateBCW, useRef: useRefBCW, useEffect: useEffectBCW } = React;

// ---- Data ---------------------------------------------------------------
const SPORTS_BCW = [
{ id: "pickleball", label: "Pickleball", icon: "Circle" },
{ id: "tennis", label: "Tennis", icon: "CircleDashed" },
{ id: "padel", label: "Padel", icon: "Square" },
{ id: "badminton", label: "Badminton", icon: "Feather" },
{ id: "squash", label: "Squash", icon: "Box" },
{ id: "any", label: "Any sport", icon: "LayoutGrid" }];


const TIMES_BCW = (() => {
  const out = [];
  for (let h = 6; h <= 22; h++) {
    for (const m of [0, 30]) {
      const hh = h % 12 === 0 ? 12 : h % 12;
      const mm = m === 0 ? "00" : "30";
      const ap = h < 12 ? "AM" : "PM";
      out.push({ key: `${h}:${m}`, label: `${hh}:${mm} ${ap}` });
    }
  }
  return out;
})();

const MONTHS_BCW = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DOW_BCW = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function fmtDateBCW(d) {
  const today = new Date();today.setHours(0, 0, 0, 0);
  const target = new Date(d);target.setHours(0, 0, 0, 0);
  const diff = Math.round((target - today) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  return `${MONTHS_BCW[d.getMonth()]} ${d.getDate()}`;
}

// ---- Field shell --------------------------------------------------------
// One cell in the pill row. Owns its own popover anchor + outside-click
// to close, so the parent just drops <Field> in and forwards value/onChange.
function FieldBCW({ icon, label, value, popover, last, first, onOpen, isOpen, onClose, compact, trailing }) {
  const ref = useRefBCW(null);
  useEffectBCW(() => {
    if (!isOpen) return;
    const onDoc = (e) => {if (ref.current && !ref.current.contains(e.target)) onClose();};
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [isOpen, onClose]);
  return (
    <div ref={ref} style={{ position: "relative", flex: 1, minWidth: 0 }}>
      <button
        onClick={isOpen ? onClose : onOpen}
        style={{
          width: "100%", height: compact ? 44 : 52,
          padding: "0 22px",
          background: isOpen ? "#F4F5F6" : "transparent",
          border: 0,
          borderRadius: 999,
          display: "flex", alignItems: "center", gap: 12,
          cursor: "pointer", textAlign: "left",
          color: "#0F1214", fontFamily: "Inter, system-ui, sans-serif",
          transition: "background 120ms"
        }}
        onMouseEnter={(e) => {if (!isOpen) e.currentTarget.style.background = "#F4F5F6";}}
        onMouseLeave={(e) => {if (!isOpen) e.currentTarget.style.background = "transparent";}}>

        {icon && <Icon name={icon} size={18} strokeWidth={1.75} color="#0F1214" />}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase", color: "#858F8F", lineHeight: 1 }}>
            {label}
          </div>
          <div style={{ marginTop: 4, fontSize: 14, fontWeight: 600, color: "#0F1214", letterSpacing: -0.1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {value}
          </div>
        </div>
        {trailing}
      </button>
      {isOpen ?
      <div style={{
        position: "absolute", top: "calc(100% + 8px)", left: 0,
        background: "#fff", border: "1px solid #E9EBEC", borderRadius: 12,
        boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
        zIndex: 30, minWidth: 280,
        overflow: "hidden"
      }}>
          {popover}
        </div> :
      null}
    </div>);

}

// ---- Sport popover ------------------------------------------------------
function SportPopBCW({ value, onPick }) {
  return (
    <div style={{ padding: 8, minWidth: 240 }}>
      {SPORTS_BCW.map((s) => {
        const on = s.id === value;
        return (
          <button key={s.id} onClick={() => onPick(s.id)} style={{
            width: "100%", display: "flex", alignItems: "center", gap: 10,
            padding: "10px 12px", borderRadius: 6, border: 0,
            background: on ? "#EDF1FB" : "transparent",
            color: on ? "#1F4ED8" : "#0F1214",
            fontFamily: "inherit", fontSize: 14, fontWeight: on ? 700 : 500,
            cursor: "pointer", textAlign: "left"
          }}
          onMouseEnter={(e) => {if (!on) e.currentTarget.style.background = "#F4F5F6";}}
          onMouseLeave={(e) => {if (!on) e.currentTarget.style.background = "transparent";}}>

            <span style={{ flex: 1 }}>{s.label}</span>
            {on ? <Icon name="Check" size={14} strokeWidth={2.2} color="#1F4ED8" /> : null}
          </button>);

      })}
    </div>);

}

// ---- Date popover -------------------------------------------------------
// Two-column: quick presets on the left, mini month calendar on the right.
function DatePopBCW({ value, onPick }) {
  const [month, setMonth] = useStateBCW(() => {const d = new Date(value);d.setDate(1);return d;});
  const today = new Date();today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today.getTime() + 86400000);
  const weekend = (() => {
    const d = new Date(today);
    const day = d.getDay();
    const add = day <= 6 ? 6 - day : 6;
    d.setDate(d.getDate() + add);
    return d;
  })();
  const presets = [
  { label: "Today", d: today },
  { label: "Tomorrow", d: tomorrow },
  { label: "This Saturday", d: weekend }];

  const start = new Date(month);start.setDate(1);
  const startDow = start.getDay();
  const daysIn = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= daysIn; d++) cells.push(new Date(month.getFullYear(), month.getMonth(), d));
  const isSame = (a, b) => a && b && a.toDateString() === b.toDateString();
  return (
    <div style={{ display: "flex", padding: 12, gap: 12, minWidth: 420 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 4, paddingRight: 12, borderRight: "1px solid #E9EBEC", minWidth: 130 }}>
        <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 0.6, textTransform: "uppercase", color: "#858F8F", padding: "4px 8px 6px" }}>Quick pick</div>
        {presets.map((p) =>
        <button key={p.label} onClick={() => onPick(p.d)} style={{
          textAlign: "left", padding: "8px 10px", borderRadius: 6, border: 0,
          background: isSame(p.d, value) ? "#EDF1FB" : "transparent",
          color: isSame(p.d, value) ? "#1F4ED8" : "#0F1214",
          fontFamily: "inherit", fontSize: 13, fontWeight: isSame(p.d, value) ? 700 : 500,
          cursor: "pointer"
        }}
        onMouseEnter={(e) => {if (!isSame(p.d, value)) e.currentTarget.style.background = "#F4F5F6";}}
        onMouseLeave={(e) => {if (!isSame(p.d, value)) e.currentTarget.style.background = "transparent";}}>

            {p.label}
          </button>
        )}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 6px 8px" }}>
          <button onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} aria-label="Previous month" style={{ background: "transparent", border: 0, width: 24, height: 24, borderRadius: 4, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="ChevronLeft" size={14} strokeWidth={2} color="#0F1214" />
          </button>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#0F1214" }}>{MONTHS_BCW[month.getMonth()]} {month.getFullYear()}</div>
          <button onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} aria-label="Next month" style={{ background: "transparent", border: 0, width: 24, height: 24, borderRadius: 4, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="ChevronRight" size={14} strokeWidth={2} color="#0F1214" />
          </button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
          {DOW_BCW.map((d) => <div key={d} style={{ fontSize: 10.5, fontWeight: 700, color: "#858F8F", textAlign: "center", padding: "4px 0" }}>{d}</div>)}
          {cells.map((c, i) => {
            if (!c) return <div key={i} />;
            const past = c < today;
            const on = isSame(c, value);
            return (
              <button key={i} disabled={past} onClick={() => onPick(c)} style={{
                height: 30, borderRadius: 4, border: 0,
                background: on ? "#1F4ED8" : "transparent",
                color: on ? "#fff" : past ? "#C9CED1" : "#0F1214",
                fontFamily: "inherit", fontSize: 12.5, fontWeight: on ? 700 : 500,
                cursor: past ? "default" : "pointer"
              }}
              onMouseEnter={(e) => {if (!on && !past) e.currentTarget.style.background = "#F4F5F6";}}
              onMouseLeave={(e) => {if (!on && !past) e.currentTarget.style.background = "transparent";}}>

                {c.getDate()}
              </button>);

          })}
        </div>
      </div>
    </div>);

}

// ---- Time popover -------------------------------------------------------
function TimePopBCW({ value, onPick }) {
  const ref = useRefBCW(null);
  useEffectBCW(() => {
    if (!ref.current) return;
    const sel = ref.current.querySelector("[data-on=true]");
    if (sel) sel.scrollIntoView ? null : null;
    if (sel && ref.current) ref.current.scrollTop = sel.offsetTop - 80;
  }, []);
  return (
    <div ref={ref} style={{ padding: 6, maxHeight: 280, overflowY: "auto", minWidth: 180 }}>
      {TIMES_BCW.map((t) => {
        const on = t.key === value;
        return (
          <button key={t.key} data-on={on} onClick={() => onPick(t.key)} style={{
            width: "100%", textAlign: "left",
            padding: "8px 12px", borderRadius: 6, border: 0,
            background: on ? "#EDF1FB" : "transparent",
            color: on ? "#1F4ED8" : "#0F1214",
            fontFamily: "inherit", fontSize: 13.5, fontWeight: on ? 700 : 500,
            cursor: "pointer"
          }}
          onMouseEnter={(e) => {if (!on) e.currentTarget.style.background = "#F4F5F6";}}
          onMouseLeave={(e) => {if (!on) e.currentTarget.style.background = "transparent";}}>

            {t.label}
          </button>);

      })}
    </div>);

}

// ---- Players popover ----------------------------------------------------
// Stepper. Most racquet matches are 2 or 4 — quick chips for those, and a
// +/- stepper for anything else (open play, round robin sign-ups).
function PlayersPopBCW({ value, onPick }) {
  const dec = () => onPick(Math.max(1, value - 1));
  const inc = () => onPick(Math.min(16, value + 1));
  return (
    <div style={{ padding: 14, minWidth: 240 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: "#0F1214" }}>Players</div>
          <div style={{ fontSize: 12, color: "#4B5052", marginTop: 2 }}>{value === 1 ? "Solo · drills or wall" : value === 2 ? "Singles" : value === 4 ? "Doubles" : `${value} players`}</div>
        </div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 0, border: "1px solid #DEE1E5", borderRadius: 999, overflow: "hidden" }}>
          <button onClick={dec} disabled={value <= 1} aria-label="Fewer" style={{ width: 32, height: 32, border: 0, background: "transparent", cursor: value <= 1 ? "default" : "pointer", color: value <= 1 ? "#C9CED1" : "#0F1214", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="Minus" size={14} strokeWidth={2} color="currentColor" />
          </button>
          <div style={{ minWidth: 28, textAlign: "center", fontSize: 14, fontWeight: 700, color: "#0F1214" }}>{value}</div>
          <button onClick={inc} disabled={value >= 16} aria-label="More" style={{ width: 32, height: 32, border: 0, background: "transparent", cursor: value >= 16 ? "default" : "pointer", color: value >= 16 ? "#C9CED1" : "#0F1214", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="Plus" size={14} strokeWidth={2} color="currentColor" />
          </button>
        </div>
      </div>
      <div style={{ display: "flex", gap: 6, marginTop: 12, flexWrap: "wrap" }}>
        {[
        { v: 2, label: "Singles · 2" },
        { v: 4, label: "Doubles · 4" },
        { v: 6, label: "Round robin · 6" },
        { v: 8, label: "Open play · 8" }].
        map((p) => {
          const on = p.v === value;
          return (
            <button key={p.v} onClick={() => onPick(p.v)} style={{
              padding: "6px 10px", borderRadius: 999,
              border: `1px solid ${on ? "#1F4ED8" : "#DEE1E5"}`,
              background: on ? "#EDF1FB" : "#fff",
              color: on ? "#1F4ED8" : "#0F1214",
              fontFamily: "inherit", fontSize: 12, fontWeight: on ? 700 : 500,
              cursor: "pointer"
            }}>
              {p.label}
            </button>);

        })}
      </div>
    </div>);

}

// ---- Location popover ---------------------------------------------------
function LocationPopBCW({ value, onPick }) {
  const [q, setQ] = useStateBCW(value || "");
  const sugg = [
  { label: "Use current location", sub: "St. Augustine, FL 32084", icon: "Navigation" },
  { label: "Old Coast Pickleball", sub: "St. Augustine, FL · 0.8 mi", icon: "MapPin" },
  { label: "Dill Dinkers Riverside", sub: "Jacksonville, FL · 38 mi", icon: "MapPin" },
  { label: "Bayfront Tennis Center", sub: "St. Augustine, FL · 2.1 mi", icon: "MapPin" },
  { label: "Ponte Vedra Racquet Club", sub: "Ponte Vedra, FL · 19 mi", icon: "MapPin" }].
  filter((s) => !q || s.label.toLowerCase().includes(q.toLowerCase()) || s.sub.toLowerCase().includes(q.toLowerCase()));
  return (
    <div style={{ minWidth: 340 }}>
      <div style={{ padding: 10, borderBottom: "1px solid #E9EBEC" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", border: "1px solid #DEE1E5", borderRadius: 6, background: "#fff" }}>
          <Icon name="Search" size={14} strokeWidth={1.75} color="#858F8F" />
          <input
            autoFocus
            value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="City, club, zip..."
            style={{ flex: 1, border: 0, outline: 0, background: "transparent", fontFamily: "inherit", fontSize: 13.5, color: "#0F1214" }} />

        </div>
      </div>
      <div style={{ maxHeight: 280, overflowY: "auto", padding: 6 }}>
        {sugg.length === 0 ?
        <div style={{ padding: "16px 10px", color: "#858F8F", fontSize: 13 }}>No matches</div> :

        sugg.map((s, i) =>
        <button key={i} onClick={() => onPick(s.label === "Use current location" ? "St. Augustine, FL" : s.label)} style={{
          width: "100%", display: "flex", alignItems: "center", gap: 10,
          padding: "10px 12px", borderRadius: 6, border: 0, background: "transparent",
          color: "#0F1214", fontFamily: "inherit", cursor: "pointer", textAlign: "left"
        }}
        onMouseEnter={(e) => {e.currentTarget.style.background = "#F4F5F6";}}
        onMouseLeave={(e) => {e.currentTarget.style.background = "transparent";}}>

            <div style={{
            width: 32, height: 32, borderRadius: 6, background: s.icon === "Navigation" ? "#EDF1FB" : "#F4F5F6",
            display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0
          }}>
              <Icon name={s.icon} size={14} strokeWidth={1.75} color={s.icon === "Navigation" ? "#1F4ED8" : "#0F1214"} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: s.icon === "Navigation" ? "#1F4ED8" : "#0F1214", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.label}</div>
              <div style={{ fontSize: 11.5, color: "#858F8F", marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.sub}</div>
            </div>
          </button>
        )}
      </div>
    </div>);

}

// ---- Main widget --------------------------------------------------------
function BookCourtWidget({ onSubmit, compact = false, defaultSport = "any" }) {
  const [open, setOpen] = useStateBCW(null);// "sport" | "date" | "time" | "players" | "loc" | null
  const [sport, setSport] = useStateBCW(defaultSport);
  const [date, setDate] = useStateBCW(() => {const d = new Date();d.setHours(0, 0, 0, 0);return d;});
  const [time, setTime] = useStateBCW(null);
  const [players, setPlayers] = useStateBCW(1);
  const [loc, setLoc] = useStateBCW("Oakland, CA");

  const sportLabel = SPORTS_BCW.find((s) => s.id === sport)?.label || "Any Sport";
  const sportIcon = SPORTS_BCW.find((s) => s.id === sport)?.icon || "LayoutGrid";
  const timeLabel = time ? (TIMES_BCW.find((t) => t.key === time)?.label || "Any Time") : "Any Time";

  const close = () => setOpen(null);
  const submit = () => {
    if (onSubmit) onSubmit({ sport, date, time, players, loc });
  };

  const ctaSize = compact ? 44 : 52;
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter, system-ui, sans-serif" }}>
      <div style={{
      flex: 1, maxWidth: 900,
      background: "#fff", border: "1px solid #E9EBEC", borderRadius: 999,
      boxShadow: "0 8px 24px rgba(15,18,20,0.06), 0 1px 2px rgba(15,18,20,0.04)",
      display: "flex", alignItems: "center",
      overflow: "visible", position: "relative",
      padding: 6
    }}>
      <FieldBCW
        first
        compact={compact}
        label="Where"
        value={loc}
        trailing={<Icon name="Navigation" size={16} strokeWidth={1.75} color="#1F4ED8" />}
        isOpen={open === "loc"}
        onOpen={() => setOpen("loc")}
        onClose={close}
        popover={<LocationPopBCW value={loc} onPick={(v) => {setLoc(v);close();}} />} />

      <FieldBCW
        compact={compact}
        label="Activity"
        value={sport === "any" ? "Any Sport" : sportLabel}
        isOpen={open === "sport"}
        onOpen={() => setOpen("sport")}
        onClose={close}
        popover={<SportPopBCW value={sport} onPick={(v) => {setSport(v);close();}} />} />

      <FieldBCW
        compact={compact}
        label="When"
        value={time ? `${fmtDateBCW(date)} • ${timeLabel}` : "Any Day • Any Time"}
        isOpen={open === "date"}
        onOpen={() => setOpen("date")}
        onClose={close}
        popover={<DatePopBCW value={date} onPick={(v) => {setDate(v);setTime("18:0");close();}} />} />

      <FieldBCW
        compact={compact}
        label="Who"
        value={`${players} ${players === 1 ? "Player" : "Players"}`}
        isOpen={open === "players"}
        onOpen={() => setOpen("players")}
        onClose={close}
        popover={<PlayersPopBCW value={players} onPick={(v) => setPlayers(v)} />} />

      <button
          onClick={submit}
          aria-label="Find courts"
          style={{
            background: "#0F1214", color: "#fff",
            border: 0, borderRadius: 999,
            width: ctaSize, height: ctaSize,
            cursor: "pointer",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0, marginLeft: 6,
            transition: "background 120ms"
          }}
          onMouseEnter={(e) => {e.currentTarget.style.background = "#212424";}}
          onMouseLeave={(e) => {e.currentTarget.style.background = "#0F1214";}}>

          <Icon name="ArrowRight" size={18} strokeWidth={2.2} color="#fff" />
        </button>
      </div>
    </div>);

}

Object.assign(window, { BookCourtWidget });
