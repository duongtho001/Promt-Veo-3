import { GoogleGenAI, GenerateContentResponse, Part, Modality } from "@google/genai";
import { getCurrentGeminiKey, rotateToNextGeminiKey, getGeminiKeys } from './apiKeyManager.ts';
import type { CharacterProfile, Scene, VideoConfig } from '../types.ts';
import { translations, type Language } from "../translations.ts";

/**
 * Parses the complex Gemini API error object to provide a user-friendly message.
 * It specifically checks for quota exhaustion or unavailability errors to give actionable feedback.
 * @param error The error object from the API call.
 * @param totalKeys The total number of keys available for rotation.
 * @returns A user-friendly error string.
 */
const getGeminiErrorMessage = (error: any, totalKeys: number): string => {
  const lang = (localStorage.getItem('language') as Language) || 'vi';
  const t = translations[lang];

  const errorMessage = error?.message || 'Unknown error';
  
  // The Gemini SDK often embeds a JSON string within the error message.
  const jsonMatch = errorMessage.match(/{.+}/s);
  if (jsonMatch) {
    try {
      const errorJson = JSON.parse(jsonMatch[0]);
      if (errorJson?.error?.status === 'RESOURCE_EXHAUSTED') {
        return totalKeys > 1 ? t.errorAllKeysExhausted : t.errorSingleKeyExhausted;
      }
      if (errorJson?.error?.status === 'UNAVAILABLE') {
        return t.errorModelOverloaded;
      }
      // If it's another kind of API error, return the specific message from the JSON body.
      if (errorJson?.error?.message) {
        return errorJson.error.message;
      }
    } catch (e) {
      // If parsing fails, fall through to return the original message.
    }
  }
  return errorMessage;
};


const callGeminiApi = async (
  request: any,
  isJson: boolean = false
): Promise<GenerateContentResponse> => {
  const totalKeys = getGeminiKeys().length;
  if (totalKeys === 0) {
    throw new Error("No Gemini API keys found. Please add them in the settings.");
  }

  let lastError: any = null;
  const MAX_RETRIES = 5;
  const INITIAL_BACKOFF_MS = 3000;

  // This loop attempts to use each key once.
  for (let i = 0; i < totalKeys; i++) {
    const apiKey = getCurrentGeminiKey();

    // Only proceed if the key is not empty. If it's empty, we'll rotate at the end of the loop.
    if (apiKey) {
       for (let retryCount = 0; retryCount < MAX_RETRIES; retryCount++) {
        try {
          const ai = new GoogleGenAI({ apiKey });
          const response = await ai.models.generateContent(request);
          
          if (isJson) {
            // Try to parse to ensure it's valid JSON before returning
            const text = response.text.trim();
            const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
            if (jsonMatch && jsonMatch[1]) {
              JSON.parse(jsonMatch[1]);
            } else {
              JSON.parse(text);
            }
          }
          
          return response; // Success! The function exits here.
        } catch (error) {
          const keyIndex = localStorage.getItem('gemini_api_key_index') || '0';
          console.error(`API call failed with key index ${keyIndex}, attempt ${retryCount + 1}:`, error);
          lastError = error;

          let errorStatus = '';
          const errorMessage = error?.message || '';
          const jsonMatch = errorMessage.match(/{.+}/s);
          if (jsonMatch) {
              try {
                  const errorJson = JSON.parse(jsonMatch[0]);
                  errorStatus = errorJson?.error?.status;
              } catch (e) {
                  // Ignore parsing error
              }
          }
          
          // If Quota is exhausted, don't retry with this key. Break immediately to try the next key.
          if (errorStatus === 'RESOURCE_EXHAUSTED') {
              console.log(`Quota exhausted for key index ${keyIndex}.`);
              break; // Breaks inner retry-loop
          }
          
          // If the model is overloaded, retry with exponential backoff.
          if (errorStatus === 'UNAVAILABLE' && retryCount < MAX_RETRIES - 1) {
            const backoffTime = INITIAL_BACKOFF_MS * Math.pow(2, retryCount) + Math.random() * 1000;
            console.log(`Model is overloaded. Retrying in ${Math.round(backoffTime / 1000)} seconds...`);
            await new Promise(resolve => setTimeout(resolve, backoffTime));
            continue; // Continues inner retry-loop
          }
          
          // For other unknown errors, or if retries are exhausted, break to try next key.
          break;
        }
      } // End of inner retry-loop
    } // End of if(apiKey)
    
    // If we've reached this point, it means the current key failed (or was empty).
    // We rotate to the next key for the next iteration of the outer loop.
    rotateToNextGeminiKey();
  }
  
  // After trying all keys, throw the last captured error.
  throw new Error(getGeminiErrorMessage(lastError, totalKeys));
};

const parseJsonResponse = <T>(response: GenerateContentResponse): T => {
  try {
    const text = response.text.trim();
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      return JSON.parse(jsonMatch[1]);
    }
    return JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse JSON response:", response.text);
    throw new Error("The AI returned an invalid JSON format. Please try again.");
  }
};

