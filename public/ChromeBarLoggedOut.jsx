// ChromeBarLoggedOut.jsx — chrome variant for the logged-out CourtReserve home.
// ----------------------------------------------------------------------------
// Minimal logged-out chrome: brandmark on the left, Sign In on the right.
// The center nav and Sign Up affordances were removed — the bottom action
// bar covers primary actions and signed-out users can't switch clubs (so
// the caret next to CourtReserve was dropped too). The same layout works
// on desktop and mobile; sizes shift slightly to fit narrow viewports.
// ChromeBar (in Apps.jsx) delegates to this when app === "cr".
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
          padding: desktop ? "16px 24px" : "12px 16px",
          height: desktop ? 64 : 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
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

        {/* Right — Sign In dark pill with person icon. Sign Up text link
            removed; Sign In carries both "register" and "log in" entry
            intents to keep chrome tight. */}
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
            flexShrink: 0,
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
