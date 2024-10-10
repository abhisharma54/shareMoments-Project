import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import authReducer from './authSlice'
import postSlice from './postSlice'
import commentSlice from './commentSlice'

const persistConfig = {
    key: 'root',
    storage,
}

const rootReducer = combineReducers({
    users: authReducer,
    posts: postSlice,
    comments: commentSlice,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: false,
        })
})

export const persistor = persistStore(store)