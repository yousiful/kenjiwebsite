import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({ error, errorInfo });
    
    // Log error to analytics service
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'exception', {
        description: error.toString(),
        fatal: false
      });
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            <div className="bg-gray-800/50 border border-red-500/50 rounded-3xl p-8">
              <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-6" />
              <h1 className="text-2xl font-bold text-white mb-4">
                We Hit a Snag
              </h1>
              <p className="text-gray-400 mb-4">
                Don't worry—your data is safe. This usually fixes itself in seconds.
              </p>
              <p className="text-gray-500 text-sm mb-8">
                Still stuck? Text us at <a href="tel:+18312634402" className="text-blue-400 hover:text-blue-300 underline">(831) 263-4402</a> for instant help
              </p>

              <div className="space-y-4">
                <button
                  onClick={this.handleReload}
                  className="w-full bg-gradient-to-r from-blue-600 to-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-5 h-5" />
                  Refresh & Continue
                </button>

                <button
                  onClick={this.handleGoHome}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Home className="w-5 h-5" />
                  Back to Dashboard
                </button>
              </div>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-6 text-left">
                  <summary className="text-gray-400 cursor-pointer hover:text-white">
                    Error Details (Development)
                  </summary>
                  <pre className="mt-4 p-4 bg-gray-900 rounded-lg text-xs text-red-400 overflow-auto">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;