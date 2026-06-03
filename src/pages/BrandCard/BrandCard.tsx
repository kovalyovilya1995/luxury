import { FC, useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { Parser } from 'html-to-react';
import classNames from 'classnames';

import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { useMedia } from '../../hooks';
import { Product } from '../../types';
import { Brand, Response, ResponseOne } from '../../store/types';
import { CatalogCardPreview } from '../../components/CatalogCardPreview';
import { baseURL } from '../..';
import { isOldSafari } from '../../utils/isOldSafari';

import './styles.scss';

export const BrandCard: FC = () => {
  const isMobile = useMedia('(max-width: 768px)');
  const { brandId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [brand, setBrand] = useState<Brand>();
  const [products, setProducts] = useState<Product[]>();
  const [productTitle, setProductTitle] = useState('');
  const [showAllDescription, setShowAllDescription] = useState(isMobile);

  const getInterestingProducts = useCallback(async () => {
    const url = '/products/liked?page=0&size=20';

    try {
      const response: Response<Product[]> = await axios.get(url);
      if (response.status !== 200 || typeof response.data === 'string') {
        throw new Error('bad response');
      }

      if (response.data.content.length) {
        setProducts(response.data.content.slice(0, 4));
        setProductTitle(t('you-may-like'));
      }
    } catch (error) {
      console.error(error);
    }
  }, [t]);

  const getBrandProducts = useCallback(async () => {
    const url = `/products/search?brandIds=${brandId}`;

    try {
      const response: Response<Product[]> = await axios.get(url);
      if (response.status !== 200 || typeof response.data === 'string') {
        throw new Error('bad response');
      }

      if (response.data.content.length) {
        setProducts(response.data.content.slice(0, 4));
        setProductTitle(t('brand-products'));
      } else {
        getInterestingProducts();
      }
    } catch (error) {
      console.error(error);
    }
  }, [t, brandId, getInterestingProducts]);

  const getBrand = useCallback(async () => {
    const url = `/brand/${brandId}`;

    try {
      const response: ResponseOne<Brand> = await axios.get(url);
      if (response.status !== 200 || typeof response.data === 'string') {
        throw new Error('bad response');
      }

      setBrand(response.data);
      getBrandProducts();
    } catch (error) {
      console.error(error);
    }
  }, [brandId, getBrandProducts]);

  useEffect(() => {
    const isCardBrand = Number(brandId) > 0;

    if (!isCardBrand || !brandId) {
      navigate('/');
    }

    getBrand();
  }, [brandId, navigate, getBrand]);

  const handleGoToCard = (id: number) => {
    navigate(`/catalog/all/${id}`);
  };

  const goToCatalog = () => {
    if (brand?.title) {
      localStorage.setItem('brandTitle', brand.title.toString());
    }
    navigate(`/catalog`);
  };

  const handleShowAllDescription = (event: any) => {
    event.stopPropagation();
    setShowAllDescription(true);
  };

  return (
    <div className="brand-card-page">
      <Header className="brand-card-page__header" isMobile={isMobile} />

      {!!brand && (
        <div className="brand-card-page__content">
          {!isMobile && (
            <Breadcrumbs
              brand={brand}
              className="brand-card-page__breadcrumbs"
            />
          )}

          <div
            className={classNames('brand-card-page__content-info', {
              'brand-card-page__content-info_without-descr': !brand.description,
            })}
            onClick={goToCatalog}
          >
            {!!brand.logoId && (
              <div className="brand-card-page__logo-wrapper">
                <img
                  className="brand-card-page__logo"
                  src={`${baseURL}/images/${brand.logoId}`}
                  alt="logo"
                />
              </div>
            )}
            <div className="brand-card-page__content-info-text">
              <div className="brand-card-page__title">
                {brand.title.toLowerCase()}
              </div>
              {(brand.description || brand.country) && (
                <div
                  className={classNames('brand-card-page__description', {
                    'brand-card-page__description_all': showAllDescription,
                    'brand-card-page__description_vertical': !isOldSafari(),
                  })}
                >
                  {brand.description
                    ? Parser().parse(brand.description)
                    : `${t('country')}: ${brand.country}`}
                </div>
              )}
              {brand.description && !showAllDescription && (
                <span
                  onClick={handleShowAllDescription}
                  className="brand-card-page__description-more"
                >
                  {t('more')}
                </span>
              )}
            </div>
          </div>

          {!!products?.length && (
            <div className="brand-card-page__content-products">
              <div className="brand-card-page__content-products-title">
                {productTitle}
              </div>
              <div className="brand-card-page__content-products-items">
                {products.map((product) => (
                  <CatalogCardPreview
                    key={product.id}
                    {...product}
                    onGoToCard={handleGoToCard}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <Footer isMobile={isMobile} />
    </div>
  );
};
