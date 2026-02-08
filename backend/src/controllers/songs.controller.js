import Joi from "joi";
import { Song } from "../models/Song.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const schema = Joi.object({
  title: Joi.string().min(1).max(120).required(),
  artistId: Joi.string().required(),
  albumId: Joi.string().allow(null, "").optional(),
  durationSec: Joi.number().integer().min(1).max(60 * 60).optional()
});

export const listSongs = asyncHandler(async (req, res) => {
  const q = (req.query.search || "").trim();
  const filter = q ? { title: { $regex: q, $options: "i" } } : {};
  const items = await Song.find(filter)
    .populate("artistId", "name")
    .populate("albumId", "title coverUrl")
    .sort({ createdAt: -1 })
    .limit(200);
  res.json({ items });
});

export const createSong = asyncHandler(async (req, res) => {
  const { value, error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });

  const created = await Song.create(value);
  res.status(201).json({ item: created });
});