export const generateStoryIdea = async (style: string, language: Language): Promise<string> => {
  const t = translations[language];
  const systemInstruction = t.systemInstruction_generateStoryIdea(style);
  const userPrompt = language === 'vi' 
    ? 'Tạo một ý tưởng câu chuyện.' 
    : 'Generate a story idea.';

  const response = await callGeminiApi({
    model: 'gemini-2.5-flash',
    contents: [{ parts: [{ text: userPrompt }] }],
    config: { systemInstruction },
  });
  return response.text;
};

export const generateScript = async (
  storyIdea: string,
  characters: CharacterProfile[],
  videoConfig: VideoConfig,
  language: Language
): Promise<string> => {
  const t = translations[language];
  const systemInstruction = t.systemInstruction_generateScript(videoConfig);
  const charDescriptions = characters.map(c => `- ${c.name}: ${c.description}`).join('\n');
  const userPrompt = `Story Idea: ${storyIdea}\n\nCharacters:\n${charDescriptions}`;

  const response = await callGeminiApi({
    model: 'gemini-2.5-pro',
    contents: [{ parts: [{ text: userPrompt }] }],
    config: { systemInstruction },
  });
  return response.text;
};

export const generateCharacterDNA = async (
  storyIdea: string,
  duration: number,
  style: string,
  language: Language
): Promise<CharacterProfile[]> => {
  const t = translations[language];
  const systemInstruction = t.systemInstruction_generateCharacters(duration, style);
  
  const response = await callGeminiApi({
    model: 'gemini-2.5-flash',
    contents: [{ parts: [{ text: storyIdea }] }],
    config: {
      systemInstruction,
      responseMimeType: 'application/json',
    },
  }, true);
  
  const result = parseJsonResponse<{ characters: Omit<CharacterProfile, 'id'>[] }>(response);
  return result.characters.map(char => ({ ...char, id: crypto.randomUUID() }));
};

export const generateScenePrompts = async (
  characters: CharacterProfile[],
  script: string,
  videoConfig: VideoConfig,
  language: Language,
  existingScenes: Scene[],
  promptType: 'image' | 'video'
): Promise<Scene[]> => {
  const t = translations[language];
  const isContinuation = existingScenes.length > 0;
  const charNames = characters.map(c => c.name);
  const systemInstruction = t.systemInstruction_generateScenes(videoConfig, isContinuation, charNames, promptType);

  let userPrompt = `Script:\n${script}`;
  if (isContinuation) {
    userPrompt += `\n\nExisting scenes (do not repeat):\n${JSON.stringify(existingScenes, null, 2)}`;
  }

  const response = await callGeminiApi({
    model: 'gemini-2.5-pro',
    contents: [{ parts: [{ text: userPrompt }] }],
    config: {
      systemInstruction,
      responseMimeType: 'application/json',
    },
  }, true);

  const result = parseJsonResponse<{ scenes: Scene[] }>(response);
  return result.scenes;
};

export const generateCharacterImage = async (
  description: string,
  style: string,
  framing: string
): Promise<string> => {
  const prompt = `A full-body reference portrait of a character, neutral pose, simple background. **Visual Style: ${style}**. **Character DNA:** ${description}`;
  
  const response = await callGeminiApi({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [{ text: prompt }] },
    config: {
      responseModalities: [Modality.IMAGE],
    },
  });

  const imagePart = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
  if (imagePart && imagePart.inlineData) {
    return `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
  }
  throw new Error("No image was generated by the API.");
};

export const generateSceneImage = async (
  prompt: string,
  referenceImageBase64s: string[],
  framing: string
): Promise<string> => {
  const parts: Part[] = [{ text: prompt }];

  for (const base64 of referenceImageBase64s) {
    const match = base64.match(/^data:(image\/.+);base64,(.+)$/);
    if (match) {
      parts.push({
        inlineData: {
          mimeType: match[1],
          data: match[2],
        },
      });
    }
  }
  
  const response = await callGeminiApi({
    model: 'gemini-2.5-flash-image',
    contents: { parts: parts },
    config: {
      responseModalities: [Modality.IMAGE],
    },
  });

  const imagePart = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
  if (imagePart && imagePart.inlineData) {
    return `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
  }
  throw new Error("No image was generated by the API.");
};

export const generatePromptSuggestions = async (
  originalPrompt: string,
  characters: CharacterProfile[],
  videoConfig: VideoConfig,
  language: Language
): Promise<{ imagePrompt: string; videoPrompt: string }> => {
  const t = translations[language];
  const charNames = characters.map(c => c.name);
  const systemInstruction = t.systemInstruction_generatePromptSuggestions(charNames, videoConfig.style, videoConfig.framing);
  
  const userPrompt = `Scene Description:\n${originalPrompt}`;

  const response = await callGeminiApi({
    model: 'gemini-2.5-flash',
    contents: [{ parts: [{ text: userPrompt }] }],
    config: {
      systemInstruction,
      responseMimeType: 'application/json',
    },
  }, true);
  
  return parseJsonResponse<{ imagePrompt: string; videoPrompt: string }>(response);
};