import { Router } from "express";
import { 
    registerUser,
    loginUser,
    logoutUser,
    updateAccountDetails,
    getCurrentUser,
    changePassword,
    newRefreshedAccessToken,
    uploadAvatar,
    uploadCoverImage,
    getUserProfile,
    getAllPosts,
 } from "../controllers/user.controller.js";
 import { verifyJWT } from '../middleware/auth.middleware.js'
 import { upload } from '../middleware/multer.middleware.js'
const router = Router();

router.route('/register').post(registerUser);

// secured routes
router.route('/login').post(loginUser);
router.route('/logout').get(verifyJWT ,logoutUser);
router.route('/update-userDetails/:userId').patch(verifyJWT ,updateAccountDetails);
router.route('/getCurrent-user').get(verifyJWT ,getCurrentUser);
router.route('/password-change').patch(verifyJWT ,changePassword);
router.route('/refreshed-accessToken').get(verifyJWT ,newRefreshedAccessToken);
router.route('/upload-avatar').patch(verifyJWT, upload.single("avatar"), uploadAvatar) 
router.route('/upload-coverImage').patch(verifyJWT, upload.single("coverImage"), uploadCoverImage) 
router.route('/c/:username').get(verifyJWT ,getUserProfile);
router.route('/getAllPosts').get(verifyJWT ,getAllPosts);

export default router