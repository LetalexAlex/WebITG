import { defineConfig } from "vite";

export default defineConfig({
    root: "src/frontend",
    build: {
        outDir: "../../dist/frontend", // goes inside dist/frontend
        emptyOutDir: true
    }
});