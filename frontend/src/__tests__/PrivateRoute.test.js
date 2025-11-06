import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import PrivateRoute from '../components/PrivateRoute';

const mockStore = configureStore([]);

const RouterWrapper = ({ children }) => (
  <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    {children}
  </BrowserRouter>
);

describe('PrivateRoute Component', () => {
  test('renders children when authenticated', () => {
    localStorage.setItem('token', 'test-token');

    const store = mockStore({
      auth: {
        isAuthenticated: true,
        token: 'test-token',
      },
    });

    const { getByText } = render(
      <Provider store={store}>
        <RouterWrapper>
          <PrivateRoute>
            <div>Protected Content</div>
          </PrivateRoute>
        </RouterWrapper>
      </Provider>
    );

    expect(getByText('Protected Content')).toBeInTheDocument();
    localStorage.clear();
  });

  test('redirects to login when not authenticated', () => {
    localStorage.clear();

    const store = mockStore({
      auth: {
        isAuthenticated: false,
        token: null,
      },
    });

    const { queryByText } = render(
      <Provider store={store}>
        <RouterWrapper>
          <PrivateRoute>
            <div>Protected Content</div>
          </PrivateRoute>
        </RouterWrapper>
      </Provider>
    );

    expect(queryByText('Protected Content')).not.toBeInTheDocument();
  });
});
