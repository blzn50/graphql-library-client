import React from 'react';
import { gql, useQuery } from '@apollo/client';

const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      id
    }
  }
`;

function App() {
  const result = useQuery(ALL_AUTHORS);

  if (result.loading) return <div>Loading...</div>;

  return (
    <div>
      <div>
        {result.data.allAuthors.map((a) => (
          <div key={a.id}>
            <p>{a.name}</p>
            <p>{a.born}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
