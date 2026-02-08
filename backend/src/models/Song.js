import mongoose from "mongoose";

const songSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    artistId: { type: mongoose.Schema.Types.ObjectId, ref: "Artist", required: true },
    albumId: { type: mongoose.Schema.Types.ObjectId, ref: "Album" },
    durationSec: { type: Number },
    coverUrl: { type: String },
    previewUrl: { type: String },
    external: {
      itunesTrackId: { type: Number },
      trackViewUrl: { type: String }
    }
  },
  { timestamps: true }
);

export const Song = mongoose.model("Song", songSchema);
