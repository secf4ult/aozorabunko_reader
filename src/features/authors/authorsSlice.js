import {
  createEntityAdapter,
  createSlice,
  createAsyncThunk,
  nanoid,
} from '@reduxjs/toolkit';
import cheerio from 'cheerio';
import axios from 'axios';

const authorAdapter = createEntityAdapter();

const initialState = authorAdapter.getInitialState({
  recent: [],
  initialFetch: true,
  pageOffset: 0,
  pageLimit: 10,
});

export const fetchAuthors = createAsyncThunk('authors/fetch', async () => {
  const { data } = await axios.get(
    'https://www.aozora.gr.jp/index_pages/person_all.html'
  );
  const $ = cheerio.load(data);
  const authors = [];
  $('li a', 'ol').each((_, el) => {
    const url = $(el).attr('href');
    const name = $(el).html() || '';
    // extract how many articles this author has
    authors.push({ id: nanoid(), name, url });
  });
  return authors;
});

export const fetchArticlesByAuthor = createAsyncThunk(
  'authors/fetchArticlesByAuthor',
  async ({ url: authorUrl, id: authorId }) => {
    const { data } = await axios.get(authorUrl, {
      baseURL: 'https://www.aozora.gr.jp/index_pages',
    });
    const $ = cheerio.load(data);
    const articles = [];
    $('li a[href*="../cards"]', 'ol').each((_, el) => {
      const title = $(el).html();
      const url = $(el).attr('href');
      articles.push({ id: nanoid(), title, url, authorId });
    });
    return { authorId, articles };
  }
);

const authorsSlice = createSlice({
  name: 'authors',
  initialState,
  reducers: {
    nextPageAuthors: (state) => {
      state.pageOffset += state.pageLimit;
    },
    prevPageAuthors: (state) => {
      state.pageOffset -= state.pageLimit;
    },
  },
  extraReducers: {
    [fetchAuthors.fulfilled]: (state, action) => {
      state.initialFetch = false;
      authorAdapter.addMany(state, action);
    },
    [fetchArticlesByAuthor.fulfilled]: (state, action) => {
      const { authorId, articles } = action.payload;
      state.entities[authorId].articles = articles;
    },
  },
});

// actions
export const { nextPageAuthors, prevPageAuthors } = authorsSlice.actions;
// selectors
export const {
  selectAll: selectAllAuthors,
  selectById: selectAuthorById,
} = authorAdapter.getSelectors((state) => state.authors);
export const selectPageAuthors = (state) => {
  const currentPageIds = state.authors.ids.slice(
    state.authors.pageOffset,
    state.authors.pageOffset + state.authors.pageLimit
  );
  return currentPageIds.map((id) => state.authors.entities[id]);
};
export const selectAuthorArticles = (state, authorId) => {
  return state.authors.ids.length
    ? state.authors.entities[authorId].articles
    : [];
};

export default authorsSlice.reducer;
