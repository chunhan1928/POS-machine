// 前台
// TODO: 整形、改密碼功能、某些handler需要pop out
import { Layout, Button, Menu} from 'antd';
import Title from '../Components/Title'
import { PropertySafetyOutlined } from "@ant-design/icons";
import { useEffect, useState } from 'react';
import axios from '../api';

import ItemList from './ItemList';

const { Header, Content, Footer } = Layout;

const Cashier = ({me, data,logout}) => {
  const [stockdata,setStockdata] = useState(data); // all stock data
  const [categories, setCategories] = useState([]); // all categories
  const [curCategory,setCurCategory] = useState(0); // current selected category idex on menu
  const [cartItems,setCartItems] = useState([]); // the items in cart
  const [total,setTotal] = useState(0) // total price

  // if stock data is changed, due to possible new item, update category
  useEffect(() => {
    let uniqueCategories = [...new Set(stockdata.map(item => item.category))]; // collect all categories from items, and use Set to remove the duplicate ones
    uniqueCategories.sort();
    setCategories([...uniqueCategories])
    console.log("cashier", categories)
  },[stockdata]);

  // if cart item list is changed, total price should change too
  useEffect(() => {
    if(cartItems === []){
      setTotal(0)
    }
    else{
      let price = cartItems.map(item => item.price * item.amount);
      var sum=0;
      for (var i = 0; i < price.length; i++) {
          sum += price[i];
      };
      setTotal(sum)
    }
  },[cartItems])
  
  // switch categories in menu
  const HandlerCategories = (newCategory) => {
    console.log("Change category to ", categories[newCategory])
    setCurCategory(newCategory);
  }

  // add item to cart
  // TODO: a pop out for order cancel
  const HandlerItem = (name, price, amount) => {
    var updateItem = stockdata.find(obj => {return obj.name === name})

    var input = window.prompt("Input amount: ",1);
    console.log(input)
    if(input === null || input === "" || parseInt(input) < 1 || parseInt(input) > updateItem.amount){
      if(input === null){

      }
      else{
        alert(`Please input amount between 1 ~ ${updateItem.amount}`)
      }
    }
    else{
      amount = parseInt(input);
      console.log(`order add to chart:  ${name} ${amount}份 ${price}元`)

      console.log(updateItem)
      updateItem.amount = updateItem.amount - amount;
      console.log(updateItem)
      var newdata = stockdata.map(x => x.name === name ? updateItem : x)
      console.log(newdata)
      setStockdata([...newdata]);
      var tmp = {name:name, price:price, amount:amount}
      setCartItems([...cartItems,tmp])
    }
   
  }

  // delete the order
  const HandelrClear = () => {
    var newdata = stockdata;
    var tmpCart = cartItems;
    for (var i = 0; i < cartItems.length; i++) {
      var tmpItem = tmpCart[i];
      var index = stockdata.findIndex((obj => obj.name === tmpItem.name));
      newdata[index].amount = newdata[index].amount + tmpItem.amount; 
    };
    setStockdata([...newdata]);
    setCartItems([]);
  }
  const HandlerDelete = (index) => {
    var item = cartItems[index];
    console.log(index)
    console.log(cartItems)

    var newdata = stockdata;
    var objIndex = newdata.findIndex((obj => obj.name === item.name));
    newdata[objIndex].amount = newdata[objIndex].amount + item.amount;
    setStockdata([...newdata])

    var newlist = cartItems;
    newlist.splice(index,1);
    console.log(newlist)
    setCartItems([...newlist])
  }

  // make an order
  // TODO: a pop out to change amount
  const HandlerOrder = async () => {
    // collect orders
    var orders = []
    for (var i = 0; i < cartItems.length; i++) {
      orders.push({name:cartItems[i].name, amount: cartItems[i].amount});
    };
    console.log(orders);
    // record date and time
    var currentTime = new Date()
    var timeString = currentTime.toISOString();
    console.log(timeString);
    // send to backend
    const {data: {result, stockdata}} = await axios.post( '/front/order',{
        date: timeString,
        orders: orders,
    })
    // see response, set stock data and cart items
    console.log(result);
    setStockdata(stockdata);
    setCartItems([]);
  }

  return (
    <>
      <Layout style={{width: '95vw'}}>
        <Header style={{height: '10vh'}}>
          <Title style={{ color: 'white', height: '5vw' }}>
            <div style={{ textAlign: 'center', width: '100%', fontSize: '28px', fontWeight: 'bold' }}><PropertySafetyOutlined /> 收銀員介面</div>
            <div style={{ textAlign: 'center', width: '20%', fontSize: '20px' }}>{me}</div>
            <Button style={{ textAlign: 'right' }} onClick={logout}>登出</Button>
          </Title>
        </Header>
        <Content style={{height: '85vh', display: 'flex'}}>
            {/* left side: sum up the ordered item */}
            <div style={{width:'30%', height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: 'white'}}>
              {/* cart item list */}
              <div style={{height: '65%', width: '100%', fontSize: '20px', overflowY: 'scroll', backgroundColor: 'red'}}>
                {cartItems.map((item, index) => (
                  <div style={{backgroundColor: 'blue', margin: 10}}
                    onClick={()=>{HandlerDelete(index)}}
                  >
                    <h3>{item.name+"  "+item.amount+"份     "+item.price*item.amount+"元"}</h3>
                  </div>
                ))}
              </div>
              {/* current total price */}
              <div style={{height: '15%', width: '95%', backgroundColor: 'orange', margin: 10}}>
                {total}
              </div>
              {/* delete order and send order */}
              <div style={{height: '20%', display: 'flex'}}>
                {/* delete order */}
                <div style={{width: '50%', backgroundColor: 'yellow'}}  onClick={HandelrClear}>
                  刪除訂單
                </div>
                <div style={{width: '50%', backgroundColor: 'green'}} onClick={HandlerOrder}>
                  送出訂單
                </div>
              </div>
            </div>
            {/* right side: menu and item */}
            <div style={{width:'70%', height: '100%', backgroundColor: 'silver'}}>
              {/* menu */}
              <Menu defaultSelectedKeys="0" mode="horizontal">
                {categories.map( (category, index) => (
                  <Menu.Item key={index} onClick={() => {HandlerCategories(index)}}>{category}</Menu.Item>
                ))}
              </Menu>
              {/* item */}
              <div style={{display: 'inline-flex', flexWrap: 'wrap',alignContent: 'flex-start', overflowY: 'scroll', width: '100%', height: '90%'}}>
                <ItemList 
                  data={stockdata}
                  category={categories[curCategory]}
                  handler={HandlerItem}
                />
              </div>
            </div>
        </Content>
        <Footer style={{ textAlign: 'center', height: '5vh' }}>POS Machine ©2022 Created by NTU CSIE</Footer>
      </Layout>
    </>
  )
};

export default Cashier;

// for debug
/*
const respondeTrial = {
  logger: true,
  priviledge: false,
  stockdata:[
    // {name: "", category: "", cost: 0, price: 0, amount: 0}
    {name: "珍奶", category: "飲料", cost: 30, price: 60, amount: 7},
    {name: "滷肉飯", category: "飯", cost: 15, price: 30, amount: 30},
    {name: "滷蛋", category: "小菜", cost: 5, price: 15, amount: 3},
    {name: "魯菜盤", category: "小菜", cost: 20, price: 50, amount: 30},
    {name: "燙青菜", category: "小菜", cost: 20, price: 30, amount: 25},
    {name: "大魯麵", category: "麵", cost: 40, price: 65, amount: 77},
    {name: "嘴邊肉", category: "小菜", cost: 40, price: 75, amount: 4},
    {name: "荷包蛋", category: "小菜", cost: 7, price: 15, amount: 50},
    {name: "炒飯", category: "飯", cost: 45, price: 70, amount: 24}
  ]
}
*/