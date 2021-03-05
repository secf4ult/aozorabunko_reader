import React from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './app/store';

import icon from '../assets/icon.svg';
import './App.global.css';

import AuthorList from './features/authors/AuthorList';
import AuthorPage from './features/authors/AuthorPage';
import ArticlePage from './features/articles/ArticlePage';

export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route exact path="/articles/:articleId" component={ArticlePage} />
          <Route exact path="/authors/:authorId" component={AuthorPage} />
          <Route exact path="/" component={AuthorList} />
        </Switch>
      </Router>
    </Provider>
  );
}
