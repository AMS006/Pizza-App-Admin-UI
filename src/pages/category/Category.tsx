import { Breadcrumb, Button, Drawer, Flex, Form, Row, Space, Spin, Table, message, Typography, theme } from "antd"
import { Link } from "react-router-dom"
import { RightOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useMemo, useState } from "react";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createCategory, getAllCategories, updateCategory } from "../../http/api";
import { useForm } from "antd/es/form/Form";
import ProductFilter from "./CategoryFilter";
import { debounce, } from "lodash";
import DeleteCategoryModal from "./DeleteCategoryModal";
import CategoryForm from "./form/CategoryForm";



const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Price Configuration',
        dataIndex: 'priceConfiguration',
        key: 'priceConfiguration',
        render: (priceConfig: PriceConfigration) => {
            return (
                <Flex vertical>
                    {Object.entries(priceConfig).map(([key, value], index) => {
                        return (
                            <Space direction="horizontal" key={index}>
                                <Typography.Text style={{ fontWeight: "bold" }} >{key} ({value.priceType})</Typography.Text>
                                <Space>
                                    {
                                        value.availableOptions.map((option: string, index) => {
                                            return (
                                                <Space key={index}>
                                                    <Typography.Text >{option}</Typography.Text>
                                                </Space>
                                            )
                                        })
                                    }
                                </Space>
                            </Space>
                        )
                    })}
                </Flex>
            )
        }
    },
    {
        title: 'Attributes',
        dataIndex: 'attributes',
        key: 'attributes',
        render: (attributes: Attribute[]) => {
            return (
                <Flex vertical>
                    {attributes.map((attribute: Attribute, index) => {
                        return (
                            <Space direction="horizontal" key={index}>
                                <Typography.Text style={{ fontWeight: "bold" }} >{attribute.name}</Typography.Text>
                                <Space>
                                    {
                                        attribute.availableOptions.map((option: string, index) => {
                                            return (
                                                <Space key={index}>
                                                    <Typography.Text >{option}</Typography.Text>
                                                </Space>
                                            )
                                        })
                                    }
                                </Space>
                            </Space>
                        )
                    })}
                </Flex>
            )
        }

    }


]

const CategoryPage = () => {
    const [form] = useForm();
    // const queryClient = useQueryClient();

    const [title, setTitle] = useState('Add Product');
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [deleteModalOpen, setDeleteTenantModalOpen] = useState(false);
    const [addedPriceConfig, setAddedPriceConfig] = useState<PriceConfigration[]>([]);
    const [addedAttributes, setAddedAttributes] = useState<Attribute[]>([]);
    const queryClient = useQueryClient();

    const [queryParams, setQueryParams] = useState({
        page: '1',
        limit: '6',
        search: '',

    })
    const { data: categories, isFetching } = useQuery({
        queryKey: ['categories', queryParams],
        queryFn: () => {
            const query = new URLSearchParams(queryParams);
            return getAllCategories(query.toString());
        },
        placeholderData: keepPreviousData
    });

    const { mutate, isPending: isCreatingCategory } = useMutation({
        mutationKey: ['createProduct'],
        mutationFn: async (data: CreateCategory) => {
            if (selectedCategory) {
                return updateCategory(data, selectedCategory._id).then((res) => res.data);
            }
            return createCategory(data).then((res) => res.data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            setOpen(false);
            setSelectedCategory(null);
            form.resetFields();
        }
    });




    const [open, setOpen] = useState(false);
    const { token: { colorBgLayout } } = theme.useToken();
    const [messageApi, contextHolder] = message.useMessage();

    const handleSubmit = async () => {
        await form.validateFields(['name']);
        if (addedPriceConfig.length === 0) {
            messageApi.error("Please add atleast one price configuration");
            return;
        }

        if (addedAttributes.length === 0) {
            messageApi.error("Please add atleast one attribute");
            return;
        }





        const priceConfig = addedPriceConfig.reduce((acc, curr) => {
            return { ...acc, ...curr }
        }, {})

        const data = {
            name: form.getFieldValue('name'),
            priceConfiguration: priceConfig,
            attributes: addedAttributes
        }

        console.log(data, "data");

        mutate(data);







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

    const handleEditProduct = (category: Category) => {
        console.log(category)
        setAddedAttributes(category.attributes);
        setAddedPriceConfig(Object.entries(category.priceConfiguration).map(([key, value]) => {
            return {
                [key]: value
            }
        }))
        console.log(category.priceConfiguration)

        form.setFieldsValue({
            name: category.name,

        })
    }


    return (
        <div>
            {contextHolder}
            <DeleteCategoryModal open={deleteModalOpen} setOpen={setDeleteTenantModalOpen} category={selectedCategory!} setSelectedCategory={setSelectedCategory} />


            <Row justify={'space-between'}>
                <Breadcrumb
                    separator={<RightOutlined />}
                    items={[{ title: <Link to="/">Dashboard</Link> }, { title: 'Categories' }]}
                    style={{ margin: '12px 0px' }}
                />
                <Spin spinning={isFetching} />
            </Row>
            <Form onValuesChange={(value: FilterValues) => onFilterChange(value)}>
                <ProductFilter >
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => { setOpen(true); setTitle('Add Category') }}>Add Category</Button>
                </ProductFilter>
            </Form>

            <Table
                dataSource={categories?.data?.data || []}
                scroll={{ x: 1000 }}
                bordered
                columns={[...columns,
                {
                    title: "Action",
                    key: "action",
                    render: (_: string, row: Category) => {
                        return <Space>
                            <Button
                                type="link"
                                onClick={() => {
                                    setSelectedCategory(row);
                                    setOpen(true);
                                    setTitle('Update Category');
                                    handleEditProduct(row)
                                }}
                            >
                                <EditOutlined />
                            </Button>
                            <Button
                                onClick={() => {
                                    setDeleteTenantModalOpen(true);
                                    setSelectedCategory(row);

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
                    total: categories?.data?.total,
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
                    setSelectedCategory(null);
                    setOpen(false);
                    form.resetFields();
                }}
                open={open}
                width={620}
                styles={{ body: { background: colorBgLayout } }}
                extra={
                    <Space>
                        <Button onClick={() => { setOpen(false); form.resetFields(); setSelectedCategory(null) }}>Cancel</Button>
                        <Button type="primary" onClick={handleSubmit} loading={isCreatingCategory}>Submit</Button>
                    </Space>
                }
            >
                <Form layout="vertical" form={form}>
                    <CategoryForm form={form} addedAttributes={addedAttributes} addedPriceConfig={addedPriceConfig} setAddedAttributes={setAddedAttributes} setAddedPriceConfig={setAddedPriceConfig} />
                </Form>
            </Drawer>
        </div>
    )
}

export default CategoryPage
