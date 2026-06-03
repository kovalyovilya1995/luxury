import { AnyAction, Dispatch } from '@reduxjs/toolkit';
import axios from 'axios';

import { Brand, Faq, News, Response } from './types';
import {
  setSuccessData,
  setErrorData,
  setLoadingData,
  setCategories,
} from './reducer';

export const getBrands = async (dispatch: Dispatch<AnyAction>) => {
  dispatch(setLoadingData({ key: 'brands' }));

  try {
    const response: Response<Brand[]> = await axios.get(
      '/brand?page=0&size=50&sort=number%2Ccreated%2CASC'
    );
    if (response.status !== 200 || typeof response.data === 'string') {
      throw new Error('bad response');
    }
    const data = response.data.content.filter(({ active }) => active);

    dispatch(setSuccessData({ key: 'brands', data }));
  } catch (error) {
    dispatch(setErrorData({ key: 'brands' }));
    console.error(error);
  }
};

export const getNews = async (dispatch: Dispatch<AnyAction>) => {
  dispatch(setLoadingData({ key: 'news' }));

  try {
    const response: Response<News[]> = await axios.get('/news?page=0&size=50');
    if (response.status !== 200 || typeof response.data === 'string') {
      throw new Error('bad response');
    }
    const data = response.data.content;

    dispatch(setSuccessData({ key: 'news', data }));
  } catch (error) {
    dispatch(setErrorData({ key: 'news' }));
    console.error(error);
  }
};

export const getFaqs = async (dispatch: Dispatch<AnyAction>) => {
  dispatch(setLoadingData({ key: 'faqs' }));

  try {
    const response: Response<Faq[]> = await axios.get('/faq');
    if (response.status !== 200 || typeof response.data === 'string') {
      throw new Error('bad response');
    }
    const data = response.data.content;

    dispatch(setSuccessData({ key: 'faqs', data }));
  } catch (error) {
    dispatch(setErrorData({ key: 'faqs' }));
    console.error(error);
  }
};

export const sendEmail = (email: string) => {
  return new Promise((resolve, reject) => {
    axios
      .post('/email-subscription', { email })
      .then((response) => {
        if (response.status !== 200 || typeof response.data === 'string') {
          reject();
        } else {
          resolve('ok');
        }
      })
      .catch(reject);
  });
};

export const getCategories = async (dispatch: Dispatch<AnyAction>) => {
  try {
    const response: Response<Faq[]> = await axios.get(
      '/category?page=0&size=10&sort=number%2Ccreated%2CASC'
    );
    if (response.status !== 200 || typeof response.data === 'string') {
      throw new Error('bad response');
    }

    dispatch(setCategories(response.data.content));
  } catch (error) {
    console.error(error);
  }
};
