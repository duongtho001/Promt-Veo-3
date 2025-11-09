import React from 'react';
import type { TranslationKeys } from '../translations';
import WandIcon from './icons/WandIcon';

interface PromptSuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPrompt: (prompt: string) => void;
  isLoading: boolean;
  suggestions: { imagePrompt: string; videoPrompt: string } | null;
  t: TranslationKeys;
}

const PromptSuggestionModal: React.FC<PromptSuggestionModalProps> = ({ 
    isOpen, 
    onClose, 
    onSelectPrompt,
    isLoading,
    suggestions,
    t 
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="suggestion-modal-title"
    >
      <div
        className="bg-[#1E1E22] rounded-lg shadow-2xl w-full max-w-2xl border-2 border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 flex justify-between items-center border-b border-gray-700">
          <h2 id="suggestion-modal-title" className="text-xl font-bold text-gray-100 flex items-center gap-x-2">
            <WandIcon className="w-6 h-6 text-cyan-400" />
            {t.promptSuggestionModalTitle}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label={t.closeButtonLabel}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {isLoading && (
            <div className="flex flex-col items-center justify-center space-y-3 p-8">
              <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-cyan-400"></div>
              <p className="text-cyan-300">{t.generatingSuggestions}</p>
            </div>
          )}
          {!isLoading && suggestions && (
            <>
              {/* Image Prompt */}
              <div className="space-y-2">
                <label className="font-semibold text-gray-300">{t.suggestedImagePromptLabel}</label>
                <textarea
                  readOnly
                  rows={5}
                  value={suggestions.imagePrompt}
                  className="w-full bg-[#0D0D0F] text-gray-300 p-3 rounded-md border border-gray-600 focus:ring-0 cursor-copy"
                  onClick={(e) => e.currentTarget.select()}
                />
                <div className="flex justify-end">
                    <button 
                        onClick={() => onSelectPrompt(suggestions.imagePrompt)}
                        className="bg-cyan-800/70 text-cyan-200 font-semibold py-2 px-4 rounded-lg hover:bg-cyan-700 hover:text-white transition-colors text-sm"
                    >
                        {t.useThisPromptButton}
                    </button>
                </div>
              </div>

              {/* Video Prompt */}
              <div className="space-y-2">
                <label className="font-semibold text-gray-300">{t.suggestedVideoPromptLabel}</label>
                <textarea
                  readOnly
                  rows={8}
                  value={suggestions.videoPrompt}
                  className="w-full bg-[#0D0D0F] text-gray-300 p-3 rounded-md border border-gray-600 focus:ring-0 cursor-copy"
                  onClick={(e) => e.currentTarget.select()}
                />
                 <div className="flex justify-end">
                    <button 
                        onClick={() => onSelectPrompt(suggestions.videoPrompt)}
                        className="bg-cyan-800/70 text-cyan-200 font-semibold py-2 px-4 rounded-lg hover:bg-cyan-700 hover:text-white transition-colors text-sm"
                    >
                        {t.useThisPromptButton}
                    </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PromptSuggestionModal;
