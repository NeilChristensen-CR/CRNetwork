// ClubDetail.jsx — Club detail page, aligned with event details direction.
// Now includes (per the inspiration screenshots): photo carousel with
// verified-on-CourtReserve badge, dual top CTAs, map placeholder, quick-stat
// cards, social-proof callouts (friends here / your history), real court
// availability grid with sport filter, players-you-might-know, upcoming
// events/leagues, pros + programs, amenities as icon cards, and an
// affiliate-badge footer.

const { useState: useStateCD, useMemo: useMemoCD } = React;

// ── shared building blocks ────────────────────────────────────────────────
function CDSectionHead({ children, sub, action, theme }) {
  // Aligned with the homepage's ListSectionHeader pattern: uppercase
  // title eyebrow + extending hairline rule + optional count/action on
  // the right. Replaces the heavier 20px-bold display heading so the
  // page reads as a sibling of the dashboard.
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 8, paddingBottom: 14, marginBottom: 8 }}>
      <span style={{
        fontFamily: theme.display, fontWeight: 800,
        fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase",
        color: "var(--pp-fg-default)", whiteSpace: "nowrap"
      }}>{children}</span>
      <span style={{ flex: 1, height: 1, background: "var(--pp-border-subtle)" }} aria-hidden="true" />
      {sub && <span style={{ fontSize: 12, color: "var(--pp-fg-subtle)", fontWeight: 500, whiteSpace: "nowrap" }}>{sub}</span>}
      {action}
    </div>);

}

function CDDivider({ mt = 40, mb = 28 }) {
  return <div style={{ height: 1, background: "var(--pp-border-subtle)", marginTop: mt, marginBottom: mb }} />;
}

// ── Photo carousel — main image + thumbnail strip below for navigation.
// Verified pill stays anchored to the top-left of the main image.
function CDPhotoCarousel({ club, theme }) {
  const [idx, setIdx] = useStateCD(0);
  const slides = club.photos || [
  { bg: club.color, tone: "#7CE0B5" },
  { bg: "var(--pp-fg-default)", tone: "#FFDA44" },
  { bg: theme.primary, tone: theme.accent || "var(--pp-bg-default)" },
  { bg: "var(--pp-blue-600)", tone: "#8AB6FF" }];

  return (
    <div>
      {/* Main image — 16:9 placeholder with a neutral background and a
                  centered "image off" icon to signal missing user-generated photo. */}
      <div style={{
        position: "relative",
        aspectRatio: "16 / 9",
        borderRadius: 8, overflow: "hidden",
        background: "var(--pp-bg-subtle)",
        display: "flex", alignItems: "center", justifyContent: "center"
      }}>
        <Icon name="ImageOff" size={36} color="var(--pp-fg-subtle)" strokeWidth={1.6} />
      </div>

      {/* Thumbnail strip on the left, Verified tag on the right — a
                  balanced row that pairs the photo navigation with the trust
                  signal underneath the main image. */}
      <div style={{ marginTop: 10, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div style={{ display: "flex", gap: 6, overflowX: "auto", scrollbarWidth: "none", minWidth: 0 }}>
          {slides.map((s, i) => {
            const on = i === idx;
            return (
              <button key={i} onClick={() => setIdx(i)} aria-label={`Photo ${i + 1}`} style={{
                flex: "0 0 auto",
                width: 40, height: 40, padding: 0,
                borderRadius: 8,
                border: on ? "2px solid var(--pp-fg-default)" : "1px solid var(--pp-border-subtle)",
                background: "var(--pp-bg-subtle)",
                color: "var(--pp-fg-subtle)",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer",
                opacity: on ? 1 : 0.7,
                transition: "all 140ms"
              }}
              onMouseEnter={(e) => {if (!on) e.currentTarget.style.opacity = 1;}}
              onMouseLeave={(e) => {if (!on) e.currentTarget.style.opacity = 0.7;}}>
                <Icon name="ImageOff" size={14} color="var(--pp-fg-subtle)" strokeWidth={1.6} />
              </button>);

          })}
        </div>
        {/* Verified badge removed here — already shown in the title row
                    opposite the club name, so showing it again under the photo
                    carousel doubles the trust signal. */}
      </div>
    </div>);

}

// ── Map card — 3:1 map tile + address + Get directions / Call / Email
// actions. Sized to sit opposite the club description in a two-column
// info row. Replaces the centered single-row map placeholder.
function CDMapCard({ club, theme }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", gap: 10
    }}>
      {/* Map tile — 8px radius, no outer card stroke; map sits as its
                  own bordered tile so the surrounding contact stack reads as a
                  plain content column instead of a wrapper card. */}
      <div style={{
        position: "relative",
        aspectRatio: "3 / 2",
        borderRadius: 8,
        border: "1px solid var(--pp-border-subtle)",
        background: theme.softTint || "#E7F2EC",
        overflow: "hidden"
      }}>
        <svg width="100%" height="100%" viewBox="0 0 300 200" preserveAspectRatio="none"
        style={{ position: "absolute", inset: 0, opacity: 0.22 }}>
          <defs>
            <pattern id="cd-mapgrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke={theme.primary} strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="300" height="200" fill="url(#cd-mapgrid)" />
          <path d="M 0 120 Q 90 80, 180 140 T 300 100" stroke={theme.primary} strokeWidth="2" fill="none" opacity="0.55" />
          <path d="M 0 60 Q 100 140, 200 40 T 300 160" stroke={theme.primary} strokeWidth="1.5" fill="none" opacity="0.35" />
        </svg>
        {/* Centered pin */}
        <div style={{
          position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -55%)",
          width: 36, height: 36, borderRadius: "50% 50% 50% 0",
          background: theme.primary,
          rotate: "-45deg",
          boxShadow: "0 2px 6px rgba(15,18,20,.35), 0 0 0 2px #fff",
          display: "inline-flex", alignItems: "center", justifyContent: "center"
        }}>
          <span style={{ rotate: "45deg", fontFamily: theme.display, fontWeight: 800, fontSize: 11, color: "var(--pp-bg-default)" }}>{club.logoMark}</span>
        </div>
      </div>

      {/* Address — plain typography below the map, no card wrapper. */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "2px 2px" }}>
        <Icon name="MapPin" size={14} color={theme.primary} strokeWidth={2.2} />
        <span style={{ fontSize: 13, color: "var(--pp-fg-default)", fontWeight: 600, lineHeight: 1.4 }}>{club.address}</span>
      </div>

      {/* Get directions — quiet outline action so it doesn't compete
                  with the brand-colored "Become a member" CTA up top. */}
      <button style={{
        height: 38, padding: "0 14px", borderRadius: 8,
        border: "1px solid var(--pp-border-subtle)", background: "var(--pp-bg-default)", color: "var(--pp-fg-default)",
        fontFamily: "inherit", fontWeight: 600, fontSize: 12, cursor: "pointer",
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
        transition: "border-color 120ms"
      }}
      onMouseEnter={(e) => {e.currentTarget.style.borderColor = "var(--pp-fg-default)";}}
      onMouseLeave={(e) => {e.currentTarget.style.borderColor = "var(--pp-border-subtle)";}}>
        Get directions
        <Icon name="ArrowUpRight" size={12} color="var(--pp-fg-default)" strokeWidth={2.2} />
      </button>

      {/* Secondary actions — Call / Email as a 1:1 outline pair below. */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8
      }}>
        <button style={{
          height: 38, padding: "0 12px", borderRadius: 8,
          border: "1px solid var(--pp-border-subtle)", background: "var(--pp-bg-default)", color: "var(--pp-fg-default)",
          display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
          fontFamily: "inherit", fontWeight: 600, fontSize: 12, cursor: "pointer",
          transition: "border-color 120ms"
        }}
        onMouseEnter={(e) => {e.currentTarget.style.borderColor = "var(--pp-fg-default)";}}
        onMouseLeave={(e) => {e.currentTarget.style.borderColor = "var(--pp-border-subtle)";}}>
          <Icon name="Phone" size={12} strokeWidth={2.2} color="var(--pp-fg-default)" />
          Call
        </button>
        <button style={{
          height: 38, padding: "0 12px", borderRadius: 8,
          border: "1px solid var(--pp-border-subtle)", background: "var(--pp-bg-default)", color: "var(--pp-fg-default)",
          display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
          fontFamily: "inherit", fontWeight: 600, fontSize: 12, cursor: "pointer",
          transition: "border-color 120ms"
        }}
        onMouseEnter={(e) => {e.currentTarget.style.borderColor = "var(--pp-fg-default)";}}
        onMouseLeave={(e) => {e.currentTarget.style.borderColor = "var(--pp-border-subtle)";}}>
          <Icon name="Mail" size={12} strokeWidth={2.2} color="var(--pp-fg-default)" />
          Email
        </button>
      </div>

      {/* Tertiary actions — Share / Favorite. Ghost text-link styling
                  (no border) so they read as quieter affordances under the
                  primary contact pair. */}
      <div style={{
        marginTop: 2, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8
      }}>
        <button style={{
          height: 32, padding: 0, border: 0, background: "transparent",
          display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
          color: "var(--pp-fg-muted)", fontFamily: "inherit", fontWeight: 600, fontSize: 12,
          cursor: "pointer", transition: "color 120ms"
        }}
        onMouseEnter={(e) => {e.currentTarget.style.color = "var(--pp-fg-default)";}}
        onMouseLeave={(e) => {e.currentTarget.style.color = "var(--pp-fg-muted)";}}>
          <Icon name="Share2" size={12} strokeWidth={2.2} color="currentColor" />
          Share
        </button>
        <button style={{
          height: 32, padding: 0, border: 0, background: "transparent",
          display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
          color: "var(--pp-fg-muted)", fontFamily: "inherit", fontWeight: 600, fontSize: 12,
          cursor: "pointer", transition: "color 120ms"
        }}
        onMouseEnter={(e) => {e.currentTarget.style.color = "var(--pp-fg-default)";}}
        onMouseLeave={(e) => {e.currentTarget.style.color = "var(--pp-fg-muted)";}}>
          <Icon name="Heart" size={12} strokeWidth={2.2} color="currentColor" />
          Save
        </button>
      </div>
    </div>);

}

