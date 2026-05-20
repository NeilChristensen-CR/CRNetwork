// FindClubs.jsx — "Clubs near me" list screen between home and club detail.
const { useState: useStateFC, useRef: useRefFC, useSyncExternalStore: useSyncExternalStoreFC } = React;

// ---- Favorites store ------------------------------------------------------
// Tiny external store so every card on the page reflects favorite changes
// instantly without threading callbacks through 4 levels of components.
// Initial favorites = clubs marked `joined: true` in ALL_CLUBS (Old Coast,
// Dill Dinkers). Persisted to localStorage so demo state survives refresh.
const __favSet = (() => {
  try {
    const raw = window.localStorage && window.localStorage.getItem("fc.favorites");
    if (raw) return new Set(JSON.parse(raw));
  } catch (e) {/* ignore */}
  return null;
})();
const __favListeners = new Set();
let __favorites = __favSet || new Set();
const __notifyFavs = () => {
  try {window.localStorage && window.localStorage.setItem("fc.favorites", JSON.stringify([...__favorites]));} catch (e) {}
  __favListeners.forEach((fn) => fn());
};
function useFavorites() {
  const subscribe = (cb) => {__favListeners.add(cb);return () => __favListeners.delete(cb);};
  const getSnapshot = () => __favorites;
  return useSyncExternalStoreFC(subscribe, getSnapshot, getSnapshot);
}
function toggleFavorite(id) {
  const next = new Set(__favorites);
  if (next.has(id)) next.delete(id);else next.add(id);
  __favorites = next;
  __notifyFavs();
}
function isFavorite(id) {return __favorites.has(id);}

// Reusable star toggle — outlined when not a favorite, filled gold when
// favorited. Click stops propagation so favoriting a card doesn't also
// open it. Used by every card in Find Clubs (list rows, map cards, map
// bottom sheet) so the affordance is identical everywhere.
function FavoriteStar({ clubId, size = 32 }) {
  useFavorites();
  const fav = isFavorite(clubId);
  return (
    <button
      onClick={(e) => {e.stopPropagation();toggleFavorite(clubId);}}
      aria-label={fav ? "Remove from favorites" : "Add to favorites"}
      aria-pressed={fav}
      title={fav ? "Remove from favorites" : "Add to favorites"}
      style={{
        width: size, height: size, borderRadius: 999,
        background: fav ? "rgba(242,169,59,.12)" : "#fff",
        border: `1px solid ${fav ? "rgba(242,169,59,.45)" : "#E9EBEC"}`,
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", flexShrink: 0,
        boxShadow: "0 1px 2px rgba(15,18,20,.05)",
        transition: "background 160ms, border-color 160ms, transform 120ms"
      }}>
      <svg width={Math.round(size * 0.5)} height={Math.round(size * 0.5)} viewBox="0 0 24 24"
      fill={fav ? "#F2A93B" : "none"}
      stroke={fav ? "#F2A93B" : "#4B5052"}
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      style={{ display: "block" }} aria-hidden>
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77 5.82 21l1.18-6.88-5-4.87 6.91-1.01z" />
      </svg>
    </button>);

}

// Tiny stylized map thumbnail — faux streets, a park/water blob, and a
// pin marker stamped with the club's logo mark. Stands in for a real Mapbox
// tile so every row reads as a place at a glance. Deterministic per id so
// the same club always looks the same across renders.
function MapThumb({ club, width = 92, height = 68, radius = 8, pinSize = 26 }) {
  // Hash the club id so the accent style + offsets are stable per club.
  const hash = (s) => {let h = 0;for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i) | 0;return Math.abs(h);};
  const h = hash(club.id || club.name);
  const accentStyle = h % 4; // 0..3 — chooses the decorative motif
  const accent = club.photoTone || "#fff";
  const bg = club.photoBg || club.color || "#0F1214";
  // Size the initials relative to the tile so the logo scales with the
  // calling context (small thumb vs larger card header).
  const square = Math.min(width, height);
  const initialFs = Math.max(11, Math.round(square * 0.42));
  return (
    <div style={{
      position: "relative", width, height, borderRadius: radius, overflow: "hidden",
      background: bg, flexShrink: 0,
      display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      {/* Decorative accent — pure SVG so it stays crisp at any size. Each
            motif (stripe / dot grid / arc / chevron) is keyed off the hash
            so every club has a unique-but-coherent logo treatment. */}
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.55 }}>
        {accentStyle === 0 &&
        // Diagonal stripe across the top-right
        <polygon points="60,-5 110,-5 110,45 100,45" fill={accent} opacity={0.55} />
        }
        {accentStyle === 1 &&
        // Soft arc anchored bottom-left
        <circle cx="-10" cy="110" r="80" fill={accent} opacity={0.45} />
        }
        {accentStyle === 2 &&
        // 3x3 dot grid top-right
        <g fill={accent} opacity={0.65}>
            {[20, 35, 50].map((y) => [70, 82, 94].map((x) => <circle key={`${x}-${y}`} cx={x} cy={y} r="2.4" />))}
          </g>
        }
        {accentStyle === 3 &&
        // Two stacked chevrons bottom-right
        <g stroke={accent} strokeWidth="3" fill="none" opacity={0.55}>
            <path d="M55 72 L 80 88 L 105 72" />
            <path d="M55 86 L 80 102 L 105 86" />
          </g>
        }
      </svg>
      {/* Centered initials — the primary logo mark. */}
      <span style={{
        position: "relative", zIndex: 1,
        fontFamily: "Axiforma, Inter, sans-serif",
        fontWeight: 800,
        fontSize: initialFs,
        letterSpacing: -0.6,
        color: "#fff",
        textShadow: "0 1px 2px rgba(0,0,0,.25)"
      }}>{club.logoMark}</span>
    </div>);

}

const ALL_CLUBS = [
{ id: "oc", name: "Old Coast Pickleball", logoMark: "OC", color: "#2E5D52", miles: 2.1, rating: 4.8, reviews: 248, price: 3, address: "112 King St, St. Augustine, FL 32084", sports: ["Pickleball", "Tennis"], tags: ["Pro shop", "Lessons", "Tournaments", "League play"], indoor: true, outdoor: true, courts: 8, onCR: true, joined: true, tier: "Diamond", photoBg: "#2E5D52", photoTone: "#7CE0B5", openTimes: ["9:00 AM", "9:30 AM", "10:00 AM", "11:30 AM"], activePlayers: 47, lat: 0.42, lng: 0.55 },
{ id: "at", name: "Anastasia Tennis Club", logoMark: "AT", color: "#1F4ED8", miles: 2.4, rating: 4.6, reviews: 132, price: 2, address: "86 Anastasia Park Rd, St. Augustine, FL 32080", sports: ["Tennis"], tags: ["Outdoor only", "Group lessons", "Junior dev"], indoor: false, outdoor: true, courts: 6, onCR: true, joined: false, photoBg: "#1F4ED8", photoTone: "#8AB6FF", openTimes: ["8:00 AM", "10:00 AM", "1:30 PM", "3:00 PM"], activePlayers: 22, lat: 0.62, lng: 0.62 },
{ id: "vb", name: "Vilano Beach Racquet Club", logoMark: "VB", color: "#8E5BE8", miles: 2.6, rating: 4.5, reviews: 96, price: 3, address: "260 Vilano Rd, St. Augustine, FL 32084", sports: ["Tennis", "Pickleball"], tags: ["Beachfront", "Bar & grill", "Open play"], indoor: false, outdoor: true, courts: 10, onCR: true, joined: false, photoBg: "#8E5BE8", photoTone: "#FFD166", openTimes: ["10:30 AM", "12:00 PM", "2:30 PM", "5:00 PM"], activePlayers: 31, lat: 0.30, lng: 0.32 },
{ id: "tp", name: "Treaty Park Tennis", logoMark: "TP", color: "#858F8F", miles: 3.2, rating: 4.3, reviews: 41, price: 1, address: "1595 Wildwood Dr, St. Augustine, FL 32086", sports: ["Tennis"], tags: ["Public courts", "Drop-in", "Free play"], indoor: false, outdoor: true, courts: 4, onCR: false, joined: false, photoBg: "#858F8F", photoTone: "#E9EBEC", openTimes: ["9:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"], activePlayers: 8, lat: 0.55, lng: 0.30 },
{ id: "sa", name: "South St. Augustine Tennis", logoMark: "SA", color: "#0F1214", miles: 3.6, rating: 4.4, reviews: 87, price: 2, address: "3400 US-1 South, St. Augustine, FL 32086", sports: ["Tennis"], tags: ["Indoor + outdoor", "Pro shop", "Stringing"], indoor: true, outdoor: true, courts: 6, onCR: true, joined: false, photoBg: "#0F1214", photoTone: "#FFDA44", openTimes: ["8:30 AM", "11:30 AM", "3:00 PM", "5:30 PM"], activePlayers: 19, lat: 0.72, lng: 0.42 },
{ id: "dd", name: "Dill Dinkers Jacksonville", logoMark: "DD", color: "#8E5BE8", miles: 8.4, rating: 4.7, reviews: 312, price: 3, address: "9550 Regency Square Blvd, Jacksonville, FL 32225", sports: ["Pickleball"], tags: ["Indoor air-conditioned", "Bar & grill", "Pro shop", "Leagues"], indoor: true, outdoor: false, courts: 14, onCR: true, joined: true, tier: "Gold", photoBg: "#8E5BE8", photoTone: "#FFD166", openTimes: ["8:00 AM", "12:00 PM", "2:30 PM", "4:00 PM"], activePlayers: 64, lat: 0.18, lng: 0.78 }];


