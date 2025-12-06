import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';

export function useTranslation() {
  const { language } = useLanguage();

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];

    for (const k of keys) {
      if (value === undefined) {
        console.warn(`Translation missing for key: ${key}`);
        return key;
      }
      value = value[k];
    }

    if (value === undefined) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }

    return value;
  };

  return { t, language };
}
