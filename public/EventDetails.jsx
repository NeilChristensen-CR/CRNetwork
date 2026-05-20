// EventDetails.jsx — Event details page restyled in Uber-minimal direction.
// One component, four registration types (single / drop-in / series / hybrid),
// two viewports (desktop / mobile). Sticky CTA on mobile, inline CTA on desktop.

const { useState: useStateED, useMemo: useMemoED } = React;

// ---------- shared primitives ----------

function Divider({ mt = 32, mb = 32 }) {
  return <div style={{ height: 1, background: "#E9EBEC", marginTop: mt, marginBottom: mb }} />;
}

function SectionLabel({ children, count, action }) {
  // Aligned with the homepage's ListSectionHeader: uppercase eyebrow on the
  // left, hairline rule extending to fill, optional count + action on the right.
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 8, paddingBottom: 14 }}>
      <span style={{
        fontFamily: "Axiforma, Inter, system-ui, sans-serif", fontWeight: 800, fontSize: 11,
        letterSpacing: 1.2, textTransform: "uppercase", color: "#0F1214",
        whiteSpace: "nowrap",
      }}>{children}</span>
      <span style={{ flex: 1, height: 1, background: "#E9EBEC" }} aria-hidden="true" />
      {count != null && <span style={{ fontSize: 12, color: "#858F8F", fontWeight: 500, whiteSpace: "nowrap" }}>{count}</span>}
      {action}
    </div>
  );
}

function StatBlock({ k, v, sub }) {
  return (
    <div>
      <div style={{ fontFamily: "Axiforma, Inter, system-ui, sans-serif", fontWeight: 800, fontSize: 28, color: "#0F1214", letterSpacing: -0.6, lineHeight: 1 }}>{k}</div>
      <div style={{ marginTop: 8, fontSize: 12, color: "#4B5052", fontWeight: 500, letterSpacing: 0.4, textTransform: "uppercase" }}>{v}</div>
      {sub && <div style={{ marginTop: 2, fontSize: 11, color: "#858F8F", fontWeight: 500 }}>{sub}</div>}
    </div>
  );
}

function TypePill({ children }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", height: 22, padding: "0 10px",
      background: "#0F1214", color: "#fff", borderRadius: 8,
      fontFamily: "Axiforma, Inter, system-ui, sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase",
    }}>{children}</span>
  );
}

// ---------- type-specific date pickers ----------

function SingleDateBlock({ ev }) {
  return (
    <div>
      <SectionLabel>Date</SectionLabel>
      <div style={{ marginTop: 14, display: "flex", alignItems: "baseline", gap: 16, flexWrap: "wrap" }}>
        <div style={{ fontFamily: "Axiforma, Inter, system-ui, sans-serif", fontWeight: 800, fontSize: 32, color: "#0F1214", letterSpacing: -0.7 }}>
          {ev.single.date}
        </div>
        <div style={{ fontSize: 15, color: "#4B5052", fontWeight: 500 }}>{ev.single.time}</div>
      </div>
    </div>
  );
}

