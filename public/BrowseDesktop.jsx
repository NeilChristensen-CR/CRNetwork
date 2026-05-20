// BrowseDesktop.jsx — Single unified screen. Two segmented controls filter the list in place. No layout morph.
const { useState: useStateBD, useMemo: useMemoBD, useEffect: useEffectBD, useRef: useRefBD } = React;

function TopBar() {
  return (
    <div style={{ background: "#0F1214", color: "#fff", position: "sticky", top: 0, zIndex: 60, boxShadow: "0 1px 0 rgba(0,0,0,.04)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px", height: 64, display: "flex", alignItems: "center", gap: 32 }}>
        <div style={{ fontFamily: "Axiforma, Inter, system-ui, sans-serif", fontWeight: 800, fontSize: 18, letterSpacing: -0.3 }}>Court</div>
        <nav style={{ display: "flex", gap: 24 }}>
          {["Reserve", "Events", "Leagues", "Account"].map((l, i) =>
          <a key={l} href="#" style={{ color: i === 1 ? "#fff" : "#BBBFC1", fontSize: 14, fontWeight: 500, textDecoration: "none" }}>{l}</a>
          )}
        </nav>
        <div style={{ flex: 1 }} />
        <div style={{ fontSize: 14, color: "#BBBFC1" }}>Old Coast Pickleball</div>
        <div style={{ width: 32, height: 32, borderRadius: 999, background: "#fff", color: "#0F1214", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>JB</div>
      </div>
    </div>);

}

function Segmented({ options, value, onChange }) {
  return (
    <div style={{
      display: "inline-flex", padding: 4, background: "#F4F5F6",
      borderRadius: 8, border: "1px solid #E9EBEC"
    }}>
      {options.map((o) => {
        const on = value === o.id;
        return (
          <button key={o.id} onClick={() => onChange(o.id)} style={{
            height: 36, padding: "0 18px", borderRadius: 8,
            background: on ? "#0F1214" : "transparent",
            color: on ? "#fff" : "#0F1214",
            border: 0,
            fontFamily: "inherit", fontWeight: 500, fontSize: 13, cursor: "pointer",
            transition: "background 160ms, color 160ms"
          }}>{o.label}</button>);

      })}
    </div>);

}

function StatStrip() {
  const stats = [
  { k: "13", v: "events this week" },
  { k: "4", v: "tonight" },
  { k: "186", v: "members going" },
  { k: "2", v: "filling fast" }];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginTop: 40 }}>
      {stats.map((s, i) =>
      <div key={i} style={{
        padding: "24px 28px",
        background: "#F4F5F6",
        border: "1px solid #E9EBEC",
        borderRadius: 8
      }}>
          <div style={{ fontFamily: "Axiforma, Inter, system-ui, sans-serif", fontWeight: 800, fontSize: 32, color: "#0F1214", letterSpacing: -0.7, lineHeight: 1 }}>{s.k}</div>
          <div style={{ fontSize: 12, color: "#4B5052", fontWeight: 500, marginTop: 8 }}>{s.v}</div>
        </div>
      )}
    </div>);

}

const WHEN_OPTIONS = [
{ id: "all", label: "All" },
{ id: "today", label: "Today" },
{ id: "weekend", label: "Weekend" },
{ id: "weekday", label: "Weekday" }];

const SKILL_OPTIONS = [
{ id: "all", label: "All levels" },
{ id: "beginner", label: "Beginner" },
{ id: "intermediate", label: "Intermediate" },
{ id: "advanced", label: "Advanced" }];


function eventSkillBucket(ev) {
  const s = (ev.skill || "").toLowerCase();
  if (s.includes("1.") || s.includes("2.0") || s.includes("2.5") || s.includes("beginner") || s.includes("all")) return "beginner";
  if (s.includes("3.0") || s.includes("3.5") || s.includes("intermediate")) return "intermediate";
  if (s.includes("4.") || s.includes("advanced") || s.includes("3.5+") || s.includes("dupr")) return "advanced";
  return "all";
}
function eventDayBucket(ev) {
  if (ev.when === "today") return ["today", "weekday"];
  if (ev.dateShort && (ev.dateShort.includes("Sat") || ev.dateShort.includes("Sun"))) return ["weekend"];
  return ["weekday"];
}

