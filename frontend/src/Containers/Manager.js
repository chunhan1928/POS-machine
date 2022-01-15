// 管理員介面（首頁）

import { useState } from 'react'
import { Table, Button, Menu, Layout, Breadcrumb, Space } from 'antd'
import { ContainerOutlined, PieChartOutlined, ShoppingOutlined, PropertySafetyOutlined, FormOutlined } from "@ant-design/icons";
import axios from '../api';
import Title from '../Components/Title'
import ManagerPwd from './ManagerPwd'
import ManagerEditProduct from './ManagerEditProductMain'
import ManagerAddProduct from './ManagerAddProductMain'
import ManagerRevenue from './ManagerRevenue';
import ManagerAddUser from './ManagerAddUser'

const { Header, Sider, Content, Footer } = Layout;

const Manager = ({ me, data, displayStatus, logout }) => {
  const [sideTab, setsideTab] = useState('庫存狀況');
  const [tableData, setTableData] = useState(data);
  const [showData, setShowData] = useState(data);
  const [productClass, setProductClass] = useState('全部');
  const [openMagagerPwd, setOpenMagagerPwd] = useState(false);
  const handleOpenMagagerPwd = () => {
    setOpenMagagerPwd(true);
  };
  const handleCloseMagagerPwd = () => {
    setOpenMagagerPwd(false);
  };

  const [dataRecord, setDataRecord] = useState([]);
  const [openEditProduct, setOpenEditProduct] = useState(false);
  const handleOpenEditProduct = (record) => {
    setOpenEditProduct(true);
    setDataRecord(record);
  };
  const handleCloseEditProduct = () => {
    setOpenEditProduct(false);
  };

  const [openAddProduct, setOpenAddProduct] = useState(false);
  const handleAddEditProduct = () => {
    setOpenAddProduct(true);
  };
  const handleCloseAddProduct = () => {
    setOpenAddProduct(false);
  };

  const handleDeleteProduct = async (name, category) => {
    // console.log(name, category);
    var returnData = await axios.post('/manager/stock/delete', {
      name: name,
    });
    var { data: { stockdata: newData } } = returnData;
    // console.log(newData, category);
    setTableData(newData);
    setShowData(newData, category);
  };

  const updateShowData = (data, category) => {
    let tempArray = [];
    // console.log(data);
    if (!data) return;
    else if (category === '全部') setShowData(data);
    else {
      for (var i = 0; i < data.length; i++) {
        // console.log(data[i])
        if (data[i].category === category) tempArray.push(data[i]);
      }
      setShowData(tempArray);
      // console.log(tempArray);
    }
  };


  const stockColumns = [
    { title: '商品名稱', dataIndex: 'name', key: 'name', },
    { title: '商品成本', dataIndex: 'cost', key: 'cost', },
    { title: '商品定價', dataIndex: 'price', key: 'price', },
    { title: '剩餘數量', dataIndex: 'amount', key: 'amount', },
    {
      title: '編輯', dataIndex: 'edit', key: 'edit',
      render: (text, record) => (
        <Space size="small">
          <Button type="primary" onClick={(e) => {
            e.stopPropagation();
            handleOpenEditProduct(record);
          }}>修改 {record.name}
          </Button>
          <Button type="primary" onClick={(e) => {
            e.stopPropagation();
            handleDeleteProduct(record.name, record.category);
          }}>刪除</Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Layout>
        <Header style={{ height: '5vw' }}>
          <Title style={{ color: 'white', width: '90vw', height: '5vw' }}>
            <div style={{ textAlign: 'center', color: 'white', width: '90%', fontSize: '28px', fontWeight: 'bold' }}><PropertySafetyOutlined /> &nbsp;&nbsp;管理者介面</div>
            <div style={{ textAlign: 'center', width: '10%', fontSize: '20px' }}>{me}</div>
            <Button style={{ textAlign: 'right', marginRight: 25 }} onClick={handleOpenMagagerPwd}>修改密碼</Button>
            <Button style={{ textAlign: 'right' }} onClick={(e) => {
              e.stopPropagation();
              logout()
            }}>登出</Button>
          </Title>
          <Layout style={{ height: '80vh' }}>
            <Sider width={200}>
              <Menu
                style={{ height: '100%', width: '100%', borderLeft: 0 }}
                defaultSelectedKeys={['全部']}
                defaultOpenKeys={['sub1']}
                onSelect={(e) => {
                  if (e.key === "營收分析") {
                    setsideTab(e.key);
                    setProductClass('');
                  }
                  else if (e.key === "添加用戶") {
                    setsideTab(e.key);
                    setProductClass('');
                  }
                  else {
                    console.log(e.key);
                    setsideTab('庫存狀況');
                    setProductClass(e.key);
                    updateShowData(tableData, e.key);
                  }
                }}
                mode="inline"
              >
                <Menu.SubMenu key="sub1" icon={<ContainerOutlined />} title="庫存狀況">
                  <Menu.Item key="全部" icon={<ShoppingOutlined />} >全部</Menu.Item>
                  <Menu.Item key="主食" icon={<ShoppingOutlined />} >主食</Menu.Item>
                  <Menu.Item key="副餐" icon={<ShoppingOutlined />} >副餐</Menu.Item>
                  <Menu.Item key="飲料" icon={<ShoppingOutlined />} >飲料</Menu.Item>
                </Menu.SubMenu>
                <Menu.Item key="營收分析" icon={<PieChartOutlined />}>營收分析</Menu.Item>
                <Menu.Item key="添加用戶" icon={<FormOutlined />}>添加用戶</Menu.Item>
              </Menu>
            </Sider>
            <Content style={{ margin: '10px 25px' }} className="site-layout-background">
              <Breadcrumb style={{ margin: '10px 0 0 5px', textAlign: 'left', color: 'black', fontSize: '15px' }}>
                <Breadcrumb.Item >{sideTab}</Breadcrumb.Item>
                <Breadcrumb.Item >{productClass}</Breadcrumb.Item>
              </Breadcrumb>
              <div>
                {
                  (sideTab === "庫存狀況") ?
                    <>
                      <Button type="primary" onClick={(e) => {
                        e.stopPropagation();
                        handleAddEditProduct();
                      }}> 新增商品
                      </Button>
                      <Table columns={stockColumns} dataSource={showData} size="small" style={{ width: '100%' }} />
                    </> : (sideTab === "營收分析") ? <ManagerRevenue /> : <ManagerAddUser displayStatus={displayStatus} />

                }
              </div>
            </Content>
          </Layout>
          <Footer style={{ textAlign: 'center', height: '5vh' }}>POS Machine ©2022 Created by NTU CSIE</Footer>
        </Header>
      </Layout >
      <ManagerPwd
        me={me}
        open={openMagagerPwd}
        handleCloseManagerPwd={handleCloseMagagerPwd}
        displayStatus={displayStatus}
      />
      <ManagerEditProduct
        data={dataRecord}
        open={openEditProduct}
        handleCloseEditProduct={handleCloseEditProduct}
        setTableData={setTableData}
        updateShowData={updateShowData}
        productClass={productClass}
      />
      <ManagerAddProduct
        open={openAddProduct}
        handleCloseAddProduct={handleCloseAddProduct}
        setTableData={setTableData}
        updateShowData={updateShowData}
        productClass={productClass}
      />
    </>
  )
}

export default Manager
