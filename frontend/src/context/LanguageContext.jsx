import React, { createContext, useState, useContext, useEffect } from 'react';
import { translations } from '../data/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    // Get language from localStorage or default to English
    const saved = localStorage.getItem('appLanguage');
    return saved || 'en';
  });

  useEffect(() => {
    localStorage.setItem('appLanguage', language);
    document.documentElement.lang = language;
  }, [language]);

  const t = (key, defaultValue = key) => {
    const keys = key.split('.');
    let value = translations[language];
    
    for (let k of keys) {
      value = value?.[k];
    }
    
    return value || defaultValue;
  };

  const changeLanguage = (newLanguage) => {
    if (translations[newLanguage]) {
      setLanguage(newLanguage);
      
      try {
        const select = document.querySelector('.goog-te-combo');
        if (select) {
          select.value = newLanguage;
          select.dispatchEvent(new Event('change'));
        } else {
          // Fallback if the Google Translate widget hasn't loaded properly
          document.cookie = `googtrans=/en/${newLanguage}; path=/; domain=${window.location.hostname}`;
          window.location.reload();
        }
      } catch (e) {
        console.error('Error updating Google Translate', e);
      }
    }
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
