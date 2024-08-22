import { configureStore } from "@reduxjs/toolkit";
import { userApiSlice } from "../slices/userApiSlice";
import { taskApiSlice } from "../slices/taskApiSlice";
// import authSliceReducer from "../slices/authSlice";

const store = configureStore({
  reducer: {
    [userApiSlice.reducerPath]: userApiSlice.reducer,
    [taskApiSlice.reducerPath]: taskApiSlice.reducer,
    // auth: authSliceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      userApiSlice.middleware,
      taskApiSlice.middleware
    ),
  devTools: true,
});

export default store;
