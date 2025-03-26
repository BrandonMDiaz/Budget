import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import LanguageDetector from 'i18next-browser-languagedetector';
import * as en from './translations/en.json';
import * as es from './translations/es.json';

const resources = {
    en: {
        translation: en
    },
    es: {
        translation: es
    }
}

i18n
    // detect user language
    // learn more: https://github.com/i18next/i18next-browser-languageDetector
    .use(LanguageDetector)
    // pass the i18n instance to react-i18next.
    .use(initReactI18next)

    .init({
        lng: 'es',
        fallbackLng: 'es',
        debug: true,
        resources,
        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        }
    });


export default i18n;