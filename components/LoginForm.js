import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import api from '../utils/api';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { dispatch } = useAppContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await api.post('/login', { email, password });
      localStorage.setItem('token', response.data.token);
      dispatch({ type: 'SET_USER', payload: response.data.user });
    } catch (error) {
      setError('Invalid email or password');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        placeholder="Password"
      />
      {error && <p className="error">{error}</p>}
      <button type="submit">Login</button>
    </form>
  );
}