function DropInBlock({ ev, selected, setSelected }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <SectionLabel>Choose a date</SectionLabel>
        <div style={{ fontSize: 12, color: "#4B5052", fontWeight: 500 }}>{ev.dropIn.pricePerSession} per session</div>
      </div>
      <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 8 }}>
        {ev.dropIn.dates.map(d => {
          const on = selected === d.id;
          return (
            <button key={d.id} onClick={() => setSelected(d.id)} style={{
              textAlign: "left", padding: "16px 18px",
              background: on ? "#0F1214" : "#fff",
              color: on ? "#fff" : "#0F1214",
              border: on ? "1px solid #0F1214" : "1px solid #E9EBEC",
              borderRadius: 8, cursor: "pointer",
              fontFamily: "inherit",
              transition: "background 140ms, color 140ms, border-color 140ms",
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase",
                color: on ? "rgba(255,255,255,.6)" : "#858F8F" }}>{d.label}</div>
              <div style={{ marginTop: 6, fontFamily: "Axiforma, Inter, system-ui, sans-serif", fontWeight: 700, fontSize: 15, letterSpacing: -0.2 }}>{d.sub}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SeriesBlock({ ev }) {
  const [expanded, setExpanded] = useStateED(false);
  const COLLAPSED = 3;
  const visible = expanded ? ev.series.sessions : ev.series.sessions.slice(0, COLLAPSED);
  const hidden = ev.series.sessions.length - visible.length;
  return (
    <div>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 16 }}>
        <SectionLabel>Series schedule</SectionLabel>
        <div style={{ fontSize: 12, color: "#4B5052", fontWeight: 500 }}>{ev.series.totalSessions} sessions · {ev.series.range}</div>
      </div>
      <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
        {visible.map((s, i) => (
          <li key={s.id} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "14px 0",
            borderTop: i === 0 ? "1px solid #0F1214" : "1px solid #E9EBEC",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontFamily: "Axiforma, Inter, system-ui, sans-serif", fontWeight: 700, fontSize: 12, color: "#858F8F", width: 24, letterSpacing: 0.6 }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span style={{ fontFamily: "Axiforma, Inter, system-ui, sans-serif", fontWeight: 700, fontSize: 16, color: "#0F1214", letterSpacing: -0.2 }}>
                {s.label}
              </span>
            </div>
            <span style={{ fontSize: 12, color: "#4B5052", fontWeight: 500 }}>included</span>
          </li>
        ))}
      </ul>
      {(hidden > 0 || expanded) && (
        <button onClick={() => setExpanded(e => !e)} style={{
          marginTop: 12, height: 36, padding: "0 16px", borderRadius: 8,
          border: "1px solid #DEE1E5", background: "#fff", color: "#0F1214",
          fontFamily: "inherit", fontSize: 12, fontWeight: 600, cursor: "pointer",
          display: "inline-flex", alignItems: "center", gap: 8,
        }}>
          {expanded ? "Show less" : `Show ${hidden} more session${hidden === 1 ? "" : "s"}`}
          <Icon name={expanded ? "ChevronUp" : "ChevronDown"} size={12} strokeWidth={2.5} />
        </button>
      )}
      <div style={{ marginTop: 12, fontSize: 12, color: "#858F8F", fontWeight: 500 }}>
        {ev.series.totalSessions} of {ev.series.totalActivities} sessions in this series
      </div>
    </div>
  );
}

function HybridBlock({ ev, mode, setMode, selectedSet, toggleHybrid, selectAll }) {
  const count = selectedSet.size;
  const total = ev.hybrid.dates.length;
  const [expanded, setExpanded] = useStateED(false);
  const COLLAPSED = 3;
  const visibleDates = expanded ? ev.hybrid.dates : ev.hybrid.dates.slice(0, COLLAPSED);
  const hiddenCount = total - visibleDates.length;
  // Keep selected hidden dates visible so the user sees their picks.
  const extraSelected = expanded ? [] : ev.hybrid.dates.slice(COLLAPSED).filter(d => selectedSet.has(d.id));
  const renderDates = [...visibleDates, ...extraSelected];
  return (
    <div>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <SectionLabel>Choose dates to attend</SectionLabel>
        <div style={{ fontSize: 12, color: "#4B5052", fontWeight: 500 }}>{count} of {total} selected</div>
      </div>

      {/* Bundle vs single toggle */}
      <div style={{ marginTop: 14, display: "inline-flex", padding: 4, background: "#F4F5F6", borderRadius: 8, border: "1px solid #E9EBEC" }}>
        {[
          { id: "single",  label: `Per session · ${ev.hybrid.pricePerSession}` },
          { id: "bundle",  label: `All ${total} · ${ev.hybrid.bundlePrice}` },
        ].map(opt => {
          const on = mode === opt.id;
          return (
            <button key={opt.id} onClick={() => { setMode(opt.id); if (opt.id === "bundle") selectAll(); }} style={{
              height: 32, padding: "0 14px", borderRadius: 8,
              background: on ? "#0F1214" : "transparent",
              color: on ? "#fff" : "#0F1214",
              border: 0, cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: 600,
              transition: "background 140ms, color 140ms",
            }}>{opt.label}</button>
          );
        })}
      </div>

      {/* Date chips */}
      <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: 8 }}>
        {renderDates.map(d => {
          const on = selectedSet.has(d.id);
          return (
            <button key={d.id} onClick={() => toggleHybrid(d.id)} style={{
              textAlign: "left", padding: "14px 16px",
              background: on ? "#0F1214" : "#fff",
              color: on ? "#fff" : "#0F1214",
              border: on ? "1px solid #0F1214" : "1px solid #E9EBEC",
              borderRadius: 8, cursor: "pointer", fontFamily: "inherit",
              transition: "background 140ms, color 140ms, border-color 140ms",
              position: "relative",
            }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.2, color: on ? "rgba(255,255,255,.6)" : "#858F8F" }}>{d.weekday}</div>
              <div style={{ marginTop: 4, fontFamily: "Axiforma, Inter, system-ui, sans-serif", fontWeight: 800, fontSize: 16, letterSpacing: -0.3 }}>{d.date}</div>
              {on && (
                <span style={{
                  position: "absolute", top: 8, right: 8,
                  width: 14, height: 14, borderRadius: 999, background: "#fff", color: "#0F1214",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon name="Check" size={10} strokeWidth={3} />
                </span>
              )}
            </button>
          );
        })}
      </div>
      {(hiddenCount > 0 || expanded) && (
        <button onClick={() => setExpanded(e => !e)} style={{
          marginTop: 12, height: 36, padding: "0 16px", borderRadius: 8,
          border: "1px solid #DEE1E5", background: "#fff", color: "#0F1214",
          fontFamily: "inherit", fontSize: 12, fontWeight: 600, cursor: "pointer",
          display: "inline-flex", alignItems: "center", gap: 8,
        }}>
          {expanded ? "Show less" : `Show ${hiddenCount} more date${hiddenCount === 1 ? "" : "s"}`}
          <Icon name={expanded ? "ChevronUp" : "ChevronDown"} size={12} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
}

// ---------- main detail body (viewport-aware) ----------

function EventDetailBody({ ev, type, viewport, selectedDropIn, setSelectedDropIn, hybridMode, setHybridMode, hybridSelected, toggleHybrid, selectAllHybrid }) {
  const desktop = viewport === "desktop";

  const typeLabel = {
    single: "Single date",
    dropin: "Drop-in",
    series: "Full series",
    hybrid: "Drop-in & series",
  }[type];

  // Price/CTA varies by type
  const cta = useMemoED(() => {
    if (type === "single") return { price: ev.single.price, label: `Register · ${ev.single.price}` };
    if (type === "dropin") return { price: ev.dropIn.pricePerSession, label: `Register · ${ev.dropIn.pricePerSession} · 1 session` };
    if (type === "series") return { price: ev.series.totalPrice, label: `Register · ${ev.series.totalPrice} for ${ev.series.totalSessions} sessions` };
    // hybrid
    if (hybridMode === "bundle") return { price: ev.hybrid.bundlePrice, label: `Register · ${ev.hybrid.bundlePrice} for all 5` };
    const n = hybridSelected.size;
    const total = n * 15; // $15 each from data
    return { price: `$${total}.00`, label: n === 0 ? "Choose at least one date" : `Register · $${total}.00 for ${n} session${n > 1 ? "s" : ""}`, disabled: n === 0 };
  }, [type, hybridMode, hybridSelected.size]);

  return (
    <>
      {/* Eyebrow */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <TypePill>{typeLabel}</TypePill>
        <span style={{ fontSize: 12, color: "#4B5052", fontWeight: 500 }}>{ev.sport} · {ev.surface}</span>
      </div>

      {/* Title */}
      <h1 style={{
        margin: "20px 0 0",
        fontFamily: "Axiforma, Inter, system-ui, sans-serif", fontWeight: 800,
        fontSize: desktop ? 64 : 30,
        lineHeight: desktop ? "64px" : "34px",
        letterSpacing: desktop ? -2 : -0.8,
        color: "#0F1214",
        textWrap: "balance",
      }}>{ev.name}.</h1>

      {/* Stats row */}
      <div style={{ marginTop: 36, display: "grid", gridTemplateColumns: desktop ? "repeat(4, 1fr)" : "repeat(2, 1fr)", gap: 24, borderTop: "1px solid #0F1214", paddingTop: 24 }}>
        <StatBlock k={`${ev.openSpots}/${ev.totalSpots}`} v="Open spots" />
        <StatBlock k={typeLabel.split(" ")[0]} v="Format" sub={type === "series" ? `${ev.series.totalSessions} sessions` : type === "hybrid" ? "Pick & choose" : null} />
        <StatBlock k={ev.sport} v="Sport" />
        <StatBlock k={ev.surface} v="Court" />
      </div>

      {/* Schedule + requirements two-column */}
      <div style={{
        marginTop: 48,
        display: "grid",
        gridTemplateColumns: desktop ? "1fr 1fr" : "1fr",
        gap: desktop ? 48 : 32,
      }}>
        <div>
          <SectionLabel>When &amp; where</SectionLabel>
          <div style={{ marginTop: 16 }}>
            {ev.schedule.map((s, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 16, padding: "12px 0", borderTop: i === 0 ? "1px solid #E9EBEC" : "1px solid #F4F5F6" }}>
                <span style={{ fontFamily: "Axiforma, Inter, system-ui, sans-serif", fontWeight: 700, fontSize: 12, color: "#0F1214", letterSpacing: 0.6, paddingTop: 2 }}>{s.days}</span>
                <span style={{ fontSize: 14, color: "#0F1214", fontWeight: 500 }}>{s.time}</span>
              </div>
            ))}
            {ev.courts.map((c, i) => (
              <div key={c} style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 16, padding: "12px 0", borderTop: "1px solid #F4F5F6", alignItems: "center" }}>
                <Icon name="MapPin" size={14} color="#858F8F" />
                <span style={{ fontSize: 14, color: "#0F1214", fontWeight: 500 }}>{c}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <SectionLabel>Requirements</SectionLabel>
          <div style={{ marginTop: 16 }}>
            {ev.requirements.map((r, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 14, padding: "12px 0", borderTop: i === 0 ? "1px solid #E9EBEC" : "1px solid #F4F5F6", alignItems: "center" }}>
                <Icon name={r.icon} size={14} color="#858F8F" />
                <span style={{ fontSize: 14, color: "#0F1214", fontWeight: 500 }}>{r.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Type-specific block */}
      <Divider mt={32} mb={16} />

      {type === "single" && <SingleDateBlock ev={ev} />}
      {type === "dropin" && <DropInBlock ev={ev} selected={selectedDropIn} setSelected={setSelectedDropIn} />}
      {type === "series" && <SeriesBlock ev={ev} />}
      {type === "hybrid" && (
        <HybridBlock
          ev={ev}
          mode={hybridMode}
          setMode={setHybridMode}
          selectedSet={hybridSelected}
          toggleHybrid={toggleHybrid}
          selectAll={selectAllHybrid}
        />
      )}

      {/* About */}
      <Divider mt={32} mb={16} />
      <SectionLabel>About</SectionLabel>
      <p style={{ marginTop: 14, fontSize: 16, color: "#0F1214", lineHeight: "26px", maxWidth: 640, fontWeight: 500 }}>
        {ev.about}
      </p>

      {/* Tags */}
      <div style={{ marginTop: 24, display: "flex", flexWrap: "wrap", gap: 8 }}>
        {ev.tags.map(t => (
          <span key={t} style={{
            display: "inline-flex", alignItems: "center", height: 28, padding: "0 12px",
            background: "#F4F5F6", color: "#0F1214", border: "1px solid #E9EBEC",
            borderRadius: 8, fontSize: 12, fontWeight: 500,
          }}>{t}</span>
        ))}
      </div>

      {/* Instructor */}
      <Divider mt={32} mb={16} />
      <SectionLabel>Instructor</SectionLabel>
      <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{
          width: 56, height: 56, borderRadius: 999, background: "#0F1214", color: "#fff",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          fontFamily: "Axiforma, Inter, system-ui, sans-serif", fontWeight: 800, fontSize: 16,
        }}>{ev.instructor.avatar}</div>
        <div>
          <div style={{ fontFamily: "Axiforma, Inter, system-ui, sans-serif", fontWeight: 700, fontSize: 18, color: "#0F1214", letterSpacing: -0.3 }}>{ev.instructor.name}</div>
          <div style={{ marginTop: 4, fontSize: 13, color: "#4B5052", fontWeight: 500, display: "flex", gap: 10, alignItems: "center" }}>
            <span>{ev.instructor.rating}</span>
            <span style={{ width: 3, height: 3, borderRadius: 999, background: "#BBBFC1" }} />
            <span>{ev.instructor.experience}</span>
          </div>
        </div>
      </div>

      {/* Registered players */}
      <Divider mt={24} mb={12} />
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <SectionLabel>{ev.registered.length} registered players</SectionLabel>
        <button style={{ background: "transparent", border: 0, color: "#0F1214", fontFamily: "inherit", fontSize: 12, fontWeight: 600, cursor: "pointer", textDecoration: "underline" }}>
          View roster
        </button>
      </div>
      <div style={{ marginTop: 12 }}>
        {ev.registered.map((p, i) => (
          <div key={p.name} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "12px 0", borderTop: i === 0 ? "1px solid #E9EBEC" : "1px solid #F4F5F6",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: 999, background: i % 2 === 0 ? "#0F1214" : "#4B5052", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "Axiforma, Inter, system-ui, sans-serif", fontWeight: 700, fontSize: 11 }}>{p.avatar}</div>
              <span style={{ fontSize: 14, color: "#0F1214", fontWeight: 500 }}>{p.name}</span>
            </div>
            <span style={{ fontSize: 13, color: "#4B5052", fontWeight: 500 }}>{p.rating}</span>
          </div>
        ))}
      </div>

      {/* Note */}
      <div style={{
        marginTop: 40, padding: "16px 20px",
        background: "#F4F5F6", borderRadius: 8,
        display: "flex", alignItems: "flex-start", gap: 12,
      }}>
        <div style={{ marginTop: 2 }}><Icon name="Info" size={16} color="#0F1214" strokeWidth={2.2} /></div>
        <div>
          <div style={{ fontFamily: "Axiforma, Inter, system-ui, sans-serif", fontWeight: 700, fontSize: 12, color: "#0F1214", letterSpacing: 0.6, textTransform: "uppercase", marginBottom: 6 }}>Note from the club</div>
          <div style={{ fontSize: 14, color: "#0F1214", lineHeight: "22px", fontWeight: 500 }}>{ev.note}</div>
        </div>
      </div>

      {/* Inline CTA (desktop uses fixed floater instead) */}
      {false && desktop && (
        <div style={{ marginTop: 56, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "28px 0", borderTop: "1px solid #0F1214", borderBottom: "1px solid #0F1214" }}>
          <div>
            <div style={{ fontFamily: "Axiforma, Inter, system-ui, sans-serif", fontWeight: 800, fontSize: 36, color: "#0F1214", letterSpacing: -0.8, lineHeight: 1 }}>{cta.price}</div>
            <div style={{ marginTop: 6, fontSize: 12, color: "#4B5052", fontWeight: 500 }}>
              {type === "series" ? `For all ${ev.series.totalSessions} sessions` : type === "hybrid" && hybridMode === "bundle" ? "Bundle price" : type === "hybrid" ? `${hybridSelected.size} session${hybridSelected.size !== 1 ? "s" : ""} selected` : "Cancel up to 4 hours before start time"}
            </div>
          </div>
          <button disabled={cta.disabled} onClick={() => !cta.disabled && detailState.onRegister && detailState.onRegister()} style={{
            display: "inline-flex", alignItems: "center", gap: 12,
            height: 56, padding: "0 32px", borderRadius: 8, border: 0,
            background: cta.disabled ? "#BBBFC1" : "#0F1214",
            color: "#fff", fontFamily: "inherit", fontWeight: 600, fontSize: 15,
            cursor: cta.disabled ? "not-allowed" : "pointer",
          }}>
            {cta.label}
            <Icon name="ArrowRight" size={16} color="#fff" strokeWidth={2.5} />
          </button>
        </div>
      )}

      {desktop && (
        <div style={{ marginTop: 12, fontSize: 12, color: "#4B5052", textAlign: "center" }}>
          By continuing, you agree to our{" "}
          <a href="#" style={{ color: "#0F1214", fontWeight: 600 }}>Terms &amp; Conditions</a>
        </div>
      )}

      {/* Bottom padding so floater/sticky CTA doesn't overlap */}
      <div style={{ height: desktop ? 140 : 120 }} />
    </>
  );
}

// ---------- desktop layout ----------

function EventDetailsDesktop({ ev, type, onBack, ...detailState }) {
  const cta = useMemoED(() => {
    if (type === "single") return { price: ev.single.price, label: `Register · ${ev.single.price}` };
    if (type === "dropin") return { price: ev.dropIn.pricePerSession, label: `Register · ${ev.dropIn.pricePerSession} · 1 session` };
    if (type === "series") return { price: ev.series.totalPrice, label: `Register · ${ev.series.totalPrice} for ${ev.series.totalSessions} sessions` };
    if (detailState.hybridMode === "bundle") return { price: ev.hybrid.bundlePrice, label: `Register · ${ev.hybrid.bundlePrice} for all 5` };
    const n = detailState.hybridSelected.size;
    const total = n * 15;
    return { price: `$${total}.00`, label: n === 0 ? "Choose at least one date" : `Register · $${total}.00 for ${n} session${n > 1 ? "s" : ""}`, disabled: n === 0 };
  }, [type, detailState.hybridMode, detailState.hybridSelected && detailState.hybridSelected.size]);

  const subline = type === "series" ? `For all ${ev.series.totalSessions} sessions`
    : type === "hybrid" && detailState.hybridMode === "bundle" ? "Bundle price"
    : type === "hybrid" ? `${detailState.hybridSelected.size} session${detailState.hybridSelected.size !== 1 ? "s" : ""} selected`
    : "Cancel up to 4 hours before start time";

  return (
    <div style={{ background: "#fff", minHeight: 1900, fontFamily: "Inter, system-ui, sans-serif", position: "relative" }}>
      <TopBar />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "56px 32px 160px" }}>
        {/* Back link */}
        <button onClick={onBack} style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "transparent", border: 0, padding: 0, cursor: "pointer",
          color: "#4B5052", fontFamily: "inherit", fontSize: 13, fontWeight: 600, marginBottom: 24,
        }}>
          <Icon name="ArrowLeft" size={14} strokeWidth={2.2} />
          Back to events
        </button>

        <EventDetailBody ev={ev} type={type} viewport="desktop" {...detailState} />
      </div>

      {/* Bottom floater — sticky within page, floats above content as you scroll */}
      <div style={{
        position: "sticky", bottom: 16, marginTop: -88, zIndex: 30,
        display: "flex", justifyContent: "center", pointerEvents: "none", padding: "0 24px",
      }}>
        <div style={{
          pointerEvents: "auto",
          display: "flex", alignItems: "center", gap: 16,
          background: "#0F1214", color: "#fff",
          padding: "10px 10px 10px 24px", borderRadius: 999,
          boxShadow: "0 14px 40px rgba(15,18,20,.28), 0 2px 8px rgba(15,18,20,.18)",
          maxWidth: 720, width: "100%", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, minWidth: 0 }}>
            <span style={{ fontFamily: "Axiforma, Inter, system-ui, sans-serif", fontWeight: 800, fontSize: 16, letterSpacing: -0.2 }}>{cta.price}</span>
            <span style={{ fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,.7)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{subline}</span>
          </div>
          <button disabled={cta.disabled} onClick={() => !cta.disabled && detailState.onRegister && detailState.onRegister()} style={{
            display: "inline-flex", alignItems: "center", gap: 8, flexShrink: 0,
            height: 44, padding: "0 22px", borderRadius: 999, border: 0,
            background: cta.disabled ? "#3a3e42" : "#fff",
            color: cta.disabled ? "rgba(255,255,255,.5)" : "#0F1214",
            fontFamily: "inherit", fontWeight: 700, fontSize: 14,
            cursor: cta.disabled ? "not-allowed" : "pointer",
          }}>
            {cta.disabled ? "Choose a date" : "Register"}
            <Icon name="ArrowRight" size={14} color={cta.disabled ? "rgba(255,255,255,.5)" : "#0F1214"} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- mobile layout ----------

function EventDetailsMobile({ ev, type, onBack, ...detailState }) {
  const cta = useMemoED(() => {
    if (type === "single") return { price: ev.single.price, label: `Register · ${ev.single.price}` };
    if (type === "dropin") return { price: ev.dropIn.pricePerSession, label: `Register · ${ev.dropIn.pricePerSession}` };
    if (type === "series") return { price: ev.series.totalPrice, label: `Register · ${ev.series.totalPrice}` };
    if (detailState.hybridMode === "bundle") return { price: ev.hybrid.bundlePrice, label: `Register · ${ev.hybrid.bundlePrice}` };
    const n = detailState.hybridSelected.size;
    const total = n * 15;
    return { price: `$${total}.00`, label: n === 0 ? "Choose at least one date" : `Register · $${total}.00`, disabled: n === 0 };
  }, [type, detailState.hybridMode, detailState.hybridSelected && detailState.hybridSelected.size]);

  return (
    <div style={{ background: "#fff", minHeight: "100%", fontFamily: "Inter, system-ui, sans-serif", position: "relative" }}>
      {/* Mobile chrome: top bar */}
      <div style={{
        position: "sticky", top: 0, zIndex: 20,
        background: "#fff", borderBottom: "1px solid #E9EBEC",
        height: 52, display: "flex", alignItems: "center", padding: "0 16px", gap: 12,
      }}>
        <button onClick={onBack} style={{ background: "transparent", border: 0, padding: 8, marginLeft: -8, cursor: "pointer", display: "inline-flex" }}>
          <Icon name="ArrowLeft" size={20} />
        </button>
        <div style={{ flex: 1, textAlign: "center", fontFamily: "Axiforma, Inter, system-ui, sans-serif", fontWeight: 800, fontSize: 14, letterSpacing: 0.4 }}>Event</div>
        <button style={{ background: "transparent", border: 0, padding: 8, marginRight: -8, cursor: "pointer", display: "inline-flex" }}>
          <Icon name="Share" size={18} />
        </button>
      </div>

      <div style={{ padding: "24px 20px 24px" }}>
        <EventDetailBody ev={ev} type={type} viewport="mobile" {...detailState} />
      </div>

      {/* Sticky bottom CTA */}
      <div style={{
        position: "absolute", left: 0, right: 0, bottom: 0,
        background: "#fff", borderTop: "1px solid #E9EBEC",
        padding: "12px 16px 18px",
      }}>
        <button disabled={cta.disabled} onClick={() => !cta.disabled && detailState.onRegister && detailState.onRegister()} style={{
          width: "100%", height: 56, border: 0, borderRadius: 8,
          background: cta.disabled ? "#BBBFC1" : "#0F1214", color: "#fff",
          fontFamily: "inherit", fontWeight: 600, fontSize: 15,
          display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10,
          cursor: cta.disabled ? "not-allowed" : "pointer",
        }}>
          {cta.label}
          <Icon name="ArrowRight" size={16} color="#fff" strokeWidth={2.5} />
        </button>
        <div style={{ marginTop: 8, textAlign: "center", fontSize: 11, color: "#4B5052" }}>
          Cancel up to 4 hours before start time
        </div>
      </div>
    </div>
  );
}

// ---------- container with shared state ----------

function EventDetails({ ev, type = "single", viewport = "desktop", onBack, onRegister }) {
  const event = ev || window.DETAIL_EVENT;
  const [selectedDropIn, setSelectedDropIn] = useStateED(event.dropIn.dates[0].id);
  const [hybridMode, setHybridMode] = useStateED("single");
  const [hybridSelected, setHybridSelected] = useStateED(new Set([event.hybrid.dates[0].id, event.hybrid.dates[2].id]));

  const toggleHybrid = (id) => setHybridSelected(prev => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });
  const selectAllHybrid = () => setHybridSelected(new Set(event.hybrid.dates.map(d => d.id)));

  const detailState = {
    selectedDropIn, setSelectedDropIn,
    hybridMode, setHybridMode,
    hybridSelected, toggleHybrid, selectAllHybrid,
    onRegister,
  };

  if (viewport === "mobile") {
    return <EventDetailsMobile ev={event} type={type} onBack={onBack} {...detailState} />;
  }
  return <EventDetailsDesktop ev={event} type={type} onBack={onBack} {...detailState} />;
}

