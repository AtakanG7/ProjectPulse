import connectToCosmosDB from './cosmosdb.js';

const COLLECTION_NAME = 'imageMetadata';

async function getImageMetadataCollection() {
  const client = await connectToCosmosDB();
  const db = client.db();
  return db.collection(COLLECTION_NAME);
}

async function saveImageMetadata(projectId, imageUrl) {
  console.log('Saving image metadata:', { projectId, imageUrl });
  if (!projectId || !imageUrl) {
    throw new Error('Invalid projectId or imageUrl');
  }

  const collection = await getImageMetadataCollection();
  const result = await collection.insertOne({
    projectId,
    imageUrl,
    uploadDate: new Date()
  });
  console.log('Image metadata saved:', result.insertedId);
  return result.insertedId;
}

async function deleteImageMetadata(projectId, imageUrl) {
  const collection = await getImageMetadataCollection();
  return await collection.deleteOne({ projectId, imageUrl });
}

async function updateImageMetadata(projectId, oldImageUrl, newImageUrl) {
  const collection = await getImageMetadataCollection();
  const result = await collection.findOneAndUpdate(
    { projectId, imageUrl: oldImageUrl },
    { $set: { imageUrl: newImageUrl, updateDate: new Date() } },
    { returnOriginal: false }
  );
  return result.value;
}

export { saveImageMetadata, deleteImageMetadata, updateImageMetadata };