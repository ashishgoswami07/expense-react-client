import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./redux/user/reducers.js";

export const store = configureStore({
    reducer: {
        userDetails: userReducer,
    },
})