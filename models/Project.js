import mongoose from "mongoose";

// Project Schema
const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  likesCount: { type: Number, default: 0 },
  tags: [{ type: String }],
  category: { type: String },
  images: [
    { type: String, required: true }, // image 1
    { type: String, required: true }, // image 2
    { type: String, required: true }, // image 3
  ],
  projectUrl: { type: String }, 
}, { timestamps: true });

export default function getProjectModel() {
  return mongoose.models.Project || mongoose.model('Project', ProjectSchema);
}

