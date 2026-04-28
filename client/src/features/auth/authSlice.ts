import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";

interface AuthState {
  token: string | null;
}

const initialState: AuthState = { token: null };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ accessToken: string }>) => {
      state.token = action.payload.accessToken;
    },
    logout: (state) => {
      state.token = null;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
export const selectCurrentToken = (state: RootState) => state.auth.token;
// 3. The selector takes RootState, not "the slice's state"

// export const selectCurrentToken = (state: RootState) => state.auth.token;
// //                                       ^^^^^^^^^^^^^^^   ^^^^^^^^^^^^^^^
// //                                       whole store state    drill into auth
