// EventCard.jsx — Uber-minimal row with engagement: live urgency, going count, hover-reveal CTA.
const { useState: useStateEC } = React;

function urgencyOf(ev) {
  if (ev.spotsLeft === 0) return { text: "Waitlist", tone: "bold" };
  if (ev.spotsLeft === 1) return { text: "1 spot left", tone: "alert", live: true };
  if (ev.spotsLeft <= 3) return { text: `${ev.spotsLeft} spots left`, tone: "alert", live: true };
  if (ev.spotsLeft / ev.spotsTotal < 0.4) return { text: "Filling fast", tone: "warn", live: true };
  return null;
}

function GoingStack({ friends = [], total }) {
  if (!total) return null;
  const shown = friends.slice(0, 3);
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <div style={{ display: "inline-flex" }}>
        {shown.map((init, i) => (
          <div key={i} style={{
            width: 22, height: 22, borderRadius: 999, background: i % 2 === 0 ? "#0F1214" : "#4B5052",
            color: "#fff", fontSize: 9, fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center",
            border: "2px solid #fff", marginLeft: i === 0 ? 0 : -8, fontFamily: "Axiforma, Inter, system-ui, sans-serif",
          }}>{init}</div>
        ))}
        {shown.length === 0 && (
          <div style={{ width: 22, height: 22, borderRadius: 999, background: "#0F1214", color: "#fff", fontSize: 9, fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "Axiforma, Inter, system-ui, sans-serif" }}>{total}</div>
        )}
      </div>
      <div style={{ fontSize: 12, color: "#4B5052", fontWeight: 500 }}>{total} going</div>
    </div>
  );
}

function LiveDot({ tone = "alert" }) {
  const color = tone === "alert" ? "#E11D2A" : "#C77700";
  return (
    <span style={{ position: "relative", display: "inline-block", width: 8, height: 8 }}>
      <span style={{ position: "absolute", inset: 0, borderRadius: 8, background: color, animation: "pulse 1.6s ease-out infinite" }} />
      <span style={{ position: "absolute", inset: 0, borderRadius: 8, background: color }} />
    </span>
  );
}

function EventCard({ ev, onClick, theme }) {
  const t = (theme && theme.t) || {surface:"#fff",surfaceSoft:"#F4F5F6",text:"#0F1214",textMuted:"#4B5052",textSubtle:"#858F8F",line:"#E9EBEC",rule:"#0F1214"};
  const [hover, setHover] = useStateEC(false);
  const urg = urgencyOf(ev);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
      style={{
        padding: "22px 16px 22px 0",
        borderBottom: `1px solid ${t.line}`,
        cursor: "pointer",
        display: "grid",
        gridTemplateColumns: "112px 1fr auto",
        gap: 28,
        alignItems: "center",
        background: hover ? t.surfaceSoft : "transparent",
        transition: "background 120ms",
        position: "relative",
      }}
    >
      <div>
        <div style={{ fontFamily: "Axiforma, Inter, system-ui, sans-serif", fontWeight: 700, fontSize: 22, lineHeight: "26px", color: t.text, letterSpacing: -0.4 }}>{ev.timeShort}</div>
        <div style={{ marginTop: 4, fontSize: 12, color: t.textMuted, fontWeight: 500 }}>{ev.dateShort}</div>
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <div style={{ fontFamily: "Axiforma, Inter, system-ui, sans-serif", fontWeight: 700, fontSize: 20, lineHeight: "24px", color: t.text, letterSpacing: -0.3 }}>{ev.name}</div>
          {urg && (
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              fontSize: 11, fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase",
              color: urg.tone === "alert" ? "#E11D2A" : urg.tone === "warn" ? "#C77700" : "#0F1214",
            }}>
              {urg.live && <LiveDot tone={urg.tone} />}
              {urg.text}
            </span>
          )}
        </div>
        <div style={{ marginTop: 6, fontSize: 13, color: t.textMuted, fontWeight: 500, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          {ev.club && (
            <>
              <ClubTag club={ev.club} color={ev.clubColor || "#0F1214"} variant="tag" />
              {!ev.myClub && <span style={{ fontSize: 11, color: t.textSubtle, fontWeight: 500 }}>(guest)</span>}
              <span style={{ width: 3, height: 3, borderRadius: 999, background: "#BBBFC1" }} />
            </>
          )}
          <span>{ev.format} · {ev.skill}</span>
          <span style={{ width: 3, height: 3, borderRadius: 999, background: "#BBBFC1" }} />
          <span>{ev.coach}</span>
          {ev.going > 0 && (
            <>
              <span style={{ width: 3, height: 3, borderRadius: 999, background: "#BBBFC1" }} />
              <GoingStack friends={ev.friends} total={ev.going} />
            </>
          )}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 20, position: "relative" }}>
        <div style={{ fontFamily: "Axiforma, Inter, system-ui, sans-serif", fontWeight: 700, fontSize: 20, color: t.text, minWidth: 44, textAlign: "right", letterSpacing: -0.3 }}>{ev.priceLabel}</div>
        {/* Reserve button slides in on hover */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          height: 40, padding: hover ? "0 18px" : 0,
          width: hover ? "auto" : 40,
          background: (theme && theme.dark) ? theme.primary : "#0F1214", color: "#fff", borderRadius: 8,
          overflow: "hidden", whiteSpace: "nowrap",
          transition: "padding 180ms cubic-bezier(.2,.8,.2,1), width 180ms cubic-bezier(.2,.8,.2,1)",
          justifyContent: "center",
        }}>
          {hover && <span style={{ fontFamily: "inherit", fontWeight: 600, fontSize: 13 }}>Reserve</span>}
          <Icon name="ArrowRight" size={14} color="#fff" strokeWidth={2.5} />
        </div>
      </div>
    </div>
  );
}

