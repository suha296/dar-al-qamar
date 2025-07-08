'use client';
import { useLanguage } from './LanguageProvider';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-accent hover:text-accent/80 hover:bg-accent/10 rounded-lg transition-colors duration-200"
      title={language === 'en' ? 'العربية' : 'English'}
    >
      <Globe className="w-4 h-4" />
      <span className="text-accent">{language === 'en' ? 'العربية' : 'English'}</span>
    </button>
  );
} 