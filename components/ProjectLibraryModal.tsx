import React, { useState, useEffect } from 'react';
import type { TranslationKeys, Language } from '../translations';
import type { Project } from '../types';
import * as dbService from '../services/dbService';
import ArchiveBoxIcon from './icons/ArchiveBoxIcon';
import TrashIcon from './icons/TrashIcon';
import ConfirmationModal from './ConfirmationModal';
import ExclamationTriangleIcon from './icons/ExclamationTriangleIcon';
import ProfessionalLoader from './ProfessionalLoader';

interface ProjectLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadProject: (projectId: string) => void;
  onDeleteProject: (projectId: string) => void;
  t: TranslationKeys;
  language: Language;
}

const ProjectLibraryModal: React.FC<ProjectLibraryModalProps> = ({
  isOpen,
  onClose,
  onLoadProject,
  onDeleteProject,
  t,
  language,
}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const allProjects = await dbService.getAllProjects();
      setProjects(allProjects);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      // You might want to show an error message to the user
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchProjects();
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleDeleteRequest = (project: Project) => {
    setProjectToDelete(project);
  };

  const confirmDelete = () => {
    if (projectToDelete) {
      onDeleteProject(projectToDelete.id);
      setProjects(prev => prev.filter(p => p.id !== projectToDelete.id));
      setProjectToDelete(null);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat(language, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(timestamp));
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-library-modal-title"
      >
        <div
          className="bg-[#1E1E22] rounded-lg shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col border-2 border-gray-700"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-6 py-4 flex justify-between items-center border-b border-gray-700 flex-shrink-0">
            <h2 id="project-library-modal-title" className="text-2xl font-bold text-gray-100 flex items-center gap-x-3">
              <ArchiveBoxIcon className="w-7 h-7 text-cyan-400" />
              {t.projectLibraryModalTitle}
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
          <div className="p-6 flex-grow overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <ProfessionalLoader size="modal" />
              </div>
            ) : projects.length === 0 ? (
              <div className="flex items-center justify-center h-full text-center text-gray-500">
                <p>{t.emptyProjectLibraryMessage}</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {projects.map((project) => (
                  <li key={project.id} className="bg-[#0D0D0F] p-4 rounded-lg border border-gray-700 flex justify-between items-center transition-all hover:border-cyan-500 hover:bg-[#2a2a2e]">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-200">{project.name}</h3>
                      <p className="text-xs text-gray-500">{t.lastModifiedLabel}: {formatDate(project.lastModified)}</p>
                    </div>
                    <div className="flex items-center gap-x-3">
                      <button
                        onClick={() => onLoadProject(project.id)}
                        className="bg-cyan-800/70 text-cyan-200 font-semibold py-2 px-4 rounded-lg hover:bg-cyan-700 hover:text-white transition-colors text-sm"
                      >
                        {t.loadProjectButton}
                      </button>
                      <button
                        onClick={() => handleDeleteRequest(project)}
                        className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-900/50 rounded-full transition-colors"
                        title={t.deleteProjectButton}
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={!!projectToDelete}
        onClose={() => setProjectToDelete(null)}
        onConfirm={confirmDelete}
        title={t.deleteProjectConfirmationTitle}
        message={projectToDelete ? t.deleteProjectConfirmationMessage(projectToDelete.name) : ''}
        confirmText={t.deleteProjectButton}
        cancelText={t.cancelButton}
        icon={<ExclamationTriangleIcon className="w-16 h-16 text-red-500" />}
      />
    </>
  );
};

export default ProjectLibraryModal;