const KEYS_STORAGE_KEY = 'gemini_api_keys';
const INDEX_STORAGE_KEY = 'gemini_api_key_index';

export const getGeminiKeys = (): string[] => {
    const storedKeys = localStorage.getItem(KEYS_STORAGE_KEY);
    if (!storedKeys) {
        return [];
    }
    try {
        const parsed: unknown = JSON.parse(storedKeys);
        if (Array.isArray(parsed) && parsed.every((item): item is string => typeof item === 'string')) {
            return parsed;
        }
    } catch (e) {
        console.error("Failed to parse Gemini keys from localStorage", e);
    }
    return [];
};

export const saveGeminiKeys = (keys: string[]): void => {
    localStorage.setItem(KEYS_STORAGE_KEY, JSON.stringify(keys));
    // Reset index whenever keys are saved to start from the first key
    localStorage.setItem(INDEX_STORAGE_KEY, '0');
};

const getKeyIndex = (): number => {
    const storedIndex = localStorage.getItem(INDEX_STORAGE_KEY);
    const index = storedIndex ? parseInt(storedIndex, 10) : 0;
    return isNaN(index) ? 0 : index;
};

const setKeyIndex = (index: number): void => {
    localStorage.setItem(INDEX_STORAGE_KEY, index.toString());
};

export const getCurrentGeminiKey = (): string | undefined => {
    const keys = getGeminiKeys();
    if (keys.length === 0) return undefined;
    const index = getKeyIndex();
    // Ensure index is within bounds
    return keys[index % keys.length];
};

export const rotateToNextGeminiKey = (): void => {
    const keys = getGeminiKeys();
    if (keys.length === 0) return;
    const currentIndex = getKeyIndex();
    const nextIndex = (currentIndex + 1) % keys.length;
    setKeyIndex(nextIndex);
};