// 管理員介面（Revenue）
import { useState } from 'react';
import axios from '../api.js';
import { Table, Button, message, Space } from 'antd';
import ManagerAddUserDialog from './ManagerAddUserDialog';
import ManagerEditUserDialog from './ManagerEditUserDialog';
import { RedoOutlined, PlusSquareOutlined } from "@ant-design/icons";


const ManagerAddUser = (me) => {

	const [tableData, setTableData] = useState('');
	const [openAddUser, setOpenAddUser] = useState(false);
	const [openEditUser, setOpenEditUser] = useState(false);
	const [recordUserName, setRecordUserName] = useState('');

	const updateData = async () => {
		const { data: { userdata: userdata } } = await axios.get('/manager/user');
		console.log(userdata);
		if (!userdata) {
			message.error('取得資料錯誤，請再次確認輸入資料');
			return;
		}
		setTableData(userdata);
	}

	const handleOpenAddUser = () => {
		setOpenAddUser(true);
	};
	const handleCloseAddUser = () => {
		setOpenAddUser(false);
	};

	const handleOpenEditUser = (name) => {
		setOpenEditUser(true);
		setRecordUserName(name);
	};
	const handleCloseEditUser = () => {
		setOpenEditUser(false);
	};

	const userColumns = [
		{ title: '用戶名稱', dataIndex: 'name', key: 'userName', },
		{ title: '用戶權限', dataIndex: 'priviledge', key: 'userPriviledge', },
		{
			title: '編輯', dataIndex: 'edit', key: 'edit',
			render: (text, record) => {
				return (me.me === record.name) ?
					(
						<Space size="small">
							<Button type="primary" onClick={(e) => {
								e.stopPropagation();
								handleOpenEditUser(record.name);
							}}>修改 {record.name}
							</Button>
						</Space>
					) : (
						<Space size="small">
							<Button type="primary" onClick={(e) => {
								e.stopPropagation();
								handleOpenEditUser(record.name);
							}}>修改 {record.name}
							</Button>
							<Button type="primary" onClick={(e) => {
								e.stopPropagation();
								handleDeleteUser(record.name);
							}}>刪除</Button>
						</Space>
					);
			}
		},
	];

	const handleDeleteUser = async (name) => {
		var returnData = await axios.post('/manager/user/delete', {
			username: name,
		});
		var { data: { userdata: newData } } = returnData;
		setTableData(newData);
	};

	if (tableData === '') {
		updateData();
	}

	return (
		<>
			<Button type="primary" icon={<RedoOutlined />} style={{ marginRight: 20 }} onClick={(e) => {
				e.stopPropagation();
				updateData();
			}}> 重新整理
			</Button>
			<Button type="primary" icon={<PlusSquareOutlined />} onClick={(e) => {
				e.stopPropagation();
				handleOpenAddUser();
			}}> 新增用戶
			</Button>
			<Table columns={userColumns} dataSource={tableData} size="small" style={{ width: '100%' }} />
			<ManagerAddUserDialog
				open={openAddUser}
				handleCloseAddUser={handleCloseAddUser}
				setTableData={setTableData}
			/>
			<ManagerEditUserDialog
				oldusername={recordUserName}
				open={openEditUser}
				handleCloseEditUser={handleCloseEditUser}
				setTableData={setTableData}
			/>
		</>
	);
};

export default ManagerAddUser;