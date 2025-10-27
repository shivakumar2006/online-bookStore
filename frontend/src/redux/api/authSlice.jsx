import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null, 
    name: "",
    email: "",
    token: "",
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action) => {
            if (action.payload) {
                state.user = action.payload;
                state.name = action.payload?.name || "";
                state.email = action.payload.email || "";
                state.token = action.payload.token || "";
            } else {
                state.user = null; 
                state.name = "";
                state.email = "";
                state.token = "";
            }
        },
        logOutUser: (state) => {
            state.user = null;
            state.name = "";
            state.email = "";
            state.token = "";
        }
    }
})

export const { setUser, logOutUser } = authSlice.actions;
export default authSlice.reducer;