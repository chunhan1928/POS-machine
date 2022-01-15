// 管理員介面（新增產品）
import axios from '../api';
import { useState } from "react";
import { Table, Space } from 'antd'
import { message } from 'antd'
// mui
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';

const NAME = "name";
const CAT = "category";
const AMOUNT = "amount";
const PRICE = "price";
const COST = "cost";
const initialFormData = {
  [NAME]: '',
  [CAT]: '主食',
  [AMOUNT]: '',
  [PRICE]: '',
  [COST]: '',
};

const ManagerAddProduct = ({ open, handleCloseAddProduct, setTableData, updateShowData, productClass }) => {
  // form data control
  const [formData, setFormData] = useState(initialFormData);
  const [displayError, setDisplayError] = useState(false);

  const handleChangeFormData = (key, value) => {
    setDisplayError(false);
    setFormData({
      ...formData,
      [key]: value,
    });
    // console.log(formData);
  };

  const handleCreate = async () => {
    if (Object.values(formData).some((v) => !v)) {
      setDisplayError(true);
      return;
    }
    if (!Number.isInteger(parseInt(formData.cost))) {
      message.error("商品成本必須為整數");
      return;
    } else if (!Number.isInteger(parseInt(formData.price))) {
      message.error("商品定價必須為整數");
      return;
    } else if (!Number.isInteger(parseInt(formData.amount))) {
      message.error("商品數量必須為整數");
      return;
    } else if (parseInt(formData.amount) < 0) {
      message.error("商品數量必須為非負數值");
      return;
    } else if (parseInt(formData.cost) < 0) {
      message.error("商品成本必須為非負數值");
      return;
    }
    console.log(formData);
    // send msg to backend
    const returnData = await axios.post('/manager/stock/new', {
      data: formData
    });

    let { result: result, data: { stockdata: newData } } = returnData;
    if (result == false) {
      message.error("產品新增錯誤");
      return;
    }
    if (newData !== "") {
      console.log(newData);
      setTableData(newData);
      if (updateShowData(newData, productClass) === false) {
        message.error("產品新增錯誤");
        return;
      }
      handleClose();
      message.success("產品新增成功");
    }
    else message.error("產品新增錯誤");
    console.log("send to backend");
  };

  const handleClose = () => {
    // reset data
    setFormData(initialFormData);
    handleCloseAddProduct();
  };

  const recordData = [
    { name: '商品名稱', index: "name", key: 'nameVal' },
    { name: '商品種類', index: "category", key: 'catVal' },
    { name: '商品成本', index: "cost", key: 'costVal' },
    { name: '商品定價', index: "price", key: 'priceVal' },
    { name: '商品數量', index: "amount", key: 'amountVal' },
  ];
  const columns = [
    { title: '欄位', dataIndex: 'name', key: 'name', },
    {
      title: '填入新增資訊', dataIndex: 'edit', key: 'edit',
      render: (text, record) => (
        !(record.name === '商品種類') ?
          <Space size="small">
            <TextField
              error={displayError && !formData[record.index]}
              autoFocus
              margin="dense"
              label={record.name}
              fullWidth
              variant="standard"
              value={formData[record.index]}
              onChange={(e) => handleChangeFormData(record.index, e.target.value)}
            />
          </Space> :
          <FormControl fullWidth>
            <NativeSelect
              value={formData[record.index]}
              onChange={(e) => handleChangeFormData(record.index, e.target.value)}
            >
              <option value="主食">主食</option>
              <option value="副餐">副餐</option>
              <option value="飲料">飲料</option>
            </NativeSelect>
          </FormControl>
      ),
    },
  ];

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>新增產品資訊</DialogTitle>
      <DialogContent>
        <Table columns={columns} dataSource={recordData} size="small" onClick={() => console.log("table")} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>取消</Button>
        <Button onClick={handleCreate}>確定</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ManagerAddProduct;