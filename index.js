import express from "express";
import http from 'http'
import bodyParser from "body-parser";
import dotenv from "dotenv";
import path from 'path';
import { fileURLToPath } from "url";
import { dirname } from "path";
import morgan from "morgan";
import dbConnect from "./models/dbConnect.js";
import cors from 'cors'
import authenticationRoutes from './routes/auth.routes.js'
import productRoutes from './routes/product.routes.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();
dbConnect.DBConnection();
const app = express();
const server = http.createServer(app);

app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const corsOptions = {
  origin: '*', 
  credentials: true,
  optionSuccessStatus: 200
}

app.use(express.static(path.resolve(__dirname, "build")));
app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "build", "index.html"));
});

app.use(cors(corsOptions));

app.use(morgan("dev"));


app.use('/auth', authenticationRoutes)
app.use('/products', productRoutes)

server.listen(process.env.PORT, () => {
  console.log(`Server is running on ${process.env.PORT}🚀 `);
});



