import express from "express"
import mongoose from 'mongoose';
import dotenv from "dotenv-defaults";
import app from './Route'

// connect mongo db
dotenv.config();
mongoose.connect(
    process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;

// create server
const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log
    (`Server listening on: http://localhost:${port}`);
})
    
