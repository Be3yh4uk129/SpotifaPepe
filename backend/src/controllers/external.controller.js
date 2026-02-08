import Joi from "joi";
import { asyncHandler } from "../utils/asyncHandler.js";
import { itunesSearch } from "../services/itunes.service.js";
import { Song } from "../models/Song.js";
import { Album } from "../models/Album.js";

const searchSchema = Joi.object({
  term: Joi.string().min(1).max(120).required(),
  entity: Joi.string().valid("song", "album", "musicArtist").default("song"),
  limit: Joi.number().integer().min(1).max(25).default(10)
});

export const itunesSearchEndpoint = asyncHandler(async (req, res) => {
  const { value, error } = searchSchema.validate(req.query);
  if (error) return res.status(400).json({ message: error.message });

  const data = await itunesSearch(value);
  res.json({ data });
});

export const enrichSong = asyncHandler(async (req, res) => {
  const song = await Song.findById(req.params.id).populate("artistId", "name");
  if (!song) return res.status(404).json({ message: "Song not found" });

  const term = `${song.title} ${song.artistId?.name || ""}`.trim();
  const data = await itunesSearch({ term, entity: "song", limit: 5 });

  const best = (data.results || [])[0];
  if (!best) return res.status(404).json({ message: "No results from iTunes" });

  song.coverUrl = best.artworkUrl100 || song.coverUrl;
  song.previewUrl = best.previewUrl || song.previewUrl;
  song.external = {
    itunesTrackId: best.trackId,
    trackViewUrl: best.trackViewUrl
  };
  await song.save();

  res.json({ item: song });
});

export const enrichAlbum = asyncHandler(async (req, res) => {
  const album = await Album.findById(req.params.id).populate("artistId", "name");
  if (!album) return res.status(404).json({ message: "Album not found" });

  const term = `${album.title} ${album.artistId?.name || ""}`.trim();
  const data = await itunesSearch({ term, entity: "album", limit: 5 });

  const best = (data.results || [])[0];
  if (!best) return res.status(404).json({ message: "No results from iTunes" });

  album.coverUrl = best.artworkUrl100 || album.coverUrl;
  album.external = {
    itunesCollectionId: best.collectionId,
    collectionViewUrl: best.collectionViewUrl
  };
  await album.save();

  res.json({ item: album });
});
