// 管理員介面（Revenue）
import { useState } from 'react'
import axios from '../api.js';
import { Table, Button, message } from 'antd'
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DatePicker from "@mui/lab/DatePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import TextField from "@mui/material/TextField";


const ManagerRevenue = () => {
  const [showData, setShowData] = useState([]);
  const [showOverall, setShowOverall] = useState(0);
  const [from, setFrom] = useState('');
  const [until, setUntil] = useState('');

  const updateRevenue = async () => {
    if (from === '' || until === '') {
      message.error('日期不得為空');
      return;
    } else if (from > until) {
      message.error('截止日期不得早於開始日期');
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
      <div>
        <span style={{ width: 400, margin: 10 }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="開始日期"
              value={from}
              onChange={(v) => setFrom(v)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  margin="dense"
                  error={!from}
                  helperText={"開始日期不得為空"}
                />
              )}
            />
          </LocalizationProvider>
        </span>
        <span style={{ width: 400, margin: 10 }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="截止日期"
              value={until}
              onChange={(v) => setUntil(v)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  margin="dense"
                  error={!until}
                  helperText={"截止日期不得為空"}
                />
              )}
            />
          </LocalizationProvider>
        </span>
        <Button type="primary" style={{ margin: 25 }} onClick={(e) => {
          e.stopPropagation();
          updateRevenue();
        }}> 查詢
        </Button>
      </div>
      <Table
        columns={revenueColumns} dataSource={showData} footer={() => '期間總淨利：' + showOverall} size="small" style={{ width: '100%' }} />
    </>
  )
};

export default ManagerRevenue;