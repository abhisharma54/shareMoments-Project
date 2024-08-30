import { Router } from "express";
import { verifyJWT } from '../middleware/auth.middleware.js'
import { togglePostLike, toggleCommentLike} from '../controllers/like.controller.js'

const router = Router();

router.route('/togglePost/:postId').post(verifyJWT, togglePostLike)
router.route('/toggleComment/:commentId').post(verifyJWT, toggleCommentLike)

export default router;