import express from "express"
import mongoose from 'mongoose'
import Order from '../../Schema/Order'
import User from '../../Schema/User'
import Stock from '../../Schema/Stock'
const router = express.Router();

// DONE
// DONE
router.post('/update_pwd',(req,res) => {
    console.log("Update Password");
    // get data from req
    var username = req.body.username;
    var old_pwd = req.body.old_password;
    var new_pwd = req.body.new_password;

    // mongodb
    var myDB = mongoose.connection;
    var query = {"name": username};

     // check user exist 
     myDB.collection('users').findOne(query, function(err,doc){
        // User not found
        if (err || doc == null){
            console.log("User not found");
            res.send("Failed");
        }
        // found
        else{

            // check old password
            bcrypt.compare(old_pwd, doc.password, async function(err, result){
                // Success, password match 
                if(result){
                    console.log(`Pwd match.`);
                    bcrypt.genSalt(saltRounds, function(err,salt){
                        bcrypt.hash(new_pwd,salt, async function(err,hash){
                            await myDB.collection("users").findOneAndUpdate({name:username}, {$set:{password: hash}})
                            res.send("Success")
                        })
                    })
                }
                // Authentication failed
                else{
                    console.log("not match")
                    res.send("Failed")
                }
            })  
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
        console.log(new Date(date));
        // kept Order entry 
        newEntry.push(entry);   
 
        // update the stock
        let updated = await myDB.collection("stocks").findOneAndUpdate(query,update,{new:true})
        console.log("updated")
        console.log("-------------------------")
    } 

    // insert all orders to db
    let insertOrder = await myDB.collection("orders").insertMany(newEntry);
    
    // wait for all data to be retrive 
    let data = await myDB.collection('stocks').find({}).toArray();
    if(data == null){
        res.send({result:false, stockdata: []});
    }
    else{
        res.send({result: true, stockdata: data});
    }
})

module.exports = router;