import dbConnect from "../../../utils/dbConnect";
import Project from "../../../models/Project";
import { getSession } from "next-auth/react";

export default async (req, res) => {
  const { method } = req;
  await dbConnect();

  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  switch (method) {
    case "PUT":
      try {
        const project = await Project.findByIdAndUpdate(req.query.id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!project) return res.status(404).json({ success: false });
        res.status(200).json({ success: true, data: project });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "DELETE":
      try {
        const project = await Project.deleteOne({ _id: req.query.id });
        if (!project) return res.status(404).json({ success: false });
        res.status(200).json({ success: true, data: {} });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
};
