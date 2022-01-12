import mongoose from "mongoose";

const Schema = mongoose.Schema

const StockSchema = new Schema({
    name: String,
    category: String,
    cost: Number,
    price: Number,
    amount: Number
})

const Stock = mongoose.model('stock', StockSchema);
export default Stock;