import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { NEW_BOOK, ALL_BOOKS } from '../queries';

const NewBook = (props) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [published, setPublished] = useState('');
  const [genre, setGenre] = useState('');
  const [genres, setGenres] = useState([]);

  const [createBook] = useMutation(NEW_BOOK, {
    onError: (err) => {
      console.log('err: ', err);
      props.setError(err.graphQLErrors[0].message);
      setTimeout(() => {
        props.setError(null);
      }, 7000);
    },
    update: (store, response) => {
      props.updateCacheWith(response.data.addBook);
    },
  });

  const submit = async (event) => {
    event.preventDefault();

    createBook({
      variables: {
        title,
        author,
        published: Number(published),
        genres,
      },
    });

    setTitle('');
    setPublished('');
    setAuthor('');
    setGenres([]);
    setGenre('');
  };

  const addGenre = () => {
    setGenres(genres.concat(genre));
    setGenre('');
  };

  if (!props.show) {
    return null;
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            placeholder="title..."
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
            placeholder="author..."
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
            placeholder="year..."
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
            placeholder="genre..."
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  );
};

export default NewBook;
