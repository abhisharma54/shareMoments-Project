import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    postData: null
}

const postSlice = createSlice({
    name: "post",
    initialState,
    reducers: {
        post: (state, action) => {
            state.postData = action.payload;
        },
        emptyPost: (status) => {
            status.postData = null
        }
    }
})

export const { post, emptyPost } = postSlice.actions

export default postSlice.reducer