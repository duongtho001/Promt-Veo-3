import React, { useState, useRef } from 'react';
import type { CharacterProfile, VideoConfig, CompositeReferenceImage } from '../types';
import type { TranslationKeys, Language } from '../translations';
import { VIDEO_STYLES, FRAMING_STYLES, DIALOGUE_LANGUAGES } from '../constants';
import TrashIcon from './icons/TrashIcon';
import WandIcon from './icons/WandIcon';
import SparklesIcon from './icons/SparklesIcon';
import CameraIcon from './icons/CameraIcon';
import UserGroupIcon from './icons/UserGroupIcon';
import PhotoGroupIcon from './icons/PhotoGroupIcon';
import DownloadIcon from './icons/DownloadIcon';
import UploadIcon from './icons/UploadIcon';
import VideoCameraIcon from './icons/VideoCameraIcon';

interface InputPanelProps {
  characters: CharacterProfile[];
  setCharacters: React.Dispatch<React.SetStateAction<CharacterProfile[]>>;
  storyIdea: string;
  setStoryIdea: React.Dispatch<React.SetStateAction<string>>;
  videoConfig: VideoConfig;
  setVideoConfig: (field: keyof VideoConfig, value: any) => void;
  compositeReferenceImages: CompositeReferenceImage[];
  onGenerateCompositeImage: () => void;
  onDeleteCompositeImage: (id: string) => void;
  isGeneratingComposite: boolean;
  onGeneratePrompts: (promptType: 'image' | 'video') => void;
  isLoading: boolean;
  onGenerateCharacter: () => void;
  isCharacterLoading: boolean;
  onGenerateStoryIdea: () => void;
  isIdeaLoading: boolean;
  onGenerateCharacterImage: (characterId: string) => void;
  onGenerateAllCharacterImages: () => void;
  isBatchCharacterImageLoading: boolean;
  t: TranslationKeys;
  language: Language;
}

