import express from "express"
import mongoose from 'mongoose'
import Order from '../../Schema/Order'
import User from '../../Schema/User'
import Stock from '../../Schema/Stock'
const router = express.Router();

// DONE
router.post('/update_pwd',(req,res) => {
    console.log("Update Password");
    // get data from req
    var username = req.body.username;
    var old_pwd = req.body.old_password;
    var new_pwd = req.body.new_password;

    // mongodb
    var myDB = mongoose.connection;
    var query = {"name": username, "password": old_pwd};
    // check user existance and update password 
    myDB.collection('users').findOne(query, async function(err,doc){
        // not found
        if (err || doc == null){
            console.log("Update Failed.");
            res.send("Failed");
        }
        // found
        else{
            console.log(`Update User ${req.body.name} password.`);
            let tmp = await myDB.collection("users").findOneAndUpdate(query,{$set:{password: new_pwd}});
            res.send("Success")
        }
    })
})

// DONE
router.post('/order', async (req,res) => {
    console.log("Add order.")
    // get data from req
    var date = req.body.date;
    var orders = req.body.orders;
    // var orders = [{name: "item1", amount: 2},{name: "1111", amount: 4},]


    var myDB = mongoose.connection;
    var newEntry = []

    // get all stock data
    const tmp = await myDB.collection("stocks").find({}).toArray();

    for (var item of orders){
        console.log("item")
        var query = {name: item.name};
        let stock = tmp.find(o => o.name === item.name);
        var update = {$set:{amount: stock.amount-item.amount}}

        var entry = await new Order({
            date: new Date(date),
            name: item.name,
            cost: stock.cost,
            price: stock.price,
            amount: item.amount
        })
        
        // kept Order entry 
        newEntry.push(entry);   
 
        // update the stock
        let updated = await myDB.collection("stocks").findOneAndUpdate(query,update,{new:true})
        console.log("updated")
        console.log("-------------------------")
    } 

    // insert all orders to db
    let insertOrder = await myDB.collection("orders").insertMany(newEntry);
    
   
})

module.exports = router;