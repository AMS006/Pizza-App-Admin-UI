import { Breadcrumb, Button, Drawer, Form, Row, Space, Spin, Table, message, theme } from "antd";
import { Link, Navigate } from "react-router-dom";
import { RightOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createUser, getAllUsers, updateUser } from "../../http/api";
import UserFilters from "./UserFilters";
import { useAuth } from "../../store";
import { useMemo, useState } from "react";
import { PlusOutlined } from '@ant-design/icons';
import UserForm from "./form/UserForm";
import { useForm } from "antd/es/form/Form";
import { AxiosError } from "axios";
import { debounce } from "lodash";
import DeleteUserModal from "./DeleteUserModal";

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
        title: "Restaurant",
        dataIndex: 'restaurant',
        key: 'restaurant',
        render: (_: string, record: User) => {
            return (
                <div>
                    {record.tenant?.name}
                </div>
            );
        },
    },
    {
        title: 'Role',
        dataIndex: 'role',
        key: 'role',
    },
];


const UsersPage = () => {
    const [open, setOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [userDeleteModalOpen, setUserDeleteModalOpen] = useState(false);
    const [form] = useForm();
    const [filterForm] = useForm();


    const queryClient = useQueryClient();
    const [queryParams, setQueryParams] = useState({
        page: '1',
        limit: '6',
        search: '',
        role: ''
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
    const { mutate: createUserMutate, isPending: creatingUser } = useMutation({
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
    });

    const { mutate: updateUserMutate, isPending: updatingUser } = useMutation({
        mutationKey: ['updateUser'],
        mutationFn: async (data: User) => updateUser(data).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['allUsers'] });
            setOpen(false);
            setSelectedUser(null);
            form.resetFields();
        },
        onError: (error: AxiosError) => {
            if (error instanceof AxiosError) {
                messageApi.error((error.response?.data as ErrorResponse)?.errors[0].message);
            }
        }
    });



    const debouncedQUpdate = useMemo(() => {
        return debounce((value: string) => {
            setQueryParams((prev) => ({ ...prev, search: value, page: '1' }));
        }, 500);
    }, []);

    const { user } = useAuth();
    const {
        token: { colorBgLayout },
    } = theme.useToken();

    if (user?.role !== 'admin') {
        return <Navigate to="/" />
    }
    const handleSubmit = async () => {
        await form.validateFields();
        const isEditing = !!selectedUser;

        if (isEditing) {
            let tenantId = undefined;
            if (form.getFieldValue('role') === 'manager')
                tenantId = form.getFieldValue('tenantId');

            console.log(tenantId)
            const data = form.getFieldsValue();
            const payload = { ...data, tenantId: tenantId, id: selectedUser?.id };
            console.log(payload)
            updateUserMutate(payload);
        }
        else {
            createUserMutate(form.getFieldsValue());
        }
    }

    const onFilterChange = (changedValues: FilterValues) => {

        if ('search' in changedValues) {
            debouncedQUpdate(changedValues.search || '');
        } else {
            setQueryParams((prev) => ({ ...prev, ...changedValues, page: '1' }));
        }
    }

    return (
        <div>
            <DeleteUserModal open={userDeleteModalOpen} setOpen={setUserDeleteModalOpen} user={selectedUser!} />
            {contextHolder}
            <Row justify={'space-between'}>
                <Breadcrumb
                    separator={<RightOutlined />}
                    items={[{ title: <Link to="/">Dashboard</Link> }, { title: 'Users' }]}
                    style={{ margin: '12px 0px' }}
                />
                <Spin spinning={isFetching} />
            </Row>
            <Form
                form={filterForm}
                onValuesChange={onFilterChange}
            >
                <UserFilters>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>Create User</Button>
                </UserFilters>
            </Form>
            <Table
                dataSource={data?.data?.users || []}
                style={{ margin: '16px 0px' }}

                columns={[...columns, {
                    title: 'Action',
                    key: 'action',
                    render: (_text: string, record: User) => {
                        return (
                            <Space size={'small'}>
                                <Button
                                    type="link"
                                    onClick={() => {
                                        setSelectedUser(record);
                                        setOpen(true);
                                        form.setFieldsValue({ ...record, tenantId: record.tenant?.id });
                                    }}
                                >
                                    <EditOutlined />
                                </Button>
                                <Button
                                    type="link"
                                    style={{ color: "red" }}
                                    onClick={() => {
                                        setUserDeleteModalOpen(true);
                                        setSelectedUser(record);
                                    }}
                                >
                                    <DeleteOutlined />
                                </Button>
                            </Space>
                        );
                    },
                }]}
                rowKey={'id'}
                pagination={
                    {
                        total: data?.data?.count || 0,
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                        showQuickJumper: true,
                        pageSize: queryParams.limit ? parseInt(queryParams.limit) : 6,
                        current: queryParams.page ? parseInt(queryParams.page) : 1,
                        showSizeChanger: true,
                        pageSizeOptions: ['6', '10', '20', '30', '40', '50'],
                        onChange: (page, pageSize) => {
                            setQueryParams({ ...queryParams, page: page.toString(), limit: pageSize.toString() })
                        }
                    }
                }
            />
            <Drawer
                title={selectedUser ? "Edit User" : "Create a new user"}
                placement="right"
                destroyOnClose={true}
                closable={true}
                onClose={() => { setOpen(false); form.resetFields(); setSelectedUser(null) }}
                styles={{ body: { background: colorBgLayout } }}
                open={open}
                width={720}
                extra={
                    <Space>
                        <Button onClick={() => { setOpen(false); form.resetFields() }}>Cancel</Button>
                        <Button type="primary" onClick={handleSubmit} loading={creatingUser || updatingUser}>Submit</Button>
                    </Space>
                }

            >

                <Form layout="vertical" form={form}>
                    <UserForm isEditing={!!selectedUser} role={selectedUser?.role} />
                </Form>
            </Drawer>
        </div>
    )
}

export default UsersPage
