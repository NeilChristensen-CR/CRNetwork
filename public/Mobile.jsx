// Mobile.jsx — single screen: browse with working search + filter sheet.
const { useState: useStateMB, useMemo: useMemoMB, useRef: useRefMB, useEffect: useEffectMB } = React;

function FilterChip({ label, onRemove }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 28, padding: "0 4px 0 10px", borderRadius: 8, background: "#0F1214", color: "#fff", fontSize: 11, fontWeight: 600 }}>
      {label}
      <button onClick={onRemove} style={{ width: 20, height: 20, borderRadius: 999, border: 0, background: "rgba(255,255,255,.18)", color: "#fff", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
        <Icon name="X" size={9} color="#fff" strokeWidth={2.5} />
      </button>
    </span>);

}

function FacetGroup({ title, count, children }) {
  return (
    <div style={{ paddingBottom: 18, marginBottom: 18, borderBottom: "1px solid #E9EBEC" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <div style={{ fontFamily: "Axiforma", fontWeight: 800, fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase", color: "#0F1214" }}>{title}</div>
        {count > 0 &&
        <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 18, height: 18, padding: "0 6px", borderRadius: 8, background: "#0F1214", color: "#fff", fontSize: 10, fontWeight: 700, fontFamily: "Axiforma" }}>{count}</span>
        }
      </div>
      {children}
    </div>);

}

function CheckRow({ label, checked, count, onToggle }) {
  return (
    <div onClick={onToggle} style={{
      display: "flex", alignItems: "center", gap: 12, padding: "8px 8px 8px 4px",
      margin: "0 -8px", borderRadius: 8, cursor: "pointer",
      background: checked ? "#F4F5F6" : "transparent",
      transition: "background 120ms"
    }}>
      <span style={{ width: 18, height: 18, borderRadius: 8, border: checked ? "1px solid #0F1214" : "1px solid #BBBFC1", background: checked ? "#0F1214" : "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {checked && <Icon name="Check" size={11} color="#fff" strokeWidth={3} />}
      </span>
      <span style={{ flex: 1, color: "#0F1214", fontWeight: checked ? 600 : 500, fontSize: 13 }}>{label}</span>
      {count != null && <span style={{ fontSize: 11, color: checked ? "#0F1214" : "#858F8F", fontVariantNumeric: "tabular-nums", fontWeight: checked ? 700 : 500 }}>{count}</span>}
    </div>);

}

function MobileFrame({ children }) {
  return (
    <div style={{ width: 390, height: 844, borderRadius: 8, background: "#0F1214", padding: 8, boxShadow: "0 8px 24px rgba(0,0,0,.10)" }}>
      <div style={{ width: "100%", height: "100%", borderRadius: 8, background: "#fff", overflow: "hidden", position: "relative", display: "flex", flexDirection: "column" }}>
        <div style={{ height: 44, padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 13, fontWeight: 600, color: "#0F1214", flexShrink: 0 }}>
          <span>9:41</span>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Icon name="Signal" size={14} />
            <Icon name="Wifi" size={14} />
            <Icon name="BatteryFull" size={16} />
          </div>
        </div>
        {children}
      </div>
    </div>);

}

function MobileEventRow({ ev, onClick }) {
  const urg = urgencyOf(ev);
  return (
    <div onClick={onClick} style={{ padding: "18px 0", borderBottom: "1px solid #E9EBEC", display: "grid", gridTemplateColumns: "72px 1fr auto", gap: 14, alignItems: "center", cursor: "pointer" }}>
      <div>
        {/* Tabular-nums + nowrap so every time field reserves the same
             width as the longest time string (e.g. "11:30 AM"), keeping the
             title column on adjacent rows perfectly aligned. */}
        <div style={{ fontFamily: "Axiforma", fontWeight: 700, fontSize: 15, color: "#0F1214", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{ev.timeShort}</div>
        <div style={{ fontSize: 10, color: "#4B5052", marginTop: 2, whiteSpace: "nowrap" }}>{ev.dateShort}</div>
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: "Axiforma", fontWeight: 700, fontSize: 15, color: "#0F1214", letterSpacing: -0.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ev.name}</div>
        <div style={{ fontSize: 11, color: "#4B5052", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ev.format} · {ev.skill}</div>
        {(urg || ev.going > 0) &&
        <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 8 }}>
            {urg &&
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10, fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase",
            color: urg.tone === "alert" ? "#E11D2A" : urg.tone === "warn" ? "#C77700" : "#0F1214" }}>
                {urg.live && <LiveDot tone={urg.tone} />}
                {urg.text}
              </span>
          }
            {ev.going > 0 && !urg &&
          <span style={{ fontSize: 10, color: "#4B5052", fontWeight: 600 }}>{ev.going} going</span>
          }
          </div>
        }
      </div>
      <div style={{ fontFamily: "Axiforma", fontWeight: 700, fontSize: 14, color: "#0F1214" }}>{ev.priceLabel}</div>
    </div>);

}

function MobileHero({ ev }) {
  return (
    <div style={{ background: "#0F1214", color: "#fff", padding: "20px 24px 22px", margin: "8px 24px 0", borderRadius: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <LiveDot tone="alert" />
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase" }}>Tonight · 1 left</span>
      </div>
      <div style={{ fontFamily: "Axiforma", fontWeight: 800, fontSize: 26, lineHeight: "28px", letterSpacing: -0.7 }}>{ev.name}.</div>
      <div style={{ marginTop: 6, fontSize: 11, color: "#BBBFC1", fontWeight: 500 }}>{ev.timeShort} · {ev.skill} · {ev.coach}</div>
      <div style={{ marginTop: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <div style={{ display: "inline-flex" }}>
            {ev.friends.slice(0, 3).map((init, i) =>
            <div key={i} style={{ width: 22, height: 22, borderRadius: 999, background: i % 2 === 0 ? "#fff" : "#BBBFC1", color: "#0F1214", fontSize: 9, fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center", border: "2px solid #0F1214", marginLeft: i === 0 ? 0 : -8, fontFamily: "Axiforma" }}>{init}</div>
            )}
          </div>
          <span style={{ fontSize: 11, color: "#fff", fontWeight: 500 }}>{ev.going} going</span>
        </div>
        <button style={{ height: 36, padding: "0 16px", borderRadius: 8, border: 0, background: "#fff", color: "#0F1214", fontFamily: "inherit", fontWeight: 600, fontSize: 12, display: "inline-flex", alignItems: "center", gap: 6 }}>
          Grab it <Icon name="ArrowRight" size={12} strokeWidth={2.5} />
        </button>
      </div>
    </div>);

}

// ── Filter logic (mirrors desktop bucket helpers) ──
function mbSkillBucket(ev) {
  const s = (ev.skill || "").toLowerCase();
  if (s.includes("1.") || s.includes("2.0") || s.includes("2.5") || s.includes("beginner") || s.includes("all")) return "beg";
  if (s.includes("3.0") || s.includes("3.5") || s.includes("intermediate")) return "int";
  if (s.includes("4.") || s.includes("advanced") || s.includes("3.5+") || s.includes("dupr")) return "adv";
  return "any";
}
function mbWhenBuckets(ev) {
  const buckets = [];
  if (ev.when === "today") buckets.push("today");
  if (ev.dateShort && (ev.dateShort.includes("Sat") || ev.dateShort.includes("Sun"))) buckets.push("weekend");
  // parse hour from timeShort like "6:30 PM"
  const m = (ev.timeShort || "").match(/^(\d{1,2}):?\d*\s*(AM|PM)?/i);
  if (m) {
    let h = parseInt(m[1], 10);
    const ap = (m[2] || "").toUpperCase();
    if (ap === "PM" && h !== 12) h += 12;
    if (ap === "AM" && h === 12) h = 0;
    if (h < 12) buckets.push("morning");else
    if (h >= 17) buckets.push("evening");
  }
  return buckets;
}
function mbFormatBucket(ev) {
  const f = (ev.format + " " + ev.name).toLowerCase();
  if (f.includes("round robin")) return "rr";
  if (f.includes("clinic")) return "clinic";
  if (f.includes("drop") || f.includes("open play")) return "dropin";
  if (f.includes("ladder")) return "ladder";
  if (f.includes("bracket") || f.includes("tournament")) return "tournament";
  return "other";
}

function PillChip({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      height: 34, padding: "0 14px", borderRadius: 8,
      border: active ? "1px solid #0F1214" : "1px solid #DEE1E5",
      background: active ? "#0F1214" : "#fff",
      color: active ? "#fff" : "#0F1214",
      fontFamily: "inherit", fontSize: 12, fontWeight: 600, cursor: "pointer",
      whiteSpace: "nowrap", transition: "all 120ms"
    }}>{label}</button>);

}

function SectionHead({ title, count }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, marginTop: 4 }}>
      <div style={{ fontFamily: "Axiforma", fontWeight: 800, fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase", color: "#0F1214" }}>{title}</div>
      {count > 0 &&
      <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 18, height: 18, padding: "0 6px", borderRadius: 8, background: "#0F1214", color: "#fff", fontSize: 10, fontWeight: 700, fontFamily: "Axiforma" }}>{count}</span>
      }
    </div>);

}

function SegToggle({ value, onChange, options }) {
  return (
    <div style={{ display: "inline-flex", padding: 3, background: "#F4F5F6", borderRadius: 999, gap: 2 }}>
      {options.map((o) =>
      <button key={o.key} onClick={() => onChange(o.key)} style={{
        height: 30, padding: "0 14px", borderRadius: 999, border: 0,
        background: value === o.key ? "#fff" : "transparent",
        color: "#0F1214",
        boxShadow: value === o.key ? "0 1px 2px rgba(0,0,0,.08)" : "none",
        fontFamily: "inherit", fontSize: 12, fontWeight: value === o.key ? 700 : 500, cursor: "pointer"
      }}>{o.label}</button>
      )}
    </div>);

}

function ToggleSwitch({ on, onChange, label, hint }) {
  return (
    <div onClick={() => onChange(!on)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", cursor: "pointer" }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#0F1214" }}>{label}</div>
        {hint && <div style={{ fontSize: 11, color: "#858F8F", marginTop: 2 }}>{hint}</div>}
      </div>
      <div style={{ width: 42, height: 24, borderRadius: 999, background: on ? "#0F1214" : "#DEE1E5", position: "relative", transition: "background 150ms" }}>
        <div style={{ position: "absolute", top: 2, left: on ? 20 : 2, width: 20, height: 20, borderRadius: 999, background: "#fff", boxShadow: "0 1px 2px rgba(0,0,0,.15)", transition: "left 180ms cubic-bezier(.2,.8,.2,1)" }} />
      </div>
    </div>);

}

function RangeSlider({ value, onChange, min, max, step, format }) {
  const [lo, hi] = value;
  const pctLo = (lo - min) / (max - min) * 100;
  const pctHi = (hi - min) / (max - min) * 100;
  return (
    <div style={{ paddingTop: 4 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <span style={{ fontSize: 12, color: "#4B5052", fontWeight: 500 }}>{format(min)}</span>
        <span style={{ fontFamily: "Axiforma", fontSize: 13, fontWeight: 700, color: "#0F1214" }}>{format(lo)} – {format(hi)}</span>
        <span style={{ fontSize: 12, color: "#4B5052", fontWeight: 500 }}>{format(max)}</span>
      </div>
      <div style={{ position: "relative", height: 24, display: "flex", alignItems: "center" }}>
        <div style={{ position: "absolute", left: 0, right: 0, height: 4, background: "#E9EBEC", borderRadius: 999 }} />
        <div style={{ position: "absolute", left: `${pctLo}%`, width: `${pctHi - pctLo}%`, height: 4, background: "#0F1214", borderRadius: 999 }} />
        <input type="range" min={min} max={max} step={step} value={lo} onChange={(e) => onChange([Math.min(+e.target.value, hi - step), hi])}
        style={{ position: "absolute", inset: 0, opacity: 0, width: "100%", cursor: "pointer", margin: 0, pointerEvents: "auto" }} />
        <input type="range" min={min} max={max} step={step} value={hi} onChange={(e) => onChange([lo, Math.max(+e.target.value, lo + step)])}
        style={{ position: "absolute", inset: 0, opacity: 0, width: "100%", cursor: "pointer", margin: 0, pointerEvents: "auto" }} />
        <div style={{ position: "absolute", left: `calc(${pctLo}% - 9px)`, width: 18, height: 18, borderRadius: 999, background: "#0F1214", border: "3px solid #fff", boxShadow: "0 1px 3px rgba(0,0,0,.2)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", left: `calc(${pctHi}% - 9px)`, width: 18, height: 18, borderRadius: 999, background: "#0F1214", border: "3px solid #fff", boxShadow: "0 1px 3px rgba(0,0,0,.2)", pointerEvents: "none" }} />
      </div>
    </div>);

}

const TYPE_OPTIONS = [
{ key: "singles", label: "Singles" },
{ key: "doubles", label: "Doubles" },
{ key: "clinic", label: "Clinic" },
{ key: "dropin", label: "Drop-in" },
{ key: "rr", label: "Round Robin" },
{ key: "tournament", label: "Tournament" },
{ key: "junior", label: "Junior" },
{ key: "social", label: "Social" },
{ key: "openplay", label: "Open Play" }];

const WHEN_PILLS = [
{ key: "today", label: "Today" },
{ key: "tomorrow", label: "Tomorrow" },
{ key: "weekend", label: "This weekend" },
{ key: "morning", label: "Mornings" },
{ key: "afternoon", label: "Afternoons" },
{ key: "evening", label: "Evenings" }];

const SEASON_OPTIONS = [
{ key: "spring", label: "Spring" },
{ key: "summer", label: "Summer" },
{ key: "fall", label: "Fall" },
{ key: "winter", label: "Winter" }];

const SORT_OPTIONS = [
{ key: "recommended", label: "Recommended", hint: "based on your level & history", icon: "Sparkles" },
{ key: "soonest", label: "Soonest first", icon: "Calendar" },
{ key: "popular", label: "Most popular", icon: "Flame" },
{ key: "price-asc", label: "Price: low to high", icon: "ArrowDown" },
{ key: "price-desc", label: "Price: high to low", icon: "ArrowUp" },
{ key: "spots", label: "Spots available", icon: "Users" },
{ key: "nearest", label: "Nearest to me", icon: "MapPin" }];


function MobileFilterSheet({ open, onClose, query, setQuery, facets, setFacets, toggleFacet, clearAll, resultCount,
  sort, setSort, duprRange, setDuprRange, eligibleOnly, setEligibleOnly,
  instructorOnly, setInstructorOnly, instructorQuery, setInstructorQuery,
  clubRating, setClubRating, customRating, setCustomRating }) {
  const setGender = (v) => {
    const next = new Set();
    if (v !== "all") next.add(v);
    setFacets((prev) => ({ ...prev, gender: next }));
  };
  const [tab, setTab] = useStateMB("filter");
  const [moreOpen, setMoreOpen] = useStateMB(false);
  const activeChips = [];
  facets.type.forEach((k) => activeChips.push({ group: "type", key: k, label: (TYPE_OPTIONS.find((o) => o.key === k) || {}).label || k }));
  facets.when.forEach((k) => activeChips.push({ group: "when", key: k, label: (WHEN_PILLS.find((o) => o.key === k) || {}).label || k }));
  facets.gender.forEach((k) => activeChips.push({ group: "gender", key: k, label: { all: "All", w: "Women's", m: "Men's" }[k] || k }));
  facets.season.forEach((k) => activeChips.push({ group: "season", key: k, label: (SEASON_OPTIONS.find((o) => o.key === k) || {}).label || k }));
  if (duprRange[0] > 2.0 || duprRange[1] < 8.0) activeChips.push({ group: "_dupr", key: "dupr", label: `DUPR ${duprRange[0].toFixed(2)}–${duprRange[1].toFixed(2)}` });
  if (instructorOnly) activeChips.push({ group: "_io", key: "io", label: "Instructor-led" });
  if (eligibleOnly) activeChips.push({ group: "_eo", key: "eo", label: "Only I can join" });
  if (instructorQuery) activeChips.push({ group: "_iq", key: "iq", label: `Instructor: ${instructorQuery}` });
  const removeChip = (c) => {
    if (c.group === "_dupr") setDuprRange([2.0, 8.0]);else
    if (c.group === "_io") setInstructorOnly(false);else
    if (c.group === "_eo") setEligibleOnly(false);else
    if (c.group === "_iq") setInstructorQuery("");else
    toggleFacet(c.group, c.key);
  };

  return (
    <React.Fragment>
      <div onClick={onClose} style={{
        position: "absolute", inset: 0, background: "rgba(15,18,20,.4)",
        opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none",
        transition: "opacity 220ms ease", zIndex: 50
      }} />
      <div style={{
        position: "absolute", inset: 0,
        background: "#fff",
        display: "flex", flexDirection: "column",
        transform: open ? "translateY(0)" : "translateY(100%)",
        transition: "transform 320ms cubic-bezier(.2,.8,.2,1)", zIndex: 51
      }}>
        <div style={{ padding: "12px 24px 4px", display: "flex", alignItems: "baseline", justifyContent: "space-between", flexShrink: 0 }}>
          <h2 style={{ fontFamily: "Axiforma", fontWeight: 800, fontSize: 26, letterSpacing: -0.7, color: "#0F1214", margin: 0 }}>{tab === "filter" ? "Filter." : "Sort."}</h2>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 999, border: 0, background: "#F4F5F6", display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Icon name="X" size={16} />
          </button>
        </div>
        <div style={{ padding: "8px 24px 12px", flexShrink: 0 }}>
          <div style={{ display: "flex", gap: 4, background: "#F4F5F6", padding: 4, borderRadius: 8 }}>
            {[{ k: "filter", l: "Filter" }, { k: "sort", l: "Sort" }].map((t) =>
            <button key={t.k} onClick={() => setTab(t.k)} style={{
              flex: 1, height: 36, borderRadius: 8, border: 0,
              background: tab === t.k ? "#fff" : "transparent",
              color: "#0F1214", boxShadow: tab === t.k ? "0 1px 2px rgba(0,0,0,.08)" : "none",
              fontFamily: "inherit", fontSize: 13, fontWeight: tab === t.k ? 700 : 500, cursor: "pointer"
            }}>{t.l}</button>
            )}
          </div>
        </div>
        {tab === "filter" &&
        <div style={{ padding: "12px 24px 8px", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", height: 44, borderBottom: "2px solid #0F1214" }}>
              <Icon name="Search" size={16} />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name, instructor, format"
            style={{ flex: 1, border: 0, outline: 0, marginLeft: 10, fontFamily: "inherit", fontSize: 15, color: "#0F1214", background: "transparent" }} />
              {query &&
            <button onClick={() => setQuery("")} style={{ width: 24, height: 24, borderRadius: 999, border: 0, background: "#F4F5F6", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name="X" size={12} />
                </button>
            }
            </div>
          </div>
        }
        {tab === "filter" && activeChips.length > 0 &&
        <div style={{ padding: "0 24px 12px", display: "flex", flexWrap: "wrap", gap: 6, flexShrink: 0 }}>
            {activeChips.map((c) =>
          <FilterChip key={c.group + c.key} label={c.label} onRemove={() => removeChip(c)} />
          )}
          </div>
        }
        <div style={{ flex: 1, overflowY: "auto", padding: "4px 24px 12px" }}>
          {tab === "filter" ?
          <React.Fragment>
              <div style={{ paddingBottom: 18, marginBottom: 18, borderBottom: "1px solid #E9EBEC" }}>
                <SectionHead title="What are you looking for" count={facets.type.size} />
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {TYPE_OPTIONS.map((o) =>
                <PillChip key={o.key} label={o.label} active={facets.type.has(o.key)} onClick={() => toggleFacet("type", o.key)} />
                )}
                </div>
              </div>
              <div style={{ paddingBottom: 18, marginBottom: 18, borderBottom: "1px solid #E9EBEC" }}>
                <SectionHead title="When are you looking for it" count={facets.when.size} />
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {WHEN_PILLS.map((o) =>
                <PillChip key={o.key} label={o.label} active={facets.when.has(o.key)} onClick={() => toggleFacet("when", o.key)} />
                )}
                </div>
              </div>
              <div style={{ paddingBottom: 18, marginBottom: 18, borderBottom: "1px solid #E9EBEC" }}>
                <SectionHead title="Who do you want there" count={facets.gender.size + (duprRange[0] > 2.0 || duprRange[1] < 8.0 ? 1 : 0) + (instructorOnly ? 1 : 0) + (instructorQuery ? 1 : 0)} />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <span style={{ fontSize: 12, color: "#4B5052", fontWeight: 500 }}>Gender</span>
                  <SegToggle value={Array.from(facets.gender)[0] || "all"} onChange={setGender} options={[{ key: "all", label: "All" }, { key: "w", label: "Women's" }, { key: "m", label: "Men's" }]} />
                </div>
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 12, color: "#4B5052", fontWeight: 500, marginBottom: 4 }}>Player skill (DUPR)</div>
                  <RangeSlider value={duprRange} onChange={setDuprRange} min={2.0} max={8.0} step={0.1} format={(v) => v.toFixed(2)} />
                </div>
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 12, color: "#4B5052", fontWeight: 500, marginBottom: 6 }}>Instructor</div>
                  <div style={{ display: "flex", alignItems: "center", height: 40, padding: "0 12px", borderRadius: 8, border: "1px solid #DEE1E5" }}>
                    <Icon name="Search" size={14} color="#858F8F" />
                    <input value={instructorQuery} onChange={(e) => setInstructorQuery(e.target.value)} placeholder="Filter by instructor name"
                  style={{ flex: 1, border: 0, outline: 0, marginLeft: 8, fontFamily: "inherit", fontSize: 13, color: "#0F1214", background: "transparent" }} />
                  </div>
                </div>
                <ToggleSwitch on={instructorOnly} onChange={setInstructorOnly} label="Instructor-led only" hint="Hide open play and self-organized events" />
              </div>
              <div style={{ paddingBottom: 18, marginBottom: 18 }}>
                <div onClick={() => setMoreOpen(!moreOpen)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", padding: "6px 0" }}>
                  <SectionHead title="Additional filters" count={facets.season.size + (clubRating[0] > 1 || clubRating[1] < 5 ? 1 : 0) + (customRating ? 1 : 0) + (eligibleOnly ? 1 : 0)} />
                  <span style={{ display: "inline-flex", transform: moreOpen ? "rotate(0)" : "rotate(-90deg)", transition: "transform 180ms" }}>
                    <Icon name="ChevronDown" size={14} strokeWidth={2.4} />
                  </span>
                </div>
                {moreOpen &&
              <div style={{ marginTop: 8 }}>
                    <ToggleSwitch on={eligibleOnly} onChange={setEligibleOnly} label="Only events I can join" hint="Hide events outside your skill range or already full" />
                    <div style={{ height: 14 }} />
                    <div style={{ fontSize: 12, color: "#4B5052", fontWeight: 500, marginBottom: 8 }}>Season</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
                      {SEASON_OPTIONS.map((o) =>
                  <PillChip key={o.key} label={o.label} active={facets.season.has(o.key)} onClick={() => toggleFacet("season", o.key)} />
                  )}
                    </div>
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ fontSize: 12, color: "#4B5052", fontWeight: 500, marginBottom: 4 }}>Club rating</div>
                      <RangeSlider value={clubRating} onChange={setClubRating} min={1} max={5} step={1} format={(v) => `${v}★`} />
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      <div style={{ fontSize: 12, color: "#4B5052", fontWeight: 500, marginBottom: 6 }}>Club's custom rating</div>
                      <div style={{ position: "relative" }}>
                        <select value={customRating} onChange={(e) => setCustomRating(e.target.value)}
                    style={{ width: "100%", height: 40, padding: "0 36px 0 12px", borderRadius: 8, border: "1px solid #DEE1E5", background: "#fff", fontFamily: "inherit", fontSize: 13, color: customRating ? "#0F1214" : "#858F8F", appearance: "none", cursor: "pointer" }}>
                          <option value="">Any custom rating</option>
                          <option value="red">Red ball (kids)</option>
                          <option value="yellow">Yellow ball</option>
                          <option value="blue">Blue ball</option>
                          <option value="bronze">Bronze tier</option>
                          <option value="silver">Silver tier</option>
                          <option value="gold">Gold tier</option>
                        </select>
                        <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                          <Icon name="ChevronDown" size={14} color="#858F8F" />
                        </span>
                      </div>
                    </div>
                  </div>
              }
              </div>
            </React.Fragment> :

          <div>
              {SORT_OPTIONS.map((o, i) =>
            <div key={o.key} onClick={() => setSort(o.key)} style={{
              display: "flex", alignItems: "center", gap: 14, padding: "14px 8px", margin: "0 -8px",
              borderRadius: 8, cursor: "pointer",
              background: sort === o.key ? "#F4F5F6" : "transparent",
              transition: "background 120ms"
            }}>
                  <span style={{ width: 36, height: 36, borderRadius: 999, background: "#F4F5F6", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon name={o.icon} size={16} />
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: sort === o.key ? 700 : 500, color: "#0F1214" }}>{o.label}</div>
                    {o.hint && <div style={{ fontSize: 11, color: "#858F8F", marginTop: 2 }}>{o.hint}</div>}
                  </div>
                  <span style={{ width: 20, height: 20, borderRadius: 999, border: sort === o.key ? "6px solid #0F1214" : "1px solid #DEE1E5", background: "#fff", flexShrink: 0, transition: "all 120ms" }} />
                </div>
            )}
            </div>
          }
        </div>
        <div style={{ padding: 16, borderTop: "1px solid #E9EBEC", display: "flex", gap: 8, flexShrink: 0 }}>
          <button onClick={clearAll} style={{ flex: 1, height: 48, borderRadius: 8, background: "#fff", color: "#0F1214", border: "1px solid #DEE1E5", fontFamily: "inherit", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Clear</button>
          <button onClick={onClose} style={{ flex: 1, height: 48, borderRadius: 8, background: "#0F1214", color: "#fff", border: 0, fontFamily: "inherit", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
            Show {resultCount} {resultCount === 1 ? "event" : "events"}
          </button>
        </div>
      </div>
    </React.Fragment>);

}

function BrowseMobile({ bare = false, onBack }) {
  const [selectedEv, setSelectedEv] = useStateMB(null);
  const [filterOpen, setFilterOpen] = useStateMB(false);
  const [query, setQuery] = useStateMB("");
  const [facets, setFacets] = useStateMB({
    when: new Set(), format: new Set(), skill: new Set(),
    type: new Set(), gender: new Set(), season: new Set()
  });
  const [sort, setSort] = useStateMB("recommended");
  const [duprRange, setDuprRange] = useStateMB([2.0, 8.0]);
  const [eligibleOnly, setEligibleOnly] = useStateMB(false);
  const [instructorOnly, setInstructorOnly] = useStateMB(false);
  const [instructorQuery, setInstructorQuery] = useStateMB("");
  const [clubRating, setClubRating] = useStateMB([1, 5]);
  const [customRating, setCustomRating] = useStateMB("");
  const [showMonth, setShowMonth] = useStateMB(false);
  const mobSentinelRef = useRefMB(null);
  const scrollRef = useRefMB(null);
  useEffectMB(() => {
    if (showMonth) return;
    const el = scrollRef.current;if (!el) return;
    const onScroll = () => {
      const s = mobSentinelRef.current;if (!s) return;
      const rect = s.getBoundingClientRect();
      const parentRect = el.getBoundingClientRect();
      if (rect.top - parentRect.top < el.clientHeight + 200) setShowMonth(true);
    };
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [showMonth]);

  const toggleFacet = (group, key) => {
    setFacets((prev) => {
      const next = new Set(prev[group]);
      if (next.has(key)) next.delete(key);else next.add(key);
      return { ...prev, [group]: next };
    });
  };
  const clearAll = () => {
    setQuery("");
    setFacets({ when: new Set(), format: new Set(), skill: new Set(), type: new Set(), gender: new Set(), season: new Set() });
    setSort("recommended");setDuprRange([2.0, 8.0]);setEligibleOnly(false);
    setInstructorOnly(false);setInstructorQuery("");setClubRating([1, 5]);setCustomRating("");
  };

  // Source: everything except hero
  const pool = useMemoMB(() => SAMPLE_EVENTS.filter((e) => e.id !== "e4"), []);

  // Counts per facet key, computed against the OTHER facets so users can see
  // how many would match if they added this filter (light approximation: just
  // counts against the unfiltered pool — clearer for a small list).
  const counts = useMemoMB(() => {
    const c = {
      when: { today: 0, weekend: 0, morning: 0, evening: 0 },
      format: { rr: 0, dropin: 0, clinic: 0, ladder: 0, tournament: 0 },
      skill: { beg: 0, int: 0, adv: 0 }
    };
    for (const ev of pool) {
      mbWhenBuckets(ev).forEach((b) => {if (c.when[b] != null) c.when[b]++;});
      const f = mbFormatBucket(ev);if (c.format[f] != null) c.format[f]++;
      const s = mbSkillBucket(ev);if (c.skill[s] != null) c.skill[s]++;
    }
    return c;
  }, [pool]);

  const filtered = useMemoMB(() => {
    let list = pool.filter((ev) => {
      if (query) {
        const q = query.toLowerCase();
        if (!(ev.name.toLowerCase().includes(q) || ev.coach.toLowerCase().includes(q) || ev.format.toLowerCase().includes(q))) return false;
      }
      if (facets.when.size) {
        const buckets = mbWhenBuckets(ev);
        if (!buckets.some((b) => facets.when.has(b))) return false;
      }
      if (facets.type.size) {
        const fb = mbFormatBucket(ev);
        const name = (ev.name + " " + ev.format).toLowerCase();
        const hits = new Set([fb]);
        if (name.includes("singles")) hits.add("singles");
        if (name.includes("doubles") || name.includes("mixed")) hits.add("doubles");
        if (name.includes("junior") || name.includes("kid")) hits.add("junior");
        if (name.includes("social") || name.includes("mixer")) hits.add("social");
        if (name.includes("open")) hits.add("openplay");
        let ok = false;
        facets.type.forEach((k) => {if (hits.has(k)) ok = true;});
        if (!ok) return false;
      }
      if (instructorQuery) {
        if (!(ev.coach || "").toLowerCase().includes(instructorQuery.toLowerCase())) return false;
      }
      if (instructorOnly) {
        const f = mbFormatBucket(ev);
        if (f === "dropin" || f === "ladder") return false;
      }
      if (eligibleOnly) {
        if (ev.spotsLeft === 0) return false;
      }
      return true;
    });
    const priceVal = (e) => parseFloat((e.priceLabel || "").replace(/[^0-9.]/g, "") || "0");
    const dateVal = (e) => e.when === "today" ? 0 : e.when === "week" ? 1 : 2;
    if (sort === "soonest") list = [...list].sort((a, b) => dateVal(a) - dateVal(b));else
    if (sort === "price-asc") list = [...list].sort((a, b) => priceVal(a) - priceVal(b));else
    if (sort === "price-desc") list = [...list].sort((a, b) => priceVal(b) - priceVal(a));else
    if (sort === "spots") list = [...list].sort((a, b) => (b.spotsLeft || 0) - (a.spotsLeft || 0));else
    if (sort === "popular") list = [...list].sort((a, b) => (b.going || 0) - (a.going || 0));
    return list;
  }, [pool, query, facets, sort, instructorQuery, instructorOnly, eligibleOnly]);

  const totalActive = (query ? 1 : 0) + facets.when.size + facets.format.size + facets.skill.size +
  facets.type.size + facets.gender.size + facets.season.size + (
  duprRange[0] > 2.0 || duprRange[1] < 8.0 ? 1 : 0) + (
  eligibleOnly ? 1 : 0) + (instructorOnly ? 1 : 0) + (instructorQuery ? 1 : 0) + (
  sort !== "recommended" ? 1 : 0);
  const today = filtered.filter((e) => e.when === "today");
  const week = filtered.filter((e) => e.when === "week");
  const next = filtered.filter((e) => e.when === "next");
  const isFiltering = totalActive > 0;

  if (selectedEv) {
    const inner =
    <div style={{ flex: 1, overflowY: "auto" }}>
        <EventDetails ev={window.DETAIL_EVENT} type={selectedEv.type || "single"} viewport="mobile" onBack={() => setSelectedEv(null)} onRegister={() => window.__openRegisterFlow && window.__openRegisterFlow(selectedEv.type || "single")} />
      </div>;

    return bare ? inner : <MobileFrame>{inner}</MobileFrame>;
  }

  const body =
  <React.Fragment>
      {/* Minimal sticky header — single X close button anchored top-right.
         This screen is a dedicated flow, not part of the main bottom-nav
         surface, so it gets a flow-style exit affordance instead of the
         5-tab bar. Title centered so the user reads context at a glance. */}
      {onBack &&
    <div style={{
      position: "sticky", top: 0, zIndex: 30,
      background: "#fff",
      height: 48, padding: "0 12px",
      display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
      flexShrink: 0
    }}>
          <div style={{ width: 36 }} aria-hidden />
          <div style={{ fontFamily: "Axiforma", fontWeight: 800, letterSpacing: 0.4, textTransform: "uppercase", color: "#0F1214", fontSize: "15px" }}>Find an event</div>
          <button onClick={onBack} aria-label="Close" style={{
        width: 36, height: 36, borderRadius: 999, border: 0,
        background: "#F4F5F6", color: "#0F1214",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer"
      }}>
            <Icon name="X" size={16} strokeWidth={2.2} color="#0F1214" />
          </button>
        </div>
    }
      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto" }}>
        {!isFiltering && <MobileHero ev={HERO_EVENT} />}

        {isFiltering &&
      <div style={{ padding: "8px 24px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontSize: 11, color: "#4B5052", fontWeight: 600, letterSpacing: 1.2, textTransform: "uppercase" }}>
              {filtered.length} {filtered.length === 1 ? "match" : "matches"}
            </div>
            <button onClick={clearAll} style={{ border: 0, background: "transparent", fontFamily: "inherit", fontSize: 12, fontWeight: 600, color: "#0F1214", textDecoration: "underline", cursor: "pointer", padding: 0 }}>Reset</button>
          </div>
      }

        <div style={{ padding: "0 24px 96px" }}>
          {filtered.length === 0 ?
        <div style={{ padding: "60px 0", textAlign: "center" }}>
              <div style={{ fontFamily: "Axiforma", fontWeight: 800, fontSize: 22, color: "#0F1214", letterSpacing: -0.5 }}>No matches.</div>
              <div style={{ marginTop: 6, fontSize: 12, color: "#4B5052" }}>Try a different filter or search term.</div>
            </div> :

        <React.Fragment>
              {today.length > 0 &&
          <React.Fragment>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 28, paddingBottom: 12 }}>
                    <span style={{ fontFamily: "Axiforma", fontWeight: 800, fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase", color: "#0F1214", whiteSpace: "nowrap" }}>{isFiltering ? "Today" : "Also today"}</span>
                    <span style={{ flex: 1, height: 1, background: "#E9EBEC" }} aria-hidden="true" />
                    <span style={{ fontSize: 11, color: "#858F8F", fontWeight: 500, whiteSpace: "nowrap" }}>{today.length}</span>
                  </div>
                  {today.map((e) => <MobileEventRow key={e.id} ev={e} onClick={() => setSelectedEv(e)} />)}
                </React.Fragment>
          }
              {week.length > 0 &&
          <React.Fragment>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 28, paddingBottom: 12 }}>
                    <span style={{ fontFamily: "Axiforma", fontWeight: 800, fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase", color: "#0F1214", whiteSpace: "nowrap" }}>This week</span>
                    <span style={{ flex: 1, height: 1, background: "#E9EBEC" }} aria-hidden="true" />
                    <span style={{ fontSize: 11, color: "#858F8F", fontWeight: 500, whiteSpace: "nowrap" }}>{week.length}</span>
                  </div>
                  {week.map((e) => <MobileEventRow key={e.id} ev={e} onClick={() => setSelectedEv(e)} />)}
                </React.Fragment>
          }
              {next.length > 0 &&
          <React.Fragment>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 28, paddingBottom: 12 }}>
                    <span style={{ fontFamily: "Axiforma", fontWeight: 800, fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase", color: "#0F1214", whiteSpace: "nowrap" }}>Next week</span>
                    <span style={{ flex: 1, height: 1, background: "#E9EBEC" }} aria-hidden="true" />
                    <span style={{ fontSize: 11, color: "#858F8F", fontWeight: 500, whiteSpace: "nowrap" }}>{next.length}</span>
                  </div>
                  {next.map((e) => <MobileEventRow key={e.id} ev={e} onClick={() => setSelectedEv(e)} />)}
                </React.Fragment>
          }
              {!isFiltering && window.RecurringCarousel &&
          <div style={{ padding: "0 24px" }}>
                  <window.RecurringCarousel
              items={window.RECURRING_EVENTS || []}
              viewport="mobile"
              first={false}
              onSelect={(ev) => setSelectedEv({ ...ev, type: ev.type || "series" })} />
            
                </div>
          }
              <div ref={mobSentinelRef} aria-hidden="true" style={{ height: 1 }} />
              {showMonth && (window.NEXT_MONTH_EVENTS || []).length > 0 &&
          <React.Fragment>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 28, paddingBottom: 12 }}>
                    <span style={{ fontFamily: "Axiforma", fontWeight: 800, fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase", color: "#0F1214", whiteSpace: "nowrap" }}>Next month</span>
                    <span style={{ flex: 1, height: 1, background: "#E9EBEC" }} aria-hidden="true" />
                    <span style={{ fontSize: 11, color: "#858F8F", fontWeight: 500, whiteSpace: "nowrap" }}>{window.NEXT_MONTH_EVENTS.length}</span>
                  </div>
                  {window.NEXT_MONTH_EVENTS.map((e) => <MobileEventRow key={e.id} ev={e} onClick={() => setSelectedEv(e)} />)}
                </React.Fragment>
          }
              {!showMonth && !isFiltering &&
          <div style={{ padding: "24px 24px 24px", display: "flex", justifyContent: "center" }}>
                  <button onClick={() => setShowMonth(true)} style={{
              height: 36, padding: "0 18px", borderRadius: 8,
              border: "1px solid #DEE1E5", background: "#fff", color: "#0F1214",
              fontFamily: "inherit", fontSize: 12, fontWeight: 600, cursor: "pointer",
              display: "inline-flex", alignItems: "center", gap: 8
            }}>
                    Load next month
                    <Icon name="ArrowDown" size={12} strokeWidth={2.5} />
                  </button>
                </div>
          }
            </React.Fragment>
        }
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 24, left: 0, right: 0, display: "flex", justifyContent: "center", pointerEvents: "none", zIndex: 2 }}>
        <button onClick={() => setFilterOpen(true)} style={{
        pointerEvents: "auto",
        display: "inline-flex", alignItems: "center", gap: 8, height: 48, padding: "0 22px",
        background: "#0F1214", color: "#fff", border: 0, borderRadius: 8,
        fontFamily: "inherit", fontWeight: 500, fontSize: 14, cursor: "pointer",
        boxShadow: "0 8px 24px rgba(0,0,0,.20)"
      }}>
          <Icon name="Search" size={16} color="#fff" />
          Search & filter
          {totalActive > 0 &&
        <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 20, height: 20, padding: "0 6px", borderRadius: 8, background: "#fff", color: "#0F1214", fontSize: 11, fontWeight: 700, fontFamily: "Axiforma", marginLeft: 2 }}>{totalActive}</span>
        }
        </button>
      </div>
      <MobileFilterSheet
      open={filterOpen}
      onClose={() => setFilterOpen(false)}
      query={query} setQuery={setQuery}
      facets={facets} setFacets={setFacets} toggleFacet={toggleFacet} clearAll={clearAll}
      resultCount={filtered.length}
      sort={sort} setSort={setSort}
      duprRange={duprRange} setDuprRange={setDuprRange}
      eligibleOnly={eligibleOnly} setEligibleOnly={setEligibleOnly}
      instructorOnly={instructorOnly} setInstructorOnly={setInstructorOnly}
      instructorQuery={instructorQuery} setInstructorQuery={setInstructorQuery}
      clubRating={clubRating} setClubRating={setClubRating}
      customRating={customRating} setCustomRating={setCustomRating} />
    
    </React.Fragment>;

  // Book-a-court is a dedicated discovery flow — no persistent bottom tab
  // bar here. The floating "Search & filter" button (in body) drives
  // narrowing; the header X dismisses back to the dashboard.
  const wrapped =
  <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>
      {body}
    </div>;

  return bare ? wrapped : <MobileFrame>{wrapped}</MobileFrame>;
}

window.BrowseMobile = BrowseMobile;