// ── Friends-here + times-played social cards ────────────────────────────
// Two compact cards that sit under the QuickStats dashboard. Each carries
// a single quick-scan stat (count or trend) with the supporting visual
// (avatar stack or trend chip) anchored below the headline number.
function CDFriendsHereCard({ club, theme }) {
  const friends = club.friendsHere || [
  { i: "MR", c: theme.primary },
  { i: "SC", c: "var(--pp-blue-600)" },
  { i: "DP", c: "#D6573B" },
  { i: "EJ", c: "#8E5BE8" },
  { i: "TO", c: "#C77700" }];

  const total = club.friendsHereTotal || 12;
  return (
    <div style={{
      padding: "18px 20px", borderRadius: 8,
      background: "var(--pp-bg-default)", border: "1px solid var(--pp-border-subtle)",
      display: "flex", flexDirection: "column", gap: 12
    }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        <span style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 26, color: "var(--pp-fg-default)", letterSpacing: -0.5, lineHeight: 1 }}>{total}</span>
        <span style={{ fontFamily: theme.display, fontWeight: 700, fontSize: 13, color: "var(--pp-fg-default)" }}>friends played here</span>
      </div>
      <div style={{ display: "inline-flex", alignItems: "center" }}>
        {friends.slice(0, 5).map((f, i) =>
        <span key={i} style={{
          width: 32, height: 32, borderRadius: 999,
          background: f.c, color: "var(--pp-bg-default)",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          fontFamily: theme.display, fontWeight: 800, fontSize: 11,
          border: "2px solid #fff",
          marginLeft: i === 0 ? 0 : -10,
          boxShadow: "0 1px 2px rgba(15,18,20,.08)"
        }}>{f.i}</span>
        )}
        {total > 5 &&
        <span style={{
          width: 32, height: 32, borderRadius: 999,
          background: "var(--pp-bg-subtle)", color: "var(--pp-fg-muted)",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          fontFamily: theme.display, fontWeight: 800, fontSize: 11,
          border: "2px solid #fff", marginLeft: -10
        }}>+{total - 5}</span>
        }
      </div>
    </div>);

}

function CDTimesPlayedCard({ club, theme }) {
  const times = club.timesPlayed || 24;
  const deltaDupr = club.duprDelta != null ? club.duprDelta : 0.3;
  const up = deltaDupr > 0;
  const same = deltaDupr === 0;
  return (
    <div style={{
      padding: "18px 20px", borderRadius: 8,
      background: "var(--pp-bg-default)", border: "1px solid var(--pp-border-subtle)",
      display: "flex", flexDirection: "column", gap: 12
    }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        <span style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 26, color: "var(--pp-fg-default)", letterSpacing: -0.5, lineHeight: 1 }}>{times}</span>
        <span style={{ fontFamily: theme.display, fontWeight: 700, fontSize: 13, color: "var(--pp-fg-default)" }}>times played here</span>
      </div>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 4,
          height: 24, padding: "0 8px", borderRadius: 8,
          background: same ? "var(--pp-bg-subtle)" : up ? "#E7F2EC" : "#FDE7E9",
          color: same ? "var(--pp-fg-muted)" : up ? "#1F8A5B" : "#C72530",
          fontFamily: theme.display, fontWeight: 800, fontSize: 11, letterSpacing: 0.2
        }}>
          <Icon name={same ? "Minus" : up ? "TrendingUp" : "TrendingDown"} size={11} strokeWidth={2.6} color="currentColor" />
          {same ? "—" : `${up ? "+" : ""}${deltaDupr.toFixed(1)}`}
        </span>
        <span style={{ fontSize: 12, color: "var(--pp-fg-muted)", fontWeight: 500 }}>
          DUPR {up ? "trending up" : same ? "steady" : "trending down"} since joining
        </span>
      </div>
    </div>);

}

// ── Quick stats — four soft cards (Courts / Hours / Price / Rating) ─────
function CDQuickStats({ club, theme }) {
  const t = theme.t || {};
  // Aligned with the dashboard's KPIStrip pattern: 4-col grid with
  // top/bottom hairlines and inter-cell dividers, large display number
  // on top, uppercase label, then a quiet subtle line.
  const items = [
  { k: `${club.courts}`, v: "Courts", delta: `${club.indoor || 3} indoor · ${club.outdoor || 5} outdoor` },
  { k: club.hoursToday || "6–9:30 PM", v: "Hours", delta: club.hoursTodaySub || "Open today" },
  { k: `$${club.priceRange || "35"}`, v: "Per hour", delta: "Member rate" },
  { k: club.rating.toFixed(1), v: "Rating", delta: `${club.reviews} reviews` }];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0, borderTop: "1px solid var(--pp-border-subtle)", borderBottom: "1px solid var(--pp-border-subtle)" }}>
      {items.map((s, i) =>
      <div key={s.v} style={{
        padding: "22px 24px",
        borderRight: i < items.length - 1 ? "1px solid var(--pp-border-subtle)" : 0
      }}>
          <div style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 28, color: "var(--pp-fg-default)", letterSpacing: -0.5, lineHeight: 1 }}>{s.k}</div>
          <div style={{ marginTop: 10, fontSize: 11, color: "var(--pp-fg-default)", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>{s.v}</div>
          <div style={{ marginTop: 4, fontSize: 12, color: "var(--pp-fg-subtle)", fontWeight: 500 }}>{s.delta}</div>
        </div>
      )}
    </div>);

}