// Seed favorites store from ALL_CLUBS' joined flag on first ever load so
// the demo doesn't start with an empty Your Favorite Locations carousel.
if (__favorites.size === 0) {
  ALL_CLUBS.forEach((c) => {if (c.joined) __favorites.add(c.id);});
  try {window.localStorage && window.localStorage.setItem("fc.favorites", JSON.stringify([...__favorites]));} catch (e) {}
}


// Render a club entry as a richer row — photo thumbnail on the left,
// title + verified badge + tag chips in the middle, rating/price/distance
// pinned right. Mirrors the EventCard pattern from the events feed so the
// two lists feel like siblings.
function ClubResultRow({ club, theme, onOpen, desktop }) {
  const [hover, setHover] = useStateFC(false);
  useFavorites(); // re-render when favorites change
  const isFav = isFavorite(club.id);
  // Price level rendered as filled-vs-muted dollar signs (1–4). Players
  // contribute this — show it as soft community signal, not authoritative.
  const PriceLevel = ({ level = 1 }) =>
  <span style={{ display: "inline-flex", alignItems: "center", fontFamily: theme.display, fontWeight: 800, fontSize: 13, letterSpacing: 0.4, fontVariantNumeric: "tabular-nums" }}>
      {[1, 2, 3, 4].map((i) =>
    <span key={i} style={{ color: i <= level ? "#0F1214" : "#DEE1E5" }}>$</span>
    )}
    </span>;

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: "100%",
        display: "grid",
        gridTemplateColumns: desktop ? "64px 1fr auto" : "56px 1fr",
        gap: desktop ? 20 : 12, alignItems: "center",
        padding: "20px 4px",
        borderBottom: "1px solid #E9EBEC",
        fontFamily: "inherit"
      }}>
      {/* Map thumbnail — 1:1 square so each row leads with a uniform
            compact pin tile, regardless of how tall the content column
            grows. Vertically centered with the content. */}
      <MapThumb club={club} width={desktop ? 64 : 56} height={desktop ? 64 : 56} />

      {/* Content stack — title, verification, social proof, tag chips */}
      <div style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 6 }}>
        {/* Membership tier — lifted to its own row above the title so
              long club names don't compete with the badge. Only shown
              when the player is a member of this club. */}
        {club.joined &&
        <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, height: 20, padding: "0 7px 0 5px", borderRadius: 8, background: theme.softTint, color: theme.primary, fontFamily: theme.display, fontSize: 10, fontWeight: 800, letterSpacing: 0.8, textTransform: "uppercase", flexShrink: 0 }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill={theme.primary} style={{ flexShrink: 0 }} aria-hidden>
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77 5.82 21l1.18-6.88-5-4.87 6.91-1.01z" />
              </svg>
              {club.tier} member
            </span>
          </div>
        }
        {/* Title row — name on the left, favorite star pinned right.
              Tier badge moved out so the name has the full row to itself. */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
          <span style={{ flex: 1, minWidth: 0, fontFamily: theme.display, fontWeight: 700, fontSize: 18, color: "#0F1214", letterSpacing: -0.3, lineHeight: "22px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{club.name}</span>
          <div style={{ flexShrink: 0 }}>
            <FavoriteStar clubId={club.id} size={28} />
          </div>
        </div>

        {/* Social proof + courts + sports — one quiet meta line.
              Leads with a live "active players" pulse so the count of
              people currently playing/booked at this club anchors the row
              with social proof, then folds in courts + sports. */}
        <div style={{ fontSize: 12, color: "#4B5052", fontWeight: 500, display: "flex", alignItems: "center", gap: 8, flexWrap: "nowrap", overflow: "hidden", whiteSpace: "nowrap" }}>
          {typeof club.activePlayers === "number" &&
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, flexShrink: 0, color: "#1F8A5B", fontWeight: 700 }}>
              <span style={{ width: 6, height: 6, borderRadius: 999, background: "#1F8A5B", boxShadow: "0 0 0 3px rgba(31,138,91,.18)" }} />
              {club.activePlayers} active now
            </span>
          }
          {typeof club.activePlayers === "number" &&
          <span style={{ color: "#DEE1E5", flexShrink: 0 }}>·</span>
          }
          <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
            {club.courts} courts · {club.sports.join(" · ")}
          </span>
        </div>

        {/* Amenity tags row — leads with the Verified pill on the far
              left so the trust signal anchors the cluster, then amenity
              chips fill in to the right. Capped so we don't push the row to
              a third line. */}
        {(club.onCR || club.tags && club.tags.length > 0) &&
        <div style={{ marginTop: 2, display: "flex", flexWrap: "nowrap", gap: 6, overflow: "hidden", alignItems: "center" }}>
            {!desktop && club.onCR &&
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            height: 22, padding: "0 8px", borderRadius: 8,
            background: "#E7F2EC", color: "#1F8A5B",
            fontFamily: theme.display, fontSize: 10, fontWeight: 800, letterSpacing: 0.8, textTransform: "uppercase",
            whiteSpace: "nowrap", flexShrink: 0
          }}>
                <Icon name="Check" size={9} strokeWidth={3} color="#1F8A5B" /> Verified
              </span>
          }
            {(club.tags || []).slice(0, desktop ? 3 : 2).map((tag) =>
          <span key={tag} style={{
            display: "inline-flex", alignItems: "center", height: 22, padding: "0 10px",
            borderRadius: 8, background: "#F4F5F6", color: "#4B5052",
            fontSize: 11, fontWeight: 600, whiteSpace: "nowrap", flexShrink: 0
          }}>{tag}</span>
          )}
            {(club.tags || []).length > (desktop ? 3 : 2) &&
          <span style={{ fontSize: 11, color: "#858F8F", fontWeight: 600, alignSelf: "center", flexShrink: 0 }}>+{club.tags.length - (desktop ? 3 : 2)}</span>
          }
          </div>
        }

        {/* Mobile-only — rating, price, Book button stay inside the content
              column so they line up with the title/tags above. The map sits
              in the right column alongside this whole stack. */}
        {!desktop &&
        <div style={{ marginTop: 8, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                <span style={{ color: "#F2A93B", fontSize: 14 }}>★</span>
                <span style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 14, color: "#0F1214", fontVariantNumeric: "tabular-nums", letterSpacing: -0.2 }}>{club.rating.toFixed(1)}</span>
              </span>
              <span style={{ width: 3, height: 3, borderRadius: 8, background: "#DEE1E5" }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: "#4B5052", fontVariantNumeric: "tabular-nums" }}>{club.miles} mi</span>
              <span style={{ width: 3, height: 3, borderRadius: 8, background: "#DEE1E5" }} />
              <PriceLevel level={club.price || 1} />
            </div>
            <button onClick={(e) => {e.stopPropagation();onOpen && onOpen();}} style={{
            height: 32, padding: "0 14px", borderRadius: 8, border: 0,
            background: "#0F1214", color: "#fff",
            fontFamily: "inherit", fontWeight: 600, fontSize: 12, cursor: "pointer",
            display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, whiteSpace: "nowrap"
          }}>
              Book <Icon name="ArrowRight" size={11} color="#fff" strokeWidth={2.5} />
            </button>
          </div>
        }
      </div>

      {/* Mobile: map sits in the left column above; nothing renders here. */}

      {/* Desktop right rail — rating + price stacked, then Book button.
            Mobile rail lives inside the content column above. */}
      {desktop &&
      <div style={{ display: "flex", alignItems: "center", gap: 20, position: "relative" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              <span style={{ color: "#F2A93B", fontSize: 14 }}>★</span>
              <span style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 18, color: "#0F1214", fontVariantNumeric: "tabular-nums", letterSpacing: -0.3 }}>{club.rating.toFixed(1)}</span>
            </div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 11, color: "#4B5052", fontWeight: 600 }}>
              <span style={{ fontVariantNumeric: "tabular-nums" }}>{club.miles} mi</span>
              <span style={{ width: 3, height: 3, borderRadius: 8, background: "#DEE1E5" }} />
              <PriceLevel level={club.price || 1} />
            </div>
          </div>
          <button
          onClick={(e) => {e.stopPropagation();onOpen && onOpen();}}
          aria-label="Book a court"
          style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
            height: 40, padding: hover ? "0 18px" : 0,
            width: hover ? "auto" : 40,
            background: "#0F1214", color: "#fff", borderRadius: 8, border: 0,
            overflow: "hidden", whiteSpace: "nowrap", cursor: "pointer",
            fontFamily: "inherit", fontWeight: 600, fontSize: 13,
            transition: "padding 180ms cubic-bezier(.2,.8,.2,1), width 180ms cubic-bezier(.2,.8,.2,1)"
          }}>
            {hover && <span style={{ fontFamily: "inherit", fontWeight: 600, fontSize: 13 }}>Book a court</span>}
            <Icon name="ArrowRight" size={14} color="#fff" strokeWidth={2.5} />
          </button>
        </div>
      }
    </div>);

}

