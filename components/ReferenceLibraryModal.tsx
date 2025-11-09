import React, { useRef, useState } from 'react';
import type { TranslationKeys } from '../translations';
import type { ReferenceImage } from '../types';
import TrashIcon from './icons/TrashIcon';
import PhotoGroupIcon from './icons/PhotoGroupIcon';

interface ReferenceLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  library: ReferenceImage[];
  onDelete: (id: string) => void;
  t: TranslationKeys;
}

const ReferenceLibraryModal: React.FC<ReferenceLibraryModalProps> = ({
  isOpen,
  onClose,
  library,
  onDelete,
  t,
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
      aria-labelledby="library-modal-title"
    >
      <div
        className="bg-[#1E1E22] rounded-lg shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col border-2 border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 flex justify-between items-center border-b border-gray-700 flex-shrink-0">
          <h2 id="library-modal-title" className="text-2xl font-bold text-gray-100 flex items-center gap-x-3">
            <PhotoGroupIcon className="w-7 h-7 text-cyan-400" />
            {t.libraryModalTitle}
          </h2>
          <div className="flex items-center gap-x-4">
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
        </div>
        <div className="p-6 flex-grow overflow-y-auto">
          {library.length === 0 ? (
            <div className="flex items-center justify-center h-full text-center text-gray-500">
                <p>{t.emptyLibraryMessage}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {library.map((image) => (
                <div 
                    key={image.id_base} 
                    className="relative group aspect-square rounded-lg overflow-hidden"
                >
                  <img src={image.url} alt="Reference" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex justify-end items-start p-2">
                    <button 
                        onClick={(e) => { e.stopPropagation(); onDelete(image.id_base); }}
                        className="bg-red-600 text-white rounded-full p-1.5 hover:bg-red-700"
                        title={t.deleteImageTooltip}
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReferenceLibraryModal;
