import { API_URL } from '@/constants/Config';
import { useMutation } from '@tanstack/react-query';
import { getToken } from '@/api/axios';
import { fetchWithAuth } from '..';

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
  let extension = imageUri.split('.').pop();
  if (!extension) {
    throw new Error('Invalid image URI');
  }
  extension = `.${extension}`;

  const response = await fetchWithAuth(`${API_URL}/amazon/s3`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: await getToken(),
    },
    body: JSON.stringify({
      phoneNumber,
      extension,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to get presigned URL');
  }

  const { presignedUrl, publicUrl } = await response.json();

  const image = await fetch(imageUri);
  const blob = await image.blob();

  const uploadResult = await fetch(presignedUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': `image/${extension}`,
    },
    body: blob,
  });

  if (!uploadResult.ok) {
    throw new Error('Failed to upload to S3');
  }

  return { publicUrl };
};

export const useUploadProfilePictureMutation = () => {
  return useMutation({
    mutationFn: uploadProfilePicture,
  });
};
