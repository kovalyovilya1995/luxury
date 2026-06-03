import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { useMedia } from '../../hooks';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { OrderCurtains } from '../../components/OrderCurtains';

import './styles.scss';

export const ProjectDecor: FC = () => {
  const { t } = useTranslation();

  const isMobile = useMedia('(max-width: 768px)');

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const showBreadcrumbs = !isMobile;

  return (
    <div className="project-decor">
      <Header className="project-decor__header" isMobile={isMobile} />

      <div className="project-decor__content">
        {showBreadcrumbs && <Breadcrumbs />}

        <div className="project-decor__title">{t('apartment-decor')}</div>

        <div>
          <div className="project-decor__block">
            <div className="project-decor__text">{t('decor-text1')}</div>
            <img
              className="project-decor__img1"
              src="/decor.jpg"
              alt="apartment-decor"
            />
          </div>

          <div className="project-decor__block">
            <div className="project-decor__block-title">
              {t('kitchen-living')}
            </div>
            <div className="project-decor__text">{t('decor-text2')}</div>
            <img
              className="project-decor__img1"
              src="/decor2.jpg"
              alt="apartment-decor"
            />
          </div>

          <div className="project-decor__block">
            <div className="project-decor__block-title">{t('bedroom')}</div>
            <div className="project-decor__text">{t('decor-text3')}</div>
            <img
              className="project-decor__img1"
              src="/decor3.jpg"
              alt="apartment-decor"
            />
            <div className="project-decor__imgs">
              <img
                className="project-decor__img2"
                src="/decor4.jpg"
                alt="apartment-decor"
              />
              <img
                className="project-decor__img2"
                src="/decor5.jpg"
                alt="apartment-decor"
              />
            </div>
          </div>

          <div className="project-decor__block">
            <div className="project-decor__block-title">{t('boy-nursery')}</div>
            <div className="project-decor__text">{t('decor-text4')}</div>
            <div className="project-decor__imgs2">
              <img
                className="project-decor__img3"
                src="/decor7.jpg"
                alt="apartment-decor"
              />
              <img
                className="project-decor__img3"
                src="/decor8.jpg"
                alt="apartment-decor"
              />
              <img
                className="project-decor__img3"
                src="/decor9.jpg"
                alt="apartment-decor"
              />
            </div>
            <img
              className="project-decor__img1"
              src="/decor6.jpg"
              alt="apartment-decor"
            />
          </div>

          <div className="project-decor__block">
            <div className="project-decor__block-title">
              {t('girl-nursery')}
            </div>
            <div className="project-decor__text">{t('decor-text5')}</div>
            <div className="project-decor__imgs">
              <img
                className="project-decor__img2"
                src="/decor10.jpg"
                alt="apartment-decor"
              />
              <img
                className="project-decor__img2"
                src="/decor11.jpg"
                alt="apartment-decor"
              />
            </div>
            <div className="project-decor__imgs">
              <img
                className="project-decor__img2"
                src="/decor12.jpg"
                alt="apartment-decor"
              />
              <img
                className="project-decor__img2"
                src="/decor13.jpg"
                alt="apartment-decor"
              />
            </div>
          </div>
        </div>

        <OrderCurtains isMobile={isMobile} />
      </div>

      <Footer isMobile={isMobile} />
    </div>
  );
};