// Carousel tile for clubs the player is already a member of — sits above
// the discovery list. Matches the BookNowCard layout from the homepage so
// the two "available to book now" surfaces feel like siblings: square map
// header with location tag overlay, membership tag at top-right, then a
// compact body with title + rating, sport tag + meta, and a 2x2 grid of
// time slot pills.
function MyClubCard({ club, theme, onOpen }) {
  const t = theme && theme.t || {};
  // Star icon row — sized down to read as metadata, not as a focal point.
  const stars = (() => {
    const full = Math.floor(club.rating);
    const half = club.rating - full >= 0.4 && club.rating - full < 0.9;
    const out = [];
    for (let i = 0; i < 5; i++) {
      let fill = "#E9EBEC";
      if (i < full) fill = "#FFB400";else
      if (i === full && half) fill = "#FFB400";
      out.push(
        <svg key={i} width="11" height="11" viewBox="0 0 24 24" fill={fill} style={{ flexShrink: 0 }}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77 5.82 21l1.18-6.88-5-4.87 6.91-1.01z" />
        </svg>
      );
    }
    return out;
  })();
  // Render $ / $$ / $$$ as on/off glyphs so the price reads at a glance.
  const priceText = "$".repeat(club.price || 1);
  return (
    <button
      onClick={onOpen}
      style={{
        flex: "0 0 auto", width: 288, scrollSnapAlign: "start",
        background: "#fff", border: "1px solid #E9EBEC", borderRadius: 8,
        padding: 0, textAlign: "left", cursor: "pointer",
        fontFamily: "inherit", color: "#0F1214",
        display: "flex", flexDirection: "column", overflow: "hidden",
        transition: "transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease"
      }}
      onMouseEnter={(e) => {e.currentTarget.style.transform = "translateY(-2px)";e.currentTarget.style.boxShadow = "0 8px 24px rgba(15,18,20,.08)";e.currentTarget.style.borderColor = "#DEE1E5";}}
      onMouseLeave={(e) => {e.currentTarget.style.transform = "translateY(0)";e.currentTarget.style.boxShadow = "none";e.currentTarget.style.borderColor = "#E9EBEC";}}>
      
      {/* Map header — mirrors BookNowCard's 3:1 mini map. The membership
            tier is anchored top-right (matching BookNow's "My club" tag) and
            the distance chip rides at the bottom-left inside the map. */}
      <div style={{ position: "relative" }}>
        <MapThumb club={club} width={"100%"} height={96} radius={0} pinSize={28} />
        {/* Favorite star anchored top-left so it doesn't crowd the tier
              ribbon (which sits top-right) and reads as a primary action. */}
        <div style={{ position: "absolute", top: 10, left: 10 }}>
          <FavoriteStar clubId={club.id} size={32} />
        </div>
        <span style={{
          position: "absolute", top: 10, right: 10,
          display: "inline-flex", alignItems: "center", gap: 4,
          height: 22, padding: "0 8px", borderRadius: 8,
          background: "rgba(15,18,20,.88)", color: "#fff",
          fontFamily: theme.display, fontSize: 10, fontWeight: 800, letterSpacing: 0.8, textTransform: "uppercase"
        }}>
          <Icon name="Star" size={9} strokeWidth={3} color="#fff" /> {club.tier} member
        </span>
      </div>

      {/* Card body — same vertical rhythm as BookNowCard: title + rating
            line, then a tag/meta line, then the time-slot grid. */}
      <div style={{ padding: "12px 14px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
        {/* Title + rating row */}
        <div style={{ minWidth: 0 }}>
          <div style={{
            fontFamily: theme.display, fontWeight: 700, fontSize: 14,
            color: "#0F1214", letterSpacing: -0.2,
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
          }}>{club.name}</div>
          <div style={{ marginTop: 4, display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 1 }}>{stars}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#0F1214", fontVariantNumeric: "tabular-nums" }}>{club.rating.toFixed(1)}</span>
            <span style={{ fontSize: 11, color: "#858F8F", fontWeight: 500 }}>({club.reviews})</span>
            <span style={{ color: "#858F8F", fontSize: 11 }}>·</span>
            <span style={{ fontSize: 11, color: "#4B5052", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{club.miles} mi</span>
            <span style={{ color: "#858F8F", fontSize: 11 }}>·</span>
            <span style={{ fontSize: 11, color: "#4B5052", fontWeight: 600 }}>{priceText}</span>
          </div>
          {typeof club.activePlayers === "number" &&
          <div style={{ marginTop: 6, display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 700, color: "#1F8A5B" }}>
              <span style={{ width: 6, height: 6, borderRadius: 999, background: "#1F8A5B", boxShadow: "0 0 0 3px rgba(31,138,91,.18)" }} />
              {club.activePlayers} active now
            </div>
          }
        </div>

        {/* Sport tag + courts meta — mirrors BookNowCard's sport tag + booked-today line */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            height: 22, padding: "0 8px", borderRadius: 8,
            background: theme.softTint || "rgba(15,140,90,.10)",
            color: theme.primary,
            fontSize: 10, fontWeight: 800, letterSpacing: 0.8, textTransform: "uppercase",
            whiteSpace: "nowrap"
          }}>
            {club.sports[0]}
          </span>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            fontSize: 11, color: "#4B5052", fontWeight: 500
          }}>
            <Icon name="Grid" size={10} strokeWidth={2} color="#858F8F" />
            {club.courts} courts
          </span>
        </div>

        {/* Time slots — outlined pills in a 2x2 grid, no eyebrow label.
              Mirrors BookNowCard exactly so both surfaces feel identical. */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginTop: 2 }}>
          {(club.openTimes || ["9:00 AM", "10:30 AM", "1:00 PM", "4:30 PM"]).map((time) =>
          <button key={time} onClick={(e) => {e.stopPropagation();onOpen && onOpen();}} style={{
            height: 32, padding: "0 8px", borderRadius: 8,
            border: `1px solid ${theme.primary}`,
            background: "transparent", color: theme.primary,
            fontFamily: "inherit", fontWeight: 700, fontSize: 12,
            letterSpacing: 0.2,
            cursor: "pointer",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            transition: "background 120ms, color 120ms"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = theme.primary;
            e.currentTarget.style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = theme.primary;
          }}>
              {time}
            </button>
          )}
        </div>

        {/* Subtle secondary action — opens the full club page (events,
              roster, amenities). Sits below the time slots as a tertiary
              link so it doesn't compete with the primary book-a-time action. */}
        <button
          onClick={(e) => {e.stopPropagation();onOpen && onOpen();}}
          style={{
            height: 32, border: 0, background: "transparent",
            display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
            fontFamily: "inherit", fontWeight: 600, fontSize: 12,
            color: "#4B5052",
            cursor: "pointer",
            transition: "color 120ms"
          }}
          onMouseEnter={(e) => {e.currentTarget.style.color = "#0F1214";}}
          onMouseLeave={(e) => {e.currentTarget.style.color = "#4B5052";}}>
          See events & info
          <Icon name="ArrowRight" size={12} strokeWidth={2.2} color="currentColor" />
        </button>
      </div>
    </button>);

}

function MyClubsCarousel({ clubs, theme, onOpenClub, desktop }) {
  const scrollerRef = React.useRef(null);
  if (typeof window !== "undefined" && typeof window.useDragScroll === "function") window.useDragScroll(scrollerRef);
  const scrollBy = (dir) => {
    const el = scrollerRef.current;if (!el) return;
    el.scrollBy({ left: dir * (288 + 14), behavior: "smooth" });
  };
  if (!clubs.length) return null;
  return (
    <div style={{ marginBottom: 32 }}>
      <ListSectionHeader
        theme={theme}
        title="Your Favorite Locations"
        action={desktop && clubs.length > 2 ?
        <span style={{ display: "inline-flex", gap: 6 }}>
            <button onClick={() => scrollBy(-1)} aria-label="Scroll left" style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid #E9EBEC", background: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Icon name="ChevronLeft" size={13} strokeWidth={2.4} />
            </button>
            <button onClick={() => scrollBy(1)} aria-label="Scroll right" style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid #E9EBEC", background: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Icon name="ChevronRight" size={13} strokeWidth={2.4} />
            </button>
          </span> :
        null} />
      
      <div
        ref={scrollerRef}
        style={{
          display: "flex", gap: 12, overflowX: "auto", scrollSnapType: "x mandatory",
          paddingBottom: 4,
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          // On mobile, bleed the track from the page's 16px inset out to
          // the screen edges so cards visibly extend off-screen, signaling
          // more content; padding restores left alignment with the title.
          margin: desktop ? 0 : "0 -16px",
          paddingLeft: desktop ? 0 : 16,
          paddingRight: desktop ? 0 : 16
        }}>
        <style>{`.my-clubs-scroller::-webkit-scrollbar { display: none; }`}</style>
        {clubs.map((c) => <MyClubCard key={c.id} club={c} theme={theme} onOpen={() => onOpenClub && onOpenClub(c.id)} />)}
      </div>
    </div>);

}

// Shared section header pattern lifted from the homepage's BookNow segment:
// an uppercase title at the left, a hairline that fills the remaining space,
// then optional count + action(s) at the right. Replaces the heavier black
// underline-and-baseline-aligned-row used elsewhere in this file, so the
// Find Clubs page reads as a sibling of the dashboard rather than a one-off.
function ListSectionHeader({ theme, title, count, action }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      paddingTop: 8, paddingBottom: 14, marginBottom: 8
    }}>
      <span style={{
        fontFamily: theme.display, fontWeight: 800,
        fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase",
        color: "#0F1214", whiteSpace: "nowrap"
      }}>{title}</span>
      <span style={{ flex: 1, height: 1, background: "#E9EBEC" }} aria-hidden="true" />
      {count &&
      <span style={{ fontSize: 12, color: "#858F8F", fontWeight: 500, whiteSpace: "nowrap" }}>{count}</span>
      }
      {action}
    </div>);

}

