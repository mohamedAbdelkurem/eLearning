// Express & parsers
import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
// Type ORM
import { createConnection } from "typeorm";

// Middleweare
import trim from "./middlewears/trim";

//Routes
import authRoutes from "./routes/auth";
import lessonRoutes from "./routes/lessons";
import subRoutes from "./routes/subs";
//import bookmarkRouters from "./routes/bookmarks";
import userRoutes from "./routes/users";
import statesRoutes from "./routes/states";
import articleRoutes from "./routes/articles";
import bookRoutes from "./routes/books";
import productRoutes from "./routes/products";
import quizRoutes from "./routes/quiz";
import reportsRoutes from "./routes/reports";
//
import cookieParser from "cookie-parser";

import fileUpload from "express-fileupload";
// Init Express App
dotenv.config();
const app = express();

//
app.use(express.json());
app.use(morgan("dev"));
app.use(trim);
app.use(cookieParser());
app.use(fileUpload());

//
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000"],
  })
);
// main route

//
app.use(express.static("public"));
app.get("/", function (_, res) {
  res.send("express server");
});

app.use("/api/auth", authRoutes);
app.use("/api/posts", lessonRoutes);
app.use("/api/subs", subRoutes);
app.use("/api/states", statesRoutes);
app.use("/api/users", userRoutes);
app.use("/api/article", articleRoutes);
app.use("/api/products", productRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/quizes", quizRoutes);
app.use("/api/reports", reportsRoutes);

// Connect Server & DB
const PORT = process.env.PORT;

app.listen(PORT, async () => {
  console.log(`server running at http://localhost:${PORT} `);
  try {
    await createConnection();
    console.log("database connected");
  } catch (error) {
    console.log(error);
  }
});
