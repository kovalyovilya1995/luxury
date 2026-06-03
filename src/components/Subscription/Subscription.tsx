import { FC, useState } from 'react';
import classNames from 'classnames';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

import { sendEmail } from '../../store/actionCreator';
import { useValidate } from '../../hooks';
import { Input } from '../ui/Input';

import './styles.scss';

type PropsType = {
  isMobile: boolean;
};

export const Subscription: FC<PropsType> = ({ isMobile }) => {
  const [email, setEmail] = useState('');
  const [isLock, setIsLock] = useState(false);
  const [showError, setShowError] = useState(false);
  const { t } = useTranslation();
  const { messageError } = useValidate(email, ['email']);

  const text = isMobile ? t('first-know-mobile') : t('first-know');

  const handleChange = (value: string) => {
    setEmail(value);
    setShowError(false);
  };

  const handleSendEmail = async () => {
    if (messageError) {
      setShowError(true);
      return;
    }

    setIsLock(true);

    try {
      await toast.promise(sendEmail(email), {
        pending: t('wait'),
        success: t('success-subscribe'),
        error: t('error-subscribe'),
      });
      setEmail('');
    } catch (error) {
      console.log(error);
    } finally {
      setIsLock(false);
    }
  };

  return (
    <div className="subscription">
      <div className="subscription__content">
        <div className="subscription__header">{t('aware-of-trends')}</div>
        <div className="subscription__text">{text}</div>
        <div className="subscription__controls">
          <Input
            className="subscription__controls-email"
            type="email"
            value={email}
            onChange={handleChange}
            messageError={showError ? messageError : ''}
          />

          <button
            className={classNames('button', {
              button_disabled: isLock || showError,
            })}
            onClick={handleSendEmail}
          >
            {t('subscribe')}
          </button>
        </div>

        <div className="subscription__confidentiality">
          {t('you-agree')}&nbsp;
          <a
            className="subscription__confidentiality-link"
            href="/personal-data.pdf"
            rel="noreferrer"
            target="_blank"
          >
            {t('privacy-policy')}
          </a>
        </div>
      </div>
      <div className="subscription__bg" />
    </div>
  );
};
