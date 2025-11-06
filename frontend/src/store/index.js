import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import artistsReducer from './slices/artistsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    artists: artistsReducer,
  },
});

export default store;
