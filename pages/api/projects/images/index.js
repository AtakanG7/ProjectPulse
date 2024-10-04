import { IncomingForm } from 'formidable';
import { saveImageMetadata, deleteImageMetadata } from '../../../../utils/imageMetadata';
import {registerImageToCdn} from '../../../../utils/cloudinary';
import {deleteImageFromCdn} from '../../../../utils/cloudinary';
import { updateImageMetadata } from '../../../../utils/imageMetadata';
import getProjectModel from '../../../../models/Project';
import connectToCosmosDB from '../../../../utils/cosmosdb';
import dbConnect from '../../../../utils/dbConnect';
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  await connectToCosmosDB();

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
}

async function handleUpload(req, res) {
  const form = new IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ message: 'Error parsing form data' });
    }

    const { projectId } = fields;
    const imageFile = files.image;

    let imageUrl;
    let savedMetadata;

    try {
      // Upload image to Cloudinary
      imageUrl = await registerImageToCdn(imageFile[0].filepath);

      // Save metadata to Cosmos DB
      savedMetadata = await saveImageMetadata(projectId, imageUrl);

      await dbConnect();
      const Project = getProjectModel();

      // Update Project in MongoDB Atlas
      const project = await Project.findById(projectId);
      if (!project) {
        await deleteImageFromCdn(imageUrl);
        await deleteImageMetadata(projectId, imageUrl);
        return res.status(404).json({ message: 'Project not found' });
      }

      if (project.images.length >= 3) {
        await deleteImageFromCdn(imageUrl);
        await deleteImageMetadata(projectId, imageUrl);
        return res.status(400).json({ message: 'Maximum number of images reached' });
      }

      project.images.push(imageUrl);
      const updatedProject = await project.save();

      res.status(200).json({ 
        message: 'Image uploaded successfully', 
        imageUrl,
        project: updatedProject
      });
    } catch (error) {
      console.error('Error in image upload:', error);

      if (imageUrl) {
        try {
          await deleteImageFromCdn(imageUrl);
        } catch (cleanupError) {
          console.error('Error cleaning up Cloudinary:', cleanupError);
        }
      }
      
      if (savedMetadata) {
        try {
          await deleteImageMetadata(projectId, imageUrl);
        } catch (cleanupError) {
          console.error('Error cleaning up metadata:', cleanupError);
        }
      }

      res.status(500).json({ message: 'Error uploading image' });
    }
  });
}

async function handleDelete(req, res) {
  console.log('handleDelete called');
  let projectId, imageUrl;

  try {
    // Parse the request body manually for DELETE requests
    const buffer = await new Promise((resolve, reject) => {
      let data = '';
      req.on('data', chunk => {
        data += chunk;
      });
      req.on('end', () => {
        resolve(Buffer.from(data));
      });
      req.on('error', reject);
    });

    console.log('handleDelete buffer:', buffer.toString());
    const body = JSON.parse(buffer.toString());
    ({ projectId, imageUrl } = body);

    if (!projectId || !imageUrl) {
      console.log('handleDelete missing projectId or imageUrl');
      return res.status(400).json({ message: 'Missing projectId or imageUrl' });
    }
  } catch (error) {
    console.error('Error parsing DELETE request body:', error);
    console.error('Error in handleDelete:', error);
    return res.status(400).json({ message: 'Invalid request body' });
  }

  try {
    await deleteImageFromCdn(imageUrl);
    await deleteImageMetadata(projectId, imageUrl);

    await dbConnect();
    const Project = getProjectModel();

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    project.images = project.images.filter(img => img !== imageUrl);
    const updatedProject = await project.save();

    res.status(200).json({ 
      message: 'Image deleted successfully', 
      project: updatedProject
    });
  } catch (error) {
    console.error('Error in image deletion:', error);
    console.error('Error in handleDelete:', error);
    res.status(500).json({ message: 'Error deleting image' });
  }
}

async function handleUpdate(req, res) {
  const form = new IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ message: 'Error parsing form data' });
    }

    const { projectId, oldImageUrl } = fields;
    const newImageFile = files.image;

    let newImageUrl;
    let updatedMetadata;

    try {
      // Upload new image to Cloudinary
      newImageUrl = await registerImageToCdn(newImageFile.path);

      // Update metadata in Cosmos DB
      updatedMetadata = await updateImageMetadata(projectId, oldImageUrl, newImageUrl);

      await dbConnect();
      const Project = getProjectModel();

      // Update Project in MongoDB Atlas
      const project = await Project.findById(projectId);
      if (!project) {
        await deleteImageFromCdn(newImageUrl);
        await deleteImageMetadata(projectId, newImageUrl);
        return res.status(404).json({ message: 'Project not found' });
      }

      // Replace old image URL with new one
      project.images = project.images.map(img => img === oldImageUrl ? newImageUrl : img);
      const updatedProject = await project.save();

      // Delete old image from Cloudinary
      await deleteImageFromCdn(oldImageUrl);

      res.status(200).json({ 
        message: 'Image updated successfully', 
        imageUrl: newImageUrl,
        project: updatedProject
      });
    } catch (error) {
      console.error('Error in image update:', error);

      // Clean up in case of error
      if (newImageUrl) {
        try {
          await deleteImageFromCdn(newImageUrl);
        } catch (cleanupError) {
          console.error('Error cleaning up Cloudinary:', cleanupError);
        }
      }
      
      if (updatedMetadata) {
        try {
          await updateImageMetadata(projectId, newImageUrl, oldImageUrl);
        } catch (cleanupError) {
          console.error('Error reverting metadata:', cleanupError);
        }
      }

      res.status(500).json({ message: 'Error updating image' });
    }
  });
}