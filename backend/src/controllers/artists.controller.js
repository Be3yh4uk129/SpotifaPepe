import Joi from "joi";
import { Artist } from "../models/Artist.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const schema = Joi.object({
  name: Joi.string().min(1).max(80).required(),
  genres: Joi.array().items(Joi.string().max(30)).default([])
});

export const listArtists = asyncHandler(async (req, res) => {
  const q = (req.query.search || "").trim();
  const filter = q ? { name: { $regex: q, $options: "i" } } : {};
  const items = await Artist.find(filter).sort({ createdAt: -1 }).limit(200);
  res.json({ items });
});

export const createArtist = asyncHandler(async (req, res) => {
  const { value, error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });

  const created = await Artist.create(value);
  res.status(201).json({ item: created });
});
