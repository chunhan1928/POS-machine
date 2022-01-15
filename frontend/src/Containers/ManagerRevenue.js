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
  const [showUntil, setShowUntil] = useState('');

  const updateRevenue = async () => {
    if (from === '' || until === '') {
      message.error('日期不得為空');
      return;
    } else if (from > until) {
      message.error('截止日期不得早於開始日期');
      return;
    }

    const { data: { result: result, revenuedata: responseData, total_revenue: overall_profit } } = await axios.get('/manager/revenue', {
      params: {
        from: new Date(from),
        until: new Date(until),
      },
    });
    console.log(result);
    console.log(responseData);
    if (result === false) {
      message.error('取得資料錯誤，請再次確認輸入資料');
      return;
    }
    else if (!responseData) {
      message.error('無資料');
      return;
    }
    let newData = [];
    for (var i = 0; i < responseData.length; i++) {
      var temp = {
        key: i,
        name: responseData[i].name,
        amount: responseData[i].amount,
        cost: responseData[i].cost,
        income: responseData[i].price,
        profit: responseData[i].revenue,
      }
      newData.push(temp);
    }
    console.log(newData);
    setShowData(newData);
    setShowOverall(overall_profit);
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
              onChange={(v) => {
                console.log(v);
                var new_v = v.toISOString();
                new_v = new_v.substr(0, new_v.indexOf('T')) + "T00:00:00.000z"
                console.log(new_v);
                setFrom(new_v);
              }}
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
              value={showUntil}
              onChange={(v) => {
                console.log(v);
                var new_v = v.toISOString();
                new_v = new_v.substr(0, new_v.indexOf('T'))
                var new_v1 = new_v + "T23:59:00.000z";
                console.log(new_v);
                setUntil(new_v1);
                setShowUntil(new_v);
              }}
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