import express from "express";
const app = express();
import morgan from "morgan";
import {  } from "cookie-parser";
import { config } from "dotenv";

config();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

export default app;