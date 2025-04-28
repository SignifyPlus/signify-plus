import { API_URL } from '@/constants/Config';
import { useMutation } from '@tanstack/react-query';

interface UploadProfilePicturePayload {
  imageUri: string;
  phoneNumber: string;
}

interface UploadProfilePictureResponse {
  publicUrl: string;
}

export const uploadProfilePicture = async ({
  imageUri,
  phoneNumber,
}: UploadProfilePicturePayload): Promise<UploadProfilePictureResponse> => {
  try {
    // 1. Request presigned URL
    const response = await fetch(`${API_URL}/amazon/s3`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber,
        extension: '.jpg', // or dynamic based on picked file if you want
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get presigned URL');
    }

    const { presignedUrl, publicUrl } = await response.json();

    // 2. Upload to S3
    const image = await fetch(imageUri);
    const blob = await image.blob();

    const uploadResult = await fetch(presignedUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'image/jpeg',
      },
      body: blob,
    });

    if (!uploadResult.ok) {
      throw new Error('Failed to upload to S3');
    }

    return { publicUrl };
  } catch (error) {
    throw new Error('Failed to upload profile picture');
  }
};

export const useUploadProfilePictureMutation = () => {
  return useMutation({
    mutationFn: uploadProfilePicture,
  });
};
