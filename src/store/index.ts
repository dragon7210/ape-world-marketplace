import { configureStore } from '@reduxjs/toolkit'
import collectionSlice from 'actions/collections'
import loadingSlice from 'actions/loading'

export const store = configureStore({
    reducer: {
        collections: collectionSlice,
        loading: loadingSlice
    },
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch