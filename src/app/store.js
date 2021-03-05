/* eslint-disable no-underscore-dangle */
import { configureStore } from '@reduxjs/toolkit';
import authorsSlice from '../features/authors/authorsSlice';
import articlesSlice from '../features/articles/articlesSlice';

export default configureStore({
  reducer: {
    authors: authorsSlice,
    articles: articlesSlice,
  },
});