// ── Network metadata strip — three clickable action buttons. Each opens
// a fly-out menu with the deeper context (friends list, matched players,
// visit history). Replaces the static metadata band so the network
// signals double as entry points.
function CDNetworkMeta({ club, theme }) {
  const [openIdx, setOpenIdx] = useStateCD(null);
  const wrapRef = React.useRef(null);
  React.useEffect(() => {
    if (openIdx === null) return;
    const onDoc = (e) => {if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpenIdx(null);};
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [openIdx]);

  const friends = club.friends || [
  { i: "MR", c: theme.primary, name: "Marcus Reyes", meta: "Plays Tue/Thu · NTRP 4" },
  { i: "SC", c: theme.primary, name: "Sarah Chen", meta: "Plays weekends · NTRP 3.5" },
  { i: "DP", c: theme.primary, name: "David Park", meta: "Plays Mon evenings · NTRP 4.25" }];

  const matches = (club.matchedPlayersList || [
  { i: "EJ", name: "Emma Johnson", meta: "3 matches together · 2-1 record" },
  { i: "TO", name: "Tim Owens", meta: "5 matches together · 3-2 record" },
  { i: "AM", name: "Ana Martinez", meta: "1 match · last Thursday" }]).
  slice(0, 12);
  const visits = club.recentVisits || [
  { date: "3 days ago", meta: "Singles · 1.5 hrs · Court 4" },
  { date: "1 week ago", meta: "Doubles · 1 hr · Court 2" },
  { date: "2 weeks ago", meta: "Drill clinic · 1 hr · Court 1" }];


  const actions = [
  {
    k: friends.length,
    label: "friends play here",
    avatars: friends.slice(0, 3),
    panelTitle: "Friends who play here",
    rows: friends.map((f, k) => ({ key: k, avatar: f.i, color: f.c, name: f.name, meta: f.meta }))
  },
  {
    k: club.matchesAreMembers || matches.length,
    label: "of your matches are members",
    icon: "Users",
    panelTitle: "Players you've matched with",
    rows: matches.map((m, k) => ({ key: k, avatar: m.i, color: theme.primary, name: m.name, meta: m.meta }))
  }];

  if (club.joined) {
    actions.push({
      k: club.timesPlayed || 24,
      label: `times you've played · last ${club.lastVisit || "3 days ago"}`,
      icon: "Clock",
      panelTitle: "Recent visits",
      rows: visits.map((v, k) => ({ key: k, name: v.date, meta: v.meta }))
    });
  }

  return (
    <div ref={wrapRef} style={{
      marginTop: 16,
      position: "relative",
      display: "grid", gridTemplateColumns: `repeat(${actions.length}, 1fr)`, gap: 8
    }}>
      {actions.map((a, i) => {
        const open = openIdx === i;
        return (
          <div key={i} style={{ position: "relative" }}>
            <button onClick={() => setOpenIdx(open ? null : i)} style={{
              width: "100%", height: "100%", textAlign: "left",
              display: "flex", alignItems: "center", gap: 10,
              padding: "14px 16px", borderRadius: 8,
              background: open ? "var(--pp-bg-default)" : "var(--pp-bg-subtle)",
              border: 0,
              boxShadow: open ?
              "0 8px 24px rgba(15,18,20,.12), 0 2px 6px rgba(15,18,20,.06)" :
              "0 1px 3px rgba(15,18,20,.06)",
              transform: open ? "translateY(-2px)" : "translateY(0)",
              fontFamily: "inherit", cursor: "pointer",
              transition: "background 140ms, box-shadow 200ms, transform 200ms"
            }}
            onMouseEnter={(e) => {
              if (open) return;
              e.currentTarget.style.background = "var(--pp-border-subtle)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(15,18,20,.12), 0 2px 6px rgba(15,18,20,.06)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              if (open) return;
              e.currentTarget.style.background = "var(--pp-bg-subtle)";
              e.currentTarget.style.boxShadow = "0 1px 3px rgba(15,18,20,.06)";
              e.currentTarget.style.transform = "translateY(0)";
            }}>
              {a.avatars ?
              <div style={{ display: "inline-flex", flexShrink: 0 }}>
                  {a.avatars.map((av, k) =>
                <span key={k} style={{
                  width: 22, height: 22, borderRadius: 999,
                  background: av.c, color: "var(--pp-bg-default)",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  fontFamily: theme.display, fontWeight: 800, fontSize: 9,
                  border: "2px solid #fff",
                  marginLeft: k === 0 ? 0 : -8
                }}>{av.i}</span>
                )}
                </div> :

              <Icon name={a.icon} size={14} color="var(--pp-fg-muted)" strokeWidth={2} />
              }
              <span style={{ flex: 1, minWidth: 0, fontSize: 13, color: "var(--pp-fg-muted)", fontWeight: 500, lineHeight: 1.35 }}>
                <b style={{ color: "var(--pp-fg-default)", fontFamily: theme.display, fontWeight: 800, marginRight: 5 }}>{a.k}</b>
                {a.label}
              </span>
              <Icon name="ChevronDown" size={12} strokeWidth={2.4} color="var(--pp-fg-subtle)" style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 180ms", flexShrink: 0 }} />
            </button>
            {open &&
            <div style={{
              position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 30,
              background: "var(--pp-bg-default)", border: "1px solid var(--pp-border-subtle)", borderRadius: 8,
              boxShadow: "0 12px 32px rgba(15,18,20,.12), 0 2px 6px rgba(15,18,20,.04)",
              padding: 8,
              maxHeight: 320, overflowY: "auto",
              animation: "cdNetMetaIn 180ms ease"
            }}>
                <style>{`@keyframes cdNetMetaIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }`}</style>
                <div style={{ padding: "4px 8px 8px", fontSize: 10, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", color: "var(--pp-fg-subtle)" }}>
                  {a.panelTitle}
                </div>
                {a.rows.map((row) =>
              <button key={row.key} style={{
                width: "100%", display: "flex", alignItems: "center", gap: 10,
                padding: "10px 8px", border: 0, background: "transparent",
                borderRadius: 8, cursor: "pointer", fontFamily: "inherit", textAlign: "left",
                transition: "background 120ms"
              }}
              onMouseEnter={(e) => {e.currentTarget.style.background = "var(--pp-bg-subtle)";}}
              onMouseLeave={(e) => {e.currentTarget.style.background = "transparent";}}>
                    {row.avatar &&
                <span style={{
                  width: 28, height: 28, borderRadius: 999,
                  background: row.color || theme.primary, color: "var(--pp-bg-default)",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  fontFamily: theme.display, fontWeight: 800, fontSize: 10, flexShrink: 0
                }}>{row.avatar}</span>
                }
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontFamily: theme.display, fontWeight: 700, fontSize: 13, color: "var(--pp-fg-default)", letterSpacing: -0.2 }}>{row.name}</div>
                      <div style={{ marginTop: 1, fontSize: 11, color: "var(--pp-fg-subtle)", fontWeight: 500 }}>{row.meta}</div>
                    </div>
                    <Icon name="ChevronRight" size={12} strokeWidth={2.2} color="var(--pp-fg-subtle)" />
                  </button>
              )}
              </div>
            }
          </div>);

      })}
    </div>);

}

// ── Friends-play-here callout ────────────────────────────────────────────
function CDFriendsCallout({ club, theme }) {
  const friends = club.friends || [
  { i: "MR", c: theme.primary },
  { i: "SC", c: theme.primary },
  { i: "DP", c: theme.primary }];

  return (
    <button style={{
      width: "100%", padding: "14px 18px", borderRadius: 8,
      background: "var(--pp-bg-default)", border: "1px solid var(--pp-border-subtle)", cursor: "pointer",
      display: "flex", alignItems: "center", gap: 14, fontFamily: "inherit", textAlign: "left"
    }}>
      <div style={{ display: "inline-flex" }}>
        {friends.slice(0, 3).map((f, i) =>
        <span key={i} style={{
          width: 28, height: 28, borderRadius: 999,
          background: f.c, color: "var(--pp-bg-default)",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          fontFamily: theme.display, fontWeight: 800, fontSize: 10,
          border: "2px solid #fff", marginLeft: i === 0 ? 0 : -10
        }}>{f.i}</span>
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: theme.display, fontWeight: 700, fontSize: 14, color: "var(--pp-fg-default)", letterSpacing: -0.2 }}>{friends.length} friends play here</div>
        <div style={{ fontSize: 11, color: "var(--pp-fg-subtle)", fontWeight: 500, marginTop: 1 }}>{club.matchesAreMembers || 12} of your matches are members</div>
      </div>
      <Icon name="ChevronRight" size={14} color="var(--pp-fg-subtle)" strokeWidth={2.2} />
    </button>);

}

// ── Your-history callout ────────────────────────────────────────────────
function CDHistoryCallout({ club, theme }) {
  if (!club.joined) return null;
  return (
    <div style={{
      padding: "14px 18px", borderRadius: 8,
      background: theme.softTint || "#E7F2EC",
      display: "flex", flexDirection: "column"
    }}>
      <div style={{ fontFamily: theme.display, fontWeight: 700, fontSize: 14, color: theme.primary, letterSpacing: -0.2 }}>You've played here {club.timesPlayed || 24} times</div>
      <div style={{ fontSize: 11, color: theme.primary, opacity: 0.8, fontWeight: 500, marginTop: 2 }}>Last visit: {club.lastVisit || "3 days ago"} · Member since {club.memberSince || 2024}</div>
    </div>);

}

// ── Court availability grid (sport filter pills + 3-col card grid) ──────
function CDCourtAvailability({ club, theme }) {
  const [sport, setSport] = useStateCD("all");
  const courts = club.availability || [
  { id: 1, sport: "pickleball", name: "Court 1", time: "10:00 AM", duration: "1 hr", format: "Singles / Doubles", price: 35, status: "open" },
  { id: 2, sport: "pickleball", name: "Court 2", time: "10:30 AM", duration: "1 hr", format: "Open Play", price: 35, status: "open" },
  { id: 3, sport: "tennis", name: "Court A", time: "11:00 AM", duration: "1 hr", format: "Singles / Doubles", price: 35, status: "taken" },
  { id: 4, sport: "tennis", name: "Court B", time: "11:00 AM", duration: "1 hr", format: "Singles", price: 35, status: "open" },
  { id: 5, sport: "pickleball", name: "Court 3", time: "12:00 PM", duration: "1 hr", format: "Doubles", price: 35, status: "open" },
  { id: 6, sport: "tennis", name: "Court C", time: "1:00 PM", duration: "1 hr", format: "Singles / Doubles", price: 35, status: "taken" }];

  const sports = [{ k: "all", l: "All" }, { k: "tennis", l: "Tennis" }, { k: "pickleball", l: "Pickleball" }];
  const filtered = sport === "all" ? courts : courts.filter((c) => c.sport === sport);
  return (
    <div>
      <CDSectionHead theme={theme} sub={club.todayDate || "Sun, May 11"}>Reserve a court — Available today</CDSectionHead>

      {/* Sport filter pills */}
      <div style={{ display: "inline-flex", padding: 3, background: "var(--pp-bg-default)", border: "1px solid var(--pp-border-subtle)", borderRadius: 8, gap: 2, marginBottom: 14 }}>
        {sports.map((s) => {
          const on = sport === s.k;
          return (
            <button key={s.k} onClick={() => setSport(s.k)} style={{
              height: 32, padding: "0 14px", borderRadius: 8, border: 0,
              background: on ? theme.primary : "transparent",
              color: on ? "var(--pp-bg-default)" : "var(--pp-fg-default)",
              fontFamily: "inherit", fontWeight: on ? 700 : 600, fontSize: 12, cursor: "pointer",
              whiteSpace: "nowrap"
            }}>{s.l}</button>);

        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
        {filtered.map((c) => {
          const taken = c.status === "taken";
          return (
            <div key={c.id} style={{
              padding: "14px 16px 12px", borderRadius: 8,
              background: "var(--pp-bg-default)", border: "1px solid var(--pp-border-subtle)",
              opacity: taken ? 0.55 : 1,
              display: "flex", flexDirection: "column", gap: 8
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 11, letterSpacing: 0.4, textTransform: "uppercase", color: theme.primary }}>{c.sport === "tennis" ? "Tennis" : "Pickleball"}</span>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.6, textTransform: "uppercase", color: taken ? "var(--pp-fg-subtle)" : "#1F8A5B" }}>{taken ? "Taken" : "Open"}</span>
              </div>
              <div>
                <div style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 16, color: "var(--pp-fg-default)", letterSpacing: -0.3 }}>{c.name}</div>
                <div style={{ fontSize: 11, color: "var(--pp-fg-muted)", fontWeight: 500, marginTop: 2 }}>{c.time} · {c.duration}</div>
                <div style={{ fontSize: 11, color: "var(--pp-fg-subtle)", fontWeight: 500 }}>{c.format}</div>
              </div>
              <div style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontFamily: theme.display, fontWeight: 700, fontSize: 13, color: "var(--pp-fg-default)" }}>${c.price}/hr</span>
                {!taken &&
                <button style={{
                  height: 28, padding: "0 14px", borderRadius: 8, border: 0,
                  background: theme.primary, color: "var(--pp-bg-default)",
                  fontFamily: "inherit", fontWeight: 700, fontSize: 11, cursor: "pointer"
                }}>Reserve</button>
                }
              </div>
            </div>);

        })}
      </div>
    </div>);

}

