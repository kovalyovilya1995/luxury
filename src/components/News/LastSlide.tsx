import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ButtonMore } from '../ui/ButtonMore';

import './styles.scss';

type PropsType = {
  isMobile: boolean;
};

export const LastSlide: FC<PropsType> = ({ isMobile }) => {
  const { t } = useTranslation();
  const [height, setHeight] = useState(300);
  const padding = isMobile ? 24 : 32;

  useEffect(() => {
    setTimeout(() => {
      const cards = document.getElementsByClassName('card');
      if (cards.length && cards[0]) {
        setHeight(cards[0].getBoundingClientRect().height);
      }
    }, 2000);
  }, []);

  return (
    <div
      className="last-slide card"
      style={{ height: `${height - padding}px` }}
    >
      <img className="last-slide__img" alt="Лого" src="/logo-visit.svg" />
      <div className="card__content">
        <div className="card__content-title">{t('all-news-company')}</div>
        <ButtonMore />
      </div>
    </div>
  );
};
