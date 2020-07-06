import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN } from '../queries';

const Login = ({ setError, setToken, setPage, show }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [login, result] = useMutation(LOGIN, {
    onError: (err) => {
      setError(err.graphQLErrors[0].message);
      setTimeout(() => {
        setError(null);
      }, 3500);
    },
  });

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value;
      setToken(token);
      localStorage.setItem('library-logged-user', token);
      setPage('authors');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result.data]);

  const handleLogin = async (e) => {
    e.preventDefault();
    login({ variables: { username, password } });
    setUsername('');
    setPassword('');
  };

  if (!show) {
    return null;
  }

  return (
    <div>
      <h2>login</h2>
      <form onSubmit={handleLogin}>
        <div>
          Username <input value={username} onChange={({ target }) => setUsername(target.value)} />
        </div>
        <div>
          Password{' '}
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