// ── Players-you-might-know — 3-col member cards ─────────────────────────
function CDPlayersYouMightKnow({ club, theme, desktop }) {
  // Each player carries a short reason explaining WHY the system is
  // surfacing them — keeps the recommendation honest and gives the user
  // a clear filter for who to reach out to first.
  const players = club.suggestedPlayers || [
  { avatar: "MR", name: "Marcus Reyes", level: "NTRP 4", reasonIcon: "Users", reason: "Same regulars as you" },
  { avatar: "SC", name: "Sarah Chen", level: "NTRP 3.5", reasonIcon: "Clock", reason: "Plays your usual times" },
  { avatar: "DP", name: "David Park", level: "NTRP 4.25", reasonIcon: "Target", reason: "Same rating · same level" },
  { avatar: "EJ", name: "Emma Johnson", level: "NTRP 4.5", reasonIcon: "TrendingUp", reason: "Stretch your game" }];

  // Cap at 4 since the row is fixed at 4 columns on desktop, 2 on mobile.
  const shown = players.slice(0, 4);
  return (
    <div>
      <CDSectionHead theme={theme} sub={`Members at ${club.shortName || club.name}`}>Players you might know</CDSectionHead>
      <div style={{
        display: "grid",
        gridTemplateColumns: desktop ? "repeat(4, 1fr)" : "repeat(2, 1fr)",
        gap: 10
      }}>
        {shown.map((p) =>
        <button key={p.name} style={{
          padding: "14px 16px", borderRadius: 8,
          background: "var(--pp-bg-default)", border: "1px solid var(--pp-border-subtle)", cursor: "pointer",
          display: "flex", flexDirection: "column", gap: 8, alignItems: "stretch",
          fontFamily: "inherit", textAlign: "left",
          transition: "border-color 120ms, box-shadow 120ms"
        }}
        onMouseEnter={(e) => {e.currentTarget.style.borderColor = "var(--pp-border-default)";e.currentTarget.style.boxShadow = "0 2px 8px rgba(15,18,20,.06)";}}
        onMouseLeave={(e) => {e.currentTarget.style.borderColor = "var(--pp-border-subtle)";e.currentTarget.style.boxShadow = "none";}}>
            {/* Identity: avatar + name + level */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
              <span style={{
              width: 36, height: 36, borderRadius: 999, background: theme.primary, color: "var(--pp-bg-default)",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              fontFamily: theme.display, fontWeight: 800, fontSize: 12, flexShrink: 0
            }}>{p.avatar}</span>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: theme.display, fontWeight: 700, fontSize: 14, color: "var(--pp-fg-default)", letterSpacing: -0.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
                <div style={{ marginTop: 1, fontSize: 11, fontWeight: 700, color: theme.primary }}>{p.level}</div>
              </div>
            </div>

            {/* Why suggested — soft tinted callout so the reason reads as
            the system's recommendation logic, not a label. */}
            <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "6px 10px", borderRadius: 8,
            background: theme.softTint || "var(--pp-bg-subtle)",
            fontSize: 11, color: theme.primary, fontWeight: 600,
            lineHeight: 1.3
          }}>
              <Icon name={p.reasonIcon} size={11} color={theme.primary} strokeWidth={2.4} />
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0 }}>{p.reason}</span>
            </div>
          </button>
        )}
      </div>
    </div>);

}

