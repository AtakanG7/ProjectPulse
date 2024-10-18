import dbConnect from "../../../utils/dbConnect";
import getUserModel from "../../../models/User";
import getProjectModel from "../../../models/Project";
import { authMiddleware, ownershipMiddleware, withErrorHandling } from "../middleware/authMiddleware";
const getUser = async (req, res) => {
  try {
    await dbConnect();
    getProjectModel();
    const user = await getUserModel().findOne({ username: new RegExp(`^${req.query.username}$`, "i") }).populate("projects"); 
        
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ data: user });
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: "Error fetching user data" });
  }
}

const updateUser = async (req, res) => {
  try {
    await dbConnect();
    const { id } = req.query;
    const { name, email, username, profilePicture, bio, location, website, githubLink, linkedinUrl, officialWebsiteUrl } = req.body;
    const userModel = getUserModel()
    const userobj = await userModel.findById(id);
    if (!userobj) return res.status(404).json({ error: "User not found" });
    try {
      await ownershipMiddleware(req, res, userobj);
    } catch (error) {
      if (error.message === 'Forbidden: You don\'t own this resource') {
        return res.status(403).json({ message: 'Forbidden: You don\'t own this resource' });
      }
    }
    const user = await userModel.findByIdAndUpdate(id, { name, email, username, profilePicture, bio, location, website, githubLink, linkedinUrl, officialWebsiteUrl }, { new: true });
    res.status(200).json({ message: "User updated", data: user });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(400).json({ error: "Error updating user" });
  }
}

export async function handler(req, res) {
  await dbConnect();

  switch (req.method) {
    case "GET":
      return getUser(req, res);
    case "PUT":
      return updateUser(req, res);
    default:
      res.status(405).end(); // Method Not Allowed
  }
}

export default withErrorHandling(handler);

