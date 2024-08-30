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
        }
    }
})

export const { post } = postSlice.actions

export default postSlice.reducer