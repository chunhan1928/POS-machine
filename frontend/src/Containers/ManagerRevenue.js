// 管理員介面（Revenue）
import { useState } from 'react'
import axios from '../api.js';
import { Table, Button, Input, message } from 'antd'
import { RightSquareOutlined, LeftSquareOutlined } from "@ant-design/icons";


const ManagerRevenue = () => {
  const [showData, setShowData] = useState([]);
  const [showOverall, setShowOverall] = useState(0);
  const [from, setFrom] = useState('');
  const [until, setUntil] = useState('');

  const updateRevenue = async () => {
    if (from === '' || until === '') {
      message.error('日期不得為空');
      return;
    }
    /*
    const { response } = await axios.get('/manager/revenue', {
      params: {
        from: from,
        until: until,
      },
    });
    */
    // 以下為暫時資料
    var response = {
      data: [
        { name: 'P1', amount: 100, totol_cost: 800, totol_income: 1000, totol_profit: 200 },
        { name: 'P2', amount: 76, totol_cost: 860, totol_income: 1560, totol_profit: 287 },
        { name: 'P3', amount: 500, totol_cost: 7900, totol_income: 8900, totol_profit: 345 },
      ],
      overall_profit: 5670,
    }
    // 以上為暫時資料
    var newData = [];
    for (var i = 0; i < response.data.length; i++) {
      var temp = {
        key: i,
        name: response.data[i].name,
        amount: response.data[i].amount,
        cost: response.data[i].totol_cost,
        income: response.data[i].totol_income,
        profit: response.data[i].totol_profit,
      }
      newData.push(temp);
    }
    console.log(newData);
    setShowData(newData);
    setShowOverall(response.overall_profit);
  };

  const revenueColumns = [
    { title: '商品名稱', dataIndex: 'name', key: 'name', },
    { title: '銷售數量', dataIndex: 'amount', key: 'amount', },
    { title: '商品總成本', dataIndex: 'cost', key: 'cost', },
    { title: '商品總收入', dataIndex: 'income', key: 'income', },
    { title: '商品總淨利', dataIndex: 'profit', key: 'profit', },
  ];


  return (
    <>
      <Input
        prefix={<LeftSquareOutlined style={{ margin: 5 }} />}
        value={from}
        onChange={(e) => setFrom(e.target.value)}
        placeholder="開始日期（YYYY-MM-DD）"
        size="large" style={{ width: 260, margin: 0 }}
      />
      <Input
        prefix={<RightSquareOutlined style={{ margin: 5 }} />}
        value={until}
        onChange={(e) => setUntil(e.target.value)}
        placeholder="結束日期（YYYY-MM-DD）"
        size="large" style={{ width: 260, margin: 10 }}
      />
      <Button type="primary" style={{ margin: 10 }} onClick={(e) => {
        e.stopPropagation();
        updateRevenue();
      }}> 查詢
      </Button>
      <Table 
        columns={revenueColumns} dataSource={showData} footer={() => '期間總淨利：' + showOverall} size="small" style={{ width: '100%' }} />
    </>
  )
};

export default ManagerRevenue;