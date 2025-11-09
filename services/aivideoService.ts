import type { AIVideoModel, ReferenceImage, VideoGenerationResult, VideoStatus } from '../types';

declare var axios: any;

const API_BASE_URL = "https://api.gommo.net/ai";
const DOMAIN = "aivideoauto.com";

const getApiErrorMessage = (error: any, context: string): string => {
  console.error(`Error in ${context}:`, error);
  if (error.response && error.response.data && error.response.data.message) {
    return `API Error in ${context}: ${error.response.data.message}`;
  }
  if (error.message) {
    return `Error in ${context}: ${error.message}`;
  }
  return `An unknown error occurred in ${context}. Please check the console.`;
};

const getBase64FromDataUrl = (dataUrl: string): string | null => {
  const match = dataUrl.match(/^data:image\/.+;base64,(.+)$/);
  return match ? match[1] : null;
};

export const testAndFetchModels = async (accessToken: string, type: 'image' | 'video' = 'image'): Promise<AIVideoModel[]> => {
  if (!accessToken) {
    throw new Error("Access Token cannot be empty.");
  }
  try {
    const params = new URLSearchParams();
    params.append('access_token', accessToken);
    params.append('domain', DOMAIN);
    params.append('type', type);

    const response = await axios.post(
      `${API_BASE_URL}/models`,
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    if (response.data && response.data.data) {
      return response.data.data;
    }
    throw new Error("Invalid response structure from model list API.");
  } catch (error) {
    throw new Error(getApiErrorMessage(error, `testAndFetchModels (type: ${type})`));
  }
};

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
};

export const uploadAIVideoImage = async (accessToken: string, file: File): Promise<ReferenceImage> => {
    if (!accessToken) throw new Error("AIVideoAuto Access Token is required.");
    
    try {
        const base64Data = await fileToBase64(file);

        const params = new URLSearchParams();
        params.append('access_token', accessToken);
        params.append('domain', DOMAIN);
        params.append('data', base64Data);
        params.append('project_id', 'default');
        params.append('file_name', file.name);
        params.append('size', file.size.toString());

        const response = await axios.post(
            `${API_BASE_URL}/image-upload`,
            params,
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );

        if (response.data?.imageInfo?.url && response.data?.imageInfo?.id_base) {
            const imageInfo = response.data.imageInfo;
            return {
                url: imageInfo.url,
                id_base: imageInfo.id_base,
            };
        }

        if (response.data?.message) {
            throw new Error(response.data.message);
        }

        throw new Error("Image upload failed, invalid response from API.");

    } catch (error) {
        throw new Error(getApiErrorMessage(error, 'uploadAIVideoImage'));
    }
};


export const generateAIVideoImage = async (
    accessToken: string,
    model: string,
    prompt: string,
    ratio: '16_9' | '1_1' | '9_16',
    referenceImages?: ReferenceImage[]
): Promise<ReferenceImage> => {
    if (!accessToken) throw new Error("AIVideoAuto Access Token is required.");
    if (!model) throw new Error("A model must be selected.");

    const params = new URLSearchParams();
    params.append('access_token', accessToken);
    params.append('domain', DOMAIN);
    params.append('action_type', 'create');
    params.append('model', model);
    params.append('prompt', prompt);
    params.append('project_id', 'default');
    params.append('ratio', ratio);
    
    if (referenceImages && referenceImages.length > 0) {
        referenceImages.forEach((ref, index) => {
            const base64Data = getBase64FromDataUrl(ref.url);
            if (base64Data) {
                // If it's a data URL, send the base64 data
                params.append(`subjects[${index}][data]`, base64Data);
            } else {
                // Otherwise, send the URL
                params.append(`subjects[${index}][url]`, ref.url);
            }
            
            // Only include id_base if it's a valid one from the service (not one we made up for Google images)
            if (ref.id_base && !ref.id_base.startsWith('google_')) {
                params.append(`subjects[${index}][id_base]`, ref.id_base);
            }
        });
    }
    
    try {
        const response = await axios.post(
            `${API_BASE_URL}/generateImage`,
            params,
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );

        if (response.data?.imageInfo?.url && response.data?.imageInfo?.id_base) {
            const imageInfo = response.data.imageInfo;
            return {
                url: imageInfo.url,
                id_base: imageInfo.id_base,
            };
        }
        
        if (response.data?.message) {
            throw new Error(response.data.message);
        }

        throw new Error("Image generation failed, invalid response from API.");

    } catch (error) {
        throw new Error(getApiErrorMessage(error, 'generateAIVideoImage'));
    }
};

export const createVideo = async (
    accessToken: string,
    model: string,
    prompt: string,
    images: { id_base: string, url: string }[]
): Promise<VideoGenerationResult> => {
    if (!accessToken) throw new Error("AIVideoAuto Access Token is required.");
    if (!model) throw new Error("A video model must be selected.");

    const params = new URLSearchParams();
    params.append('access_token', accessToken);
    params.append('domain', DOMAIN);
    params.append('model', model);
    params.append('prompt', prompt);
    params.append('privacy', 'PRIVATE');
    params.append('project_id', 'default');
    params.append('translate_to_en', 'true');

    if (images && images.length > 0) {
        images.forEach((img, index) => {
            params.append(`images[${index}][id_base]`, img.id_base);
            params.append(`images[${index}][url]`, img.url);
        });
    }

    try {
        const response = await axios.post(
            `${API_BASE_URL}/create-video`,
            params,
            {
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
            }
        );
        
        if (response.data?.videoInfo?.id_base) {
            return {
                id_base: response.data.videoInfo.id_base,
                status: response.data.videoInfo.status as VideoStatus || 'MEDIA_GENERATION_STATUS_PENDING',
                prompt: response.data.videoInfo.prompt,
            };
        }

        if (response.data?.message) {
            throw new Error(response.data.message);
        }

        throw new Error("Video creation request failed, invalid response from API.");

    } catch (error) {
        throw new Error(getApiErrorMessage(error, 'createVideo'));
    }
};

export const checkVideoStatus = async (accessToken: string, videoId: string): Promise<VideoGenerationResult> => {
    if (!accessToken) throw new Error("AIVideoAuto Access Token is required.");
    if (!videoId) throw new Error("Video ID is required to check status.");

    const params = new URLSearchParams();
    params.append('access_token', accessToken);
    params.append('domain', DOMAIN);
    params.append('videoId', videoId);

    try {
        const response = await axios.post(
            `${API_BASE_URL}/video`,
            params,
            {
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
            }
        );
        
        if (response.data && response.data.id_base) {
            // AIVideoAuto might return an error message inside a success response
            if (response.data.status && response.data.message && response.data.status.includes('FAILED')) {
                 throw new Error(response.data.message);
            }
            return {
                id_base: response.data.id_base,
                status: response.data.status as VideoStatus,
                download_url: response.data.download_url,
                thumbnail_url: response.data.thumbnail_url,
            };
        }

        if (response.data?.message) {
            throw new Error(response.data.message);
        }

        throw new Error("Video status check failed, invalid response from API.");

    } catch (error) {
        throw new Error(getApiErrorMessage(error, 'checkVideoStatus'));
    }
};