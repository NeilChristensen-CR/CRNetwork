// MyClubBookingPanel.jsx — single-club focused booking surface.
// Used in the "my club view" (branded experiences like Dill Dinkers,
// Old Coast). Replaces the multi-club BookNow carousel with one large
// card focused entirely on the player's primary club, since when you're
// in a branded app you already know which club you want to play at —
// the only question is when.
//
// Anatomy:
//   - Club identity header on the left: name, location, rating, member
//     tier badge.
//   - Day selector (Today / Tomorrow / pick a date).
//   - Time-of-day grouped slot grid on the right: Morning / Afternoon /
//     Evening, each with 3–4 large tappable slots showing the time +
//     courts free count. Slot taps drop straight into the customize
//     reservation modal pre-filled with the picked slot.
function MyClubBookingPanel({ theme, viewport = "desktop", club, onPickSlot, hideRail = false }) {
  const t = theme.t || {};
  const isMobile = viewport === "mobile";

  // ---- Default data — wired to a club object, with sensible fallbacks
  // so the component renders even on first drop without props plumbed.
  const c = club || {
    name: theme.logoText || "Old Coast Pickleball",
    city: theme.cityTag || "St. Augustine, FL",
    rating: 4.9,
    reviews: 471,
    tier: "Diamond",
    courts: 8,
    primary: theme.primary,
    accent: theme.accent,
  };

  // ---- Day picker state. 14 days out so the player can plan two weeks
  // ahead without leaving the dashboard.
  const days = (() => {
    const out = [];
    // Reference date Apr 4 (Thursday) to match the rest of the prototype.
    const dowAbbr = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const monthAbbr = "Apr";
    const startDow = 4; // Thu
    const startDate = 4;
    for (let i = 0; i < 14; i++) {
      const dow = dowAbbr[(startDow + i) % 7];
      const date = startDate + i;
      const label = i === 0 ? "Today" : i === 1 ? "Tomorrow" : dow;
      out.push({ id: `t+${i}`, label, date, dow, monthAbbr });
    }
    return out;
  })();
  const [day, setDay] = React.useState(days[0].id);
  // ---- Time-of-day filter + expanded-slot state ------------------
  // "any" is the default — we show every slot in a horizontal carousel
  // until the player narrows by period. Picking a specific period
  // collapses the carousel into a grid for that block of time.
  const [period, setPeriod] = React.useState("any");
  const [expandedSlot, setExpandedSlot] = React.useState(null);
  // Track the court the player has picked inside the expanded slot so we
  // can reveal a confirm-Book button below.
  const [pickedCourt, setPickedCourt] = React.useState(null);
  // Reset expansion + court selection whenever the day or period changes.
  React.useEffect(() => { setExpandedSlot(null); setPickedCourt(null); }, [day, period]);
  // Also reset court when the user clicks a different slot.
  React.useEffect(() => { setPickedCourt(null); }, [expandedSlot]);
  // Day strip ref + scroll state so we can offer a "Today" button that
  // returns to the start when the user has scrolled forward.
  const dayStripRef = React.useRef(null);
  const [stripScrolled, setStripScrolled] = React.useState(false);
  React.useEffect(() => {
    const el = dayStripRef.current; if (!el) return;
    const onScroll = () => setStripScrolled(el.scrollLeft > 12);
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);
  const goToToday = () => {
    setDay(days[0].id);
    const el = dayStripRef.current;
    if (el) el.scrollTo({ left: 0, behavior: "smooth" });
  };

  // ---- Slot data — grouped by time of day. Each slot carries an
  // explicit list of free courts so the click-to-expand panel can list
  // them by name. Slots with a single court go straight to checkout;
  // multi-court slots open an inline picker.
  const allSlots = {
    morning: [
      { time: "7:00 AM",  courts: ["Court 1", "Court 2", "Court 3", "Court 5", "Court 6", "Court 7", "Court 9", "Court 10", "Court 11", "Court 12"] },
      { time: "8:00 AM",  courts: ["Court 1", "Court 2", "Court 4", "Court 6", "Court 8", "Court 9", "Court 10", "Court 11"] },
      { time: "9:00 AM",  courts: ["Court 3", "Court 5", "Court 7", "Court 9", "Court 12"] },
      { time: "10:00 AM", courts: ["Court 2", "Court 4", "Court 6", "Court 8", "Court 9", "Court 10", "Court 11", "Court 12"] },
      { time: "11:00 AM", courts: ["Court 5", "Court 8", "Court 9", "Court 11"] },
    ],
    afternoon: [
      { time: "12:30 PM", courts: ["Court 1", "Court 4", "Court 6", "Court 8"] },
      { time: "1:30 PM",  courts: ["Court 1", "Court 2", "Court 5", "Court 6", "Court 8"] },
      { time: "2:30 PM",  courts: ["Court 2", "Court 4", "Court 7", "Court 8"] },
      { time: "3:30 PM",  courts: ["Court 6", "Court 8"] },
      { time: "4:30 PM",  courts: ["Court 8"] },
    ],
    evening: [
      { time: "5:30 PM",  courts: ["Court 7"] },
      { time: "6:30 PM",  courts: ["Court 3"] },
      { time: "7:30 PM",  courts: ["Court 4", "Court 7"] },
      { time: "8:30 PM",  courts: ["Court 2", "Court 5", "Court 8"] },
    ],
  };
  const periods = [
    { k: "any",       label: "Any time",   icon: "Clock" },
    { k: "morning",   label: "Morning",   icon: "Sunrise" },
    { k: "afternoon", label: "Afternoon", icon: "Sun" },
    { k: "evening",   label: "Evening",   icon: "Moon" },
  ];

  // Star icon row sized down to read as metadata.
  const stars = (() => {
    const full = Math.floor(c.rating);
    const half = c.rating - full >= 0.4 && c.rating - full < 0.9;
    const out = [];
    for (let i = 0; i < 5; i++) {
      let fill = "rgba(255,255,255,.25)";
      if (i < full) fill = "#FFD166";
      else if (i === full && half) fill = "#FFD166";
      out.push(
        <svg key={i} width="11" height="11" viewBox="0 0 24 24" fill={fill} style={{ flexShrink: 0 }}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77 5.82 21l1.18-6.88-5-4.87 6.91-1.01z" />
        </svg>
      );
    }
    return out;
  })();

  const pick = (timeLabel) => { onPickSlot && onPickSlot(timeLabel); };

  return (
    <div style={{ marginTop: 32 }}>
      {/* Section heading row — title left, metadata cluster right.
          The metadata (courts · open now · weather · active members)
          lives here so it reads as page-level context for the whole
          booking surface rather than chrome inside the booking card. */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 16, paddingBottom: 16, flexWrap: "wrap",
      }}>
        <h2 style={{
          margin: 0,
          fontFamily: theme.display, fontWeight: 800,
          fontSize: isMobile ? 22 : 28, lineHeight: 1.1, letterSpacing: -0.6,
          color: t.text,
        }}>Book a court at {c.name.split(" ").slice(0, 2).join(" ")}</h2>
        {/* Metadata cluster — right side of the heading row. */}
        <div style={{
          display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
          justifyContent: "flex-end",
          color: t.textMuted,
        }}>
          {/* Courts · open-now */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            fontSize: 12, color: t.textMuted, fontWeight: 500,
            whiteSpace: "nowrap",
          }}>
            {/* Courts count is hidden when the panel is embedded on a
                surface that already shows it (ClubDetail's CDQuickStats).
                Open-now count stays since it's a live booking signal. */}
            {!hideRail && (
              <React.Fragment>
                <span><b style={{ color: t.text, fontFamily: theme.display, fontWeight: 800, fontSize: 14, letterSpacing: -0.2, marginRight: 4 }}>{c.courts}</b>courts</span>
                <span style={{ width: 3, height: 3, borderRadius: 999, background: t.line }} />
              </React.Fragment>
            )}
            <span><b style={{ color: t.text, fontFamily: theme.display, fontWeight: 800, fontSize: 14, letterSpacing: -0.2, marginRight: 4 }}>14</b>open now</span>
          </div>
          {/* Weather */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            whiteSpace: "nowrap",
          }}>
            <Icon name="Sun" size={14} strokeWidth={2} color="#F2A93B" />
            <span style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 14, letterSpacing: -0.2, color: t.text }}>76°</span>
            <span style={{ width: 3, height: 3, borderRadius: 999, background: t.line }} />
            <span style={{ fontSize: 12, color: t.textMuted, fontWeight: 500 }}>Sunny</span>
          </div>
          {/* Active members — green pulsing status dot + count */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            whiteSpace: "nowrap",
          }}>
            <span style={{
              position: "relative", display: "inline-flex",
              width: 8, height: 8,
            }}>
              <span style={{
                position: "absolute", inset: 0, borderRadius: 999,
                background: "#1FA868",
                animation: "mcbpActivePulse 1.6s ease-out infinite",
              }} />
              <span style={{
                position: "absolute", inset: 0, borderRadius: 999,
                background: "#1FA868",
                boxShadow: "0 0 6px #1FA86866",
              }} />
            </span>
            <style>{`@keyframes mcbpActivePulse {
              0%   { transform: scale(1);   opacity: .7; }
              70%  { transform: scale(2.4); opacity: 0; }
              100% { transform: scale(2.4); opacity: 0; }
            }`}</style>
            <span style={{ fontSize: 12, color: t.textMuted, fontWeight: 500 }}>
              <b style={{ color: t.text, fontFamily: theme.display, fontWeight: 800, fontSize: 14, letterSpacing: -0.2, marginRight: 4 }}>8</b>
              Active Members
            </span>
          </div>
        </div>
      </div>

      {/* Booking card — clean white surface with a soft shadow. Body is
          a 2-column split: left holds the period radio + horizontal day
          picker; right holds the branching options (slot grid + court
          picker). Identity rail removed — the surrounding page already
          shows the club identity. */}
      <div style={{
        background: "#fff", color: t.text,
        borderRadius: 12, overflow: "hidden",
        border: `1px solid ${t.line}`,
        boxShadow: "0 6px 20px rgba(15,18,20,.06), 0 1px 2px rgba(15,18,20,.04)",
        display: "flex", flexDirection: "column",
        position: "relative",
      }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "280px 1fr",
      }}>
        {/* LEFT — When-pickers. Period radio stacked above the day strip. */}
        <div style={{
          background: "#FAFAFA",
          padding: isMobile ? "16px" : "20px 22px",
          display: "flex", flexDirection: "column", gap: 16,
          minWidth: 0, minHeight: 0,
          borderRight: isMobile ? "none" : `1px solid ${t.line}`,
          borderBottom: isMobile ? `1px solid ${t.line}` : "none",
        }}>
          <div>
            <div style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 10, letterSpacing: 1.2, textTransform: "uppercase", color: t.textSubtle, marginBottom: 8 }}>
              When
            </div>
            {/* Period radio — vertical stack of pills so each option
                gets a full line, matching how a radio-group should
                read. Selected state filled with theme.primary. */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {periods.map(p => {
                const on = period === p.k;
                return (
                  <button key={p.k} onClick={() => setPeriod(p.k)} style={{
                    height: 40, padding: "0 14px",
                    display: "inline-flex", alignItems: "center", gap: 10,
                    border: on ? `1.5px solid ${theme.primary}` : "1px solid #E9EBEC",
                    background: on ? theme.primary : "#fff",
                    color: on ? "#fff" : t.text,
                    fontFamily: "inherit", fontWeight: on ? 700 : 600,
                    fontSize: 13, letterSpacing: 0,
                    borderRadius: 8,
                    cursor: "pointer",
                    transition: "all 140ms",
                    textAlign: "left",
                  }}>
                    <Icon name={p.icon} size={14} strokeWidth={2} color={on ? "#fff" : t.textSubtle} />
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Day picker carousel — horizontal strip with Today-jump
              affordance pinned to the left. Pills are light fills on
              this white surface. minWidth:0 ensures the strip can shrink
              below its content width so overflow-x:auto actually scrolls
              instead of letting the flex column stretch to fit all 14
              days. */}
          <div style={{ minWidth: 0 }}>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              marginBottom: 8,
            }}>
              <div style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 10, letterSpacing: 1.2, textTransform: "uppercase", color: t.textSubtle }}>
                Day
              </div>
              {stripScrolled && (
                <button onClick={goToToday} style={{
                  height: 22, padding: "0 8px", borderRadius: 6,
                  border: "1px solid #E9EBEC", background: "#fff",
                  fontFamily: "inherit", fontWeight: 700, fontSize: 10, letterSpacing: 0.6, textTransform: "uppercase",
                  color: t.textMuted,
                  cursor: "pointer",
                }}>
                  Today
                </button>
              )}
            </div>
            <div ref={dayStripRef} style={{
              display: "flex", gap: 6,
              overflowX: "auto", scrollbarWidth: "none",
              paddingBottom: 4,
              maskImage: "linear-gradient(to right, #000 0, #000 calc(100% - 24px), transparent 100%)",
              WebkitMaskImage: "linear-gradient(to right, #000 0, #000 calc(100% - 24px), transparent 100%)",
            }}>
              {days.map(d => {
                const on = d.id === day;
                return (
                  <button key={d.id} onClick={() => setDay(d.id)} style={{
                    flex: "0 0 auto",
                    minWidth: 52,
                    height: 56,
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2,
                    padding: "0 10px",
                    borderRadius: 8,
                    border: on ? `1.5px solid ${theme.primary}` : "1px solid #E9EBEC",
                    background: on ? theme.primary : "#fff",
                    color: on ? "#fff" : t.text,
                    fontFamily: "inherit",
                    cursor: "pointer",
                    transition: "all 140ms",
                  }}>
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase", opacity: on ? 0.85 : 0.6 }}>{d.dow}</span>
                    <span style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 14, letterSpacing: -0.2 }}>{d.date}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT — Branching options. Slot list (carousel for Any, grid
            for specific period) + expanded court picker once a slot is
            tapped. Light theme, dark text. */}
        <div style={{ background: "#fff", display: "flex", flexDirection: "column", minWidth: 0, minHeight: 0 }}>
          {/* Slot list — "Any time" renders a horizontal carousel; a
              specific period collapses into a 5-up grid. Clicking a slot:
              • with one free court → expands and pre-selects that court.
              • with multiple free courts → expands so the player can pick
                a court below; the Book button appears once one is chosen. */}
          {(() => {
            const slots = period === "any"
              ? [...allSlots.morning, ...allSlots.afternoon, ...allSlots.evening]
              : (allSlots[period] || []);
            const isCarousel = period === "any";
            const renderSlotButton = (s) => {
              const free = s.courts.length;
              const tight = free <= 1;
              const open = expandedSlot === s.time;
              return (
                <button key={s.time}
                  onClick={() => {
                    if (open) { setExpandedSlot(null); return; }
                    setExpandedSlot(s.time);
                    // Auto-select the only court when there's just one.
                    if (free === 1) setPickedCourt(s.courts[0]);
                  }}
                  style={{
                  flex: isCarousel ? "0 0 110px" : "unset",
                  minWidth: 0,
                    height: 56,
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2,
                    padding: "0 8px",
                    borderRadius: 8,
                    border: open ? `1.5px solid ${theme.primary}` : "1px solid #E9EBEC",
                    background: open ? theme.primary : "#fff",
                    color: open ? "#fff" : t.text,
                    cursor: "pointer", fontFamily: "inherit",
                    transition: "all 140ms",
                  }}
                  onMouseEnter={(e) => {
                    if (open) return;
                    e.currentTarget.style.background = "#F4F5F6";
                    e.currentTarget.style.borderColor = "#0F1214";
                  }}
                  onMouseLeave={(e) => {
                    if (open) return;
                    e.currentTarget.style.background = "#fff";
                    e.currentTarget.style.borderColor = "#E9EBEC";
                  }}
                >
                  <span style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 13, letterSpacing: -0.2 }}>{s.time}</span>
                  <span style={{
                    fontSize: 9, fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase",
                    color: "currentColor", opacity: tight ? 1 : 0.55,
                  }}>
                    {tight ? `${free} left` : `${free} free`}
                  </span>
                </button>
              );
            };
            if (isCarousel) {
              return (
                <div style={{
                  padding: isMobile ? "16px 16px" : "20px 24px",
                  display: "flex", gap: 8, overflowX: "auto", scrollbarWidth: "none",
                  maskImage: "linear-gradient(to right, #000 0, #000 calc(100% - 32px), transparent 100%)",
                  WebkitMaskImage: "linear-gradient(to right, #000 0, #000 calc(100% - 32px), transparent 100%)",
                }}>
                  {slots.map(renderSlotButton)}
                </div>
              );
            }
            return (
              <div style={{
                padding: isMobile ? "16px 16px" : "20px 24px",
                display: "grid",
                gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(5, 1fr)",
                gap: 8,
              }}>
                {slots.map(renderSlotButton)}
              </div>
            );
          })()}

          {/* Expanded court picker + Book button. Appears when a slot is
              selected. Player picks a court (auto-selected if only one),
              then a Book button slides in to confirm. */}
          {(() => {
            const allList = [...allSlots.morning, ...allSlots.afternoon, ...allSlots.evening];
            const sel = allList.find(s => s.time === expandedSlot);
            if (!sel) return null;
            return (
              <div style={{
                borderTop: `1px solid ${t.line}`,
                /* Bottom padding accommodates the floating Book pill —
                   only inflated when a court is actually picked so the
                   panel doesn't read as empty space at rest. */
                padding: isMobile
                  ? (pickedCourt ? "16px 16px 80px" : "16px 16px")
                  : (pickedCourt ? "20px 24px 96px" : "20px 24px"),
                display: "flex", flexDirection: "column", gap: 12,
                animation: "mcbpSlideIn 220ms ease",
              }}>
                <style>{`@keyframes mcbpSlideIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }`}</style>
                {/* Court picker — horizontal carousel so a slot with
                    many free courts can show all of them without
                    wrapping into a tall grid. Right-edge fade mask hints
                    that more cards are scrollable into view. */}
                <div style={{
                  display: "flex", gap: 8,
                  overflowX: "auto", scrollbarWidth: "none",
                  marginLeft: isMobile ? -16 : -24,
                  marginRight: isMobile ? -16 : -24,
                  paddingLeft: isMobile ? 16 : 24,
                  paddingRight: isMobile ? 16 : 24,
                  maskImage: "linear-gradient(to right, #000 0, #000 calc(100% - 32px), transparent 100%)",
                  WebkitMaskImage: "linear-gradient(to right, #000 0, #000 calc(100% - 32px), transparent 100%)",
                }}>
                  {sel.courts.map(court => {
                    const on = pickedCourt === court;
                    return (
                      <button key={court}
                        onClick={() => setPickedCourt(on ? null : court)}
                        style={{
                          flex: "0 0 auto",
                          minWidth: 132,
                          height: 44, padding: "0 14px",
                          display: "inline-flex", alignItems: "center", justifyContent: "space-between", gap: 8,
                          borderRadius: 8,
                          border: on ? `1.5px solid ${theme.primary}` : "1px solid #E9EBEC",
                          background: on ? theme.primary : "#fff",
                          color: on ? "#fff" : t.text,
                          fontFamily: "inherit", fontWeight: 600, fontSize: 12,
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                          transition: "all 140ms",
                        }}
                        onMouseEnter={(e) => {
                          if (on) return;
                          e.currentTarget.style.background = "#F4F5F6";
                          e.currentTarget.style.borderColor = "#0F1214";
                        }}
                        onMouseLeave={(e) => {
                          if (on) return;
                          e.currentTarget.style.background = "#fff";
                          e.currentTarget.style.borderColor = "#E9EBEC";
                        }}>
                        {court}
                        {on && <Icon name="Check" size={12} strokeWidth={2.6} color="#fff" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </div>
      </div>
      {/* Floating Book button — appears at the bottom of the booking
          container once a court is picked. Positioned absolute so it
          floats over the slot grid; brand-gradient background for high
          contrast; center-aligned. */}
      {(() => {
        if (!pickedCourt || !expandedSlot) return null;
        const sel = days.find(x => x.id === day);
        const dateLabel = sel ? `${sel.dow}, ${sel.monthAbbr} ${sel.date}` : "";
        return (
          <div style={{
            position: "absolute", left: 0, right: 0, bottom: 0, zIndex: 5,
            padding: isMobile ? "16px 16px 16px" : "20px 24px 20px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            gap: 12, flexWrap: "wrap",
            pointerEvents: "none",
            background: `linear-gradient(to top, rgba(255,255,255,.98) 0%, rgba(255,255,255,.92) 60%, rgba(255,255,255,0) 100%)`,
            animation: "mcbpSlideIn 220ms ease",
          }}>
            {/* Reservation summary — left-aligned, sits outside the
                button so the booking metadata reads as plain text
                independent of the action. */}
            <span style={{
              pointerEvents: "auto",
              fontSize: 13, fontWeight: 600, letterSpacing: 0.2,
              color: t.text,
              whiteSpace: "nowrap",
            }}>
              {dateLabel} · {expandedSlot} · {pickedCourt}
            </span>
            <button onClick={() => pick(`${expandedSlot} · ${pickedCourt}`)} style={{
              pointerEvents: "auto",
              height: 48, padding: "0 24px", borderRadius: 8, border: 0,
              /* Use the active theme's primary (brand) color so this
                 button reads as the same family as other main CTAs on
                 the page. White text on a deep brand background passes
                 WCAG AA for large text. */
              background: theme.primary,
              color: "#fff",
              fontFamily: "inherit", fontWeight: 700, fontSize: 14, letterSpacing: 0.2,
              cursor: "pointer",
              display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
              boxShadow: "0 4px 12px rgba(15,18,20,.18)",
              transition: "transform 140ms, box-shadow 140ms, filter 140ms",
              whiteSpace: "nowrap",
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(15,18,20,.28)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(15,18,20,.18)";
              }}>
              Continue booking
              <Icon name="ArrowRight" size={14} strokeWidth={2.6} color="#fff" />
            </button>
          </div>
        );
      })()}
      </div>
    </div>
  );
}

window.MyClubBookingPanel = MyClubBookingPanel;
