import { createSlice } from "@reduxjs/toolkit";

let initialState = {
  token: "",
  user: "",
};

const userSlice = createSlice({
  name: "usersSlice",
  initialState,
  reducers: {
    setToken(state, action) {
      state.token = action.payload;
    },
    setUser(state, action) {
      state.user = action.payload;
    },
  },
});

export const userSliceActions = userSlice.actions;

export default userSlice;
