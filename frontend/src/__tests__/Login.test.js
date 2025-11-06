import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';
import Login from '../pages/Login';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Login Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      auth: {
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders login form', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText(/Last.fm Artists/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
  });

  test('displays error message when present', () => {
    store = mockStore({
      auth: {
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: 'Invalid credentials',
      },
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
  });
});
