import { FC, useState } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import axios from 'axios';

import { useValidate } from '../../hooks';
import { Input } from '../../components/ui/Input';

import './styles.scss';

type PropsType = {
  isMobile: boolean;
  className?: string;
};

export const OrderCurtains: FC<PropsType> = ({ className, isMobile }) => {
  const { t } = useTranslation();

  const [isLock, setIsLock] = useState(false);
  const [showError, setShowError] = useState(false);
  const [phone, setPhone] = useState('');
  const { messageError: messageErrorPhone } = useValidate(phone, [
    'phone',
    'leastOne',
  ]);

  const handleChangePhone = (value: string) => {
    setPhone(value);
    setShowError(false);
  };

  const handleSend = async () => {
    if (messageErrorPhone) {
      setShowError(true);
      return;
    }

    setIsLock(true);

    try {
      const response = await axios.post('/order?curtains=true', { phone });
      if (response.status !== 200) {
        throw new Error('bad response');
      }

      setPhone('');
      toast.success('Запрос отправлен');
    } catch (error) {
      console.log(error);
      toast.error('Что-то пошло не так');
    } finally {
      setIsLock(false);
    }
  };

  return (
    <div className={classNames('order-curtains', className)}>
      <div className="order-curtains__wrapper">
        <div className="order-curtains__title">{t('order-curtains')}</div>
        <div className="order-curtains__description">{t('contact-you')}</div>

        <div className="order-curtains__field">
          <Input
            type="phone"
            className="order-curtains__phone"
            value={phone}
            onChange={handleChangePhone}
            messageError={showError ? messageErrorPhone : ''}
          />

          <button
            className={classNames('button', {
              button_disabled: isLock || showError,
            })}
            onClick={handleSend}
          >
            {t('contact-with-me')}
          </button>
        </div>

        <div className="order-curtains__confidentiality">
          {t('you-agree')}&nbsp;
          <a
            className="order-curtains__confidentiality-link"
            href="/personal-data.pdf"
            rel="noreferrer"
            target="_blank"
          >
            {t('privacy-policy')}
          </a>
        </div>
      </div>
    </div>
  );
};
