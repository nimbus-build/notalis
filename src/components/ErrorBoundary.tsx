import { Component } from 'preact';
import type { ComponentChildren } from 'preact';
import { Button } from './ui/button';

interface ErrorBoundaryProps {
  children: ComponentChildren;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: { componentStack?: string }) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div class="min-h-screen flex items-center justify-center bg-[hsl(var(--color-background))] p-6">
          <div class="max-w-md w-full space-y-6 text-center">
            <div class="space-y-2">
              <h1 class="text-3xl font-bold text-foreground">Something went wrong</h1>
              <p class="text-muted-foreground">
                We're sorry, but an unexpected error occurred. Your work may not have been saved.
              </p>
              {this.state.error && (
                <details class="mt-4 text-left">
                  <summary class="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                    Technical Details
                  </summary>
                  <pre class="mt-2 p-4 bg-[hsl(var(--color-muted))] rounded text-xs overflow-auto max-h-40">
                    {this.state.error.message}
                    {this.state.error.stack && `\n\n${this.state.error.stack}`}
                  </pre>
                </details>
              )}
            </div>
            <div class="flex gap-3 justify-center">
              <Button onClick={this.handleReset} size="lg">
                Reload Application
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
