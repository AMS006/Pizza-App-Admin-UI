import { Breadcrumb, Button, Drawer, Form, Image, Row, Space, Spin, Table, Tag, Typography, theme } from "antd"
import { Link } from "react-router-dom"
import { RightOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useMemo, useState } from "react";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTenant, getAllProducts, updateTenant } from "../../http/api";
import { useForm } from "antd/es/form/Form";
import ProductFilter from "./ProductFilter";
import { debounce } from "lodash";
import DeleteProductModal from "./DeleteProductModal";
import ProductForm from "./form/ProductForm";


const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (text: string, row: Product) => {
            return <Space>
                <Image src={row.image} alt={row.name} width={60} />
                <Typography.Text>{text}</Typography.Text>
            </Space>
        }
    },
    {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
        render: (text: string) => text.slice(0, 50)
    },
    {
        title: "Category",
        dataIndex: "category",
        key: "category",
        render: (category: Category) => category.name
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'isPublished',
        render: (text: boolean) => {
            return <Tag color={text ? 'green' : 'red'}>{text ? 'Published' : 'Draft'}</Tag>
        }
    },
    {
        title: "Created At",
        dataIndex: "createdAt",
        key: "createdAt",
        render: (text: string) => new Date(text).toLocaleDateString()
    }

]

const ProductsPage = () => {
    const [form] = useForm();
    const queryClient = useQueryClient();

    const [title, setTitle] = useState('Add Product');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [deleteModalOpen, setDeleteTenantModalOpen] = useState(false);
    const [queryParams, setQueryParams] = useState({
        page: '1',
        limit: '6',
        search: '',
    })
    const { data: products, isFetching } = useQuery({
        queryKey: ['products', queryParams],
        queryFn: () => {
            const query = new URLSearchParams(queryParams);
            return getAllProducts(query.toString());
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
            setSelectedProduct(null);
            form.resetFields();
        }
    });

    const [open, setOpen] = useState(false);
    const { token: { colorBgLayout } } = theme.useToken();

    const handleSubmit = async () => {
        const isEditing = !!selectedProduct;

        if (isEditing) {
            await form.validateFields();
            updateTenantMutate({ ...form.getFieldsValue(), id: selectedProduct?._id });
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

    const onFilterChange = (changedValues: FilterValues) => {

        if ('search' in changedValues) {
            debouncedQUpdate(changedValues.search || '');
        } else {
            setQueryParams((prev) => ({ ...prev, ...changedValues, page: '1' }));
        }
    }


    return (
        <div>
            <DeleteProductModal open={deleteModalOpen} setOpen={setDeleteTenantModalOpen} product={selectedProduct!} />
            <Row justify={'space-between'}>
                <Breadcrumb
                    separator={<RightOutlined />}
                    items={[{ title: <Link to="/">Dashboard</Link> }, { title: 'Products' }]}
                    style={{ margin: '12px 0px' }}
                />
                <Spin spinning={isFetching} />
            </Row>
            <Form onValuesChange={(value: FilterValues) => onFilterChange(value)}>
                <ProductFilter >
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => { setOpen(true); setTitle('Add Product') }}>Add Product</Button>
                </ProductFilter>
            </Form>

            <Table
                dataSource={products?.data?.data || []}

                columns={[...columns,
                {
                    title: "Action",
                    key: "action",

                    render: (_: string, row: Product) => {
                        return <Space>
                            <Button
                                type="link"
                                onClick={() => {
                                    setSelectedProduct(row);
                                    setOpen(true);
                                    setTitle('Update Product');
                                    form.setFieldsValue(row);
                                }}
                            >
                                <EditOutlined />
                            </Button>
                            <Button
                                onClick={() => {
                                    setDeleteTenantModalOpen(true);
                                    setSelectedProduct(row);
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
                    total: products?.data?.total,
                    pageSizeOptions: ['6', '12', '24'],
                    showSizeChanger: true,
                    onChange: (page, limit) => setQueryParams({ ...queryParams, page: page.toString(), limit: limit.toString() })

                }}
            />

            <Drawer
                title={title}
                placement="right"
                closable={true}
                onClose={() => { setOpen(false); form.resetFields(); setSelectedProduct(null) }}
                open={open}
                width={620}
                styles={{ body: { background: colorBgLayout } }}
                extra={
                    <Space>
                        <Button onClick={() => { setOpen(false); form.resetFields() }}>Cancel</Button>
                        <Button type="primary" loading={isCreatingTenant || isUpdatingTenant} onClick={handleSubmit}>Submit</Button>
                    </Space>
                }
            >
                <Form layout="vertical" form={form}>
                    <ProductForm isEditing={false} />
                </Form>
            </Drawer>
        </div>
    )
}

export default ProductsPage
