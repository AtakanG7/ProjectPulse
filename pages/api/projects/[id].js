import dbConnect from "../../../utils/dbConnect";
import getProjectModel from "../../../models/Project";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { authMiddleware, ownershipMiddleware, withErrorHandling } from "../middleware/authMiddleware";
import getUserModel from "../../../models/User";

const getProject = async (req, res) => {
  const { id } = req.query;
  try {
    await dbConnect();
    const Project = getProjectModel();
    const project = await Project.findById(id)
      .select("-__v")
      .populate("createdBy", "-__v -password -email -githubId -refreshToken -sessions");
    if (!project) return res.status(404).json({ error: "Project not found" });
    try {
      await ownershipMiddleware(req, res, project);
    } catch (error) {
      if (error.message === 'Forbidden: You don\'t own this resource') {
        return res.status(403).json({ message: 'Forbidden: You don\'t own this resource' });
      }
    }
    return res.status(200).json({ data: project });
  } catch (error) {
    console.error("Error in GET handler:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateProject = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "Unauthorized" });

  const { id } = req.query;
  const updateData = req.body;

  try {
    await dbConnect();
    const Project = getProjectModel();
    const projectObj = await Project.findById(id);
    if (!projectObj) return res.status(404).json({ error: "Project not found or unauthorized" });
    try {
      await ownershipMiddleware(req, res, projectObj);
    } catch (error) {
      if (error.message === 'Forbidden: You don\'t own this resource') {
        return res.status(403).json({ message: 'Forbidden: You don\'t own this resource' });
      }
    }
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
};

const deleteProject = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "Unauthorized" });

  const { id } = req.query;

  try {
    await dbConnect();
    const Project = getProjectModel();
    const projectObj = await Project.findById(id);
    console.log(id)
    console.log(projectObj)
    if (!projectObj) return res.status(404).json({ error: "Project not found or unauthorized" });
    await ownershipMiddleware(req, res, projectObj);
    const project = await Project.findOneAndDelete({ _id: id, createdBy: session.user.id });
    await dbConnect();
    const User = getUserModel();
    await User.findByIdAndUpdate(session.user.id, { $pull: { projects: id } });
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error in DELETE handler:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const likeOrUnlikeProject = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "Unauthorized" });

  const { id } = req.query;
  const { action } = req.body;
  
  const Project = getProjectModel();
  const projectObj = await Project.findById(id);
  if (!projectObj) return res.status(404).json({ error: "Project not found or unauthorized" });
  try {
    await ownershipMiddleware(req, res, projectObj);
  } catch (error) {
    if (error.message === 'Forbidden: You don\'t own this resource') {
      return res.status(403).json({ message: 'Forbidden: You don\'t own this resource' });
    }
  }

  try {
    let project;

    if (action === 'like') {
      await dbConnect();
      const Project = getProjectModel();
      project = await Project.findByIdAndUpdate(
        id,
        { $addToSet: { likes: session.user.id }, $inc: { likesCount: 1 } },
        { new: true }
      );
    } else if (action === 'unlike') {
      await dbConnect();
      const Project = getProjectModel();
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
};

export async function handler(req, res) {
  const { id } = req.query;
  switch (req.method) {
    case "GET":
      await getProject(req, res);
      break;
    case "PUT":
      await updateProject(req, res);
      break;
    case "DELETE":
      await deleteProject(req, res);
      break;
    case "PATCH":
      await likeOrUnlikeProject(req, res);
      break;
    default:
      res.status(405).end(); // Method Not Allowed
  }
}

export default withErrorHandling(handler);