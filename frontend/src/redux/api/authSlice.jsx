import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  name: "",
  email: "",
  token: "",
  session: null, // 🆕 added this
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
   setUser: (state, action) => {
      const userData = action.payload;
    
      if (userData) {
        state.user = userData.user || userData;
        state.name = userData.user?.name || "";
        state.email = userData.user?.email || "";
    
        // ✅ Fix here
        state.token =
          userData.token ||
          userData.access_token ||
          userData.session?.access_token ||
          "";
    
        state.session = userData.session || null;
      } else {
        state.user = null;
        state.name = "";
        state.email = "";
        state.token = "";
        state.session = null;
      }
    },

    logOutUser: (state) => {
      state.user = null;
      state.name = "";
      state.email = "";
      state.token = "";
      state.session = null;
    },
  },
});

export const { setUser, logOutUser } = authSlice.actions;
export default authSlice.reducer;
