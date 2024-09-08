import dbConnect from "../../../utils/dbConnect";
import Project from "../../../models/Project";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    const { query } = req.query;

    try {
      const projects = await Project.find({
        $or: [
          { title: new RegExp(query, "i") },
          { description: new RegExp(query, "i") },
        ],
      }).populate("createdBy", "username profilePicture");

      res.status(200).json({ data: projects });
    } catch (error) {
      res.status(400).json({ error: "Error fetching projects" });
    }
  } else if (req.method === "POST") {
    const { title, description, userId } = req.body;

    if (!title || !description || !userId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      // Create a new project
      const project = await Project.create({ title, description, createdBy: userId });

      // Update the user's projects array
      const user = await User.findById(userId);
      user.projects.push(project._id);
      await user.save();

      res.status(201).json({ data: project });
    } catch (error) {
      res.status(400).json({ error: "Error creating project" });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}

