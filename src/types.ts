import { Brand } from './store/types';

export type TabType = {
  label: string;
  path: string;
};

export type Product = {
  id: number;
  src: string;
  brand: Brand | null;
  description: string;
  country: string;
  imageId: number | null;
  title: string;
  materials: string | null;
  volume?: string;
  imageIds: number[] | null;
};

export type Project = {
  id: number;
  title: string;
  imageIds: number[] | null;
  number: number;
};
