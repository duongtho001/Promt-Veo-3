import type { Project } from '../types';

const DB_NAME = 'StoryboardAI_DB';
const DB_VERSION = 1;
const STORE_NAME = 'projects';

let db: IDBDatabase | null = null;

export const initDB = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve();
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('IndexedDB error:', request.error);
      reject(new Error('Failed to open IndexedDB.'));
    };

    request.onsuccess = () => {
      db = request.result;
      resolve();
    };

    request.onupgradeneeded = (event) => {
      const dbInstance = (event.target as IDBOpenDBRequest).result;
      if (!dbInstance.objectStoreNames.contains(STORE_NAME)) {
        const objectStore = dbInstance.createObjectStore(STORE_NAME, { keyPath: 'id' });
        objectStore.createIndex('lastModified', 'lastModified', { unique: false });
      }
    };
  });
};

export const saveProject = (project: Project): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error('Database is not initialized.'));
      return;
    }
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(project);

    request.onsuccess = () => resolve();
    request.onerror = () => {
        console.error('Save project error:', request.error);
        reject(new Error('Failed to save project.'));
    };
  });
};

export const getAllProjects = (): Promise<Project[]> => {
    return new Promise((resolve, reject) => {
      if (!db) {
        reject(new Error('Database is not initialized.'));
        return;
      }
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();
  
      request.onsuccess = () => {
        const sortedProjects = request.result.sort((a, b) => b.lastModified - a.lastModified);
        resolve(sortedProjects);
      };
      request.onerror = () => {
        console.error('Get all projects error:', request.error);
        reject(new Error('Failed to retrieve projects.'));
      };
    });
};

export const getProject = (id: string): Promise<Project | null> => {
    return new Promise((resolve, reject) => {
      if (!db) {
        reject(new Error('Database is not initialized.'));
        return;
      }
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);
  
      request.onsuccess = () => {
        resolve(request.result || null);
      };
      request.onerror = () => {
        console.error('Get project error:', request.error);
        reject(new Error('Failed to retrieve the project.'));
      };
    });
};

export const deleteProject = (id: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!db) {
        reject(new Error('Database is not initialized.'));
        return;
      }
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);
  
      request.onsuccess = () => resolve();
      request.onerror = () => {
        console.error('Delete project error:', request.error);
        reject(new Error('Failed to delete the project.'));
      };
    });
};

export const getLastProject = (): Promise<Project | null> => {
    return new Promise((resolve, reject) => {
        if (!db) {
          reject(new Error('Database is not initialized.'));
          return;
        }
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const index = store.index('lastModified');
        const cursorRequest = index.openCursor(null, 'prev'); // 'prev' for descending order
        let lastProject: Project | null = null;
    
        cursorRequest.onsuccess = (event) => {
          const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
          if (cursor) {
            lastProject = cursor.value;
          }
          // The cursor automatically stops after the first result because we don't call continue()
          resolve(lastProject);
        };
    
        cursorRequest.onerror = () => {
            console.error('Get last project error:', cursorRequest.error);
            reject(new Error('Failed to get the last project.'));
        };
      });
};
