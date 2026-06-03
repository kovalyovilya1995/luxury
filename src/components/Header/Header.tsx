import { FC, useState } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { useNavigate, NavLink } from 'react-router-dom';

import { Menu } from '../Menu';
import { LangMenu } from '../LangMenu';
import { Icon } from '../ui/Icon';
import { Search } from '../Search';

import './styles.scss';

type PropsType = {
  isMobile: boolean;
  className?: string;
  isWhite?: boolean;
};

export const Header: FC<PropsType> = ({
  isMobile,
  className,
  isWhite = false,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchActive, setSearchActive] = useState(false);

  return (
    <div className={classNames('header', { header_white: isWhite }, className)}>
      {!searchActive && isMobile && (
        <Menu
          handleChangePage={() => {}}
          anchorMapToPage={{}}
          isWhite={isWhite}
        />
      )}

      {!searchActive && (
        <Icon
          name="logo"
          width={isMobile ? 10.6875 : 13.0875}
          height={isMobile ? 2.09125 : 2.558125}
          color={isWhite ? 'rgba(var(--white))' : 'rgba(var(--grey-800))'}
          pointer
          handleClick={() => navigate('/')}
        />
      )}

      {isMobile && (
        <Search
          isWhite={isWhite}
          onChangeActive={setSearchActive}
          hasClose
          className={classNames({ header__search_active: searchActive })}
        />
      )}
      {!isMobile && (
        <div className="header__nav-menu">
          <NavLink className="nav-link" to="/catalog">
            {t('catalog')}
          </NavLink>
          <NavLink className="nav-link" to="/brands">
            {t('brands')}
          </NavLink>
          <NavLink className="nav-link" to="/projects">
            {t('projects')}
          </NavLink>
          <NavLink className="nav-link" to="/news">
            {t('news')}
          </NavLink>
          <NavLink className="nav-link" to="/contacts">
            {t('contacts')}
          </NavLink>
          <Search isWhite={isWhite} />
          <LangMenu className="header__lang-menu" isWhite={isWhite} />
        </div>
      )}
    </div>
  );
};
