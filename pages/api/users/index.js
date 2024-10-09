import dbConnect from "../../../utils/dbConnect";
import getUserModel from "../../../models/User";
import { authMiddleware, ownershipMiddleware, withErrorHandling } from "../middleware/authMiddleware";


const getUser = async (req, res) => {
  try {
    await dbConnect();
    const User = getUserModel();
    const users = await User.find({}).populate("projects");
    res.status(200).json({ data: users });
  } catch (error) {
    res.status(400).json({ error: "Error fetching users" });
  }
};

const createUser = async (req, res) => {
  const { name, email, username, profilePicture } = req.body;
  try {
    await dbConnect();
    const User = getUserModel();
    const user = new User({ name, email, username, profilePicture });
    await user.save();
    res.status(201).json({ message: "User created", data: user });
  } catch (error) {
    res.status(400).json({ error: "Error creating user"});
  }
};

const updateUser = async (req, res) => {
  const { id } = req.query;
  const { name, email, username, profilePicture, bio, location, website, githubLink, linkedinUrl, officialWebsiteUrl } = req.body;
  try {
    await dbConnect();
    const User = getUserModel()
    const userobj = await User.findById(id);
    if (!userobj) return res.status(404).json({ error: "User not found" });
    try {
      await ownershipMiddleware(req, res, userobj);
    } catch (error) {
      if (error.message === 'Forbidden: You don\'t own this resource') {
        return res.status(403).json({ message: 'Forbidden: You don\'t own this resource' });
      }
    }
    const user = await User.findByIdAndUpdate(id, { name, email, username, profilePicture, bio, location, website, githubLink, linkedinUrl, officialWebsiteUrl }, { new: true });
    res.status(200).json({ message: "User updated", data: user });
  } catch (error) {
    res.status(400).json({ error: "Error updating user"});
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.query;
  try {
    await dbConnect();
    const User = getUserModel();
    const userobj = await User.findById(id);
    if (!userobj) return res.status(404).json({ error: "User not found" });
    try {
      await ownershipMiddleware(req, res, userobj);
    } catch (error) {
      if (error.message === 'Forbidden: You don\'t own this resource') {
        return res.status(403).json({ message: 'Forbidden: You don\'t own this resource' });
      }
    }
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    res.status(400).json({ error: "Error deleting user"});
  }
};

export async function handler(req, res) {
  await dbConnect();

  switch (req.method) {
    case "GET":
      return getUser(req, res);
    case "POST":
      return createUser(req, res);
    case "PUT":
      return updateUser(req, res);
    case "DELETE":
      return deleteUser(req, res);
    default:
      res.status(405).end(); 
  }
}

export default withErrorHandling(handler);