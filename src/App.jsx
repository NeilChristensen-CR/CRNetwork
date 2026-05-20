// Minimal smoke-test app that imports from @courtreserve/admin to confirm
// the registry-backed install + Vite build pipeline is wired correctly.
// Use it as the starting point for real work — the components below are
// imported directly from the published design system, no copy-paste.

import { Badge, Banner, Button, CourtReserveLogo } from "@courtreserve/admin";

export default function App() {
  return (
    <main
      style={{
        fontFamily: "system-ui, sans-serif",
        maxWidth: 720,
        margin: "0 auto",
        padding: "48px 24px",
        display: "flex",
        flexDirection: "column",
        gap: 24,
      }}
    >
      <header style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <CourtReserveLogo />
        <Badge>@courtreserve/admin</Badge>
      </header>

      <Banner title="Vite + @courtreserve/admin">
        This page renders components imported from the CR Design System. If
        you see styled output below, the npm registry + build pipeline is
        working.
      </Banner>

      <section style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="tertiary">Tertiary</Button>
      </section>

      <section>
        <h2 style={{ margin: "0 0 8px" }}>Legacy prototype</h2>
        <p style={{ margin: "0 0 12px" }}>
          The original Babel-standalone prototype lives at{" "}
          <a href="networkPOC.html">networkPOC.html</a>. It's served from
          <code> public/</code> alongside this Vite app.
        </p>
      </section>
    </main>
  );
}
