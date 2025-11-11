import type { FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { FolderOpen } from 'lucide-preact';

import { Crepe } from "@milkdown/crepe";
import { Milkdown, MilkdownProvider, useEditor } from "@milkdown/react";

import { vscodeLight, vscodeDark } from '@uiw/codemirror-theme-vscode';

import "@milkdown/crepe/theme/common/style.css";
import "./styles.css";

import { useEditorContext } from '../../contexts/EditorContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from '@/components/ui/button';

const MilkdownEditor: FunctionComponent<{ theme: 'light' | 'dark' }> = ({ theme }) => {
  const { content, setContent, fileHandle } = useEditorContext();

  const { get } = useEditor((root) => {
    // Set data-theme attribute on the milkdown root
    root.setAttribute('data-theme', theme);
    
    // Also add a class for easier debugging
    if (theme === 'dark') {
      root.classList.add('theme-dark');
    }
    
    const crepe = new Crepe({ 
      root,
      defaultValue: content || '',
      featureConfigs: {
        [Crepe.Feature.CodeMirror]: {
          theme: theme === 'dark' ? vscodeDark : vscodeLight,
        },
      } 
    });

    // Set readonly initially if no file is open
    crepe.setReadonly(!fileHandle);

    // Use the native listener API to track content changes
    crepe.on((listener) => {
      listener.markdownUpdated((_ctx, markdown) => {
        setContent(markdown);
      });
    });

    return crepe;
  });

  // Update readonly state when file handle changes
  useEffect(() => {
    const editor = get();
    if (editor && 'setReadonly' in editor) {
      (editor as unknown as Crepe).setReadonly(!fileHandle);
    }
  }, [fileHandle, get]);

  return <Milkdown />;
};

const EmptyState: FunctionComponent = () => {
  const { openFile, error, clearError, isSupported, isLoading } = useEditorContext();

  return (
    <div
      className="flex flex-1 min-h-[60vh] items-center justify-center bg-[hsl(var(--color-card))]"
      role="main"
    >
      <div class="text-center space-y-6 max-w-md px-6">
        {!isSupported ? (
          <>
            <div class="flex justify-center">
              <div class="w-24 h-24 rounded-full bg-[hsl(var(--color-destructive))] bg-opacity-10 flex items-center justify-center">
                <span class="text-4xl" role="img" aria-label="Warning">⚠️</span>
              </div>
            </div>
            <div class="space-y-2">
              <h2 class="text-2xl font-semibold text-foreground">Browser Not Supported</h2>
              <p class="text-muted-foreground">
                This application requires the File System Access API, which is not available in your current browser.
                Please use Chrome, Edge, or another compatible browser.
              </p>
            </div>
          </>
        ) : (
          <>
            <div class="flex justify-center">
              <div class="w-24 h-24 rounded-full bg-[hsl(var(--color-muted))] flex items-center justify-center">
                <FolderOpen class="w-12 h-12 text-[hsl(var(--color-primary))]" aria-hidden="true" focusable="false" />
              </div>
            </div>
            <div class="space-y-2">
              <h2 class="text-2xl font-semibold text-foreground">No Document Open</h2>
              <p class="text-muted-foreground">
                Open a markdown file to start editing.
              </p>
            </div>
            {error && (
              <div 
                class="p-4 bg-[hsl(var(--color-destructive))] bg-opacity-10 border border-[hsl(var(--color-destructive))] rounded text-sm text-left"
                role="alert"
                aria-live="assertive"
              >
                <p class="font-semibold text-[hsl(var(--color-destructive))]">Error</p>
                <p class="text-foreground mt-1">{error}</p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearError} 
                  class="mt-2"
                  aria-label="Dismiss error message"
                >
                  Dismiss
                </Button>
              </div>
            )}
            <Button 
              onClick={openFile} 
              size="lg" 
              class="gap-2"
              disabled={isLoading}
              aria-label="Open markdown file"
            >
              <FolderOpen class="w-4 h-4" aria-hidden="true" focusable="false" />
              {isLoading ? 'Opening...' : 'Open File'}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export const MilkdownEditorWrapper: FunctionComponent = () => {
  const { editorKey, fileHandle } = useEditorContext();
  const { effectiveTheme } = useTheme();

  // Show empty state if no file is open.
  if (!fileHandle) {
    return <EmptyState />;
  }

  // Use key to force remount when opening a file or theme changes
  // This is the proper way since Crepe doesn't provide a setMarkdown() or setTheme() API
  return (
    <main role="main" aria-label="Markdown editor">
      <MilkdownProvider key={`${editorKey}-${effectiveTheme}`}>
        <MilkdownEditor theme={effectiveTheme} />
      </MilkdownProvider>
    </main>
  );
}