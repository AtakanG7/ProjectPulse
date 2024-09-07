import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  profilePicture: { type: String },
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