// ── Upcoming events & leagues — reuses the homepage's EventCard so this
// list reads exactly like the event feed at the bottom of the dashboard.
function CDUpcomingEvents({ club, theme }) {
  // Fall back to SAMPLE_EVENTS so this list looks and feels like the
  // homepage's event list at the bottom — tagged with this club's
  // identity so the EventCard's club pill shows the right name. If a
  // club provides its own upcoming events array, that wins.
  const all = club.upcomingEvents || (window.SAMPLE_EVENTS || []).slice(0, 5);
  // Stripping club metadata: this list lives on the club detail page so
  // every event is implicitly at this club — surfacing the club pill on
  // each row would be redundant.
  const events = all.map((e) => ({
    ...e,
    club: null,
    clubColor: null,
    myClub: false,
    myClub: e.myClub !== undefined ? e.myClub : true
  }));
  const EventCardCmp = window.EventCard;
  if (!EventCardCmp) return null;
  return (
    <div>
      <CDSectionHead theme={theme}>Upcoming events & leagues</CDSectionHead>
      <div>
        {events.map((ev) =>
        <EventCardCmp key={ev.id} ev={ev} theme={theme}
        onClick={() => window.__openEventDetail && window.__openEventDetail(ev.type || "hybrid")} />
        )}
      </div>
    </div>);

}

// ── Pros & Programs — rich coach cards + recurring programs list ────────
function CDProsPrograms({ club, theme }) {
  const coaches = club.coachesDetailed || [
  { avatar: "CR", name: "Coach Rodriguez", credential: "Tennis · USPTA Level 2", rating: 4.9, blurb: "12 years coaching. Specializes in adult development and competitive juniors." },
  { avatar: "CH", name: "Coach Henderson", credential: "Pickleball · PPR Certified", rating: 4.7, blurb: "Former collegiate tennis player turned pickleball coach. 4.5+ DUPR." },
  { avatar: "CP", name: "Coach Patel", credential: "Tennis + Pickleball · USPTA, PPR", rating: 4.8, blurb: "Dual-certified coach. Great for players transitioning between sports." }];

  const programs = club.programs || [
  { icon: "Users", name: "Wednesday Night Drills", schedule: "Wed 7–9pm · All levels", price: "$20/session" },
  { icon: "Users", name: "Junior Tennis Academy", schedule: "Tue & Thu 4–6pm · Ages 8–16", price: "$150/month" },
  { icon: "Users", name: "Morning Coffee + Pickleball", schedule: "Mon/Wed/Fri 8–10am · Recreational", price: "$15/session" }];

  return (
    <div>
      <CDSectionHead theme={theme}>Pros &amp; programs</CDSectionHead>

      {/* Coaches — horizontal scrolling carousel of fixed-width cards,
                  matching the homepage's PeopleSegment/MatchesSegment pattern.
                  Negative side margins let the carousel bleed to the content
                  edges; cards inside snap-align to start. */}
      <div style={{
        display: "flex", gap: 12, overflowX: "auto", scrollSnapType: "x mandatory",
        scrollbarWidth: "none",
        paddingBottom: 4,
        margin: "0 -4px",
        paddingLeft: 4,
        paddingRight: 4
      }}>
        {coaches.map((c) =>
        <div key={c.name} style={{
          flex: "0 0 300px",
          scrollSnapAlign: "start",
          padding: "16px 18px", borderRadius: 8,
          background: "var(--pp-bg-default)", border: "1px solid var(--pp-border-subtle)",
          display: "flex", flexDirection: "column", gap: 8
        }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
              <span style={{ width: 36, height: 36, borderRadius: 999, background: theme.primary, color: "var(--pp-bg-default)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: theme.display, fontWeight: 800, fontSize: 11, flexShrink: 0 }}>{c.avatar}</span>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                <Icon name="Star" size={12} color="#F2A93B" strokeWidth={2.2} />
                <span style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 13, color: "var(--pp-fg-default)", fontVariantNumeric: "tabular-nums" }}>{c.rating}</span>
              </div>
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontFamily: theme.display, fontWeight: 700, fontSize: 15, color: "var(--pp-fg-default)", letterSpacing: -0.2 }}>{c.name}</div>
              <div style={{ marginTop: 2, fontSize: 11, fontWeight: 600, color: theme.primary }}>{c.credential}</div>
              <div style={{ marginTop: 8, fontSize: 12, color: "var(--pp-fg-muted)", fontWeight: 500, lineHeight: 1.45 }}>{c.blurb}</div>
            </div>
            {/* Action row — More info (ghost) + Book a lesson (primary).
            Two-button grid so the secondary "view profile" action
            sits left of the primary book CTA on each coach card. */}
            <div style={{ marginTop: 4, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
              <button style={{
              height: 36, padding: "0 12px", borderRadius: 8,
              border: "1px solid var(--pp-border-subtle)", background: "var(--pp-bg-default)", color: "var(--pp-fg-default)",
              fontFamily: "inherit", fontWeight: 600, fontSize: 12, cursor: "pointer",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              transition: "border-color 120ms"
            }}
            onMouseEnter={(e) => {e.currentTarget.style.borderColor = "var(--pp-fg-default)";}}
            onMouseLeave={(e) => {e.currentTarget.style.borderColor = "var(--pp-border-subtle)";}}>
                More info
              </button>
              <button style={{
              height: 36, padding: "0 12px", borderRadius: 8, border: 0,
              background: "var(--pp-fg-default)", color: "var(--pp-bg-default)",
              fontFamily: "inherit", fontWeight: 600, fontSize: 12, cursor: "pointer",
              display: "inline-flex", alignItems: "center", justifyContent: "center"
            }}>
                Book a lesson
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Programs — patterned after EventCard rows from the event list:
                  left time column with day-of-week + time, middle name + meta,
                  right price + black hover-reveal Reserve button. Reads as a
                  sibling of the event list rather than a custom card layout. */}
      <div style={{ marginTop: 24 }}>
        {programs.map((p, i) =>
        <CDProgramRow key={p.name} p={p} theme={theme} last={i === programs.length - 1} />
        )}
      </div>
    </div>);

}

// ── Program row — leads with a calendar icon, then a name + schedule
// caption (single column so day/time strings of any shape — "Wed 7–9pm",
// "Tue & Thu 4–6pm", "Mon/Wed/Fri 8–10am" — render cleanly without trying
// to split them into separate day/time columns). Right rail carries the
// price and a hover-reveal Join CTA, matching EventCard. */
function CDProgramRow({ p, theme, last }) {
  const [hover, setHover] = useStateCD(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: "20px 4px 20px 0",
        borderBottom: last ? 0 : "1px solid var(--pp-border-subtle)",
        display: "grid",
        gridTemplateColumns: "44px 1fr auto",
        gap: 16,
        alignItems: "center",
        background: hover ? "var(--pp-bg-subtle)" : "transparent",
        transition: "background 120ms",
        cursor: "pointer"
      }}>
      {/* Calendar icon tile — soft-tinted, mirrors the icon column on the
                  old event row but at a slightly larger size for parity with
                  EventCard's left time column. */}
      <span style={{
        width: 44, height: 44, borderRadius: 8,
        background: theme.softTint || "var(--pp-bg-subtle)",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0
      }}>
        <Icon name="Calendar" size={18} color={theme.primary} strokeWidth={2} />
      </span>

      {/* Name + full schedule string. The schedule is rendered as one
                  quiet caption line; flex-wrap is allowed by leaving overflow
                  unclamped so "Mon/Wed/Fri 8–10am · Recreational" stays readable. */}
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: "Axiforma, Inter, system-ui, sans-serif", fontWeight: 700, fontSize: 17, lineHeight: "22px", color: "var(--pp-fg-default)", letterSpacing: -0.3 }}>{p.name}</div>
        {p.schedule &&
        <div style={{ marginTop: 4, fontSize: 13, color: "var(--pp-fg-muted)", fontWeight: 500, lineHeight: 1.4 }}>{p.schedule}</div>
        }
      </div>

      {/* Right rail — price + hover-reveal Join button. */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, position: "relative" }}>
        <div style={{ fontFamily: "Axiforma, Inter, system-ui, sans-serif", fontWeight: 700, fontSize: 17, color: "var(--pp-fg-default)", textAlign: "right", letterSpacing: -0.2, whiteSpace: "nowrap" }}>{p.price}</div>
        <div style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
          height: 36, padding: hover ? "0 16px" : 0,
          width: hover ? "auto" : 36,
          background: "var(--pp-fg-default)", color: "var(--pp-bg-default)", borderRadius: 8,
          overflow: "hidden", whiteSpace: "nowrap",
          transition: "padding 180ms cubic-bezier(.2,.8,.2,1), width 180ms cubic-bezier(.2,.8,.2,1)"
        }}>
          {hover && <span style={{ fontFamily: "inherit", fontWeight: 600, fontSize: 12 }}>Join</span>}
          <Icon name="ArrowRight" size={13} color="var(--pp-bg-default)" strokeWidth={2.5} />
        </div>
      </div>
    </div>);

}

