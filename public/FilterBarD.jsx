// FilterBarD.jsx — Option D: horizontal pill bar with inline expansion.
// Four pills (What / When / Who / More) + Sort. Click expands a panel below.

const { useState: useStateFD, useRef: useRefFD, useEffect: useEffectFD } = React;

const TYPE_ITEMS = [
  { key: "singles", label: "Singles", count: 3 },
  { key: "doubles", label: "Doubles", count: 6 },
  { key: "clinic", label: "Clinic", count: 4 },
  { key: "dropin", label: "Drop-in", count: 3 },
  { key: "rr", label: "Round Robin", count: 4 },
  { key: "tournament", label: "Tournament", count: 1 },
  { key: "junior", label: "Junior", count: 2 },
  { key: "social", label: "Social", count: 3 },
  { key: "openplay", label: "Open Play", count: 5 },
];
const WHEN_ITEMS = [
  { key: "today", label: "Today", count: 4 },
  { key: "tomorrow", label: "Tomorrow", count: 5 },
  { key: "weekend", label: "This weekend", count: 6 },
  { key: "morning", label: "Mornings", count: 7 },
  { key: "afternoon", label: "Afternoons", count: 5 },
  { key: "evening", label: "Evenings", count: 3 },
];
const SKILL_ITEMS = [
  { key: "beg", label: "Beginner", count: 4 },
  { key: "int", label: "Intermediate", count: 6 },
  { key: "adv", label: "Advanced", count: 5 },
  { key: "dupr", label: "DUPR rated", count: 6 },
];
const SEASON_ITEMS = [
  { key: "spring", label: "Spring" },
  { key: "summer", label: "Summer" },
  { key: "fall", label: "Fall" },
  { key: "winter", label: "Winter" },
];
const SORT_ITEMS = [
  { key: "recommended", label: "Recommended" },
  { key: "soonest", label: "Soonest first" },
  { key: "popular", label: "Most popular" },
  { key: "price-asc", label: "Price: low to high" },
  { key: "price-desc", label: "Price: high to low" },
  { key: "spots", label: "Spots available" },
];

function FDChip({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      height: 32, padding: "0 14px", borderRadius: 8,
      border: active ? "1px solid #0F1214" : "1px solid #DEE1E5",
      background: active ? "#0F1214" : "#fff",
      color: active ? "#fff" : "#0F1214",
      fontFamily: "inherit", fontSize: 12, fontWeight: 600, cursor: "pointer",
      whiteSpace: "nowrap", transition: "all 120ms",
    }}>{label}</button>
  );
}

function FilterPill({ label, summary, count, open, hasActive, onClick }) {
  const dark = open || hasActive;
  return (
    <button onClick={onClick} style={{
      display: "inline-flex", alignItems: "center", gap: 10,
      height: 40, padding: "0 14px",
      borderRadius: 8,
      border: dark ? "1px solid #0F1214" : "1px solid #DEE1E5",
      background: dark ? "#0F1214" : "#fff",
      color: dark ? "#fff" : "#0F1214",
      fontFamily: "inherit", fontSize: 13, fontWeight: 600, cursor: "pointer",
      transition: "all 140ms",
      maxWidth: 320, minWidth: 0,
    }}>
      <span style={{ fontFamily: "Axiforma, Inter, system-ui, sans-serif", fontWeight: 800, fontSize: 10, letterSpacing: 1.2, textTransform: "uppercase", opacity: dark ? 0.7 : 0.55 }}>{label}</span>
      <span style={{
        fontSize: 13, fontWeight: 600,
        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        maxWidth: 200,
      }}>{summary}</span>
      {count > 0 && !open && (
        <span style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          minWidth: 18, height: 18, padding: "0 6px", borderRadius: 8,
          background: dark ? "#fff" : "#0F1214", color: dark ? "#0F1214" : "#fff",
          fontSize: 10, fontWeight: 700, fontFamily: "Axiforma, Inter, system-ui, sans-serif",
        }}>{count}</span>
      )}
      <span style={{ display: "inline-flex", marginLeft: -4, transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 180ms" }}>
        <Icon name="ChevronDown" size={12} color={dark ? "#fff" : "#0F1214"} strokeWidth={2.4} />
      </span>
    </button>
  );
}

