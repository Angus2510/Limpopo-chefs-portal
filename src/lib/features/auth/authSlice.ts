import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '@/lib/store';

interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  accessToken: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(
      state,
      action: PayloadAction<{
        accessToken: string;
      }>
    ) {
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
    },
    logout(state) {
      state.accessToken = null;
      state.isAuthenticated = false;
    },
    setCredentials(
      state,
      action: PayloadAction<{
        accessToken: string;
      }>
    ) {
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = !!action.payload.accessToken;
    },
  },
});

export const { loginSuccess, logout,setCredentials } = authSlice.actions;

export const handleLogin =
  (accessToken: string): AppThunk =>
  async (dispatch) => {
    console.log('LOGIN TRUE!!');
    console.log(accessToken);
    dispatch(loginSuccess({ accessToken }));
};


export default authSlice.reducer;