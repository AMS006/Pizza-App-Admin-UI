import { Breadcrumb, Button, Drawer, Form, Row, Space, Spin, Table, message, theme } from "antd"
import { Link, Navigate } from "react-router-dom"
import { RightOutlined } from '@ant-design/icons';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createUser, getAllUsers } from "../../http/api";
import UserFilters from "./UserFilters";
import { useAuth } from "../../store";
import { useState } from "react";
import { PlusOutlined } from '@ant-design/icons'
import UserForm from "./form/UserForm";
import { useForm } from "antd/es/form/Form";
import { AxiosError } from "axios";


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
    const [form] = useForm();
    const queryClient = useQueryClient();
    const [queryParams, setQueryParams] = useState({
        page: '1',
        limit: '6'
    })

    const [messageApi, contextHolder] = message.useMessage();
    const { data, isFetching } = useQuery({
        queryKey: ['allUsers', queryParams],
        queryFn: () => {
            const query = new URLSearchParams(queryParams);
            return getAllUsers(query.toString());
        },
        placeholderData: keepPreviousData
    });
    const { mutate, isPending } = useMutation({
        mutationKey: ['createUser'],
        mutationFn: async (data: User) => createUser(data).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['allUsers'] });
            setOpen(false);
            form.resetFields();
        },
        onError: (error: AxiosError) => {
            if (error instanceof AxiosError) {
                messageApi.error((error.response?.data as ErrorResponse)?.errors[0].message);
            }
        }
    })

    const { user } = useAuth();
    const {
        token: { colorBgLayout },
    } = theme.useToken();

    if (user?.role !== 'admin') {
        return <Navigate to="/" />
    }
    const handleSubmit = async () => {
        await form.validateFields();
        mutate(form.getFieldsValue());
    }


    return (
        <div>
            {contextHolder}
            <Row justify={'space-between'}>
                <Breadcrumb
                    separator={<RightOutlined />}
                    items={[{ title: <Link to="/">Dashboard</Link> }, { title: 'Users' }]}
                    style={{ margin: '12px 0px' }}
                />
                <Spin spinning={isFetching} />
            </Row>
            <UserFilters>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>Create User</Button>
            </UserFilters>
            <Table
                dataSource={data?.data?.users || []}
                style={{ margin: '16px 0px' }}
                columns={columns}
                rowKey={'id'}
                pagination={
                    {
                        total: data?.data?.count || 0,
                        pageSize: queryParams.limit ? parseInt(queryParams.limit) : 6,
                        current: queryParams.page ? parseInt(queryParams.page) : 1,
                        showSizeChanger: true,
                        pageSizeOptions: ['6', '10', '20', '30', '40', '50'],
                        onChange: (page, pageSize) => {
                            console.log(page, pageSize)
                            setQueryParams({ ...queryParams, page: page.toString(), limit: pageSize.toString() })
                        }
                    }
                }
            />
            <Drawer
                title="Create a new user"
                placement="right"
                destroyOnClose={true}
                closable={true}
                onClose={() => { setOpen(false); form.resetFields() }}
                styles={{ body: { background: colorBgLayout } }}
                open={open}
                width={720}
                extra={
                    <Space>
                        <Button onClick={() => { setOpen(false); form.resetFields() }}>Cancel</Button>
                        <Button type="primary" onClick={handleSubmit} loading={isPending}>Submit</Button>
                    </Space>
                }

            >

                <Form layout="vertical" form={form}>
                    <UserForm />
                </Form>

            </Drawer>
        </div>
    )
}

export default UsersPage
