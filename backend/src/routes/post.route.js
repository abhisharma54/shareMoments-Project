import { Router } from "express";
import {
    createPost,
    editPost,
    deletePost,
    getUserPosts
} from '../controllers/post.controller.js'
import { verifyJWT } from '../middleware/auth.middleware.js'
import { upload } from '../middleware/multer.middleware.js'

const router = Router();

router.route('/create').post(verifyJWT, upload.single("postImage"), createPost)
router.route('/edit/:postId').patch(verifyJWT, editPost)
router.route('/delete/:postId').delete(verifyJWT, deletePost)
router.route('/getUserPosts/:userId').get(verifyJWT, getUserPosts)

export default router;