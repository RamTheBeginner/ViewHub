import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import mongoose from "mongoose"
import authRoutes from "./routes/AuthRoutes.js"
import contactRoutes from "./routes/ContactRoutes.js"

dotenv.config();

const app = express();
const port = process.env.PORT || 8747;
const databaseURL  = process.env.DATABASE_URL

app.use(cors({
    origin: process.env.ORIGIN,  // Ensure this matches the frontend origin without the trailing slash
    methods: ["GET" , "POST" , "PUT" , "PATCH" , "DELETE"], // REST API Methods
    credentials: true,
}))
app.use('/uploads/profiles', express.static('uploads/profiles'));
app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/contacts" , contactRoutes);

const server = app.listen(port , () => {
    console.log({port})
    console.log(`Server is running at http://localhost:${port}`)
})

mongoose.connect(databaseURL)
  .then(() => {
    console.log("DB Connection successful");
  })
  .catch(err => {
    console.log(err.message);
  });
