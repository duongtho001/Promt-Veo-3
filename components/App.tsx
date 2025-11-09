import React, { useState, useEffect, useRef, useCallback } from 'react';
import Header from './Header';
import InputPanel from './InputPanel';
import SceneTimeline from './SceneTimeline';
import type { Scene, CharacterProfile, VideoConfig, AIVideoModel, GeneratedImage, ReferenceImage, Project, VideoGenerationResult, CompositeReferenceImage } from '../types';
import { generateScenePrompts, generateCharacterDNA, generateStoryIdea, generateCharacterImage, generateSceneImage, generatePromptSuggestions } from '../services/geminiService';
import { generateAIVideoImage, testAndFetchModels, createVideo, checkVideoStatus, uploadAIVideoImage } from '../services/aivideoService';
import { generateWhomeaiImage, editWhomeaiImage } from '../services/whomeaiService';
import { translations, type Language } from '../translations';
import GuideModal from './GuideModal';
import ConfirmationModal from './ConfirmationModal';
import SettingsPanel from './SettingsPanel';
import ExclamationTriangleIcon from './icons/ExclamationTriangleIcon';
import ImageViewerModal from './ImageViewerModal';
import EditPromptModal from './EditPromptModal';
import ReferenceLibraryModal from './ReferenceLibraryModal';
import ProjectLibraryModal from './ProjectLibraryModal';
import PromptSuggestionModal from './PromptSuggestionModal';
import * as dbService from '../services/dbService';
import { getGeminiKeys } from '../services/apiKeyManager';
import InformationCircleIcon from './icons/InformationCircleIcon';


declare var JSZip: any;
declare var axios: any;

