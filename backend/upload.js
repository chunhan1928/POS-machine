import orderModel from "./Schema/Order";
import stockModel from "./Schema/Stock";
import userModel from "./Schema/User";

const orderExample = [
    // {date: Date(), name: "", cost: 0, price: 0, amount: 0}
    {date: new Date("2021-12-02T05:51:04.360Z"), name: "珍奶", cost: 30, price: 60, amount: 2},
    {date: new Date("2021-12-01T03:32:10.360Z"), name: "燙青菜", cost: 20, price: 30, amount: 1}
]
const stockExample = [
    // {name: "", category: "", cost: 0, price: 0, amount: 0}
    {name: "珍奶", category: "飲料", cost: 30, price: 60, amount: 7},
    {name: "滷肉飯", category: "主食", cost: 15, price: 30, amount: 30},
    {name: "滷蛋", category: "副餐", cost: 5, price: 15, amount: 3},
    {name: "魯菜盤", category: "副餐", cost: 20, price: 50, amount: 30},
    {name: "燙青菜", category: "副餐", cost: 20, price: 30, amount: 25},
    {name: "大魯麵", category: "主食", cost: 40, price: 65, amount: 77},
    {name: "嘴邊肉", category: "副餐", cost: 40, price: 75, amount: 4},
    {name: "荷包蛋", category: "副餐", cost: 7, price: 15, amount: 50},
    {name: "炒飯", category: "主食", cost: 45, price: 70, amount: 24}
]
const userExample = [
    // {name: "", password: "", priviledge: ""}
    {name: "admin", password: "0000", priviledge: "manager"},
    {name: "clerk1", password: "haha", priviledge: "clerk"},
    {name: "clerk2", password: "QQ", priviledge: "clerk"}
]

const dataInit = async () => {
    const checkOrder = await orderModel.find();
    const checkStock = await stockModel.find();
    const checkUser = await userModel.find();
    if (checkOrder.length !== 2 && process.env.TEST === "true") {
        await orderModel.deleteMany({});
        await orderModel.insertMany(orderExample);
        console.log("order database initialized!");
    }
    if(checkStock.length !== 9 && process.env.TEST === "true") {
        await stockModel.deleteMany({});
        await stockModel.insertMany(stockExample);
        console.log("stock database initialized!");
    }
    if(checkUser.length !== 3 && process.env.TEST === "true") {
        await userModel.deleteMany({});
        await userModel.insertMany(userExample);
        console.log("user database initialized!");
    }
};
  
export { dataInit };