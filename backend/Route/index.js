import express from "express"
import cors from 'cors'
import Front from './Api/Front'  
import Manager from './Api/Manager'  
import bodyParser from "body-parser";
import mongoose from 'mongoose'

const app = express();

app.use(cors());
app.use(bodyParser.json());

// DONE
app.get('/login', (req,res) => {
    console.log("Login Authentication.");
    // get user data from req
    var username = req.query.user;
    var password = req.query.password;
    
    // mongodb
    var myDB = mongoose.connection;
    var query = { "name": username, "password": password };
    // check user exist 
    myDB.collection('users').findOne(query, async function(err,doc){
        // not found
        if (err || doc == null){
            console.log("User not found");
            res.send({logged: false, priviledge: false, stockdata:[]});
        }
        // found, User sign in
        else{
            console.log(`User ${username} sign in.`);

            // get stock data
            let data = await myDB.collection("stocks").find({}).toArray();
            console.log(data);
            if (doc.priviledge === "manager"){
                console.log("Priviledged user.")
                res.send({logged: true, priviledge: true, stockdata: data })
            }
            else{
                console.log("Not Priviledged user.")
                res.send({logged: true, priviledge: false, stockdata: data })
            }
        }
    })
})

app.use('/front',Front);
app.use('/manager',Manager);

export default app;
