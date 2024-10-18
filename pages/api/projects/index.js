import dbConnect from "../../../utils/dbConnect";
import getProjectModel from "../../../models/Project";
import getUserModel from "../../../models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import mongoose from "mongoose";
import { authMiddleware, ownershipMiddleware, withErrorHandling } from "../middleware/authMiddleware";

const Project = getProjectModel();
const User = getUserModel();

const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 100;

const getProjects = async (req, res) => {
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
};

const createProjects = async (req, res) => {
  await authMiddleware(req, res);
  
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
      return newProject;
    }));

    await User.findByIdAndUpdate(userId, { $push: { projects: { $each: results.map(project => project._id) } } });

    res.status(201).json({ data: results });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateProject = async (req, res) => {
  await authMiddleware(req, res);

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
};

const deleteProject = async (req, res) => {
  await authMiddleware(req, res);
  await ownershipMiddleware(req, res);
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
};

export default async function handler(req, res) {
  await dbConnect();

  switch (req.method) {
    case "GET":
      await getProjects(req, res);
      break;
    case "POST":
      await createProjects(req, res);
      break;
    case "PUT":
      await updateProject(req, res);
      break;
    case "DELETE":
      await deleteProject(req, res);
      break;
    default:
      res.status(405).end(); // Method Not Allowed
  }
}

