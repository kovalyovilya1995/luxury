export type StateKey = 'news' | 'brands' | 'faqs';

export type StateItems<T> = {
  data: T[];
  isError: boolean;
  isLoading: boolean;
  isSuccess: boolean;
};

export type Lang = 'RUS' | 'ENG';

export type GeneralState = {
  news: StateItems<News>;
  brands: StateItems<Brand>;
  faqs: StateItems<Faq>;
  searchText: string;
  categories: any[];
  filters: any;
};

export type Brand = {
  id: number;
  created?: string;
  updated?: string;
  title: string;
  description?: string;
  active?: boolean;
  imageId: number;
  logoId?: number;
  country?: string;
};

export type News = {
  id: number;
  created?: string;
  updated?: string;
  date: string;
  newsDate: string;
  title?: string;
  titleRu: string;
  description?: string;
  descriptionRus: string;
  imageId: number;
  imageIds?: number[];
  videoUrls?: string;
};

export type Faq = {
  id: number;
  created?: string;
  updated?: string;
  title: string;
  titleRu: string;
  description: string;
  descriptionRu: string;
  lang: Lang;
  active: boolean;
};

export type Response<T> = {
  data: {
    content: T;
    totalElements: number;
  };
  status: number;
};

export type ResponseOne<T> = {
  data: T;
  status: number;
};