// Verified-clubs row of BookNowCards. Hoisted into its own component so hooks
// (useRef + useDragScroll) live at the top level of a stable component, not
// inside an IIFE in the parent's JSX.
function VerifiedClubsCarousel({ theme, desktop, venues, totalSlots, onOpenClub }) {
  const scrollRef = React.useRef(null);
  if (typeof window !== "undefined" && typeof window.useDragScroll === "function") window.useDragScroll(scrollRef);
  return (
    <div style={{ marginBottom: 24 }}>
      <ListSectionHeader theme={theme} title="Play today at verified clubs" count={`${totalSlots} open bookings`} />
      <div ref={scrollRef} style={{
        display: "flex", gap: 12, overflowX: "auto",
        scrollSnapType: "x mandatory",
        paddingBottom: 4, scrollbarWidth: "none",
        // Bleed full-width on mobile (16px page inset); modest -4px on
        // desktop so the cards' shadow doesn't clip on the left.
        margin: desktop ? "0 -4px" : "0 -16px",
        paddingLeft: desktop ? 4 : 16,
        paddingRight: desktop ? 4 : 16
      }}>
        {venues.map((v) =>
        <div key={v.id} style={{ flex: "0 0 280px", scrollSnapAlign: "start", display: "flex" }}>
            <window.BookNowCard v={v} theme={theme} onPickSlot={() => onOpenClub && onOpenClub(v.id)} onOpenClub={() => onOpenClub && onOpenClub(v.id)} />
          </div>
        )}
      </div>
    </div>);

}

function FindClubs({ theme, viewport, onBack, onOpenClub }) {
  const desktop = viewport === "desktop";
  // Subscribe to the favorites store so changes from any card on the
  // page repartition the Your-Favorites carousel and Verified-locations
  // list in real time.
  const favs = useFavorites();
  const isFav = (c) => favs.has(c.id);
  // Filter state — single-value per filter so every control is a clean
  // dropdown. "All sports" / "Any distance" / "Any rating" are the no-op
  // defaults so the page renders the full list on first load.
  const [location, setLocation] = useStateFC(theme.cityTag || "St. Augustine, FL");
  const [activity, setActivity] = useStateFC("Any activity");
  const [distance, setDistance] = useStateFC("Any distance");
  const [rating, setRating] = useStateFC("Any rating");
  const [sort, setSort] = useStateFC("Sort by Recommended");
  const [mapView, setMapView] = useStateFC(true);
  // Distance string → miles cap (Infinity = no cap)
  const distMiles = distance === "Any distance" ?
  Infinity :
  Number(distance.replace(/[^0-9]/g, "")) || Infinity;
  // Rating string → minimum stars
  const ratingMin = rating === "Any rating" ? 0 : Number(rating.replace(/[^\d.]/g, "")) || 0;
  const totalActive =
  (activity !== "All sports" ? 1 : 0) + (
  distance !== "Any distance" ? 1 : 0) + (
  rating !== "Any rating" ? 1 : 0);
  const resetAll = () => {
    setActivity("Any activity");setDistance("Any distance");setRating("Any rating");setSort("Sort by Recommended");
  };
  // ---- Apply filters
  const passes = (c) => {
    if (c.miles > distMiles) return false;
    if (ratingMin && c.rating < ratingMin) return false;
    if (activity !== "Any activity" && !c.sports.includes(activity)) return false;
    return true;
  };
  const filtered = ALL_CLUBS.filter(passes);
  const filtering = totalActive > 0;
  const myClubs = filtering ? [] : filtered.filter(isFav);
  const otherClubs = (filtering ? filtered : filtered.filter((c) => !isFav(c))).
  slice().
  sort((a, b) => {
    if (sort === "Sort by Nearest first") return (a.miles ?? 99) - (b.miles ?? 99);
    if (sort === "Sort by Highest rated") return b.rating - a.rating;
    if (sort === "Sort by Most courts") return b.courts - a.courts;
    // Recommended = on-CR first, then rating, then distance
    if (a.onCR !== b.onCR) return a.onCR ? -1 : 1;
    if (b.rating !== a.rating) return b.rating - a.rating;
    return (a.miles ?? 99) - (b.miles ?? 99);
  });

  return (
    <div style={{ background: "#fff", minHeight: "100%", height: desktop ? "auto" : "100%", fontFamily: "Inter, system-ui, sans-serif", position: "relative", display: desktop ? "block" : "flex", flexDirection: "column" }}>
      {desktop && window.ChromeBar &&
      <window.ChromeBar theme={theme} viewport="desktop" app={null} setApp={() => {}}
      onOpenQR={() => {}} onFindClubs={() => {}}
      active="Reserve"
      onNav={(l) => {if (window.__navigate) window.__navigate(l);}} />
      }
      {/* Top bar — full-width sticky background, but inner content matches
            the same 880px max-width as the page body below so the back button
            and map-view toggle sit aligned with the content edges. */}
      <div style={{
        position: "sticky", top: 0, zIndex: 20,
        background: "#fff", borderBottom: "1px solid #E9EBEC",
        height: desktop ? 64 : 56
      }}>
        <div style={{
          maxWidth: desktop ? 1440 : "100%",
          margin: desktop ? "0 auto" : "0",

          display: "flex", alignItems: "center", gap: 10,
          padding: desktop ? "0 32px" : "0 16px", height: "56px"
        }}>
          <div style={{
            flex: 1, minWidth: 0,
            textAlign: "left", fontFamily: theme.display, fontWeight: 800,
            fontSize: desktop ? 16 : 16, letterSpacing: -0.2,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
          }}>Find a Location</div>
          {/* Segmented Map | List toggle — Airbnb-style pill control. On
                mobile it's the primary view switcher; on desktop it stays
                as a compact utility cluster next to the search affordance. */}
          <div role="tablist" aria-label="View" style={{
            display: "inline-flex", alignItems: "center", height: 32,
            background: "#F4F5F6", borderRadius: 999, padding: 3, gap: 2,
            flexShrink: 0
          }}>
            {[{ k: "map", icon: "Map", label: "Map" }, { k: "list", icon: "List", label: "List" }].map((opt) => {
              const on = mapView === (opt.k === "map");
              return (
                <button key={opt.k} role="tab" aria-selected={on}
                onClick={() => setMapView(opt.k === "map")} style={{
                  height: 26, padding: "0 12px", borderRadius: 999, border: 0,
                  background: on ? "#fff" : "transparent",
                  color: on ? "#0F1214" : "#4B5052",
                  boxShadow: on ? "0 1px 2px rgba(15,18,20,.08), 0 0 0 1px rgba(15,18,20,.04)" : "none",
                  fontFamily: "inherit", fontWeight: on ? 700 : 600, fontSize: 12,
                  display: "inline-flex", alignItems: "center", gap: 5,
                  cursor: "pointer",
                  transition: "background 160ms, color 160ms, box-shadow 160ms"
                }}>
                  <Icon name={opt.icon} size={12} strokeWidth={2.2} color={on ? "#0F1214" : "#4B5052"} />
                  {opt.label}
                </button>);

            })}
          </div>
          {/* Search icon — opens an inline club-name search affordance. Sits
                right of the map toggle so the right-side cluster reads as a
                tidy pair of utility actions. */}
          <button aria-label="Search clubs" style={{
            width: 32, height: 32, borderRadius: 8, border: "1px solid #DEE1E5",
            background: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer"
          }}>
            <Icon name="Search" size={14} strokeWidth={2.2} color="#0F1214" />
          </button>
        </div>
      </div>

      <div style={{ flex: desktop ? "0 1 auto" : "1 1 auto", overflowY: desktop ? "visible" : mapView ? "hidden" : "auto", minHeight: 0, maxWidth: desktop ? mapView ? "none" : 1280 : "100%", margin: desktop ? "0 auto" : "0", padding: desktop ? mapView ? "0" : "32px 32px 64px" : mapView ? "0" : "16px 16px 16px", width: "100%", display: !desktop && mapView ? "flex" : "block", flexDirection: "column" }}>
        {/* Filter bar — modeled on the event-list FilterBarD pattern:
              uppercase-label pills that expand inline + a Sort pill on the
              right, then a Location typeahead pinned at the far right so the
              "clubs near X" header is now an editable control instead of a
              sentence. Replaces the text Search since players hunting for a
              new club rarely know the club name. */}
        {/* When in map view on desktop the bar gets a constrained
              container so it doesn't stretch to the page edges, but the
              ClubsMapView below it goes full-bleed for the edge-to-edge map.
              On mobile in map view we wrap the filter bar in its own padded
              container so the map underneath can be edge-to-edge. */}
        <div style={desktop && mapView ? { maxWidth: 1440, margin: "0 auto", padding: "20px 32px 0" } : !desktop && mapView ? { flexShrink: 0 } : {}}>
          <ClubFilterBar theme={theme} desktop={desktop}
          location={location} setLocation={setLocation}
          activity={activity} setActivity={setActivity}
          distance={distance} setDistance={setDistance}
          rating={rating} setRating={setRating}
          sort={sort} setSort={setSort}
          resetAll={resetAll} totalActive={totalActive} resultCount={filtered.length} />
          
        </div>

        {mapView ?
        <ClubsMapView
          theme={theme} desktop={desktop}
          clubs={[...myClubs, ...otherClubs]}
          onOpenClub={onOpenClub} /> :


        <div>
            {desktop &&
          <React.Fragment>
                <MyClubsCarousel clubs={myClubs} theme={theme} onOpenClub={onOpenClub} desktop={desktop} />
                {/* Verified clubs carousel — horizontal scrolling row of
              BookNowCard tiles (the same shape as the homepage's
              "Available to play now" carousel) showing only clubs
              that are verified on CourtReserve with bookable slots.
              Sits above the full list. Desktop only — on mobile
              member clubs surface inline in the unified list via a
              star/favorite indicator instead, per spec. */}
                {(() => {
              const verified = otherClubs.filter((c) => c.onCR).slice(0, 6);
              if (!verified.length || !window.BookNowCard) return null;
              // Map each club to the BookNowCard "venue" shape so the
              // homepage card can render unmodified.
              const venues = verified.map((c) => ({
                id: c.id,
                name: c.name,
                rating: c.rating, reviews: c.reviews,
                sport: c.sports[0], price: "$".repeat(c.price || 2),
                city: (c.address || "St. Augustine, FL").split(",")[0].trim(),
                state: "FL", zip: "32084",
                booked: 12 + c.id.charCodeAt(0) % 24,
                myClub: c.joined,
                times: c.openTimes || ["9:00 AM", "10:30 AM", "1:00 PM", "4:30 PM"]
              }));
              const totalSlots = venues.reduce((n, v) => n + (v.times ? v.times.length : 0), 0);
              return <VerifiedClubsCarousel theme={theme} desktop={desktop} venues={venues} totalSlots={totalSlots} onOpenClub={onOpenClub} />;
            })()}
              </React.Fragment>
          }
            <ListSectionHeader
            theme={theme}
            title={desktop ? filtering ? "Verified locations" : myClubs.length ? "Verified locations" : "Verified locations" : "Clubs near you"}
            count={`${(desktop ? otherClubs : [...myClubs, ...otherClubs]).length} clubs`} />
          
            <div>{(desktop ? otherClubs : [...myClubs, ...otherClubs]).map((c) => <ClubResultRow key={c.id} club={c} theme={theme} desktop={desktop} onOpen={() => onOpenClub && onOpenClub(c.id)} />)}</div>
          </div>
        }
      </div>
      {!desktop && window.MobileBottomNav &&
      <div style={{ flexShrink: 0 }}>
          <window.MobileBottomNav
          theme={theme}
          flow={true}
          active="clubs"
          onChange={(k) => {if (window.__navigateMobile) window.__navigateMobile(k);else if (onBack) onBack();}} />
        </div>
      }
    </div>);

}

