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
  } else {
    res.status(405).end(); 
  }
}
