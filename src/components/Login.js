import React from 'react';
import { getAuth } from 'firebase/auth';

import { attemptLogin } from '../firebase/firebaseConfig';

import '../styles/Login.css';

const Login = ({ onLogin }) => {
  const handleLogin = async (e) => {

    e.preventDefault();

    const username = e.target.username.value;
    const password = e.target.password.value;

    const uid = await attemptLogin(username, password);
    if (!uid) {
      alert('Login failed');
      return;
    }

    const auth = getAuth();
    await auth.currentUser.getIdTokenResult(true);

    onLogin(uid);

  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Σύνδεση</h2>
        <form onSubmit={handleLogin}>
          <input type="text" name="username" placeholder="Username" required />
          <input type="password" name="password" placeholder="Password" required />
          <button type="submit">Σύνδεση</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
