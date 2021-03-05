import React, { ReactPropTypes as PropTypes, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchArticleByUrl, selectArticleById } from './articlesSlice';

const ArticlePage = ({ match }) => {
  const { articleId } = match.params;
  const dispatch = useDispatch();
  const article = useSelector((state) => selectArticleById(state, articleId));
  useEffect(() => {
    if (article) dispatch(fetchArticleByUrl(article));
  });

  const renderedArticle = (
    <div dangerouslySetInnerHTML={{ __html: article.content }} />
  );

  return (
    <div>
      <Link to="/">Go back</Link>
      {renderedArticle}
    </div>
  );
};
ArticlePage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      articleId: PropTypes.string,
    }),
  }).isRequired,
};

export default ArticlePage;
