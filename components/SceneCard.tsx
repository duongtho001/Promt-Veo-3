import React, { useState, useEffect, useRef } from 'react';
import type { Scene, CharacterProfile, GeneratedImage, ReferenceImage } from '../types';
import type { TranslationKeys, Language } from '../translations';
import LightBulbIcon from './icons/LightBulbIcon';
import PromptHelper from './PromptHelper';
import CameraIcon from './icons/CameraIcon';
import TrashIcon from './icons/TrashIcon';
import EyeIcon from './icons/EyeIcon';
import PencilIcon from './icons/PencilIcon';
import ArrowPathIcon from './icons/ArrowPathIcon';
import WandIcon from './icons/WandIcon';
import ProfessionalLoader from './ProfessionalLoader';


interface SceneCardProps {
  scene: Scene;
  onUpdatePrompt: (sceneId: number, newPrompt: string) => void;
  onUpdateSceneCharacters: (sceneId: number, characterIds: string[]) => void;
  onGenerateSceneImage: (sceneId: number, imageRefIds: string[]) => void;
  onDeleteSceneImage: (sceneId: number, imageId: string) => void;
  onEditSceneImage: (scene: Scene, image: GeneratedImage) => void;
  onViewImage: (imageUrl: string) => void;
  onSuggestPrompts: (sceneId: number) => void;
  isLoading: boolean;
  isBatchGenerating: boolean;
  characters: CharacterProfile[];
  language: Language;
  t: TranslationKeys;
}

