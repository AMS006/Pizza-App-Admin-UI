import { NavLink, Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../store';
import { Avatar, Badge, Dropdown, Flex, Layout, Menu, Space, theme } from 'antd';
import { Content, Footer, Header } from 'antd/es/layout/layout';
import Sider from 'antd/es/layout/Sider';
import { BellOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { logoutUser } from '../http/api';
import { FoodIcon, HomeIcon, UserIcon } from '../components/Icons';
import Icon from '@ant-design/icons';





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
                key: '/restaurants',
                icon: <Icon component={FoodIcon} />,
                label: <NavLink to='/restaurants'>Restaurants</NavLink>,
            }
        ]
    }

    return commonItems;
}

const Dashboard = () => {
    const { user, logout } = useAuth();
    const items = getItems(user?.role || '');
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
    const { pathname } = useLocation();

    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();


    if (user === null)
        return <Navigate to="/auth/login" replace />

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider theme='light' collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <div>
                    <h1 style={{ padding: '12px', color: '#367181' }}>R</h1>
                </div>
                <Menu theme="light" defaultSelectedKeys={[pathname]} mode="inline" items={items} />
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

export default Dashboard
