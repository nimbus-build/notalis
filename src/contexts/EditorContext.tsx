import { createContext } from 'preact';
import { useContext, useState, useCallback, useRef, useEffect } from 'preact/hooks';
import type { FunctionComponent, ComponentChildren } from 'preact';

// Feature detection for File System Access API
const isFileSystemAccessSupported = () => {
  return 'showOpenFilePicker' in window;
};

type FilePickerOptions = {
  types?: Array<{
    description?: string;
    accept: Record<string, string[]>;
  }>;
  multiple?: boolean;
};

interface EditorContextType {
  currentFileName: string | null;
  content: string;
  editorKey: number;
  fileHandle: FileSystemFileHandle | null;
  isSaving: boolean;
  error: string | null;
  isLoading: boolean;
  isSupported: boolean;
  setContent: (content: string) => void;
  openFile: () => Promise<void>;
  clearError: () => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const useEditorContext = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditorContext must be used within EditorProvider');
  }
  return context;
};

interface EditorProviderProps {
  children: ComponentChildren;
}

export const EditorProvider: FunctionComponent<EditorProviderProps> = ({ children }) => {
  const [currentFileName, setCurrentFileName] = useState<string | null>(null);
  const [content, setContent] = useState<string>('');
  const [editorKey, setEditorKey] = useState<number>(0);
  const [fileHandle, setFileHandle] = useState<FileSystemFileHandle | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSupported] = useState<boolean>(isFileSystemAccessSupported());
  const contentRef = useRef<string>(content);
  const saveTimeoutRef = useRef<number | null>(null);

  // Keep content ref in sync
  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  // Auto-save when content changes and file is open
  useEffect(() => {
    if (!fileHandle || !content) return;

    // Clear any existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    setIsSaving(true);
    setError(null);
    
    saveTimeoutRef.current = window.setTimeout(async () => {
      try {
        const writable = await fileHandle.createWritable();
        await writable.write(contentRef.current);
        await writable.close();
        setIsSaving(false);
      } catch (err) {
        console.error('Failed to auto-save:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to save file';
        setError(errorMessage);
        setIsSaving(false);
      }
    }, 500); // Debounce auto-save by 500ms

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [content, fileHandle]);

  const openFile = useCallback(async () => {
    if (!isSupported) {
      setError('File System Access API is not supported in this browser. Please use Chrome, Edge, or another compatible browser.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [handle] = await (window as any).showOpenFilePicker({
        types: [
          {
            description: 'Markdown Files',
            accept: {
              'text/markdown': ['.md', '.markdown'],
              'text/plain': ['.txt'],
            },
          },
        ],
        multiple: false,
      } as FilePickerOptions);

      const file = await handle.getFile();
      
      // Security: Validate file size (max 10MB for markdown files)
      const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
      if (file.size > MAX_FILE_SIZE) {
        throw new Error('File is too large. Maximum size is 10MB.');
      }

      const text = await file.text();
      
      // Security: Basic content validation - ensure it's valid text
      if (typeof text !== 'string') {
        throw new Error('Invalid file content');
      }

      setFileHandle(handle);
      setCurrentFileName(file.name);
      setContent(text);
      setEditorKey(prev => prev + 1);
    } catch (err) {
      // User cancelled
      if ((err as Error).name === 'AbortError') {
        return;
      }
      
      const errorMessage = err instanceof Error ? err.message : 'Failed to open file';
      console.error('Failed to open file:', err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [isSupported]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <EditorContext.Provider
      value={{
        currentFileName,
        content,
        editorKey,
        fileHandle,
        isSaving,
        error,
        isLoading,
        isSupported,
        setContent,
        openFile,
        clearError,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};
