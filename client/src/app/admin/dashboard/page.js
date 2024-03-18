'use client'
import React, { useEffect, useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { IoMdNotifications, IoIosLogOut } from 'react-icons/io';
import { SiSimpleanalytics } from "react-icons/si";
import { LiaUsersSolid } from "react-icons/lia";
import { MdPayments } from "react-icons/md";
import { MdProductionQuantityLimits } from "react-icons/md";
import { FaShippingFast } from "react-icons/fa";
import { Layout, Menu, Button, theme, Table, Steps, Pagination } from 'antd';
import { Avatar, Badge, DropdownItem, DropdownMenu,Dropdown,DropdownTrigger } from '@nextui-org/react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { logout } from '@/redux/reducerSlice/userSlice';
import { useRouter } from 'next/navigation';
import DisplayOrders from '@/components/displayOrders/page'
import DisplayProducts from '@/components/displayProducts/page'
import { socket } from '@/socket';
const { Header, Sider, Content } = Layout;
const App = () => {

  const router = useRouter()
  const {isLoggedIn,userDetails}= useSelector(state=>state.user)
  const [products,setProducts]=useState([])
  const [productEdited,setProductEdited]=useState(false)
  const [orders,setOrders] = useState([])
  const [orderCount,setOrderCount]=useState()
  const [pageCount,setPageCount]=useState(1)
  const [users,setUsers] = useState([])
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState('3'); 
  const [notificationCount,setNotificationCount]=useState(0)
  const [n,setN]=useState()
  const dispatch = useDispatch()

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const fetchProducts = async()=>{
    const res = await fetch(`http://localhost:${process.env.NEXT_PUBLIC_API_URL}/admin/products?addedBy=${userDetails._id}`,{
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
        })
         const data = await res.json()
         
        if(res.status!==200){
          return 
        }
       setProducts(data.products)
  }
  const fetchUsers = async()=>{
  const res = await fetch(`http://localhost:${process.env.NEXT_PUBLIC_API_URL}/users`,{
    method: 'GET',
    headers: {'Content-Type': 'application/json'}
    })
     const data = await res.json()
     
    if(res.status!==200){
      return 
    }
    setUsers(data.users)
  }
  const fetchOrders = async()=>{
  const res = await fetch(`http://localhost:${process.env.NEXT_PUBLIC_API_URL}/orders?page=${pageCount}`,{
    method: 'GET',
    headers: {'Content-Type': 'application/json'}
    })
     const data = await res.json()
     
    if(res.status!==200){
      return 
    }
    setOrders(data.orders)
    setOrderCount(data.orderCount)
  }
  const handleMenuClick = (e) => {
    setSelectedMenuItem(e.key)
  }
 
  const renderContent = () => {
    switch (selectedMenuItem) {
      case '1':
        return <div>
          Analytics
          </div>
      case '2':
        return <><DisplayProducts products={products} productEdited={productEdited} setProductEdited={setProductEdited} /></>
      case '3':
        return <div>Categories Content</div>
      case '4':
        return <div><DisplayOrders orders={orders} pageCount={pageCount} orderCount={orderCount} setPageCount={setPageCount}/></div>
      case '5':
        return <div>
          "HELLO"
        </div>
      default:
        return <div>Default Content</div>
    }
  };
  const handleLogout =()=>{
    // toast.warning("hello")
    dispatch(logout())
  }
  useEffect(()=>{
    fetchProducts()
    // fetchOrders()
    fetchUsers()
    socket.on("connection")
    socket.on('newOrder', (data) => {
      console.log('New order received:', data);
      setN(data.message)
      // setNotificationCount(notificationCount+1)
  });
  },[])
  useEffect(()=>{
    fetchOrders()
  },[pageCount])
  
  useEffect(()=>{
    fetchProducts()
  },[productEdited])
  if(!isLoggedIn)return router.push("/login")
  return (
  <div>
      <Header className="justify-between p-0 pr-5 px-2" style={{ display: 'flex', alignItems: 'center'}}>
        <div className="flex items-center justify-start">
          <img src="/gharJaggaLogo.png" alt="" height={70} width={70} />
          <p className="text-white">MEGA MARKET</p>
        </div>
        <h2 className="text-white text-lg font-semibold ml-5">Hello  <span className='text-danger'>{userDetails.username}</span>!, Welcome </h2>
        <div className="flex justify-between items-center gap-5 "> 
          <Dropdown placement="bottom-">
            <DropdownTrigger>
            <div className='p-0 m-0  flex items-center '>
            <Badge content={notificationCount.toString()} shape="circle" color="danger" size="md">
            <IoMdNotifications size={30} color="white" className="cursor-pointer"  />
            </Badge>
            </div>
            </DropdownTrigger>
            
            <DropdownMenu aria-label="Profile Actions" variant="flat" 
                onAction={(key) => alert(key)}>
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">{n}</p>
              </DropdownItem>
            </DropdownMenu>

          </Dropdown>
            <Dropdown placement="bottom-">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="danger"
                name="Jason Hughes"
                size="sm"
                src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
              />
            
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">{userDetails.email}</p>
              </DropdownItem>
              <DropdownItem key="logout" color="danger" onClick={handleLogout}>
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </Header>
      <Layout>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          style={{
            padding: '5px',
            height:'auto'
          }}
        >
          <Menu theme="dark" mode="inline" defaultSelectedKeys={[selectedMenuItem]} onClick={handleMenuClick}>
            <Menu.Item key="1" icon={<SiSimpleanalytics/>}>
              Analytics
            </Menu.Item>
            <Menu.Item key="2" icon={<MdProductionQuantityLimits />}>
              Products
            </Menu.Item>
            <Menu.Item key="3" icon={<UploadOutlined />}>
              Categories
            </Menu.Item>
            <Menu.Item key="4" icon={<FaShippingFast />}>
              Orders
            </Menu.Item>
            <Menu.Item key="5" icon={<LiaUsersSolid />}>
              Customers
            </Menu.Item>

            <Menu.Item key="6" icon={<MdPayments />}>
              Payments
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="  ">
          <Header style={{ padding: 0, background: 'white' }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
              }}
            />
            
            <Button onClick={()=>router.push("/admin/add-product")}>Add Product</Button>
            <Button onClick={()=>router.push("/admin/add-category")} className='ml-3'>Add Category</Button>
          </Header>
          <Content
            style={{
              margin: ' 10px ',
              padding: "5px",
              minHeight: 280,
              overflow:"initial",
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <div
            style={{
              // padding: 24,
              
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {renderContent()}

          </div>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default App;
