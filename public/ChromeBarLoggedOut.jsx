// ChromeBarLoggedOut.jsx — chrome variant for the logged-out CourtReserve home.
// ----------------------------------------------------------------------------
// Minimal logged-out chrome: brandmark on the left, Sign In on the right.
// The center nav and Sign Up affordances were removed — the bottom action
// bar covers primary actions and signed-out users can't switch clubs (so
// the caret next to CourtReserve was dropped too). The same layout works
// on desktop and mobile; sizes shift slightly to fit narrow viewports.
// ChromeBar (in Apps.jsx) delegates to this when app === "cr".
// ----------------------------------------------------------------------------

const { useState: useStateCBLO, useEffect: useEffectCBLO } = React;

function ChromeBarLoggedOut({ theme, viewport = "desktop", active = "Reserve Now", onNav, searchValues }) {
  const desktop = viewport === "desktop";

  // Scroll-driven chrome swap: once the user scrolls past the hero
  // SearchBar, the center tabs hide and a compact search pill
  // appears in their place — keeping the primary filter affordance
  // always reachable as the page scrolls. Threshold of 200px clears
  // the hero title + the search bar above the fold so the swap
  // happens after the user is genuinely past the hero. Disabled on
  // mobile (mobile uses its own sticky chrome strategy).
  const [scrolled, setScrolled] = useStateCBLO(false);
  useEffectCBLO(() => {
    if (!desktop || typeof window === "undefined") return;
    const onScroll = () => setScrolled(window.scrollY > 200);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [desktop]);

  // Compact filter summary, derived from the live SearchBar values
  // passed from the parent (DashboardDesktop). Falls back to the
  // defaults when no values are provided so the pill always shows
  // something readable.
  const v = searchValues || {};
  const summary = [
    v.where || "Anywhere",
    v.activity || "Any Sport",
    v.when || "Any Day",
    v.who || "1 Player",
  ].join(" · ");
  // Color tokens read from the Pickle Pixels alias layer so the chrome
  // re-themes automatically when <html data-theme="dark"> flips. brandGreen
  // is intentionally a primitive — the brand mark color shouldn't shift
  // with theme. The CTA pill (`pillBg`) uses bg-inverse so it stays
  // legible in both modes (dark pill on light canvas, light pill on
  // dark canvas).
  const C = {
    surface:    "var(--pp-bg-default)",
    text:       "var(--pp-fg-default)",
    textSubtle: "var(--pp-fg-subtle)",
    line:       "var(--pp-border-subtle)",
    pillBg:     "var(--pp-bg-inverse)",
    pillFg:     "var(--pp-fg-onVibrant)",
    brandGreen: "var(--pp-green-700)",
  };

  // Center tab navigation (Clubs / Players) — desktop only. Active tab is
  // tracked internally so the underline indicator follows clicks. Tab
  // clicks also forward through onNav so a host can route on the label.
  // Default "Players" because the current logged-out home renders the
  // player-discovery surface (clubs near me, available to play now,
  // event feeds) — "Clubs" will eventually route to a dedicated club
  // directory view.
  const [activeTab, setActiveTab] = useStateCBLO("Players");
  const TABS = ["Clubs", "Players"];

  return (
    <div
      style={{
        background: C.surface,
        borderBottom: `1px solid ${C.line}`,
        position: "sticky",
        top: 0,
        zIndex: 50,
        backdropFilter: "blur(12px)",
      }}
    >
      <div
        style={{
          maxWidth: desktop ? 1280 : "100%",
          margin: "0 auto",
          // 64px total height = 16px top + 32px content + 16px bottom (desktop)
          // 56px on mobile = 12px top + 32px content + 12px bottom
          padding: desktop ? "0 24px" : "12px 16px",
          height: desktop ? 64 : 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          position: "relative",
        }}
      >
        {/* Brandmark — green checkmark + "Court" light / "RESERVE" bold.
            No caret — logged-out users can't switch clubs. */}
        <button
          type="button"
          onClick={() => onNav && onNav("Home")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "transparent",
            border: 0,
            padding: 0,
            cursor: "pointer",
            color: C.text,
            flexShrink: 0,
          }}
          aria-label="CourtReserve home"
        >
          {/* Checkmark mark — green disc with white check */}
          <span
            style={{
              width: desktop ? 28 : 24,
              height: desktop ? 28 : 24,
              borderRadius: 999,
              background: C.brandGreen,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {window.Icon && (
              /* White check on the brand-green disc — disc stays green
                  in both themes so the literal "#FFFFFF" remains correct. */
              <window.Icon name="Check" size={desktop ? 16 : 14} strokeWidth={3} color="#FFFFFF" />
            )}
          </span>
          <span
            style={{
              fontFamily: "Axiforma, Inter, system-ui, sans-serif",
              fontSize: desktop ? 18 : 16,
              fontWeight: 700,
              letterSpacing: -0.3,
              color: C.text,
            }}
          >
            CourtReserve
          </span>
        </button>

        {/* Center slot — desktop only. Renders the Clubs / Players
            tabs at rest, swaps to a compact search pill once the
            user scrolls past the hero SearchBar (window.scrollY >
            200). Clicking the pill scrolls back to the hero so the
            full filter UI can be edited. Same absolutely-positioned
            center anchor in both states. */}
        {desktop && !scrolled && (
          <div
            role="tablist"
            aria-label="Browse"
            style={{
              position: "absolute",
              left: "50%",
              top: 0,
              bottom: 0,
              transform: "translateX(-50%)",
              display: "flex",
              alignItems: "stretch",
              gap: 24,
            }}
          >
            {TABS.map((label) => {
              const isActive = activeTab === label;
              return (
                <button
                  key={label}
                  role="tab"
                  aria-selected={isActive}
                  type="button"
                  onClick={() => { setActiveTab(label); onNav && onNav(label); }}
                  style={{
                    height: "100%",
                    padding: "0 4px",
                    background: "transparent",
                    border: 0,
                    cursor: "pointer",
                    fontFamily: "Inter, system-ui, sans-serif",
                    fontWeight: isActive ? 600 : 500,
                    fontSize: 14, lineHeight: 1,
                    color: isActive ? C.text : C.textSubtle,
                    // Underline indicator — 3px inset shadow on the
                    // active tab so it appears to extend the chrome's
                    // own bottom-border with a brand-green segment.
                    boxShadow: isActive ? `inset 0 -3px 0 ${C.brandGreen}` : "none",
                    display: "inline-flex",
                    alignItems: "center",
                    whiteSpace: "nowrap",
                    transition: "color 140ms ease, box-shadow 200ms ease",
                  }}
                  onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.color = C.text; }}
                  onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = C.textSubtle; }}
                >{label}</button>
              );
            })}
          </div>
        )}

        {desktop && scrolled && (
          <button
            type="button"
            onClick={() => {
              // Scroll back to the top so the hero search bar is
              // visible and ready to edit. The user can also click
              // the search pill icon to open the desktop results
              // modal directly if window.__openResultsModal is wired.
              if (typeof window !== "undefined") {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            aria-label="Edit search filters"
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              maxWidth: 520,
              width: "min(520px, calc(100vw - 360px))",
              height: 44,
              padding: "0 6px 0 18px",
              borderRadius: 999,
              background: "var(--pp-bg-default)",
              border: 0,
              boxShadow: "0 1px 2px rgba(15,18,20,.06), 0 4px 14px rgba(15,18,20,.08), inset 0 0 0 1px rgba(15,18,20,.08)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              cursor: "pointer",
              fontFamily: "Inter, system-ui, sans-serif",
            }}
          >
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              minWidth: 0, flex: 1,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              fontSize: 13, fontWeight: 500, color: C.text,
            }}>{summary}</span>
            <span style={{
              width: 32, height: 32, borderRadius: 999,
              background: "var(--pp-bg-inverse)",
              color: "var(--pp-fg-onVibrant)",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              {window.Icon && <window.Icon name="Search" size={14} strokeWidth={2.2} color="currentColor" />}
            </span>
          </button>
        )}

        {/* Right — primary CTA pill. Copy switched from "Sign In" to
            "Create an Account" so the logged-out chrome leads with the
            acquisition intent. Mobile compacts to 36h / 12px to fit the
            longer label inside the 56px chrome without crowding the
            brandmark. */}
        <button
          type="button"
          onClick={() => onNav && onNav("Sign In")}
          style={{
            // Desktop trimmed 44 → 36 so the CTA sits as a chip in the
            // chrome rather than a primary button — leaves the green
            // brandmark + page as the focal point.
            height: desktop ? 36 : 30,
            padding: desktop ? "0 14px 0 12px" : "0 12px 0 10px",
            borderRadius: 999,
            background: C.pillBg,
            color: C.pillFg,
            border: 0,
            display: "inline-flex",
            alignItems: "center",
            gap: desktop ? 6 : 5,
            cursor: "pointer",
            fontFamily: "Inter, system-ui, sans-serif",
            fontWeight: 600,
            fontSize: desktop ? 12.5 : 11.5,
            flexShrink: 0,
            whiteSpace: "nowrap",
          }}
        >
          {window.Icon && (
            /* `currentColor` lets the SVG stroke inherit the button's
                `color` CSS (which uses var(--pp-fg-onVibrant)). SVG
                presentation attributes can't always resolve var(), so
                we pin the icon to the button's text color via
                inheritance — works in both themes. */
            <window.Icon name="User" size={desktop ? 14 : 12} strokeWidth={2} color="currentColor" />
          )}
          Create Account
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { ChromeBarLoggedOut });
