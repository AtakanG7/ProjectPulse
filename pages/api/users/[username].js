import dbConnect from "../../../utils/dbConnect";
import getUserModel from "../../../models/User";

export default async function handler(req, res) {
  await dbConnect();
  const User = getUserModel();

  if (req.method === "GET") {
    try {
      const user = await User.findOne({ username: new RegExp(`^${req.query.username}$`, "i") }).populate("projects"); 
        
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(200).json({ data: user });
    } catch (error) {
      console.log(error)
      res.status(400).json({ error: "Error fetching user data" });
    }
  } else if (req.method == "PUT") {
    try {
      const { id } = req.query;
      const { name, email, username, profilePicture, bio, location, website, githubLink, linkedinUrl, officialWebsiteUrl } = req.body;
      const user = await User.findByIdAndUpdate(id, { name, email, username, profilePicture, bio, location, website, githubLink, linkedinUrl, officialWebsiteUrl }, { new: true });
      res.status(200).json({ message: "User updated", data: user });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(400).json({ error: "Error updating user" });
    }
  }
    else {
    res.status(405).end(); // Method Not Allowed
  }
}