const InputPanel: React.FC<InputPanelProps> = ({
  characters,
  setCharacters,
  storyIdea,
  setStoryIdea,
  videoConfig,
  setVideoConfig,
  compositeReferenceImages,
  onGenerateCompositeImage,
  onDeleteCompositeImage,
  isGeneratingComposite,
  onGeneratePrompts,
  isLoading,
  onGenerateCharacter,
  isCharacterLoading,
  onGenerateStoryIdea,
  isIdeaLoading,
  onGenerateCharacterImage,
  onGenerateAllCharacterImages,
  isBatchCharacterImageLoading,
  t,
  language,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentPromptType, setCurrentPromptType] = useState<'image' | 'video' | null>(null);


  const handleAddCharacter = () => {
    setCharacters([
      ...characters,
      { id: crypto.randomUUID(), name: '', description: '' },
    ]);
  };

  const handleCharacterChange = (
    id: string,
    field: keyof CharacterProfile,
    value: string
  ) => {
    setCharacters(
      characters.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const handleRemoveCharacter = (id: string) => {
    setCharacters(characters.filter((c) => c.id !== id));
  };

  const handleDownloadComposite = (url: string, id: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `group_reference_${id.substring(0, 8)}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (event) => {
        setStoryIdea(event.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const handleGenerateClick = (type: 'image' | 'video') => {
    setCurrentPromptType(type);
    onGeneratePrompts(type);
  };

  const isPrimaryActionDisabled = !storyIdea.trim() || characters.length === 0 || videoConfig.duration <= 0 || isLoading;
  const canGenerateComposite = characters.filter(c => c.referenceImage).length >= 2;

  return (
    <div className="p-6 bg-[#1E1E22] rounded-lg shadow-lg space-y-8 border-2 border-gray-700">
      {/* Reference Characters */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-100 flex items-center gap-x-2">
             <UserGroupIcon className="w-6 h-6 text-cyan-400"/>
            {t.referenceCharactersLabel}
          </h2>
          <div className="flex items-center gap-x-2">
             <button
                onClick={onGenerateCharacter}
                disabled={isCharacterLoading || !storyIdea.trim()}
                className="text-sm flex items-center gap-x-1.5 bg-[#0D0D0F] text-gray-300 font-semibold py-2 px-3 rounded-lg hover:bg-gray-700 transition-colors border border-gray-600 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed"
            >
                <SparklesIcon className="w-4 h-4" />
                {isCharacterLoading ? t.analyzingScript : t.autoGenerateButton}
            </button>
             <button
              onClick={onGenerateAllCharacterImages}
              disabled={isBatchCharacterImageLoading || characters.length === 0}
              className="text-sm flex items-center gap-x-1.5 bg-cyan-800/50 text-cyan-200 font-semibold py-2 px-3 rounded-lg hover:bg-cyan-700 hover:text-white transition-colors border border-cyan-700 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed"
            >
              <PhotoGroupIcon className="w-4 h-4" />
              {isBatchCharacterImageLoading ? t.generatingAllCharImagesButton : t.generateAllCharImagesButton}
            </button>
          </div>
        </div>
        <div className="space-y-4">
          {characters.map((char) => (
            <div key={char.id} className="bg-[#0D0D0F] p-4 rounded-lg border border-gray-700 space-y-3">
              <div className="flex gap-x-3">
                <div className="flex-grow space-y-2">
                  <input
                    type="text"
                    placeholder={t.characterNamePlaceholder}
                    value={char.name}
                    onChange={(e) => handleCharacterChange(char.id, 'name', e.target.value)}
                    className="w-full bg-gray-900/50 text-gray-200 p-2 rounded-md border border-gray-600 focus:ring-1 focus:ring-[#5BEAFF] focus:border-[#5BEAFF] transition"
                  />
                  <textarea
                    rows={4}
                    placeholder={t.characterDescriptionPlaceholder}
                    value={char.description}
                    onChange={(e) => handleCharacterChange(char.id, 'description', e.target.value)}
                    className="w-full bg-gray-900/50 text-gray-200 p-2 rounded-md border border-gray-600 focus:ring-1 focus:ring-[#5BEAFF] focus:border-[#5BEAFF] transition text-sm"
                  />
                </div>
                <div className="flex-shrink-0 w-40 space-y-2 flex flex-col items-center">
                    <label className="text-xs text-gray-400">{t.characterImageLabel}</label>
                    <div className="w-full h-32 bg-gray-900/50 rounded-md flex items-center justify-center border-2 border-dashed border-gray-600 overflow-hidden relative">
                       {char.isGeneratingImage && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><div className="w-8 h-8 border-2 border-dashed rounded-full animate-spin border-cyan-400"></div></div>}
                        {char.referenceImage ? (
                            <img src={char.referenceImage.url} alt={char.name} className="w-full h-full object-cover" />
                        ) : (
                            <p className="text-gray-600 text-xs text-center p-2">{t.noImageGenerated}</p>
                        )}
                    </div>
                    <button
                        onClick={() => onGenerateCharacterImage(char.id)}
                        disabled={!char.description || char.isGeneratingImage}
                        className="w-full text-sm flex items-center justify-center gap-x-1.5 bg-cyan-800/50 text-cyan-200 font-semibold py-2 px-3 rounded-lg hover:bg-cyan-700 hover:text-white transition-colors border border-cyan-700 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed"
                    >
                        <CameraIcon className="w-4 h-4" />
                        {char.isGeneratingImage ? t.generatingImageButton : t.generateImageButton}
                    </button>
                </div>
              </div>
              <button
                onClick={() => handleRemoveCharacter(char.id)}
                className="text-xs text-red-400 hover:text-red-300 flex items-center gap-x-1"
              >
                <TrashIcon className="w-4 h-4" /> {t.removeCharacterButton}
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={handleAddCharacter}
          className="w-full text-sm bg-[#0D0D0F] text-gray-300 font-semibold py-2 px-3 rounded-lg hover:bg-gray-800/50 transition-colors border border-dashed border-gray-600"
        >
          {t.addCharacterButton}
        </button>
      </div>

      {/* Group References */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-100 flex items-center gap-x-2">
            <PhotoGroupIcon className="w-6 h-6 text-cyan-400"/>
            {t.groupReferenceLabel}
          </h2>
          <div className="relative group">
            <button
                onClick={onGenerateCompositeImage}
                disabled={!canGenerateComposite || isGeneratingComposite}
                className="text-sm flex items-center gap-x-1.5 bg-[#0D0D0F] text-gray-300 font-semibold py-2 px-3 rounded-lg hover:bg-gray-700 transition-colors border border-gray-600 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed"
            >
                <SparklesIcon className="w-4 h-4" />
                {isGeneratingComposite ? t.creatingGroupReferenceButton : t.createGroupReferenceButton}
            </button>
          </div>
        </div>
        <div className="p-3 bg-[#0D0D0F] rounded-lg border border-gray-700 min-h-[80px] flex flex-wrap gap-3 items-center">
            {isGeneratingComposite && (
                <div className="w-16 h-16 bg-gray-900/50 rounded-md flex items-center justify-center border-2 border-dashed border-cyan-700 animate-pulse">
                     <div className="w-6 h-6 border-2 border-dashed rounded-full animate-spin border-cyan-400"></div>
                </div>
            )}
            {compositeReferenceImages.length === 0 && !isGeneratingComposite ? (
                <p className="text-gray-600 text-sm">{t.noGroupReferences}</p>
            ) : (
                compositeReferenceImages.map(comp => (
                    <div key={comp.id} className="relative group w-24 h-24 rounded-md overflow-hidden">
                        <img src={comp.url} alt="Composite" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-x-2">
                            <button 
                                onClick={() => handleDownloadComposite(comp.url, comp.id)}
                                title={t.downloadGroupReferenceTooltip}
                                className="p-2 rounded-full text-white bg-cyan-600 hover:bg-cyan-700 transition-colors"
                            >
                                <DownloadIcon className="w-5 h-5"/>
                            </button>
                            <button 
                                onClick={() => onDeleteCompositeImage(comp.id)} 
                                title={t.deleteGroupReferenceTooltip}
                                className="p-2 rounded-full text-white bg-red-600 hover:bg-red-700 transition-colors"
                            >
                                <TrashIcon className="w-5 h-5"/>
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
      </div>


      {/* Story Idea / Script */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
            <label htmlFor="story-idea" className="text-xl font-bold text-gray-100">{t.scriptLabel}</label>
             <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="text/plain"
            />
            <button
                onClick={handleUploadClick}
                className="flex items-center gap-x-1.5 bg-[#0D0D0F] text-gray-300 font-semibold py-2 px-3 rounded-lg hover:bg-gray-700 transition-colors border border-gray-600 text-sm"
            >
                <UploadIcon className="w-4 h-4" />
                {t.uploadScriptButton}
            </button>
        </div>
        <div className="relative">
          <textarea
            id="story-idea"
            rows={8}
            className="w-full bg-[#0D0D0F] text-gray-300 p-3 rounded-md border border-gray-600 focus:ring-2 focus:ring-[#5BEAFF] focus:border-[#5BEAFF] transition pr-32"
            placeholder={t.scriptPlaceholder}
            value={storyIdea}
            onChange={(e) => setStoryIdea(e.target.value)}
          />
          <button
            onClick={onGenerateStoryIdea}
            disabled={isIdeaLoading}
            className="absolute top-2 right-2 flex items-center gap-x-1.5 bg-cyan-800/50 text-cyan-200 font-semibold py-2 px-3 rounded-lg hover:bg-cyan-700 hover:text-white transition-colors border border-cyan-700 disabled:bg-gray-700 disabled:text-gray-500"
          >
            <WandIcon className="w-4 h-4" />
            {isIdeaLoading ? t.suggestingIdeaButton : t.suggestIdeaButton}
          </button>
        </div>
      </div>

      {/* Video Settings */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-100">{t.videoSettingsLabel}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-[#0D0D0F] border border-gray-700 rounded-lg">
          
           <div className="space-y-2">
             <h3 className="font-semibold text-gray-400 text-sm">{t.videoGenerationSettingsLabel}</h3>
            <div className="space-y-2">
                <label htmlFor="duration" className="block text-xs font-medium text-gray-500">{t.durationLabel}</label>
                <input
                    id="duration"
                    type="number"
                    min="0.1"
                    step="0.1"
                    className="w-full bg-gray-900/50 text-gray-300 p-2 rounded-md border border-gray-600 focus:ring-2 focus:ring-[#5BEAFF] transition"
                    placeholder={t.durationPlaceholder}
                    value={videoConfig.duration || ''}
                    onChange={(e) => setVideoConfig('duration', parseFloat(e.target.value))}
                />
            </div>
             <div className="space-y-2">
                <label htmlFor="style" className="block text-xs font-medium text-gray-500">{t.styleLabel}</label>
                 <select
                    id="style"
                    className="w-full bg-gray-900/50 text-gray-300 p-2 rounded-md border border-gray-600 focus:ring-2 focus:ring-[#5BEAFF] transition"
                    value={videoConfig.style}
                    onChange={(e) => setVideoConfig('style', e.target.value)}
                >
                    {VIDEO_STYLES.map(s => <option key={s.key} value={s.key}>{s[language]}</option>)}
                </select>
            </div>
             <div className="space-y-2">
                <label htmlFor="framing" className="block text-xs font-medium text-gray-500">{t.framingLabel}</label>
                 <select
                    id="framing"
                    className="w-full bg-gray-900/50 text-gray-300 p-2 rounded-md border border-gray-600 focus:ring-2 focus:ring-[#5BEAFF] transition"
                    value={videoConfig.framing}
                    onChange={(e) => setVideoConfig('framing', e.target.value)}
                >
                    {FRAMING_STYLES.map(s => <option key={s.key} value={s.en}>{s[language]}</option>)}
                </select>
            </div>
          </div>
          <div className="space-y-2">
             <h3 className="font-semibold text-gray-400 text-sm">{t.dialogueSettingsLabel}</h3>
             <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-500">{t.dialogueSettingsLabel}</label>
                <div className="flex gap-x-2">
                    <button onClick={() => setVideoConfig('includeDialogue', false)} className={`flex-1 p-2 rounded-md text-sm transition ${!videoConfig.includeDialogue ? 'bg-cyan-800/70 text-cyan-200 border-cyan-700' : 'bg-gray-800/50 text-gray-400 border-gray-600'} border`}>{t.dialogueOffLabel}</button>
                    <button onClick={() => setVideoConfig('includeDialogue', true)} className={`flex-1 p-2 rounded-md text-sm transition ${videoConfig.includeDialogue ? 'bg-cyan-800/70 text-cyan-200 border-cyan-700' : 'bg-gray-800/50 text-gray-400 border-gray-600'} border`}>{t.dialogueOnLabel}</button>
                </div>
            </div>
            {videoConfig.includeDialogue && (
                 <div className="space-y-2">
                    <label htmlFor="dialogue-lang" className="block text-xs font-medium text-gray-500">{t.dialogueLanguageLabel}</label>
                     <select
                        id="dialogue-lang"
                        className="w-full bg-gray-900/50 text-gray-300 p-2 rounded-md border border-gray-600 focus:ring-2 focus:ring-[#5BEAFF] transition"
                        value={videoConfig.dialogueLanguage}
                        onChange={(e) => setVideoConfig('dialogueLanguage', e.target.value)}
                    >
                        {DIALOGUE_LANGUAGES.map(l => <option key={l.key} value={l.key}>{l.label}</option>)}
                    </select>
                </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Primary Action Buttons */}
      <div className="pt-4 border-t-2 border-gray-800/50 space-y-3">
         <p className="text-center text-xs text-gray-500">Select the type of prompts to generate from your script:</p>
         <div className="flex flex-col sm:flex-row gap-4">
            <button
            onClick={() => handleGenerateClick('image')}
            disabled={isPrimaryActionDisabled}
            className="flex-1 flex items-center justify-center gap-x-2 bg-gradient-to-r from-cyan-500 to-[#5BEAFF] text-black font-bold py-3 px-4 rounded-lg text-lg hover:opacity-90 transition-opacity disabled:from-gray-600 disabled:to-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
            <CameraIcon className="w-6 h-6" />
            {(isLoading && currentPromptType === 'image') ? t.generatingImagePromptsButton : t.generateImagePromptsButton}
            </button>
             <button
            onClick={() => handleGenerateClick('video')}
            disabled={isPrimaryActionDisabled}
            className="flex-1 flex items-center justify-center gap-x-2 bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white font-bold py-3 px-4 rounded-lg text-lg hover:opacity-90 transition-opacity disabled:from-gray-600 disabled:to-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
            <VideoCameraIcon className="w-6 h-6" />
            {(isLoading && currentPromptType === 'video') ? t.generatingVideoPromptsButton : t.generateVideoPromptsButton}
            </button>
         </div>
      </div>
    </div>
  );
};

export default InputPanel;
