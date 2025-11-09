declare var axios: any;

const API_BASE_URL = "https://api.whomeai.com/v1";

const getApiErrorMessage = (error: any, context: string): string => {
  console.error(`Error in ${context}:`, error);
  if (error.response && error.response.data && error.response.data.message) {
    return `API Error in ${context}: ${error.response.data.message}`;
  }
   if (error.response && error.response.data && error.response.data.error) {
    return `API Error in ${context}: ${error.response.data.error.message}`;
  }
  if (error.message) {
    return `Error in ${context}: ${error.message}`;
  }
  return `An unknown error occurred in ${context}. Please check the console.`;
};

/**
 * Extracts the pure base64 string from a data URL.
 * @param dataUrl The full data URL (e.g., "data:image/png;base64,...").
 * @returns The base64 string, or null if the format is invalid.
 */
const getBase64FromDataUrl = (dataUrl: string): string | null => {
  // Regex to capture the base64 part of a data URL
  const match = dataUrl.match(/^data:image\/.+;base64,(.+)$/);
  return match ? match[1] : null;
};

const callWhomeaiApi = async (apiKey: string, endpoint: string, payload: any) => {
  if (!apiKey) throw new Error("WhomeAI API Key is required.");

  let lastError: any = null;
  const MAX_RETRIES = 3;
  const INITIAL_BACKOFF_MS = 2000;

  for (let retryCount = 0; retryCount < MAX_RETRIES; retryCount++) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}${endpoint}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
          },
        }
      );
      return response; // Success
    } catch (error) {
      lastError = error;
      const isNetworkError = error.message === 'Network Error';
      const isOverloaded = error.response?.status === 503 || error.response?.status === 429;

      if ((isNetworkError || isOverloaded) && retryCount < MAX_RETRIES - 1) {
        const backoffTime = INITIAL_BACKOFF_MS * Math.pow(2, retryCount);
        console.log(`WhomeAI request failed (${error.message}). Retrying in ${backoffTime / 1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, backoffTime));
        // continue to next retry
      } else {
        // Not a retryable error or retries exhausted, break the loop
        break;
      }
    }
  }
  
  throw new Error(getApiErrorMessage(lastError, `callWhomeaiApi to ${endpoint}`));
};


export const generateWhomeaiImage = async (
    apiKey: string,
    prompt: string,
    size: '1792x1024' | '1024x1792'
): Promise<string> => {
    const payload = {
        model: 'nano-banana',
        prompt: prompt,
        n: 1,
        size: size,
        response_format: 'b64_json',
    };
    
    const response = await callWhomeaiApi(apiKey, '/images/generations', payload);
    
    if (response.data?.data?.[0]?.b64_json) {
        return `data:image/png;base64,${response.data.data[0].b64_json}`;
    }

    throw new Error("Image generation failed, invalid response from WhomeAI API.");
};

export const editWhomeaiImage = async (
    apiKey: string,
    prompt: string,
    referenceImageUrls: string[], // <-- RENAMED for clarity
    size: '1792x1024' | '1024x1792'
): Promise<string> => {
    if (referenceImageUrls.length === 0) throw new Error("At least one reference image is required for editing.");
    
    const pureBase64Images = referenceImageUrls
        .map(getBase64FromDataUrl)
        .filter((img): img is string => img !== null); // Filter out any invalid URLs
    
    if (pureBase64Images.length === 0) {
        throw new Error("No valid base64 reference images found. Ensure images are in the correct 'data:image/...' format.");
    }

    const payload = {
        model: 'nano-banana-r2i',
        prompt: prompt,
        images: pureBase64Images, // Pass the array of pure base64 strings
        n: 1,
        size: size,
        response_format: 'b64_json',
    };

    const response = await callWhomeaiApi(apiKey, '/images/image-edit', payload);

    if (response.data?.data?.[0]?.b64_json) {
        return `data:image/png;base64,${response.data.data[0].b64_json}`;
    }

    throw new Error("Image editing failed, invalid response from WhomeAI API.");
};