import type { VideoConfig } from './types';

export type Language = 'en' | 'vi';

export interface TranslationKeys {
  appTitle: string;
  appDescription: string;
  newProjectButton: string;
  guideButtonTooltip: string;
  settingsButtonTooltip: string;
  libraryButtonTooltip: string; 
  projectLibraryButtonTooltip: string;
  languageLabel: string;
  untitledProject: string;
  referenceCharactersLabel: string;
  analyzingScript: string;
  autoGenerateButton: string;
  generateAllCharImagesButton: string;
  generatingAllCharImagesButton: string;
  createGroupReferenceButton: string;
  creatingGroupReferenceButton: string;
  whomeaiGroupReferenceNotSupportedTooltip: string;
  groupReferenceLabel: string;
  noGroupReferences: string;
  deleteGroupReferenceTooltip: string;
  downloadGroupReferenceTooltip: string;
  characterNamePlaceholder: string;
  removeCharacterButton: string;
  characterDescriptionPlaceholder: string;
  characterImageLabel: string;
  noImageGenerated: string;
  generatingImageButton: string;
  generateImageButton: string;
  downloadCharacterImageButton: string;
  addCharacterButton: string;
  scriptLabel: string;
  uploadScriptButton: string;
  suggestingIdeaButton: string;
  suggestIdeaButton: string;
  scriptPlaceholder: string;
  videoSettingsLabel: string;
  imageGenerationSettingsLabel: string;
  videoGenerationSettingsLabel: string;
  imageServiceLabel: string;
  videoServiceLabel: string;
  imageModelLabel: string;
  videoModelLabel: string;
  googleService: string;
  aivideoautoService: string;
  whomeaiService: string;
  noModelsAvailable: string;
  durationLabel: string;
  durationPlaceholder: string;
  durationFeedback: (scenes: number, minutes: number, seconds: number) => string;
  durationTooShortError: string;
  styleLabel: string;
  framingLabel: string;
  dialogueSettingsLabel: string;
  dialogueOffLabel: string;
  dialogueOnLabel: string;
  dialogueLanguageLabel: string;
  generatingImagePromptsButton: string;
  generateImagePromptsButton: string;
  generatingVideoPromptsButton: string;
  generateVideoPromptsButton: string;
  sceneLabel: string;
  timeLabel: string;
  promptLabel: string;
  promptHelperTooltip: string;
  suggestPromptsButtonTooltip: string;
  promptSuggestionModalTitle: string;
  suggestedImagePromptLabel: string;
  suggestedVideoPromptLabel: string;
  useThisPromptButton: string;
  generatingSuggestions: string;
  sceneImageLabel: string;
  charactersInSceneLabel: string; 
  editButton: string; 
  doneButton: string; 
  noCharactersTagged: string; 
  noReferenceImagesForSelection: string;
  usedReferencesLabel: string;
  deleteImageTooltip: string;
  viewImageTooltip: string;
  editImageTooltip: string;
  editPromptModalTitle: string;
  closeButtonLabel: string;
  timelineTitle: string;
  downloadButton: string;
  generatingAllImagesButton: string;
  generateAllImagesButton: string;
  downloadAllImagesButton: string;
  generateVideoButton: string;
  generatingVideoButton: string;
  videoResultTitle: string;
  videoStatusLabel: string;
  downloadVideoButton: string;
  videoStatus: { [key: string]: string };
  emptyTimelineTitle: string;
  emptyTimelineDescription: string;
  loaderText: string;
  generationComplete: string;
  generatingScene: (current: number, total: number) => string;
  generationStatusPreparing: string;
  generationStatusRequesting: (batch: number) => string;
  generationStatusAnalyzing: string;
  generationStatusCalculating: (total: number) => string;
  errorGeneratingImage: string;
  generationIncompleteError: (current: number, total: number) => string;
  newProjectConfirmationTitle: string;
  newProjectConfirmationMessage: string;
  confirmButton: string;
  cancelButton: string;
  resumeGenerationTitle: string;
  resumeButton: string;
  finishForNowButton: string;
  continueGenerationTitle: string;
  continueGenerationMessage: (generated: number, total: number) => string;
  continueGenerationButton: string;
  guideModalTitle: string;
  guideSteps: Array<{ title: string; description: string }>;
  settingsModalTitle: string;
  accessTokenLabel: string;
  accessTokenPlaceholder: string;
  accessTokenNote: string;
  whomeaiApiKeyLabel: string;
  whomeaiApiKeyPlaceholder: string;
  whomeaiApiKeyNote: string;
  geminiApiKeyLabel: string;
  geminiApiKeyPlaceholder: string;
  geminiApiKeyNote: string;
  saveButton: string;
  savingButton: string;
  tokenVerified: string;
  // Library Modal
  libraryModalTitle: string;
  uploadToLibraryButton: string;
  uploadingToLibraryButton: string;
  emptyLibraryMessage: string;
  // Project Library Modal
  projectLibraryModalTitle: string;
  loadProjectButton: string;
  deleteProjectButton: string;
  emptyProjectLibraryMessage: string;
  lastModifiedLabel: string;
  deleteProjectConfirmationTitle: string;
  deleteProjectConfirmationMessage: (name: string) => string;
  // Resume Session
  resumeSessionTitle: string;
  resumeSessionMessage: string;
  resumeSessionConfirm: string;
  resumeSessionDecline: string;
  errorAllKeysExhausted: string;
  errorSingleKeyExhausted: string;
  errorModelOverloaded: string;

  promptHelperTitle: string;
  promptHelperTags: { [key: string]: { group: string; tags: Array<{ tag: string; desc: string }> } };
  systemInstruction_generateStoryIdea: (style: string) => string;
  systemInstruction_generateScript: (config: VideoConfig) => string;
  systemInstruction_generateScenes: (config: VideoConfig, isContinuation: boolean, characters: string[], promptType: 'image' | 'video') => string;
  systemInstruction_generateCharacters: (duration: number, style: string) => string;
  systemInstruction_generatePromptSuggestions: (characters: string[], style: string, framing: string) => string;
}

