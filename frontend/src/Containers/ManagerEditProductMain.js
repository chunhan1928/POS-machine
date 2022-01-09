// 管理員介面（編輯產品）

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


const INDEX = "id";
const NAME = "name";
const CAT = "catagory";
const AMOUNT = "amount";
const PRICE = "price";
const COST = "cost";
const initialFormData = {
  [INDEX]: '',
  [NAME]: '',
  [CAT]: '',
  [AMOUNT]: '',
  [PRICE]: '',
  [COST]: '',
};

const ManagerEditProduct = ({ data, open, handleCloseEditProduct, setTableData, updateShowData, productClass }) => {
  // form data control
  const [formData, setFormData] = useState(initialFormData);

  const handleChangeFormData = (key, value) => {
    console.log("handle:", key, value);
    setFormData({
      ...formData,
      [key]: value,
    });
    console.log(formData);
  };

  const handleCreate = async () => {
    if (!Number.isInteger(parseInt(formData.amount)) && formData.amount !== '') {
      message.error("商品數量必須為整數");
      return;
    } else if (parseInt(formData.amount) < 0) {
      message.error("商品數量必須為非負數值");
      return;
    } else if (parseInt(formData.cost) < 0) {
      message.error("商品成本必須為非負數值");
      return;
    }

    const finalFormData = {
      [INDEX]: formData.id,
      [NAME]: formData.name,
      [CAT]: formData.catagory,
      [AMOUNT]: formData.amount,
      [PRICE]: formData.price,
      [COST]: formData.cost,
    };
    if (formData.id === '') finalFormData.id = data.id;
    if (formData.name === '') finalFormData.name = data.name;
    if (formData.catagory === '') finalFormData.catagory = data.catagory;
    if (formData.amount === '') finalFormData.amount = data.amount;
    if (formData.price === '') finalFormData.price = data.price;
    if (formData.cost === '') finalFormData.cost = data.cost;
    console.log(finalFormData);
    // send msg to backend
    /*
    const newData = await axios.post('/manager/stock/update', {
      id: finalFormData.id,
      data: {
        cost: finalFormData.cost,
        name: finalFormData.name,
        catagory: finalFormData.catagory,
        price: finalFormData.price,
        amount: finalFormData.amount,
      }
    });
    */
    // 以下暫時
    var newData = [
			{
				key: 1,
				id: 1,
				name: 'Product100',
				catagory: "類別一",
				amount: 1000,
				price: 2000,
				cost: 1000,
			},
			{
				key: 2,
				id: 2,
				name: 'Product2',
				catagory: "類別二",
				amount: 30,
				price: 40,
				cost: 10,
			},
		];
    // 以上暫時

    if (newData !== "") {
      setTableData(newData);
      updateShowData(newData, productClass);
      handleClose();
      message.success("產品修改成功");
    }
    else {
      message.error("產品修改錯誤");
    }
    console.log("send to backend:");
  };

  const handleClose = () => {
    // reset data
    setFormData(initialFormData);
    handleCloseEditProduct();
  };

  const recordData = [
    { name: '商品名稱', index: "name", value: data.name, key: 'nameVal' },
    { name: '商品種類', index: "catagory", value: data.catagory, key: 'catVal' },
    { name: '商品成本', index: "cost", value: data.cost, key: 'costVal' },
    { name: '商品定價', index: "price", value: data.price, key: 'priceVal' },
    { name: '商品數量', index: "amount", value: data.amount, key: 'amountVal' },
  ];
  const columns = [
    { title: '欄位', dataIndex: 'name', key: 'name', },
    { title: '數值', dataIndex: 'value', key: 'value', },
    {
      title: '編輯', dataIndex: 'edit', key: 'edit',
      render: (text, record) => (
        !(record.name === '商品種類') ?
          <Space size="small">
            <TextField
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
              <option value="類別一">類別一</option>
              <option value="類別二">類別二</option>
              <option value="類別三">類別三</option>
            </NativeSelect>
          </FormControl>
      ),
    },
  ];

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>修改產品資訊</DialogTitle>
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

export default ManagerEditProduct;