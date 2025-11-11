import type { FunctionComponent } from 'preact';
import { FolderOpen, Sun, Moon, Monitor, Check } from 'lucide-preact';
import { Button } from '@/components/ui/button';
import { useEditorContext } from '../../contexts/EditorContext';
import { useTheme } from '../../contexts/ThemeContext';

export const Header: FunctionComponent = () => {
  const { openFile, currentFileName, isSaving, fileHandle, isLoading } = useEditorContext();
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    if (theme === 'system') setTheme('light');
    else if (theme === 'light') setTheme('dark');
    else setTheme('system');
  };

  const ThemeIcon = theme === 'system' ? Monitor : theme === 'light' ? Sun : Moon;
  const themeLabel = theme === 'system' ? 'System' : theme === 'light' ? 'Light' : 'Dark';

  return (
    <header 
      class="sticky top-0 z-10 border-b border-[hsl(var(--color-border))] bg-[hsl(var(--color-card))] px-6 py-4 flex items-center justify-between"
      role="banner"
    >
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2">
          <h1 class="text-2xl font-bold">
            Notalis
          </h1>
        </div>
        {currentFileName && (
          <span class="text-sm text-muted-foreground ml-4" aria-label="Current file">
            {currentFileName}
          </span>
        )}
        {fileHandle && (
          <span 
            class={`text-xs flex items-center gap-1 ml-2 transition-colors ${
              isSaving ? 'text-muted-foreground' : 'text-[hsl(var(--color-primary))]'
            }`}
            role="status"
            aria-live="polite"
            aria-label={isSaving ? 'Saving document' : 'Document saved'}
          >
            <Check class="w-3 h-3" aria-hidden="true" focusable="false" />
            {isSaving ? 'Saving...' : 'Saved'}
          </span>
        )}
      </div>
      <nav class="flex items-center gap-2" role="navigation" aria-label="Main navigation">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={openFile} 
          aria-label="Open markdown file"
          title="Open file"
          disabled={isLoading}
        >
          <FolderOpen class="w-4 h-4" aria-hidden="true" focusable="false" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={cycleTheme} 
          aria-label={`Switch theme (current: ${themeLabel})`}
          title={`Theme: ${themeLabel}`}
        >
          <ThemeIcon class="w-4 h-4" aria-hidden="true" focusable="false" />
        </Button>
      </nav>
    </header>
  );
};
