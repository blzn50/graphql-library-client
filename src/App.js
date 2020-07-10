import React, { useState, useEffect } from 'react';
import { useApolloClient, useLazyQuery, useSubscription } from '@apollo/client';
import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import Login from './components/Login';
import Recommendation from './components/Recommendation';
import { USER, ALL_BOOKS, BOOK_ADDED, ALL_AUTHORS } from './queries';

const App = () => {
  const [page, setPage] = useState('authors');
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);
  const [genre, setGenre] = useState('');
  const [getUser, userResult] = useLazyQuery(USER);
  const client = useApolloClient();

  const updateCacheWith = (addedBook) => {
    const includedIn = (set, object) => {
      set.map((p) => p.id).includes(object.id);
    };
    // For updating books
    const dataInStore = client.readQuery({ query: ALL_BOOKS, variables: { genre: '' } });
    if (!includedIn(dataInStore.allBooks, addedBook)) {
      client.writeQuery({
        query: ALL_BOOKS,
        variables: { genre: '' },
        data: {
          allBooks: dataInStore.allBooks.concat(addedBook),
        },
      });
    }

    // For updating authors
    const storeBooks = client.readQuery({ query: ALL_AUTHORS });
    if (!includedIn(storeBooks.allAuthors, addedBook.author)) {
      client.writeQuery({
        query: ALL_AUTHORS,
        data: {
          allAuthors: storeBooks.allAuthors.concat(addedBook.author),
        },
      });
    }
  };

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedBook = subscriptionData.data.bookAdded;
      window.alert(`${addedBook.title} added`);
      updateCacheWith(addedBook);
    },
  });

  useEffect(() => {
    const toks = localStorage.getItem('library-logged-user');
    if (toks) {
      setToken(toks);
    }
  }, []);

  useEffect(() => {
    if (userResult.data && userResult.data.me) {
      setGenre(userResult.data.me.favoriteGenre);
    }
  }, [userResult.data]);

  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
  };

  return (
    <div style={{ margin: 15 }}>
      {error && <div style={{ color: 'red', float: 'right' }}>{error}</div>}

      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token && <button onClick={() => setPage('add')}>add book</button>}
        {!token && <button onClick={() => setPage('login')}>login</button>}
        {token && (
          <button
            onClick={() => {
              setPage('recommend');
              getUser();
            }}
          >
            recommendation
          </button>
        )}
        {token && <button onClick={logout}>logout</button>}
      </div>

      <Authors token={token} show={page === 'authors'} />

      <Books show={page === 'books'} />

      <NewBook
        //  updateCacheWith={updateCacheWith}
        setError={setError}
        show={page === 'add'}
      />

      <Recommendation genre={genre} show={page === 'recommend'} />

      <Login setError={setError} setToken={setToken} show={page === 'login'} setPage={setPage} />
    </div>
  );
};

export default App;
