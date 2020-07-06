import React, { useState, useEffect } from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import { USER, ALL_BOOKS } from '../queries';

const Recommendation = ({ show, genre }) => {
  const booksResult = useQuery(ALL_BOOKS, {
    variables: { genre },
  });

  if (!show) {
    return null;
  }

  return (
    <div>
      <h2>Recommendations</h2>
      {booksResult.loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <p>
            Books in your favorite genre: <strong>{genre}</strong>
          </p>

          <table>
            <tbody>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Published</th>
              </tr>
              {booksResult.data.allBooks.map((b) => (
                <tr key={b.id}>
                  <td>{b.title}</td>
                  <td>{b.author.name}</td>
                  <td>{b.published}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Recommendation;