const en: TranslationKeys = {
  appTitle: "Storyboard AI",
  appDescription: "Generate video scripts and storyboards with AI",
  newProjectButton: "New Project",
  guideButtonTooltip: "Show user guide",
  settingsButtonTooltip: "Settings",
  libraryButtonTooltip: "Reference Library",
  projectLibraryButtonTooltip: "Project Library",
  languageLabel: "Language",
  untitledProject: "Untitled Project",
  referenceCharactersLabel: "Reference Characters",
  analyzingScript: "Analyzing...",
  autoGenerateButton: "Auto-Generate from Story Idea",
  generateAllCharImagesButton: "Generate All Images",
  generatingAllCharImagesButton: "Generating All...",
  createGroupReferenceButton: "Create Group Reference",
  creatingGroupReferenceButton: "Creating...",
  whomeaiGroupReferenceNotSupportedTooltip: "Group Reference creation is not supported by the WhomeAI service.",
  groupReferenceLabel: "Group References",
  noGroupReferences: "No group references created yet.",
  deleteGroupReferenceTooltip: "Delete Group Reference",
  downloadGroupReferenceTooltip: "Download Group Reference",
  characterNamePlaceholder: "Character Name...",
  removeCharacterButton: "Remove",
  characterDescriptionPlaceholder: "Detailed character description (appearance, personality, role in the story, etc.). The more detail, the better the image generation.",
  characterImageLabel: "Reference Image",
  noImageGenerated: "No image generated yet.",
  generatingImageButton: "Generating...",
  generateImageButton: "Generate Image",
  downloadCharacterImageButton: "Download Image",
  addCharacterButton: "+ Add Character",
  scriptLabel: "Script / Story Idea",
  uploadScriptButton: "Upload Script (.txt)",
  suggestingIdeaButton: "Suggesting...",
  suggestIdeaButton: "Suggest Idea",
  scriptPlaceholder: "Enter your full script here, or a detailed story idea. You can also upload a .txt file. The AI will break this down into scenes.",
  videoSettingsLabel: "Video Settings",
  imageGenerationSettingsLabel: "Image Generation Settings",
  videoGenerationSettingsLabel: "Video Generation Settings",
  imageServiceLabel: "Service",
  videoServiceLabel: "Service",
  imageModelLabel: "Model",
  videoModelLabel: "Model",
  googleService: "Google AI",
  aivideoautoService: "AIVideoAuto",
  whomeaiService: "WhomeAI (Nano)",
  noModelsAvailable: "No models available",
  durationLabel: "Approximate Video Duration (minutes)",
  durationPlaceholder: "e.g., 2",
  durationFeedback: (scenes, minutes, seconds) => `~${scenes} scenes, final duration: ${minutes}m ${seconds}s.`,
  durationTooShortError: "Video duration is too short to generate any scenes. Please enter a longer duration.",
  styleLabel: "Visual Style",
  framingLabel: "Framing / Aspect Ratio",
  dialogueSettingsLabel: "Dialogue",
  dialogueOffLabel: "No Dialogue / BGM Only",
  dialogueOnLabel: "Include Dialogue",
  dialogueLanguageLabel: "Dialogue Language",
  generatingImagePromptsButton: "Generating Image Prompts...",
  generateImagePromptsButton: "Generate Image Prompts",
  generatingVideoPromptsButton: "Generating Video Prompts...",
  generateVideoPromptsButton: "Generate Video Prompts",
  sceneLabel: "Scene",
  timeLabel: "Time",
  promptLabel: "Image Prompt",
  promptHelperTooltip: "Prompt Helper",
  suggestPromptsButtonTooltip: "Suggest Prompts",
  promptSuggestionModalTitle: "Prompt Suggestions",
  suggestedImagePromptLabel: "Image Prompt (Concise, for stills)",
  suggestedVideoPromptLabel: "Video Prompt (Detailed, for motion)",
  useThisPromptButton: "Use this Prompt",
  generatingSuggestions: "Generating suggestions...",
  sceneImageLabel: "Scene Image Variations",
  charactersInSceneLabel: "Characters in Scene",
  editButton: "Edit",
  doneButton: "Done",
  noCharactersTagged: "No characters tagged in this scene.",
  noReferenceImagesForSelection: "Generate character reference images first to select them here.",
  usedReferencesLabel: "References Used:",
  deleteImageTooltip: "Delete this image",
  viewImageTooltip: "View Image",
  editImageTooltip: "Edit & Re-generate Image",
  editPromptModalTitle: "Edit Prompt & Re-generate",
  closeButtonLabel: "Close",
  timelineTitle: "Storyboard Timeline",
  downloadButton: "Download Prompts",
  generatingAllImagesButton: "Generating All...",
  generateAllImagesButton: "Generate All Images",
  downloadAllImagesButton: "Download All Images",
  generateVideoButton: "Generate Video",
  generatingVideoButton: "Generating Video...",
  videoResultTitle: "Generated Video",
  videoStatusLabel: "Status",
  downloadVideoButton: "Download Video",
  videoStatus: {
      "REQUESTING": "Requesting video creation...",
      "MEDIA_GENERATION_STATUS_PENDING": "Pending: The request is waiting to be processed.",
      "MEDIA_GENERATION_STATUS_ACTIVE": "Active: Video generation has been activated.",
      "MEDIA_GENERATION_STATUS_PROCESSING": "Processing: The video is currently rendering.",
      "MEDIA_GENERATION_STATUS_SUCCESSFUL": "Success: The video has been generated.",
      "MEDIA_GENERATION_STATUS_FAILED": "Failed: An error occurred during video generation.",
      "TIMEOUT": "Timeout: Generation took longer than 10 minutes.",
      "ERROR": "Error: An unknown error occurred.",
  },
  emptyTimelineTitle: "Your storyboard is empty",
  emptyTimelineDescription: "Provide a script and settings, then click 'Generate Prompts' to see your scenes here.",
  loaderText: "Generating...",
  generationComplete: "Generation Complete!",
  generatingScene: (current, total) => `Generating scene ${current} of ${total}...`,
  generationStatusPreparing: "Preparing to generate scenes...",
  generationStatusRequesting: (batch) => `Requesting scene batch #${batch}...`,
  generationStatusAnalyzing: "Analyzing script...",
  generationStatusCalculating: (total) => `Analysis complete. Preparing to generate ${total} scenes.`,
  errorGeneratingImage: "An error occurred while generating the image.",
  generationIncompleteError: (current, total) => `Generation stopped. Only ${current} out of ${total} scenes were created. Would you like to try resuming?`,
  newProjectConfirmationTitle: "Start New Project?",
  newProjectConfirmationMessage: "Are you sure you want to start a new project? All unsaved progress will be lost.",
  confirmButton: "Confirm",
  cancelButton: "Cancel",
  resumeGenerationTitle: "Resume Generation?",
  resumeButton: "Resume",
  finishForNowButton: "Finish for Now",
  continueGenerationTitle: 'Continue Generation?',
  continueGenerationMessage: (generated, total) => `Successfully generated ${generated} out of ${total} scenes. Do you want to continue?`,
  continueGenerationButton: 'Continue',
  guideModalTitle: "How to Use Storyboard AI",
  guideSteps: [
    { title: "Set API Keys (Important!)", description: "Click the settings icon (gear) in the header to enter your API keys. Keys for Gemini are required for basic functions. Keys for other services enable more image generation options." },
    { title: "Set Video Style", description: "Choose a visual style and desired duration for your video. This guides the entire generation process." },
    { title: "Write or Upload a Script", description: "Write your script or story idea in the main text box. You can also use the 'Suggest Idea' button or upload a .txt file. This text will be used to create the scenes." },
    { title: "Create Characters & Library", description: "Add main characters and generate a reference image for each. These images are automatically saved to your Reference Library (photo album icon). You can also upload your own images to the library." },
    { title: "Generate Prompts", description: "Once your script and characters are ready, choose to generate 'Image Prompts' or 'Video Prompts'. The AI will break down your script into a list of scenes with corresponding prompts." },
    { title: "Generate Scene Images", description: "For each scene, tag the characters present. Then, generate an image for that scene using the generated image prompt. You can generate multiple variations or edit and regenerate them." },
    { title: "Download", description: "When you're happy with the results, you can download all the prompts as a text file or all the generated images as a zip file." },
  ],
  settingsModalTitle: "Settings",
  accessTokenLabel: "AIVideoAuto Access Token",
  accessTokenPlaceholder: "Enter your Access Token here",
  accessTokenNote: "Get your Access Token from aivideoauto.com",
  whomeaiApiKeyLabel: "WhomeAI API Key",
  whomeaiApiKeyPlaceholder: "Enter your WhomeAI API Key (e.g., sk-demo)",
  whomeaiApiKeyNote: "Used for Nano Banana model image generation.",
  geminiApiKeyLabel: "Gemini API Keys",
  geminiApiKeyPlaceholder: "Enter one Gemini API Key per line...",
  geminiApiKeyNote: "Keys are used in order. If one fails, the next is tried automatically.",
  saveButton: "Save Settings",
  savingButton: "Verifying & Saving...",
  tokenVerified: "Settings Verified & Saved!",
  // Library Modal
  libraryModalTitle: "Reference Image Library",
  uploadToLibraryButton: "Upload Image",
  uploadingToLibraryButton: "Uploading...",
  emptyLibraryMessage: "Your library is empty. Generate character images or upload a file to add references.",
  // Project Library Modal
  projectLibraryModalTitle: "Project Library",
  loadProjectButton: "Load",
  deleteProjectButton: "Delete",
  emptyProjectLibraryMessage: "No saved projects found. Start a new project to see it here.",
  lastModifiedLabel: "Last modified",
  deleteProjectConfirmationTitle: "Delete Project?",
  deleteProjectConfirmationMessage: (name: string) => `Are you sure you want to permanently delete the project "${name}"? This action cannot be undone.`,
  // Resume Session
  resumeSessionTitle: "Resume Previous Session?",
  resumeSessionMessage: "It looks like you have unsaved work from a previous session. Would you like to continue where you left off?",
  resumeSessionConfirm: "Yes, Resume",
  resumeSessionDecline: "No, Start New",
  errorAllKeysExhausted: "All provided Gemini API keys have exceeded their usage quotas. Please add new keys in the Settings panel or wait for the daily quota to reset.",
  errorSingleKeyExhausted: "Your Gemini API key has exceeded its usage quota. Please add additional keys in the Settings panel or wait for the daily quota to reset.",
  errorModelOverloaded: "The AI model is currently overloaded. Please try again in a few moments.",
  promptHelperTitle: "Prompt Helper (Click to add)",
  promptHelperTags: {
    cam: { group: "🎥 [CAM] – Camera & Composition", tags: [{ tag: "[CAM]: \n", desc: "Angle, lens, composition, movement" }] },
    subj: { group: "👩 [SUBJ] – Human Subject", tags: [{ tag: "[SUBJ]: \n", desc: "Character / pose / expression" }] },
    char: { group: "💇 [CHAR] – Character Appearance", tags: [{ tag: "[CHAR]: \n", desc: "Detailed appearance" }] },
    set: { group: "🏠 [SET] – Setting / Environment", tags: [{ tag: "[SET]: \n", desc: "Environment, background" }] },
    mood: { group: "💫 [MOOD] – Emotion & Atmosphere", tags: [{ tag: "[MOOD]: \n", desc: "Emotion and atmosphere" }] },
    fx: { group: "✨ [FX] – Effects & Light Behavior", tags: [{ tag: "[FX]: \n", desc: "Effects and lighting" }] },
    clr: { group: "🎨 [CLR] – Color Palette", tags: [{ tag: "[CLR]: \n", desc: "Color palette" }] },
    snd: { group: "🔊 [SND] – Sound Design", tags: [{ tag: "[SND]: \n", desc: "Sound design" }] },
    edit: { group: "🧰 [EDIT] – Post-processing & Avoids", tags: [{ tag: "[EDIT]: \n", desc: "Post-processing and elements to avoid" }] },
    rndr: { group: "🖥️ [RNDR] – Render Engine & Quality", tags: [{ tag: "[RNDR]: \n", desc: "Render engine and quality" }] },
    sty: { group: "🎭 [STY] – Artistic Style & Genre", tags: [{ tag: "[STY]: \n", desc: "Artistic style and genre" }] },
    tim: { group: "⏱️ [TIM] – Timing / Duration / Transition", tags: [{ tag: "[TIM]: \n", desc: "Timing and transitions" }] },
    focal: { group: "🎯 !FOCAL – Focal Point", tags: [{ tag: "!FOCAL: \n", desc: "Main focal point" }] },
  },
  systemInstruction_generateStoryIdea: (style) => `You are a creative assistant. Generate a short, single-paragraph story idea suitable for a short video. The story should be interesting and visually compelling. The desired visual style is "${style}". Keep the idea concise and focused. The language of the response must be the same as the user's prompt. IMPORTANT: You must strictly adhere to safety policies. Do not generate content that is sexually explicit, depicts violence, promotes illegal acts, involves minors, or other sensitive topics.`,
  systemInstruction_generateScript: (config) => `You are a scriptwriter. Based on the provided story idea, characters, and video configuration, write a complete script. The script should be suitable for a video of approximately ${config.duration} seconds.
- The script must be detailed, describing actions, settings, and character emotions.
- ${config.includeDialogue ? `Include dialogue for the characters in the specified language: ${config.dialogueLanguage}. Format dialogue as "CHARACTER NAME: Dialogue text."` : "Do not include any dialogue. The script should be for a video with only background music and visual storytelling."}
- Ensure the pacing fits the short video format.
- The tone should match the visual style: "${config.style}".
- **Safety Policy:** The script must be safe for a general audience and strictly avoid sexually explicit content, extreme violence, illegal acts, or other policy-violating topics. Ensure the story is respectful and ethical.`,
  systemInstruction_generateScenes: (config, isContinuation, characters, promptType) => {
    const commonRules = `You are a professional director of photography and an AI prompt engineer. Your task is to analyze a script and generate a sequence of detailed prompts for each scene.

**CRITICAL RULES:**
1.  **JSON Format:** Your response MUST be a single, valid JSON object containing one key: "scenes". The value of "scenes" must be an array of scene objects. Do not include any other text, explanations, or markdown.
2.  **Scene Structure:** Each scene object must have \`scene_id\` (sequential integer), \`time\` ("MM:SS" format), \`prompt\` (string), and \`character_names\` (array of character names present in the scene).
3.  **Characters:** The \`character_names\` array MUST contain the names of characters (from the list: ${characters.join(', ')}) who appear in the scene. If none, the array should be empty [].
4.  **Duration:** Each scene corresponds to roughly 8 seconds. Generate approximately ${Math.round((config.duration * 60) / 8)} scenes.
${isContinuation ? "5. **Continuation Task:** You have already generated some scenes. Continue from where you left off, ensuring the new \`scene_id\` and \`time\` are sequential and correct. Do not repeat existing scenes." : ""}`;

    const imagePromptInstruction = `
**PROMPT TYPE: IMAGE**
*   **Goal:** Each prompt will be used to generate a single, high-quality **keyframe image** representing that scene.
*   **Prompt Structure:** The \`prompt\` string MUST be constructed by joining the following tags, with each tag on a new line. The prompt must be in English and focus on static visual elements.

**DETAILED PROMPT STRUCTURE (Each tag on a new line):**
*   **🎥 [CAM]:** Describe the camera angle, lens, composition, and movement. Always include the aspect ratio: ${config.framing.includes('9:16') ? '9:16 aspect ratio' : '16:9 aspect ratio'}.
*   **👩 [SUBJ]:** Describe the human subject in the scene: ethnicity, gender, age, body type, pose, and expression.
*   **💇 [CHAR]:** Describe the character's detailed appearance: hair, skin, outfit.
*   **🏠 [SET]:** Describe the setting: location, background, environmental lighting, and props.
*   **💫 [MOOD]:** Describe the scene's emotion and atmosphere: theme, character mood, and emotional color tone.
*   **✨ [FX]:** Describe effects and light behavior: main lighting style, glow/reflections, and grain.
*   **🎨 [CLR]:** Describe the color palette: key colors and color balance.
*   **🧰 [EDIT]:** Describe post-processing and elements to avoid.
*   **🖥️ [RNDR]:** Describe the render quality.
*   **🎭 [STY]:** Describe the artistic style and genre. Always include the main style: **${config.style}**.
*   **🎯 !FOCAL:** Describe the AI's main focal point.`;

    const videoPromptInstruction = `
**PROMPT TYPE: VIDEO**
*   **Goal:** Each prompt will be used to generate a short **video clip** for that scene.
*   **Prompt Structure:** For the \`prompt\` field, write a single descriptive paragraph in English. This paragraph must be a complete, cinematic shot description.
*   **Content:** The prompt should vividly describe:
    *   **Action:** What are the characters doing? What is happening in the scene?
    *   **Movement:** Describe character actions (e.g., "walking slowly", "glances over her shoulder") and camera movement (e.g., "slow pan left", "dynamic handheld shot following the character", "crane shot revealing the city").
    *   **Atmosphere:** Include details about lighting, weather, and mood to create a rich, cinematic feel.
    *   **Do not use the tag-based structure like [CAM], [SUBJ] etc. for video prompts.**`;

    return `${commonRules}\n\n${promptType === 'image' ? imagePromptInstruction : videoPromptInstruction}`;
  },
  systemInstruction_generateCharacters: (duration, style) => `You are a character designer. Your task is to analyze the provided story idea for a ${duration}-second video and create detailed character descriptions (Character DNA).

**CRITICAL INSTRUCTIONS:**
1.  **Style Adherence:** The video's visual style is **"${style}"**. All character descriptions MUST be tailored to fit this specific aesthetic. For example, if the style is 'anime', describe characters with features common in that style.
2.  **Identify Key Characters:** Identify the main characters (maximum 3-4).
3.  **Detailed Visuals:** For each character, provide a description that includes visual details necessary for an AI image generator:
    -   Gender, approximate age.
    -   Hair color and style (e.g., spiky, long, wavy).
    -   Eye color and shape.
    -   Clothing style, specific garments, and colors.
    -   Distinguishing features (e.g., glasses, a scar, accessories).
    -   Overall mood or personality that can be visually represented (e.g., cheerful, stoic, mysterious).
4.  **Safety Adherence:** All character descriptions must be appropriate and safe for a general audience, strictly avoiding sexually suggestive, excessively violent, or other policy-violating content.

**Output Format:**
-   You MUST output a single, valid JSON object.
-   The JSON object must contain one key: "characters".
-   The value of "characters" must be an array of objects, where each object has two keys: "name" (string) and "description" (string).
-   Do not include any text, explanations, or markdown formatting before or after the JSON object.

Example of a valid response for a 'Cyberpunk' style:
{
  "characters": [
    {
      "name": "Kaito",
      "description": "A male in his late 20s with sharp features. He has short, silver hair with a cybernetic blue undercut, and glowing cyan eyes. He wears a high-collar black trench coat over a dark grey armored vest, and cargo pants. A distinctive feature is a barcode tattoo on his neck and a metallic glint from a neural interface port on his temple. His expression is stoic and focused."
    }
  ]
}`,
  systemInstruction_generatePromptSuggestions: (characters, style, framing) => `You are an expert AI prompt engineer. Your task is to rewrite a given scene description into two distinct formats: one optimized for generating a static image, and another for generating a video clip.

**CRITICAL INSTRUCTIONS:**
1.  **JSON Output:** Your response MUST be a single, valid JSON object with two keys: "imagePrompt" and "videoPrompt". Do not include any other text or explanations.
2.  **Context:** The scene involves these characters: ${characters.join(', ')}. The overall visual style is "${style}". The aspect ratio is based on "${framing}".
3.  **Image Prompt ("imagePrompt"):**
    *   This prompt should be concise and focus on a single, powerful keyframe.
    *   Describe the composition, characters' poses and expressions, lighting, and environment as if it's a photograph.
    *   Do NOT include descriptions of movement, sound, or actions over time.
    *   It should be visually rich but brief.
4.  **Video Prompt ("videoPrompt"):**
    *   This prompt should be more descriptive and imply motion and time.
    *   Include details about camera movement (e.g., "slow pan", "dolly zoom"), character actions (e.g., "walking slowly", "looks up suddenly"), and environmental effects (e.g., "rain streaks down the window", "leaves blowing in the wind").
    *   It should set a scene that unfolds over a few seconds.

**Analyze the following scene description and generate the two prompts accordingly.**`,
};

