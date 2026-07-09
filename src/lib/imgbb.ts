export const uploadToImgBB = async (file: File): Promise<string> => {
  const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
  if (!apiKey) {
    throw new Error('VITE_IMGBB_API_KEY is not defined in environment variables.');
  }

  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload image to ImgBB');
  }

  const data = await response.json();
  if (data && data.data && data.data.url) {
    return data.data.url;
  } else {
    throw new Error('Invalid response from ImgBB');
  }
};
