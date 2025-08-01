import api from '@/lib/services/api';
import { AxiosError, AxiosProgressEvent, AxiosResponse } from 'axios';

// Define expected types for API responses
interface SignedUrlResponse {
  uploadUrl: string;
}

// Define progress callback type
type UploadProgressCallback = (percent: number) => void;

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

/**
 * Generates a signed URL for uploading a file.
 *
 * @param fileName - The name of the file to be uploaded.
 * @param contentType - The MIME type of the file.
 * @returns A promise that resolves with an object containing the upload URL.
 */
export async function generateSignedUrl(
  fileName: string,
  contentType: string
): Promise<SignedUrlResponse> {
  try {
    const response: AxiosResponse<SignedUrlResponse> = await api.post(
      '/api/upload/signed-url',
      {
        fileName,
        contentType,
      }
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ error: string }>;
    if (axiosError.isAxiosError && axiosError.response) {
      throw new Error(
        `Error generating signed URL: ${axiosError.response.data.error}`
      );
    }
    throw new Error(`Error generating signed URL: ${String(error)}`);
  }
}

/**
 * Uploads a file using the provided signed URL and reports progress.
 *
 * @param file - The file to be uploaded.
 * @param signedUrl - The signed URL to upload the file to.
 * @param onProgress - Callback function to report the upload progress (percentage).
 * @returns A promise that resolves when the upload is complete.
 */
export async function uploadFileToSignedUrl(
  file: File,
  signedUrl: string,
  onProgress: UploadProgressCallback
): Promise<void> {
  try {
    await api.put(signedUrl, file, {
      headers: {
        'Content-Type': file.type,
      },
      // Disable request transformation so the File/Blob is sent as-is
      transformRequest: [(data: unknown) => data],
      onUploadProgress: (progressEvent: AxiosProgressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      },
    });
  } catch (error) {
    const axiosError = error as AxiosError<{ error?: string }>;
    if (axiosError.isAxiosError && axiosError.response) {
      console.error('Error response data:', axiosError.response.data);
      throw new Error(
        `Error uploading file: ${axiosError.response.data.error || 'Unknown error'}`
      );
    }
    throw new Error(`Error uploading file: ${String(error)}`);
  }
}

/**
 * Deletes a file using the internal API path.
 *
 * @param fileUrl - The URL of the file to be deleted.
 * @returns A promise that resolves when the deletion is complete.
 */
export async function deleteFile(fileUrl: string): Promise<void> {
  try {
    await api.delete(`/upload/delete/?public_id=${fileUrl}`);
  } catch (error) {
    const axiosError = error as AxiosError<{ error: string }>;
    if (axiosError.isAxiosError && axiosError.response) {
      throw new Error(`Error deleting file: ${axiosError.response.data.error}`);
    }
    throw new Error(`Error deleting file: ${String(error)}`);
  }
}

export const generateUploadSignature = async () => {
  const response = await fetch(`${BACKEND_URL}/upload/signature/`, {
    method: 'POST',
  });
  return response.json();
};

export const uploadFileToCloudinary = async (
  file: File,
  onProgress?: (progress: number) => void
) => {
  const { signature, timestamp, cloudName, apiKey, folder } = 
    await generateUploadSignature();

  const formData = new FormData();
  formData.append('file', file);
  formData.append('signature', signature);
  formData.append('timestamp', timestamp);
  formData.append('api_key', apiKey);
  formData.append('folder', folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  const data = await response.json();
  return {
    url: data.secure_url,
    publicId: data.public_id
  };
};

export const deleteFileCloudinary = async (publicId: string) => {
  const response = await fetch(`${BACKEND_URL}/upload/delete/${publicId}/`, {
    method: 'DELETE',
  });
  return response.json();
};