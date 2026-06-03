import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { RUS } from './RUS';
import { ENG } from './ENG';

const resources = {
  RUS,
  ENG,
};

let lng = localStorage.getItem('lang');

if (!lng) {
  localStorage.setItem('lang', 'RUS');
  lng = 'RUS';
}

i18n.use(initReactI18next).init({
  resources,
  lng,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
