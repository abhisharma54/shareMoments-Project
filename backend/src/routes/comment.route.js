import { Router } from 'express'
import { verifyJWT } from '../middleware/auth.middleware.js'
import { 
    createComment,
    updateComment, 
    deleteComment,
    getPostComment } from '../controllers/comment.controller.js';

const router = Router();

router.route('/c/:postId').post(verifyJWT, createComment)
router.route('/u/:commentId').patch(verifyJWT, updateComment)
router.route('/d/:commentId').delete(verifyJWT, deleteComment)
router.route('/getPostComment/:postId').get(verifyJWT, getPostComment)

export default router;