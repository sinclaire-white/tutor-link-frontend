import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { api } from '@/lib/axios';

interface UploadResult {
  url: string;
  publicId: string;
}

export function useImageUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const getSignature = async () => {
    const { data } = await api.get('/upload/signature');
    return data.data; // Extract nested data from sendResponse wrapper
  };

  const uploadImage = useCallback(async (file: File): Promise<UploadResult | null> => {
    if (!file) return null;
    
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPEG, PNG, WEBP)');
      return null;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return null;
    }

    setIsUploading(true);
    setProgress(0);

    try {
      const { signature, timestamp, cloudName, apiKey } = await getSignature();

      // Upload to Cloudinary with signature
      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', apiKey);
      formData.append('timestamp', timestamp.toString());
      formData.append('signature', signature);
      formData.append('folder', 'tutorlink/profiles');
      formData.append('upload_preset', 'tutorlink_unsigned');

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Upload failed');
      }

      setProgress(100);
      toast.success('Image uploaded successfully');
      
      return {
        url: data.secure_url,
        publicId: data.public_id,
      };
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
      return null;
    } finally {
      setIsUploading(false);
    }
  }, []);

  return { uploadImage, isUploading, progress };
}