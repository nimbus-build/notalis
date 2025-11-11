import type { FunctionComponent } from 'preact';

import { Header } from './Header';
import { Suspense, lazy } from 'preact/compat';
const MilkdownEditorWrapper = lazy(() => import('./Editor').then(m => ({ default: m.MilkdownEditorWrapper })));

// Fallback that adapts to theme, using <html> class to avoid flicker
function ThemeAwareSuspenseFallback() {
  let isDark = false;
  if (typeof document !== 'undefined') {
    isDark = document.documentElement.classList.contains('dark');
  }
  return (
    <div
      className={`flex-1 flex items-center justify-center transition-colors duration-300 ${
        isDark
          ? 'bg-[hsl(var(--color-background))] text-[hsl(var(--color-foreground))]'
          : 'bg-white text-black'
      }`}
      style={{ minHeight: '40vh' }}
    >
      Loading editor…
    </div>
  );
}
import { Footer } from './Footer';
import { EditorProvider } from '../contexts/EditorContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import './App.css';

export const App: FunctionComponent = () => {
  return (
    <ThemeProvider>
      <EditorProvider>
        <div className="app-container">
          <Header />
          <Suspense fallback={<ThemeAwareSuspenseFallback />}>
            <MilkdownEditorWrapper />
          </Suspense>
          <Footer />
        </div>
      </EditorProvider>
    </ThemeProvider>
  );
};