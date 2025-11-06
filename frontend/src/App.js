import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import store from './store';
import Login from './pages/Login';
import Artists from './pages/Artists';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

function TokenHandler() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const userParam = params.get('user');

    if (token && userParam) {
      console.log('Received token from Laravel:', token);
      console.log('Received user from Laravel:', userParam);

      localStorage.setItem('token', token);
      localStorage.setItem('user', userParam);

      console.log('Token stored in React localStorage:', localStorage.getItem('token'));
      console.log('User stored in React localStorage:', localStorage.getItem('user'));

      // Attempt to parse the user parameter as JSON; if parsing fails, use the raw string
      let userData;
      try {
        userData = JSON.parse(userParam);
      } catch (err) {
        userData = userParam;
      }

      // Dispatch user data to Redux store
      dispatch({ type: 'SET_USER', payload: userData });

      navigate('/artists', { replace: true });
    }
  }, [location, navigate, dispatch]);

  return null;
}

function App() {
  return (
    <Provider store={store}>
      <Router future={{ v7_startTransition: true }}>
        <TokenHandler />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/artists"
            element={
              <PrivateRoute>
                <Artists />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/artists" />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
