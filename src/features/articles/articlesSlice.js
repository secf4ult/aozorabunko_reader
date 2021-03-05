import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit';
import axios from 'axios';
import cheerio from 'cheerio';
import { TextDecoder } from 'util';
import { fetchArticlesByAuthor } from '../authors/authorsSlice';

const articlesAdapter = createEntityAdapter();
const initialState = articlesAdapter.getInitialState();

export const fetchArticleByUrl = createAsyncThunk(
  'articles/fetchArticleByUrl',
  async (article) => {
    const articleAddr = new URL(
      article.url,
      'https://www.aozora.gr.jp/index_pages'
    ).href;
    const { data } = await axios.get(articleAddr);
    const $ = cheerio.load(data);
    const contentUrl = $('a:contains("いますぐ")').attr('href');
    const contentAddr = new URL(contentUrl, articleAddr);
    const { data: contentData } = await axios.get(contentAddr, {
      responseType: 'arraybuffer',
    });
    // decode Shift_JIS to utf8
    const decodedContent = new TextDecoder('shift-jis').decode(contentData);
    const $1 = cheerio.load(decodedContent);
    const articleContent = $1('body').html();
    const res = { articleId: article.id, content: articleContent };
    return res;
  }
);

const articlesSlice = createSlice({
  name: 'articles',
  initialState,
  extraReducers: {
    [fetchArticlesByAuthor.fulfilled]: (state, action) => {
      articlesAdapter.addMany(state, action.payload.articles);
    },
    [fetchArticleByUrl.fulfilled]: (state, action) => {
      const { articleId, content } = action.payload;
      state.entities[articleId].content = content;
    },
  },
});

export const { addArticles } = articlesSlice.actions;
export const {
  selectAll: selectAllArticles,
  selectById: selectArticleById,
} = articlesAdapter.getSelectors((state) => state.articles);
export const selectArticleContentById = (state, articleId) =>
  state.articles.entities[articleId].content;

export default articlesSlice.reducer;