function HeroSlide({ ev, hover, setHover, onClick }) {
  // Default neutral palette — HeroSlide is the only event-list component
  // that gets called without a theme prop, so we drop in the same fallback
  // shape EventCard uses to keep the rendered colors consistent.
  const t = { surface: "#fff", surfaceSoft: "#F4F5F6", text: "#0F1214", textMuted: "#4B5052", textSubtle: "#858F8F", line: "#E9EBEC", rule: "#0F1214" };
  // Title sizing: long titles step down so they don't blow out the grid.
  const len = (ev.name || "").length;
  const titleSize = len > 28 ? 40 : len > 18 ? 48 : 56;
  const titleLh = Math.round(titleSize * 1.04);

  const meta = [
    `${ev.timeShort} · ${ev.dateShort}`,
    ev.skill,
    ev.coach,
    ev.court,
  ].filter(Boolean);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
      style={{
        flex: "0 0 100%",
        cursor: onClick ? "pointer" : "default",
        background: "#0F1214", color: "#fff",
        padding: "36px 44px 64px", position: "relative", overflow: "hidden",
        cursor: "pointer", borderRadius: 8,
        minHeight: 296,
        display: "flex", flexDirection: "column",
      }}
    >
      <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: "44%", opacity: 0.10,
        background: "radial-gradient(circle at 70% 50%, #fff 0%, transparent 60%)", pointerEvents: "none" }} />

      {/* Eyebrow */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
        {ev.spotsLeft <= 3 && <LiveDot tone="alert" />}
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.4, textTransform: "uppercase", color: "#fff" }}>
          {ev.heroLabel || (ev.spotsLeft === 1 ? `${ev.dateShort || "Tonight"} · 1 spot left` : `${ev.dateShort || "Today"} · ${ev.spotsLeft} spots left`)}
        </span>
      </div>

      {/* Body */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) auto", columnGap: 40, alignItems: "flex-end", flex: 1 }}>
        <div style={{ minWidth: 0 }}>
          <h2 style={{
            margin: 0,
            fontFamily: "Axiforma, Inter, system-ui, sans-serif", fontWeight: 800,
            fontSize: titleSize, lineHeight: `${titleLh}px`, letterSpacing: -1.4,
            color: "#fff",
            textWrap: "balance",
            wordBreak: "break-word",
            maxWidth: "100%",
          }}>
            {ev.name}.
          </h2>

          <div style={{
            marginTop: 14, fontSize: 13, color: "#BBBFC1", fontWeight: 500,
            display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
            lineHeight: "20px",
          }}>
            {meta.map((m, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span style={{ width: 3, height: 3, borderRadius: 999, background: "#4B5052", flexShrink: 0 }} />}
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 220 }}>{m}</span>
              </React.Fragment>
            ))}
          </div>

          {ev.going > 0 && (
            <div style={{ marginTop: 18, display: "inline-flex", alignItems: "center", gap: 10 }}>
              <div style={{ display: "inline-flex" }}>
                {(ev.friends || []).slice(0, 4).map((init, i) => (
                  <div key={i} style={{
                    width: 26, height: 26, borderRadius: 999, background: i % 2 === 0 ? "#fff" : "#BBBFC1",
                    color: t.text, fontSize: 10, fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center",
                    border: "2px solid #0F1214", marginLeft: i === 0 ? 0 : -10, fontFamily: "Axiforma, Inter, system-ui, sans-serif",
                  }}>{init}</div>
                ))}
              </div>
              <span style={{ fontSize: 12, color: "#fff", fontWeight: 500 }}>
                {ev.going} going{(ev.friends || []).length ? ` · ${(ev.friends || []).length} friends` : ""}
              </span>
            </div>
          )}
        </div>

        <div style={{ textAlign: "right", flexShrink: 0, alignSelf: "flex-end" }}>
          <div style={{ fontFamily: "Axiforma, Inter, system-ui, sans-serif", fontWeight: 800, fontSize: 36, color: "#fff", letterSpacing: -0.8, lineHeight: 1 }}>{ev.priceLabel}</div>
          <button style={{
            marginTop: 14, height: 48, padding: "0 24px", borderRadius: 8, border: 0,
            background: "#fff", color: t.text, fontFamily: "inherit", fontWeight: 600, fontSize: 14, cursor: "pointer",
            display: "inline-flex", alignItems: "center", gap: 10,
            transform: hover ? "translateX(-2px)" : "translateX(0)", transition: "transform 180ms",
          }}>
            {ev.spotsLeft === 1 ? "Grab the last spot" : "Reserve"}
            <Icon name="ArrowRight" size={14} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}

