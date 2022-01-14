import express from "express"
import mongoose from 'mongoose'
import Order from '../../Schema/Order'
import User from '../../Schema/User'
import Stock from '../../Schema/Stock'
import bcrypt from 'bcrypt'

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
router.post('/stock/update', (req,res) => {
    console.log("Update Stock");
    // get data from req
    var reqdata = req.body.data;
    var name = req.body.data.name;
    var oldName = req.body.oldName;
    // console.log(name, oldName, reqdata);
    // mongodb
    var myDB = mongoose.connection;
    var query = {"name": oldName};
    // console.log(query);
    // var data1 = {name:"item1",category:"tmp",price:33,cost:33,amount:33}

    // check existance and update stock entry
    myDB.collection("stocks").findOne(query, async function(err,doc){
        if(err || doc == null){
            console.log("Error / No such stock.")
            res.send({ result: false, stockdata:[]})
        }
        else{
            console.log(`Update ${oldName}`)
            // wait for the entry to be update
            let tmp = await myDB.collection("stocks").findOneAndUpdate(query, {$set : {
                name: reqdata.name, 
                category: reqdata.category,
                cost: reqdata.cost,
                price: reqdata.price,
                category: reqdata.category,
                amount: reqdata.amount
            }}) 

            // wait for all data to be retrive 
            let data = await myDB.collection('stocks').find({}).toArray();
            if(data == null){
                res.send({result:false, stockdata: []});
            }
            else{
                res.send({result: true, stockdata: data});
            }
        }
    })
})

// DONE
router.post('/stock/new', (req,res) => {
    console.log("Add Stock");
    // get data from req
    var data = req.body.data;
    var name = data.name;
    // console.log(data, name);
    // var data = {name:"----",category:"tmp",price:33,cost:33,amount:33}

    // mongodb
    var myDB = mongoose.connection;
    var query = {"name": name};

    // check existance and add stock entry
    myDB.collection("stocks").findOne(query, async function(err,doc){
        if(doc == null){
            console.log("Add new entry.")
            const newEntry = new Stock({
                name: data.name,
                category: data.category,
                cost: data.cost,
                price: data.price,
                amount: data.amount
            });
            console.log(newEntry);

            let tmp = await myDB.collection("stocks").insertOne(newEntry);
            myDB.collection('stocks').find({}).toArray( function(err,result){
                    if(err || result == null){
                        res.send({result:false, stockdata: []});
                    }
                    else{
                        res.send({result:true, stockdata: result});
                    }
                });
        }
        else{
            console.log("Item exist.")
            res.send({ result: false, stockdata:[]})
        }
    })
})

// DONE
router.post('/stock/delete', (req,res) => {
    console.log("Delete Stock");
    // get data from req
    var name = req.body.name;

    // mongodb
    var myDB = mongoose.connection;
    var query = {"name": name};
    // check existance and add stock entry
    myDB.collection("stocks").findOne(query, async function(err,doc){
        if(err || doc == null){
            console.log("Error / No such stock.")
            res.send({ result: false, stockdata:[]})
        }
        else{
            console.log(`Delete ${name}`)
            let tmp = await myDB.collection("stocks").findOneAndDelete(query)
            myDB.collection('stocks').find({}).toArray( function(err,result){
                if(err || result == null){
                    res.send({result:false, stockdata: []});
                }
                else{
                    res.send({result:true, stockdata: result});
                }
            });
        }
    })
})

// DONE
router.get('/revenue', async (req,res) => {
    console.log("Revenue");
    // const from = req.body.from;
    // const to = req.body.to;    
    const from = req.query.from;
    const to = req.query.until;

    // mongodb
    var myDB = mongoose.connection;
    var query = {"date": {$gte: new Date(from), $lte: new Date(to)}};
    console.log(query);
    // get orders between interval
    let orders = await myDB.collection("orders").find(query).toArray();
    console.log(orders);
    // no order in given interval
    if(orders === []){
        res.send({result:false, revenuedata: []});
    }
    // process order data
    else{
        var resdata = []
        orders.map( (order) => {
            // check if the item exist in res data
            var index = resdata.findIndex(tmp => tmp.name === order.name)
            // create and add
            if(index < 0){
                resdata.push({
                    name: order.name,
                    amount: order.amount,
                    cost: order.cost * order.amount,
                    price: order.price * order.amount,
                    revenue: order.price * order.amount - order.cost * order.amount
                })
            }
            // find and update
            else{
                console.log(resdata[index])
                resdata[index].amount = resdata[index].amount + order.amount; 
                resdata[index].cost = resdata[index].cost + order.cost * order.amount;
                resdata[index].price = resdata[index].price + order.price * order.amount;
                resdata[index].revenue = resdata[index].price - resdata[index].cost;
                console.log("changed ",resdata[index])
            }
        } )

        var total = 0;
        for (var i = 0; i < resdata.length; i++) {
            total = total + resdata[i].revenue;
        }
        console.log(resdata);
        res.send({result:true, revenuedata: resdata, total_revenue: total});
    }
})

// DONE
router.post('/create', async  (req,res)=>{
    console.log("Create User");
    const username = req.body.username;
    const password = req.body.password;
    const priviledge = req.body.priviledge;

    // mongodb
    var myDB = mongoose.connection;
    var query = {name: username};
    // get orders between interval
    let exist = await myDB.collection("users").find(query).toArray();
    console.log(exist)
    if(exist == []){
        console.log("User existed")
        res.send({result:false});
    }
    else{
        console.log(`create user ${username}`)
        const saltRounds = 10;
        bcrypt.genSalt(saltRounds, function(err,salt){
            bcrypt.hash(password,salt, async function(err,hash){
                await myDB.collection("users").insertOne({name:username, password: hash, priviledge: priviledge})
                res.send({result: true})
            })
        })
    }

})
    


module.exports = router;