import { combineSlices, configureStore } from '@reduxjs/toolkit';
import imageSlice from './images/imageSlice';
import albumSlice from './albums/albumSlice';
import tagSlice from './tags/tagSlice';


const store = configureStore({
    reducer: combineSlices(
        imageSlice,
        albumSlice,
        tagSlice
    ),
});


export default store;
export type StoreType = ReturnType<typeof store.getState>
export type AppDispatch= typeof store.dispatch
