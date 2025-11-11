# Notalis

A modern, minimalist markdown editor built with Preact and Milkdown.

## Features

- 🎨 Beautiful dark/light theme with system preference support
- 💾 Auto-save functionality using File System Access API
- ⌨️ Rich markdown editing experience powered by Milkdown
- 🎯 Production-ready with error boundaries and accessibility
- 🔒 Secure with Content Security Policy (CSP)
- ⚡ Fast and lightweight using Preact

## Browser Support

Notalis requires the File System Access API, which is currently supported in:
- Chrome/Edge 86+
- Opera 72+

**Note:** Safari and Firefox do not yet support this API. The application will display a compatibility message for unsupported browsers.

## Development

### Prerequisites

- Node.js 18+ and pnpm

### Setup

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Architecture

### Tech Stack

- **Framework:** Preact 10.27.2 with TypeScript
- **Editor:** Milkdown/Crepe 7.17.1
- **Styling:** Tailwind CSS v4
- **Build Tool:** Vite (Rolldown)
- **Icons:** Lucide Preact

### Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components (Button, etc.)
│   ├── Editor/          # Editor component and styles
│   ├── Header/          # Application header
│   ├── Footer/          # Application footer
│   ├── App.tsx          # Root component
│   └── ErrorBoundary.tsx # Error boundary for production resilience
├── contexts/
│   ├── EditorContext.tsx # Editor state and file operations
│   └── ThemeContext.tsx  # Theme management
├── lib/
│   └── utils.ts         # Utility functions
├── index.css            # Global styles and theme tokens
└── main.tsx             # Application entry point
```

## Security

- Content Security Policy (CSP) headers configured
- File size validation (max 10MB)
- Input sanitization and validation
- Subresource Integrity (SRI) for production builds

## Accessibility

- ARIA labels and landmarks
- Keyboard navigation support
- Semantic HTML structure
- Screen reader friendly
- System theme preference detection

## Performance

- Code splitting by vendor libraries
- Optimized bundle with tree shaking
- Asset hash naming for optimal caching
- Debounced auto-save (500ms)
- Minimal re-renders with proper React patterns

## License

Copyright © 2025 Notalis. All rights reserved.
