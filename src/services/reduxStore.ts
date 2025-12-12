import {configureStore, ThunkAction, Action} from '@reduxjs/toolkit';
import userReducer from 'store/userSlice';
import dataReducer from 'store/dataSlice';

export const reduxStore = configureStore({
  reducer: {
    user: userReducer,
    data: dataReducer,
  },
});

export type AppDispatch = typeof reduxStore.dispatch;
export type RootState = ReturnType<typeof reduxStore.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
