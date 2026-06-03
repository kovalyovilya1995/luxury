import { FC, useMemo } from 'react';
import classNames from 'classnames';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Product, Project } from '../../types';
import { Brand, News } from '../../store/types';
import { Icon } from '../ui/Icon';

import './styles.scss';

type PropsType = {
  product?: Product;
  brand?: Brand;
  project?: Project;
  news?: News;
  className?: string;
};

export const Breadcrumbs: FC<PropsType> = ({
  className,
  product,
  brand,
  project,
  news,
}) => {
  const { pathname } = useLocation();
  const { productId, brandId, projectId, newsId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const MAP: Record<string, any> = {
    catalog: t('catalog'),
    present: t('present'),
    serving: t('serving'),
    accessories: t('accessories'),
    textile: t('textile'),
    carpets: t('carpets'),
    wallpaper: t('wallpaper'),
    paints: t('paints'),
    furniture: t('furniture'),
    contacts: t('contacts'),
    brands: t('brands'),
    projects: t('projects'),
    decor: t('apartment-decor'),
    news: t('news'),
  };

  const handleNavigate = (path: string) => {
    if (path === pathname) return;

    navigate(path);
  };

  const items = useMemo(() => {
    const names = pathname.split('/').slice(1);
    const result = [{ label: t('home'), path: '/' }];

    names.forEach((item, index) => {
      if (item === 'all') return;
      const path = '/' + names.slice(0, index + 1).join('/');

      if (product && item === productId) {
        const label = `${product.brand?.title} ${product.title}`;
        result.push({ label, path });
        return;
      }

      if (brand && item === brandId) {
        result.push({ label: brand.title.toLowerCase(), path });
        return;
      }

      if (project && item === projectId) {
        result.push({ label: project.title, path });
        return;
      }

      if (news && item === newsId) {
        result.push({ label: news.titleRu, path });
        return;
      }

      result.push({ label: MAP[item], path });
    });

    return result;
  }, [
    pathname,
    product,
    brand,
    project,
    news,
    productId,
    brandId,
    projectId,
    newsId,
  ]);

  return (
    <div className={classNames('breadcrumbs', className)}>
      {items.map((item, index) => {
        const isLast = items.length - 1 === index;
        return (
          <div key={item.label} className="breadcrumbs-items">
            <div
              className={classNames('breadcrumbs__item', {
                breadcrumbs__item_active: isLast,
              })}
              onClick={() => handleNavigate(item.path)}
            >
              {item.label}
            </div>
            {!isLast && (
              <Icon
                className="breadcrumbs-icon"
                name="arrow-right2"
                color="rgba(var(--grey-400))"
                height={0.625}
                width={0.3125}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