Object.assign(window, { FindClubs, ALL_CLUBS });

// ---- ClubFilterBar ----
// Five-filter bar: Activity / Distance / Rating on the left (3 equal cells),
// Location / Sort on the right (2 equal cells). Both halves are equal width
// at the top level (1fr / 1fr) so the row reads as two balanced groups.
// Every control is a uniform `DropdownPill` that opens a popover of options
// below it — no more inline-expansion panel.
//
// The whole bar sticks to the top of the content scroll once the user
// scrolls past it, so the filters remain reachable while browsing the list.
const ACTIVITY_OPTIONS = ["Any activity", "Tennis", "Pickleball", "Padel", "Platform Tennis"];
const DISTANCE_LABELS = ["Any distance", "Within 5 mi", "Within 10 mi", "Within 25 mi", "Within 50 mi"];
const RATING_LABELS = ["Any rating", "3★+", "3.5★+", "4★+", "4.5★+"];
const LOCATION_OPTIONS = [
"St. Augustine, FL",
"Jacksonville, FL",
"Ponte Vedra, FL",
"Vilano Beach, FL",
"Anastasia Island, FL",
"Atlantic Beach, FL"];

const CLUB_SORT_LABELS = ["Sort by Recommended", "Sort by Nearest first", "Sort by Highest rated", "Sort by Most courts"];

// Generic dropdown control — uppercase label + current value + chevron, with
// a popover menu below. Variants tweak the visual treatment for the title
// (uppercase eyebrow) and chevron, but the dropdown mechanic is shared so
// every filter on the bar behaves identically.
function DropdownPill({ label, icon, value, options, onChange, theme }) {
  const t = theme.t || {};
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {if (ref.current && !ref.current.contains(e.target)) setOpen(false);};
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);
  const isDefault = options[0] === value;
  return (
    <div ref={ref} style={{ position: "relative", display: "flex", minWidth: 0 }}>
      <button onClick={() => setOpen((v) => !v)} style={{
        flex: 1, minWidth: 0,
        display: "inline-flex", alignItems: "center", gap: 10,
        height: 48, padding: "0 14px",
        background: open ? "#F4F5F6" : "transparent", border: 0,
        cursor: "pointer", fontFamily: "inherit",
        textAlign: "left",
        transition: "background 120ms"
      }}>
        {icon && <Icon name={icon} size={14} strokeWidth={2} color="#858F8F" />}
        {/* Eyebrow label is optional — when absent, the value (which is
              either the live selection or the default watermark) takes the
              full vertical height so the pill reads as a single label, not
              a header+caption stack. */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 1, minWidth: 0, flex: 1 }}>
          {label &&
          <span style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 9, letterSpacing: 1.2, textTransform: "uppercase", color: "#858F8F" }}>{label}</span>
          }
          <span style={{
            fontSize: label ? 13 : 14,
            fontWeight: 700,
            color: "#0F1214",
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "100%"
          }}>{value}</span>
        </div>
        <span style={{ display: "inline-flex", transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 180ms", flexShrink: 0 }}>
          <Icon name="ChevronDown" size={12} color="#858F8F" strokeWidth={2.4} />
        </span>
      </button>
      {open &&
      <div style={{
        position: "absolute", top: "calc(100% + 6px)", left: 0, minWidth: "100%", maxWidth: 320, zIndex: 30,
        background: "#fff", border: "1px solid #E9EBEC", borderRadius: 8,
        boxShadow: "0 12px 32px rgba(15,18,20,.12), 0 2px 6px rgba(15,18,20,.04)",
        padding: 6
      }}>
          {options.map((o) => {
          const on = o === value;
          return (
            <button key={o} onClick={() => {onChange(o);setOpen(false);}} style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
              padding: "10px 12px", borderRadius: 8, border: 0,
              background: on ? "#F4F5F6" : "transparent", color: "#0F1214",
              cursor: "pointer", fontFamily: "inherit", textAlign: "left",
              fontSize: 13, fontWeight: on ? 700 : 600,
              whiteSpace: "nowrap"
            }}
            onMouseEnter={(e) => {if (!on) e.currentTarget.style.background = "#F4F5F6";}}
            onMouseLeave={(e) => {if (!on) e.currentTarget.style.background = "transparent";}}>
                <span>{o}</span>
                {on && <Icon name="Check" size={12} strokeWidth={2.6} color={theme.primary} />}
              </button>);

        })}
        </div>
      }
    </div>);

}

// LocationTypeahead — same chrome as DropdownPill (uppercase eyebrow above
// the value) but the value is an editable input. As the user types, the
// popover shows matching suggestions; no chevron, since the affordance is
// "type to search" rather than "tap to expand".
function LocationTypeahead({ label, icon, value, options, onChange, theme }) {
  const [open, setOpen] = React.useState(false);
  const [draft, setDraft] = React.useState(value);
  const ref = React.useRef(null);
  // Keep draft in sync when value changes from outside (e.g. reset).
  React.useEffect(() => {setDraft(value);}, [value]);
  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        // Commit draft on outside click so the input doesn't drift from
        // the canonical value.
        if (draft !== value) onChange(draft);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open, draft, value, onChange]);
  const q = draft.trim().toLowerCase();
  const filtered = q.length === 0 ?
  options :
  options.filter((o) => o.toLowerCase().includes(q));
  return (
    <div ref={ref} style={{ position: "relative", display: "flex", minWidth: 0 }}>
      <label style={{
        flex: 1, minWidth: 0,
        display: "inline-flex", alignItems: "center", gap: 10,
        height: 48, padding: "0 14px",
        background: open ? "#F4F5F6" : "transparent",
        cursor: "text", fontFamily: "inherit",
        transition: "background 120ms"
      }}>
        {icon && <Icon name={icon} size={14} strokeWidth={2} color="#858F8F" />}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 1, minWidth: 0, flex: 1 }}>
          {label &&
          <span style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 9, letterSpacing: 1.2, textTransform: "uppercase", color: "#858F8F" }}>{label}</span>
          }
          <input
            value={draft}
            onChange={(e) => {setDraft(e.target.value);setOpen(true);}}
            onFocus={() => setOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                const first = filtered[0];
                if (first) {onChange(first);setDraft(first);} else
                onChange(draft);
                setOpen(false);
              } else if (e.key === "Escape") {
                setDraft(value);setOpen(false);
              }
            }}
            placeholder="Type city or ZIP…"
            style={{
              width: "100%", minWidth: 0,
              border: 0, outline: 0, padding: 0,
              background: "transparent",
              fontFamily: "inherit", fontSize: 13, fontWeight: 600,
              color: "#0F1214"
            }} />
        </div>
      </label>
      {open && filtered.length > 0 &&
      <div style={{
        position: "absolute", top: "calc(100% + 6px)", left: 0, minWidth: "100%", maxWidth: 360, zIndex: 30,
        background: "#fff", border: "1px solid #E9EBEC", borderRadius: 8,
        boxShadow: "0 12px 32px rgba(15,18,20,.12), 0 2px 6px rgba(15,18,20,.04)",
        padding: 6
      }}>
          {filtered.map((o) => {
          const on = o === value;
          return (
            <button key={o} onClick={() => {onChange(o);setDraft(o);setOpen(false);}} style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
              padding: "10px 12px", borderRadius: 8, border: 0,
              background: on ? "#F4F5F6" : "transparent", color: "#0F1214",
              cursor: "pointer", fontFamily: "inherit", textAlign: "left",
              fontSize: 13, fontWeight: on ? 700 : 600,
              whiteSpace: "nowrap"
            }}
            onMouseEnter={(e) => {if (!on) e.currentTarget.style.background = "#F4F5F6";}}
            onMouseLeave={(e) => {if (!on) e.currentTarget.style.background = "transparent";}}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                  <Icon name="MapPin" size={12} strokeWidth={2} color="#858F8F" />
                  {o}
                </span>
                {on && <Icon name="Check" size={12} strokeWidth={2.6} color={theme.primary} />}
              </button>);

        })}
        </div>
      }
    </div>);

}