const SceneCard: React.FC<SceneCardProps> = ({
  scene,
  onUpdatePrompt,
  onUpdateSceneCharacters,
  onGenerateSceneImage,
  onDeleteSceneImage,
  onEditSceneImage,
  onViewImage,
  onSuggestPrompts,
  isLoading,
  isBatchGenerating,
  characters,
  language,
  t
}) => {
  const [prompt, setPrompt] = useState(scene.prompt);
  const [isHelperVisible, setIsHelperVisible] = useState(false);
  const [isEditingChars, setIsEditingChars] = useState(false);
  const [selectedImageRefs, setSelectedImageRefs] = useState<Set<string>>(new Set());
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setPrompt(scene.prompt);
  }, [scene.prompt]);


  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };

  const handleBlur = () => {
    if (prompt.trim() !== scene.prompt.trim()) {
      onUpdatePrompt(scene.scene_id, prompt);
    }
  };
  
  const handleInsertTag = (tag: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    
    const newText = text.substring(0, start) + tag + text.substring(end);
    setPrompt(newText);
    onUpdatePrompt(scene.scene_id, newText);

    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + tag.length;
    }, 0);
  };

  const handleToggleSceneCharacter = (charId: string) => {
    const currentIds = new Set(scene.characterIds || []);
    if (currentIds.has(charId)) {
        currentIds.delete(charId);
    } else {
        currentIds.add(charId);
    }
    onUpdateSceneCharacters(scene.scene_id, Array.from(currentIds));
  };


  const handleToggleImageRef = (imageId: string) => {
    setSelectedImageRefs(prev => {
        const newSet = new Set(prev);
        if (newSet.has(imageId)) {
            newSet.delete(imageId);
        } else {
            newSet.add(imageId);
        }
        return newSet;
    })
  }
  
  const handleGenerate = () => {
      // The character references are automatically sourced from scene.characterIds in the App component.
      // We only need to pass the scene ID and any selected image variation references.
      onGenerateSceneImage(scene.scene_id, Array.from(selectedImageRefs));
      setSelectedImageRefs(new Set()); // Clear selection after generating
  };

  const canGenerateImage = () => {
    return !scene.isGeneratingImage && !isLoading && !isBatchGenerating;
  }
  
  const charactersById = new Map(characters.map(c => [c.id, c]));
  const taggedCharacters = (scene.characterIds || [])
    .map(id => characters.find(c => c.id === id))
    .filter((c): c is CharacterProfile => !!c);


  return (
    <div className="bg-[#1E1E22] rounded-lg p-4 flex flex-col space-y-3 shadow-md border border-gray-700 hover:border-[#5BEAFF] transition-colors duration-300">
      <div className="flex justify-between items-baseline text-sm">
        <h3 className="text-lg font-bold text-gray-100">
          {t.sceneLabel} {scene.scene_id}
        </h3>
        <p className="font-mono text-gray-400 bg-[#0D0D0F] px-2 py-1 rounded-md">{t.timeLabel}: {scene.time}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left side: Prompt editing */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor={`prompt-${scene.scene_id}`} className="block text-xs font-medium text-gray-500">
              {t.promptLabel}
            </label>
            <div className="flex items-center gap-x-2">
              <button
                onClick={() => onSuggestPrompts(scene.scene_id)}
                title={t.suggestPromptsButtonTooltip}
                className={`p-1 rounded-full text-gray-500 hover:bg-gray-700 hover:text-cyan-300 transition-colors`}
                >
                <WandIcon className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setIsHelperVisible(!isHelperVisible)}
                title={t.promptHelperTooltip}
                className={`p-1 rounded-full ${isHelperVisible ? 'bg-cyan-900/70 text-cyan-300' : 'text-gray-500 hover:bg-gray-700 hover:text-cyan-300'} transition-colors`}
                >
                <LightBulbIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
          <textarea
            ref={textareaRef}
            id={`prompt-${scene.scene_id}`}
            rows={isHelperVisible ? 6 : 10}
            className="w-full bg-[#0D0D0F] text-gray-300 p-2 rounded-md border border-gray-600 focus:ring-1 focus:ring-[#5BEAFF] focus:border-[#5BEAFF] transition text-sm"
            value={prompt}
            onChange={handlePromptChange}
            onBlur={handleBlur}
          />
          {isHelperVisible && <PromptHelper onInsertTag={handleInsertTag} t={t} />}
          
          {/* Character Tagging Section */}
          <div className="mt-2">
            <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-medium text-gray-500">{t.charactersInSceneLabel}</label>
                <button
                    onClick={() => setIsEditingChars(!isEditingChars)}
                    className="text-xs font-semibold text-cyan-400 hover:text-cyan-200"
                >
                    {isEditingChars ? t.doneButton : t.editButton}
                </button>
            </div>
            <div className="flex flex-wrap gap-2 p-2 bg-[#0D0D0F] rounded-md border border-gray-600 min-h-[48px] items-center">
                {!isEditingChars && taggedCharacters.length === 0 && <p className="text-gray-500 text-xs px-1">{t.noCharactersTagged}</p>}
                {!isEditingChars && taggedCharacters.map(char => (
                    <div key={char.id} className="flex items-center gap-x-2 bg-gray-700/50 rounded-full pl-1 pr-3 py-1">
                        {char.referenceImage ? (
                            <img src={char.referenceImage.url} alt={char.name} title={char.name} className="w-6 h-6 rounded-full object-cover"/>
                        ) : (
                            <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center" title={`${char.name} (no image)`}>
                                <span className="text-xs font-bold text-gray-500">{char.name ? char.name.charAt(0).toUpperCase() : '?'}</span>
                            </div>
                        )}
                        <span className="text-xs font-medium text-gray-300">{char.name}</span>
                    </div>
                ))}
                {isEditingChars && characters.map(char => (
                    <label key={char.id} className="flex items-center gap-x-2 cursor-pointer p-1 rounded-md hover:bg-gray-700/50">
                        <input
                            type="checkbox"
                            checked={(scene.characterIds || []).includes(char.id)}
                            onChange={() => handleToggleSceneCharacter(char.id)}
                            className="h-4 w-4 rounded border-gray-500 text-cyan-500 focus:ring-cyan-600"
                        />
                         {char.referenceImage ? (
                            <img src={char.referenceImage.url} alt={char.name} className="w-6 h-6 rounded-full object-cover"/>
                        ): (
                            <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center" title={`${char.name} (no image)`}>
                                <span className="text-xs font-bold text-gray-500">{char.name ? char.name.charAt(0).toUpperCase() : '?'}</span>
                            </div>
                        )}
                        <span className="text-xs text-gray-300">{char.name}</span>
                    </label>
                ))}
            </div>
          </div>

        </div>

        {/* Right side: Image generation */}
        <div className="space-y-2 flex flex-col">
          <label className="block text-xs font-medium text-gray-400">{t.sceneImageLabel}</label>
          
          <div className="flex-grow w-full bg-gray-900/50 border-2 border-dashed border-gray-700 rounded-lg flex items-center justify-center overflow-hidden min-h-[200px] relative">
            {scene.isGeneratingImage && (
                <div className="absolute inset-0 flex items-center justify-center gap-x-2 bg-black/50 z-10">
                    <ProfessionalLoader size="md" />
                </div>
            )}
            
            {!scene.isGeneratingImage && (!scene.generatedImages || scene.generatedImages.length === 0) && (
              <p className="text-gray-500 text-xs text-center">{t.noImageGenerated}</p>
            )}

            {scene.generatedImages && scene.generatedImages.length > 0 && (
                <div className="absolute inset-0 flex gap-x-2 p-2 overflow-x-auto">
                    {scene.generatedImages.map((image, index) => {
                       const sourceImageIndex = image.editedFromId
                            ? scene.generatedImages!.findIndex(img => img.id_base === image.editedFromId)
                            : -1;

                        return (
                        <div 
                            key={index} 
                            onClick={() => handleToggleImageRef(image.id_base)}
                            className={`flex-shrink-0 w-2/3 aspect-video rounded-md overflow-hidden relative group border-2 cursor-pointer transition-all duration-200 ${selectedImageRefs.has(image.id_base) ? 'border-blue-500 scale-105' : 'border-transparent hover:border-cyan-400'}`}
                        >
                            <img src={image.url} alt={`Variation ${index + 1}`} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between">
                                <div className="flex justify-between p-1.5 items-start">
                                    {sourceImageIndex !== -1 && (
                                        <div title={`Edited from variation ${sourceImageIndex + 1}`} className="bg-black/50 text-white p-1 rounded-full">
                                            <ArrowPathIcon className="w-4 h-4"/>
                                        </div>
                                    )}
                                    <div className="flex justify-end p-0 gap-x-2 ml-auto">
                                        <button onClick={(e) => { e.stopPropagation(); onViewImage(image.url); }} title={t.viewImageTooltip} className="bg-black/50 text-white p-1.5 rounded-full hover:bg-cyan-600 transition-colors" disabled={scene.isGeneratingImage}>
                                            <EyeIcon className="w-4 h-4" />
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); onEditSceneImage(scene, image); }} title={t.editImageTooltip} className="bg-black/50 text-white p-1.5 rounded-full hover:bg-cyan-600 transition-colors disabled:bg-gray-900 disabled:text-gray-500" disabled={scene.isGeneratingImage}>
                                            <PencilIcon className="w-4 h-4" />
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); onDeleteSceneImage(scene.scene_id, image.id_base); }} title={t.deleteImageTooltip} className="bg-black/50 text-white p-1.5 rounded-full hover:bg-red-500 transition-colors disabled:bg-gray-900 disabled:text-gray-500" disabled={scene.isGeneratingImage}>
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="p-1 text-white">
                                   <p className="text-xs font-bold mb-1">{t.usedReferencesLabel}</p>
                                   <div className="flex gap-x-1">
                                       {image.usedCharacterIds.map(id => charactersById.get(id)).filter(Boolean).map(char => (
                                           <img key={char!.id} src={char!.referenceImage!.url} title={char!.name} className="w-6 h-6 rounded-full object-cover border border-gray-400" />
                                       ))}
                                       {image.usedCharacterIds.length === 0 && <p className="text-xs italic text-gray-400">None</p>}
                                   </div>
                                </div>
                            </div>
                        </div>
                    )})}
                </div>
            )}
          </div>

          <div className="space-y-2">
            <button
                onClick={handleGenerate}
                disabled={!canGenerateImage()}
                className="w-full flex items-center justify-center gap-x-1.5 text-sm bg-cyan-800/50 text-cyan-200 font-semibold py-2 px-3 rounded-lg hover:bg-cyan-700 hover:text-white transition-colors border border-cyan-700 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed"
            >
                <CameraIcon className="w-4 h-4" />
                {scene.isGeneratingImage ? t.generatingImageButton : t.generateImageButton}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SceneCard;