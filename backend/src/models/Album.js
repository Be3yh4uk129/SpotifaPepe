import mongoose from "mongoose";

const albumSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    artistId: { type: mongoose.Schema.Types.ObjectId, ref: "Artist", required: true },
    year: { type: Number },
    coverUrl: { type: String },
    external: {
      itunesCollectionId: { type: Number },
      collectionViewUrl: { type: String }
    }
  },
  { timestamps: true }
);

export const Album = mongoose.model("Album", albumSchema);
