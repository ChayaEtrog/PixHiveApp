import { combineSlices, configureStore } from '@reduxjs/toolkit';
import imageSlice from './images/imageSlice';
import albumSlice from './albums/albumSlice';


const store = configureStore({
    reducer: combineSlices(
        imageSlice,
        albumSlice,
    ),
});

export default store;
export type StoreType = ReturnType<typeof store.getState>
export type AppDispatch= typeof store.dispatch
