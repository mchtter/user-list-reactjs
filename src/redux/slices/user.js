import { createSlice } from "@reduxjs/toolkit";

export const user = {
  allUsersForSearch: [],
  user: {},
  users: [],
  loading: true,
};

const userSlice = createSlice({
  name: "user",
  initialState: user,
  reducers: {
    setAllUsersForSearch(state, action) {
      state.allUsersForSearch = action.payload;
    },

    setUser(state, { payload }) {
      state.user = payload;
      state.loading = false;
    },
    setUsers(state, { payload }) {
      state.users = payload;
      state.loading = false;
    },
    setLoading(state, { payload }) {
      state.loading = payload;
    },
  },
});

export const reducer = userSlice.reducer;
export const actions = userSlice.actions;
