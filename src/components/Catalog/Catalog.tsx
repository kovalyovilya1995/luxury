import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import './styles.scss';

type PropsType = {};

export const Catalogg: FC<PropsType> = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="catalog" onClick={() => navigate('/catalog')}>
      <div className="catalog__header">{t('catalog')}</div>
      <div className="catalog__content">
        <div className="catalog-img catalog__content-serving">
          {t('serving')}
        </div>
        <div className="catalog-img catalog__content-curtains">
          {t('curtains')}
        </div>
        <div className="catalog-img catalog__content-furniture">
          {t('furniture')}
        </div>
        <div className="catalog-img catalog__content-accessories">
          {t('accessories')}
        </div>
      </div>
    </div>
  );
};
