import dbConnect from "../../../utils/dbConnect";
import getProjectModel from "../../../models/Project";
import getUserModel from "../../../models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import mongoose from "mongoose";

const Project = getProjectModel();
const User = getUserModel();

const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 100;

const handlers = {
  GET: async (req, res) => {
    const { query, page = 1, pageSize = DEFAULT_PAGE_SIZE, sortBy = 'createdAt', sortOrder = 'desc', category, tags } = req.query;
    
    try {
      const filter = {};
      if (query) {
        filter.$or = [
          { title: new RegExp(query, "i") },
          { description: new RegExp(query, "i") },
        ];
      }
      if (category) filter.category = category;
      if (tags) filter.tags = { $in: tags.split(',') };

      const actualPageSize = Math.min(parseInt(pageSize), MAX_PAGE_SIZE);
      const skip = (parseInt(page) - 1) * actualPageSize;

      const projects = await Project.find(filter)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(actualPageSize)
        .populate("createdBy", "username profilePicture");

      const total = await Project.countDocuments(filter);

      return res.status(200).json({
        data: projects,
        pagination: {
          currentPage: parseInt(page),
          pageSize: actualPageSize,
          totalPages: Math.ceil(total / actualPageSize),
          totalItems: total,
        },
      });
    } catch (error) {
      console.error("Error in GET handler:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  POST: async (req, res) => {
    const session = await getServerSession(req, res, authOptions);
    if (!session) return res.status(401).json({ error: "Unauthorized" });
    
    try {
    const projects = Array.isArray(req.body.projects) ? req.body.projects : [req.body.projects];
    const userId = session.user.id;

      const results = await Promise.all(projects.map(async (project) => {
        const { title, description, tags, category, imageUrl, projectUrl } = project;
        const newProject = await Project.create({ 
          title, 
          description, 
          createdBy: new mongoose.Types.ObjectId(userId),
          tags,
          category,
          imageUrl,
          projectUrl
        });
        console.log("Project created:", newProject);
        return newProject;
      }));

      await User.findByIdAndUpdate(userId, { $push: { projects: { $each: results.map(project => project._id) } } });

      res.status(201).json({ data: results });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },

  PUT: async (req, res) => {
    const session = await getServerSession(req, res, authOptions);
    if (!session) return res.status(401).json({ error: "Unauthorized" });

    const { id } = req.query;
    const { title, description, tags, category, imageUrl, projectUrl } = req.body;

    try {
      const project = await Project.findByIdAndUpdate(id, { title, description, tags, category, imageUrl, projectUrl }, { new: true });
      if (!project) return res.status(404).json({ error: "Project not found" });

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
      const project = await Project.findByIdAndRemove(id);
      if (!project) return res.status(404).json({ error: "Project not found" });

      await User.findByIdAndUpdate(session.user.id, { $pull: { projects: project._id } });

      res.status(200).json({ data: project });
    } catch (error) {
      console.error("Error in DELETE handler:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};

export default async function handler(req, res) {
  await dbConnect();

  const handler = handlers[req.method];
  if (handler) {
    await handler(req, res);
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}

