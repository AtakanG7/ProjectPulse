import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  githubId: { type: String, required: true, unique: true }, // GitHub OAuth ID
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  creator: { type: Boolean, default: false},
  profilePicture: { type: String, default: "default-profile.jpg" },
  bio: { type: String, maxlength: 500 },
  location: { type: String },
  website: { type: String }, // Optional personal website
  githubLink: { type: String, required: true }, // Required GitHub profile link
  linkedinUrl: { type: String }, // Optional LinkedIn profile URL
  officialWebsiteUrl: { type: String }, // Optional official website URL
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
  likedProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });

export default function getUserModel() {
  return mongoose.models.User || mongoose.model('User', UserSchema);
}
