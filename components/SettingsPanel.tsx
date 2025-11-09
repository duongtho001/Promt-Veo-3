import React, { useState, useEffect } from 'react';
import type { TranslationKeys } from '../translations';
import { saveGeminiKeys, getGeminiKeys } from '../services/apiKeyManager';
import CheckCircleIcon from './icons/CheckCircleIcon';
import KeyIcon from './icons/KeyIcon';


interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  geminiApiKeys: string[];
  setGeminiApiKeys: (keys: string[]) => void;
  t: TranslationKeys;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  isOpen,
  onClose,
  geminiApiKeys,
  setGeminiApiKeys,
  t,
}) => {
  const [currentGeminiKeys, setCurrentGeminiKeys] = useState(geminiApiKeys.join('\n'));
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setCurrentGeminiKeys(getGeminiKeys().join('\n'));
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }
  
  const handleSave = async () => {
    setError(null);
    setSuccess(null);
    try {
      const keysArray = currentGeminiKeys.split('\n').map(k => k.trim()).filter(Boolean);
      saveGeminiKeys(keysArray);
      setGeminiApiKeys(keysArray);

      setSuccess(t.tokenVerified);
      setTimeout(() => {
        setSuccess(null);
        onClose();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-start z-50 p-4 pt-24"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-panel-title"
    >
      <div
        className="bg-[#1E1E22] rounded-lg shadow-2xl w-full max-w-lg border-2 border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 flex justify-between items-center border-b border-gray-700">
          <h2 id="settings-panel-title" className="text-xl font-bold text-gray-100">{t.settingsModalTitle}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Gemini API Keys */}
          <div>
            <label htmlFor="gemini-api-keys" className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-x-2">
               <KeyIcon className="w-5 h-5 text-blue-400" />
              {t.geminiApiKeyLabel}
            </label>
            <textarea
              id="gemini-api-keys"
              rows={4}
              value={currentGeminiKeys}
              onChange={(e) => setCurrentGeminiKeys(e.target.value)}
              placeholder={t.geminiApiKeyPlaceholder}
              className="w-full bg-[#0D0D0F] text-gray-300 p-3 rounded-md border border-gray-600 focus:ring-2 focus:ring-[#5BEAFF] focus:border-[#5BEAFF] transition"
            />
            <p className="text-xs text-gray-500 mt-2">{t.geminiApiKeyNote}</p>
          </div>
          
          {error && <p className="text-sm text-red-400 bg-red-900/50 p-3 rounded-md">{error}</p>}
          {success && <p className="text-sm text-green-400 bg-green-900/50 p-3 rounded-md flex items-center gap-x-2"><CheckCircleIcon className="w-5 h-5" /> {success}</p>}

        </div>
        <div className="bg-gray-800/50 px-6 py-4 flex justify-end">
          <button
            onClick={handleSave}
            className="bg-[#5BEAFF] text-[#0D0D0F] font-bold py-2 px-5 rounded-lg hover:bg-opacity-90 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            {t.saveButton}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
