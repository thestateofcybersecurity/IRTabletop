import React, { useState } from 'react';
import { useRouter } from 'next/router';

export default function RegistrationForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const [name, setName] = useState(''); // New state for name
  const [mfaQR, setMfaQR] = useState(''); // New state for MFA QR code

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, name }), // Include name in request
      });

          if (response.ok) {
        const data = await response.json();
        onRegister(data); // Pass MFA QR code to parent component
        setMfaQR(data.mfaQR); // Set the MFA QR code state
      } else {
        const errorData = await response.json();
        throw new Error(data.error || 'Registration failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/index'); // Redirect to dashboard or home page
    } catch (error) {
      setError(error.message || 'Error during registration');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        required
      />
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
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
      <button type="submit">Register</button>
      {mfaQR && (
        <div>
          <p>Scan this QR code with your authenticator app:</p>
          <img src={mfaQR} alt="MFA QR Code" />
        </div>
      )}
    </form>
  );
}
