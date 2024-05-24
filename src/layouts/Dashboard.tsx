import { NavLink, Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../store';
import { Avatar, Badge, Dropdown, Flex, Layout, Menu, Space, theme } from 'antd';
import { Content, Footer, Header } from 'antd/es/layout/layout';
import Sider from 'antd/es/layout/Sider';
import { BellOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { logoutUser } from '../http/api';
import { BagIcon, CategoryIcon, FoodIcon, HomeIcon, Topping, UserIcon } from '../components/Icons';
import Icon from '@ant-design/icons';
import logo from '../assets/logo.jpg'


const getItems = (role: string) => {
    const commonItems = [
        {
            key: '/',
            icon: <Icon component={HomeIcon} />,
            label: <NavLink to='/'>Home</NavLink>,
        },

    ];
    if (role === 'admin') {
        return [
            ...commonItems,
            {
                key: '/users',
                icon: <Icon component={UserIcon} />,
                label: <NavLink to='/users'>Users</NavLink>,
            },
            {
                key: '/products',
                icon: <Icon component={BagIcon} />,
                label: <NavLink to='/products'>Products</NavLink>,
            },
            {
                key: '/restaurants',
                icon: <Icon component={FoodIcon} />,
                label: <NavLink to='/restaurants'>Restaurants</NavLink>,
            },
            {
                key: '/topping',
                icon: <Icon component={Topping} />,
                label: <NavLink to='/toppings'>Toppings</NavLink>,
            },
            {
                key: '/category',
                icon: <Icon component={CategoryIcon} />,
                label: <NavLink to='/category'>Category</NavLink>,
            }

        ]
    }
    if (role === 'manager') {
        return [
            ...commonItems,
            {
                key: '/products',
                icon: <Icon component={BagIcon} />,
                label: <NavLink to='/products'>Products</NavLink>,
            },
            {
                key: '/Topping',
                icon: <Icon component={Topping} />,
                label: <NavLink to='/toppings'>Toppings</NavLink>,
            }

        ]
    }

    return commonItems;
}

const Dashboard = () => {
    const { user, logout } = useAuth();
    const items = getItems(user?.role || '');
    const { pathname } = useLocation();
    const { mutate: logoutMutate } = useMutation({
        mutationKey: ['logout'],
        mutationFn: logoutUser,
        onSuccess: () => {
            logout();
        }
    });
    const dropdownItems = [
        {
            key: '1',
            label: "Logout",
            onClick: () => {
                logoutMutate();
            }
        }
    ]



    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();


    if (user === null)
        return <Navigate to={`/auth/login?returnTo=${pathname}`} replace />

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider theme='light' collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <Flex align='center' justify='center'>
                    <img src={logo} style={{ width: '70px' }}></img>
                </Flex>
                <Menu theme="light" mode="inline" defaultSelectedKeys={[pathname]} items={items} />
            </Sider>
            <Layout>
                <Header style={{ padding: '0px 16px', background: colorBgContainer }} >
                    <Flex justify='space-between' align='center'>
                        <Badge
                            text={
                                user.role === 'admin' ? 'You are an admin' : user.tenant?.name
                            }
                            status="success"
                        />
                        <Space size={16}>
                            <BellOutlined style={{ fontSize: '18px' }} />
                            <Dropdown menu={{ items: dropdownItems }} placement="bottomRight">
                                <Avatar>{user.firstName.charAt(0)}</Avatar>
                            </Dropdown>
                        </Space>
                    </Flex>
                </Header>
                <Content style={{ margin: '20px' }}>
                    <Outlet />
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    Ant Design ©{new Date().getFullYear()} Created by Ant UED
                </Footer>
            </Layout>
        </Layout>
    )
}

export default Dashboard;
