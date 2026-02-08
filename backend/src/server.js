import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "./config/db.js";
import { createApp } from "./app.js";

const PORT = process.env.PORT || 5000;

await connectDB(process.env.MONGO_URI);
const app = createApp();
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
