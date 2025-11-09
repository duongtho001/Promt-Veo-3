import { ReactNode } from "react";

export interface ReferenceImage {
  url: string;
  id_base: string;
}

// FIX: Added missing type definitions for AIVideo services
export interface AIVideoModel {
  id: string;
  name: string;
}

export type VideoStatus =
  | 'REQUESTING'
  | 'MEDIA_GENERATION_STATUS_PENDING'
  | 'MEDIA_GENERATION_STATUS_ACTIVE'
  | 'MEDIA_GENERATION_STATUS_PROCESSING'
  | 'MEDIA_GENERATION_STATUS_SUCCESSFUL'
  | 'MEDIA_GENERATION_STATUS_FAILED'
  | 'TIMEOUT'
  | 'ERROR';
  
export interface VideoGenerationResult {
  id_base: string;
  status: VideoStatus;
  prompt?: string;
  download_url?: string;
  thumbnail_url?: string;
}

export interface CompositeReferenceImage extends ReferenceImage {
  id: string;
  characterIds: string[];
}

export interface GeneratedImage extends ReferenceImage {
  usedCharacterIds: string[];
  editedFromId?: string;
}

export interface Scene {
  scene_id: number;
  time: string;
  prompt: string;
  characterIds?: string[];
  generatedImages?: GeneratedImage[];
  isGeneratingImage?: boolean;
}

export interface CharacterProfile {
  id: string;
  name: string;
  description: string;
  referenceImage?: ReferenceImage;
  isGeneratingImage?: boolean;
}

export interface VideoConfig {
  duration: number;
  style: string;
  framing: string;
  includeDialogue: boolean;
  dialogueLanguage: string;
  // FIX: Added properties to support service/model selection from UI
  imageService: 'google' | 'aivideoauto' | 'whomeai';
  imageModel: string;
  videoService: 'aivideoauto';
  videoModel: string;
}

export interface Project {
  id: string;
  name: string;
  characters: CharacterProfile[];
  storyIdea: string;
  videoConfig: VideoConfig;
  scenes: Scene[];
  compositeReferenceImages?: CompositeReferenceImage[];
  lastModified: number;
  generatedScript: string;
}
