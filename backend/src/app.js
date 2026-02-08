import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import meRoutes from "./routes/me.routes.js";
import artistsRoutes from "./routes/artists.routes.js";
import albumsRoutes from "./routes/albums.routes.js";
import songsRoutes from "./routes/songs.routes.js";
import playlistsRoutes from "./routes/playlists.routes.js";
import externalRoutes from "./routes/external.routes.js";
import { notFound, errorHandler } from "./middleware/error.js";

export function createApp() {
  const app = express();

  app.use(cors({ origin: process.env.CLIENT_ORIGIN || true }));
  app.use(express.json());

  app.get("/health", (req, res) => res.json({ ok: true }));

  app.use("/api/auth", authRoutes);
  app.use("/api/me", meRoutes);
  app.use("/api/artists", artistsRoutes);
  app.use("/api/albums", albumsRoutes);
  app.use("/api/songs", songsRoutes);
  app.use("/api/playlists", playlistsRoutes);
  app.use("/api/external", externalRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
