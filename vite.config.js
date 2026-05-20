import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// `base` is the path the built site is served from. For GitHub Pages on
// a project repo it must match the repo name so absolute URLs resolve.
export default defineConfig({
  base: "/CRNetwork/",
  plugins: [react()],
});
