// 前台
import { useEffect, useState } from 'react';
import axios from '../api';
import Title from '../Components/Title'
import CashierPwd from './CashierPwd'
import { Layout, Button, Menu} from 'antd';
import { PropertySafetyOutlined, ShoppingCartOutlined } from "@ant-design/icons";

import ItemList from './ItemList';

const { Header, Content, Footer } = Layout;

const Cashier = ({me, data, logout, displayStatus}) => {
  const [stockdata,setStockdata] = useState(data); // all stock data
  const [categories, setCategories] = useState([]); // all categories
  const [curCategory,setCurCategory] = useState("主食"); // current selected category idex on menu
  const [cartItems,setCartItems] = useState([]); // the items in cart
  const [total,setTotal] = useState(0) // total price
  const [openCashierPwd, setOpenCashierPwd] = useState(false) // the cashier password dialog is no or not

  // if stock data is changed, due to possible new item, update category
  useEffect(() => {
    let uniqueCategories = [...new Set(stockdata.map(item => item.category))]; // collect all categories from items, and use Set to remove the duplicate ones
    uniqueCategories.sort();
    setCategories([...uniqueCategories])
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
    console.log("Change category to ", newCategory)
    setCurCategory(newCategory);
  }

  // add item to cart
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
  const HandlerClear = () => {
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
  // open and close password dialog
  const HandlerCloseCashierPwd = () => {
    setOpenCashierPwd(false);
  };
  const HandlerOpenCashierPwd = () => {
    setOpenCashierPwd(true);
  };

  // make an order
  const HandlerOrder = async () => {
    if(window.confirm(`總金額是${total}元，請收款後再送出訂單\n確定送出訂單？`)){
      // collect orders
      var orders = []
      for (var i = 0; i < cartItems.length; i++) {
        orders.push({name:cartItems[i].name, amount: cartItems[i].amount});
      };
      console.log(orders);
      // record date and time
      var UTCTime = new Date()
      var timeZoneOffset = UTCTime.getTimezoneOffset();
      var localTime = new Date(UTCTime.getTime() - (timeZoneOffset*60*1000))
      var timeString = localTime.toISOString();
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
  }

  return (
    <>
      <Layout style={{width: '95vw'}}>
        <Header style={{height: '10vh'}}>
          <Title style={{ color: 'white', height: '5vw' }}>
            <div style={{ textAlign: 'center', width: '100%', fontSize: '28px', fontWeight: 'bold' }}><PropertySafetyOutlined /> 收銀員介面</div>
            <div style={{ textAlign: 'center', width: '20%', fontSize: '20px' }}>{me}</div>
            <Button style={{ textAlign: 'right' }} onClick={HandlerOpenCashierPwd}>修改密碼</Button>
            <Button style={{ textAlign: 'right' }} onClick={logout}>登出</Button>
          </Title>
        </Header>
        <Content style={{height: '85vh', display: 'flex'}}>
            {/* left side: sum up the ordered item */}
            <div style={{width:'30%', height: '100%', display: 'flex', flexDirection: 'column'}}>
              {/* cart item list */}
              <div style={{height: '65%', width: '100%', overflowY: 'scroll', fontSize: '1.5vmax'}}>
                {cartItems.map((item, index) => (
                  <div style={{display:'flex', border: '0.1vmin solid', margin: 5}} onClick={()=>{HandlerDelete(index)}}>
                    {/* <h3>{item.name+"\t\t"+item.amount+"份\t\t"+item.price*item.amount+"元"}</h3> */}
                    <p style={{width: "33%"}} >{item.name}</p>
                    <p style={{width: "33%"}}>{item.amount+"份"}</p>
                    <p style={{width: "34%"}}>{item.price*item.amount+"元"}</p>
                  </div>
                ))}
              </div>
              {/* current total price */}
              <div style={{height: '15%', width: '100%', backgroundColor: '#FEC601'/* yellow */, fontSize: '5vmin', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <ShoppingCartOutlined />總金額：{total}元
              </div>
              {/* delete order and send order */}
              <div style={{height: '20%', display: 'flex'}}>
                {/* delete order */}
                <div style={{width: '50%', backgroundColor: '#FD4521'/* red */, fontSize: '5vmin', display: 'flex', alignItems: 'center', justifyContent: 'center'}}  onClick={HandlerClear}>
                  刪除訂單
                </div>
                <div style={{width: '50%', backgroundColor: '#5FAD41'/* green */, fontSize: '5vmin', display: 'flex', alignItems: 'center', justifyContent: 'center'}} onClick={HandlerOrder}>
                  送出訂單
                </div>
              </div>
            </div>
            {/* right side: menu and item */}
            <div style={{width:'70%', height: '100%', backgroundColor: '#F1D9A7' /* wheat */}}>
              {/* menu */}
              <Menu defaultSelectedKeys="主食" mode="horizontal">
                {/* {categories.map( (category, index) => (
                  <Menu.Item key={index} onClick={() => {HandlerCategories(index)}}>{category}</Menu.Item>
                ))} */}
                <Menu.Item key="主食" onClick={() => {HandlerCategories("主食")}}>主食</Menu.Item>
                <Menu.Item key="副餐" onClick={() => {HandlerCategories("副餐")}}>副餐</Menu.Item>
                <Menu.Item key="飲料" onClick={() => {HandlerCategories("飲料")}}>飲料</Menu.Item>
              </Menu>
              {/* item */}
              <div style={{display: 'inline-flex', flexWrap: 'wrap',alignContent: 'flex-start', overflowY: 'scroll', width: '100%', height: '90%'}}>
                <ItemList 
                  data={stockdata}
                  category={curCategory}
                  handler={HandlerItem}
                />
              </div>
            </div>
        </Content>
        <Footer style={{ textAlign: 'center', height: '5vh' }}>POS Machine ©2022 Created by NTU CSIE</Footer>
      </Layout>
      {/* cashier change password */}
      <CashierPwd
        me={me}
        open={openCashierPwd}
        HandlerCloseCashierPwd={HandlerCloseCashierPwd} 
        displayStatus={displayStatus}
      />
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