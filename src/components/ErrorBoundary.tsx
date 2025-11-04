import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Something went wrong</h2>
          <p className="text-red-600">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          {this.state.error?.message?.toLowerCase().includes('failed to fetch') && (
            <div className="mt-4 text-sm text-gray-600">
              <p>This might be due to:</p>
              <ul className="list-disc ml-5 mt-2">
                <li>No internet connection</li>
                <li>API service is temporarily unavailable</li>
                <li>CORS policy blocking the request</li>
              </ul>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;