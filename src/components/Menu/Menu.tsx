import { FC, useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import { LangMenu } from '../LangMenu';
import { Icon } from '../ui/Icon';
import { useOnClickOutside } from '../../hooks';
// import { AnchorMapToPageType } from '../../types';

import './styles.scss';
// import { AnchorPageEnum } from '../../constants';

type PropsType = {
  handleChangePage: (index: number) => void;
  anchorMapToPage: any;
  isWhite?: boolean;
  //   anchorMapToPage: AnchorMapToPageType;
};

export enum AnchorPageEnum {
  ACQUAINTANCE = 'acquaintance',
  APPLICATION = 'application',
  TECHNOLOGY = 'technology',
  INFORMATION = 'information',
  CONTACTS = 'contacts',
}

export const Menu: FC<PropsType> = ({
  handleChangePage,
  anchorMapToPage,
  isWhite = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const node = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const listener = () => {
      isOpen && setIsOpen(false);
    };

    document.addEventListener('touchmove', listener);

    return () => {
      document.removeEventListener('touchmove', listener);
    };
  }, [isOpen]);

  useOnClickOutside(node, () => {
    if (isOpen) {
      onChangeIsMenuOpen();
    }
  });

  const onChangeIsMenuOpen = () => {
    setIsOpen((prev) => !prev);
  };

  const onChangeHash = (href: AnchorPageEnum) => {
    // window.location.href = '#' + href;
    handleChangePage(anchorMapToPage[href]);
  };

  return (
    <div ref={node} className={classNames('menu', { menu_white: isWhite })}>
      <button className="menu__button" onClick={onChangeIsMenuOpen}>
        <span className="menu__button-item" />
        <span className="menu__button-item" />
        <span className="menu__button-item" />
      </button>
      <div
        className={classNames('menu__side', {
          menu__side_open: isOpen,
        })}
      >
        <div>
          <Icon name="close2" size={1.5} handleClick={() => setIsOpen(false)} />
          <div className="menu__side-links">
            <NavLink className="menu__side-link" to="/catalog">
              {t('catalog')}
            </NavLink>
            <NavLink className="menu__side-link" to="/brands">
              {t('brands')}
            </NavLink>
            <NavLink className="menu__side-link" to="/projects">
              {t('projects')}
            </NavLink>
            <NavLink className="menu__side-link" to="/news">
              {t('news')}
            </NavLink>
            <NavLink className="menu__side-link" to="/contacts">
              {t('contacts')}
            </NavLink>
          </div>
        </div>

        <div className="menu__footer">
          <LangMenu isWhite />
          <div className="menu__side-social">
            <a
              href="https://www.instagram.com/luxuryliving.ru?igsh=MTJpODVvYmNxcHZsZA=="
              rel="noreferrer"
              target="_blank"
            >
              <Icon name="instagram" size={1.5} />
            </a>
            <a
              href="https://wa.me/79892351933"
              rel="noreferrer"
              target="_blank"
            >
              <Icon name="whatsap" size={1.5} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