// ── Amenities — 6 icon cards (3-col on desktop) ─────────────────────────
function CDAmenities({ club, theme, desktop }) {
  const items = club.amenitiesGrid || [
  { icon: "Sun", name: "Outdoor Courts", sub: `${club.outdoor || 5} outdoor courts` },
  { icon: "Building", name: "Indoor Courts", sub: `${club.indoor || 3} indoor courts` },
  { icon: "Target", name: "Pickleball", sub: "Dedicated courts" },
  { icon: "Calendar", name: "Online Booking", sub: "Reserve anytime" },
  { icon: "Store", name: "Pro Shop", sub: "Equipment & restrings" },
  { icon: "Car", name: "Free Parking", sub: "On-site lot" }];

  return (
    <div>
      <CDSectionHead theme={theme}>Amenities</CDSectionHead>
      <div style={{ display: "grid", gridTemplateColumns: desktop ? "repeat(3, 1fr)" : "repeat(2, 1fr)", gap: 10 }}>
        {items.map((a) =>
        <div key={a.name} style={{
          padding: "14px 16px", borderRadius: 8,
          background: "var(--pp-bg-default)", border: "1px solid var(--pp-border-subtle)",
          display: "grid", gridTemplateColumns: "auto 1fr", gap: 12, alignItems: "center"
        }}>
            <span style={{ width: 32, height: 32, borderRadius: 999, background: theme.softTint || "#E7F2EC", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name={a.icon} size={14} color={theme.primary} strokeWidth={2.2} />
            </span>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: theme.display, fontWeight: 700, fontSize: 13, color: "var(--pp-fg-default)", letterSpacing: -0.1 }}>{a.name}</div>
              <div style={{ fontSize: 11, color: "var(--pp-fg-subtle)", fontWeight: 500, marginTop: 1 }}>{a.sub}</div>
            </div>
          </div>
        )}
      </div>
    </div>);

}

// ── Affiliate badge bar ─────────────────────────────────────────────────
function CDAffiliateBar({ club, theme }) {
  const items = club.highlights || [
  { icon: "BadgeCheck", label: "USTA Member Club" },
  { icon: "BadgeCheck", label: "USAPA Affiliate" },
  { icon: "Star", label: `${club.rating} avg rating · ${club.reviews}+ reviews` },
  { icon: "Trophy", label: "Hosted 12+ regional tournaments" },
  { icon: "Users", label: "650+ active members" },
  { icon: "GraduationCap", label: "USPTA & PPR certified pros" },
  { icon: "Sun", label: "Open 365 days · lights for night play" },
  { icon: "Sparkles", label: "Hawk-Eye replay on Court 1" }];

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
      rowGap: 12, columnGap: 20
    }}>
      {items.map((it, i) =>
      <div key={i} style={{
        display: "inline-flex", alignItems: "center", gap: 10,
        minWidth: 0
      }}>
          <Icon name={it.icon} size={15} color="var(--pp-fg-muted)" strokeWidth={1.6} />
          <span style={{
          fontFamily: "inherit",
          fontWeight: 400, fontSize: 14,
          color: "var(--pp-fg-muted)",
          lineHeight: "22px",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          lineHeight: 1.4
        }}>{it.label}</span>
        </div>
      )}
    </div>);

}

// ── Body composer ───────────────────────────────────────────────────────

// Pro-shop service alert — dismissible callout shown on the home screen
// when a member has an active service ticket (e.g. racquet restringing)
// ready for pickup at their club. Soft blue-tint, no accent rule —
// reads as a quiet status message rather than a banner.
function ProShopAlert({ theme, desktop, onDismiss }) {
  return (
    <div role="status" style={{
      position: "relative",


      padding: desktop ? "16px 20px" : "14px 14px",
      marginBottom: 18,
      display: "flex", alignItems: "center", gap: desktop ? 16 : 12,
      overflow: "hidden", background: "rgb(242, 244, 248)", borderStyle: "solid", borderWidth: "0px 0px 0px 8px", borderRadius: "8px"
    }}>
      <div style={{
        width: 36, height: 36, flexShrink: 0,
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        color: theme.primary || "var(--pp-blue-600)"
      }}>
        <Icon name="PackageCheck" size={24} strokeWidth={1.6} color={theme.primary || "var(--pp-blue-600)"} />
      </div>
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: desktop ? "row" : "column", alignItems: desktop ? "center" : "flex-start", gap: desktop ? 12 : 4 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "inherit", fontWeight: 700, fontSize: 14, color: "var(--pp-fg-default)", lineHeight: "20px" }}>
            Your racquet is ready for pickup
          </div>
          <div style={{ fontSize: 13, color: "var(--pp-fg-muted)", fontWeight: 500, lineHeight: "18px", marginTop: 2 }}>
            Wilson Blade 98 v9 <span style={{ color: "var(--pp-fg-subtle)" }}>·</span> Restring <span style={{ color: "var(--pp-fg-subtle)" }}>·</span> Old Coast Pro Shop
          </div>
        </div>
        <a href="#" style={{
          flexShrink: 0,
          color: theme.primary || "var(--pp-blue-600)", fontWeight: 600, fontSize: 13,
          textDecoration: "none",
          display: "inline-flex", alignItems: "center", gap: 6,
          whiteSpace: "nowrap"
        }}>
          View details
          <Icon name="ArrowRight" size={13} strokeWidth={2.2} color={theme.primary || "var(--pp-blue-600)"} />
        </a>
      </div>
      <button onClick={onDismiss} aria-label="Dismiss alert" style={{
        flexShrink: 0,
        width: 28, height: 28, borderRadius: 6,
        background: "transparent", border: 0, cursor: "pointer",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        color: "var(--pp-fg-subtle)",
        transition: "background 120ms"
      }}
      onMouseEnter={(e) => {e.currentTarget.style.background = "rgba(15,18,20,.04)";}}
      onMouseLeave={(e) => {e.currentTarget.style.background = "transparent";}}>
        <Icon name="X" size={16} strokeWidth={2} color="var(--pp-fg-subtle)" />
      </button>
    </div>);

}
window.ProShopAlert = ProShopAlert;

