import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import { ToastContainer } from 'react-toastify';
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useSelector, useDispatch } from 'react-redux';

import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { CatalogCard } from './pages/CatalogCard';
import { Contacts } from './pages/Contacts';
import { Brands } from './pages/Brands';
import { BrandCard } from './pages/BrandCard';
import { Projects } from './pages/Projects';
import { ProjectDecor } from './pages/ProjectDecor';
import { ProjectCard } from './pages/ProjectCard';
import { PageNews } from './pages/News';
import { NewsCard } from './pages/NewsCard';
import { Main } from './admin/Main';
import { RootState } from './store';
import { setFilters } from './store/reducer';

import 'react-toastify/dist/ReactToastify.css';

const locale = 'ru';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/catalog',
    element: <Catalog />,
  },
  {
    path: '/catalog/:tab',
    element: <Catalog />,
  },
  {
    path: '/catalog/:tab/:productId',
    element: <CatalogCard />,
  },
  {
    path: '/contacts',
    element: <Contacts />,
  },
  {
    path: '/brands',
    element: <Brands />,
  },
  {
    path: '/brands/:brandId',
    element: <BrandCard />,
  },
  {
    path: '/projects',
    element: <Projects />,
  },
  {
    path: '/projects/decor',
    element: <ProjectDecor />,
  },
  {
    path: '/projects/:projectId',
    element: <ProjectCard />,
  },
  {
    path: '/news',
    element: <PageNews />,
  },
  {
    path: '/news/:newsId',
    element: <NewsCard />,
  },
  {
    path: '/admin',
    element: <Main />,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

export const App = () => {
  const [historyStack, setHistoryStack] = useState<any[]>([]);
  const filters = useSelector((state: RootState) => state.general.filters);
  const dispatch = useDispatch();

  useEffect(() => {
    if (historyStack.length < 2) return;

    const prevLastState = historyStack[historyStack.length - 2];
    const lastState = historyStack[historyStack.length - 1];

    // первый if проверяет, что предыдущая открытая страница была карточкой товара
    if (
      prevLastState &&
      prevLastState.location?.pathname?.includes('/catalog/') &&
      prevLastState.location?.pathname?.split('/').length - 1 === 3
    ) {
      // второй if проверяет, что текущая страница это каталог
      if (
        lastState?.location?.pathname === '/catalog' ||
        (lastState?.location?.pathname?.includes('/catalog/') &&
          lastState?.location?.pathname?.split('/').length - 1 === 2)
      ) {
        // третий if проверяет, что пользователь вернулся на ту страницу каталога, где задавал фильтры
        // то есть, отбрасывает вариант, если пользак перешел на другой таб
        if (filters.path === lastState?.location?.pathname) {
          dispatch(setFilters({ ...filters, isCan: true }));
        }
      }
    }
  }, [historyStack.length]);

  useEffect(() => {
    router.subscribe((state) => {
      setHistoryStack((prev) => [...prev, state]);
    });
  }, []);

  dayjs.locale(locale);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={locale}>
      <div className="App">
        <RouterProvider router={router} />
        <ToastContainer autoClose={2000} hideProgressBar />
      </div>
    </LocalizationProvider>
  );
};
