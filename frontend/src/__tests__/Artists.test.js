import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';
import Artists from '../pages/Artists';
import * as artistsSlice from '../store/slices/artistsSlice';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

jest.mock('../store/slices/artistsSlice', () => ({
  fetchArtists: jest.fn(),
}));

describe('Artists Component', () => {
  let store;

  beforeEach(() => {
    localStorage.setItem('token', 'test-token');
    localStorage.setItem('user', JSON.stringify({ name: 'Test User', email: 'test@example.com' }));

    store = mockStore({
      artists: {
        items: [
          {
            id: 1,
            name: 'Test Artist 1',
            listeners: 1000000,
            url: 'https://last.fm/artist1',
            image: 'https://example.com/image1.jpg',
          },
          {
            id: 2,
            name: 'Test Artist 2',
            listeners: 500000,
            url: 'https://last.fm/artist2',
            image: '',
          },
        ],
        loading: false,
        error: null,
      },
      auth: {
        user: { name: 'Test User', email: 'test@example.com' },
        token: 'test-token',
        isAuthenticated: true,
      },
    });

    artistsSlice.fetchArtists.mockReturnValue({ type: 'artists/fetchArtists/pending' });
  });

  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('renders artists page with user name', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Artists />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText(/Welcome, Test User/i)).toBeInTheDocument();
    expect(screen.getByText(/Top Last.fm Artists/i)).toBeInTheDocument();
  });

  test('displays artists list', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Artists />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('Test Artist 1')).toBeInTheDocument();
    expect(screen.getByText('Test Artist 2')).toBeInTheDocument();
    expect(screen.getByText('1,000,000 listeners')).toBeInTheDocument();
    expect(screen.getByText('500,000 listeners')).toBeInTheDocument();
  });

  test('displays loading state', () => {
    store = mockStore({
      artists: {
        items: [],
        loading: true,
        error: null,
      },
      auth: {
        user: { name: 'Test User' },
        token: 'test-token',
        isAuthenticated: true,
      },
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Artists />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText(/Loading artists.../i)).toBeInTheDocument();
  });

  test('displays error state', () => {
    store = mockStore({
      artists: {
        items: [],
        loading: false,
        error: 'Failed to fetch artists',
      },
      auth: {
        user: { name: 'Test User' },
        token: 'test-token',
        isAuthenticated: true,
      },
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Artists />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText(/Error: Failed to fetch artists/i)).toBeInTheDocument();
  });

  test('displays placeholder for artists without images', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Artists />
        </BrowserRouter>
      </Provider>
    );

    const placeholders = screen.getAllByText('T');
    expect(placeholders.length).toBeGreaterThan(0);
  });

  test('logout button clears localStorage', () => {
    delete window.location;
    window.location = { href: jest.fn() };

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Artists />
        </BrowserRouter>
      </Provider>
    );

    const logoutButton = screen.getByText(/Logout/i);
    logoutButton.click();

    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });
});
