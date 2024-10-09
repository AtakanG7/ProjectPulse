import dbConnect from "../../../utils/dbConnect";
import getUserModel from "../../../models/User";

const User = getUserModel();

const searchUsers = async (query) => {
  try {
    const users = await User.find({ username: new RegExp(query, "i") });
    return { data: users };
  } catch (error) {
    return { error: "Error searching for users" };
  }
};

const handler = async (req, res) => {
  await dbConnect();

  switch (req.method) {
    case "GET":
      const { query } = req.query;
      const result = await searchUsers(query);
      return res.status(200).json(result);
    default:
      return res.status(405).end(); // Method Not Allowed
  }
};

export default handler;

