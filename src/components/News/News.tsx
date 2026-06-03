import { FC, useEffect, useState } from 'react';
import { Swiper, SwiperSlide, SwiperClass } from 'swiper/react';
import { Mousewheel, Navigation } from 'swiper/modules';
import { useSelector, useDispatch } from 'react-redux';
import Spinner from 'react-spinner-material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { getNews } from '../../store/actionCreator';
import type { RootState } from '../../store';
import { SwiperNavButtonPrev } from '../SwiperNavButtonPrev';
import { SwiperNavButtonNext } from '../SwiperNavButtonNext';
import { Card } from './Card';
import { LastSlide } from './LastSlide';
import { breakpoints } from './constants';

import 'swiper/css';
import 'swiper/css/navigation';
import './styles.scss';

type PropsType = {
  isMobile: boolean;
};

export const News: FC<PropsType> = ({ isMobile }) => {
  const {
    data: news,
    isLoading,
    isError,
  } = useSelector((state: RootState) => state.general.news);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const [showNavButton, setShowNavButton] = useState({
    showPrev: false,
    showNext: true,
  });

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const callback = () => {
      setInnerWidth(window.innerWidth);
    };

    window.addEventListener('resize', callback);
    return () => {
      window.removeEventListener('resize', callback);
    };
  }, []);

  useEffect(() => {
    if (!news.length) {
      getNews(dispatch);
    }
  }, [dispatch, news.length]);

  const handleChangeShowNawButtons = ({
    isBeginning,
    isEnd,
    activeIndex,
  }: SwiperClass) => {
    setActiveIndex(activeIndex);

    setShowNavButton({ showPrev: !isBeginning, showNext: !isEnd });
  };

  const offset = isMobile ? 16 : 110;
  const widthLine = (innerWidth - 32) / news.length;

  if (isError) {
    return;
  }

  if (isLoading) {
    return (
      <Spinner
        radius={50}
        stroke={2}
        color="rgba(var(--orange))"
        className="news__spinner"
      />
    );
  }

  return (
    <div className="news">
      <div className="news__header" onClick={() => navigate('/news')}>
        {t('news')}
      </div>
      <div className="news__content">
        <Swiper
          slidesPerView={5}
          spaceBetween={24}
          speed={800}
          onActiveIndexChange={handleChangeShowNawButtons}
          slidesOffsetBefore={offset}
          slidesOffsetAfter={offset}
          mousewheel
          breakpoints={breakpoints}
          modules={[Mousewheel, Navigation]}
          className="news-swiper"
        >
          {news.map((item) => (
            <SwiperSlide key={item.id}>
              <Card
                {...item}
                onClickCard={() => navigate(`/news/${item.id}`)}
              />
            </SwiperSlide>
          ))}
          <SwiperSlide>
            <LastSlide isMobile={isMobile} />
          </SwiperSlide>

          {showNavButton.showPrev && <SwiperNavButtonPrev />}
          {showNavButton.showNext && <SwiperNavButtonNext />}
        </Swiper>
      </div>
      {isMobile && (
        <div className="news__scroll">
          <div
            className="news__scroll-item"
            style={{
              width: `${widthLine}px`,
              transform: `translateX(${activeIndex * widthLine}px)`,
            }}
          />
        </div>
      )}
    </div>
  );
};