// Helper to convert image URLs to Base64, crucial for cross-service compatibility
async function imageUrlToBase64(url: string): Promise<string> {
  if (url.startsWith('data:')) {
    // Already a Base64 Data URL
    return url;
  }
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch image from URL: ${url} (status: ${response.status})`);
    }
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error converting URL to Base64:", error);
    // Depending on strictness, you might want to return a placeholder or re-throw
    throw new Error(`Could not convert image URL to Base64: ${url}`);
  }
}

// Debounce helper function
function debounce<F extends (...args: any[]) => any>(func: F, waitFor: number) {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const debounced = (...args: Parameters<F>) => {
    if (timeout !== null) {
      clearTimeout(timeout);
      timeout = null;
    }
    timeout = setTimeout(() => func(...args), waitFor);
  };

  return debounced;
}


const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('vi');
  const t = translations[language];

  // App State
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [projectName, setProjectName] = useState<string>(t.untitledProject);
  const [characters, setCharacters] = useState<CharacterProfile[]>([]);
  const [storyIdea, setStoryIdea] = useState<string>('');
  const [videoConfig, setVideoConfig] = useState<VideoConfig>({
    duration: 0,
    style: 'cinematic',
    framing: 'Standard Cinematic (16:9)',
    includeDialogue: false,
    dialogueLanguage: 'vi',
    imageService: 'google',
    imageModel: 'gemini-2.5-flash-image',
    videoService: 'aivideoauto',
    videoModel: '',
  });
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [referenceLibrary, setReferenceLibrary] = useState<ReferenceImage[]>([]);
  const [compositeReferenceImages, setCompositeReferenceImages] = useState<CompositeReferenceImage[]>([]);

  
  // Loading & UI State
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start true for DB check
  const [isCharacterLoading, setIsCharacterLoading] = useState<boolean>(false);
  const [isBatchCharacterImageLoading, setIsBatchCharacterImageLoading] = useState<boolean>(false);
  const [isGeneratingComposite, setIsGeneratingComposite] = useState<boolean>(false);
  const [isIdeaLoading, setIsIdeaLoading] = useState<boolean>(false);
  const [isBatchGenerating, setIsBatchGenerating] = useState<boolean>(false);
  const [isGuideVisible, setIsGuideVisible] = useState<boolean>(false);
  const [isSettingsVisible, setIsSettingsVisible] = useState<boolean>(false);
  const [isLibraryVisible, setIsLibraryVisible] = useState<boolean>(false);
  const [isProjectLibraryVisible, setIsProjectLibraryVisible] = useState<boolean>(false);
  const [isNewProjectConfirmVisible, setIsNewProjectConfirmVisible] = useState<boolean>(false);
  const [isResumeModalVisible, setIsResumeModalVisible] = useState<boolean>(false);
  const [projectToResume, setProjectToResume] = useState<Project | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [viewingImageUrl, setViewingImageUrl] = useState<string | null>(null);
  const [editModalState, setEditModalState] = useState<{ scene: Scene; imageRef: GeneratedImage; } | null>(null);
  const [suggestionModalState, setSuggestionModalState] = useState<{
    sceneId: number;
    isLoading: boolean;
    suggestions: { imagePrompt: string; videoPrompt: string } | null;
  } | null>(null);
  const pollingIntervalRef = useRef<number | null>(null);
  const pollingTimeoutRef = useRef<number | null>(null);
  const [isUploadingToLibrary, setIsUploadingToLibrary] = useState<boolean>(false);


  // Generation Progress
  const [generationProgress, setGenerationProgress] = useState<{ current: number; total: number }>({ current: 0, total: 0 });
  const [isGenerationComplete, setIsGenerationComplete] = useState<boolean>(false);
  const [generationStatusMessage, setGenerationStatusMessage] = useState<string>('');

  // API Keys & Models
  const [accessToken, setAccessToken] = useState<string>('');
  const [whomeaiApiKey, setWhomeaiApiKey] = useState<string>('');
  const [geminiApiKeys, setGeminiApiKeys] = useState<string[]>([]);
  const [aivideoImageModels, setAivideoImageModels] = useState<AIVideoModel[]>([]);
  const [aivideoVideoModels, setAivideoVideoModels] = useState<AIVideoModel[]>([]);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState<boolean>(false);
  const [generatedVideoResult, setGeneratedVideoResult] = useState<VideoGenerationResult | null>(null);
    
  const fetchModels = (token: string) => {
    // Fetch image models
    testAndFetchModels(token, 'image')
      .then(models => setAivideoImageModels(models))
      .catch(err => {
        console.error("Failed to auto-fetch image models with saved token:", err);
      });
    // Fetch video models
    testAndFetchModels(token, 'video')
        .then(models => setAivideoVideoModels(models))
        .catch(err => {
            console.error("Failed to auto-fetch video models with saved token:", err);
        });
  };

  const loadProjectState = (project: Project) => {
    setCurrentProjectId(project.id);
    setProjectName(project.name);
    setCharacters(project.characters);
    setStoryIdea(project.storyIdea);
    setVideoConfig(project.videoConfig);
    setScenes(project.scenes);
    setCompositeReferenceImages(project.compositeReferenceImages || []);
  };
  
  // Load state from localStorage & IndexedDB on initial load
  useEffect(() => {
    const initApp = async () => {
      setIsLoading(true);
      // Load API keys from localStorage
      const savedToken = localStorage.getItem('aivideo_access_token');
      if (savedToken) {
        setAccessToken(savedToken);
        fetchModels(savedToken);
      }
      const savedWhomeaiKey = localStorage.getItem('whomeai_api_key');
      if (savedWhomeaiKey) {
          setWhomeaiApiKey(savedWhomeaiKey);
      }
      const savedGeminiKeys = getGeminiKeys();
      setGeminiApiKeys(savedGeminiKeys);

      const savedLibrary = localStorage.getItem('reference_library');
      if (savedLibrary) {
          try {
            const parsed = JSON.parse(savedLibrary);
            if (Array.isArray(parsed)) {
              setReferenceLibrary(parsed);
            }
          } catch(e) {
            console.error("Failed to parse reference library from localStorage", e);
            localStorage.removeItem('reference_library');
          }
      }
      
      // Check for last project in IndexedDB
      try {
        await dbService.initDB();
        const lastProject = await dbService.getLastProject();
        if (lastProject) {
            setProjectToResume(lastProject);
            setIsResumeModalVisible(true);
        } else {
            // No project found, start a new one
            await resetState(null, true); 
        }
      } catch (dbError) {
        console.error("Failed to initialize or read from the database:", dbError);
        setError("Could not access local project storage. Your work will not be saved.");
        await resetState(null, true);
      } finally {
        setIsLoading(false);
      }
    };
    initApp();
  }, []);

  const debouncedSave = useCallback(
    debounce((projectData: Project) => {
      if (projectData.id) {
        dbService.saveProject(projectData).catch(err => {
          console.error("Failed to auto-save project:", err);
          setError("Failed to auto-save project.");
        });
      }
    }, 1500),
    []
  );

  useEffect(() => {
    if (currentProjectId && !isLoading) {
      const projectData: Project = {
        id: currentProjectId,
        name: projectName,
        characters,
        storyIdea,
        videoConfig,
        scenes,
        compositeReferenceImages,
        lastModified: Date.now(),
        // FIX: Add missing 'generatedScript' property to conform to Project type.
        generatedScript: storyIdea, 
      };
      debouncedSave(projectData);
    }
  }, [projectName, characters, storyIdea, videoConfig, scenes, compositeReferenceImages, currentProjectId, isLoading, debouncedSave]);

  // Save library to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('reference_library', JSON.stringify(referenceLibrary));
  }, [referenceLibrary]);

  useEffect(() => {
    const firstLine = storyIdea.split('\n')[0].trim();
    if (firstLine.length > 0 && firstLine.length < 50) {
      setProjectName(firstLine);
    } else if (currentProjectId) { // Only set to untitled if it's not the initial state
      setProjectName(t.untitledProject);
    }
  }, [storyIdea, t.untitledProject, currentProjectId]);

  const stopPolling = () => {
    if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
    }
    if (pollingTimeoutRef.current) {
        clearTimeout(pollingTimeoutRef.current);
        pollingTimeoutRef.current = null;
    }
  }

  useEffect(() => {
    // Cleanup polling on component unmount
    return () => {
        stopPolling();
    };
}, []);


  const resetState = async (projectToLoad: Project | null = null, isInitialLoad = false) => {
    if (projectToLoad) {
        loadProjectState(projectToLoad);
    } else {
        const newProjectId = crypto.randomUUID();
        const newProject: Project = {
            id: newProjectId,
            name: t.untitledProject,
            characters: [],
            storyIdea: '',
            videoConfig: {
                duration: 0,
                style: 'cinematic',
                framing: 'Standard Cinematic (16:9)',
                includeDialogue: false,
                dialogueLanguage: 'vi',
                imageService: 'google',
                imageModel: 'gemini-2.5-flash-image',
                videoService: 'aivideoauto',
                videoModel: '',
            },
            scenes: [],
            compositeReferenceImages: [],
            lastModified: Date.now(),
            // FIX: Add missing 'generatedScript' property to conform to Project type.
            generatedScript: '',
        };
        loadProjectState(newProject);
        if (!isInitialLoad) {
            await dbService.saveProject(newProject);
        }
    }
    setError(null);
    setIsLoading(false);
    setIsCharacterLoading(false);
    setIsBatchCharacterImageLoading(false);
    setIsGeneratingComposite(false);
    setIsIdeaLoading(false);
    setIsBatchGenerating(false);
    setIsGenerationComplete(false);
    setGenerationProgress({ current: 0, total: 0 });
    setGenerationStatusMessage('');
    setIsGeneratingVideo(false);
    setGeneratedVideoResult(null);
    stopPolling();
};

  const handleNewProjectRequest = () => {
    if (storyIdea || characters.length > 0 || scenes.length > 0) {
        setIsNewProjectConfirmVisible(true);
    } else {
        resetState();
    }
  };

  const handleConfirmNewProject = () => {
      resetState();
      setIsNewProjectConfirmVisible(false);
  };
  
  const handleResumeSession = (resume: boolean) => {
    if (resume && projectToResume) {
        loadProjectState(projectToResume);
    } else {
        resetState(null, true);
    }
    setProjectToResume(null);
    setIsResumeModalVisible(false);
  };

  const handleLoadProject = async (projectId: string) => {
    try {
        const project = await dbService.getProject(projectId);
        if (project) {
            resetState(project);
            setIsProjectLibraryVisible(false);
        } else {
            setError("Could not find the selected project.");
        }
    } catch(err) {
        setError("Failed to load project from the database.");
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
        await dbService.deleteProject(projectId);
        if (projectId === currentProjectId) {
            // If the current project is deleted, start a new one
            await resetState();
        }
    } catch(err) {
        setError("Failed to delete project from the database.");
    }
  };

  const handleGenerateStoryIdea = async () => {
    if (!videoConfig.style) return;
    
    setIsIdeaLoading(true);
    setError(null);
    try {
      const idea = await generateStoryIdea(videoConfig.style, language);
      setStoryIdea(idea);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsIdeaLoading(false);
    }
  };

  const handleGenerateScenePrompts = async (promptType: 'image' | 'video') => {
    if (!storyIdea.trim()) return;

    setIsLoading(true);
    setError(null);
    setIsGenerationComplete(false);
    setScenes([]); 

    const totalScenes = Math.round((videoConfig.duration * 60) / 8);
    if (totalScenes <= 0) {
        setError(t.durationTooShortError);
        setIsLoading(false);
        return;
    }
    
    setGenerationProgress({ current: 0, total: totalScenes });
    setGenerationStatusMessage(t.generationStatusAnalyzing);
    await new Promise(resolve => setTimeout(resolve, 1500)); 
    
    setGenerationStatusMessage(t.generationStatusCalculating(totalScenes));
    await new Promise(resolve => setTimeout(resolve, 1500)); 

    try {
        let currentScenes: Scene[] = [];
        const maxAttempts = 5; 
        let safetyBreak = 0;
        let batchNumber = 1;

        const addScenesWithDelay = async (scenesToAdd: Scene[]) => {
            for (const scene of scenesToAdd) {
                setScenes(prev => {
                    if (prev.some(s => s.scene_id === scene.scene_id)) {
                        return prev;
                    }
                    const newScenes = [...prev, scene].sort((a,b) => a.scene_id - b.scene_id);
                    setGenerationProgress({ current: newScenes.length, total: totalScenes });
                    setGenerationStatusMessage(t.generatingScene(newScenes.length, totalScenes));
                    return newScenes;
                });
                await new Promise(resolve => setTimeout(resolve, 200)); 
            }
        };
        
        while (currentScenes.length < totalScenes && safetyBreak < maxAttempts) {
            setGenerationStatusMessage(t.generationStatusRequesting(batchNumber));
            const newScenesBatch = await generateScenePrompts(
                characters,
                storyIdea, 
                videoConfig,
                language,
                currentScenes,
                promptType
            );
            batchNumber++;

            if (!newScenesBatch || newScenesBatch.length === 0) {
                 safetyBreak++;
                 continue;
            }

            const uniqueNewScenes = newScenesBatch.filter(
                (newScene) => !currentScenes.some((existingScene) => existingScene.scene_id === newScene.scene_id)
            );

            if (uniqueNewScenes.length === 0) {
                safetyBreak++;
            } else {
                currentScenes = [...currentScenes, ...uniqueNewScenes];
                await addScenesWithDelay(uniqueNewScenes);
                safetyBreak = 0; 
            }
        }
        
        if (currentScenes.length < totalScenes) {
            setError(t.generationIncompleteError(currentScenes.length, totalScenes));
            setIsResumeModalVisible(true);
        } else {
          setIsGenerationComplete(true);
        }

    } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
        setIsLoading(false);
        setGenerationStatusMessage('');
    }
  };
  
  const handleResumeGeneration = () => {
    setIsResumeModalVisible(false);
    setError(null);
    // This function is now more complex as we don't know which type of prompt was being generated.
    // For simplicity, we'll just log a message. A more robust solution would store the last-used promptType.
    console.warn("Resuming generation is not fully supported in this context. Please start a new generation.")
  };

  const handleGenerateCharacter = async () => {
    if (!storyIdea.trim()) return;

    setIsCharacterLoading(true);
    setError(null);

    try {
      const generatedCharacters = await generateCharacterDNA(storyIdea, videoConfig.duration, videoConfig.style, language);
      setCharacters(generatedCharacters);
    } catch (err) {
       setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsCharacterLoading(false);
    }
  };

  const getAIVideoRatioFromFraming = (framing: string): '16_9' | '1_1' | '9_16' => {
    const lowerFraming = framing.toLowerCase();
    if (lowerFraming.includes('16:9') || lowerFraming.includes('2.39:1') || lowerFraming.includes('4:3')) {
      return '16_9';
    }
    if (lowerFraming.includes('9:16')) {
      return '9_16';
    }
    if (lowerFraming.includes('1:1')) {
      return '1_1';
    }
    return '16_9';
  };

  const getWhomeaiSizeFromFraming = (framing: string): '1792x1024' | '1024x1792' => {
    const lowerFraming = framing.toLowerCase();
    if (lowerFraming.includes('9:16') || lowerFraming.includes('1:1')) { // Default square to portrait
        return '1024x1792';
    }
    return '1792x1024'; // Default landscape
  };
  
  const addImageToLibrary = (image: ReferenceImage) => {
    setReferenceLibrary(prev => {
        if (prev.some(img => img.id_base === image.id_base)) {
            return prev;
        }
        return [...prev, image];
    });
  }

  const handleGenerateCharacterImage = async (characterId: string) => {
    const character = characters.find(c => c.id === characterId);
    if (!character || !videoConfig.imageModel) return;

    setCharacters(prev => prev.map(c => c.id === characterId ? { ...c, isGeneratingImage: true } : c));
    setError(null);

    try {
        let imageInfo: ReferenceImage;
        if (videoConfig.imageService === 'aivideoauto') {
            const promptForAIVideo = `A full-body reference portrait of a character, neutral pose, simple background. **Visual Style: ${videoConfig.style}**. **Character DNA:** ${character.description}`;
            imageInfo = await generateAIVideoImage(accessToken, videoConfig.imageModel, promptForAIVideo, '1_1');
        } else if (videoConfig.imageService === 'whomeai') {
            if (!whomeaiApiKey) throw new Error("WhomeAI API Key is not set in Settings.");
            const size = getWhomeaiSizeFromFraming(videoConfig.framing);
            const imageType = size === '1024x1792' ? 'portrait' : 'shot';
            const prompt = `A full-body, cinematic ${imageType} of the following character in the visual style of "${videoConfig.style}". The background should be simple and neutral. Character details: ${character.description}`;
            const base64Image = await generateWhomeaiImage(whomeaiApiKey, prompt, size);
            imageInfo = { url: base64Image, id_base: `whomeai_${crypto.randomUUID()}` };
        } else {
            const base64Image = await generateCharacterImage(character.description, videoConfig.style, 'Square (1:1)');
            imageInfo = { url: base64Image, id_base: `google_${crypto.randomUUID()}` };
        }
        setCharacters(prev => prev.map(c => c.id === characterId ? { ...c, referenceImage: imageInfo, isGeneratingImage: false } : c));
        addImageToLibrary(imageInfo);
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : t.errorGeneratingImage;
        setError(errorMessage);
        setCharacters(prev => prev.map(c => c.id === characterId ? { ...c, isGeneratingImage: false } : c));
    }
  };

  const handleGenerateAllCharacterImages = async () => {
    if (!videoConfig.imageModel) {
      setError("Please select an image generation model first.");
      return;
    }
    setIsBatchCharacterImageLoading(true);
    setError(null);

    const charactersToGenerate = characters.filter(
      (c) => c.description && !c.referenceImage && !c.isGeneratingImage
    );
    if (charactersToGenerate.length === 0) {
      setIsBatchCharacterImageLoading(false);
      return;
    }

    setCharacters((prev) =>
      prev.map((c) =>
        charactersToGenerate.some((genChar) => genChar.id === c.id)
          ? { ...c, isGeneratingImage: true }
          : c
      )
    );

    // Generate all images sequentially, one by one, for all services.
    for (const character of charactersToGenerate) {
      try {
        let imageInfo: ReferenceImage;

        if (videoConfig.imageService === "aivideoauto") {
          const promptForAIVideo = `A full-body reference portrait of a character, neutral pose, simple background. **Visual Style: ${videoConfig.style}**. **Character DNA:** ${character.description}`;
          imageInfo = await generateAIVideoImage(
            accessToken,
            videoConfig.imageModel,
            promptForAIVideo,
            "1_1"
          );
        } else if (videoConfig.imageService === "whomeai") {
          if (!whomeaiApiKey)
            throw new Error("WhomeAI API Key is not set in Settings.");
          const size = getWhomeaiSizeFromFraming(videoConfig.framing);
          const imageType = size === "1024x1792" ? "portrait" : "shot";
          const prompt = `A full-body, cinematic ${imageType} of the following character in the visual style of "${videoConfig.style}". The background should be simple and neutral. Character details: ${character.description}`;
          const base64Image = await generateWhomeaiImage(
            whomeaiApiKey,
            prompt,
            size
          );
          imageInfo = {
            url: base64Image,
            id_base: `whomeai_${crypto.randomUUID()}`,
          };
        } else {
          // Google Gemini
          const base64Image = await generateCharacterImage(
            character.description,
            videoConfig.style,
            "Square (1:1)"
          );
          imageInfo = {
            url: base64Image,
            id_base: `google_${crypto.randomUUID()}`,
          };
        }

        // Update state after each successful generation
        setCharacters((prev) =>
          prev.map((c) =>
            c.id === character.id
              ? { ...c, referenceImage: imageInfo, isGeneratingImage: false }
              : c
          )
        );
        addImageToLibrary(imageInfo);

        // Wait for 2 seconds before processing the next character, if it's not the last one.
        if (charactersToGenerate.indexOf(character) < charactersToGenerate.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      } catch (err) {
        const errorMessage = `Failed on character "${character.name}": ${
          err instanceof Error ? err.message : "Unknown error"
        }`;
        setError(errorMessage);
        // Update state for the failed character
        setCharacters((prev) =>
          prev.map((c) =>
            c.id === character.id ? { ...c, isGeneratingImage: false } : c
          )
        );
        // Stop the batch process on the first error
        break;
      }
    }

    setIsBatchCharacterImageLoading(false);
  };
  
  const handleGenerateCompositeImage = async () => {
    const charactersWithImages = characters.filter(c => c.referenceImage);
    if (charactersWithImages.length < 2) return;
    if (videoConfig.imageService === 'whomeai') {
        setError(t.whomeaiGroupReferenceNotSupportedTooltip);
        return;
    }

    setIsGeneratingComposite(true);
    setError(null);
    try {
        let newBase64: string;
        const groupShotPrompt = `Create a single group shot featuring all of the characters from the provided reference images, standing together on a plain white background. The style should be consistent across all characters and match the project's visual style: ${videoConfig.style}`;

        if (videoConfig.imageService === 'aivideoauto') {
            const referenceImagesForApi = charactersWithImages.map(c => c.referenceImage!);
            const imageInfo = await generateAIVideoImage(accessToken, videoConfig.imageModel, groupShotPrompt, '16_9', referenceImagesForApi);
            // We need to convert the returned URL to base64 to store it consistently
            newBase64 = await imageUrlToBase64(imageInfo.url);
        } else { // Default to Google Gemini
            const refUrls = charactersWithImages.map(c => c.referenceImage!.url);
            // FIX: Explicitly type the array of promises to ensure correct type inference by Promise.all, resolving the 'unknown[]' error.
            const imagePromises: Promise<string>[] = refUrls.map(url => imageUrlToBase64(url));
            const refBase64s = await Promise.all(imagePromises);
            newBase64 = await generateSceneImage(groupShotPrompt, refBase64s, videoConfig.framing);
        }
        
        const newComposite: CompositeReferenceImage = {
            id: crypto.randomUUID(),
            url: newBase64,
            id_base: `composite_${videoConfig.imageService}_${crypto.randomUUID()}`,
            characterIds: charactersWithImages.map(c => c.id),
        };
        setCompositeReferenceImages(prev => [...prev, newComposite]);

    } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to generate composite image.');
    } finally {
        setIsGeneratingComposite(false);
    }
  };

  const handleDeleteCompositeImage = (id: string) => {
    setCompositeReferenceImages(prev => prev.filter(comp => comp.id !== id));
  };
  
  const handleGenerateSceneImage = async (sceneId: number, imageRefIds: string[], overridePrompt?: string, editedFromId?: string) => {
    const scene = scenes.find(s => s.scene_id === sceneId);
    if (!scene || !videoConfig.imageModel) return;
  
    setScenes(prev => prev.map(s => s.scene_id === sceneId ? { ...s, isGeneratingImage: true } : s));
    setError(null);
  
    try {
      const promptToUse = overridePrompt || scene.prompt;
      
      const sceneCharacterIds = new Set(scene.characterIds || []);
      const characterIds = Array.from(sceneCharacterIds);
      
      let allReferences: ReferenceImage[] = [];

      // Logic to find and use a matching composite image
      const matchingComposite = compositeReferenceImages.find(comp => {
          const compositeCharIds = new Set(comp.characterIds);
          return compositeCharIds.size === sceneCharacterIds.size && 
                 characterIds.every(id => compositeCharIds.has(id));
      });

      if (matchingComposite) {
          allReferences = [matchingComposite];
      } else {
          // Fallback to individual character references
          const characterReferences = characters
            .filter(c => characterIds.includes(c.id) && c.referenceImage)
            .map(c => c.referenceImage!);
    
          const allSceneImages = scenes.flatMap(s => s.generatedImages || []);
          const imageVariationReferences = allSceneImages.filter(img => imageRefIds.includes(img.id_base));
          
          allReferences = [...characterReferences, ...imageVariationReferences];
      }

      let imageInfo: ReferenceImage;
      if (videoConfig.imageService === 'aivideoauto') {
        const ratio = getAIVideoRatioFromFraming(videoConfig.framing);
        imageInfo = await generateAIVideoImage(accessToken, videoConfig.imageModel, promptToUse, ratio, allReferences);
      } else if (videoConfig.imageService === 'whomeai') {
        if (!whomeaiApiKey) throw new Error("WhomeAI API Key is not set in Settings.");
        const size = getWhomeaiSizeFromFraming(videoConfig.framing);
        
        const primaryReference = allReferences.length > 0 ? allReferences[0] : null;

        if (primaryReference) {
            const refBase64s = [await imageUrlToBase64(primaryReference.url)];
            const promptForEdit = `Using the provided reference for character consistency. Scene: ${promptToUse}`;
            imageInfo = { url: await editWhomeaiImage(whomeaiApiKey, promptForEdit, refBase64s, size), id_base: `whomeai_${crypto.randomUUID()}` };
        } else {
            imageInfo = { url: await generateWhomeaiImage(whomeaiApiKey, promptToUse, size), id_base: `whomeai_${crypto.randomUUID()}` };
        }
      } else {
         const refUrls = allReferences.map(ref => ref.url);
         // FIX: Explicitly type the array of promises to ensure correct type inference by Promise.all, resolving the 'unknown[]' error.
         const imagePromises: Promise<string>[] = refUrls.map(url => imageUrlToBase64(url));
         const refBase64s = await Promise.all(imagePromises);
         const newBase64 = await generateSceneImage(promptToUse, refBase64s, videoConfig.framing);
         imageInfo = { url: newBase64, id_base: `google_${crypto.randomUUID()}` };
      }

      const newImage: GeneratedImage = {
        ...imageInfo,
        usedCharacterIds: characterIds,
        editedFromId: editedFromId,
      };

      setScenes(prev => prev.map(s => {
          if (s.scene_id === sceneId) {
              return { 
                  ...s, 
                  generatedImages: [...(s.generatedImages || []), newImage],
                  isGeneratingImage: false
              };
          }
          return s;
      }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t.errorGeneratingImage;
      setError(errorMessage);
      setScenes(prev => prev.map(s => s.scene_id === sceneId ? { ...s, isGeneratingImage: false } : s));
    }
  };

  const handleConfirmEditAndGenerate = async (newPrompt: string) => {
    if (!editModalState) return;
    const { scene, imageRef } = editModalState;
    
    await handleGenerateSceneImage(scene.scene_id, [imageRef.id_base], newPrompt, imageRef.id_base);

    setEditModalState(null); // Close modal
  };
  
  const handleDeleteSceneImage = (sceneId: number, imageIdToDelete: string) => {
    setScenes(prev => prev.map(s => {
        if (s.scene_id === sceneId) {
            return {
                ...s,
                generatedImages: (s.generatedImages || []).filter(img => img.id_base !== imageIdToDelete),
            };
        }
        return s;
    }));
  };

  const handleGenerateAllSceneImages = async () => {
    if (!videoConfig.imageModel) {
      setError("Please select an image generation model first.");
      return;
    }
    setIsBatchGenerating(true);
    setError(null);

    const scenesToGenerate = scenes.filter(
      (s) => !s.generatedImages || s.generatedImages.length === 0
    );
    if (scenesToGenerate.length === 0) {
      setIsBatchGenerating(false);
      return;
    }

    for (const scene of scenesToGenerate) {
      setScenes((prev) =>
        prev.map((s) =>
          s.scene_id === scene.scene_id ? { ...s, isGeneratingImage: true } : s
        )
      );
      try {
        // We reuse the single-generation logic which now contains the composite check
        await handleGenerateSceneImage(scene.scene_id, []);
        
        if (scenesToGenerate.indexOf(scene) < scenesToGenerate.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      } catch (err) {
        const errorMessage = `Failed on Scene ${scene.scene_id}: ${
          err instanceof Error ? err.message : "Unknown error"
        }`;
        setError(errorMessage);
        setScenes((prev) =>
          prev.map((s) =>
            s.scene_id === scene.scene_id
              ? { ...s, isGeneratingImage: false }
              : s
          )
        );
        break; // Stop on first error
      }
    }

    setIsBatchGenerating(false);
  };

  const startVideoStatusPolling = (videoId: string) => {
    stopPolling(); // Clear any existing timers

    pollingTimeoutRef.current = window.setTimeout(() => {
        stopPolling();
        setGeneratedVideoResult(prev => prev ? {...prev, status: 'TIMEOUT'} : { id_base: videoId, status: 'TIMEOUT'});
        setError("Video generation timed out after 10 minutes.");
        setIsGeneratingVideo(false);
    }, 10 * 60 * 1000); // 10 minute timeout

    pollingIntervalRef.current = window.setInterval(async () => {
        try {
            const result = await checkVideoStatus(accessToken, videoId);
            setGeneratedVideoResult(result);

            const processingStatuses = [
                'MEDIA_GENERATION_STATUS_PENDING',
                'MEDIA_GENERATION_STATUS_ACTIVE',
                'MEDIA_GENERATION_STATUS_PROCESSING'
            ];
            
            if (result.status === 'MEDIA_GENERATION_STATUS_SUCCESSFUL') {
                if (result.download_url) {
                    stopPolling();
                    setIsGeneratingVideo(false);
                }
                // If successful but no URL, keep polling
            } else if (!processingStatuses.includes(result.status)) {
                // Any other status is an error or failed state
                stopPolling();
                setError(t.videoStatus[result.status] || `Video generation failed with status: ${result.status}`);
                setIsGeneratingVideo(false);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error polling video status.');
            stopPolling();
            setIsGeneratingVideo(false);
        }
    }, 10000); // Poll every 10 seconds
  };

  const handleGenerateVideo = async () => {
    if (!videoConfig.videoModel) {
        setError("Please select a video model.");
        return;
    }

    setIsGeneratingVideo(true);
    setError(null);
    setGeneratedVideoResult(null);

    const firstImage = scenes.flatMap(s => s.generatedImages || []).find(img => img.url);

    try {
        const result = await createVideo(
            accessToken,
            videoConfig.videoModel,
            storyIdea, // Using the full script as the main prompt
            firstImage ? [{ id_base: firstImage.id_base, url: firstImage.url }] : []
        );
        setGeneratedVideoResult(result);
        startVideoStatusPolling(result.id_base);
    } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to start video generation.');
        setIsGeneratingVideo(false);
    }
  };


  const handleDownloadAllImages = async () => {
    const scenesWithImages = scenes.filter(s => s.generatedImages && s.generatedImages.length > 0);
    if (scenesWithImages.length === 0) return;

    setIsLoading(true);
    setError(null);

    try {
        const zip = new JSZip();
        
        for (const scene of scenesWithImages) {
            const sceneNumber = scene.scene_id.toString().padStart(3, '0');
             for (let i = 0; i < scene.generatedImages!.length; i++) {
                const image = scene.generatedImages![i];
                const response = await fetch(image.url);
                const blob = await response.blob();
                const variationNumber = (i + 1).toString();
                zip.file(`scene_${sceneNumber}_v${variationNumber}.png`, blob);
            }
        }

        const zipBlob = await zip.generateAsync({ type: 'blob' });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(zipBlob);
        link.download = `${projectName.replace(/ /g, '_')}_images.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

    } catch (err) {
        setError("Failed to create or download the zip file.");
        console.error(err);
    } finally {
        setIsLoading(false);
    }
  };


  const handleDownload = () => {
    if (scenes.length === 0) return;
    const sortedScenes = [...scenes].sort((a, b) => a.scene_id - b.scene_id);
    const content = sortedScenes.map(s => {
      return s.prompt.replace(/^Scene \d+ –\s*/, `${s.scene_id}. `);
    }).join('\n\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${projectName.replace(/ /g, '_')}_prompts.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleUploadToLibrary = async (file: File) => {
    if (!accessToken) {
        setError("AIVideoAuto Access Token is not set.");
        return;
    }
    setIsUploadingToLibrary(true);
    setError(null);
    try {
        const imageInfo = await uploadAIVideoImage(accessToken, file);
        addImageToLibrary(imageInfo);
    } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to upload image.");
    } finally {
        setIsUploadingToLibrary(false);
    }
  };
  
  const handleDeleteFromLibrary = (id: string) => {
    setReferenceLibrary(prev => prev.filter(img => img.id_base !== id));
  }

  const handleSuggestPrompts = async (sceneId: number) => {
    const scene = scenes.find(s => s.scene_id === sceneId);
    if (!scene) return;

    setSuggestionModalState({ sceneId, isLoading: true, suggestions: null });
    setError(null);

    try {
        const sceneCharacters = characters.filter(c => scene.characterIds?.includes(c.id));
        const result = await generatePromptSuggestions(scene.prompt, sceneCharacters, videoConfig, language);
        setSuggestionModalState(prev => prev ? { ...prev, isLoading: false, suggestions: result } : null);
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to generate prompt suggestions.';
        setError(errorMessage);
        setSuggestionModalState(null); // Close modal on error
    }
  };

  const handleSelectSuggestedPrompt = (prompt: string) => {
    if (!suggestionModalState) return;
    
    setScenes(prevScenes => 
        prevScenes.map(s => s.scene_id === suggestionModalState.sceneId ? { ...s, prompt: prompt } : s)
    );

    setSuggestionModalState(null);
  };

  if (isLoading && !projectToResume) {
    return (
        <div className="bg-[#0D0D0F] min-h-screen flex items-center justify-center">
            {/* You can add a more sophisticated loading spinner here */}
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-[#5BEAFF]"></div>
        </div>
    );
  }

  return (
    <div className="bg-[#0D0D0F] min-h-screen text-gray-200 font-sans">
      <ImageViewerModal
        isOpen={!!viewingImageUrl}
        onClose={() => setViewingImageUrl(null)}
        imageUrl={viewingImageUrl}
        t={t}
      />
      <EditPromptModal
        isOpen={!!editModalState}
        onClose={() => setEditModalState(null)}
        initialPrompt={editModalState?.scene.prompt ?? ''}
        onGenerate={(newPrompt) => handleConfirmEditAndGenerate(newPrompt)}
        t={t}
      />
      <PromptSuggestionModal
        isOpen={!!suggestionModalState}
        onClose={() => setSuggestionModalState(null)}
        onSelectPrompt={handleSelectSuggestedPrompt}
        isLoading={suggestionModalState?.isLoading ?? false}
        suggestions={suggestionModalState?.suggestions ?? null}
        t={t}
      />
      <ReferenceLibraryModal 
        isOpen={isLibraryVisible}
        onClose={() => setIsLibraryVisible(false)}
        library={referenceLibrary}
        onUpload={handleUploadToLibrary}
        onDelete={handleDeleteFromLibrary}
        isUploading={isUploadingToLibrary}
        t={t}
      />
      <ProjectLibraryModal
        isOpen={isProjectLibraryVisible}
        onClose={() => setIsProjectLibraryVisible(false)}
        onLoadProject={handleLoadProject}
        onDeleteProject={handleDeleteProject}
        t={t}
        language={language}
       />
      <GuideModal isOpen={isGuideVisible} onClose={() => setIsGuideVisible(false)} t={t} />
      <SettingsPanel
        isOpen={isSettingsVisible}
        onClose={() => setIsSettingsVisible(false)}
        accessToken={accessToken}
        setAccessToken={setAccessToken}
        whomeaiApiKey={whomeaiApiKey}
        setWhomeaiApiKey={setWhomeaiApiKey}
        geminiApiKeys={geminiApiKeys}
        setGeminiApiKeys={setGeminiApiKeys}
        onModelsFetched={(type, models) => {
            if (type === 'image') setAivideoImageModels(models);
            if (type === 'video') setAivideoVideoModels(models);
        }}
        t={t}
      />
      <ConfirmationModal
        isOpen={isNewProjectConfirmVisible}
        onClose={() => setIsNewProjectConfirmVisible(false)}
        onConfirm={handleConfirmNewProject}
        title={t.newProjectConfirmationTitle}
        message={t.newProjectConfirmationMessage}
        confirmText={t.confirmButton}
        cancelText={t.cancelButton}
        icon={<ExclamationTriangleIcon className="w-16 h-16 text-yellow-400" />}
      />
       <ConfirmationModal
        isOpen={isResumeModalVisible && !!projectToResume}
        onClose={() => handleResumeSession(false)}
        onConfirm={() => handleResumeSession(true)}
        title={t.resumeSessionTitle}
        message={t.resumeSessionMessage}
        confirmText={t.resumeSessionConfirm}
        cancelText={t.resumeSessionDecline}
        icon={<InformationCircleIcon className="w-16 h-16 text-cyan-400" />}
      />
      <ConfirmationModal
        isOpen={isResumeModalVisible && !projectToResume} // This case is for storyboard continuation
        onClose={() => setIsResumeModalVisible(false)}
        onConfirm={handleResumeGeneration}
        title={t.resumeGenerationTitle}
        message={error || ''}
        confirmText={t.resumeButton}
        cancelText={t.finishForNowButton}
        icon={<ExclamationTriangleIcon className="w-16 h-16 text-yellow-400" />}
      />
      <Header 
        language={language} 
        setLanguage={setLanguage} 
        t={t} 
        onOpenGuide={() => setIsGuideVisible(true)}
        onOpenSettings={() => setIsSettingsVisible(true)}
        onOpenLibrary={() => setIsLibraryVisible(true)}
        onOpenProjectLibrary={() => setIsProjectLibraryVisible(true)}
        onNewProject={handleNewProjectRequest}
      />
      <main className="container mx-auto p-4 md:p-8">
        {error && !isResumeModalVisible && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg relative mb-6" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
            <button onClick={() => setError(null)} className="absolute top-0 bottom-0 right-0 px-4 py-3 text-red-200">&times;</button>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <InputPanel
            characters={characters}
            setCharacters={setCharacters}
            storyIdea={storyIdea}
            setStoryIdea={setStoryIdea}
            videoConfig={videoConfig}
            setVideoConfig={(key, value) => setVideoConfig(prev => ({ ...prev, [key]: value }))}
            compositeReferenceImages={compositeReferenceImages}
            onGenerateCompositeImage={handleGenerateCompositeImage}
            onDeleteCompositeImage={handleDeleteCompositeImage}
            isGeneratingComposite={isGeneratingComposite}
            onGeneratePrompts={handleGenerateScenePrompts}
            isLoading={isLoading || isBatchGenerating}
            onGenerateCharacter={handleGenerateCharacter}
            isCharacterLoading={isCharacterLoading}
            onGenerateStoryIdea={handleGenerateStoryIdea}
            isIdeaLoading={isIdeaLoading}
            onGenerateCharacterImage={handleGenerateCharacterImage}
            onGenerateAllCharacterImages={handleGenerateAllCharacterImages}
            isBatchCharacterImageLoading={isBatchCharacterImageLoading}
            t={t}
            language={language}
            aivideoImageModels={aivideoImageModels}
          />
          <SceneTimeline
            scenes={scenes}
            onUpdatePrompt={(sceneId, newPrompt) => {
              setScenes(prevScenes => 
                prevScenes.map(s => s.scene_id === sceneId ? { ...s, prompt: newPrompt } : s)
              )
            }}
            onUpdateSceneCharacters={(sceneId, characterIds) => {
              setScenes(prev => prev.map(s => 
                  s.scene_id === sceneId ? { ...s, characterIds } : s
              ));
            }}
            isLoading={isLoading}
            isBatchGenerating={isBatchGenerating}
            isGenerationComplete={isGenerationComplete}
            generationProgress={generationProgress}
            generationStatusMessage={generationStatusMessage}
            onDownloadPrompts={handleDownload}
            onDownloadAllImages={handleDownloadAllImages}
            characters={characters}
            onGenerateSceneImage={(sceneId, imgRefIds) => handleGenerateSceneImage(sceneId, imgRefIds)}
            onDeleteSceneImage={handleDeleteSceneImage}
            onGenerateAllSceneImages={handleGenerateAllSceneImages}
            onEditSceneImage={(scene, image) => setEditModalState({ scene, imageRef: image })}
            onViewImage={setViewingImageUrl}
            onSuggestPrompts={handleSuggestPrompts}
            videoConfig={videoConfig}
            onVideoConfigChange={(key, value) => setVideoConfig(prev => ({ ...prev, [key]: value }))}
            onGenerateVideo={handleGenerateVideo}
            isGeneratingVideo={isGeneratingVideo}
            generatedVideoResult={generatedVideoResult}
            aivideoVideoModels={aivideoVideoModels}
            t={t}
            language={language}
          />
        </div>
      </main>
    </div>
  );
};

export default App;
