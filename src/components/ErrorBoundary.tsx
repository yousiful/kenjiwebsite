import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { detectUserLanguage, getLocalizedText } from '../utils/languageDetection';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  retryCount: number;
  language: string;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      retryCount: 0,
      language: detectUserLanguage()
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState(prevState => ({
      error,
      errorInfo,
      retryCount: prevState.retryCount + 1
    }));

    try {
      sessionStorage.setItem('lastError', JSON.stringify({
        message: error.message,
        timestamp: Date.now(),
        retryCount: this.state.retryCount
      }));
    } catch (e) {
      console.warn('Could not save error to sessionStorage');
    }

    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'exception', {
        description: error.toString(),
        fatal: false
      });
    }

    if (this.state.retryCount < 3) {
      setTimeout(() => {
        this.setState({ hasError: false, error: undefined, errorInfo: undefined });
      }, 2000);
    }
  }

  handleReload = () => {
    try {
      sessionStorage.removeItem('lastError');
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => caches.delete(name));
        });
      }
    } catch (e) {
      console.warn('Cache clearing failed');
    }
    window.location.reload();
  };

  handleGoHome = () => {
    try {
      sessionStorage.removeItem('lastError');
    } catch (e) {
      console.warn('Could not clear sessionStorage');
    }
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError && this.state.retryCount >= 3) {
      const { language } = this.state;

      const errorMessages = {
        title: {
          en: 'Oops! Something went wrong',
          es: '¡Ups! Algo salió mal',
          fr: 'Oups! Quelque chose s\'est mal passé',
          de: 'Hoppla! Etwas ist schief gelaufen',
          pt: 'Ops! Algo deu errado',
        },
        description: {
          en: 'We\'re sorry, but something unexpected happened. Please try refreshing the page or return home.',
          es: 'Lo sentimos, algo inesperado sucedió. Por favor intenta refrescar la página o volver al inicio.',
          fr: 'Nous sommes désolés, quelque chose d\'inattendu s\'est produit. Veuillez actualiser la page ou retourner à l\'accueil.',
          de: 'Es tut uns leid, aber etwas Unerwartetes ist passiert. Bitte aktualisieren Sie die Seite oder kehren Sie zur Startseite zurück.',
          pt: 'Desculpe, algo inesperado aconteceu. Por favor, atualize a página ou volte para o início.',
        },
        retry: {
          en: 'Try Again',
          es: 'Intentar de Nuevo',
          fr: 'Réessayer',
          de: 'Erneut Versuchen',
          pt: 'Tentar Novamente',
        },
        home: {
          en: 'Go Home',
          es: 'Ir al Inicio',
          fr: 'Retour à l\'Accueil',
          de: 'Zur Startseite',
          pt: 'Ir para Início',
        }
      };

      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            <div className="bg-gray-800/50 border border-red-500/50 rounded-3xl p-6 sm:p-8">
              <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-6" />
              <h1 className="text-xl sm:text-2xl font-bold text-white mb-4">
                {errorMessages.title[language as keyof typeof errorMessages.title] || errorMessages.title.en}
              </h1>
              <p className="text-gray-400 text-sm sm:text-base mb-8">
                {errorMessages.description[language as keyof typeof errorMessages.description] || errorMessages.description.en}
              </p>

              <div className="space-y-3 sm:space-y-4">
                <button
                  onClick={this.handleReload}
                  className="w-full bg-gradient-to-r from-blue-600 to-green-500 text-white px-6 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 touch-manipulation min-h-[48px]"
                >
                  <RefreshCw className="w-5 h-5" />
                  {errorMessages.retry[language as keyof typeof errorMessages.retry] || errorMessages.retry.en}
                </button>

                <button
                  onClick={this.handleGoHome}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 touch-manipulation min-h-[48px]"
                >
                  <Home className="w-5 h-5" />
                  {errorMessages.home[language as keyof typeof errorMessages.home] || errorMessages.home.en}
                </button>
              </div>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-6 text-left">
                  <summary className="text-gray-400 cursor-pointer hover:text-white text-sm">
                    Error Details (Development)
                  </summary>
                  <pre className="mt-4 p-4 bg-gray-900 rounded-lg text-xs text-red-400 overflow-auto max-h-40">
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