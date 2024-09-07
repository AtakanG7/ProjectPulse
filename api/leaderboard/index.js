import dbConnect from "../../../utils/dbConnect";
import Project from "../../../models/Project";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const projects = await Project.find({})
        .sort({ likes: -1 }) 
        .limit(10)
        .populate("createdBy", "username profilePicture");
      res.status(200).json({ data: projects });
    } catch (error) {
      res.status(400).json({ error: "Error fetching leaderboard" });
    }
  } else {
    res.status(405).end(); 
  }
}
