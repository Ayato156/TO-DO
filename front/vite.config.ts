import {defineConfig} from "vite";

const env = process.env.NODE_ENV || "development";
const port = Number(process.env.PORT) || 3000;
const apiPort = Number(process.env.API_PORT) || 8000;

const getBackendUrl = (): string => {
  if (env === "development" && process.env.CODESPACES) {
    return `https://${process.env.CODESPACE_NAME}-${apiPort}.${process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}`;
  }
  return `http://localhost:${apiPort}`;
};

// https://vitejs.dev/config/
export default defineConfig({
  root: "src",
  server: {
    port: port,
    proxy: {
      "/api": getBackendUrl(),
    },
  },
});
