// File: pages/api/projects/images/index.js

import { IncomingForm } from 'formidable';
import { saveImageMetadata, deleteImageMetadata, updateImageMetadata } from '../../../../utils/imageMetadata';
import { registerImageToCdn, deleteImageFromCdn } from '../../../../utils/cloudinary';
import getProjectModel from '../../../../models/Project';
import dbConnect from '../../../../utils/dbConnect';
import { withErrorHandling, ownershipMiddleware } from '../../middleware/authMiddleware';

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req, res) => {
  await dbConnect();

  switch (req.method) {
    case 'POST':
      return handleUpload(req, res);
    case 'DELETE':
      return handleDelete(req, res);
    case 'PATCH':
      return handleUpdate(req, res);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
};

export default withErrorHandling(handler);

async function handleUpload(req, res) {
  const form = new IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({ message: 'Error parsing form data' });
    }

    const { projectId } = fields;
    const imageFile = files.image;

    const Project = getProjectModel();
    const project = await Project.findById(projectId);
    await ownershipMiddleware(req, res, project);
  
    const imageUrl = await registerImageToCdn(imageFile[0].filepath);
    await saveImageMetadata(projectId, imageUrl);

    project.images.push(imageUrl);
    const updatedProject = await project.save();

    res.status(200).json({ 
      message: 'Image uploaded successfully', 
      imageUrl,
      project: updatedProject
    });
  });
}

async function handleDelete(req, res) {
  const buffer = await getRequestBody(req);
  const { projectId, imageUrl } = JSON.parse(buffer.toString());

  if (!projectId || !imageUrl) {
    return res.status(400).json({ message: 'Missing projectId or imageUrl' });
  }

  const Project = getProjectModel();
  const project = await Project.findById(projectId);

  try {
    await ownershipMiddleware(req, res, project);
  } catch (error) {
    if (error.message === 'Forbidden: You don\'t own this resource') {
      return res.status(403).json({ message: 'Forbidden: You don\'t own this resource' });
    }
  }

  await deleteImageFromCdn(imageUrl);
  await deleteImageMetadata(projectId, imageUrl);

  project.images = project.images.filter(img => img !== imageUrl);
  const updatedProject = await project.save();

  res.status(200).json({ 
    message: 'Image deleted successfully', 
    project: updatedProject
  });
}

async function getRequestBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
    });
    req.on('end', () => {
      resolve(Buffer.from(data));
    });
    req.on('error', reject);
  });
}