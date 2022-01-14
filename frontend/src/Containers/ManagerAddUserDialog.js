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

const ManagerAddUser = ({ open, handleCloseAddUser, setTableData }) => {
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPriviledge, setNewPriviledge] = useState("manager");

  const HandlerCreateUser = async () => {
    const { data: { result: result, userdata: returnData } } = await axios.post('/manager/user/create', {
      username: newUsername,
      password: newPassword,
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
    handleCloseAddUser();
    setNewUsername('');
    setNewPassword('');
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
      <Dialog open={open} >
        <DialogTitle>新增用戶</DialogTitle>
        <DialogContent>
          <TextField
            error={!newUsername}
            autoFocus
            margin="normal"
            label="請輸入用戶名稱"
            fullWidth
            variant="standard"
            value={newUsername}
            onChange={(e) => { setNewUsername(e.target.value) }}
            helperText={"此欄位不得為空！"}
          />
          <TextField
            error={!newPassword}
            margin="normal"
            label="請輸入用戶密碼"
            fullWidth
            variant="standard"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            helperText={"此欄位不得為空！"}
            multiline
          />
          <TextField
            error={!newPriviledge}
            margin='normal'
            select
            fullWidth
            label="請輸入用戶權限"
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

export default ManagerAddUser;