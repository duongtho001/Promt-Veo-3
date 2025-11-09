import React, { useState, useEffect, useRef, useCallback } from 'react';
import Header from './components/Header';
import InputPanel from './components/InputPanel';
import SceneTimeline from './components/SceneTimeline';
import type { Scene, CharacterProfile, VideoConfig, GeneratedImage, ReferenceImage, Project, CompositeReferenceImage } from './types';
import { generateScenePrompts, generateCharacterDNA, generateStoryIdea, generateCharacterImage, generateSceneImage, generatePromptSuggestions } from './services/geminiService';
import { translations, type Language } from './translations';
import GuideModal from './components/GuideModal';
import ConfirmationModal from './components/ConfirmationModal';
import SettingsPanel from './components/SettingsPanel';
import ExclamationTriangleIcon from './components/icons/ExclamationTriangleIcon';
import ImageViewerModal from './components/ImageViewerModal';
import EditPromptModal from './components/EditPromptModal';
import ReferenceLibraryModal from './components/ReferenceLibraryModal';
import ProjectLibraryModal from './components/ProjectLibraryModal';
import PromptSuggestionModal from './components/PromptSuggestionModal';
import * as dbService from './services/dbService';
import { getGeminiKeys } from './services/apiKeyManager';
import InformationCircleIcon from './components/icons/InformationCircleIcon';


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


  // Generation Progress
  const [generationProgress, setGenerationProgress] = useState<{ current: number; total: number }>({ current: 0, total: 0 });
  const [isGenerationComplete, setIsGenerationComplete] = useState<boolean>(false);
  const [generationStatusMessage, setGenerationStatusMessage] = useState<string>('');

  // API Keys & Models
  const [geminiApiKeys, setGeminiApiKeys] = useState<string[]>([]);
    
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
        generatedScript: storyIdea, // Maintain compatibility with type
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
            },
            scenes: [],
            compositeReferenceImages: [],
            lastModified: Date.now(),
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
    setScenes([]); // Start fresh when generating prompts

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
    if (!character) return;

    setCharacters(prev => prev.map(c => c.id === characterId ? { ...c, isGeneratingImage: true } : c));
    setError(null);

    try {
        const base64Image = await generateCharacterImage(character.description, videoConfig.style, 'Square (1:1)');
        const imageInfo: ReferenceImage = { url: base64Image, id_base: `google_${crypto.randomUUID()}` };
        
        setCharacters(prev => prev.map(c => c.id === characterId ? { ...c, referenceImage: imageInfo, isGeneratingImage: false } : c));
        addImageToLibrary(imageInfo);
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : t.errorGeneratingImage;
        setError(errorMessage);
        setCharacters(prev => prev.map(c => c.id === characterId ? { ...c, isGeneratingImage: false } : c));
    }
  };

  const handleGenerateAllCharacterImages = async () => {
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

    for (const character of charactersToGenerate) {
      try {
        const base64Image = await generateCharacterImage(
          character.description,
          videoConfig.style,
          "Square (1:1)"
        );
        const imageInfo: ReferenceImage = {
          url: base64Image,
          id_base: `google_${crypto.randomUUID()}`,
        };

        setCharacters((prev) =>
          prev.map((c) =>
            c.id === character.id
              ? { ...c, referenceImage: imageInfo, isGeneratingImage: false }
              : c
          )
        );
        addImageToLibrary(imageInfo);

        if (charactersToGenerate.indexOf(character) < charactersToGenerate.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      } catch (err) {
        const errorMessage = `Failed on character "${character.name}": ${
          err instanceof Error ? err.message : "Unknown error"
        }`;
        setError(errorMessage);
        setCharacters((prev) =>
          prev.map((c) =>
            c.id === character.id ? { ...c, isGeneratingImage: false } : c
          )
        );
        break;
      }
    }

    setIsBatchCharacterImageLoading(false);
  };
  
  const handleGenerateCompositeImage = async () => {
    const charactersWithImages = characters.filter(c => c.referenceImage);
    if (charactersWithImages.length < 2) return;

    setIsGeneratingComposite(true);
    setError(null);
    try {
        const groupShotPrompt = `Create a single group shot featuring all of the characters from the provided reference images, standing together on a plain white background. The style should be consistent across all characters and match the project's visual style: ${videoConfig.style}`;

        const refUrls = charactersWithImages.map(c => c.referenceImage!.url);
        const imagePromises: Promise<string>[] = refUrls.map(url => imageUrlToBase64(url));
        const refBase64s = await Promise.all(imagePromises);
        const newBase64 = await generateSceneImage(groupShotPrompt, refBase64s, videoConfig.framing);
        
        const newComposite: CompositeReferenceImage = {
            id: crypto.randomUUID(),
            url: newBase64,
            id_base: `composite_google_${crypto.randomUUID()}`,
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
    if (!scene) return;
  
    setScenes(prev => prev.map(s => s.scene_id === sceneId ? { ...s, isGeneratingImage: true } : s));
    setError(null);
  
    try {
      const promptToUse = overridePrompt || scene.prompt;
      
      const sceneCharacterIds = new Set(scene.characterIds || []);
      const characterIds = Array.from(sceneCharacterIds);
      
      let allReferences: ReferenceImage[] = [];

      const matchingComposite = compositeReferenceImages.find(comp => {
          const compositeCharIds = new Set(comp.characterIds);
          return compositeCharIds.size === sceneCharacterIds.size && 
                 characterIds.every(id => compositeCharIds.has(id));
      });

      if (matchingComposite) {
          allReferences = [matchingComposite];
      } else {
          const characterReferences = characters
            .filter(c => characterIds.includes(c.id) && c.referenceImage)
            .map(c => c.referenceImage!);
    
          const allSceneImages = scenes.flatMap(s => s.generatedImages || []);
          const imageVariationReferences = allSceneImages.filter(img => imageRefIds.includes(img.id_base));
          
          allReferences = [...characterReferences, ...imageVariationReferences];
      }

      const refUrls = allReferences.map(ref => ref.url);
      const imagePromises: Promise<string>[] = refUrls.map(url => imageUrlToBase64(url));
      const refBase64s = await Promise.all(imagePromises);
      const newBase64 = await generateSceneImage(promptToUse, refBase64s, videoConfig.framing);
      const imageInfo: ReferenceImage = { url: newBase64, id_base: `google_${crypto.randomUUID()}` };

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
        onDelete={handleDeleteFromLibrary}
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
        geminiApiKeys={geminiApiKeys}
        setGeminiApiKeys={setGeminiApiKeys}
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
            t={t}
            language={language}
          />
        </div>
      </main>
    </div>
  );
};

export default App;
