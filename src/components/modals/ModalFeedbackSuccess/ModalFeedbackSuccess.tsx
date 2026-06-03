import { FC, useEffect } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import { useWatch } from '../../../hooks';
import { Icon } from '../../ui/Icon';

import './styles.scss';

type PropsType = {
  onClose: () => void;
  isOpen: boolean;
  isMobile?: boolean;
  className?: string;
};

let firstRender = true;

export const ModalFeedbackSuccess: FC<PropsType> = ({
  className,
  isOpen,
  isMobile = false,
  onClose,
}) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  useEffect(() => {
    return () => {
      firstRender = true;
    };
  }, []);

  useWatch(() => {
    firstRender = false;
  }, [isOpen]);

  return (
    <div
      className={classNames(
        'modal-feedback-success-wrapper',
        { 'modal-feedback-success-wrapper_open': isOpen },
        { 'modal-feedback-success-wrapper_close': !firstRender && !isOpen },
        className
      )}
    >
      <div
        className="modal-feedback-success-wrapper__background"
        onClick={onClose}
      >
        <div
          className="modal-feedback-success"
          onClick={(event) => event.stopPropagation()}
        >
          <Icon
            name="close2"
            handleClick={onClose}
            className="modal-feedback-success__close"
            color={
              isMobile ? 'rgba(var(--grey-800))' : 'rgba(var(--blue-grey-300))'
            }
            size={isMobile ? 1.5 : 2}
            pointer
          />
          <Icon
            name="logo"
            width={11.6875}
            height={2.8}
            className="modal-feedback__logo"
            color={'rgba(var(--grey-800))'}
          />
          <div className="modal-feedback-success__line" />
          <div className="modal-feedback-success__title">
            Спасибо за обращение!
          </div>
          <div className="modal-feedback-success__subtitle">
            Мы получили вашу заявку и свяжемся с вами как можно скорее, чтобы
            рассказать все детали
          </div>

          <button
            className="modal-feedback-success__button button"
            onClick={onClose}
          >
            {t('close')}
          </button>
        </div>
      </div>
    </div>
  );
};
