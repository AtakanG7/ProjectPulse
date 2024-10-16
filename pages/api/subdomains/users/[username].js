// File: pages/api/subdomains/users/[username].js
import dbConnect from '../../../../utils/dbConnect';
import getUserModel from '../../../../models/User';
import getProjectModel from '../../../../models/Project';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { username } = req.query;

  await dbConnect();
  getProjectModel();
  const User = getUserModel();

  try {
    const user = await User.findOne({ username })
      .select('name username bio profilePicture location website githubLink linkedinUrl officialWebsiteUrl followers following likes')
      .populate({
        path: 'projects',
        select: 'title description images tags category likesCount createdAt updatedAt projectUrl'
      });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      data: user
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Error fetching user data' });
  }
}