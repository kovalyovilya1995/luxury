import { FC, useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';

import { useMedia, useWatch } from '../../hooks';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { Tab } from '../../components/Tab';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { Filter } from '../../components/Filter';
import { FilterMobile } from '../../components/FilterMobile';
import { CatalogList } from '../../components/CatalogList';
import { SearchResultText } from '../../components/SearchResultText';
import { ProductsNotFound } from '../../components/ProductsNotFound';
import { TabType, Product } from '../../types';
import { RootState } from '../../store';
import { setFilters, resetIsCan, setSearchText } from '../../store/reducer';
import { getCategories } from '../../store/actionCreator';
import { Response } from '../../store/types';
import { tabMap } from './constants';

import './styles.scss';

let controller: any;

export const Catalog: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const { tab } = useParams();

  const { searchText, categories, filters } = useSelector(
    (state: RootState) => state.general
  );

  const tabs = useMemo(
    () =>
      categories.map(({ title }) => ({
        label: title,
        path: tabMap[title],
      })),
    [categories]
  );

  const activeTab = useMemo<TabType | undefined>(() => {
    if (!tabs.length) return;

    const newTab = tabs.find(({ path }) => path === tab);

    return newTab ? newTab : tabs[0];
  }, [tabs, tab]);

  const isMobile = useMedia('(max-width: 768px)');
  const [isLoading, setIsLoading] = useState(true);
  const [typeProduct, setTypeProduct] = useState('');
  const [filterBrands, setBrands] = useState<string[]>([]);
  const [isOnlyStock, setIsOnlyStock] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  // const [colors, setColors] = useState<string[]>([]);

  const getBrandIds = useCallback(() => {
    return categories
      .find((category: any) => category.title === activeTab?.label)
      ?.brands.filter((brand: any) => filterBrands.includes(brand.title))
      ?.map((brand: any) => brand.id);
  }, [activeTab?.label, categories, filterBrands]);

  const getTypeId = useCallback(() => {
    return categories
      .find((category: any) => category.title === activeTab?.label)
      ?.types.find((type: any) => type.title === typeProduct)?.id;
  }, [activeTab?.label, categories, typeProduct]);

  const getCategoryId = useCallback(() => {
    return categories.find(
      (category: any) => category.title === activeTab?.label
    )?.id;
  }, [activeTab?.label, categories]);

  const getProducts = useCallback(
    async (nextPage: number) => {
      controller?.abort();
      controller = new AbortController();
      !nextPage && setIsLoading(true);

      try {
        const categoryId = getCategoryId();

        const urlWithText = `products/text-search?text=${searchText}&page=${nextPage}&size=20&sort=number`;
        let urlWithoutText = `/products/search?page=${nextPage}&size=20&sort=number`;
        if (categoryId) {
          urlWithoutText +=
            '&sort=brandNumber,ASC&sort=typeNumber,ASC&sort=title,ASC&sort=id';
        }

        if (filterBrands.length) {
          const ids = getBrandIds();

          if (ids?.length) {
            urlWithoutText += '&brandIds=' + ids.join('&brandIds=');
          }
        }

        if (typeProduct) {
          const id = getTypeId();

          if (id) {
            urlWithoutText += '&typeId=' + id;
          }
        }

        if (categoryId) {
          urlWithoutText += '&categoryIds=' + categoryId;
        }

        if (isOnlyStock) {
          urlWithoutText += '&inStock=true';
        }

        const url = searchText ? urlWithText : urlWithoutText;

        const response: Response<any> = await axios.get(url, {
          signal: controller.signal,
        });
        if (response.status !== 200 || typeof response.data === 'string') {
          // throw new Error('bad response');
        }
        setTotal(response.data.totalElements);

        setProducts((prev) =>
          nextPage ? [...prev, ...response.data.content] : response.data.content
        );
        !nextPage && setIsLoading(false);
      } catch (error) {
        console.error(error);
        setProducts([]);
        if (!nextPage) {
          setTimeout(() => setIsLoading(false), 5000);
        }
      }
    },
    [
      typeProduct,
      searchText,
      filterBrands.length,
      isOnlyStock,
      getBrandIds,
      getCategoryId,
      getTypeId,
    ]
  );

  useEffect(() => {
    if (!categories.length) {
      getCategories(dispatch);
    }
  }, [dispatch, categories.length]);

  useEffect(() => {
    if (filters.isCan) {
      setIsOnlyStock(filters.isOnlyStock);
      setBrands(filters.brands);
      setTypeProduct(filters.typeProduct);
    }
  }, [filters]);

  useEffect(() => {
    return () => {
      dispatch(resetIsCan());
    };
  }, [
    dispatch,
    filters.isOnlyStock,
    filters.brands,
    filters.typeProduct,
    pathname,
  ]);

  useEffect(() => {
    if (!activeTab?.path) return;

    setPage(0);
    getProducts(0);
  }, [
    activeTab?.path,
    typeProduct,
    filterBrands.length,
    isOnlyStock,
    // colors,
    searchText,
    getProducts,
  ]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  useEffect(() => {
    if (!tabs.length) return;
    const newTab = tabs.find(({ path }) => path === tab);

    if (!newTab && pathname !== '/catalog') {
      navigate('/');
    }
  }, [tab, tabs, pathname, navigate]);

  useWatch(() => {
    if (!tab) return;

    const newTab = tabs.find(({ path }) => path === tab);

    if (!newTab) {
      navigate('/');
    }
  }, [tab, navigate]);

  const title = useMemo(() => {
    if (!activeTab || activeTab.path === 'all') return t('catalog');
    return activeTab?.label
      ? localStorage.getItem('lang') === 'ENG'
        ? tabMap[activeTab.label].charAt(0).toUpperCase() +
          tabMap[activeTab.label].slice(1)
        : activeTab.label
      : t('catalog');
  }, [t, activeTab]);

  const typeProductOptions = useMemo<string[] | undefined>(
    () =>
      categories
        .find((category: any) => category.title === activeTab?.label)
        ?.types.map((type: any) => type.title),
    [categories, activeTab]
  );

  const brandsOptions = useMemo<string[] | undefined>(
    () =>
      categories
        .find((category: any) => category.title === activeTab?.label)
        ?.brands.map((brand: any) => brand.title),
    [categories, activeTab]
  );

  // при переходе из брендов устанавливаем фильтр бренда
  useEffect(() => {
    if (!categories?.length) return;
    if (!brandsOptions?.length) return;
    if (activeTab?.path !== 'all') return;
    if (!!filterBrands.length) return;

    const brandTitle = localStorage.getItem('brandTitle');
    const currentBrandTitle = brandsOptions.find(
      (title) => title === brandTitle
    );
    if (currentBrandTitle) {
      localStorage.removeItem('brandTitle');
      setBrands([currentBrandTitle]);
      dispatch(
        setFilters({
          path: pathname,
          isCan: false,
          isOnlyStock: false,
          brands: [currentBrandTitle],
          typeProduct: '',
        })
      );
    }
  }, [
    activeTab?.path,
    brandsOptions,
    categories?.length,
    filterBrands.length,
    dispatch,
    pathname,
  ]);

  const handleChangeTab = (tab: TabType) => {
    if (tab.path === 'all' || activeTab?.label === tab.label) {
      handleResetFilters();
      return navigate('/catalog');
    }

    handleResetFilters();
    navigate(`/catalog/${tab.path}`);
  };

  const handleGoToCard = (id: number) => {
    navigate(`/catalog/${activeTab?.path}/${id}`);
  };

  const handleNextPage = () => {
    setPage((prev) => {
      const newPage = prev + 1;
      getProducts(newPage);
      return newPage;
    });
  };

  const handleChangeAllFilters = (filters: {
    typeProduct: string;
    brands: string[];
    isOnlyStock: boolean;
    // colors: string[];
  }) => {
    setTypeProduct(filters.typeProduct);
    setBrands(filters.brands);
    setIsOnlyStock(filters.isOnlyStock);
    dispatch(
      setFilters({
        path: pathname,
        isCan: false,
        isOnlyStock: filters.isOnlyStock,
        brands: filters.brands,
        typeProduct: filters.typeProduct,
      })
    );
    // setColors(filters.colors);
  };

  const handleChangeFilter = (
    type: string,
    value?: string | string[] | boolean
  ) => {
    if (type === 'reset') {
      return handleResetFilters();
    }

    if (type === 'product' && typeof value === 'string') {
      dispatch(
        setFilters({
          isOnlyStock,
          brands: filterBrands,
          path: pathname,
          isCan: false,
          typeProduct: value,
        })
      );
      return setTypeProduct(value);
    }

    if (type === 'brand' && Array.isArray(value)) {
      dispatch(
        setFilters({
          typeProduct,
          isOnlyStock,
          path: pathname,
          isCan: false,
          brands: value,
        })
      );
      return setBrands(value);
    }

    if (type === 'isOnlyStock' && typeof value === 'boolean') {
      dispatch(
        setFilters({
          typeProduct,
          brands: filterBrands,
          path: pathname,
          isCan: false,
          isOnlyStock: value,
        })
      );
      return setIsOnlyStock(value);
    }

    // if (type === 'color' && Array.isArray(value)) {
    //   return setColors(value);
    // }
  };

  const handleResetFilters = () => {
    setTypeProduct('');
    setBrands([]);
    setIsOnlyStock(false);
    dispatch(
      setFilters({
        path: pathname,
        isCan: false,
        isOnlyStock: false,
        brands: [],
        typeProduct: '',
      })
    );
    dispatch(setSearchText(''));
  };

  const showTitle = !searchText && (!isMobile || !!products.length);
  const showSearchResult = searchText || (isMobile && !products.length);
  const showCatalog = !!products.length || isLoading;
  const showNotFound = !products.length && !isLoading;
  const showBreadcrumbs = !isMobile && !searchText;
  const showFilterDesk =
    !isMobile && (!!products.length || !searchText || isLoading);

  return (
    <div className="catalog-page">
      <Header className="catalog-page__header" isMobile={isMobile} />

      <div className="catalog-page__content">
        <div className="catalog-page-tabs">
          {tabs.map((tab) => (
            <Tab
              key={tab.label}
              item={tab}
              isCategory
              isActive={activeTab?.label === tab.label}
              onClick={handleChangeTab}
            />
          ))}
          {!tabs.length && <div className="catalog-page-tabs__empty" />}
        </div>
        {showBreadcrumbs && <Breadcrumbs />}
        {isMobile && (
          <FilterMobile
            onChangeAllFilters={handleChangeAllFilters}
            typeProduct={typeProduct}
            brands={filterBrands}
            isOnlyStock={isOnlyStock}
            typeProductOptions={typeProductOptions}
            brandsOptions={brandsOptions}
            categoryId={getCategoryId()}
            categories={categories}
            initialTotal={total}
            // colors={colors}
          />
        )}
        {showTitle && <div className="catalog-page__title">{title}</div>}
        {showSearchResult && (
          <SearchResultText
            isLoading={isLoading}
            text={searchText}
            count={products.length}
            className="catalog-page__search-result"
          />
        )}
        <div className="catalog-page-blocks">
          {showFilterDesk && (
            <Filter
              onChangeFilter={handleChangeFilter}
              typeProduct={typeProduct}
              brands={filterBrands}
              isOnlyStock={isOnlyStock}
              typeProductOptions={typeProductOptions}
              brandsOptions={brandsOptions}
              // colors={colors}
            />
          )}
          {showCatalog && (
            <CatalogList
              isLoading={isLoading}
              products={products}
              total={total}
              onNextPage={handleNextPage}
              onGoToCard={handleGoToCard}
            />
          )}
          {showNotFound && (
            <ProductsNotFound
              searchEmpty={!searchText}
              isMobile={isMobile}
              onGoToCard={handleGoToCard}
            />
          )}
        </div>
      </div>

      <Footer isMobile={isMobile} />
    </div>
  );
};
