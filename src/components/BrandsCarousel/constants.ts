import { Brand } from '../../store/types';

export const data: Brand[] = [
  { id: 0, imageId: 1, title: 'DOLCE & GABBANA CASA' },
  { id: 1, imageId: 2, title: 'BACCARAT' },
  { id: 2, imageId: 3, title: 'HERMES' },
  { id: 3, imageId: 4, title: 'LALIQUE' },
  { id: 4, imageId: 5, title: 'CHRISTOFLE' },
  { id: 5, imageId: 6, title: 'BERNARDAUD' },
];

export const breakpoints = {
  0: {
    slidesPerView: 1.8,
    spaceBetween: 10,
  },
  550: {
    slidesPerView: 3.5,
    spaceBetween: 24,
  },
  1024: {
    slidesPerView: 4,
    spaceBetween: 24,
  },
  1700: {
    slidesPerView: 4.5,
    spaceBetween: 30,
  },
};
