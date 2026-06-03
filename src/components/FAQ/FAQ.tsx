import { FC, useState, useEffect } from 'react';
import { Parser } from 'html-to-react';
import { Animate } from 'react-simple-animate';
import { useSelector, useDispatch } from 'react-redux';
import Spinner from 'react-spinner-material';
import { useTranslation } from 'react-i18next';

import { getFaqs } from '../../store/actionCreator';
import type { RootState } from '../../store';

import './styles.scss';

type PropsType = {};

export const FAQ: FC<PropsType> = () => {
  const [open, setOpen] = useState<{ [key in string]: boolean }>({});
  const {
    data: faqs,
    isLoading,
    isError,
  } = useSelector((state: RootState) => state.general.faqs);
  const { t } = useTranslation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!faqs.length) {
      getFaqs(dispatch);
    }
  }, [dispatch, faqs.length]);

  const handleOpen = (id: number) => {
    setOpen({ ...open, [id]: !open[id] });
  };

  if (isError) {
    return;
  }

  if (isLoading) {
    return (
      <Spinner
        radius={50}
        stroke={2}
        color="rgba(var(--orange))"
        className="faq__spinner"
      />
    );
  }

  return (
    <div className="faq">
      <div>
        <div className="faq__title">{t('faq')}</div>
        <div className="faq__subtitle">{t('know-about-us')}</div>
      </div>
      <div className="faq-list">
        {faqs.map(({ id, titleRu, descriptionRu }) => (
          <div
            key={id}
            className="faq-list__item"
            onClick={() => handleOpen(id)}
          >
            <div className="flex-between-start">
              <div className="faq-list__item-content">
                <div className="faq-list__item-title">{titleRu}</div>
                {open[id] && (
                  <Animate
                    play={open[id]}
                    start={{ transform: 'translateY(-10px)', opacity: 0 }}
                    end={{ transform: 'translateY(0)', opacity: 1 }}
                    easeType="ease-in"
                  >
                    <div className="faq-list__item-description">
                      {Parser().parse(descriptionRu)}
                    </div>
                  </Animate>
                )}
              </div>
              <div className="faq-icon">
                <Animate
                  play={!open[id]}
                  start={{ opacity: 0 }}
                  end={{ opacity: 1 }}
                  easeType="ease-in"
                >
                  <img alt="plus" src="/plus.svg" />
                </Animate>
                <Animate
                  play={open[id]}
                  start={{ opacity: 0 }}
                  end={{ opacity: 1 }}
                  easeType="ease-in"
                >
                  <img alt="minus" src="/minus.svg" />
                </Animate>
              </div>
            </div>
            <div className="line faq__line" />
          </div>
        ))}
      </div>
    </div>
  );
};
