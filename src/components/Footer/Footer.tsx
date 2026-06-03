import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, NavLink } from 'react-router-dom';

import './styles.scss';

type PropsType = {
  isMobile: boolean;
};

export const Footer: FC<PropsType> = ({ isMobile }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="footer">
      <div className="footer__first">
        <img
          className="footer__logo pointer"
          alt="Лого"
          src="/logo-visit.svg"
          onClick={() => navigate('/')}
        />
        <div className="footer__contacts">
          <div className="footer-links-group">
            <div className="footer__contacts-links">
              <NavLink className="footer-contacts-link" to="/catalog">
                {t('catalog')}
              </NavLink>
              <NavLink className="footer-contacts-link" to="/brands">
                {t('brands')}
              </NavLink>
              <NavLink className="footer-contacts-link" to="/projects">
                {t('projects')}
              </NavLink>
            </div>
            <div className="footer__contacts-links">
              <NavLink className="footer-contacts-link" to="/news">
                {t('news')}
              </NavLink>
              <NavLink className="footer-contacts-link" to="/contacts">
                {t('contacts')}
              </NavLink>
            </div>
          </div>
          {!isMobile && (
            <div className="footer__contacts-social">
              <a
                href="https://www.instagram.com/luxuryliving.ru?igsh=MTJpODVvYmNxcHZsZA=="
                rel="noreferrer"
                target="_blank"
              >
                <img alt="instagram" src="/instagram.svg" />
              </a>
              <a
                href="https://wa.me/79892351933"
                rel="noreferrer"
                target="_blank"
              >
                <img alt="whatsap" src="/whatsap.svg" />
              </a>
            </div>
          )}
        </div>
      </div>
      <div className="footer__second">
        <div className="line" />
        <div className="footer__information">
          <div>©Luxury Living</div>
          <div className="footer__information-items">
            <div className="pointer">{t('return-policy')}</div>
            <div className="pointer">{t('personal-data')}</div>
            <div className="pointer">Cookies</div>
          </div>
        </div>
      </div>
    </div>
  );
};
