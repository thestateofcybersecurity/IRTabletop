import React, { useState } from 'react';

export default function LoginForm({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [mfaCode, setMfaCode] = useState(''); // New state for MFA code
  const [mfaRequired, setMfaRequired] = useState(false); // New state to track if MFA is required

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();

        if (data.mfaRequired) {
          setMfaRequired(true); // Show MFA input
        } else {
          onLogin(data);
        }
      } else {
        console.error('onLogin is not a function', onLogin); // Debugging log
        throw new Error('onLogin is not a function');
      }
    } catch (error) {
      console.error('Login error:', error); // Debugging log
      setError(error.message || 'Invalid email or password');
    }
  };

  const handleMfaSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/verify-mfa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, mfaCode }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token); // Store the token
        onLogin({token: data.token, user: {email}}); // Call onLogin with token and basic user details
      } else {
        const errorData = await response.json();
        // ... handle MFA verification error
      }
    } catch (error) {
      // ... handle error
    }
  }
  
  return (
     <div>
      {mfaRequired ? (
        <form onSubmit={handleMfaSubmit}>
          <input
            type="text"
            placeholder="MFA Code"
            value={mfaCode}
            onChange={(e) => setMfaCode(e.target.value)}
            required
          />
          <button type="submit">Verify MFA</button>
        </form>
      ) : (
        <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      {error && <p className="error">{error}</p>}
      <button type="submit">Login</button>
        </form>
      )}
    </div>
  );
}
