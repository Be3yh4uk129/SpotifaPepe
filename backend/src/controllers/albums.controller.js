import Joi from "joi";
import { Album } from "../models/Album.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const schema = Joi.object({
  title: Joi.string().min(1).max(120).required(),
  artistId: Joi.string().required(),
  year: Joi.number().integer().min(1900).max(2100).optional()
});

export const listAlbums = asyncHandler(async (req, res) => {
  const { artistId } = req.query;
  const filter = artistId ? { artistId } : {};
  const items = await Album.find(filter).populate("artistId", "name").sort({ createdAt: -1 });
  res.json({ items });
});

export const createAlbum = asyncHandler(async (req, res) => {
  const { value, error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });

  const created = await Album.create(value);
  res.status(201).json({ item: created });
});
