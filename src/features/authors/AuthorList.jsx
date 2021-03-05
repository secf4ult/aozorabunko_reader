import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  fetchAuthors,
  prevPageAuthors,
  nextPageAuthors,
  selectPageAuthors,
} from './authorsSlice';

const AuthorList = () => {
  const dispatch = useDispatch();
  const authors = useSelector(selectPageAuthors);
  const initialFetch = useSelector((state) => state.authors.initialFetch);

  useEffect(() => {
    if (initialFetch) dispatch(fetchAuthors());
  }, []);

  let content;
  if (authors.length !== 0) {
    content = authors.map((author) => {
      return (
        <ul key={author.name}>
          <Link to={`/authors/${author.id}`}>{author.name}</Link>
        </ul>
      );
    });
  } else {
    content = <div className="loading">Loading...</div>;
  }

  return (
    <div>
      <h1>青空文庫</h1>
      <div>{content}</div>
      <button type="button" onClick={() => dispatch(prevPageAuthors())}>
        Prev Page
      </button>
      <button type="button" onClick={() => dispatch(nextPageAuthors())}>
        Next Page
      </button>
    </div>
  );
};

export default AuthorList;
