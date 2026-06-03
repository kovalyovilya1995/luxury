import { FC, useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useNavigate } from 'react-router-dom';

import { type News, Response } from '../../store/types';
import { useMedia } from '../../hooks';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { Card, Skeleton } from '../../components/News';

import './styles.scss';

export const PageNews: FC = () => {
  const { t } = useTranslation();

  const isMobile = useMedia('(max-width: 768px)');
  const navigate = useNavigate();

  const [news, setNews] = useState<News[]>([]);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const getNews = useCallback(async (nextPage: number) => {
    !nextPage && setIsLoading(true);

    try {
      const response: Response<any> = await axios.get(
        `/news?&page=${nextPage}&size=10`
      );
      if (response.status !== 200 || typeof response.data === 'string') {
        throw new Error('bad response');
      }
      setTotal(response.data.totalElements);

      setNews((prev) =>
        nextPage ? [...prev, ...response.data.content] : response.data.content
      );
      !nextPage && setIsLoading(false);
    } catch (error) {
      console.error(error);
      setNews([]);
      if (!nextPage) {
        setTimeout(() => setIsLoading(false), 5000);
      }
    }
  }, []);

  useEffect(() => {
    getNews(0);
  }, [getNews]);

  const handleNextPage = () => {
    setPage((prev) => {
      const newPage = prev + 1;
      getNews(newPage);
      return newPage;
    });
  };

  const showBreadcrumbs = !isMobile;

  return (
    <div className="projects-news">
      <Header className="projects-news__header" isMobile={isMobile} />

      <div className="projects-news__content">
        {showBreadcrumbs && <Breadcrumbs />}

        <div className="projects-news__title">{t('news')}</div>

        <div className="projects-news__list">
          {!isLoading && (
            <InfiniteScroll
              className="projects-news__list-items"
              dataLength={news.length}
              next={handleNextPage}
              hasMore={total > news.length}
              loader={Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} />
              ))}
            >
              {news.map((card) => (
                <Card
                  key={card.id}
                  {...card}
                  onClickCard={() => navigate(`/news/${card.id}`)}
                />
              ))}
            </InfiniteScroll>
          )}

          {isLoading && (
            <div className="projects-news__list-items">
              {Array.from({ length: 2 * 3 }).map((_, index) => (
                <Skeleton key={index} />
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer isMobile={isMobile} />
    </div>
  );
};
