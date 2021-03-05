/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  fetchArticlesByAuthor,
  selectAuthorArticles,
  selectAuthorById,
} from './authorsSlice';

const AuthorPage = ({ match }) => {
  const { authorId } = match.params;
  const dispatch = useDispatch();
  const author = useSelector((state) => selectAuthorById(state, authorId));
  const authorArticles = useSelector((state) =>
    selectAuthorArticles(state, authorId)
  );

  useEffect(() => {
    if (author) {
      dispatch(fetchArticlesByAuthor(author));
    }
  }, []);

  let renderedAuthorArticles;
  if (authorArticles && authorArticles.length > 0) {
    renderedAuthorArticles = authorArticles.map((a) => (
      <li key={a.title}>
        <Link to={`/articles/${a.id}`}>{a.title}</Link>
      </li>
    ));
  } else {
    renderedAuthorArticles = <div>Loading...</div>;
  }
  return (
    <>
      <h1>{author && author.name}</h1>
      <div>
        <ul>{renderedAuthorArticles}</ul>
      </div>
      <Link to="/">Back to home</Link>
    </>
  );
};

export default AuthorPage;
