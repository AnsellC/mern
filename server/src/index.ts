import express from 'express';
import bodyparser from 'body-parser';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
app.use(bodyparser.json());
console.log(process.env.JWT_SECRET);

app.listen(3000, () => console.log('App started.'));
