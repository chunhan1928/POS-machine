import mongoose from "mongoose";

const Schema = mongoose.Schema

const OrderSchema = new Schema({
    date: Date,
    name: String,
    cost: Number,
    price: Number,
    amount: Number
})

const Order = mongoose.model('order', OrderSchema);
export default Order;