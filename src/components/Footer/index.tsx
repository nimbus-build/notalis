import type { FunctionComponent } from 'preact';

export const Footer: FunctionComponent = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer 
      class="sticky bottom-0 z-10 border-t border-[hsl(var(--color-border))] bg-[hsl(var(--color-card))] px-6 py-4"
      role="contentinfo"
    >
      <div class="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
        <p>&copy; {currentYear} Notalis. All rights reserved.</p>
      </div>
    </footer>
  );
};
