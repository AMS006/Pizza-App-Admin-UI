import { Breadcrumb, Button, Drawer, Space, Table } from "antd"
import { Link, Navigate } from "react-router-dom"
import { RightOutlined } from '@ant-design/icons';
import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "../../http/api";
import UserFilters from "./UserFilters";
import { useAuth } from "../../store";
import { useState } from "react";
import { SaveOutlined } from '@ant-design/icons'


const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Name',
        dataIndex: 'firstName',
        key: 'firstName',
        render: (_text: string, record: User) => {
            return (
                <div>
                    {record.firstName} {record.lastName}
                </div>
            );
        },
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
    },
    {
        title: 'Role',
        dataIndex: 'role',
        key: 'role',
    },
];

const UsersPage = () => {
    const [open, setOpen] = useState(false);
    const { data, isLoading } = useQuery({
        queryKey: ['allUsers'],
        queryFn: getAllUsers,
    });
    const { user } = useAuth();

    if (user?.role !== 'admin') {
        return <Navigate to="/" />
    }
    return (
        <div>
            <Breadcrumb
                separator={<RightOutlined />}
                items={[{ title: <Link to="/">Dashboard</Link> }, { title: 'Users' }]}
                style={{ margin: '12px 0px' }}
            />
            <UserFilters
                onDrawerOpen={() => { setOpen(true) }}
                onFilterChange={(filterName, filterValue) => { console.log(filterName, filterValue) }}
            />
            <Table
                dataSource={data?.data}
                style={{ margin: '16px 0px' }}
                columns={columns} loading={isLoading}
                rowKey={'id'}
            />
            <Drawer
                title="Create a new user"
                placement="right"
                destroyOnClose={true}
                closable={true}
                onClose={() => { setOpen(false) }}
                open={open}
                width={720}
                extra={
                    <Space>
                        <Button type="primary" icon={<SaveOutlined />} >Save</Button>
                        <Button onClick={() => setOpen(false)}>Cancel</Button>
                    </Space>
                }

            />
        </div>
    )
}

export default UsersPage
