import Joi from "joi";
import { Playlist } from "../models/Playlist.js";
import { Song } from "../models/Song.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createSchema = Joi.object({
  title: Joi.string().min(1).max(80).required()
});

const updateSchema = Joi.object({
  title: Joi.string().min(1).max(80).required()
});

const addSongSchema = Joi.object({
  songId: Joi.string().required()
});

export const createPlaylist = asyncHandler(async (req, res) => {
  const { value, error } = createSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });

  const item = await Playlist.create({ userId: req.user._id, title: value.title, songIds: [] });
  res.status(201).json({ item });
});

export const listPlaylists = asyncHandler(async (req, res) => {
  const items = await Playlist.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json({ items });
});

export const getPlaylist = asyncHandler(async (req, res) => {
  const item = await Playlist.findOne({ _id: req.params.id, userId: req.user._id })
    .populate({
      path: "songIds",
      populate: [{ path: "artistId", select: "name" }, { path: "albumId", select: "title coverUrl" }]
    });

  if (!item) return res.status(404).json({ message: "Playlist not found" });
  res.json({ item });
});

export const updatePlaylist = asyncHandler(async (req, res) => {
  const { value, error } = updateSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });

  const updated = await Playlist.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    { title: value.title },
    { new: true }
  );
  if (!updated) return res.status(404).json({ message: "Playlist not found" });
  res.json({ item: updated });
});

export const deletePlaylist = asyncHandler(async (req, res) => {
  const deleted = await Playlist.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!deleted) return res.status(404).json({ message: "Playlist not found" });
  res.json({ ok: true });
});

export const addSongToPlaylist = asyncHandler(async (req, res) => {
  const { value, error } = addSongSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });

  const song = await Song.findById(value.songId);
  if (!song) return res.status(404).json({ message: "Song not found" });

  const playlist = await Playlist.findOne({ _id: req.params.id, userId: req.user._id });
  if (!playlist) return res.status(404).json({ message: "Playlist not found" });

  if (!playlist.songIds.some(id => String(id) === String(value.songId))) {
    playlist.songIds.push(value.songId);
    await playlist.save();
  }

  res.json({ item: playlist });
});

export const removeSongFromPlaylist = asyncHandler(async (req, res) => {
  const playlist = await Playlist.findOne({ _id: req.params.id, userId: req.user._id });
  if (!playlist) return res.status(404).json({ message: "Playlist not found" });

  playlist.songIds = playlist.songIds.filter(id => String(id) !== String(req.params.songId));
  await playlist.save();
  res.json({ item: playlist });
});
