import { Breadcrumb, Button, Drawer, Form, Row, Space, Spin, Table, theme } from "antd"
import { Link } from "react-router-dom"
import { RightOutlined, PlusOutlined } from '@ant-design/icons';
import TenantsFilters from "./TenantsFilters";
import { useState } from "react";
import TenantForm from "./form/TenantForm";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTenant, getAllTenants } from "../../http/api";
import { useForm } from "antd/es/form/Form";

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
    const [queryParams, setQueryParams] = useState({
        page: '1',
        limit: '6'
    })
    const { data, isFetching } = useQuery({
        queryKey: ['tenants', queryParams],
        queryFn: () => {
            const query = new URLSearchParams(queryParams);
            return getAllTenants(query.toString());
        },
        placeholderData: keepPreviousData
    });

    const { mutate, isPending } = useMutation({
        mutationKey: ['createTenant'],
        mutationFn: async (data: Tenant) => createTenant(data).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tenants'] });
            setOpen(false);
            form.resetFields();
        }
    })

    const [open, setOpen] = useState(false);
    const { token: { colorBgLayout } } = theme.useToken();

    const handleSubmit = async () => {
        await form.validateFields();
        mutate(form.getFieldsValue());
    }
    return (
        <div>
            <Row justify={'space-between'}>
                <Breadcrumb
                    separator={<RightOutlined />}
                    items={[{ title: <Link to="/">Dashboard</Link> }, { title: 'Restaurants' }]}
                    style={{ margin: '12px 0px' }}
                />
                <Spin spinning={isFetching} />
            </Row>
            <TenantsFilters >
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>Create Restaurant</Button>
            </TenantsFilters>

            <Table
                dataSource={data?.data?.tenants || []}
                columns={columns}

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
                title="Create Restaurant"
                placement="right"
                closable={true}
                onClose={() => { setOpen(false); form.resetFields() }}
                open={open}
                width={520}
                styles={{ body: { background: colorBgLayout } }}
                extra={
                    <Space>
                        <Button onClick={() => { setOpen(false); form.resetFields() }}>Cancel</Button>
                        <Button type="primary" loading={isPending} onClick={handleSubmit}>Submit</Button>
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
