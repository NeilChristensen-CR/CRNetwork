// RecurringCarousel.jsx — horizontal scrolling shelf of ongoing/recurring events.
// Lives between "Next week" and "Next month" on the events list so a 5-week
// series doesn't repeat across every weekly bucket.

const { useRef: useRefRC, useState: useStateRC, useEffect: useEffectRC } = React;

function RecurringCard({ ev, onClick, viewport = "desktop" }) {
  const [hover, setHover] = useStateRC(false);
  const urg = window.urgencyOf && window.urgencyOf(ev);
  const compact = viewport === "mobile";
  const typeLabel = {
    series: "Full series",
    hybrid: "Series + drop-in",
    dropin: "Drop-in",
  }[ev.type] || "Recurring";

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
      style={{
        flex: compact ? "0 0 260px" : "0 0 320px",
        scrollSnapAlign: "start",
        cursor: "pointer",
        background: hover ? "#0F1214" : "#fff",
        color: hover ? "#fff" : "#0F1214",
        border: "1px solid " + (hover ? "#0F1214" : "#E9EBEC"),
        borderRadius: 8,
        padding: compact ? "18px 18px 16px" : "22px 22px 20px",
        transition: "background 160ms, color 160ms, border-color 160ms, transform 160ms",
        transform: hover ? "translateY(-2px)" : "translateY(0)",
        display: "flex", flexDirection: "column",
        minHeight: compact ? 200 : 224,
        position: "relative",
      }}
    >
      {/* Eyebrow: cadence + type pill */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <span style={{
          fontFamily: "Axiforma", fontWeight: 800, fontSize: 10, letterSpacing: 1.4,
          textTransform: "uppercase", color: hover ? "rgba(255,255,255,.65)" : "#858F8F",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>{ev.cadence}</span>
        <span style={{
          display: "inline-flex", alignItems: "center", height: 20, padding: "0 8px",
          background: hover ? "#fff" : "#0F1214", color: hover ? "#0F1214" : "#fff",
          borderRadius: 8,
          fontFamily: "Axiforma", fontSize: 9, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase",
          flexShrink: 0,
        }}>{typeLabel}</span>
      </div>

      {/* Title */}
      <div style={{
        marginTop: 14,
        fontFamily: "Axiforma", fontWeight: 700,
        fontSize: compact ? 18 : 20, lineHeight: compact ? "22px" : "24px",
        letterSpacing: -0.3,
        // 2-line clamp
        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
        overflow: "hidden",
      }}>{ev.name}</div>

      {/* Meta */}
      <div style={{
        marginTop: 8, fontSize: 12,
        color: hover ? "rgba(255,255,255,.7)" : "#4B5052",
        fontWeight: 500,
        display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap",
      }}>
        <span>{ev.timeShort}</span>
        <span style={{ width: 3, height: 3, borderRadius: 999, background: hover ? "rgba(255,255,255,.4)" : "#BBBFC1" }} />
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 140 }}>{ev.coach}</span>
      </div>

      {/* Bottom row: price + urgency / next session count */}
      <div style={{ marginTop: "auto", paddingTop: 18, display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12 }}>
        <div>
          <div style={{ fontFamily: "Axiforma", fontWeight: 800, fontSize: compact ? 22 : 24, letterSpacing: -0.4, lineHeight: 1 }}>
            {ev.priceLabel}
          </div>
          <div style={{ marginTop: 4, fontSize: 11, color: hover ? "rgba(255,255,255,.6)" : "#858F8F", fontWeight: 500 }}>
            {ev.nextSessions ? `${ev.nextSessions} upcoming` : ev.runningSince}
          </div>
        </div>
        {urg ? (
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 4,
            fontSize: 10, fontWeight: 800, letterSpacing: 0.6, textTransform: "uppercase",
            color: urg.tone === "alert" ? "#E11D2A" : urg.tone === "warn" ? "#C77700" : (hover ? "#fff" : "#0F1214"),
          }}>
            {urg.live && window.LiveDot && <window.LiveDot tone={urg.tone} />}
            {urg.text}
          </span>
        ) : ev.going > 0 ? (
          <span style={{
            fontSize: 11, fontWeight: 600,
            color: hover ? "rgba(255,255,255,.7)" : "#4B5052",
            marginBottom: 4,
          }}>{ev.going} going</span>
        ) : null}
      </div>
    </div>
  );
}