function ClubDetailBody({ club, theme, viewport }) {
  const desktop = viewport === "desktop";
  return (
    <>
      {/* Photo carousel moved into the description column below so the
                  user-generated content sits as part of the club's story rather
                  than a banner over the page. */}

      {/* Title block — h1 constrained to 66% of the row so the layout
                  breathes; Verified badge moves directly under the title (not
                  opposite). The right 33% is intentionally empty for now,
                  keeping the header light. */}
      <div style={{
        display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16,
        marginTop: 4
      }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 12, minWidth: 0, flex: 1 }}>
          <h1 style={{
            margin: 0,
            fontFamily: theme.display, fontWeight: 800,
            fontSize: desktop ? 64 : 30,
            lineHeight: desktop ? "64px" : "34px",
            letterSpacing: desktop ? -2 : -0.8,
            color: "var(--pp-fg-default)",
            maxWidth: "100%"
          }}>{club.name}</h1>
          {club.onCR !== false &&
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            height: 30, padding: "0 14px", borderRadius: 999,
            background: "#1FA868", color: "var(--pp-bg-default)",
            fontFamily: theme.display, fontWeight: 800, fontSize: 11,
            letterSpacing: 1, textTransform: "uppercase",
            boxShadow: "0 2px 8px rgba(31,168,104,.25)"
          }}>
              <Icon name="BadgeCheck" size={14} strokeWidth={2.6} color="var(--pp-bg-default)" />
              Verified on CourtReserve
            </span>
          }
        </div>
        {/* Membership CTA removed from the title row — when needed it
                    lives in the sticky bottom action bar instead, keeping the
                    header light. */}
      </div>

      {/* Two-column info row — left holds the description + highlights
                  ("why join" credentials) + sport/amenity tag row, right holds
                  the map + contact actions. */}
      <div style={{
        marginTop: 14,
        display: "grid",
        gridTemplateColumns: desktop ? "minmax(0, 2fr) minmax(280px, 1fr)" : "1fr",
        gap: 32, alignItems: "start"
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 18, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: 14, color: "var(--pp-fg-muted)", lineHeight: "22px", fontWeight: 500 }}>{club.about}</p>
          {/* Highlights grid — credentials + amenity signals that
                      answer "why would I join". Sits directly under the
                      description as a continuation of the same text block, above
                      the photo carousel. */}
          <CDAffiliateBar club={club} theme={theme} />
          {/* Photo carousel — sits below the highlights as a visual
                      continuation of the club's story. Member-uploaded photos. */}
          <CDPhotoCarousel club={club} theme={theme} />
          {/* Tag row — sports + indoor/outdoor + total courts. */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {club.sports.map((s) =>
            <span key={s} style={{ display: "inline-flex", alignItems: "center", height: 26, padding: "0 12px", borderRadius: 8, background: "var(--pp-bg-subtle)", color: "var(--pp-fg-muted)", fontSize: 11, fontWeight: 600 }}>{s}</span>
            )}
            {[
            club.indoor > 0 ? "Indoor" : null,
            club.outdoor > 0 ? "Outdoor" : null,
            `${club.courts} Courts`].
            filter(Boolean).map((s) =>
            <span key={s} style={{ display: "inline-flex", alignItems: "center", height: 26, padding: "0 12px", borderRadius: 8, background: "var(--pp-bg-subtle)", color: "var(--pp-fg-muted)", fontSize: 11, fontWeight: 600 }}>{s}</span>
            )}
          </div>
        </div>
        <CDMapCard club={club} theme={theme} />
      </div>

      {/* Quick stats dashboard — headline numbers (Courts / Hours / Per
                  hour / Rating) anchor the identity block. */}
      <div style={{ marginTop: 24 }}><CDQuickStats club={club} theme={theme} /></div>

      {/* Social signals below the dashboard — friends-who-played-here +
                  times-played-here. Two card columns: avatar stack on the left,
                  DUPR trend chip on the right. Reads as a continuation of the
                  stats strip above but with personal context. */}
      <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: desktop ? "1fr 1fr" : "1fr", gap: 12 }}>
        <CDFriendsHereCard club={club} theme={theme} />
        <CDTimesPlayedCard club={club} theme={theme} />
      </div>

      {/* CDNetworkMeta removed — this page is the non-member discovery
                  surface, so showing personal social signals (friends-here,
                  your-matches, times-you've-played) doesn't fit. */}

      {/* Booking panel — replaces the dual top CTAs + court availability
                  grid with the homepage's MyClubBookingPanel so the club detail
                  page leads with the same booking surface members see on their
                  home dashboard. */}
      {window.MyClubBookingPanel &&
      <div style={{ marginTop: 24 }}>
          <window.MyClubBookingPanel
          theme={theme}
          viewport={viewport}
          hideRail={true}
          club={{
            name: club.name,
            city: club.address,
            rating: club.rating,
            reviews: club.reviews,
            tier: club.tier || "Diamond",
            courts: club.courts,
            primary: theme.primary,
            accent: theme.accent
          }} />
        
        </div>
      }

      <div style={{ marginTop: 24 }}><CDPlayersYouMightKnow club={club} theme={theme} desktop={desktop} /></div>

      <div style={{ marginTop: 24 }}><CDUpcomingEvents club={club} theme={theme} /></div>

      <div style={{ marginTop: 24 }}><CDProsPrograms club={club} theme={theme} /></div>

      <div style={{ marginTop: 24 }}><CDAmenities club={club} theme={theme} desktop={desktop} /></div>

      <div style={{ height: desktop ? 120 : 100 }} />
    </>);

}

// ── Layout shells ───────────────────────────────────────────────────────
function ClubDetailDesktop({ club, theme, onBack, onBookCourt, onBrowseEvents }) {
  return (
    <div style={{ background: "var(--pp-bg-default)", minHeight: "100%", fontFamily: "Inter, system-ui, sans-serif", position: "relative" }}>
      {/* Top bar with Find Clubs back + share */}
      <div style={{
        position: "sticky", top: 0, zIndex: 20,
        background: "var(--pp-bg-default)", borderBottom: "1px solid var(--pp-border-subtle)",
        height: 56, display: "flex", alignItems: "center", padding: "0 24px", gap: 12
      }}>
        <button onClick={onBack} style={{
          background: "transparent", border: 0, padding: 8, marginLeft: -8, cursor: "pointer",
          display: "inline-flex", alignItems: "center", gap: 6,
          color: theme.primary, fontFamily: "inherit", fontSize: 13, fontWeight: 700
        }}>
          <Icon name="ChevronLeft" size={16} strokeWidth={2.4} color={theme.primary} /> Find clubs
        </button>
        <div style={{ flex: 1, textAlign: "center", fontFamily: theme.display, fontWeight: 700, fontSize: 14, letterSpacing: -0.2 }}>{club.name}</div>
        <button aria-label="Share" style={{ background: "transparent", border: 0, padding: 8, marginRight: -8, cursor: "pointer", display: "none", alignItems: "center", color: "var(--pp-fg-subtle)" }}>
          <Icon name="Share2" size={16} strokeWidth={2} color="var(--pp-fg-subtle)" />
        </button>
      </div>
      <div style={{ maxWidth: 880, margin: "0 auto", padding: "24px 24px 120px" }}>
        <ClubDetailBody club={club} theme={theme} viewport="desktop" />
      </div>
      {/* Sticky bottom CTA bar — stays anchored as the user scrolls so the
                  primary actions (membership / reserve a court) are always one
                  click away. Pill shape sits centered with breathing room from the
                  page edges. */}
      <div style={{
        position: "sticky", bottom: 16, zIndex: 30,
        display: "flex", justifyContent: "center", pointerEvents: "none", padding: "0 24px",
        marginTop: -88
      }}>
        <div style={{
          pointerEvents: "auto",
          display: "flex", alignItems: "center", gap: 16,
          background: "var(--pp-fg-default)", color: "var(--pp-bg-default)",
          padding: "10px 10px 10px 24px", borderRadius: 999,
          boxShadow: "0 14px 40px rgba(15,18,20,.28), 0 2px 8px rgba(15,18,20,.18)",
          maxWidth: 720, width: "100%", justifyContent: "space-between"
        }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, minWidth: 0 }}>
            <span style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 16, letterSpacing: -0.2 }}>{club.joined ? `${club.openCourtsNow} courts open now` : "Guest access"}</span>
            <span style={{ fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,.7)", whiteSpace: "nowrap" }}>{club.joined ? `${club.tier} member` : `From $${club.guestRate}/hr · no membership required`}</span>
          </div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            {/* Tertiary — Join the Club. Quiet ghost link so it doesn't
                        compete with the primary book CTA. Only relevant when the
                        user isn't already a member. */}
            {!club.joined &&
            <button style={{
              height: 44, padding: "0 14px",
              background: "transparent", border: 0,
              color: "rgba(255,255,255,.85)",
              fontFamily: "inherit", fontWeight: 600, fontSize: 13, cursor: "pointer",
              textDecoration: "underline", textUnderlineOffset: 3
            }}>
                Join the Club
              </button>
            }
            {/* Secondary — See events. Outlined pill on dark surface. */}
            <button onClick={onBrowseEvents} style={{
              height: 44, padding: "0 18px", borderRadius: 999,
              border: "1px solid rgba(255,255,255,.30)",
              background: "transparent", color: "var(--pp-bg-default)",
              fontFamily: "inherit", fontWeight: 600, fontSize: 13, cursor: "pointer"
            }}>
              See events
            </button>
            {/* Primary — Book a court. White pill on dark for max contrast. */}
            <button onClick={onBookCourt} style={{
              display: "inline-flex", alignItems: "center", gap: 8, flexShrink: 0,
              height: 44, padding: "0 22px", borderRadius: 999, border: 0,
              background: "var(--pp-bg-default)", color: "var(--pp-fg-default)",
              fontFamily: "inherit", fontWeight: 700, fontSize: 13, cursor: "pointer"
            }}>
              Book a court <Icon name="ArrowRight" size={13} color="var(--pp-fg-default)" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </div>);

}

