// 管理員介面（Revenue）
import { useState } from 'react'
import axios from '../api.js';
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from '@mui/material/Button';

const ManagerAddUser = ({displayStatus}) => {
    const [newUsername, setNewUsername] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPriviledge, setNewPriviledge] = useState("manager");

    const HandlerCreateUser = async () => {
        const {data: {result}} = await axios.post( '/manager/create',{
            username: newUsername,
            password: newPassword,
            priviledge: newPriviledge,
        })
        // Success
        if(result){
            displayStatus({
				type: "success",
				msg: "註冊成功！",
			})
        }
        else{
            displayStatus({
				type: "error",
				msg: "註冊失敗！",
			})
        }
    }

    const HandlerUsername = (name) => {
        setNewUsername(name);
    }

    const HandlerPassword = (pass) => {
        setNewPassword(pass);
    }

    const HandlerPriviledge = (privi) => {
        setNewPriviledge(privi);
    }

    const priviledge = [
        {
            value: "manager",
            label:"Manager",
        },
        {
            value: "front",
            label: "Waiter",
        },
    ]

    return (
        <>
             <Box
                component="form"
                noValidate
                autoComplete="off"
                >
                <div>
                    <TextField
                        //   error={displayError && !formData[TITLE]}
                        autoFocus
                        margin="normal"
                        label="請輸入用戶名稱"
                        fullWidth
                        variant="standard"
                        value={newUsername}
                        onChange={(e) => {HandlerUsername(e.target.value)}}
                        helperText={"此欄位不得為空！"}
                    />

                    <TextField
                        //   error={displayError && !formData[CONTENT]}
                        margin="normal"
                        label="請輸入用戶密碼"
                        fullWidth
                        variant="standard"
                        value={newPassword}
                        onChange={(e) => HandlerPassword(e.target.value)}
                        helperText={"此欄位不得為空！"}
                        multiline
                    />

                    <TextField
                    //   error={displayError && !formData[CONTENT]}
                        margin='normal'
                        select
                        fullWidth
                        label="請輸入用戶權限"
                        value={newPriviledge}
                        onChange={(e) => HandlerPriviledge(e.target.value)}
                    > 
                        {priviledge.map((obj) => (
                            <MenuItem key={obj.value} value={obj.value}>{obj.label}</MenuItem>
                        ))}
                    </TextField>
                </div>
            </Box>
            <Button variant="contained"
                onClick={HandlerCreateUser}
            >Create</Button>
        </>
    )
};

export default ManagerAddUser;