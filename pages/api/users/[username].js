import dbConnect from "../../../utils/dbConnect";
import User from "../../../models/User";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const user = await User.findOne({ username: new RegExp(`^${req.query.username}$`, "i") }).populate("projects"); 
      console.log(user)
        
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(200).json({ data: user });
    } catch (error) {
      res.status(400).json({ error: "Error fetching user data" });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}

