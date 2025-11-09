import React from 'react';
import type { Scene, CharacterProfile, VideoConfig, GeneratedImage, ReferenceImage } from '../types';
import SceneCard from './SceneCard';
import Loader from './Loader';
import type { TranslationKeys, Language } from '../translations';
import DownloadIcon from './icons/DownloadIcon';
import PhotoGroupIcon from './icons/PhotoGroupIcon';
import SparklesIcon from './icons/SparklesIcon';

interface SceneTimelineProps {
  scenes: Scene[];
  onUpdatePrompt: (sceneId: number, newPrompt: string) => void;
  onUpdateSceneCharacters: (sceneId: number, characterIds: string[]) => void;
  isLoading: boolean;
  isBatchGenerating: boolean;
  isGenerationComplete: boolean;
  generationProgress: { current: number; total: number };
  generationStatusMessage: string;
  onDownloadPrompts: () => void;
  onDownloadAllImages: () => void;
  characters: CharacterProfile[];
  onGenerateSceneImage: (sceneId: number, imageRefIds: string[]) => void;
  onDeleteSceneImage: (sceneId: number, imageId: string) => void;
  onGenerateAllSceneImages: () => void;
  onEditSceneImage: (scene: Scene, image: GeneratedImage) => void;
  onViewImage: (imageUrl: string) => void;
  onSuggestPrompts: (sceneId: number) => void;
  t: TranslationKeys;
  language: Language;
}

const SceneTimeline: React.FC<SceneTimelineProps> = ({ 
  scenes, 
  onUpdatePrompt, 
  onUpdateSceneCharacters,
  isLoading, 
  isBatchGenerating,
  onDownloadPrompts,
  onDownloadAllImages,
  characters,
  onGenerateSceneImage,
  onDeleteSceneImage, 
  onGenerateAllSceneImages,
  onEditSceneImage,
  onViewImage,
  onSuggestPrompts,
  t,
  isGenerationComplete,
  generationProgress,
  generationStatusMessage,
  language
}) => {
  const sortedScenes = [...scenes].sort((a, b) => a.scene_id - b.scene_id);
  
  const hasGeneratedImages = scenes.some(s => s.generatedImages && s.generatedImages.length > 0);
  const hasAnyCharacterReferenceImage = characters.some(c => c.referenceImage);

  const canBatchGenerate = () => {
      if (!hasAnyCharacterReferenceImage || isLoading || isBatchGenerating) return false;
      return true;
  }

  return (
    <div className="p-6 bg-[#0D0D0F] rounded-lg min-h-full">
      <div className="flex flex-col gap-4 mb-6 border-b-2 border-[#1E1E22] pb-4">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-100">
            {t.timelineTitle}
            </h2>
            <button 
                onClick={onDownloadPrompts}
                disabled={isLoading || isBatchGenerating || scenes.length === 0}
                className="flex items-center gap-x-2 bg-[#1E1E22] text-[#5BEAFF] font-semibold py-2 px-4 rounded-lg hover:bg-cyan-900/50 transition-colors disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed"
            >
                <DownloadIcon className="w-5 h-5" />
                {t.downloadButton}
            </button>
        </div>

        {/* Batch Image & Video Tools */}
        {scenes.length > 0 && (
            <div className="space-y-4">
                {/* Image Tools */}
                <div className="bg-[#1E1E22] p-3 rounded-lg border border-gray-700 flex flex-wrap items-end gap-4">
                    <div className="flex-grow flex items-center gap-x-4">
                    <button
                        onClick={onGenerateAllSceneImages}
                        disabled={!canBatchGenerate()}
                        className="flex items-center gap-x-2 bg-cyan-800/50 text-cyan-200 font-semibold py-2 px-3 rounded-lg hover:bg-cyan-700 hover:text-white transition-colors border border-cyan-700 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed"
                    >
                        <PhotoGroupIcon className="w-5 h-5" />
                        {isBatchGenerating ? t.generatingAllImagesButton : t.generateAllImagesButton}
                    </button>
                    <p className="text-xs text-gray-500">{t.autodetectReferenceTooltip}</p>
                    </div>
                    <button 
                        onClick={onDownloadAllImages}
                        disabled={isLoading || isBatchGenerating || !hasGeneratedImages}
                        className="flex items-center gap-x-2 bg-[#1E1E22] text-gray-300 font-semibold py-2 px-3 rounded-lg hover:bg-gray-700 hover:text-white transition-colors border border-gray-600 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed"
                    >
                        <DownloadIcon className="w-5 h-5" />
                        {t.downloadAllImagesButton}
                    </button>
                </div>
            </div>
        )}
      </div>

      {/* Generation Log/Progress */}
      {(isLoading && !isBatchGenerating) && (
        <div className="mb-6 bg-[#1E1E22] p-4 rounded-lg border border-cyan-800 shadow-lg">
            <Loader t={t} progress={generationProgress} statusMessage={generationStatusMessage} />
        </div>
      )}
      
      {/* Scene Content */}
      {scenes.length === 0 && !isLoading ? (
        <div className="flex flex-col items-center justify-center h-96 bg-[#1E1E22] rounded-lg text-center p-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-300">{t.emptyTimelineTitle}</h3>
          <p className="text-gray-500 mt-2">{t.emptyTimelineDescription}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedScenes.map((scene) => (
            <SceneCard 
              key={scene.scene_id} 
              scene={scene} 
              onUpdatePrompt={onUpdatePrompt}
              onUpdateSceneCharacters={onUpdateSceneCharacters}
              onGenerateSceneImage={onGenerateSceneImage}
              onDeleteSceneImage={onDeleteSceneImage}
              onEditSceneImage={onEditSceneImage}
              onViewImage={onViewImage}
              onSuggestPrompts={onSuggestPrompts}
              isLoading={isLoading}
              isBatchGenerating={isBatchGenerating}
              characters={characters}
              language={language}
              t={t} 
            />
          ))}
        </div>
      )}

      {/* Completion Indicator */}
      {isGenerationComplete && !isLoading && scenes.length > 0 && (
        <div className="flex justify-center items-center mt-8">
          <Loader t={t} isComplete={true} />
        </div>
      )}
    </div>
  );
};

export default SceneTimeline;
