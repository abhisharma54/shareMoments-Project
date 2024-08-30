import { ApiError } from '../utils/apiError.js'
import { ApiResponse } from '../utils/apiResponse.js'
import { AsyncHandler } from '../utils/asyncHandler.js'
import jwt from 'jsonwebtoken'
import { userModel } from '../models/user.model.js'

export const verifyJWT = AsyncHandler( async function(req, _, next) {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization").replace("Bearer ", "")
        if(!token) throw new ApiError(402, "Unauthorized Request, Please Login!!");
    
        const verifiedToken = jwt.verify(token, process.env.ACCESS_TOKEN)
        
        const user = await userModel.findById(verifiedToken._id).select("-password -refreshToken")
        if(!user) throw new ApiError(401, "Invalid Access Token");
    
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Access Token");
    }
})