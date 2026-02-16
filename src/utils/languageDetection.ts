export function detectUserLanguage(): string {
  try {
    const browserLang = navigator.language || (navigator as any).userLanguage;
    const langCode = browserLang.split('-')[0].toLowerCase();

    const supportedLanguages = ['en', 'es', 'fr', 'de', 'pt', 'zh', 'ja', 'ko'];

    if (supportedLanguages.includes(langCode)) {
      return langCode;
    }

    return 'en';
  } catch (error) {
    console.warn('Language detection failed, defaulting to English');
    return 'en';
  }
}

export function getLocalizedText(key: string, lang: string = 'en'): string {
  const translations: Record<string, Record<string, string>> = {
    'loading': {
      'en': 'Loading',
      'es': 'Cargando',
      'fr': 'Chargement',
      'de': 'Wird geladen',
      'pt': 'Carregando',
      'zh': '加载中',
      'ja': '読み込み中',
      'ko': '로딩 중'
    },
    'error': {
      'en': 'Error',
      'es': 'Error',
      'fr': 'Erreur',
      'de': 'Fehler',
      'pt': 'Erro',
      'zh': '错误',
      'ja': 'エラー',
      'ko': '오류'
    },
    'retry': {
      'en': 'Retry',
      'es': 'Reintentar',
      'fr': 'Réessayer',
      'de': 'Wiederholen',
      'pt': 'Tentar novamente',
      'zh': '重试',
      'ja': '再試行',
      'ko': '다시 시도'
    },
    'reload': {
      'en': 'Reload Page',
      'es': 'Recargar Página',
      'fr': 'Recharger la Page',
      'de': 'Seite neu laden',
      'pt': 'Recarregar Página',
      'zh': '重新加载页面',
      'ja': 'ページを再読み込み',
      'ko': '페이지 새로고침'
    }
  };

  return translations[key]?.[lang] || translations[key]?.['en'] || key;
}

export function isSocialMediaBrowser(): boolean {
  const ua = navigator.userAgent.toLowerCase();

  const socialMediaBrowsers = [
    'fban',
    'fbav',
    'instagram',
    'twitter',
    'linkedin',
    'tiktok',
    'snapchat',
    'whatsapp',
    'messenger'
  ];

  return socialMediaBrowsers.some(browser => ua.includes(browser));
}

export function getBrowserInfo() {
  const ua = navigator.userAgent;

  return {
    isSocialMedia: isSocialMediaBrowser(),
    isIOS: /iPhone|iPad|iPod/.test(ua),
    isAndroid: /Android/.test(ua),
    isMobile: /Mobile|Android|iPhone|iPad|iPod/.test(ua),
    language: detectUserLanguage()
  };
}
