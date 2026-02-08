import mongoose from "mongoose";

const artistSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    genres: [{ type: String }],
    external: {
      itunesArtistId: { type: Number },
      artistViewUrl: { type: String }
    }
  },
  { timestamps: true }
);

export const Artist = mongoose.model("Artist", artistSchema);
