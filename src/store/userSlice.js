import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      
      // Also save to localStorage for persistence
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      
      // Clear localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
    // Load user from localStorage on app start
    loadUserFromStorage: (state) => {
      const user = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (user && token) {
        try {
          state.user = JSON.parse(user);
          state.token = token;
          state.isAuthenticated = true;
        } catch (error) {
          console.error('Error loading user from storage:', error);
        }
      }
    },
  },
});

export const { setCredentials, logout, loadUserFromStorage } = userSlice.actions;
export default userSlice.reducer;

// Selectors
export const selectCurrentUser = (state) => state.user.user;
export const selectToken = (state) => state.user.token;
export const selectIsAuthenticated = (state) => state.user.isAuthenticated;
