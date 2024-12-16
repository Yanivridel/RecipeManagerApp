import { configureStore } from '@reduxjs/toolkit';
import userReducer from '@/store/slices/userSlice'

const store = configureStore({
    reducer: {
        userLogged: userReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
    }),
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
