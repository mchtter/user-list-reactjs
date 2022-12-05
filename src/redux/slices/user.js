import { createSlice } from "@reduxjs/toolkit";

export const user = {
  allUsersForSearch: {},
  user: {},
  users: [],
  pageData: {},
  currentPage: 1,
  loading: true,
  search: ""
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
    },
    setUsers(state, { payload }) {
      state.users = payload;
    },
    setPageData(state, { payload }) {
      state.pageData = payload;
    },
    setCurrentPage(state, { payload }) {
      state.currentPage = payload;
    },
    setLoading(state, { payload }) {
      state.loading = payload;
    },
    setSearch(state, { payload }) {
      state.search = payload;
    }
  },
});

export const reducer = userSlice.reducer;
export const actions = userSlice.actions;
