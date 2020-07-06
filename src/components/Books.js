import React, { useState } from 'react';
import { useQuery, NetworkStatus } from '@apollo/client';
import { ALL_BOOKS, ALL_GENRES } from '../queries';

const Books = (props) => {
  const [genre, setGenre] = useState('');
  const genresResult = useQuery(ALL_GENRES);
  const result = useQuery(ALL_BOOKS, {
    variables: { genre },
  });

  if (!props.show) {
    return null;
  }

  if (result.networkStatus === NetworkStatus.refetch) {
    return <div>Re-fetching information...</div>;
  }

  if (result.loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Books</h2>

      <table>
        <tbody>
          <tr>
            <th>title</th>
            <th>author</th>
            <th>published</th>
          </tr>
          {result.data.allBooks.map((b) => (
            <tr key={b.id}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {genresResult.data.allGenres.map((g) => (
          <button
            key={g}
            onClick={() => {
              setGenre(g);
              result.refetch();
            }}
          >
            {g}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Books;
