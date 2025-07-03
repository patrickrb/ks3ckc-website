import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';

import { env } from '../../env.mjs';

if (
  !env.AZURE_STORAGE_ACCOUNT_NAME ||
  !env.AZURE_STORAGE_ACCOUNT_KEY ||
  !env.AZURE_STORAGE_CONTAINER_NAME
) {
  throw new Error(
    'Azure Blob Storage configuration is missing. Please check your environment variables.'
  );
}

const blobServiceClient = BlobServiceClient.fromConnectionString(
  `DefaultEndpointsProtocol=https;AccountName=${env.AZURE_STORAGE_ACCOUNT_NAME};AccountKey=${env.AZURE_STORAGE_ACCOUNT_KEY};EndpointSuffix=core.windows.net`
);

const containerClient: ContainerClient = blobServiceClient.getContainerClient(
  env.AZURE_STORAGE_CONTAINER_NAME
);

export interface UploadImageResult {
  blobName: string;
  blobUrl: string;
  filename: string;
  mimeType: string;
  size: number;
}

export const uploadImage = async (
  file: File,
  blogId: string
): Promise<UploadImageResult> => {
  const timestamp = Date.now();
  const blobName = `blog-${blogId}/${timestamp}-${file.name}`;

  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  const buffer = await file.arrayBuffer();

  await blockBlobClient.uploadData(buffer, {
    blobHTTPHeaders: {
      blobContentType: file.type,
    },
  });

  const blobUrl = blockBlobClient.url;

  return {
    blobName,
    blobUrl,
    filename: file.name,
    mimeType: file.type,
    size: file.size,
  };
};

export const deleteImage = async (blobName: string): Promise<void> => {
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  await blockBlobClient.deleteIfExists();
};

export const blobStorage = {
  uploadImage,
  deleteImage,
};
