import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // userInfo: localStorage.getItem('userInfo')
  //   ? JSON.parse(localStorage.getItem('userInfo'))
  //   : null,

  userDetail: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action) {
      // state.userInfo = action.payload;
      state.userDetail = action.payload;
      // localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
    clearCredentials(state) {
      // state.userInfo = null;
      // localStorage.removeItem('userInfo');

      state.userDetail = null;
    },
  },
});

export const authReducer = authSlice.reducer;

export const { setCredentials, clearCredentials } = authSlice.actions;