function HeroEvent({ ev }) {
  const [hover, setHover] = useStateEC(false);
  const [idx, setIdx] = useStateEC(0);

  // Build carousel: featured hero first, then any other "today" events
  // sourced from SAMPLE_EVENTS so the carousel is content-driven.
  const slides = React.useMemo(() => {
    const todays = (window.SAMPLE_EVENTS || [])
      .filter(e => e.when === "today" && e.id !== "e4")
      .map(e => ({ ...e, court: e.court || "Old Coast Pickleball" }));
    return [ev, ...todays];
  }, [ev]);

  const count = slides.length;
  const prev = () => setIdx((i) => (i - 1 + count) % count);
  const next = () => setIdx((i) => (i + 1) % count);

  // Auto-advance every 6s, pause on hover.
  React.useEffect(() => {
    if (hover || count <= 1) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % count), 6000);
    return () => clearInterval(id);
  }, [hover, count]);

  return (
    <div style={{ position: "relative", marginTop: 40 }}>
      <div style={{ overflow: "hidden", borderRadius: 8 }}>
        <div style={{
          display: "flex",
          transform: `translateX(-${idx * 100}%)`,
          transition: "transform 360ms cubic-bezier(.2,.8,.2,1)",
        }}>
          {slides.map((s, i) => (
            <HeroSlide key={s.id || i} ev={s} hover={hover && i === idx} setHover={setHover}
              onClick={() => window.__openEventDetail && window.__openEventDetail(s.type || "hybrid")} />
          ))}
        </div>
      </div>

      {/* Carousel controls — top-right of the slab, white-on-black to match */}
      {count > 1 && (
        <div style={{ position: "absolute", top: 24, right: 24, display: "inline-flex", gap: 8 }}>
          <button onClick={prev} aria-label="Previous" style={{
            width: 36, height: 36, borderRadius: 999, border: "1px solid rgba(255,255,255,.24)",
            background: "rgba(255,255,255,.06)", color: "#fff", cursor: "pointer",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            backdropFilter: "blur(6px)",
          }}>
            <Icon name="ChevronLeft" size={16} color="#fff" strokeWidth={2.4} />
          </button>
          <button onClick={next} aria-label="Next" style={{
            width: 36, height: 36, borderRadius: 999, border: "1px solid rgba(255,255,255,.24)",
            background: "rgba(255,255,255,.06)", color: "#fff", cursor: "pointer",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            backdropFilter: "blur(6px)",
          }}>
            <Icon name="ChevronRight" size={16} color="#fff" strokeWidth={2.4} />
          </button>
        </div>
      )}

      {/* Pagination — bottom center */}
      {count > 1 && (
        <div style={{
          position: "absolute", bottom: 22, left: "50%", transform: "translateX(-50%)",
          display: "inline-flex", alignItems: "center", gap: 8,
        }}>
          {slides.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)} aria-label={`Go to slide ${i + 1}`} style={{
              width: i === idx ? 22 : 6, height: 6, borderRadius: 999, padding: 0, border: 0, cursor: "pointer",
              background: i === idx ? "#fff" : "rgba(255,255,255,.32)",
              transition: "width 240ms cubic-bezier(.2,.8,.2,1), background 200ms",
            }} />
          ))}
        </div>
      )}
    </div>
  );
}

Object.assign(window, { EventCard, HeroEvent, GoingStack, LiveDot, urgencyOf });