function ClubDetailMobile({ club, theme, onBack, onBookCourt, onBrowseEvents }) {
  return (
    <div style={{ background: "var(--pp-bg-default)", minHeight: "100%", fontFamily: "Inter, system-ui, sans-serif", position: "relative" }}>
      <div style={{
        position: "sticky", top: 0, zIndex: 20,
        background: "var(--pp-bg-default)", borderBottom: "1px solid var(--pp-border-subtle)",
        height: 52, display: "flex", alignItems: "center", padding: "0 16px", gap: 12
      }}>
        <button onClick={onBack} style={{ background: "transparent", border: 0, padding: 8, marginLeft: -8, cursor: "pointer", display: "inline-flex", alignItems: "center", color: theme.primary, fontSize: 13, fontWeight: 700, fontFamily: "inherit", gap: 4 }}>
          <Icon name="ChevronLeft" size={16} strokeWidth={2.4} color={theme.primary} /> Find clubs
        </button>
        <div style={{ flex: 1, textAlign: "center", fontFamily: theme.display, fontWeight: 700, fontSize: 13, letterSpacing: -0.1 }}>{club.name}</div>
        <button aria-label="Share" style={{ background: "transparent", border: 0, padding: 8, marginRight: -8, cursor: "pointer", display: "none", color: "var(--pp-fg-subtle)" }}>
          <Icon name="Share2" size={16} strokeWidth={2} color="var(--pp-fg-subtle)" />
        </button>
      </div>
      <div style={{ padding: "16px 16px 100px" }}>
        <ClubDetailBody club={club} theme={theme} viewport="mobile" />
      </div>
      {/* Sticky mobile CTA bar — full-width buttons, anchored to bottom */}
      <div style={{
        position: "sticky", bottom: 0, zIndex: 30,
        background: "var(--pp-bg-default)", borderTop: "1px solid var(--pp-border-subtle)",
        padding: "12px 16px 18px",
        display: "flex", gap: 8
      }}>
        <button onClick={onBrowseEvents} style={{
          flex: 1, height: 48, padding: "0 14px", borderRadius: 8,
          border: "1px solid var(--pp-border-subtle)", background: "transparent", color: "var(--pp-fg-default)",
          fontFamily: "inherit", fontWeight: 600, fontSize: 13, cursor: "pointer",
          display: "inline-flex", alignItems: "center", justifyContent: "center"
        }}>See events</button>
        <button onClick={onBookCourt} style={{
          flex: 1.4, height: 48, padding: "0 18px", borderRadius: 8,
          border: 0, background: theme.primary, color: "var(--pp-bg-default)",
          fontFamily: "inherit", fontWeight: 700, fontSize: 13, cursor: "pointer",
          display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8
        }}>
          Book a court <Icon name="ArrowRight" size={13} color="var(--pp-bg-default)" strokeWidth={2.5} />
        </button>
      </div>
    </div>);

}

// ── Detail data ─────────────────────────────────────────────────────────
const CLUB_DETAIL = {
  id: "oc",
  name: "Old Coast Pickleball",
  shortName: "Old Coast Pickleball",
  logoMark: "OC",
  color: "#2E5D52",
  onCR: true,
  address: "120 Sea Grove Main St, St. Augustine, FL 32080",
  miles: 2.1,
  sports: ["Pickleball", "Tennis"],
  about: "St. Augustine's premier racket sports facility. 8 courts across indoor and outdoor settings, a fully stocked pro shop, and a welcoming community of competitive and recreational players.",
  courts: 8,
  indoor: 3,
  outdoor: 5,
  members: 412,
  weeklyEvents: 13,
  rating: 4.8,
  reviews: 186,
  joined: true,
  tier: "Diamond",
  openCourtsNow: 3,
  guestRate: 35,
  closesAt: "10pm",
  timesPlayed: 24,
  lastVisit: "3 days ago",
  memberSince: 2024,
  matchesAreMembers: 12,
  todayDate: "Sun, May 11",
  affiliations: ["USTA Member Club", "USAPA Affiliate", "4.8 avg player rating"],
  amenities: ["Pro shop", "Locker rooms", "Café", "Stringing service", "Ball machines", "Loaner paddles"],
  hours: [
  { days: "Mon–Fri", time: "6:00 AM – 10:00 PM" },
  { days: "Sat–Sun", time: "7:00 AM – 9:00 PM" }],

  coaches: [
  { name: "Mike Alvarado", avatar: "MA", title: "Head Pro · PPR", rate: 95 },
  { name: "Priya Shah", avatar: "PS", title: "Lead instructor", rate: 80 },
  { name: "Coach Reid", avatar: "CR", title: "League director", rate: 75 }]

};

const CLUB_DETAILS_BY_ID = {
  oc: CLUB_DETAIL,
  dd: {
    ...CLUB_DETAIL,
    id: "dd",
    name: "Dill Dinkers Jacksonville",
    shortName: "Dill Dinkers",
    logoMark: "DD",
    color: "#8E5BE8",
    address: "4815 Town Center Pkwy, Jacksonville, FL 32246",
    miles: 8.4,
    sports: ["Pickleball"],
    about: "Indoor pickleball-first club with air-conditioned courts, a bar & grill, and a packed schedule of leagues, drop-in sessions, and tournaments year-round.",
    courts: 14,
    indoor: 14,
    outdoor: 0,
    members: 612,
    weeklyEvents: 22,
    rating: 4.7,
    reviews: 312,
    tier: "Gold",
    todayDate: "Sun, May 11",
    affiliations: ["USAPA Affiliate", "Indoor year-round", "4.7 avg player rating"],
    amenities: ["Bar & grill", "Indoor AC", "Pro shop", "Paddle demo bar", "League play", "Hawk-Eye on Court 1"]
  }
};
window.CLUB_DETAILS_BY_ID = CLUB_DETAILS_BY_ID;

function ClubDetail({ viewport = "desktop", theme, club, clubId, loggedIn, onBack, onBookCourt, onBrowseEvents }) {
  const c = club || clubId && CLUB_DETAILS_BY_ID[clubId] || CLUB_DETAIL;
  const joinedNow = loggedIn !== undefined ? !!loggedIn : !!c.joined;
  const cWithAuth = { ...c, joined: joinedNow };
  // Each club uses its own brand theme on its detail page — picking
  // Old Coast from the universal CourtReserve view should still show
  // Old Coast's green branding, not the neutral CR palette.
  const clubTheme = window.THEMES && c.id && window.THEMES[c.id] || theme;
  if (viewport === "mobile") {
    return <ClubDetailMobile club={cWithAuth} theme={clubTheme} onBack={onBack} onBookCourt={onBookCourt} onBrowseEvents={onBrowseEvents} />;
  }
  return <ClubDetailDesktop club={cWithAuth} theme={clubTheme} onBack={onBack} onBookCourt={onBookCourt} onBrowseEvents={onBrowseEvents} />;
}

Object.assign(window, { ClubDetail, CLUB_DETAIL });