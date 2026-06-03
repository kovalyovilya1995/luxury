import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import './styles.scss';

export const ButtonMore: FC = () => {
  const { t } = useTranslation();

  return (
    <div className="button-more">
      <div>{t('more')}</div>
      <img className="button-more__icon" alt="Направо" src="/arrow-right.svg" />
    </div>
  );
};
