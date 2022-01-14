// 管理員介面（Revenue）
import { useState } from 'react'
import axios from '../api.js';
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import MenuItem from "@mui/material/MenuItem";
import Button from '@mui/material/Button';
import { message } from 'antd';

const ManagerEditUserDialog = ({ oldusername, open, handleCloseEditUser, setTableData }) => {
  const [newPriviledge, setNewPriviledge] = useState("manager");

  const HandlerCreateUser = async () => {
    const { data: { result: result, userdata: returnData } } = await axios.post('/manager/user/update', {
      username: oldusername,
      priviledge: newPriviledge,
    })
    // Success
    if (result) {
      message.success("註冊成功！");
      HandlerClose();
      setTableData(returnData)
    }
    else {
      message.error("註冊失敗！");
    }
  };

  const HandlerClose = () => {
    handleCloseEditUser();
    setNewPriviledge('');
  };

  const priviledge = [
    {
      value: "manager",
      label: "管理者（Manager）",
    },
    {
      value: "clerk",
      label: "普通使用者（Waiter）",
    },
  ]

  return (
    <>
      <Dialog open={open}>
        <DialogTitle>修改用戶：{oldusername}</DialogTitle>
        <DialogContent>
          <TextField
            error={!newPriviledge}
            margin='normal'
            select
            fullWidth
            label="請選擇新權限"
            value={newPriviledge}
            onChange={(e) => setNewPriviledge(e.target.value)}
          >
            {priviledge.map((obj) => (
              <MenuItem key={obj.value} value={obj.value}>{obj.label}</MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
        <Button onClick={HandlerClose}>取消</Button>
        <Button variant="contained" onClick={HandlerCreateUser}>確定</Button>
      </DialogActions>
      </Dialog>
    </>
  )
};

export default ManagerEditUserDialog;