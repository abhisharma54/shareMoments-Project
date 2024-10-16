import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    commentData: null
}

const commentSlice = createSlice({
    name: "comment",
    initialState,
    reducers: {
        comments: (state, action) => {
            state.commentData = action.payload;
        },
        emptyComments: (state) => {
            state.commentData = null
        }
    }
})

export const { comments, emptyComments } = commentSlice.actions

export default commentSlice.reducer