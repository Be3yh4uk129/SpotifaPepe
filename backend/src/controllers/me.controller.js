import Joi from "joi";
import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const updateSchema = Joi.object({
  name: Joi.string().min(2).max(40).required()
});

export const getMe = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});

export const updateMe = asyncHandler(async (req, res) => {
  const { value, error } = updateSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });

  const updated = await User.findByIdAndUpdate(req.user._id, { name: value.name }, { new: true })
    .select("-passwordHash");
  res.json({ user: updated });
});
