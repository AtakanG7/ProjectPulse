// File: pages/api/middleware/authMiddleware.js

import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export const authMiddleware = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    throw new Error("Unauthorized");
  }
  req.user = session.user;
};

export const ownershipMiddleware = async (req, res, project) => {
  if (!project) {
    throw new Error("Project not found");
  }
  if (project?.id !== req.user.id && project.createdBy.toString() !== req.user.id && project.createdBy.id.toString() !== req.user.id) {
    throw new Error("Forbidden: You don't own this resource");
  }
};

export const withErrorHandling = (handler) => async (req, res) => {
  try {
    await authMiddleware(req, res);
    await handler(req, res);
  } catch (error) {
    console.error('Error in request:', error);
    if (error.message === "Unauthorized") {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    if (error.message === "Forbidden: You don't own this resource") {
      return res.status(403).json({ message: 'Forbidden' });
    }
    if (error.message === "Project not found") {
      return res.status(404).json({ message: 'Project not found' });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
};