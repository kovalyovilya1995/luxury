import { FC, useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';
import classNames from 'classnames';
import { Parser } from 'html-to-react';
import { Animate } from 'react-simple-animate';
import { useTranslation } from 'react-i18next';
import { Swiper, SwiperSlide, SwiperClass } from 'swiper/react';
import { Mousewheel, Navigation } from 'swiper/modules';

import { useMedia } from '../../hooks';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { Card } from '../../components/News/Card';
import { type News, ResponseOne, Response } from '../../store/types';
import { SwiperNavButtonNext } from './SwiperNavButtonNext';
import { Icon } from '../../components/ui/Icon';
import { baseURL } from '../..';

import './styles.scss';

export const NewsCard: FC = () => {
  const { newsId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activePhoto, setActivePhoto] = useState<number>();
  const [activeIndex, setActiveIndex] = useState(0);
  const [news, setNews] = useState<News>();
  const [otherNews, setOtherNews] = useState<News[]>();
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);

  const isMobile = useMedia('(max-width: 768px)');

  const handleChangeShowNawButtons = ({ activeIndex }: SwiperClass) => {
    setActiveIndex(activeIndex);
  };

  const handleClickImage = (item: number, index: number) => {
    setActivePhoto(item);
    setActiveIndex(index);
  };

  const handleClickNavButton = (nav: 'prev' | 'next') => {
    const idx = imageIds.findIndex((imageId) => imageId === activePhoto);
    const nextPhoto = imageIds[idx + 1];
    const prevPhoto = imageIds[idx - 1];

    if (nav === 'next' && nextPhoto) {
      setActiveIndex(idx + 1);
      setActivePhoto(nextPhoto);
    }

    if (nav === 'prev' && prevPhoto) {
      setActiveIndex(idx - 1);
      setActivePhoto(prevPhoto);
    }
  };

  const getNewsById = useCallback(async () => {
    try {
      const url = `/news/${newsId}`;
      const response: ResponseOne<News> = await axios.get(url);
      if (response.status !== 200 || typeof response.data === 'string') {
        throw new Error('bad response');
      }

      setNews(response.data);
      if (response.data.imageIds?.length || response.data.videoUrls) {
        const active = response.data.videoUrls
          ? -100
          : response.data.imageIds?.[0];
        active && setActivePhoto(active);
      }
    } catch (error) {
      console.error(error);
    }
  }, [newsId]);

  const getOtherNews = useCallback(async () => {
    try {
      const response: Response<News[]> = await axios.get('/news?size=3');
      if (response.status !== 200 || typeof response.data === 'string') {
        throw new Error('bad response');
      }

      if (newsId) {
        setOtherNews(
          response.data.content
            .filter(({ id }) => id !== Number(newsId))
            .slice(0, 2)
        );
      }
    } catch (error) {
      console.error(error);
    }
  }, [newsId]);

  useEffect(() => {
    const isCardNews = Number(newsId) > 0;

    if (!isCardNews || !newsId) {
      navigate('/');
    }

    getNewsById();
    getOtherNews();
  }, [newsId, navigate, getNewsById, getOtherNews]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [newsId]);

  useEffect(() => {
    const callback = () => {
      setInnerWidth(window.innerWidth);
    };

    window.addEventListener('resize', callback);
    return () => {
      window.removeEventListener('resize', callback);
    };
  }, []);

  const video = useMemo(() => {
    if (!news?.videoUrls) return '';
    let videoString = news.videoUrls;
    const size = isMobile ? 32 : 220;
    const coef = isMobile ? 1.525 : 1.77;

    const index1 = videoString.indexOf('width="');
    const index2 = videoString.indexOf('"', index1 + 7);

    videoString = videoString.replace(
      videoString.slice(index1, index2 + 1),
      `width="${innerWidth - size}"`
    );

    const index3 = videoString.indexOf('height="');
    const index4 = videoString.indexOf('"', index3 + 8);
    videoString = videoString.replace(
      videoString.slice(index3, index4 + 1),
      `height="${(innerWidth - size) / coef}"`
    );

    return videoString;
  }, [innerWidth, news?.videoUrls, isMobile]);

  const imageIds = useMemo(() => {
    const ids = news?.imageIds ?? [];
    if (!video) return ids;
    return [-100, ...ids];
  }, [news?.imageIds, video]);

  const isShowNextPrevButton = useMemo(() => {
    const idx = imageIds.findIndex((imageId) => imageId === activePhoto);
    return !!imageIds[idx - 1];
  }, [imageIds, activePhoto]);

  const isShowNextNavButton = useMemo(() => {
    const idx = imageIds.findIndex((imageId) => imageId === activePhoto);
    return !!imageIds[idx + 1];
  }, [imageIds, activePhoto]);

  const widthLine = (innerWidth - 32) / (imageIds.length ?? 1);
  const showBreadcrumbs = !isMobile;
  const showPhotoDesk = !isMobile;
  const showPhotoMobile = isMobile;
  const showAnotherNews = isMobile;
  const showScroll = (imageIds.length ?? 0) > 1;
  const showSlider = !!imageIds.length && imageIds.length > 1;

  return (
    <div className="news-card">
      <Header className="news-card__header" isMobile={isMobile} />

      {!!news && (
        <div className="news-card__content">
          {showBreadcrumbs && <Breadcrumbs news={news} />}

          {showPhotoMobile && (
            <>
              {showSlider && (
                <div className="news-card-mobile__slider">
                  <Swiper
                    slidesPerView={1}
                    speed={800}
                    slidesOffsetBefore={16}
                    slidesOffsetAfter={-16}
                    onActiveIndexChange={handleChangeShowNawButtons}
                    mousewheel
                    modules={[Mousewheel, Navigation]}
                  >
                    {imageIds.map((photo) => (
                      <SwiperSlide key={photo}>
                        {photo !== -100 && (
                          <img
                            className={classNames('news-card-mobile__img')}
                            src={`${baseURL}/images/${photo}`}
                            onClick={() => setActivePhoto(photo)}
                            alt="furniture"
                          />
                        )}
                        {photo === -100 && (
                          <div
                            className="news-card__video"
                            onClick={() => setActivePhoto(photo)}
                          >
                            {Parser().parse(video)}
                          </div>
                        )}
                      </SwiperSlide>
                    ))}
                    {activeIndex === 0 && video && <SwiperNavButtonNext />}
                  </Swiper>
                </div>
              )}

              {!showSlider && imageIds[0] && (
                <div className="flex-center">
                  {imageIds[0] !== -100 && (
                    <img
                      className={classNames('news-card-mobile__img')}
                      src={`${baseURL}/images/${imageIds[0]}`}
                      alt="furniture"
                    />
                  )}
                  {imageIds[0] === -100 && (
                    <div className="news-card__video">
                      {Parser().parse(video)}
                    </div>
                  )}
                </div>
              )}
              {showScroll && (
                <div className="news-card-mobile__scroll">
                  <div
                    className="news-card-mobile__scroll-item"
                    style={{
                      width: `${widthLine}px`,
                      transform: `translateX(${activeIndex * widthLine}px)`,
                    }}
                  />
                </div>
              )}
            </>
          )}

          <div className="news-card__titles">
            <div className="news-card__title">{news.titleRu}</div>
            <div className="news-card__subtitle">
              {dayjs(news.newsDate).format('D MMMM YYYY')}
            </div>
          </div>

          {showPhotoDesk && activePhoto && (
            <div className="news-card__photo">
              {activePhoto && (
                <div className="news-card__photo-wrapper-img">
                  <Animate
                    play
                    key={activePhoto}
                    start={{ opacity: 0.6 }}
                    end={{ opacity: 1 }}
                    duration={0.3}
                    easeType="ease-in"
                  >
                    {activePhoto !== -100 && (
                      <img
                        className="news-card__photo-img"
                        src={`${baseURL}/images/${activePhoto}`}
                        alt="card"
                      />
                    )}
                    {activePhoto === -100 && (
                      <div className="news-card__video">
                        {Parser().parse(video)}
                      </div>
                    )}
                  </Animate>
                  {isShowNextPrevButton && (
                    <Icon
                      name="arrow-right4"
                      color="rgba(var(--grey-600))"
                      className="news-card__photo-wrapper-arrow-left"
                      size={2.5}
                      handleClick={() => handleClickNavButton('prev')}
                    />
                  )}
                  {isShowNextNavButton && (
                    <Icon
                      name="arrow-right4"
                      color="rgba(var(--grey-600))"
                      className="news-card__photo-wrapper-arrow-right"
                      size={2.5}
                      handleClick={() => handleClickNavButton('next')}
                    />
                  )}
                </div>
              )}
              {!!imageIds.length && imageIds.length > 1 && (
                <div className="news-card__photo-carousel">
                  <div className="news-card__photo-carousel-scroll">
                    {imageIds.map((item, index) => (
                      <img
                        key={item}
                        className={classNames('news-card__photo-carousel-img', {
                          'news-card__photo-carousel-img_active':
                            item === activePhoto,
                        })}
                        src={
                          item === -100
                            ? '/play.jpg'
                            : `${baseURL}/images/${item}`
                        }
                        onClick={() => handleClickImage(item, index)}
                        alt="furniture"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="news-card__description">
            {Parser().parse(news.descriptionRus)}
          </div>

          {showAnotherNews && (
            <div className="news-card__another">
              <div className="news-card__another-title">{t('other-news')}</div>

              {!!otherNews?.length && (
                <div className="news-card__another-items">
                  {otherNews.map((item) => (
                    <Card
                      className="news-card__another-items-card"
                      key={item.id}
                      {...item}
                      onClickCard={() => navigate(`/news/${item.id}`)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <Footer isMobile={isMobile} />
    </div>
  );
};
