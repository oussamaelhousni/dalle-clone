import express from "express";
import morgan from "morgan";
import cors from "cors";
import * as dotenv from "dotenv";
import connectDB from "./mongodb/connect.js";
import postRoutes from "./routes/postRoutes.js";
import dalleRoutes from "./routes/dalleRoutes.js";

dotenv.config();

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(cors());
app.use(morgan("dev"));

app.use("/api/v1/post", postRoutes);
app.use("/api/v1/dalle", dalleRoutes);
app.get("/", async (req, res) => {
    res.send("hi from server");
});

const startServer = async (PORT) => {
    try {
        await connectDB(process.env.MONGODB_URL);
        app.listen(PORT, () => {
            console.log("server has started on PORT ", PORT);
        });
    } catch (error) {}
};

startServer(8080);
