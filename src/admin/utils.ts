import axios from 'axios';
import { toast } from 'react-toastify';

export const loadImage = async (imageId: number) => {
  if (!imageId) return;

  const config: any = {
    url: 'images/' + imageId,
    method: 'get',
    responseType: 'blob',
  };

  try {
    const response = await axios.request(config);

    return response.data;
  } catch (error) {
    console.log(error);
    toast.error('Ошибка при загрузке картинки');
  }
};

export const uploadImage = async (file: any) => {
  if (!file) return;

  const formData = new FormData();
  formData.append('image', file);
  const response = await axios.post(
    '/images',
    { file },
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  if (response.status !== 200 || typeof response.data === 'string') {
    throw new Error('bad response');
  }

  return response.data;
};
