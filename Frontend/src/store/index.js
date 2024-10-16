import { login, logout } from "./authSlice";
import { post, emptyPost } from "./postSlice";
import { comments, emptyComments } from "./commentSlice";
import { store, persistor } from "./store";

export {
    login,
    logout,
    post,
    emptyPost,
    comments,
    emptyComments, 
    store,
    persistor
}