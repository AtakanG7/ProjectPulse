// File: pages/api/subdomains/projects/[username]/[title].js
import dbConnect from '../../../../../utils/dbConnect';
import getProjectModel from '../../../../../models/Project';
import getUserModel from '../../../../../models/User';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { username, title } = req.query;

  try {
    await dbConnect();
    const User = getUserModel();
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await dbConnect();
    const Project = getProjectModel();
    const project = await Project.findOne({
      title: decodeURIComponent(title),
      createdBy: user._id
    }).select('title description images tags category')
    .populate("createdBy", "username profilePicture");

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json({
      project: project,
      user: user
    });
  } catch (error) {
    console.error('Error fetching project data:', error);
    res.status(500).json({ message: 'Error fetching project data' });
  }
}