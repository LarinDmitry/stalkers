import {configureStore, ThunkAction, Action} from '@reduxjs/toolkit';
import userReducer from 'store/userSlice';

export const reduxStore = configureStore({
  reducer: {
    user: userReducer,
  },
});

export type AppDispatch = typeof reduxStore.dispatch;
export type RootState = ReturnType<typeof reduxStore.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
