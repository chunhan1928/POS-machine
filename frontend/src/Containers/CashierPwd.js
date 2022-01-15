// 管理員介面（修改密碼）
import axios from '../api';
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
// mui
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

const TITLE = "title";
const CONTENT = "content";
const CONTENT2 = "content2";

const initialFormData = {
  [TITLE]: "",
  [CONTENT]: "",
  [CONTENT2]: "",
};

export default function ManagerPwd({ me, open, HandlerCloseCashierPwd, displayStatus }) {
  // form data control
  const [formData, setFormData] = useState(initialFormData);
  const [displayError, setDisplayError] = useState(false);

  const handleChangeFormData = (key, value) => {
    setDisplayError(false);
    setFormData({
      ...formData,
      [key]: value,
    });
  };

  const handleCreate = async () => {
    if (Object.values(formData).some((v) => !v)) {
      setDisplayError(true);
      return;
    }
    if (formData.content !== formData.content2) {
      displayStatus({
        type: "error",
        msg: "請再次確認新密碼",
      })
      return;
    }

    // sned msg to backend
    const { data: changeSuccess } = await axios.post('/manager/update_pwd', {
      username: me,
      old_password: formData.title,
      new_password: formData.content,
    });

    if (changeSuccess === "Success") {
      handleClose();
      displayStatus({
        type: "success",
        msg: "密碼修改成功",
      })
    }
    else {
      displayStatus({
        type: "error",
        msg: "舊密碼輸入有誤",
      })
    }
    console.log("send to backend:", uuidv4(), formData.title, formData.content);
  };

  const handleClose = () => {
    // reset data
    setFormData(initialFormData);
    HandlerCloseCashierPwd();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>修改密碼：{me}</DialogTitle>
      <DialogContent>
        <TextField
          error={displayError && !formData[TITLE]}
          autoFocus
          margin="dense"
          label="請輸入舊密碼"
          fullWidth
          variant="standard"
          value={formData[TITLE]}
          onChange={(e) => handleChangeFormData(TITLE, e.target.value)}
          helperText={displayError && "此欄位不得為空！"}
        />
        <TextField
          error={displayError && !formData[CONTENT]}
          margin="dense"
          label="請輸入新密碼"
          fullWidth
          variant="standard"
          value={formData[CONTENT]}
          onChange={(e) => handleChangeFormData(CONTENT, e.target.value)}
          helperText={displayError && "此欄位不得為空！"}
          multiline
        />
        <TextField
          error={displayError && !formData[CONTENT2]}
          margin="dense"
          label="請再次確認新密碼"
          fullWidth
          variant="standard"
          value={formData[CONTENT2]}
          onChange={(e) => handleChangeFormData(CONTENT2, e.target.value)}
          helperText={displayError && "此欄位不得為空！"}
          multiline
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleCreate}>Create</Button>
      </DialogActions>
    </Dialog>
  );
}