function BrowseDesktop({ theme, app, setApp, onOpenQR, onFindClubs, onBack } = {}) {
  const [selectedEv, setSelectedEv] = useStateBD(null);
  const [when, setWhen] = useStateBD("all");
  const [skill, setSkill] = useStateBD("all");
  const [query, setQuery] = useStateBD("");
  const [facets, setFacets] = useStateBD({
    when: new Set(),
    format: new Set(),
    skill: new Set(),
    price: new Set(),
    type: new Set(),
    gender: new Set(),
    season: new Set()
  });
  const [openGroups, setOpenGroups] = useStateBD({ type: false, when: false, format: false, skill: false, who: false, more: false });
  const [priceMax, setPriceMax] = useStateBD(60);
  const [duprRange, setDuprRange] = useStateBD([2.0, 5.0]);
  const [instructorQuery, setInstructorQuery] = useStateBD("");
  const [instructorOnly, setInstructorOnly] = useStateBD(false);
  const [eligibleOnly, setEligibleOnly] = useStateBD(false);
  const [clubRating, setClubRating] = useStateBD([1, 5]);
  const [customRating, setCustomRating] = useStateBD("");
  const [sort, setSort] = useStateBD("recommended");
  const [filtersPinned, setFiltersPinned] = useStateBD(false);
  const [showMonth, setShowMonth] = useStateBD(false);
  const sentinelRef = useRefBD(null);

  // Infinite scroll: reveal "Next month" when the sentinel after the recurring
  // carousel approaches the viewport bottom. Simple offset check is enough
  // in this prototype and works across iframe contexts where IntersectionObserver
  // root nuances can bite us.
  useEffectBD(() => {
    if (showMonth) return;
    const onScroll = () => {
      const el = sentinelRef.current;if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.top < (window.innerHeight || 800) + 200) setShowMonth(true);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [showMonth]);

  const toggleFacet = (group, key) => {
    setFacets((prev) => {
      const next = new Set(prev[group]);
      if (next.has(key)) next.delete(key);else next.add(key);
      return { ...prev, [group]: next };
    });
  };
  const clearGroup = (group) => setFacets((prev) => ({ ...prev, [group]: new Set() }));
  const toggleGroup = (group) => setOpenGroups((prev) => ({ ...prev, [group]: !prev[group] }));

  const filtered = useMemoBD(() => {
    return SAMPLE_EVENTS.filter((ev) => {
      if (ev.id === "e4") return false; // hero
      if (when !== "all" && !eventDayBucket(ev).includes(when)) return false;
      if (skill !== "all") {
        const b = eventSkillBucket(ev);
        if (skill === "beginner" && !(b === "beginner")) return false;
        if (skill === "intermediate" && !(b === "intermediate" || b === "beginner")) return false;
        if (skill === "advanced" && !(b === "advanced" || b === "intermediate")) return false;
      }
      if (query) {
        const q = query.toLowerCase();
        if (!(ev.name.toLowerCase().includes(q) || ev.coach.toLowerCase().includes(q) || ev.format.toLowerCase().includes(q))) return false;
      }
      return true;
    });
  }, [when, skill, query]);

  const today = filtered.filter((e) => e.when === "today");
  const week = filtered.filter((e) => e.when === "week");
  const next = filtered.filter((e) => e.when === "next");

  const totalActive = (when !== "all" ? 1 : 0) + (skill !== "all" ? 1 : 0) + (query ? 1 : 0) +
  facets.when.size + facets.format.size + facets.skill.size + facets.price.size + (
  priceMax < 60 ? 1 : 0);
  const isFilteringRecurringHide = totalActive > 0;
  const sidebarFacetsActive = facets.when.size + facets.format.size + facets.skill.size + facets.price.size + (priceMax < 60 ? 1 : 0);
  const sidebarOpen = query.length > 0 || filtersPinned || sidebarFacetsActive > 0;

  const resetAll = () => {
    setWhen("all");setSkill("all");setQuery("");
    setFacets({ when: new Set(), format: new Set(), skill: new Set(), price: new Set() });
    setPriceMax(60);
    setFiltersPinned(false);
  };

  const Section = ({ title, items, first }) => {
    if (items.length === 0) return null;
    const mine = items.filter((e) => e.myClub);
    const other = items.filter((e) => !e.myClub);
    const split = mine.length > 0 && other.length > 0;
    const Sub = ({ label, count }) =>
    <div style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: 24, paddingBottom: 10 }}>
        <span style={{ fontFamily: "Axiforma, Inter, system-ui, sans-serif", fontWeight: 800, fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase", color: "#0F1214" }}>{label}</span>
        <span style={{ flex: 1, height: 1, background: "#E9EBEC" }} />
        <span style={{ fontSize: 11, color: "#858F8F", fontWeight: 600 }}>{count}</span>
      </div>;

    return (
      <>
        {/* Section header — aligned with the homepage's ListSectionHeader
             pattern: uppercase 11px title + extending #E9EBEC hairline +
             count on the right. Replaces the heavier 14px black-underline
             head this list used to use. */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: first ? 8 : 48, paddingBottom: 14, marginBottom: 8 }}>
          <span style={{ fontFamily: "Axiforma, Inter, system-ui, sans-serif", fontWeight: 800, fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase", color: "#0F1214", whiteSpace: "nowrap" }}>{title}</span>
          <span style={{ flex: 1, height: 1, background: "#E9EBEC" }} aria-hidden="true" />
          <span style={{ fontSize: 12, color: "#858F8F", fontWeight: 500, whiteSpace: "nowrap" }}>{items.length}</span>
        </div>
        {split ?
        <>
            <Sub label="At your clubs" count={mine.length} />
            <div>{mine.map((e) => <EventCard key={e.id} ev={e} onClick={() => setSelectedEv(e)} />)}</div>
            <Sub label="At other clubs nearby" count={other.length} />
            <div>{other.map((e) => <EventCard key={e.id} ev={e} onClick={() => setSelectedEv(e)} />)}</div>
          </> :

        <div>{items.map((e) => <EventCard key={e.id} ev={e} onClick={() => setSelectedEv(e)} />)}</div>
        }
      </>);

  };

  if (selectedEv) {
    return <EventDetails ev={window.DETAIL_EVENT} type={selectedEv.type || "single"} viewport="desktop" onBack={() => setSelectedEv(null)} onRegister={() => window.__openRegisterFlow && window.__openRegisterFlow(selectedEv.type || "single")} />;
  }

  return (
    <div style={{ background: "#fff", minHeight: 1900, fontFamily: "Inter, system-ui, sans-serif" }}>
      {/* Use the same desktop ChromeBar as the dashboard so this route
           reads as part of the same surface. Falls back to the legacy
           TopBar only if ChromeBar isn't yet loaded (script-load order). */}
      {window.ChromeBar && theme ?
      <window.ChromeBar theme={theme} viewport="desktop" app={app} setApp={setApp} onOpenQR={onOpenQR} onFindClubs={onFindClubs} active="Reserve" onNav={(l) => {if (window.__navigate) window.__navigate(l);}} /> :
      <TopBar />}

      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "40px 32px 96px" }}>

        {/* Search + filter button (restored) */}
        <div style={{ marginTop: 40, paddingBottom: sidebarOpen || query ? 0 : 24, borderBottom: sidebarOpen || query ? "1px solid transparent" : "1px solid #E9EBEC", transition: "border-color 220ms ease, padding-bottom 220ms ease" }}>
          <div style={{ display: "flex", alignItems: "stretch", gap: 10 }}>
            <div style={{
              flex: 1, display: "flex", alignItems: "center", gap: 10,
              height: 52, padding: "0 16px",
              background: "#F4F5F6",
              border: query ? "1px solid #0F1214" : "1px solid #E9EBEC",
              borderRadius: 8,
              transition: "border-color 160ms, background 160ms"
            }}>
              <Icon name="Search" size={18} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, instructor, format"
                style={{
                  flex: 1, height: "100%", border: 0, outline: 0, background: "transparent",
                  fontFamily: "Axiforma, Inter, system-ui, sans-serif", fontSize: 15, fontWeight: 500, color: "#0F1214"
                }} />
              
              {query &&
              <button onClick={() => setQuery("")} style={{ width: 26, height: 26, borderRadius: 999, border: 0, background: "#fff", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name="X" size={12} />
                </button>
              }
            </div>
            <button
              onClick={() => setFiltersPinned((o) => !o)}
              aria-label="Filters"
              title="Filters"
              style={{
                position: "relative",
                width: 52, height: 52, padding: 0,
                borderRadius: 8,
                background: sidebarOpen ? "#0F1214" : "#fff",
                color: sidebarOpen ? "#fff" : "#0F1214",
                border: sidebarOpen ? "1px solid #0F1214" : "1px solid #DEE1E5",
                cursor: "pointer",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                transition: "background 160ms, color 160ms, border-color 160ms",
                flexShrink: 0
              }}>
              
              <Icon name="SlidersHorizontal" size={18} color={sidebarOpen ? "#fff" : "#0F1214"} strokeWidth={2.2} />
              {sidebarFacetsActive > 0 &&
              <span style={{
                position: "absolute", top: -4, right: -4,
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                minWidth: 20, height: 20, padding: "0 6px", borderRadius: 8,
                background: "#E11D2A", color: "#fff", fontSize: 11, fontWeight: 700, fontFamily: "Axiforma, Inter, system-ui, sans-serif",
                border: "2px solid #fff"
              }}>{sidebarFacetsActive}</span>
              }
            </button>
          </div>

          {/* Segmented controls — only when sidebar is collapsed. The sidebar
               filters supersede them when active, so showing both is noise. */}
          <div style={{
            overflow: "hidden",
            maxHeight: sidebarOpen ? 0 : 80,
            opacity: sidebarOpen ? 0 : 1,
            transition: "max-height 280ms cubic-bezier(.2,.8,.2,1), opacity 200ms ease, margin-top 280ms cubic-bezier(.2,.8,.2,1)",
            marginTop: sidebarOpen ? 0 : 20
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <Segmented options={WHEN_OPTIONS} value={when} onChange={setWhen} />
                <Segmented options={SKILL_OPTIONS} value={skill} onChange={setSkill} />
              </div>
              {totalActive > 0 &&
              <button onClick={resetAll}
              style={{ height: 32, padding: 0, border: 0, background: "transparent", color: "#0F1214", fontFamily: "inherit", fontSize: 13, fontWeight: 600, cursor: "pointer", textDecoration: "underline" }}>
                  Reset
                </button>
              }
            </div>
          </div>
        </div>

        {/* Results region — sidebar slides in from left when typing in search. */}
        <div style={{
          marginTop: 16,
          display: "grid",
          gridTemplateColumns: sidebarOpen ? "240px 1fr" : "0px 1fr",
          gap: sidebarOpen ? 48 : 0,
          transition: "grid-template-columns 320ms cubic-bezier(.2,.8,.2,1), gap 320ms cubic-bezier(.2,.8,.2,1)",
          alignItems: "flex-start"
        }}>
          <aside style={{
            transform: sidebarOpen ? "translateX(0)" : "translateX(-24px)",
            opacity: sidebarOpen ? 1 : 0,
            transition: "transform 320ms cubic-bezier(.2,.8,.2,1), opacity 220ms ease",
            pointerEvents: sidebarOpen ? "auto" : "none",
            paddingTop: 0,
            paddingLeft: 8,
            paddingRight: 8,
            marginLeft: -8,
            marginRight: -8
          }}>
            <FilterBarD
              facets={facets}
              toggleFacet={toggleFacet}
              clearGroup={clearGroup}
              duprRange={duprRange} setDuprRange={setDuprRange}
              instructorQuery={instructorQuery} setInstructorQuery={setInstructorQuery}
              instructorOnly={instructorOnly} setInstructorOnly={setInstructorOnly}
              eligibleOnly={eligibleOnly} setEligibleOnly={setEligibleOnly}
              clubRating={clubRating} setClubRating={setClubRating}
              customRating={customRating} setCustomRating={setCustomRating}
              sort={sort} setSort={setSort}
              resultCount={filtered.length}
              resetAll={resetAll}
              layout="sidebar" />
            
          </aside>

          <div style={{ minWidth: 0 }}>
            {filtered.length === 0 ?
            <div style={{ padding: "80px 0", textAlign: "center", borderTop: "1px solid #0F1214", marginTop: 32 }}>
                <div style={{ fontFamily: "Axiforma, Inter, system-ui, sans-serif", fontWeight: 800, fontSize: 28, color: "#0F1214", letterSpacing: -0.6 }}>No events match.</div>
                <div style={{ marginTop: 8, fontSize: 14, color: "#4B5052" }}>Try a wider window or a different skill level.</div>
              </div> :

            <>
                <Section title="Today" items={today} first={today.length > 0} />
                <Section title="This week" items={week} first={today.length === 0 && week.length > 0} />
                <Section title="Next week" items={next} first={today.length === 0 && week.length === 0 && next.length > 0} />
                {!isFilteringRecurringHide &&
              <RecurringCarousel
                items={window.RECURRING_EVENTS || []}
                viewport="desktop"
                first={today.length === 0 && week.length === 0 && next.length === 0}
                onSelect={(ev) => setSelectedEv({ ...ev, type: ev.type || "series" })} />

              }
                {/* sentinel — when visible, reveal "Next month" */}
                <div ref={sentinelRef} aria-hidden="true" style={{ height: 1 }} />
                {showMonth &&
              <Section title="Next month" items={window.NEXT_MONTH_EVENTS || []} first={false} />
              }
                {!showMonth &&
              <div style={{ paddingTop: 32, paddingBottom: 16, display: "flex", justifyContent: "center" }}>
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
              </>
            }
          </div>
        </div>
      </div>
    </div>);

}

window.BrowseDesktop = BrowseDesktop;
window.TopBar = TopBar;

// ---- Interactive Sidebar ----
function InteractiveCheckRow({ label, count, checked, onToggle }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onClick={onToggle}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex", alignItems: "center", gap: 10, padding: "8px 8px 8px 6px",
        margin: "0 -8px", borderRadius: 8, cursor: "pointer",
        background: hover || checked ? "#F4F5F6" : "transparent",
        transition: "background 120ms"
      }}>
      
      <span style={{
        width: 18, height: 18, borderRadius: 8,
        border: checked ? "1px solid #0F1214" : "1px solid #BBBFC1",
        background: checked ? "#0F1214" : "#fff",
        display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        transition: "all 120ms"
      }}>
        {checked && <Icon name="Check" size={11} color="#fff" strokeWidth={3} />}
      </span>
      <span style={{ flex: 1, fontSize: 13, fontWeight: checked ? 600 : 500, color: "#0F1214" }}>{label}</span>
      <span style={{
        fontSize: 11, color: checked ? "#0F1214" : "#858F8F", fontVariantNumeric: "tabular-nums",
        fontWeight: checked ? 700 : 500,
        padding: "2px 8px", borderRadius: 8,
        background: checked ? "#fff" : "transparent",
        border: checked ? "1px solid #E9EBEC" : "1px solid transparent"
      }}>{count}</span>
    </div>);

}

function InteractiveGroup({ title, group, items, facets, toggleFacet, clearGroup, open, onToggleOpen }) {
  const selected = facets[group].size;
  return (
    <div style={{ paddingBottom: 18, marginBottom: 18, borderBottom: "1px solid #E9EBEC" }}>
      <div onClick={onToggleOpen}
      style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", padding: "4px 0", marginBottom: open ? 8 : 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontFamily: "Axiforma, Inter, system-ui, sans-serif", fontWeight: 800, fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase", color: "#0F1214" }}>{title}</span>
          {selected > 0 &&
          <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 18, height: 18, padding: "0 6px", borderRadius: 8, background: "#0F1214", color: "#fff", fontSize: 10, fontWeight: 700, fontFamily: "Axiforma, Inter, system-ui, sans-serif" }}>{selected}</span>
          }
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {selected > 0 &&
          <button onClick={(e) => {e.stopPropagation();clearGroup(group);}}
          style={{ border: 0, background: "transparent", color: "#4B5052", fontSize: 11, fontWeight: 600, cursor: "pointer", textDecoration: "underline" }}>clear</button>
          }
          <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 18, height: 18, transform: open ? "rotate(0deg)" : "rotate(-90deg)", transition: "transform 200ms" }}>
            <Icon name="ChevronDown" size={14} strokeWidth={2.4} />
          </span>
        </div>
      </div>
      <div style={{
        maxHeight: open ? 600 : 0, overflow: "hidden",
        transition: "max-height 280ms cubic-bezier(.2,.8,.2,1)"
      }}>
        {items.map((it) =>
        <InteractiveCheckRow key={it.key}
        label={it.label} count={it.count}
        checked={facets[group].has(it.key)}
        onToggle={() => toggleFacet(group, it.key)} />
        )}
      </div>
    </div>);

}