function ChipGrid({ items, set, toggle }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {items.map(it => {
        const on = set.has(it.key);
        return (
          <button key={it.key} onClick={() => toggle(it.key)} style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            height: 32, padding: "0 14px", borderRadius: 8,
            border: on ? "1px solid #0F1214" : "1px solid #DEE1E5",
            background: on ? "#0F1214" : "#fff",
            color: on ? "#fff" : "#0F1214",
            fontFamily: "inherit", fontSize: 12, fontWeight: 600, cursor: "pointer",
            whiteSpace: "nowrap", transition: "all 120ms",
          }}>
            {it.label}
            {it.count !== undefined && (
              <span style={{ fontSize: 10, fontWeight: 600, opacity: on ? 0.7 : 0.5, marginLeft: 2 }}>{it.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function PanelHeader({ title, onClear, canClear }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12 }}>
      <h3 style={{ fontFamily: "Axiforma, Inter, system-ui, sans-serif", fontWeight: 800, fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase", color: "#0F1214", margin: 0 }}>{title}</h3>
      {canClear && (
        <button onClick={onClear} style={{ border: 0, background: "transparent", color: "#4B5052", fontSize: 11, fontWeight: 600, cursor: "pointer", textDecoration: "underline" }}>clear</button>
      )}
    </div>
  );
}

function summarize(items, set) {
  if (set.size === 0) return "Any";
  const labels = items.filter(i => set.has(i.key)).map(i => i.label);
  if (labels.length === 1) return labels[0];
  if (labels.length === 2) return labels.join(", ");
  return `${labels[0]}, ${labels[1]} +${labels.length - 2}`;
}

function FilterBarD({
  facets, toggleFacet, clearGroup,
  duprRange, setDuprRange,
  instructorQuery, setInstructorQuery,
  instructorOnly, setInstructorOnly,
  eligibleOnly, setEligibleOnly,
  clubRating, setClubRating,
  customRating, setCustomRating,
  sort, setSort,
  resultCount, resetAll,
  layout = "bar",
}) {
  const isSidebar = layout === "sidebar";
  const [open, setOpen] = useStateFD(isSidebar ? "what" : null); // "what" | "when" | "who" | "more" | "sort" | null
  const barRef = useRefFD(null);

  useEffectFD(() => {
    const onDoc = (e) => {
      if (!barRef.current) return;
      if (!barRef.current.contains(e.target)) setOpen(null);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const whatSum = summarize(TYPE_ITEMS, facets.type);
  const whenSum = summarize(WHEN_ITEMS, facets.when);
  const skillSum = summarize(SKILL_ITEMS, facets.skill);
  const duprActive = duprRange[0] > 2.0 || duprRange[1] < 5.0;
  const gender = Array.from(facets.gender)[0] || "all";
  const setGender = (g) => { clearGroup("gender"); if (g !== "all") toggleFacet("gender", g); };

  const whoCount = (gender !== "all" ? 1 : 0) + (duprActive ? 1 : 0) + (instructorQuery ? 1 : 0) + (instructorOnly ? 1 : 0);
  const whoSum = whoCount === 0 ? "Anyone" :
    [gender !== "all" ? (gender === "w" ? "Women's" : "Men's") : null,
     duprActive ? `DUPR ${duprRange[0].toFixed(1)}–${duprRange[1].toFixed(1)}` : null,
     instructorOnly ? "Instructor-led" : null,
     instructorQuery ? `Coach: ${instructorQuery}` : null,
    ].filter(Boolean).slice(0, 2).join(", ") + (whoCount > 2 ? ` +${whoCount - 2}` : "");

  const clubActive = clubRating[0] > 1 || clubRating[1] < 5;
  const moreCount = facets.season.size + (clubActive ? 1 : 0) + (customRating ? 1 : 0) + (eligibleOnly ? 1 : 0);
  const moreSum = moreCount === 0 ? "None" : `${moreCount} active`;

  const sortLabel = (SORT_ITEMS.find(s => s.key === sort) || SORT_ITEMS[0]).label;

  const totalActive = facets.type.size + facets.when.size + facets.skill.size + whoCount + moreCount;

  // Sidebar layout: stacked accordion of the same 4 sections
  if (isSidebar) {
    const rows = [
      { id: "what", label: "What", summary: whatSum, count: facets.type.size },
      { id: "when", label: "When", summary: whenSum, count: facets.when.size },
      { id: "who",  label: "Who",  summary: whoSum,  count: whoCount },
      { id: "more", label: "More", summary: moreSum, count: moreCount },
    ];
    const renderPanel = (id) => {
      if (id === "what") return <ChipGrid items={TYPE_ITEMS} set={facets.type} toggle={(k) => toggleFacet("type", k)} />;
      if (id === "when") return <ChipGrid items={WHEN_ITEMS} set={facets.when} toggle={(k) => toggleFacet("when", k)} />;
      if (id === "who") return (
        <div>
          <PanelHeader title="Skill" onClear={() => clearGroup("skill")} canClear={facets.skill.size > 0} />
          <ChipGrid items={SKILL_ITEMS} set={facets.skill} toggle={(k) => toggleFacet("skill", k)} />
          <div style={{ marginTop: 18 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6, fontSize: 12, color: "#4B5052", fontWeight: 500 }}>
              <span>Player DUPR range</span>
              <span style={{ fontVariantNumeric: "tabular-nums", color: "#0F1214", fontWeight: 700 }}>{duprRange[0].toFixed(1)}–{duprRange[1].toFixed(1)}</span>
            </div>
            <input type="range" min={2.0} max={5.0} step={0.1} value={duprRange[1]} onChange={(e) => setDuprRange([duprRange[0], Number(e.target.value)])} style={{ width: "100%" }} />
          </div>
          <div style={{ marginTop: 18 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontSize: 12, color: "#4B5052", fontWeight: 500 }}>Gender</span>
              <div style={{ display: "inline-flex", background: "#F4F5F6", borderRadius: 8, padding: 2 }}>
                {[{k:"all",l:"All"},{k:"w",l:"W"},{k:"m",l:"M"}].map(o => {
                  const on = o.k === gender;
                  return <button key={o.k} onClick={() => setGender(o.k)} style={{ height: 26, padding: "0 10px", borderRadius: 8, border: 0, background: on ? "#0F1214" : "transparent", color: on ? "#fff" : "#0F1214", fontFamily: "inherit", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>{o.l}</button>;
                })}
              </div>
            </div>
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 12, color: "#4B5052", fontWeight: 500, marginBottom: 6 }}>Instructor</div>
              <div style={{ display: "flex", alignItems: "center", height: 34, padding: "0 10px", borderRadius: 8, border: "1px solid #DEE1E5" }}>
                <Icon name="Search" size={13} color="#858F8F" />
                <input value={instructorQuery} onChange={(e) => setInstructorQuery(e.target.value)} placeholder="Filter by name"
                  style={{ flex: 1, border: 0, outline: 0, marginLeft: 8, fontFamily: "inherit", fontSize: 12, color: "#0F1214", background: "transparent" }} />
              </div>
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#0F1214", fontWeight: 500, cursor: "pointer" }}>
              <input type="checkbox" checked={instructorOnly} onChange={(e) => setInstructorOnly(e.target.checked)} />
              Instructor-led only
            </label>
          </div>
        </div>
      );
      if (id === "more") return (
        <div>
          <PanelHeader title="Season" onClear={() => clearGroup("season")} canClear={facets.season.size > 0} />
          <ChipGrid items={SEASON_ITEMS} set={facets.season} toggle={(k) => toggleFacet("season", k)} />
          <div style={{ marginTop: 14 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#0F1214", fontWeight: 500, cursor: "pointer" }}>
              <input type="checkbox" checked={eligibleOnly} onChange={(e) => setEligibleOnly(e.target.checked)} />
              Only events I can join
            </label>
          </div>
          <div style={{ marginTop: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6, fontSize: 12, color: "#4B5052", fontWeight: 500 }}>
              <span>Club rating</span>
              <span style={{ fontVariantNumeric: "tabular-nums", color: "#0F1214", fontWeight: 700 }}>{clubRating[0]}★–{clubRating[1]}★</span>
            </div>
            <input type="range" min={1} max={5} step={1} value={clubRating[1]} onChange={(e) => setClubRating([clubRating[0], Number(e.target.value)])} style={{ width: "100%" }} />
          </div>
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 12, color: "#4B5052", fontWeight: 500, marginBottom: 6 }}>Club's custom rating</div>
            <select value={customRating} onChange={(e) => setCustomRating(e.target.value)} style={{ width: "100%", height: 34, padding: "0 10px", borderRadius: 8, border: "1px solid #DEE1E5", background: "#fff", fontFamily: "inherit", fontSize: 12, color: customRating ? "#0F1214" : "#858F8F", cursor: "pointer" }}>
              <option value="">Any custom rating</option>
              <option value="red">Red ball (kids)</option>
              <option value="yellow">Yellow ball</option>
              <option value="blue">Blue ball</option>
              <option value="bronze">Bronze tier</option>
              <option value="silver">Silver tier</option>
              <option value="gold">Gold tier</option>
            </select>
          </div>
        </div>
      );
      return null;
    };
    return (
      <div>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", paddingBottom: 14, borderBottom: "1px solid #0F1214", marginBottom: 8 }}>
          <h2 style={{ fontFamily: "Axiforma, Inter, system-ui, sans-serif", fontWeight: 800, fontSize: 14, letterSpacing: 1.2, textTransform: "uppercase", color: "#0F1214", margin: 0 }}>Refine</h2>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ fontSize: 13, color: "#4B5052", fontWeight: 500 }}>{resultCount}</div>
            {totalActive > 0 && (
              <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 18, height: 18, padding: "0 6px", borderRadius: 8, background: "#0F1214", color: "#fff", fontSize: 10, fontWeight: 700, fontFamily: "Axiforma, Inter, system-ui, sans-serif" }}>{totalActive}</span>
            )}
          </div>
        </div>
        {rows.map(r => {
          const isOpen = open === r.id;
          return (
            <div key={r.id} style={{ borderBottom: "1px solid #E9EBEC" }}>
              <button onClick={() => setOpen(isOpen ? null : r.id)} style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                background: "transparent", border: 0, padding: "14px 0", cursor: "pointer", fontFamily: "inherit",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                  <span style={{ fontFamily: "Axiforma, Inter, system-ui, sans-serif", fontWeight: 800, fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase", color: "#0F1214" }}>{r.label}</span>
                  {r.count > 0 && (
                    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 18, height: 18, padding: "0 6px", borderRadius: 8, background: "#0F1214", color: "#fff", fontSize: 10, fontWeight: 700, fontFamily: "Axiforma, Inter, system-ui, sans-serif" }}>{r.count}</span>
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                  <span style={{ fontSize: 12, color: r.count > 0 ? "#0F1214" : "#858F8F", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 130, textAlign: "right" }}>{r.summary}</span>
                  <span style={{ display: "inline-flex", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 180ms" }}>
                    <Icon name="ChevronDown" size={13} strokeWidth={2.4} />
                  </span>
                </div>
              </button>
              <div style={{ overflow: "hidden", maxHeight: isOpen ? 800 : 0, opacity: isOpen ? 1 : 0, transition: "max-height 320ms cubic-bezier(.2,.8,.2,1), opacity 200ms" }}>
                <div style={{ padding: "4px 0 18px" }}>{renderPanel(r.id)}</div>
              </div>
            </div>
          );
        })}
        <div style={{ paddingTop: 16, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <div style={{ fontFamily: "Axiforma, Inter, system-ui, sans-serif", fontWeight: 800, fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase", color: "#858F8F" }}>Sort</div>
          <select value={sort} onChange={(e) => setSort(e.target.value)} style={{ height: 32, padding: "0 10px", borderRadius: 8, border: "1px solid #DEE1E5", background: "#fff", fontFamily: "inherit", fontSize: 12, fontWeight: 600, color: "#0F1214", cursor: "pointer" }}>
            {SORT_ITEMS.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
          </select>
        </div>
      </div>
    );
  }

  return (
    <div ref={barRef} style={{ position: "relative", zIndex: 5 }}>
      {/* Pill row */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <FilterPill label="What"
          summary={whatSum}
          count={facets.type.size}
          open={open === "what"}
          hasActive={facets.type.size > 0}
          onClick={() => setOpen(open === "what" ? null : "what")} />
        <FilterPill label="When"
          summary={whenSum}
          count={facets.when.size}
          open={open === "when"}
          hasActive={facets.when.size > 0}
          onClick={() => setOpen(open === "when" ? null : "when")} />
        <FilterPill label="Who"
          summary={whoSum}
          count={whoCount}
          open={open === "who"}
          hasActive={whoCount > 0}
          onClick={() => setOpen(open === "who" ? null : "who")} />
        <FilterPill label="More"
          summary={moreSum}
          count={moreCount}
          open={open === "more"}
          hasActive={moreCount > 0}
          onClick={() => setOpen(open === "more" ? null : "more")} />
        <div style={{ flex: 1 }} />
        {totalActive > 0 && (
          <button onClick={resetAll} style={{ height: 32, padding: 0, border: 0, background: "transparent", color: "#0F1214", fontFamily: "inherit", fontSize: 13, fontWeight: 600, cursor: "pointer", textDecoration: "underline" }}>
            Reset
          </button>
        )}
        <FilterPill label="Sort"
          summary={sortLabel}
          count={0}
          open={open === "sort"}
          hasActive={sort !== "recommended"}
          onClick={() => setOpen(open === "sort" ? null : "sort")} />
      </div>

      {/* Inline expansion panel */}
      <div style={{
        overflow: "hidden",
        maxHeight: open ? 720 : 0,
        opacity: open ? 1 : 0,
        transition: "max-height 320ms cubic-bezier(.2,.8,.2,1), opacity 200ms ease, margin-top 280ms cubic-bezier(.2,.8,.2,1)",
        marginTop: open ? 16 : 0,
      }}>
        <div style={{
          padding: 20,
          background: "#fff",
          border: "1px solid #E9EBEC",
          borderRadius: 8,
          boxShadow: "0 8px 24px rgba(15,18,20,.06), 0 1px 2px rgba(15,18,20,.04)",
        }}>
          {open === "what" && (
            <div>
              <PanelHeader title="What are you looking for" onClear={() => clearGroup("type")} canClear={facets.type.size > 0} />
              <ChipGrid items={TYPE_ITEMS} set={facets.type} toggle={(k) => toggleFacet("type", k)} />
            </div>
          )}
          {open === "when" && (
            <div>
              <PanelHeader title="When are you looking for it" onClear={() => clearGroup("when")} canClear={facets.when.size > 0} />
              <ChipGrid items={WHEN_ITEMS} set={facets.when} toggle={(k) => toggleFacet("when", k)} />
            </div>
          )}
          {open === "who" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
              <div>
                <PanelHeader title="Skill" onClear={() => clearGroup("skill")} canClear={facets.skill.size > 0} />
                <ChipGrid items={SKILL_ITEMS} set={facets.skill} toggle={(k) => toggleFacet("skill", k)} />
                <div style={{ marginTop: 18 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6, fontSize: 12, color: "#4B5052", fontWeight: 500 }}>
                    <span>Player DUPR range</span>
                    <span style={{ fontVariantNumeric: "tabular-nums", color: "#0F1214", fontWeight: 700 }}>{duprRange[0].toFixed(1)}–{duprRange[1].toFixed(1)}</span>
                  </div>
                  <input type="range" min={2.0} max={5.0} step={0.1} value={duprRange[1]} onChange={(e) => setDuprRange([duprRange[0], Number(e.target.value)])} style={{ width: "100%" }} />
                </div>
              </div>
              <div>
                <PanelHeader title="Group & instructor" />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <span style={{ fontSize: 12, color: "#4B5052", fontWeight: 500 }}>Gender</span>
                  <div style={{ display: "inline-flex", background: "#F4F5F6", borderRadius: 8, padding: 2 }}>
                    {[{k:"all",l:"All"},{k:"w",l:"Women's"},{k:"m",l:"Men's"}].map(o => {
                      const on = o.k === gender;
                      return (
                        <button key={o.k} onClick={() => setGender(o.k)}
                          style={{ height: 28, padding: "0 12px", borderRadius: 8, border: 0, background: on ? "#0F1214" : "transparent", color: on ? "#fff" : "#0F1214", fontFamily: "inherit", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
                          {o.l}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 12, color: "#4B5052", fontWeight: 500, marginBottom: 6 }}>Instructor</div>
                  <div style={{ display: "flex", alignItems: "center", height: 36, padding: "0 12px", borderRadius: 8, border: "1px solid #DEE1E5" }}>
                    <Icon name="Search" size={13} color="#858F8F" />
                    <input value={instructorQuery} onChange={(e) => setInstructorQuery(e.target.value)} placeholder="Filter by name"
                      style={{ flex: 1, border: 0, outline: 0, marginLeft: 8, fontFamily: "inherit", fontSize: 12, color: "#0F1214", background: "transparent" }} />
                  </div>
                </div>
                <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#0F1214", fontWeight: 500, cursor: "pointer" }}>
                  <input type="checkbox" checked={instructorOnly} onChange={(e) => setInstructorOnly(e.target.checked)} />
                  Instructor-led only
                </label>
              </div>
            </div>
          )}
          {open === "more" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
              <div>
                <PanelHeader title="Season" onClear={() => clearGroup("season")} canClear={facets.season.size > 0} />
                <ChipGrid items={SEASON_ITEMS} set={facets.season} toggle={(k) => toggleFacet("season", k)} />
                <div style={{ marginTop: 18 }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#0F1214", fontWeight: 500, cursor: "pointer" }}>
                    <input type="checkbox" checked={eligibleOnly} onChange={(e) => setEligibleOnly(e.target.checked)} />
                    Only events I can join
                  </label>
                </div>
              </div>
              <div>
                <PanelHeader title="Club rating" />
                <div style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6, fontSize: 12, color: "#4B5052", fontWeight: 500 }}>
                    <span>Star rating</span>
                    <span style={{ fontVariantNumeric: "tabular-nums", color: "#0F1214", fontWeight: 700 }}>{clubRating[0]}★–{clubRating[1]}★</span>
                  </div>
                  <input type="range" min={1} max={5} step={1} value={clubRating[1]} onChange={(e) => setClubRating([clubRating[0], Number(e.target.value)])} style={{ width: "100%" }} />
                </div>
                <div>
                  <div style={{ fontSize: 12, color: "#4B5052", fontWeight: 500, marginBottom: 6 }}>Club's custom rating</div>
                  <select value={customRating} onChange={(e) => setCustomRating(e.target.value)} style={{ width: "100%", height: 36, padding: "0 12px", borderRadius: 8, border: "1px solid #DEE1E5", background: "#fff", fontFamily: "inherit", fontSize: 12, color: customRating ? "#0F1214" : "#858F8F", cursor: "pointer" }}>
                    <option value="">Any custom rating</option>
                    <option value="red">Red ball (kids)</option>
                    <option value="yellow">Yellow ball</option>
                    <option value="blue">Blue ball</option>
                    <option value="bronze">Bronze tier</option>
                    <option value="silver">Silver tier</option>
                    <option value="gold">Gold tier</option>
                  </select>
                </div>
              </div>
            </div>
          )}
          {open === "sort" && (
            <div>
              <PanelHeader title="Sort by" />
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {SORT_ITEMS.map(s => {
                  const on = sort === s.key;
                  return (
                    <button key={s.key} onClick={() => { setSort(s.key); setOpen(null); }} style={{
                      height: 32, padding: "0 14px", borderRadius: 8,
                      border: on ? "1px solid #0F1214" : "1px solid #DEE1E5",
                      background: on ? "#0F1214" : "#fff", color: on ? "#fff" : "#0F1214",
                      fontFamily: "inherit", fontSize: 12, fontWeight: 600, cursor: "pointer",
                    }}>{s.label}</button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

window.FilterBarD = FilterBarD;
