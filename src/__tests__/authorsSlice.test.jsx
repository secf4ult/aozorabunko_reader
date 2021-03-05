/* eslint-disable */
import cheerio from 'cheerio'
import axios from 'axios'

axios.get('https://www.aozora.gr.jp/index_pages/person_all.html').then(({ data }) => {
  const $ = cheerio.load(data);
  const authors = [];
  $('li a', 'ol').each((_, el) => {
    const url = $(el).attr('href');
    const author = $(el).html();
    authors.push(decodeURI(author))
  });
  return Promise.resolve(authors)
}).then(authors => console.dir(authors))
