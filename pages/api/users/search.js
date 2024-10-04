import dbConnect from "../../../utils/dbConnect";
import getUserModel from "../../../models/User";


export default async function handler(req, res) {
  await dbConnect();
  const User = getUserModel();

  const { query } = req.query;

  if (req.method === "GET") {
    try {
      const users = await User.find({ username: new RegExp(query, "i") });
      res.status(200).json({ data: users });
    } catch (error) {
      res.status(400).json({ error: "Error searching for users" });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
