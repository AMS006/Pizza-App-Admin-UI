import { Breadcrumb, Button, Drawer, Form, Image, Row, Space, Spin, Table, Typography, theme } from "antd"
import { Link } from "react-router-dom"
import { RightOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import ToppingsFilters from "./ToppingFilters";
import { useEffect, useMemo, useState } from "react";
import ToppingForm from "./form/ToppingForm";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTopping, getAllTenants, getAllToppings, updateTopping } from "../../http/api";
import { useForm } from "antd/es/form/Form";
import { debounce } from "lodash";
import DeleteToppingModal from "./DeleteToppingModal";
import { useAuth } from "../../store";

const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (text: string, row: Topping) => {
            return <Space>
                <Image src={row.image} alt={row.name} width={60} />
                <Typography.Text>{text}</Typography.Text>
            </Space>
        }
    },
    {
        title: 'Price',
        dataIndex: 'price',
        key: 'price',
    }
]

const ToppingsPage = () => {
    const [form] = useForm();
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [deleteToppingModalOpen, setDeleteToppingModalOpen] = useState(false);
    const [deleteTopping, setDeleteTopping] = useState<Topping | null>(null);
    const [selectedTopping, setSelectedTopping] = useState<Topping | null>(null);
    const [title, setTitle] = useState('Create Topping');
    const [queryParams, setQueryParams] = useState({
        page: '1',
        limit: '6',
        search: '',
    })

    useEffect(() => {
        if (user?.role === 'admin') {
            columns.push(
                {
                    title: "Restaurant",
                    dataIndex: "tenantName",
                    key: "tenantName"
                },
            )
        }
    }, [user])

    const { data: tenants } = useQuery({
        queryKey: ['tenants'],
        queryFn: () => {
            return getAllTenants('');
        },
    });

    const { data: toppings, isFetching } = useQuery({
        queryKey: ['toppings', queryParams],
        queryFn: () => {
            const query = new URLSearchParams(queryParams);
            return getAllToppings(query.toString());
        },
        placeholderData: keepPreviousData
    });

    const { mutate: createToppingMutate, isPending: isCreatingTopping } = useMutation({
        mutationKey: ['createTopping'],
        mutationFn: async (data: FormData) => createTopping(data).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['toppings'] });
            setOpen(false);
            form.resetFields();
        }
    });

    const { mutate: updateToppingMutate, isPending: isUpdatingTopping } = useMutation({
        mutationKey: ['updateTopping'],
        mutationFn: async (data: FormData) => {
            if (selectedTopping) {
                return updateTopping(data, selectedTopping._id).then((res) => res.data);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['toppings'] });
            setOpen(false);
            setSelectedTopping(null);
            form.resetFields();
        }
    });

    const [open, setOpen] = useState(false);
    const { token: { colorBgLayout } } = theme.useToken();

    const handleSubmit = async () => {
        const isEditing = !!selectedTopping;

        if (isEditing) {
            await form.validateFields();
            updateToppingMutate({ ...form.getFieldsValue(), id: selectedTopping?._id });
            return;
        }
        await form.validateFields();

        const data = form.getFieldsValue();


        const formData = new FormData();

        formData.append('name', data.name);
        formData.append('price', data.price)
        formData.append('image', data.image.file);

        if (user?.role === 'manager') {
            formData.append('tenantId', String(user.tenant.id))
            formData.append('tenantName', user.tenant.name)
        }
        else {
            formData.append('tenantId', data.tenantId);
            // fetch tenant name from tenants
            const tenantName = tenants?.data?.tenants.find((tenant: Tenant) => tenant.id === data.tenantId)?.name;

            formData.append('tenantName', tenantName || '');
        }




        createToppingMutate(formData);
    }

    const debouncedQUpdate = useMemo(() => {
        return debounce((value: string) => {
            setQueryParams((prev) => ({ ...prev, search: value, page: '1' }));
        }, 500);
    }, []);

    const onFilterChange = (value: FilterValues) => {
        debouncedQUpdate(value.search || '');
        console.log(value);
        if (value?.tenantId === undefined) {
            setQueryParams((prev) => ({ ...prev, tenantId: '' }));
        }
        if (value?.tenantId) {
            setQueryParams((prev) => ({ ...prev, tenantId: value.tenantId }));
        }
    }

    useEffect(() => {
        if (user?.role === 'manager') {
            setQueryParams((prev) => ({ ...prev, tenantId: user.tenant.id }));
        }
    }, [user]);


    return (
        <div>
            <DeleteToppingModal open={deleteToppingModalOpen} setOpen={setDeleteToppingModalOpen} topping={deleteTopping!} />
            <Row justify={'space-between'}>
                <Breadcrumb
                    separator={<RightOutlined />}
                    items={[{ title: <Link to="/">Dashboard</Link> }, { title: 'Toppings' }]}
                    style={{ margin: '12px 0px' }}
                />
                <Spin spinning={isFetching} />
            </Row>
            <Form onValuesChange={(value: FilterValues) => onFilterChange(value)}>
                <ToppingsFilters >
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => { setOpen(true); setTitle('Create Topping') }}>Create Topping</Button>
                </ToppingsFilters>
            </Form>
            <Table
                dataSource={toppings?.data?.data || []}
                columns={[...columns,
                {
                    title: "Action",
                    key: "action",
                    render: (_: string, row: Topping) => {
                        return <Space>

                            <Button
                                onClick={() => {
                                    setDeleteToppingModalOpen(true);
                                    setDeleteTopping(row);
                                }}
                                type="link"
                                style={{ color: "red" }}>
                                <DeleteOutlined />
                            </Button>
                        </Space>
                    }
                }
                ]}
                rowKey="id"
                pagination={{
                    current: parseInt(queryParams.page),
                    pageSize: parseInt(queryParams.limit),
                    total: toppings?.data?.total,
                    pageSizeOptions: ['6', '12', '24'],
                    showSizeChanger: true,
                    onChange: (page, limit) => setQueryParams({ ...queryParams, page: page.toString(), limit: limit.toString() })

                }}
            />

            <Drawer
                title={title}
                placement="right"
                closable={true}
                onClose={() => { setOpen(false); form.resetFields(); setSelectedTopping(null) }}
                open={open}
                width={520}
                styles={{ body: { background: colorBgLayout } }}
                extra={
                    <Space>
                        <Button onClick={() => { setOpen(false); form.resetFields() }}>Cancel</Button>
                        <Button type="primary" loading={isCreatingTopping || isUpdatingTopping} onClick={handleSubmit}>Submit</Button>
                    </Space>
                }
            >
                <Form layout="vertical" form={form}>
                    <ToppingForm />
                </Form>
            </Drawer>
        </div>
    )
}

export default ToppingsPage
