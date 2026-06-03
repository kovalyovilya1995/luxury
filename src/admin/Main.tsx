import { useState } from 'react';

import { Home } from './components/Home';
import { Login } from './components/Login';

export const Main = () => {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem('pepe'));

  const handleAuth = () => {
    setIsAuth(true);
    localStorage.setItem('pepe', '1');
  };

  return (
    <>
      {isAuth && <Home />}
      {!isAuth && <Login onAuth={handleAuth} />}
    </>
  );
};
