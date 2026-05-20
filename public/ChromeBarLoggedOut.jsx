// ChromeBarLoggedOut.jsx — chrome variant for the logged-out CourtReserve home.
// ----------------------------------------------------------------------------
// Matches the north-star design: green checkmark brandmark + center nav
// (Reserve Now [active pill] · Reserve · Events · Activities · Messages) +
// right cluster (Sign Up text link · Sign In dark pill with person icon).
//
// No SearchBar in chrome on this branch — the SearchBar moves into the page
// hero on the logged-out home. ChromeBar (in Apps.jsx) delegates to this when
// app === "cr".
// ----------------------------------------------------------------------------

const { useState: useStateCBLO } = React;

function ChromeBarLoggedOut({ theme, viewport = "desktop", active = "Reserve Now", onNav }) {
  const desktop = viewport === "desktop";
  const C = {
    surface: "#FFFFFF",
    text: "#0F1214",
    textSubtle: "#858F8F",
    line: "#E9EBEC",
    pillBg: "#0F1214",
    pillFg: "#FFFFFF",
    brandGreen: "#2E7D32",
  };

  // Nav items in display order. "Reserve Now" is special — it sits in a dark
  // pill and acts as the primary CTA / active home indicator.
  const navItems = ["Reserve", "Events", "Activities", "Messages"];

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
          // 64px total height = 16px top + 32px content + 16px bottom.
          padding: desktop ? "16px 24px" : "12px 12px",
          height: desktop ? 64 : 60,
          display: "flex",
          alignItems: "center",
          gap: desktop ? 16 : 8,
          position: "relative",
        }}
      >
        {/* Brandmark — green checkmark + "Court" light / "RESERVE" bold + chevron. */}
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
              width: 28,
              height: 28,
              borderRadius: 999,
              background: C.brandGreen,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {window.Icon && (
              <window.Icon name="Check" size={16} strokeWidth={3} color="#FFFFFF" />
            )}
          </span>
          <span
            style={{
              fontFamily: "Axiforma, Inter, system-ui, sans-serif",
              fontSize: 18,
              letterSpacing: -0.3,
              color: C.text,
              display: "inline-flex",
              alignItems: "baseline",
            }}
          >
            <span style={{ fontWeight: 500 }}>Court</span>
            <span style={{ fontWeight: 800, letterSpacing: 0.2 }}>RESERVE</span>
          </span>
          {window.Icon && (
            <window.Icon name="ChevronDown" size={13} strokeWidth={2.2} color={C.text} />
          )}
        </button>

        {/* Center nav — desktop only. Mobile collapses to a hamburger surface
            for now (out-of-scope; the bottom action bar covers primary nav). */}
        {desktop && (
          <nav
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              alignItems: "center",
              // 16px between the Reserve Now pill and the first nav item,
              // and between each nav item, for a balanced center cluster.
              gap: 16,
            }}
          >
            {/* Active "Reserve Now" pill — primary in-chrome CTA on the
                logged-out home. Same 32h / 8r as the Sign In pill. */}
            <button
              type="button"
              onClick={() => onNav && onNav("Reserve Now")}
              style={{
                height: 32,
                padding: "0 14px",
                borderRadius: 8,
                background: C.pillBg,
                color: C.pillFg,
                border: 0,
                fontFamily: "Inter, system-ui, sans-serif",
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Reserve Now
            </button>
            {navItems.map((label) => {
              const on = label === active;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => onNav && onNav(label)}
                  style={{
                    background: "transparent",
                    border: 0,
                    padding: "6px 4px",
                    cursor: "pointer",
                    color: on ? C.text : C.text,
                    fontFamily: "Inter, system-ui, sans-serif",
                    fontSize: 14,
                    fontWeight: on ? 700 : 500,
                    transition: "color 140ms",
                  }}
                  onMouseEnter={(e) => {
                    if (!on) e.currentTarget.style.color = C.textSubtle;
                  }}
                  onMouseLeave={(e) => {
                    if (!on) e.currentTarget.style.color = C.text;
                  }}
                >
                  {label}
                </button>
              );
            })}
          </nav>
        )}

        <div style={{ flex: 1 }} />

        {/* Right cluster — Sign Up (text link) + Sign In (dark pill with icon). */}
        <button
          type="button"
          onClick={() => onNav && onNav("Sign Up")}
          style={{
            background: "transparent",
            border: 0,
            height: 32,
            padding: "0 10px",
            cursor: "pointer",
            color: C.text,
            fontFamily: "Inter, system-ui, sans-serif",
            fontWeight: 600,
            fontSize: 13,
          }}
        >
          Sign Up
        </button>
        <button
          type="button"
          onClick={() => onNav && onNav("Sign In")}
          style={{
            height: 32,
            padding: "0 14px 0 12px",
            borderRadius: 8,
            background: C.pillBg,
            color: C.pillFg,
            border: 0,
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            cursor: "pointer",
            fontFamily: "Inter, system-ui, sans-serif",
            fontWeight: 600,
            fontSize: 13,
          }}
        >
          {window.Icon && (
            <window.Icon name="User" size={14} strokeWidth={2} color={C.pillFg} />
          )}
          Sign In
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { ChromeBarLoggedOut });
