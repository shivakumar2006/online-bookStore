import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  name: "",
  email: "",
  token: "",
  session: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const userData = action.payload;

      if (userData) {
        // ✅ Support both JWT + Supabase user shapes
        const user = userData.user || userData;
        state.user = user;
        state.name = user.name || user.user_metadata?.name || "";
        state.email = user.email || user.user_metadata?.email || "";

        // ✅ Choose the right token source
        state.token =
          userData.token ||
          userData.access_token ||
          userData.session?.access_token ||
          "";

        state.session = userData.session || null;

        // ✅ Persist to localStorage for JWT users
        if (!user.app_metadata) {
          localStorage.setItem("token", state.token);
          localStorage.setItem("user", JSON.stringify(state.user));
        }
      } else {
        // 🧹 Reset state
        state.user = null;
        state.name = "";
        state.email = "";
        state.token = "";
        state.session = null;
        localStorage.clear();
      }
    },

    logOutUser: (state) => {
      state.user = null;
      state.name = "";
      state.email = "";
      state.token = "";
      state.session = null;
      localStorage.clear();
    },

    restoreUserFromStorage: (state) => {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      if (storedToken && storedUser) {
        const parsedUser = JSON.parse(storedUser);
        state.user = parsedUser;
        state.token = storedToken;
        state.name = parsedUser.name || "";
        state.email = parsedUser.email || "";
      }
    },
  },
});

export const { setUser, logOutUser, restoreUserFromStorage } = authSlice.actions;
export default authSlice.reducer;
