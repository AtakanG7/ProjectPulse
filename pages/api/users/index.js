import dbConnect from "../../../utils/dbConnect";
import User from "../../../models/User";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "POST") {
    console.log(req.body)
      const { name, email, username, profilePicture } = req.body;
    try {
      const user = new User({ name, email, username, profilePicture });
      await user.save();
      res.status(201).json({ message: "User created", data: user });
    } catch (error) {
      console.log(error)
      res.status(400).json({ error: "Error creating user"});
    }
  } else if (req.method === "GET") {
    try {
      const users = await User.find({}).populate("projects");
      res.status(200).json({ data: users });
    } catch (error) {
      res.status(400).json({ error: "Error fetching users" });
    }
  } else if (req.method === "PUT") {
    try {
      const { id } = req.query;
      const { name, email, username, profilePicture, bio, location, website, githubLink, linkedinUrl, officialWebsiteUrl } = req.body;
      const user = await User.findByIdAndUpdate(id, { name, email, username, profilePicture, bio, location, website, githubLink, linkedinUrl, officialWebsiteUrl }, { new: true });
      res.status(200).json({ message: "User updated", data: user });
    } catch (error) {
      res.status(400).json({ error: "Error updating user"});
    }
  } else if (req.method === "DELETE") {
    try {
      const { id } = req.query;
      await User.findByIdAndDelete(id);
      res.status(200).json({ message: "User deleted" });
    } catch (error) {
      res.status(400).json({ error: "Error deleting user"});
    }
  } else {
    res.status(405).end(); 
  }
}

