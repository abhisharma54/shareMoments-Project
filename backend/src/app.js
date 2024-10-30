import dotenv from "dotenv";
import express from "express";
import cookieParser from 'cookie-parser'
import { connectDB } from "./dbConnect/db.connect.js";
import cors from 'cors'

dotenv.config({ path: "./.env" });

const app = express();

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(cookieParser());
app.use(cors({
  origin: 'http://share-moments-project.vercel.app',
  credentials: true,
}))


//++++++++++++++++++++++++++++++++++++++++++++++++
import userRouter from "./routes/user.route.js";
import postRouter from "./routes/post.route.js"
import commentRouter from "./routes/comment.route.js"
import likeRouter from "./routes/like.route.js"

app.use('/api/v1/users', userRouter)
app.use('/api/v1/posts', postRouter)
app.use('/api/v1/comments', commentRouter)
app.use('/api/v1/likes', likeRouter)




connectDB()
.then(() => {
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Server is running at port http://localhost:${port}`);
  });
})
.catch((err) => {
    console.log("MONGODB CONNECTION FAILED::", err);
})