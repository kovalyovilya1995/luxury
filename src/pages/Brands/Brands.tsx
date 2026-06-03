import { FC, MouseEvent, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames';

import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { useMedia } from '../../hooks';
import { RootState } from '../../store';
import { getBrands } from '../../store/actionCreator';
import {
  ALPHABET_HEIGHT,
  HEADER_HEIGHT,
  LETTERS,
  LETTERS_GAP,
} from './constants';
import { Letter } from './types';
import { deepClone } from '../../utils/deepClone';

import './styles.scss';

export const Brands: FC = () => {
  const isMobile = useMedia('(max-width: 768px)');
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { data: brands } = useSelector(
    (state: RootState) => state.general.brands
  );

  useEffect(() => {
    if (!brands.length) {
      getBrands(dispatch);
    }
  }, [dispatch, brands.length]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const showBreadcrumbs = !isMobile;

  const alphabet = useMemo(() => {
    const letters = deepClone(LETTERS);

    brands.forEach((brand) => {
      const firstLetter = brand.title[0].toUpperCase();
      const letter = letters.find(({ label }) => label[0] === firstLetter);

      if (letter) {
        letter.brands.push(brand);
      } else {
        const lastLetter = letters.at(-1);
        lastLetter && lastLetter.brands.push(brand);
      }
    });

    return letters;
  }, [brands]);

  const handleClickLetter = (
    event: MouseEvent<HTMLAnchorElement>,
    letter: Letter
  ) => {
    event.preventDefault();

    if (!letter.brands.length) return;

    const element = document.getElementById(letter.label);
    if (element) {
      const padding = HEADER_HEIGHT + ALPHABET_HEIGHT + LETTERS_GAP;
      const y =
        element.getBoundingClientRect().top +
        window.scrollY -
        (isMobile ? padding : 0);
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="brands-page">
      <Header className="brands-page__header" isMobile={isMobile} />

      <div className="brands-page__content">
        {showBreadcrumbs && <Breadcrumbs />}
        <div className="brands-page__title">{t('brands')}</div>

        <div className="brands-page__letters">
          {alphabet.map((letter) => (
            <a
              className={classNames('brands-page__letters-item', {
                'brands-page__letters-item_disabled': !letter.brands.length,
              })}
              href={'#' + letter.label}
              onClick={(event) => handleClickLetter(event, letter)}
              key={letter.label}
            >
              {letter.label}
            </a>
          ))}
        </div>

        <div className="brands-page__list">
          {alphabet
            .filter(({ brands }) => !!brands.length)
            .map((letter) => (
              <div key={letter.label} id={letter.label}>
                <div className="brands-page__list-letter">{letter.label}</div>
                <div className="brands-page__list-brands">
                  {letter.brands.map((brand) => (
                    <NavLink
                      className="brands-page__list-brands-item"
                      key={brand.title}
                      to={`/brands/${brand.id}`}
                    >
                      {brand.title.toLowerCase()}
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>

      <Footer isMobile={isMobile} />
    </div>
  );
};
