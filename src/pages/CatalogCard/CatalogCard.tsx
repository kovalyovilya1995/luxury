import { FC, useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';

import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { Tab } from '../../components/Tab';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { useMedia } from '../../hooks';
import { Product, TabType } from '../../types';
import { CatalogCardInfo } from '../../components/CatalogCardInfo';
import { CatalogCardPhoto } from '../../components/CatalogCardPhoto';
import { CatalogCardPhotoMobile } from '../../components/CatalogCardPhotoMobile';
import { tabMap } from '../Catalog/constants';
import { ResponseOne } from '../../store/types';
import { RootState } from '../../store';
import { getCategories } from '../../store/actionCreator';
import { ModalFeedback } from '../../components/modals/ModalFeedback';
import { ModalFeedbackSuccess } from '../../components/modals/ModalFeedbackSuccess';

import './styles.scss';

export const CatalogCard: FC = () => {
  const isMobile = useMedia('(max-width: 768px)');
  const { tab, productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [product, setProduct] = useState<Product>();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenSecondModal, setIsOpenSecondModal] = useState(false);

  const { categories } = useSelector((state: RootState) => state.general);

  const tabs = useMemo(
    () =>
      categories.map(({ title }) => ({
        label: title,
        path: tabMap[title],
      })),
    [categories]
  );

  const getProduct = useCallback(async () => {
    const url = `/products/${productId}`;

    try {
      const response: ResponseOne<Product> = await axios.get(url);
      if (response.status !== 200 || typeof response.data === 'string') {
        throw new Error('bad response');
      }

      setProduct(response.data);
    } catch (error) {
      console.error(error);
    }
  }, [productId]);

  useEffect(() => {
    if (!categories.length) {
      getCategories(dispatch);
    }
  }, [dispatch, categories.length]);

  useEffect(() => {
    const isCardProduct = Number(productId) > 0;

    if (!isCardProduct) {
      navigate('/');
    }
  }, [productId, navigate]);

  useEffect(() => {
    if (!productId) {
      return navigate('/');
    }

    getProduct();
  }, [productId, navigate, getProduct]);

  const activeTab = useMemo<TabType | undefined>(() => {
    if (!tabs.length) return;

    const newTab = tabs.find(({ path }) => path === tab);

    return newTab ? newTab : tabs[0];
  }, [tabs, tab]);

  const title = useMemo(() => {
    if (!activeTab || activeTab.path === 'all') return t('catalog');
    return activeTab?.label
      ? localStorage.getItem('lang') === 'ENG'
        ? tabMap[activeTab.label].charAt(0).toUpperCase() +
          tabMap[activeTab.label].slice(1)
        : activeTab.label
      : t('catalog');
  }, [t, activeTab]);

  const handleChangeTab = (tab: TabType) => {
    if (tab.path === 'all' || activeTab?.label === tab.label) {
      return navigate('/catalog');
    }

    navigate(`/catalog/${tab.path}`);
  };

  const handleApplyFeedback = () => {
    setIsOpenModal(false);
    setIsOpenSecondModal(true);
  };

  const showBreadcrumbs = !isMobile && product;
  const showTitle = !isMobile && product;
  const showTabs = !isMobile;
  const showInfoDesk = !isMobile && product;
  const showInfoMobile = isMobile && product;

  return (
    <div className="catalog-card-page">
      <Header className="catalog-card-page__header" isMobile={isMobile} />

      {product && (
        <>
          <ModalFeedback
            isOpen={isOpenModal}
            product={product}
            isMobile={isMobile}
            onClose={() => setIsOpenModal(false)}
            onApply={handleApplyFeedback}
          />
          <ModalFeedbackSuccess
            isMobile={isMobile}
            isOpen={isOpenSecondModal}
            onClose={() => setIsOpenSecondModal(false)}
          />
        </>
      )}

      <div className="catalog-card-page__content">
        {showTabs && (
          <div className="catalog-card-page__tabs">
            {tabs.map((tab) => (
              <Tab
                key={tab.label}
                item={tab}
                isCategory
                isActive={activeTab?.label === tab.label}
                onClick={handleChangeTab}
              />
            ))}
          </div>
        )}
        {showBreadcrumbs && <Breadcrumbs product={product} />}
        {showTitle && <div className="catalog-card-page__title">{title}</div>}
        {showInfoDesk && (
          <div className="catalog-card-page__info">
            <CatalogCardPhoto product={product} />
            <CatalogCardInfo product={product} />
          </div>
        )}
        {showInfoMobile && (
          <div className="catalog-card-page__info">
            <CatalogCardPhotoMobile product={product} />
            <CatalogCardInfo product={product} isMobile={isMobile} />
            <div className="catalog-card-page__wrapper">
              <button
                className="catalog-card-page__wrapper-button button"
                onClick={() => setIsOpenModal(true)}
              >
                {t('check-availability')}
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer isMobile={isMobile} />
    </div>
  );
};
