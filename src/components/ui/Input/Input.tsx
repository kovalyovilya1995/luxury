import { FC, useState, useMemo, useRef, ChangeEvent, useEffect } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { useIMask } from 'react-imask';

import { Icon } from '../Icon';

import './styles.scss';

type PropsType = {
  value: string;
  onChange: (value: string) => void;
  onFocus?: (value: boolean) => void;
  type?: 'text' | 'email' | 'search' | 'phone';
  placeholder?: string;
  className?: string;
  messageError?: string;
  isFocused?: boolean;
  hasClear?: boolean;
};

export const Input: FC<PropsType> = ({
  value,
  onChange,
  onFocus = () => {},
  className,
  type = 'text',
  placeholder,
  messageError,
  isFocused,
  hasClear = false,
}) => {
  const { t } = useTranslation();
  const inputEl = useRef<any>(null);
  const [isFocus, setIsFocus] = useState(false);
  const {
    ref: refMask,
    value: valueMask,
    unmaskedValue,
    setValue,
  } = useIMask({
    mask: '+{7} (000) 000 00 00',
  });

  useEffect(() => {
    if (isFocused) {
      inputEl.current?.focus();
    }
  }, [isFocused]);

  useEffect(() => {
    if (type === 'phone' && value === '') {
      setValue('');
    }
  }, [type, value, setValue]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (type === 'phone') {
      onChange(unmaskedValue);
    } else {
      onChange(event.target.value);
    }
  };

  const currentValue = type === 'phone' ? valueMask : value;
  const currentRef = type === 'phone' ? refMask : inputEl;

  function handleFocus() {
    setIsFocus(true);
    onFocus(true);
  }

  function handleBlur() {
    setIsFocus(false);
    onFocus(false);
  }

  function handleClear() {
    onChange('');
    handleFocus();
  }

  const iconName = useMemo(() => {
    if (!!messageError) return 'warning';
    if (type === 'search') return 'search2';
    if (type === 'email') return 'message2';
    if (type === 'phone') return 'phone';

    return;
  }, [type, messageError]);

  const customPlaceholder = useMemo(() => {
    if (placeholder) return placeholder;
    if (type === 'search') return t('search');
    if (type === 'email') return t('email');
    if (type === 'phone') return t('phone');

    return;
  }, [type, placeholder, t]);

  return (
    <div
      className={classNames(
        'input',
        {
          input_focus: isFocus,
          'input_has-text': !!currentValue,
          'input_has-icon': !!iconName,
          'input_has-clear': !!hasClear,
          'input_has-error': !!messageError,
        },
        className
      )}
    >
      {iconName && <Icon name={iconName} size={1.5} className="input__icon" />}
      <input
        className="input__field"
        ref={currentRef}
        value={currentValue}
        placeholder={customPlaceholder}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      {currentValue && hasClear && (
        <Icon
          name="close3"
          size={1.5}
          pointer
          handleClick={handleClear}
          className="input__clear"
        />
      )}
      <div
        className={classNames('input__error-message', {
          'input__error-message-visible': !!messageError,
        })}
      >
        {messageError}
      </div>
    </div>
  );
};
