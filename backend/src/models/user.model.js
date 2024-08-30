import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userSchema = new Schema(
    {
    fullname: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
    },
    bio: {
        type: String,
    },
    avatar: {
        type: {
            public_id: String,
            url: String
        }
    },
    coverImage: {
        public_id: String,
        url: String
    },
    refreshToken: String,
    allPosts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        }
    ]
    },
    {timestamps: true}
)

userSchema.pre("save", async function(next) {
    if(this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10)
    }
    next();
})

userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
        },
        process.env.ACCESS_TOKEN
    )
}

userSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
        {_id: this._id},
        process.env.REFRESH_TOKEN
    )
}

export const userModel = mongoose.model("User", userSchema)




// Hello Users, How are you all doing. This is my first website, where you can upload your thoughts and share your best moments of your life. Trust God, Follow your dream, work hard and go forward with a positive attitude.