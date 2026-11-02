// Client-side error boundary for tracking JS errors
'use client';

import React, { Component, type ReactNode } from 'react';
import { trackError } from '@/lib/analytics-tracking.functions';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Track the error
    trackError({
      errorType: 'js_error',
      pagePath: window.location.pathname,
      errorMessage: error.message,
      stackTrace: errorInfo.componentStack || error.stack,
      metadata: {
        componentStack: errorInfo.componentStack,
      },
    }).catch((err) => {
      console.error('[ErrorBoundary] Failed to track error:', err);
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
          <div className="max-w-md text-center">
            <h1 className="text-xl font-semibold text-foreground">Algo deu errado</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Tente recarregar a página ou voltar para o início.
            </p>
            <div className="mt-6 flex gap-2 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
              >
                Recarregar
              </button>
              <a
                href="/"
                className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium"
              >
                Voltar ao início
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
