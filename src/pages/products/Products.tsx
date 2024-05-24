import { Breadcrumb, Button, Drawer, Form, Image, Row, Space, Spin, Table, Tag, Typography, theme } from "antd"
import { Link } from "react-router-dom"
import { RightOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useMemo, useState } from "react";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createProduct, getAllProducts, updateProduct, } from "../../http/api";
import { useForm } from "antd/es/form/Form";
import ProductFilter from "./ProductFilter";
import { debounce } from "lodash";
import DeleteProductModal from "./DeleteProductModal";
import ProductForm from "./form/ProductForm";
import { convertToFormData } from "./helper";
import { useAuth } from "../../store";


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
        dataIndex: 'isPublished',
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
    // const queryClient = useQueryClient();
    const { user } = useAuth();

    const [title, setTitle] = useState('Add Product');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [deleteModalOpen, setDeleteTenantModalOpen] = useState(false);
    const queryClient = useQueryClient();

    const [queryParams, setQueryParams] = useState({
        page: '1',
        limit: '6',
        search: '',
        tenantId: user?.role === 'manager' ? String(user.tenant.id) : ''
    })
    const { data: products, isFetching } = useQuery({
        queryKey: ['products', queryParams],
        queryFn: () => {
            const query = new URLSearchParams(queryParams);
            return getAllProducts(query.toString());
        },
        placeholderData: keepPreviousData
    });

    const { mutate: productMutate, isPending: isCreatingProduct } = useMutation({
        mutationKey: ['createProduct'],
        mutationFn: async (data: FormData) => {
            console.log(selectedProduct)
            if (selectedProduct) {
                return updateProduct(data, selectedProduct._id).then((res) => res.data);
            }
            return createProduct(data).then((res) => res.data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            setOpen(false);
            setSelectedProduct(null);
            form.resetFields();
        }
    });




    const [open, setOpen] = useState(false);
    const { token: { colorBgLayout } } = theme.useToken();

    const handleSubmit = async () => {
        await form.validateFields();
        const attributes = Object.entries(form.getFieldValue('attributes')).map(([key, value]) => {
            return {
                name: key,
                value: value
            }
        })

        const pricing = Object.entries(form.getFieldValue('priceConfiguration')).reduce((acc, [key, value]) => {
            const { key: k, priceType } = JSON.parse(key);
            return {
                ...acc,
                [k]: {
                    priceType: priceType,
                    availableOptions: value
                }
            }
        }, {})


        const data = {
            ...form.getFieldsValue(),
            attributes,
            priceConfiguration: pricing,
            isPublished: form.getFieldValue('isPublished') ? true : false,
            categoryId: form.getFieldValue('categoryId')
        }



        const formData = convertToFormData(data);

        if (user?.role === 'manager') {
            formData.append('tenantId', String(user.tenant.id))
        }


        productMutate(formData);


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

    const handleEditProduct = (product: Product) => {

        const attributes = product.attributes.reduce((acc, curr) => {
            return {
                ...acc,
                [curr.name]: curr.value
            }
        }, {})


        const priceConfiguration = Object.entries(product.priceConfiguration).reduce((acc, [key, value]) => {
            return {
                ...acc,
                [JSON.stringify({ key, priceType: value.priceType })]: value.availableOptions
            }
        }, {})
        console.log(priceConfiguration)

        form.setFieldsValue({
            ...product,
            tenantId: Number(product.tenantId),
            image: product.image,
            attributes,
            priceConfiguration
        })

    }


    return (
        <div>
            <DeleteProductModal open={deleteModalOpen} setOpen={setDeleteTenantModalOpen} product={selectedProduct!} setSelectedProduct={setSelectedProduct} />
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
                bordered
                scroll={{ x: 900 }}
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
                                    handleEditProduct(row)
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
                rowKey="_id"
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
                onClose={() => {
                    setSelectedProduct(null);
                    setOpen(false);
                    form.resetFields();
                }}
                open={open}
                width={620}
                styles={{ body: { background: colorBgLayout } }}
                extra={
                    <Space>
                        <Button onClick={() => { setOpen(false); form.resetFields(); setSelectedProduct(null) }}>Cancel</Button>
                        <Button type="primary" onClick={handleSubmit} loading={isCreatingProduct}>Submit</Button>
                    </Space>
                }
            >
                <Form layout="vertical" form={form}>
                    <ProductForm />
                </Form>
            </Drawer>
        </div>
    )
}

export default ProductsPage
