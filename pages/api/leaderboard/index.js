import dbConnect from "../../../utils/dbConnect";
import getProjectModel from "../../../models/Project";

const getLeaderboard = async (req, res) => {
  try {
    await dbConnect();
    const Project = getProjectModel();
    const projects = await Project.find({})
      .sort({ likes: -1 }) 
      .limit(10)
      .populate("createdBy", "username profilePicture");
    res.status(200).json({ data: projects });
  } catch (error) {
    res.status(400).json({ error: "Error fetching leaderboard" });
  }
};

const handler = async (req, res) => {
  await dbConnect();

  switch (req.method) {
    case "GET":
      return getLeaderboard(req, res);
    default:
      return res.status(405).end(); 
  }
};

export default handler;

