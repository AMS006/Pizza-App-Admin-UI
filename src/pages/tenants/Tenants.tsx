import { Breadcrumb, Button, Drawer, Form, Row, Space, Spin, Table, theme } from "antd"
import { Link } from "react-router-dom"
import { RightOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import TenantsFilters from "./TenantsFilters";
import { useMemo, useState } from "react";
import TenantForm from "./form/TenantForm";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTenant, getAllTenants, updateTenant } from "../../http/api";
import { useForm } from "antd/es/form/Form";
import { debounce } from "lodash";
import DeleteTenantModal from "./DeleteTenantModal";

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
    }
]

const TenantsPage = () => {
    const [form] = useForm();
    const queryClient = useQueryClient();
    const [deleteTenantModalOpen, setDeleteTenantModalOpen] = useState(false);
    const [deleteTenant, setDeleteTenant] = useState<Tenant | null>(null);
    const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
    const [title, setTitle] = useState('Create Restaurant');
    const [queryParams, setQueryParams] = useState({
        page: '1',
        limit: '6',
        search: '',
    })
    const { data, isFetching } = useQuery({
        queryKey: ['tenants', queryParams],
        queryFn: () => {
            const query = new URLSearchParams(queryParams);
            return getAllTenants(query.toString());
        },
        placeholderData: keepPreviousData
    });

    const { mutate: createTenantMutate, isPending: isCreatingTenant } = useMutation({
        mutationKey: ['createTenant'],
        mutationFn: async (data: Tenant) => createTenant(data).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tenants'] });
            setOpen(false);
            form.resetFields();
        }
    });

    const { mutate: updateTenantMutate, isPending: isUpdatingTenant } = useMutation({
        mutationKey: ['updateTenant'],
        mutationFn: async (data: Tenant) => updateTenant(data).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tenants'] });
            setOpen(false);
            setSelectedTenant(null);
            form.resetFields();
        }
    });

    const [open, setOpen] = useState(false);
    const { token: { colorBgLayout } } = theme.useToken();

    const handleSubmit = async () => {
        const isEditing = !!selectedTenant;

        if (isEditing) {
            await form.validateFields();
            updateTenantMutate({ ...form.getFieldsValue(), id: selectedTenant?.id });
            return;
        }
        await form.validateFields();
        createTenantMutate(form.getFieldsValue());
    }

    const debouncedQUpdate = useMemo(() => {
        return debounce((value: string) => {
            setQueryParams((prev) => ({ ...prev, search: value, page: '1' }));
        }, 500);
    }, []);

    const onFilterChange = (value: FilterValues) => {
        debouncedQUpdate(value.search || '');
    }
    return (
        <div>
            <DeleteTenantModal open={deleteTenantModalOpen} setOpen={setDeleteTenantModalOpen} tenant={deleteTenant!} />
            <Row justify={'space-between'}>
                <Breadcrumb
                    separator={<RightOutlined />}
                    items={[{ title: <Link to="/">Dashboard</Link> }, { title: 'Restaurants' }]}
                    style={{ margin: '12px 0px' }}
                />
                <Spin spinning={isFetching} />
            </Row>
            <Form onValuesChange={(value: FilterValues) => onFilterChange(value)}>
                <TenantsFilters >
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => { setOpen(true); setTitle('Create Restaurant') }}>Create Restaurant</Button>
                </TenantsFilters>
            </Form>
            <Table
                dataSource={data?.data?.tenants || []}
                columns={[...columns,
                {
                    title: "Action",
                    key: "action",
                    render: (_: string, record: Tenant) => (
                        <Space>
                            <Button
                                type="link"
                                onClick={() => {
                                    setSelectedTenant(record);
                                    setOpen(true);
                                    setTitle('Update Restaurant');
                                    form.setFieldsValue(record);
                                }}
                            >
                                <EditOutlined />
                            </Button>
                            <Button
                                onClick={() => {
                                    setDeleteTenantModalOpen(true);
                                    setDeleteTenant(record);
                                }}
                                type="link"
                                style={{ color: "red" }}>
                                <DeleteOutlined />
                            </Button>
                        </Space>
                    )
                }
                ]}
                rowKey="id"
                pagination={{
                    current: parseInt(queryParams.page),
                    pageSize: parseInt(queryParams.limit),
                    total: data?.data?.count,
                    pageSizeOptions: ['6', '12', '24'],
                    showSizeChanger: true,
                    onChange: (page, limit) => setQueryParams({ ...queryParams, page: page.toString(), limit: limit.toString() })

                }}
            />

            <Drawer
                title={title}
                placement="right"
                closable={true}
                onClose={() => { setOpen(false); form.resetFields(); setSelectedTenant(null) }}
                open={open}
                width={520}
                styles={{ body: { background: colorBgLayout } }}
                extra={
                    <Space>
                        <Button onClick={() => { setOpen(false); form.resetFields() }}>Cancel</Button>
                        <Button type="primary" loading={isCreatingTenant || isUpdatingTenant} onClick={handleSubmit}>Submit</Button>
                    </Space>
                }
            >
                <Form layout="vertical" form={form}>
                    <TenantForm />
                </Form>
            </Drawer>
        </div>
    )
}

export default TenantsPage
