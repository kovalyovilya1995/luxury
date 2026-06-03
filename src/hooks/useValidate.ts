import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

type ValidateType = 'email' | 'required' | 'phone' | 'leastOne';

const EMAIL_REGEXP =
  /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

export const useValidate = (
  value: string,
  types: ValidateType[],
  additionalValue?: string
) => {
  const { t } = useTranslation();

  const messageEmail = useMemo(() => {
    if (!types.includes('email')) return '';
    if (types.includes('leastOne')) {
      if (value === '' && additionalValue === '') return t('fill-one-field');
      if (value === '' && additionalValue !== '') return '';
    }
    if (EMAIL_REGEXP.test(value)) return '';

    return t('email-error');
  }, [types, value, additionalValue, t]);

  const messagePhone = useMemo(() => {
    if (!types.includes('phone')) return '';
    if (types.includes('leastOne')) {
      if (value === '' && additionalValue === '') return t('fill-one-field');
      if (value === '' && additionalValue !== '') return '';
    }
    if (value.length === 11) return '';

    return t('correct-phone');
  }, [types, value, additionalValue, t]);

  return { messageError: messageEmail || messagePhone };
};
