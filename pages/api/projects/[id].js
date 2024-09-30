import dbConnect from "../../../utils/dbConnect";
import Project from "../../../models/Project";
import User from "../../../models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

const handlers = {
  GET: async (req, res) => {
    const { id } = req.query;
    try {
      const project = await Project.findById(id)
        .select("-__v")
        .populate("createdBy", "username profilePicture");
      if (!project) return res.status(404).json({ error: "Project not found" });
      return res.status(200).json({ data: project });
    } catch (error) {
      console.error("Error in GET handler:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  PUT: async (req, res) => {
    const session = await getServerSession(req, res, authOptions);
    if (!session) return res.status(401).json({ error: "Unauthorized" });

    const { id } = req.query;
    const updateData = req.body;

    try {
      const project = await Project.findOneAndUpdate(
        { _id: id, createdBy: session.user.id },
        updateData,
        { new: true, runValidators: true }
      );

      if (!project) return res.status(404).json({ error: "Project not found or unauthorized" });

      res.status(200).json({ data: project });
    } catch (error) {
      console.error("Error in PUT handler:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  DELETE: async (req, res) => {
    const session = await getServerSession(req, res, authOptions);
    if (!session) return res.status(401).json({ error: "Unauthorized" });

    const { id } = req.query;

    try {
      const project = await Project.findOneAndDelete({ _id: id, createdBy: session.user.id });
      if (!project) return res.status(404).json({ error: "Project not found or unauthorized" });

      await User.findByIdAndUpdate(session.user.id, { $pull: { projects: id } });

      res.status(200).json({ message: "Project deleted successfully" });
    } catch (error) {
      console.error("Error in DELETE handler:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  PATCH: async (req, res) => {
    const session = await getServerSession(req, res, authOptions);
    if (!session) return res.status(401).json({ error: "Unauthorized" });

    const { id } = req.query;
    const { action } = req.body;

    try {
      let project;

      if (action === 'like') {
        project = await Project.findByIdAndUpdate(
          id,
          { $addToSet: { likes: session.user.id }, $inc: { likesCount: 1 } },
          { new: true }
        );
      } else if (action === 'unlike') {
        project = await Project.findByIdAndUpdate(
          id,
          { $pull: { likes: session.user.id }, $inc: { likesCount: -1 } },
          { new: true }
        );
      } else {
        return res.status(400).json({ error: "Invalid action" });
      }

      if (!project) return res.status(404).json({ error: "Project not found" });

      res.status(200).json({ data: project });
    } catch (error) {
      console.error("Error in PATCH handler:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

export default async function handler(req, res) {
  await dbConnect();
  
  const { id } = req.query;
  const handler = handlers[req.method];
  if (handler) {
    await handler(req, res);
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}