// ---------- artboard wrapper with type + device switcher ----------

function EventDetailsShowcase() {
  const [type, setType] = useStateED("single");
  const [viewport, setViewport] = useStateED("desktop");

  const types = [
    { id: "single", label: "Single date" },
    { id: "dropin", label: "Drop-in" },
    { id: "series", label: "Full series" },
    { id: "hybrid", label: "Hybrid" },
  ];
  const viewports = [
    { id: "desktop", label: "Desktop" },
    { id: "mobile",  label: "Mobile" },
  ];

  return (
    <div style={{ background: "#F4F5F6", minHeight: "100%", fontFamily: "Inter, system-ui, sans-serif", padding: "24px 0 48px" }}>
      {/* Switcher bar */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontFamily: "Axiforma, Inter, system-ui, sans-serif", fontWeight: 800, fontSize: 11, letterSpacing: 1.4, textTransform: "uppercase", color: "#4B5052", marginRight: 4 }}>Type</span>
          <div style={{ display: "inline-flex", padding: 4, background: "#fff", borderRadius: 8, border: "1px solid #E9EBEC" }}>
            {types.map(t => {
              const on = type === t.id;
              return (
                <button key={t.id} onClick={() => setType(t.id)} style={{
                  height: 32, padding: "0 14px", borderRadius: 8,
                  background: on ? "#0F1214" : "transparent",
                  color: on ? "#fff" : "#0F1214",
                  border: 0, cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: 600,
                  transition: "background 140ms, color 140ms",
                }}>{t.label}</button>
              );
            })}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontFamily: "Axiforma, Inter, system-ui, sans-serif", fontWeight: 800, fontSize: 11, letterSpacing: 1.4, textTransform: "uppercase", color: "#4B5052", marginRight: 4 }}>Device</span>
          <div style={{ display: "inline-flex", padding: 4, background: "#fff", borderRadius: 8, border: "1px solid #E9EBEC" }}>
            {viewports.map(v => {
              const on = viewport === v.id;
              return (
                <button key={v.id} onClick={() => setViewport(v.id)} style={{
                  height: 32, padding: "0 14px", borderRadius: 8,
                  background: on ? "#0F1214" : "transparent",
                  color: on ? "#fff" : "#0F1214",
                  border: 0, cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: 600,
                  transition: "background 140ms, color 140ms",
                  display: "inline-flex", alignItems: "center", gap: 6,
                }}>
                  <Icon name={v.id === "desktop" ? "Monitor" : "Smartphone"} size={12} color={on ? "#fff" : "#0F1214"} strokeWidth={2.2} />
                  {v.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Frame */}
      <div style={{ display: "flex", justifyContent: "center", padding: "0 32px" }}>
        {viewport === "desktop" ? (
          <div style={{ width: "100%", maxWidth: 1280, background: "#fff", boxShadow: "0 10px 40px rgba(0,0,0,.08)", borderRadius: 8, overflow: "hidden" }}>
            <EventDetails type={type} viewport="desktop" />
          </div>
        ) : (
          <div style={{ width: 390, height: 844, background: "#fff", borderRadius: 8, overflow: "hidden", boxShadow: "0 14px 50px rgba(0,0,0,.18)", position: "relative", border: "10px solid #0F1214" }}>
            <div style={{ height: "100%", overflowY: "auto" }}>
              <EventDetails type={type} viewport="mobile" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { EventDetails, EventDetailsShowcase });
