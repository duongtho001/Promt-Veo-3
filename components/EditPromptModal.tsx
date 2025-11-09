import React, { useState, useEffect } from 'react';
import type { TranslationKeys } from '../translations';

interface EditPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (newPrompt: string) => void;
  initialPrompt: string | null;
  t: TranslationKeys;
}

const EditPromptModal: React.FC<EditPromptModalProps> = ({ isOpen, onClose, onGenerate, initialPrompt, t }) => {
  const [prompt, setPrompt] = useState(initialPrompt || '');

  useEffect(() => {
    if (isOpen) {
      setPrompt(initialPrompt || '');
    }
  }, [isOpen, initialPrompt]);

  if (!isOpen) {
    return null;
  }

  const handleGenerateClick = () => {
    if (prompt.trim()) {
      onGenerate(prompt);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-prompt-modal-title"
    >
      <div
        className="bg-[#1E1E22] rounded-lg shadow-2xl w-full max-w-xl border-2 border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 flex justify-between items-center border-b border-gray-700">
          <h2 id="edit-prompt-modal-title" className="text-xl font-bold text-gray-100">{t.editPromptModalTitle}</h2>
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
        <div className="p-6">
          <textarea
            rows={10}
            className="w-full bg-[#0D0D0F] text-gray-300 p-3 rounded-md border border-gray-600 focus:ring-2 focus:ring-[#5BEAFF] focus:border-[#5BEAFF] transition"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>
        <div className="bg-gray-800/50 px-6 py-4 flex justify-end gap-x-4">
           <button
            type="button"
            className="w-full inline-flex justify-center rounded-md border border-gray-600 shadow-sm px-4 py-2 bg-[#0D0D0F] text-base font-medium text-gray-300 hover:bg-gray-700 sm:w-auto sm:text-sm transition-colors"
            onClick={onClose}
          >
            {t.cancelButton}
          </button>
          <button
            type="button"
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#5BEAFF] text-base font-bold text-black hover:bg-opacity-90 sm:w-auto sm:text-sm transition-colors"
            onClick={handleGenerateClick}
          >
            {t.generateImageButton}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPromptModal;