const vi: TranslationKeys = {
  ...en, // Default to English if not translated
  appTitle: "Storyboard AI",
  appDescription: "Tạo kịch bản và storyboard cho video bằng AI",
  newProjectButton: "Dự án mới",
  guideButtonTooltip: "Hướng dẫn",
  settingsButtonTooltip: "Cài đặt",
  libraryButtonTooltip: "Thư viện tham chiếu",
  projectLibraryButtonTooltip: "Thư viện dự án",
  languageLabel: "Ngôn ngữ",
  untitledProject: "Dự án chưa có tên",
  referenceCharactersLabel: "Nhân vật tham chiếu",
  analyzingScript: "Đang phân tích...",
  autoGenerateButton: "Tự động tạo từ ý tưởng",
  generateAllCharImagesButton: "Tạo tất cả ảnh",
  generatingAllCharImagesButton: "Đang tạo tất cả...",
  createGroupReferenceButton: "Tạo ảnh ghép tham chiếu",
  creatingGroupReferenceButton: "Đang tạo...",
  whomeaiGroupReferenceNotSupportedTooltip: "Tính năng tạo ảnh tham chiếu nhóm không được dịch vụ WhomeAI hỗ trợ.",
  groupReferenceLabel: "Ảnh tham chiếu nhóm",
  noGroupReferences: "Chưa có ảnh tham chiếu nhóm nào được tạo.",
  deleteGroupReferenceTooltip: "Xóa ảnh tham chiếu nhóm",
  downloadGroupReferenceTooltip: "Tải ảnh tham chiếu nhóm",
  characterNamePlaceholder: "Tên nhân vật...",
  removeCharacterButton: "Xóa",
  characterDescriptionPlaceholder: "Mô tả chi tiết về nhân vật (ngoại hình, tính cách, vai trò trong câu chuyện, v.v.). Càng chi tiết, hình ảnh tạo ra càng đẹp.",
  characterImageLabel: "Ảnh tham chiếu",
  noImageGenerated: "Chưa có ảnh nào được tạo.",
  generatingImageButton: "Đang tạo...",
  generateImageButton: "Tạo ảnh",
  downloadCharacterImageButton: "Tải ảnh",
  addCharacterButton: "+ Thêm nhân vật",
  scriptLabel: "Kịch bản / Ý tưởng",
  uploadScriptButton: "Tải lên kịch bản (.txt)",
  suggestingIdeaButton: "Đang đề xuất...",
  suggestIdeaButton: "Đề xuất ý tưởng",
  scriptPlaceholder: "Nhập toàn bộ kịch bản của bạn ở đây, hoặc một ý tưởng câu chuyện chi tiết. Bạn cũng có thể tải lên một tệp .txt. AI sẽ chia nó thành các cảnh.",
  videoSettingsLabel: "Cài đặt Video",
  imageGenerationSettingsLabel: "Cài đặt tạo ảnh",
  videoGenerationSettingsLabel: "Cài đặt tạo video",
  imageServiceLabel: "Dịch vụ",
  videoServiceLabel: "Dịch vụ",
  imageModelLabel: "Model",
  videoModelLabel: "Model",
  googleService: "Google AI",
  aivideoautoService: "AIVideoAuto",
  whomeaiService: "WhomeAI (Nano)",
  noModelsAvailable: "Không có model nào",
  durationLabel: "Thời lượng video ước tính (phút)",
  durationPlaceholder: "ví dụ: 2",
  durationFeedback: (scenes, minutes, seconds) => `~${scenes} cảnh, thời lượng cuối cùng: ${minutes} phút ${seconds} giây.`,
  durationTooShortError: "Thời lượng video quá ngắn để tạo cảnh. Vui lòng nhập thời lượng dài hơn.",
  styleLabel: "Phong cách hình ảnh",
  framingLabel: "Khung hình / Tỷ lệ",
  dialogueSettingsLabel: "Hội thoại",
  dialogueOffLabel: "Không hội thoại / Chỉ nhạc nền",
  dialogueOnLabel: "Bao gồm hội thoại",
  dialogueLanguageLabel: "Ngôn ngữ hội thoại",
  generatingImagePromptsButton: "Đang tạo Prompt ảnh...",
  generateImagePromptsButton: "Tạo Prompt Ảnh",
  generatingVideoPromptsButton: "Đang tạo Prompt video...",
  generateVideoPromptsButton: "Tạo Prompt Video",
  sceneLabel: "Cảnh",
  timeLabel: "Thời gian",
  promptLabel: "Prompt hình ảnh",
  promptHelperTooltip: "Hỗ trợ prompt",
  suggestPromptsButtonTooltip: "Gợi ý Prompt",
  promptSuggestionModalTitle: "Gợi ý Prompt",
  suggestedImagePromptLabel: "Prompt Ảnh (Ngắn gọn, cho ảnh tĩnh)",
  suggestedVideoPromptLabel: "Prompt Video (Chi tiết, cho video)",
  useThisPromptButton: "Sử dụng Prompt này",
  generatingSuggestions: "Đang tạo gợi ý...",
  sceneImageLabel: "Các phiên bản ảnh của cảnh",
  charactersInSceneLabel: "Nhân vật trong cảnh",
  editButton: "Sửa",
  doneButton: "Xong",
  noCharactersTagged: "Không có nhân vật nào được gắn thẻ trong cảnh này.",
  noReferenceImagesForSelection: "Hãy tạo ảnh tham chiếu cho nhân vật trước để chọn tại đây.",
  usedReferencesLabel: "Tham chiếu đã dùng:",
  deleteImageTooltip: "Xóa ảnh này",
  viewImageTooltip: "Xem ảnh",
  editImageTooltip: "Sửa & Tạo lại ảnh",
  editPromptModalTitle: "Sửa Prompt & Tạo lại",
  closeButtonLabel: "Đóng",
  timelineTitle: "Dòng thời gian Storyboard",
  downloadButton: "Tải Prompt",
  generatingAllImagesButton: "Đang tạo tất cả...",
  generateAllImagesButton: "Tạo tất cả ảnh",
  downloadAllImagesButton: "Tải tất cả ảnh",
  generateVideoButton: "Tạo Video",
  generatingVideoButton: "Đang tạo Video...",
  videoResultTitle: "Video đã tạo",
  videoStatusLabel: "Trạng thái",
  downloadVideoButton: "Tải Video",
  videoStatus: {
      "REQUESTING": "Đang yêu cầu tạo video...",
      "MEDIA_GENERATION_STATUS_PENDING": "Đang chờ: Yêu cầu đang chờ được xử lý.",
      "MEDIA_GENERATION_STATUS_ACTIVE": "Hoạt động: Quá trình tạo video đã được kích hoạt.",
      "MEDIA_GENERATION_STATUS_PROCESSING": "Đang xử lý: Video đang được render.",
      "MEDIA_GENERATION_STATUS_SUCCESSFUL": "Thành công: Video đã được tạo.",
      "MEDIA_GENERATION_STATUS_FAILED": "Thất bại: Đã xảy ra lỗi trong quá trình tạo video.",
      "TIMEOUT": "Hết thời gian: Quá trình tạo mất hơn 10 phút.",
      "ERROR": "Lỗi: Đã xảy ra lỗi không xác định.",
  },
  emptyTimelineTitle: "Storyboard của bạn đang trống",
  emptyTimelineDescription: "Cung cấp kịch bản và cài đặt, sau đó nhấp vào 'Tạo Prompt' để xem các cảnh của bạn ở đây.",
  loaderText: "Đang tạo...",
  generationComplete: "Hoàn tất!",
  generatingScene: (current, total) => `Đang tạo cảnh ${current} trên ${total}...`,
  generationStatusPreparing: "Đang chuẩn bị tạo các cảnh...",
  generationStatusRequesting: (batch) => `Đang yêu cầu lô cảnh #${batch}...`,
  generationStatusAnalyzing: "Đang phân tích kịch bản...",
  generationStatusCalculating: (total) => `Phân tích xong. Chuẩn bị tạo ${total} cảnh.`,
  errorGeneratingImage: "Đã xảy ra lỗi khi tạo ảnh.",
  generationIncompleteError: (current, total) => `Quá trình tạo đã dừng. Chỉ có ${current} trên ${total} cảnh được tạo. Bạn có muốn thử tiếp tục không?`,
  newProjectConfirmationTitle: "Bắt đầu dự án mới?",
  newProjectConfirmationMessage: "Bạn có chắc muốn bắt đầu một dự án mới không? Mọi tiến trình chưa lưu sẽ bị mất.",
  confirmButton: "Xác nhận",
  cancelButton: "Hủy",
  resumeGenerationTitle: "Tiếp tục tạo?",
  resumeButton: "Tiếp tục",
  finishForNowButton: "Để sau",
  continueGenerationTitle: 'Tiếp tục tạo?',
  continueGenerationMessage: (generated, total) => `Đã tạo thành công ${generated} trên ${total} cảnh. Bạn có muốn tiếp tục không?`,
  continueGenerationButton: 'Tiếp tục',
  guideModalTitle: "Hướng dẫn sử dụng Storyboard AI",
  guideSteps: [
    { title: "Cài đặt API Keys (Quan trọng!)", description: "Nhấp vào biểu tượng cài đặt (bánh răng) ở thanh tiêu đề để nhập các API key của bạn. Key của Gemini là bắt buộc cho các chức năng cơ bản. Key cho các dịch vụ khác sẽ bật thêm tùy chọn tạo ảnh." },
    { title: "Đặt phong cách video", description: "Chọn một phong cách hình ảnh và thời lượng mong muốn cho video của bạn. Điều này sẽ định hướng toàn bộ quá trình tạo." },
    { title: "Viết hoặc tải lên kịch bản", description: "Viết kịch bản hoặc ý tưởng câu chuyện của bạn vào ô văn bản chính. Bạn cũng có thể dùng nút 'Đề xuất ý tưởng' hoặc tải lên một tệp .txt. Văn bản này sẽ được dùng để tạo ra các cảnh." },
    { title: "Tạo Nhân vật & Thư viện", description: "Thêm các nhân vật chính và tạo ảnh tham chiếu cho mỗi nhân vật. Các ảnh này sẽ tự động được lưu vào Thư viện tham chiếu (biểu tượng album ảnh). Bạn cũng có thể tải ảnh của riêng mình lên thư viện." },
    { title: "Tạo Prompts", description: "Khi kịch bản và nhân vật đã sẵn sàng, hãy chọn tạo 'Prompt Ảnh' hoặc 'Prompt Video'. AI sẽ chia kịch bản của bạn thành danh sách các cảnh với các prompt tương ứng." },
    { title: "Tạo ảnh cho cảnh", description: "Đối với mỗi cảnh, hãy gắn thẻ các nhân vật có mặt. Sau đó, tạo ảnh cho cảnh đó bằng prompt ảnh đã tạo. Bạn có thể tạo nhiều biến thể hoặc chỉnh sửa và tạo lại chúng." },
    { title: "Tải xuống", description: "Khi bạn hài lòng với kết quả, bạn có thể tải xuống tất cả các prompt dưới dạng tệp văn bản hoặc tất cả các hình ảnh đã tạo dưới dạng tệp zip." },
  ],
  settingsModalTitle: "Cài đặt",
  accessTokenLabel: "Access Token của AIVideoAuto",
  accessTokenPlaceholder: "Nhập Access Token của bạn tại đây",
  accessTokenNote: "Lấy Access Token của bạn từ aivideoauto.com",
  whomeaiApiKeyLabel: "WhomeAI API Key",
  whomeaiApiKeyPlaceholder: "Nhập WhomeAI API Key của bạn (ví dụ: sk-demo)",
  whomeaiApiKeyNote: "Sử dụng cho việc tạo ảnh bằng model Nano Banana.",
  geminiApiKeyLabel: "API Keys của Gemini",
  geminiApiKeyPlaceholder: "Nhập mỗi API Key trên một dòng...",
  geminiApiKeyNote: "Các key được sử dụng lần lượt. Nếu một key lỗi, key tiếp theo sẽ tự động được thử.",
  saveButton: "Lưu Cài đặt",
  savingButton: "Đang kiểm tra & Lưu...",
  tokenVerified: "Cài đặt đã được xác minh & Lưu!",
  libraryModalTitle: "Thư viện ảnh tham chiếu",
  uploadToLibraryButton: "Tải ảnh lên",
  uploadingToLibraryButton: "Đang tải lên...",
  emptyLibraryMessage: "Thư viện của bạn đang trống. Hãy tạo ảnh nhân vật hoặc tải tệp lên để thêm ảnh tham chiếu.",
  projectLibraryModalTitle: "Thư viện dự án",
  loadProjectButton: "Tải",
  deleteProjectButton: "Xóa",
  emptyProjectLibraryMessage: "Không tìm thấy dự án nào đã lưu. Bắt đầu một dự án mới để thấy nó ở đây.",
  lastModifiedLabel: "Sửa đổi lần cuối",
  deleteProjectConfirmationTitle: "Xóa dự án?",
  deleteProjectConfirmationMessage: (name) => `Bạn có chắc muốn xóa vĩnh viễn dự án "${name}" không? Hành động này không thể hoàn tác.`,
  resumeSessionTitle: "Tiếp tục phiên trước?",
  resumeSessionMessage: "Có vẻ như bạn có công việc chưa lưu từ phiên trước. Bạn có muốn tiếp tục nơi bạn đã dừng lại không?",
  resumeSessionConfirm: "Có, tiếp tục",
  resumeSessionDecline: "Không, bắt đầu mới",
  errorAllKeysExhausted: "Tất cả các khóa API Gemini được cung cấp đều đã vượt quá hạn ngạch sử dụng. Vui lòng thêm khóa mới trong bảng Cài đặt hoặc đợi hạn ngạch hàng ngày được đặt lại.",
  errorSingleKeyExhausted: "Khóa API Gemini của bạn đã vượt quá hạn ngạch sử dụng. Vui lòng thêm các khóa bổ sung trong bảng Cài đặt hoặc đợi hạn ngạch hàng ngày được đặt lại.",
  errorModelOverloaded: "Model AI hiện đang quá tải. Vui lòng thử lại sau giây lát.",
  promptHelperTitle: "Hỗ trợ Prompt (Nhấp để thêm)",
  promptHelperTags: {
    cam: { group: "🎥 [CAM] – Camera & Composition", tags: [{ tag: "[CAM]: \n", desc: "Góc máy, ống kính, bố cục, chuyển động" }] },
    subj: { group: "👩 [SUBJ] – Human Subject", tags: [{ tag: "[SUBJ]: \n", desc: "Nhân vật / dáng / biểu cảm" }] },
    char: { group: "💇 [CHAR] – Character Appearance", tags: [{ tag: "[CHAR]: \n", desc: "Ngoại hình chi tiết" }] },
    set: { group: "🏠 [SET] – Setting / Environment", tags: [{ tag: "[SET]: \n", desc: "Môi trường, bối cảnh" }] },
    mood: { group: "💫 [MOOD] – Emotion & Atmosphere", tags: [{ tag: "[MOOD]: \n", desc: "Cảm xúc và không khí" }] },
    fx: { group: "✨ [FX] – Effects & Light Behavior", tags: [{ tag: "[FX]: \n", desc: "Hiệu ứng và ánh sáng" }] },
    clr: { group: "🎨 [CLR] – Color Palette", tags: [{ tag: "[CLR]: \n", desc: "Bảng màu" }] },
    snd: { group: "🔊 [SND] – Sound Design", tags: [{ tag: "[SND]: \n", desc: "Thiết kế âm thanh" }] },
    edit: { group: "🧰 [EDIT] – Post-processing & Avoids", tags: [{ tag: "[EDIT]: \n", desc: "Hậu kỳ và các yếu tố cần tránh" }] },
    rndr: { group: "🖥️ [RNDR] – Render Engine & Quality", tags: [{ tag: "[RNDR]: \n", desc: "Công cụ render và chất lượng" }] },
    sty: { group: "🎭 [STY] – Artistic Style & Genre", tags: [{ tag: "[STY]: \n", desc: "Phong cách nghệ thuật và thể loại" }] },
    tim: { group: "⏱️ [TIM] – Timing / Duration / Transition", tags: [{ tag: "[TIM]: \n", desc: "Thời gian và chuyển cảnh" }] },
    focal: { group: "🎯 !FOCAL – Focal Point", tags: [{ tag: "!FOCAL: \n", desc: "Điểm lấy nét chính" }] },
  },
  systemInstruction_generateStoryIdea: (style) => `Bạn là một trợ lý sáng tạo. Tạo một ý tưởng câu chuyện ngắn, trong một đoạn văn, phù hợp cho một video ngắn. Câu chuyện nên thú vị và hấp dẫn về mặt hình ảnh. Phong cách hình ảnh mong muốn là "${style}". Giữ ý tưởng ngắn gọn và tập trung. Ngôn ngữ của phản hồi phải giống với ngôn ngữ của prompt của người dùng. QUAN TRỌNG: Bạn phải tuân thủ nghiêm ngặt các chính sách an toàn. Không tạo nội dung khiêu dâm, mô tả bạo lực, quảng bá hành vi bất hợp pháp, liên quan đến trẻ em hoặc các chủ đề nhạy cảm khác.`,
  systemInstruction_generateScript: (config) => `Bạn là một nhà biên kịch. Dựa trên ý tưởng câu chuyện, nhân vật và cấu hình video được cung cấp, hãy viết một kịch bản hoàn chỉnh. Kịch bản phải phù hợp với một video có thời lượng khoảng ${config.duration} giây.
- Kịch bản phải chi tiết, mô tả hành động, bối cảnh và cảm xúc của nhân vật.
- ${config.includeDialogue ? `Bao gồm hội thoại cho các nhân vật bằng ngôn ngữ được chỉ định: ${config.dialogueLanguage}. Định dạng hội thoại là "TÊN NHÂN VẬT: Lời thoại."` : "Không bao gồm bất kỳ lời thoại nào. Kịch bản nên dành cho một video chỉ có nhạc nền và kể chuyện bằng hình ảnh."}
- Đảm bảo nhịp độ phù hợp với định dạng video ngắn.
- Giọng điệu phải phù hợp với phong cách hình ảnh: "${config.style}".
- **Chính sách an toàn:** Kịch bản phải an toàn cho khán giả đại chúng và tuyệt đối tránh nội dung khiêu dâm, bạo lực cực đoan, hành vi bất hợp pháp hoặc các chủ đề vi phạm chính sách khác. Đảm bảo câu chuyện tôn trọng và có đạo đức.`,
  systemInstruction_generateScenes: (config, isContinuation, characters, promptType) => {
    const commonRules = `Bạn là một đạo diễn hình ảnh chuyên nghiệp và kỹ sư prompt AI. Nhiệm vụ của bạn là phân tích kịch bản và tạo ra một chuỗi các prompt chi tiết cho từng cảnh.

**QUY TẮC BẮT BUỘC:**
1.  **Định dạng JSON:** Phản hồi của bạn PHẢI là một đối tượng JSON hợp lệ duy nhất, chứa một khóa "scenes". Giá trị của "scenes" là một mảng các đối tượng cảnh. Không bao gồm bất kỳ văn bản, giải thích hoặc markdown nào khác.
2.  **Cấu trúc Scene:** Mỗi đối tượng cảnh phải có \`scene_id\` (số nguyên tuần tự), \`time\` (định dạng "MM:SS"), \`prompt\` (chuỗi), và \`character_names\` (mảng tên nhân vật có trong cảnh).
3.  **Nhân vật:** Mảng \`character_names\` PHẢI chứa tên của các nhân vật (từ danh sách: ${characters.join(', ')}) xuất hiện trong cảnh. Nếu không có, mảng sẽ rỗng [].
4.  **Thời lượng:** Mỗi cảnh tương ứng với khoảng 8 giây. Tạo khoảng ${Math.round((config.duration * 60) / 8)} cảnh.
${isContinuation ? "5. **Tiếp tục công việc:** Bạn đã tạo một số cảnh trước đó. Hãy tiếp tục từ nơi bạn đã dừng, đảm bảo \`scene_id\` và \`time\` nối tiếp chính xác. Không lặp lại các cảnh đã có." : ""}`;

    const imagePromptInstruction = `
**LOẠI PROMPT: HÌNH ẢNH**
*   **Mục tiêu:** Mỗi prompt sẽ được dùng để tạo ra một **khung hình (keyframe) chất lượng cao** duy nhất đại diện cho cảnh đó.
*   **Cấu trúc Prompt:** Chuỗi \`prompt\` PHẢI được xây dựng bằng cách nối các thẻ sau, mỗi thẻ trên một dòng mới. Prompt phải bằng tiếng Anh và tập trung vào các yếu tố hình ảnh tĩnh.

**CẤU TRÚC PROMPT CHI TIẾT (Mỗi thẻ trên một dòng mới):**
*   **🎥 [CAM]:** Mô tả góc máy, ống kính, bố cục và chuyển động. Luôn bao gồm tỷ lệ khung hình: ${config.framing.includes('9:16') ? '9:16 aspect ratio' : '16:9 aspect ratio'}.
*   **👩 [SUBJ]:** Mô tả con người trong cảnh: chủng tộc, giới tính, tuổi tác, vóc dáng, tư thế và biểu cảm.
*   **💇 [CHAR]:** Mô tả chi tiết ngoại hình nhân vật: tóc, da, trang phục.
*   **🏠 [SET]:** Mô tả bối cảnh: địa điểm, nền, ánh sáng môi trường và đạo cụ.
*   **💫 [MOOD]:** Mô tả cảm xúc và không khí của cảnh: chủ đề, tâm trạng, tông màu cảm xúc.
*   **✨ [FX]:** Mô tả hiệu ứng và cách ánh sáng hoạt động: kiểu ánh sáng chính, hiệu ứng phản quang, độ nhiễu.
*   **🎨 [CLR]:** Mô tả bảng màu: các màu chủ đạo và cách phối màu.
*   **🧰 [EDIT]:** Mô tả hậu kỳ và các yếu tố cần tránh.
*   **🖥️ [RNDR]:** Mô tả chất lượng render.
*   **🎭 [STY]:** Mô tả phong cách nghệ thuật và thể loại. Luôn bao gồm phong cách chính: **${config.style}**.
*   **🎯 !FOCAL:** Mô tả điểm lấy nét chính của AI.`;

    const videoPromptInstruction = `
**LOẠI PROMPT: VIDEO**
*   **Mục tiêu:** Mỗi prompt sẽ được dùng để tạo ra một **video clip ngắn** cho cảnh đó.
*   **Cấu trúc Prompt:** Đối với trường \`prompt\`, hãy viết một đoạn văn mô tả duy nhất bằng tiếng Anh. Đoạn văn này phải là một mô tả cảnh quay điện ảnh hoàn chỉnh.
*   **Nội dung:** Prompt phải mô tả sống động:
    *   **Hành động:** Nhân vật đang làm gì? Chuyện gì đang xảy ra trong cảnh?
    *   **Chuyển động:** Mô tả hành động của nhân vật (ví dụ: "bước đi chậm rãi", "liếc qua vai") và chuyển động của máy quay (ví dụ: "lia máy chậm sang trái", "máy quay cầm tay linh hoạt theo sau nhân vật", "cú máy cẩu hé lộ thành phố").
    *   **Không khí:** Bao gồm chi tiết về ánh sáng, thời tiết và tâm trạng để tạo cảm giác điện ảnh, phong phú.
    *   **Không sử dụng cấu trúc dựa trên thẻ như [CAM], [SUBJ], v.v. cho prompt video.**`;

    return `${commonRules}\n\n${promptType === 'image' ? imagePromptInstruction : videoPromptInstruction}`;
  },
  systemInstruction_generateCharacters: (duration, style) => `Bạn là một nhà thiết kế nhân vật. Nhiệm vụ của bạn là phân tích ý tưởng câu chuyện được cung cấp cho một video dài ${duration} giây và tạo ra các mô tả nhân vật chi tiết (DNA nhân vật).

**CHỈ THỊ QUAN TRỌNG:**
1.  **Tuân thủ phong cách:** Phong cách hình ảnh của video là **"${style}"**. Tất cả các mô tả nhân vật PHẢI được điều chỉnh để phù hợp với thẩm mỹ cụ thể này. Ví dụ, nếu phong cách là 'anime', hãy mô tả các nhân vật với các đặc điểm phổ biến trong phong cách đó.
2.  **Xác định nhân vật chính:** Xác định các nhân vật chính (tối đa 3-4).
3.  **Chi tiết hình ảnh:** Đối với mỗi nhân vật, cung cấp một mô tả bao gồm các chi tiết hình ảnh cần thiết cho một trình tạo ảnh AI:
    -   Giới tính, tuổi tác gần đúng.
    -   Màu tóc và kiểu tóc (ví dụ: tóc nhọn, dài, lượn sóng).
    -   Màu mắt và hình dạng mắt.
    -   Phong cách quần áo, trang phục cụ thể và màu sắc.
    -   Các đặc điểm phân biệt (ví dụ: kính, sẹo, phụ kiện).
    -   Tâm trạng hoặc tính cách tổng thể có thể được thể hiện bằng hình ảnh (ví dụ: vui vẻ, khắc kỷ, bí ẩn).
4.  **Tuân thủ an toàn:** Tất cả các mô tả nhân vật phải phù hợp và an toàn cho khán giả đại chúng, tuyệt đối tránh nội dung khêu gợi tình dục, quá bạo lực hoặc vi phạm chính sách khác.

**Định dạng đầu ra:**
-   Bạn PHẢI xuất ra một đối tượng JSON hợp lệ duy nhất.
-   Đối tượng JSON phải chứa một khóa: "characters".
-   Giá trị của "characters" phải là một mảng các đối tượng, trong đó mỗi đối tượng có hai khóa: "name" (chuỗi) và "description" (chuỗi).
-   Không bao gồm bất kỳ văn bản, giải thích hoặc định dạng markdown nào trước hoặc sau đối tượng JSON.

Ví dụ về phản hồi hợp lệ cho phong cách 'Cyberpunk':
{
  "characters": [
    {
      "name": "Kaito",
      "description": "Một nam giới cuối độ tuổi 20 với những đường nét sắc sảo. Anh ta có mái tóc bạc ngắn với phần undercut màu xanh lam-cybernetic, và đôi mắt màu lục lam phát sáng. Anh ấy mặc một chiếc áo khoác trench coat cổ cao màu đen bên ngoài áo giáp màu xám đậm và quần túi hộp. Một đặc điểm nổi bật là hình xăm mã vạch trên cổ và ánh kim loại từ một cổng giao diện thần kinh trên thái dương. Biểu cảm của anh ấy khắc kỷ và tập trung."
    }
  ]
}`,
  systemInstruction_generatePromptSuggestions: (characters, style, framing) => `Bạn là một kỹ sư prompt AI chuyên nghiệp. Nhiệm vụ của bạn là viết lại một mô tả cảnh đã cho thành hai định dạng riêng biệt: một được tối ưu hóa để tạo ảnh tĩnh, và một để tạo video clip.

**HƯỚNG DẪN BẮT BUỘC:**
1.  **Định dạng JSON:** Phản hồi của bạn PHẢI là một đối tượng JSON hợp lệ duy nhất với hai khóa: "imagePrompt" và "videoPrompt". Không bao gồm bất kỳ văn bản hay giải thích nào khác.
2.  **Bối cảnh:** Cảnh này bao gồm các nhân vật: ${characters.join(', ')}. Phong cách hình ảnh tổng thể là "${style}". Tỷ lệ khung hình dựa trên "${framing}".
3.  **Prompt Ảnh ("imagePrompt"):**
    *   Prompt này nên ngắn gọn và tập trung vào một khung hình (keyframe) ấn tượng duy nhất.
    *   Mô tả bố cục, tư thế và biểu cảm của nhân vật, ánh sáng và môi trường như một bức ảnh chụp.
    *   KHÔNG bao gồm mô tả về chuyển động, âm thanh, hoặc hành động kéo dài theo thời gian.
    *   Nó phải giàu hình ảnh nhưng súc tích.
4.  **Prompt Video ("videoPrompt"):**
    *   Prompt này nên mô tả chi tiết hơn và bao hàm chuyển động và thời gian.
    *   Bao gồm chi tiết về chuyển động của máy quay (ví dụ: "lia máy chậm", "dolly zoom"), hành động của nhân vật (ví dụ: "bước đi chậm rãi", "bất ngờ ngước lên"), và các hiệu ứng môi trường (ví dụ: "mưa rơi trên cửa sổ", "lá bay trong gió").
    *   Nó phải tạo ra một cảnh diễn ra trong vài giây.

**Hãy phân tích mô tả cảnh sau đây và tạo ra hai prompt tương ứng.**`,
};

export const translations = {
  en,
  vi,
};
