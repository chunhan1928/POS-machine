// 管理員介面（新增產品）

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
const CAT = "catagory";
const AMOUNT = "amount";
const PRICE = "price";
const COST = "cost";
const initialFormData = {
  [NAME]: '',
  [CAT]: '類別一',
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
    /*
    const newData = await axios.post('/manager/stock/new', {
      data: {
        cost: formData.cost,
        name: formData.name,
        catagory: formData.catagory,
        price: formData.price,
        amount: formData.amount,
      }
    });
    */

    // 以下暫時
    var newData = [
			{
				key: 1,
				id: 1,
				name: 'Product1',
				catagory: "類別一",
				amount: 10,
				price: 20,
				cost: 10,
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
      {
				key: 3,
				id: 3,
				name: 'Product3',
				catagory: "類別三",
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
    { name: '商品種類', index: "catagory", key: 'catVal' },
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