function ClubFilterBar({
  theme, desktop,
  location, setLocation,
  activity, setActivity,
  distance, setDistance,
  rating, setRating,
  sort, setSort,
  resetAll, totalActive, resultCount
}) {
  // Track whether the bar is "stuck" — when the original (in-flow) position
  // has scrolled past the top of the page, we render a fixed-position clone
  // at the very top so the filters stay reachable while scrolling the list.
  const sentinelRef = React.useRef(null);
  const [stuck, setStuck] = React.useState(false);
  React.useEffect(() => {
    const el = sentinelRef.current;if (!el) return;
    const io = new IntersectionObserver(
      (entries) => setStuck(!entries[0].isIntersecting),
      // Top of the viewport (we float right at the very top once the
      // sentinel scrolls offscreen).
      { rootMargin: "0px 0px 0px 0px", threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const renderBar = (floating) => desktop ?
  // Desktop — single row with all three filters side by side.
  <div style={{
    display: "grid",
    gridTemplateColumns: "1.4fr 1fr 1fr",
    gap: 10
  }}>
      <div style={{ background: "#fff", border: "1px solid #E9EBEC", borderRadius: 8 }}>
        <LocationTypeahead icon="MapPin" value={location} options={LOCATION_OPTIONS} onChange={setLocation} theme={theme} />
      </div>
      <div style={{ background: "#fff", border: "1px solid #E9EBEC", borderRadius: 8 }}>
        <DropdownPill value={activity} options={ACTIVITY_OPTIONS} onChange={setActivity} theme={theme} />
      </div>
      <div style={{ background: "#fff", border: "1px solid #E9EBEC", borderRadius: 8 }}>
        <DropdownPill value={sort} options={CLUB_SORT_LABELS} onChange={setSort} theme={theme} />
      </div>
    </div> :

  // Mobile — Location on its own top line, Activity + Sort sharing the
  // second line. Two lines keeps each control wide enough to read on a
  // phone-width frame.
  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ background: "#fff", border: "1px solid #E9EBEC", borderRadius: 8 }}>
        <LocationTypeahead icon="MapPin" value={location} options={LOCATION_OPTIONS} onChange={setLocation} theme={theme} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <div style={{ background: "#fff", border: "1px solid #E9EBEC", borderRadius: 8 }}>
          <DropdownPill value={activity} options={ACTIVITY_OPTIONS} onChange={setActivity} theme={theme} />
        </div>
        <div style={{ background: "#fff", border: "1px solid #E9EBEC", borderRadius: 8 }}>
          <DropdownPill value={sort} options={CLUB_SORT_LABELS} onChange={setSort} theme={theme} />
        </div>
      </div>
    </div>;


  return (
    <React.Fragment>
      {/* Sticky filter bar — anchored just below the page header.
            Sits flush within its container; the container itself supplies
            page-edge padding so we don't need negative margins here. */}
      <div style={{
        position: "sticky", top: 0, zIndex: 25,
        background: "#fff",
        marginBottom: 14,
        paddingTop: 12, paddingBottom: 12,
        borderBottom: "1px solid #E9EBEC"
      }}>
        {renderBar(false)}
      </div>
    </React.Fragment>);

}


// ---- Airbnb-inspired map-forward view -----------------------------------
// Desktop: 60/40 split — scrollable card grid on the left, sticky stylized
// map on the right with positioned price/active pins. Mobile: full-bleed
// map at the top, horizontal carousel of compact cards along the bottom.
// Hovering or selecting a card highlights its pin, and vice versa.
function ClubsMapView({ theme, desktop, clubs, onOpenClub }) {
  const [active, setActive] = React.useState(clubs[0] && clubs[0].id);
  const cardRefs = React.useRef({});
  // Keep `active` valid if the filtered list changes underneath us.
  React.useEffect(() => {
    if (!clubs.find((c) => c.id === active)) setActive(clubs[0] && clubs[0].id);
  }, [clubs, active]);
  const focus = (id) => {
    setActive(id);
    const el = cardRefs.current[id];
    if (el && el.scrollIntoView) el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
  };
  if (desktop) {
    return (
      <div style={{
        display: "grid", gridTemplateColumns: "3fr 2fr",
        gap: 0,
        alignItems: "stretch",
        minHeight: "calc(100vh - 200px)"
      }}>
        {/* Left — "Your clubs" carousel at the top + 3-column Airbnb-
              style card grid below. Wider container with edge-to-edge
              alignment so 3 cards fit comfortably. Padding tuned so all
              children (carousel + grid) share the same horizontal inset. */}
        <div style={{
          padding: "20px 24px 64px 32px",
          maxWidth: 1080,
          minWidth: 0
        }}>
          {(() => {
            const myClubs = clubs.filter((c) => c.joined);
            if (!myClubs.length) return null;
            return (
              <MyClubsCarousel clubs={myClubs} theme={theme} onOpenClub={onOpenClub} desktop={true} />);

          })()}
          <ListSectionHeader
            theme={theme}
            title="Verified locations"
            count={`${clubs.length} clubs`} />
          
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20,
            alignContent: "start"
          }}>
            {clubs.map((c) =>
            <div key={c.id} ref={(el) => {cardRefs.current[c.id] = el;}}>
                <ClubMapCard
                club={c} theme={theme}
                active={active === c.id}
                onHover={() => setActive(c.id)}
                onOpen={() => onOpenClub && onOpenClub(c.id)} />
              
              </div>
            )}
          </div>
        </div>
        {/* Right — edge-to-edge sticky map. No border-radius so it
              visually fuses to the page edge. Pans toward the active
              club's pin so hover focuses the map context. */}
        <div style={{
          position: "sticky", top: 140,
          alignSelf: "start",
          height: "calc(100vh - 180px)", minHeight: 540, maxHeight: 860,
          borderLeft: "1px solid #E9EBEC",
          overflow: "hidden"
        }}>
          <StylizedMap clubs={clubs} active={active} onSelect={focus} theme={theme} panToActive={true} />
        </div>
      </div>);

  }
  // Mobile — map fills the top, card carousel pinned at the bottom.
  // Scroll detection wires the carousel to the map: as the user swipes
  // through cards, the centered card sets `active`, which in turn pans
  // the StylizedMap to that club's pin.
  // Mobile — Google Maps pattern: full-bleed map with pins; tapping a pin
  // raises a bottom sheet for that club. No more carousel — only one
  // preview is visible at a time, dismissed via the X or a tap on the map.
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const openClub = (id) => {setActive(id);setSheetOpen(true);};
  const activeClub = clubs.find((c) => c.id === active);
  return (
    <div style={{
      position: "relative",
      // Parent (FindClubs body wrapper) is a flex column in mobile map
      // view, so flex:1 stretches us into the available vertical space.
      flex: 1, minHeight: 420,
      borderRadius: 0, overflow: "hidden"
    }}>
      <StylizedMap clubs={clubs} active={active} onSelect={openClub} theme={theme} panToActive={true} />
      {/* Bottom sheet — slides up when a pin is tapped. Mirrors Google
            Maps' tap-to-preview pattern. */}
      {sheetOpen && activeClub &&
      <React.Fragment>
          {/* Tap-anywhere-else scrim, subtle so the map stays readable */}
          <div onClick={() => setSheetOpen(false)} style={{
          position: "absolute", inset: 0,
          background: "transparent",
          zIndex: 5
        }} />
          <div style={{
          position: "absolute", left: 0, right: 0, bottom: 0,
          background: "#fff",
          borderTopLeftRadius: 16, borderTopRightRadius: 16,
          padding: "8px 14px 18px",
          boxShadow: "0 -10px 30px rgba(15,18,20,.18), 0 -2px 6px rgba(15,18,20,.08)",
          animation: "sheetIn 240ms cubic-bezier(.2,.8,.2,1)",
          zIndex: 6
        }}>
            <style>{`@keyframes sheetIn { from { transform: translateY(24px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>
            {/* Drag handle (visual only) */}
            <div style={{ width: 38, height: 4, borderRadius: 999, background: "#DEE1E5", margin: "4px auto 10px" }} />
            <button onClick={() => setSheetOpen(false)} aria-label="Close" style={{
            position: "absolute", top: 10, right: 12,
            width: 28, height: 28, borderRadius: 999, border: 0, background: "#F4F5F6",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", zIndex: 1
          }}>
              <Icon name="X" size={14} strokeWidth={2.2} color="#0F1214" />
            </button>
            <ClubMapCardCompact
            club={activeClub} theme={theme}
            active={true} flush={true}
            onSelect={() => {}}
            onOpen={() => onOpenClub && onOpenClub(activeClub.id)} />
          
          </div>
        </React.Fragment>
      }
    </div>);

}

// Stylized map canvas — faux land/water/streets + positioned pins.
// Pins read as Airbnb-style price pills: active state turns the pill
// black-on-white with a black outline. With `panToActive`, the world
// content (background + pins) translates so the active pin animates
// towards the viewport center — gives the map a "centering" feel as
// the user swipes through the carousel.
function StylizedMap({ clubs, active, onSelect, theme, panToActive = false }) {
  const activeClub = panToActive ? clubs.find((c) => c.id === active) : null;
  // Translate factor — partial center so cards near the edge of the world
  // don't push the map fully out of frame. ±~25% feels natural.
  const dx = activeClub ? (0.5 - (activeClub.lng ?? 0.5)) * 50 : 0;
  const dy = activeClub ? (0.5 - (activeClub.lat ?? 0.5)) * 50 : 0;
  return (
    <div style={{
      position: "relative", width: "100%", height: "100%",
      background: "#E7EFE5", // pale map-paper green
      overflow: "hidden"
    }}>
      <div style={{
        position: "absolute", inset: "-25%",
        transform: `translate(${dx}%, ${dy}%)`,
        transition: "transform 420ms cubic-bezier(.2,.8,.2,1)",
        willChange: "transform"
      }}>
        {/* Subtle texture — water blob + land outline + a few roads. Pure SVG
              so it stays crisp at any size. */}
        <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        {/* Water mass on the right (ocean) */}
        <path d="M70 -5 Q 80 20 76 45 Q 84 70 78 105 L 110 110 L 110 -10 Z" fill="#CFE0F2" opacity={0.85} />
        {/* Inland water blob */}
        <ellipse cx="22" cy="78" rx="14" ry="8" fill="#CFE0F2" opacity={0.7} />
        {/* Park */}
        <ellipse cx="42" cy="22" rx="16" ry="10" fill="#CFE7DA" opacity={0.85} />
        {/* Roads — a couple of low-contrast cross streets */}
        {[18, 36, 54, 72].map((y) =>
          <line key={"h" + y} x1="-5" y1={y + y % 7} x2="105" y2={y + y % 5} stroke="#FFFFFF" strokeWidth="1.6" />
          )}
        {[14, 30, 50, 68, 84].map((x) =>
          <line key={"v" + x} x1={x + x % 6} y1="-5" x2={x + x % 4} y2="105" stroke="#FFFFFF" strokeWidth="1.4" />
          )}
        {/* "You are here" marker — a soft pulsing dot in the center */}
        <circle cx="50" cy="50" r="3" fill="#1F4ED8" />
        <circle cx="50" cy="50" r="8" fill="#1F4ED8" opacity={0.15} />
      </svg>
      {/* Pins — Google-Maps-style colored chips with the club name. Tapping
                a pin sets it active (and on mobile opens the bottom sheet); the
                chip styling flips so the active pin reads as the foregrounded
                one. Member clubs get a gold star prefix as their "your place"
                indicator (replaces the older "Your clubs" carousel concept). */}
      {clubs.map((c) => {
          const isActive = c.id === active;
          const left = `${(c.lng ?? 0.5) * 100}%`;
          const top = `${(c.lat ?? 0.5) * 100}%`;
          const pinColor = c.color || "#0F1214";
          return (
            <button key={c.id}
            onClick={(e) => {e.stopPropagation();onSelect(c.id);}}
            onMouseEnter={() => onSelect(c.id)}
            style={{
              position: "absolute", left, top,
              transform: "translate(-50%, -100%)",
              zIndex: isActive ? 10 : 1,
              padding: 0, border: 0, background: "transparent", cursor: "pointer"
            }}>
            <span style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                height: 28, padding: "0 11px", borderRadius: 999,
                background: isActive ? pinColor : "#fff",
                color: isActive ? "#fff" : pinColor,
                border: `1.5px solid ${pinColor}`,
                fontFamily: theme.display, fontWeight: 800, fontSize: 11, letterSpacing: -0.1,
                boxShadow: isActive ?
                "0 8px 20px rgba(15,18,20,.30), 0 2px 6px rgba(15,18,20,.18)" :
                "0 2px 6px rgba(15,18,20,.18)",
                transform: isActive ? "scale(1.08)" : "scale(1)",
                transition: "transform 140ms cubic-bezier(.2,.8,.2,1), background 140ms, color 140ms, box-shadow 140ms",
                whiteSpace: "nowrap",
                maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis"
              }}>
              {/* Filled gold star marks member-club pins as the player's
                        "your places" without a separate "Your clubs" section. */}
              {c.joined &&
                <svg width="10" height="10" viewBox="0 0 24 24" fill="#F2A93B" style={{ flexShrink: 0 }} aria-hidden>
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77 5.82 21l1.18-6.88-5-4.87 6.91-1.01z" />
                </svg>
                }
              <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{c.name}</span>
            </span>
            {/* Pin tail — small triangle anchors the chip to the precise
                      map location, matching Google Maps' label-with-tail style. */}
            <span aria-hidden style={{
                display: "block",
                width: 0, height: 0,
                borderLeft: "5px solid transparent",
                borderRight: "5px solid transparent",
                borderTop: `7px solid ${isActive ? pinColor : "#fff"}`,
                filter: isActive ? "none" : `drop-shadow(0 1px 0 ${pinColor})`,
                margin: "0 auto"
              }} />
          </button>);

        })}
      </div>
      {/* Map attribution + zoom controls — visual chrome only,
            rendered OUTSIDE the panning region so they don't move with
            the world when the active club changes. */}
      <div style={{
        position: "absolute", right: 10, top: 10,
        display: "flex", flexDirection: "column", gap: 4,
        zIndex: 4
      }}>
        {[["Plus"], ["Minus"]].map(([icon]) =>
        <button key={icon} aria-label={icon} style={{
          width: 32, height: 32, borderRadius: 6,
          background: "#fff", border: "1px solid #DEE1E5",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 1px 2px rgba(15,18,20,.08)", cursor: "pointer"
        }}>
            <Icon name={icon} size={14} strokeWidth={2.4} color="#0F1214" />
          </button>
        )}
      </div>
    </div>);

}

// ClubMapCard — Airbnb-positioned card but styled to match the homepage's
// BookNowCard / MyClubCard pattern (map header + title row + sport tag +
// time-slot grid). Sits in the desktop map-view's 3-column grid; hovering
// pans the map to this club's pin.
function ClubMapCard({ club, theme, active, onHover, onOpen }) {
  // Star icon row — sized down to read as metadata.
  const stars = (() => {
    const full = Math.floor(club.rating);
    const half = club.rating - full >= 0.4 && club.rating - full < 0.9;
    const out = [];
    for (let i = 0; i < 5; i++) {
      let fill = "#E9EBEC";
      if (i < full) fill = "#FFB400";else
      if (i === full && half) fill = "#FFB400";
      out.push(
        <svg key={i} width="11" height="11" viewBox="0 0 24 24" fill={fill} style={{ flexShrink: 0 }}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77 5.82 21l1.18-6.88-5-4.87 6.91-1.01z" />
        </svg>
      );
    }
    return out;
  })();
  const priceText = "$".repeat(club.price || 1);
  return (
    <button
      onClick={onOpen}
      onMouseEnter={onHover}
      style={{
        width: "100%", padding: 0,
        background: "#fff",
        border: active ? "1.5px solid #0F1214" : "1px solid #E9EBEC",
        borderRadius: 12,
        cursor: "pointer", fontFamily: "inherit", textAlign: "left",
        display: "flex", flexDirection: "column", overflow: "hidden",
        boxShadow: active ? "0 8px 24px rgba(15,18,20,.10)" : "0 1px 2px rgba(15,18,20,.04)",
        transition: "transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease",
        color: "#0F1214"
      }}
      onMouseLeave={(e) => {e.currentTarget.style.transform = "translateY(0)";}}
      onFocus={(e) => {e.currentTarget.style.transform = "translateY(-2px)";}}>
      
      {/* Active-now badge anchored top-left. Verified ribbon removed
            from the card — the entire desktop list section is now titled
            "Verified locations" so a per-card pill would be redundant. */}
      <div style={{ position: "relative" }}>
        <MapThumb club={club} width={"100%"} height={108} radius={0} pinSize={32} />
        {/* Favorite star pinned top-right of every map card on the Find
              Clubs page. Tap to favorite — the card jumps up to the
              "Your Favorite Locations" section on the next render. */}
        <div style={{ position: "absolute", top: 10, right: 10 }}>
          <FavoriteStar clubId={club.id} size={32} />
        </div>
        {typeof club.activePlayers === "number" &&
        <span style={{
          position: "absolute", top: 10, left: 10,
          display: "inline-flex", alignItems: "center", gap: 6,
          height: 24, padding: "0 9px", borderRadius: 999,
          background: "rgba(255,255,255,.96)", color: "#0F1214",
          fontFamily: theme.display, fontWeight: 800, fontSize: 10, letterSpacing: 0.3,
          boxShadow: "0 2px 6px rgba(15,18,20,.12)"
        }}>
            <span style={{ width: 6, height: 6, borderRadius: 999, background: "#1F8A5B", boxShadow: "0 0 0 3px rgba(31,138,91,.20)" }} />
            {club.activePlayers} active
          </span>
        }
      </div>
      {/* Body — same vertical rhythm as MyClubCard: title + rating, then
            tag/meta line, then time-slot grid, then a soft tertiary link. */}
      <div style={{ padding: "12px 14px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{
            fontFamily: theme.display, fontWeight: 700, fontSize: 14,
            color: "#0F1214", letterSpacing: -0.2,
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
          }}>{club.name}</div>
          <div style={{ marginTop: 4, display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 1 }}>{stars}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#0F1214", fontVariantNumeric: "tabular-nums" }}>{club.rating.toFixed(1)}</span>
            <span style={{ fontSize: 11, color: "#858F8F", fontWeight: 500 }}>({club.reviews})</span>
            <span style={{ color: "#858F8F", fontSize: 11 }}>·</span>
            <span style={{ fontSize: 11, color: "#4B5052", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{club.miles} mi</span>
            <span style={{ color: "#858F8F", fontSize: 11 }}>·</span>
            <span style={{ fontSize: 11, color: "#4B5052", fontWeight: 600 }}>{priceText}</span>
          </div>
        </div>
        {/* Sport tag + distance + courts meta row */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            height: 22, padding: "0 8px", borderRadius: 8,
            background: theme.softTint || "rgba(15,140,90,.10)",
            color: theme.primary,
            fontSize: 10, fontWeight: 800, letterSpacing: 0.8, textTransform: "uppercase",
            whiteSpace: "nowrap"
          }}>
            {club.sports[0]}
          </span>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            fontSize: 11, color: "#4B5052", fontWeight: 500
          }}>
            <Icon name="Grid" size={10} strokeWidth={2} color="#858F8F" />
            {club.courts} courts
          </span>
        </div>
        {/* Time slots — only shown for member clubs where we know the
              availability. For non-member clubs we don't know specific
              times, so we replace the slot grid with a single outlined
              "See events and info" button. */}
        {club.joined ?
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginTop: 2 }}>
            {(club.openTimes || ["9:00 AM", "10:30 AM", "1:00 PM", "4:30 PM"]).slice(0, 4).map((time) =>
          <span key={time} style={{
            height: 30, padding: "0 8px", borderRadius: 8,
            border: `1px solid ${theme.primary}`,
            background: "transparent", color: theme.primary,
            fontFamily: "inherit", fontWeight: 700, fontSize: 12,
            letterSpacing: 0.2,
            display: "inline-flex", alignItems: "center", justifyContent: "center"
          }}>
                {time}
              </span>
          )}
          </div> :

        <button
          onClick={(e) => {e.stopPropagation();onOpen && onOpen();}}
          style={{
            marginTop: 2,
            height: 36, borderRadius: 8,
            border: "1px solid #E9EBEC",
            background: "transparent", color: "#0F1214",
            fontFamily: "inherit", fontWeight: 600, fontSize: 12,
            cursor: "pointer",
            display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
            transition: "border-color 120ms, background 120ms"
          }}
          onMouseEnter={(e) => {e.currentTarget.style.borderColor = "#0F1214";}}
          onMouseLeave={(e) => {e.currentTarget.style.borderColor = "#E9EBEC";}}>
            See events and info
            <Icon name="ArrowRight" size={12} strokeWidth={2.2} color="currentColor" />
          </button>
        }
        {/* Tertiary link — only for member clubs where the slot grid is
              the primary action and the link is supplementary. Non-member
              cards already use a single outlined button above. */}
        {club.joined &&
        <div style={{
          marginTop: 2, paddingTop: 8,
          borderTop: "1px solid #E9EBEC",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          fontSize: 12, fontWeight: 600, color: "#4B5052"
        }}>
            <span>See events & info</span>
            <Icon name="ArrowRight" size={12} strokeWidth={2.2} color="currentColor" />
          </div>
        }
      </div>
    </button>);

}

// Mobile compact card for the floating bottom carousel — matches the
// ClubResultRow design language (map thumb, title + tier, social proof
// meta line, amenity chips, rating + price + Book row) but rendered as a
// floating card. Sized to peek as 86% of the viewport so the next card's
// edge hints at horizontal swipe.
function ClubMapCardCompact({ club, theme, active, onSelect, onOpen, flush = false }) {
  useFavorites();
  return (
    <div onClick={onSelect} style={{
      flex: 1, position: "relative", display: "flex", flexDirection: "column", gap: 10,
      padding: flush ? 0 : 12, background: flush ? "transparent" : "#fff",
      borderRadius: flush ? 0 : 12,
      border: flush ? 0 : active ? "1.5px solid #0F1214" : "1px solid #E9EBEC",
      boxShadow: flush ? "none" : "0 8px 24px rgba(15,18,20,.14), 0 2px 6px rgba(15,18,20,.06)",
      cursor: "pointer",
      minWidth: 0
    }}>
      {/* Favorite star — top-right of the compact card. On the bottom
            sheet (flush=true) the parent sheet provides its own close X
            on the right; place the star next to the X by offsetting it. */}
      <div style={{ position: "absolute", top: flush ? 0 : 8, right: flush ? 40 : 8 }}>
        <FavoriteStar clubId={club.id} size={32} />
      </div>
      {/* Header row — map thumb + identity stack */}
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start", minWidth: 0 }}>
        <MapThumb club={club} width={56} height={56} radius={8} pinSize={22} />
        <div style={{ minWidth: 0, flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", minWidth: 0 }}>
            <span style={{
              fontFamily: theme.display, fontWeight: 700, fontSize: 15,
              color: "#0F1214", letterSpacing: -0.2, lineHeight: "18px",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0
            }}>{club.name}</span>
            {club.joined &&
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 4,
              height: 18, padding: "0 6px 0 4px", borderRadius: 6,
              background: theme.softTint, color: theme.primary,
              fontFamily: theme.display, fontSize: 9, fontWeight: 800,
              letterSpacing: 0.6, textTransform: "uppercase", flexShrink: 0
            }}>
                <svg width="9" height="9" viewBox="0 0 24 24" fill={theme.primary} style={{ flexShrink: 0 }} aria-hidden>
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77 5.82 21l1.18-6.88-5-4.87 6.91-1.01z" />
                </svg>
                {club.tier}
              </span>
            }
          </div>
          {/* Social-proof + courts meta */}
          <div style={{
            fontSize: 11, color: "#4B5052", fontWeight: 500,
            display: "flex", alignItems: "center", gap: 6, flexWrap: "nowrap",
            overflow: "hidden", whiteSpace: "nowrap"
          }}>
            {typeof club.activePlayers === "number" &&
            <>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "#1F8A5B", fontWeight: 700, flexShrink: 0 }}>
                  <span style={{ width: 5, height: 5, borderRadius: 999, background: "#1F8A5B", boxShadow: "0 0 0 2px rgba(31,138,91,.20)" }} />
                  {club.activePlayers} active
                </span>
                <span style={{ color: "#DEE1E5", flexShrink: 0 }}>·</span>
              </>
            }
            <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
              {club.courts} courts · {club.sports.join(" · ")}
            </span>
          </div>
          {/* Address — Google Maps places-card pattern: pin glyph followed
                by the street address. Sits beneath the meta line so the
                location is the second thing the eye lands on. */}
          {club.address &&
          <div style={{
            marginTop: 2,
            fontSize: 11, color: "#4B5052", fontWeight: 500,
            display: "flex", alignItems: "center", gap: 6,
            overflow: "hidden", whiteSpace: "nowrap"
          }}>
              <Icon name="MapPin" size={11} strokeWidth={2} color="#858F8F" />
              <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{club.address}</span>
            </div>
          }
        </div>
      </div>

      {/* Amenity chip row — leads with Verified, then up to 2 amenity tags. */}
      {(club.onCR || club.tags && club.tags.length > 0) &&
      <div style={{ display: "flex", flexWrap: "nowrap", gap: 6, overflow: "hidden", alignItems: "center" }}>
          {club.onCR &&
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 4,
          height: 22, padding: "0 8px", borderRadius: 8,
          background: "#E7F2EC", color: "#1F8A5B",
          fontFamily: theme.display, fontSize: 10, fontWeight: 800, letterSpacing: 0.8, textTransform: "uppercase",
          whiteSpace: "nowrap", flexShrink: 0
        }}>
              <Icon name="Check" size={9} strokeWidth={3} color="#1F8A5B" /> Verified
            </span>
        }
          {(club.tags || []).slice(0, 2).map((tag) =>
        <span key={tag} style={{
          display: "inline-flex", alignItems: "center", height: 22, padding: "0 10px",
          borderRadius: 8, background: "#F4F5F6", color: "#4B5052",
          fontSize: 11, fontWeight: 600, whiteSpace: "nowrap", flexShrink: 0
        }}>{tag}</span>
        )}
        </div>
      }

      {/* Bottom row — rating on the left, Book button on the right. */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
        borderTop: "1px solid #E9EBEC", paddingTop: 10
      }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
            <span style={{ color: "#F2A93B", fontSize: 13 }}>★</span>
            <span style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 13, color: "#0F1214", fontVariantNumeric: "tabular-nums", letterSpacing: -0.2 }}>{club.rating.toFixed(1)}</span>
            <span style={{ fontSize: 11, color: "#858F8F", fontWeight: 500 }}>({club.reviews})</span>
          </span>
          <span style={{ width: 3, height: 3, borderRadius: 8, background: "#DEE1E5" }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: "#4B5052", fontVariantNumeric: "tabular-nums" }}>{club.miles} mi</span>
          <span style={{ width: 3, height: 3, borderRadius: 8, background: "#DEE1E5" }} />
          <span style={{ display: "inline-flex", alignItems: "center", fontFamily: theme.display, fontWeight: 800, fontSize: 12, letterSpacing: 0.3 }}>
            {[1, 2, 3, 4].map((i) =>
            <span key={i} style={{ color: i <= (club.price || 1) ? "#0F1214" : "#DEE1E5" }}>$</span>
            )}
          </span>
        </div>
        <button onClick={(e) => {e.stopPropagation();onOpen && onOpen();}} style={{
          height: 32, padding: "0 14px", borderRadius: 8, border: 0,
          background: "#0F1214", color: "#fff",
          fontFamily: "inherit", fontWeight: 600, fontSize: 12, cursor: "pointer",
          display: "inline-flex", alignItems: "center", gap: 6, whiteSpace: "nowrap"
        }}>
          Book <Icon name="ArrowRight" size={11} color="#fff" strokeWidth={2.5} />
        </button>
      </div>
    </div>);

}

Object.assign(window, { ClubsMapView });