function RecurringCarousel({ items, onSelect, viewport = "desktop", first = false }) {
  const trackRef = useRefRC(null);
  const [canPrev, setCanPrev] = useStateRC(false);
  const [canNext, setCanNext] = useStateRC(true);

  const updateArrows = () => {
    const el = trackRef.current; if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffectRC(() => {
    updateArrows();
    const el = trackRef.current; if (!el) return;
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, []);

  const scrollBy = (dir) => {
    const el = trackRef.current; if (!el) return;
    const step = Math.round(el.clientWidth * 0.85);
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  const desktop = viewport === "desktop";

  return (
    /* Mobile cuts the section top-padding roughly in half — the page is
       narrow so 56px reads as a giant gap between sections, while desktop
       still benefits from the breathing room. */
    <div style={{ paddingTop: first ? 0 : (desktop ? 56 : 32) }}>
      {/* Header — mobile shrinks the spacing and stacks the meta line so
         the title gets its full row instead of competing with "join
         anytime" + count on a single squished line. */}
      <div style={{
        display: "flex", alignItems: "baseline", justifyContent: "space-between",
        gap: 12,
        paddingBottom: desktop ? 16 : 12,
        borderBottom: "1px solid #E9EBEC",
        flexWrap: desktop ? "nowrap" : "nowrap",
      }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: desktop ? 12 : 8, minWidth: 0 }}>
          <h2 style={{ fontFamily: "Axiforma", fontWeight: 800, fontSize: desktop ? 14 : 11, letterSpacing: 1.2, textTransform: "uppercase", color: "#0F1214", margin: 0, whiteSpace: "nowrap" }}>
            Ongoing & recurring
          </h2>
          <span style={{ fontSize: desktop ? 12 : 11, color: "#4B5052", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            join anytime
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
          <div style={{ fontSize: desktop ? 13 : 11, color: "#858F8F", fontWeight: 500 }}>{items.length}</div>
          {desktop && (
            <div style={{ display: "inline-flex", gap: 6 }}>
              <button onClick={() => scrollBy(-1)} disabled={!canPrev} aria-label="Previous" style={{
                width: 32, height: 32, borderRadius: 999, border: "1px solid #DEE1E5",
                background: "#fff", cursor: canPrev ? "pointer" : "not-allowed",
                opacity: canPrev ? 1 : 0.35,
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                transition: "opacity 160ms",
              }}>
                <Icon name="ChevronLeft" size={14} strokeWidth={2.4} />
              </button>
              <button onClick={() => scrollBy(1)} disabled={!canNext} aria-label="Next" style={{
                width: 32, height: 32, borderRadius: 999, border: "1px solid #DEE1E5",
                background: "#fff", cursor: canNext ? "pointer" : "not-allowed",
                opacity: canNext ? 1 : 0.35,
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                transition: "opacity 160ms",
              }}>
                <Icon name="ChevronRight" size={14} strokeWidth={2.4} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Track — on mobile, negative side margins let the cards bleed to
         the page edge so the right-most card hints at "more to scroll",
         and the first card aligns with the rest of the page content. */}
      <div ref={trackRef} style={{
        marginTop: desktop ? 20 : 14,
        marginLeft: desktop ? 0 : -24,
        marginRight: desktop ? 0 : -24,
        paddingLeft: desktop ? 0 : 24,
        paddingRight: desktop ? 0 : 24,
        display: "flex", gap: 12,
        overflowX: "auto", scrollSnapType: "x mandatory",
        paddingBottom: desktop ? 12 : 4,
        scrollbarWidth: "none",
        WebkitOverflowScrolling: "touch",
      }}>
        <style>{`.rc-track::-webkit-scrollbar { display: none; }`}</style>
        {items.map(ev => (
          <RecurringCard key={ev.id} ev={ev} viewport={viewport} onClick={() => onSelect && onSelect(ev)} />
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { RecurringCarousel, RecurringCard });
