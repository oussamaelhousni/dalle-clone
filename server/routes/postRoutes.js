import express from "express";
import * as dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import Post from "../mongodb/models/post.js";

const router = express.Router();

dotenv.config();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// get app posts
router.route("/").get(async (req, res) => {
    try {
        const posts = await Post.find({});
        res.status(200).json({
            status: "success",
            data: posts,
        });
    } catch (error) {
        res.status(201).json({
            status: "error",
            message: error,
        });
    }
});

// create a post
router.route("/").post(async (req, res) => {
    try {
        const { name, prompt, photo } = req.body;
        const photoUrl = await cloudinary.uploader.upload(photo);
        const newPost = await Post.create({
            name,
            prompt,
            photo: photoUrl.url,
        });
        res.status(201).json({
            status: "success",
            data: newPost,
        });
    } catch (error) {
        res.status(201).json({
            status: "error",
            message: error,
        });
    }
});

export default router;