function PriceSlider({ value, onChange }) {
  const pct = Math.min(100, Math.max(0, (value - 0) / 60 * 100));
  return (
    <div style={{ paddingBottom: 18, marginBottom: 18, borderBottom: "1px solid #E9EBEC" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <span style={{ fontFamily: "Axiforma, Inter, system-ui, sans-serif", fontWeight: 800, fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase" }}>Max price</span>
        <span style={{ fontFamily: "Axiforma, Inter, system-ui, sans-serif", fontWeight: 700, fontSize: 14, color: "#0F1214" }}>{value === 60 ? "Any" : `$${value}`}</span>
      </div>
      <div style={{ position: "relative", height: 24, display: "flex", alignItems: "center" }}>
        <div style={{ position: "absolute", left: 0, right: 0, height: 4, background: "#E9EBEC", borderRadius: 999 }} />
        <div style={{ position: "absolute", left: 0, width: `${pct}%`, height: 4, background: "#0F1214", borderRadius: 999, transition: "width 120ms" }} />
        <input type="range" min={0} max={60} step={5} value={value} onChange={(e) => onChange(+e.target.value)}
        style={{ position: "absolute", inset: 0, opacity: 0, width: "100%", cursor: "pointer", margin: 0 }} />
        <div style={{ position: "absolute", left: `calc(${pct}% - 9px)`, width: 18, height: 18, borderRadius: 999, background: "#0F1214", border: "3px solid #fff", boxShadow: "0 1px 3px rgba(0,0,0,.2)", pointerEvents: "none", transition: "left 120ms" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 10, color: "#858F8F", fontWeight: 500 }}>
        <span>Free</span><span>$60+</span>
      </div>
    </div>);

}

function MultiSelectDropdown({ title, group, items, facets, toggleFacet, clearGroup, open, onToggleOpen }) {
  const selected = facets[group];
  const count = selected.size;
  const summary = count === 0 ?
  "Any" :
  count === 1 ?
  (items.find((i) => selected.has(i.key)) || {}).label || `${count} selected` :
  `${count} selected`;
  return (
    <div style={{ paddingBottom: 14, marginBottom: 14, borderBottom: "1px solid #E9EBEC", position: "relative" }}>
      <div onClick={onToggleOpen}
      style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", padding: "8px 10px", marginLeft: -10, marginRight: -10, borderRadius: 8, background: open ? "#F4F5F6" : "transparent", transition: "background 160ms" }}
      onMouseEnter={(e) => {if (!open) e.currentTarget.style.background = "#FAFAFB";}}
      onMouseLeave={(e) => {if (!open) e.currentTarget.style.background = "transparent";}}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          <span style={{ fontFamily: "Axiforma, Inter, system-ui, sans-serif", fontWeight: 800, fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase", color: "#0F1214" }}>{title}</span>
          {count > 0 &&
          <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 18, height: 18, padding: "0 6px", borderRadius: 8, background: "#0F1214", color: "#fff", fontSize: 10, fontWeight: 700, fontFamily: "Axiforma, Inter, system-ui, sans-serif" }}>{count}</span>
          }
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
          <span style={{ fontSize: 12, color: count > 0 ? "#0F1214" : "#858F8F", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 100 }}>{summary}</span>
          <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 18, height: 18, transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 200ms" }}>
            <Icon name="ChevronDown" size={14} strokeWidth={2.4} />
          </span>
        </div>
      </div>
      {open &&
      <div style={{
        marginTop: 8, padding: 6, background: "#fff", border: "1px solid #E9EBEC", borderRadius: 8,
        boxShadow: "0 10px 30px rgba(15,18,20,.08), 0 2px 6px rgba(15,18,20,.04)",
        maxHeight: 280, overflowY: "auto"
      }}>
          {items.map((it) => {
          const on = selected.has(it.key);
          return (
            <label key={it.key} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 8,
              cursor: "pointer", transition: "background 120ms"
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#F4F5F6"}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                <input type="checkbox" checked={on} onChange={() => toggleFacet(group, it.key)}
              style={{ width: 16, height: 16, accentColor: "#0F1214", margin: 0 }} />
                <span style={{ flex: 1, fontFamily: "inherit", fontSize: 13, fontWeight: 500, color: "#0F1214" }}>{it.label}</span>
                {it.count !== undefined &&
              <span style={{ fontSize: 11, color: "#858F8F", fontWeight: 500, fontVariantNumeric: "tabular-nums" }}>{it.count}</span>
              }
              </label>);

        })}
          {count > 0 &&
        <div style={{ display: "flex", justifyContent: "flex-end", padding: "6px 10px 2px" }}>
              <button onClick={() => clearGroup(group)}
          style={{ border: 0, background: "transparent", color: "#4B5052", fontSize: 11, fontWeight: 600, cursor: "pointer", textDecoration: "underline" }}>clear</button>
            </div>
        }
        </div>
      }
    </div>);

}

function InteractiveSidebar({ facets, toggleFacet, clearGroup, openGroups, toggleGroup, priceMax, setPriceMax, resultCount, duprRange, setDuprRange, instructorQuery, setInstructorQuery, instructorOnly, setInstructorOnly, eligibleOnly, setEligibleOnly, clubRating, setClubRating, customRating, setCustomRating }) {
  const duprActive = duprRange[0] > 2.0 || duprRange[1] < 5.0;
  const clubActive = clubRating[0] > 1 || clubRating[1] < 5;
  const totalSelected = facets.when.size + facets.format.size + facets.skill.size + facets.price.size + facets.type.size + facets.gender.size + facets.season.size + (priceMax < 60 ? 1 : 0) + (duprActive ? 1 : 0) + (instructorOnly ? 1 : 0) + (instructorQuery ? 1 : 0) + (eligibleOnly ? 1 : 0) + (clubActive ? 1 : 0) + (customRating ? 1 : 0);
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 8, paddingBottom: 14, marginBottom: 8 }}>
        <span style={{ fontFamily: "Axiforma, Inter, system-ui, sans-serif", fontWeight: 800, fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase", color: "#0F1214", whiteSpace: "nowrap" }}>Refine</span>
        <span style={{ flex: 1, height: 1, background: "#E9EBEC" }} aria-hidden="true" />
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ fontSize: 13, color: "#4B5052", fontWeight: 500 }}>{resultCount}</div>
          {totalSelected > 0 &&
          <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 18, height: 18, padding: "0 6px", borderRadius: 8, background: "#0F1214", color: "#fff", fontSize: 10, fontWeight: 700, fontFamily: "Axiforma, Inter, system-ui, sans-serif" }}>{totalSelected}</span>
          }
        </div>
      </div>
      <MultiSelectDropdown
        title="Type" group="type"
        items={[
        { key: "singles", label: "Singles", count: 3 },
        { key: "doubles", label: "Doubles", count: 6 },
        { key: "clinic", label: "Clinic", count: 4 },
        { key: "dropin", label: "Drop-in", count: 3 },
        { key: "rr", label: "Round Robin", count: 4 },
        { key: "tournament", label: "Tournament", count: 1 },
        { key: "junior", label: "Junior", count: 2 },
        { key: "social", label: "Social", count: 3 },
        { key: "openplay", label: "Open Play", count: 5 }]
        }
        facets={facets} toggleFacet={toggleFacet} clearGroup={clearGroup}
        open={openGroups.type} onToggleOpen={() => toggleGroup("type")} />
      <MultiSelectDropdown
        title="When" group="when"
        items={[
        { key: "today", label: "Today", count: 4 },
        { key: "tomorrow", label: "Tomorrow", count: 5 },
        { key: "weekend", label: "This weekend", count: 6 },
        { key: "morning", label: "Mornings", count: 7 },
        { key: "afternoon", label: "Afternoons", count: 5 },
        { key: "evening", label: "Evenings", count: 3 }]
        }
        facets={facets} toggleFacet={toggleFacet} clearGroup={clearGroup}
        open={openGroups.when} onToggleOpen={() => toggleGroup("when")} />
      <MultiSelectDropdown
        title="Skill" group="skill"
        items={[
        { key: "beg", label: "Beginner", count: 4 },
        { key: "int", label: "Intermediate", count: 6 },
        { key: "adv", label: "Advanced", count: 5 },
        { key: "dupr", label: "DUPR rated", count: 6 }]
        }
        facets={facets} toggleFacet={toggleFacet} clearGroup={clearGroup}
        open={openGroups.skill} onToggleOpen={() => toggleGroup("skill")} />
      <PriceSlider value={priceMax} onChange={setPriceMax} />

      {/* More filters — single collapsible */}
      <div style={{ paddingTop: 4 }}>
        <button onClick={() => toggleGroup("more")} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", background: "transparent", border: 0, padding: "8px 10px", marginLeft: -10, marginRight: -10, borderRadius: 8, cursor: "pointer", fontFamily: "inherit" }}
        onMouseEnter={(e) => e.currentTarget.style.background = "#FAFAFB"}
        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
          <h3 style={{ fontFamily: "Axiforma, Inter, system-ui, sans-serif", fontWeight: 800, fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase", color: "#0F1214", margin: 0 }}>More filters</h3>
          <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 18, height: 18, transform: openGroups.more ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 200ms" }}>
            <Icon name="ChevronDown" size={14} strokeWidth={2.4} />
          </span>
        </button>
        {openGroups.more &&
        <div style={{ marginTop: 14, paddingBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <span style={{ fontSize: 12, color: "#4B5052", fontWeight: 500 }}>Gender</span>
              <div style={{ display: "inline-flex", background: "#F4F5F6", borderRadius: 8, padding: 2 }}>
                {[{ k: "all", l: "All" }, { k: "w", l: "Women's" }, { k: "m", l: "Men's" }].map((o) => {
                const on = o.k === "all" ? facets.gender.size === 0 : facets.gender.has(o.k);
                return (
                  <button key={o.k} onClick={() => {clearGroup("gender");if (o.k !== "all") toggleFacet("gender", o.k);}}
                  style={{ height: 28, padding: "0 12px", borderRadius: 8, border: 0, background: on ? "#0F1214" : "transparent", color: on ? "#fff" : "#0F1214", fontFamily: "inherit", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
                      {o.l}
                    </button>);

              })}
              </div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6, fontSize: 12, color: "#4B5052", fontWeight: 500 }}>
                <span>Player skill (DUPR)</span>
                <span style={{ fontVariantNumeric: "tabular-nums" }}>{duprRange[0].toFixed(1)}–{duprRange[1].toFixed(1)}</span>
              </div>
              <input type="range" min={2.0} max={5.0} step={0.1} value={duprRange[1]} onChange={(e) => setDuprRange([duprRange[0], Number(e.target.value)])} style={{ width: "100%" }} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, color: "#4B5052", fontWeight: 500, marginBottom: 6 }}>Instructor</div>
              <div style={{ display: "flex", alignItems: "center", height: 36, padding: "0 12px", borderRadius: 8, border: "1px solid #DEE1E5" }}>
                <Icon name="Search" size={13} color="#858F8F" />
                <input value={instructorQuery} onChange={(e) => setInstructorQuery(e.target.value)} placeholder="Filter by name"
              style={{ flex: 1, border: 0, outline: 0, marginLeft: 8, fontFamily: "inherit", fontSize: 12, color: "#0F1214", background: "transparent" }} />
              </div>
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#0F1214", fontWeight: 500, cursor: "pointer", marginBottom: 14 }}>
              <input type="checkbox" checked={instructorOnly} onChange={(e) => setInstructorOnly(e.target.checked)} />
              Instructor-led only
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#0F1214", fontWeight: 500, cursor: "pointer", marginBottom: 14 }}>
              <input type="checkbox" checked={eligibleOnly} onChange={(e) => setEligibleOnly(e.target.checked)} />
              Only events I can join
            </label>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, color: "#4B5052", fontWeight: 500, marginBottom: 6 }}>Season</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {[{ k: "spring", l: "Spring" }, { k: "summer", l: "Summer" }, { k: "fall", l: "Fall" }, { k: "winter", l: "Winter" }].map((o) => {
                const on = facets.season.has(o.k);
                return (
                  <button key={o.k} onClick={() => toggleFacet("season", o.k)} style={{ height: 26, padding: "0 10px", borderRadius: 8, border: on ? "1px solid #0F1214" : "1px solid #E9EBEC", background: on ? "#0F1214" : "#fff", color: on ? "#fff" : "#0F1214", fontFamily: "inherit", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>{o.l}</button>);

              })}
              </div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6, fontSize: 12, color: "#4B5052", fontWeight: 500 }}>
                <span>Club rating</span>
                <span style={{ fontVariantNumeric: "tabular-nums" }}>{clubRating[0]}★–{clubRating[1]}★</span>
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
        }
      </div>
    </div>);

}