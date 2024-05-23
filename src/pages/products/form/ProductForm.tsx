import { useQuery } from "@tanstack/react-query";
import { Card, Col, Form, Input, Row, Select, Space, Switch, Upload } from "antd"
import { getAllCategories, getAllTenants } from "../../../http/api";
import Pricing from "./Pricing";
import Attributes from "./Attributes";
import { useEffect, useState } from "react";
import { useAuth } from "../../../store";


const ProductForm = () => {
    const selectedCategory = Form.useWatch("categoryId");
    const image = Form.useWatch("image");
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const { user } = useAuth();

    const { data: tenants, isLoading: tenantsLoading } = useQuery({
        queryKey: ['tenants'],
        queryFn: () => {
            return getAllTenants('');
        },
    });

    useEffect(() => {
        if (image) {
            setImageUrl(image)
        }
    }, [image])


    const { data: categories, isLoading: categoriesLoading } = useQuery(
        {
            queryKey: ['categories'],
            queryFn: () => getAllCategories()
        }
    )


    return (
        <Row>
            <Col span={24}>
                <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                    <Card title='Product Info'>
                        <Row gutter={12}>
                            <Col span={12}>
                                <Form.Item
                                    label="Product Name"
                                    name="name"
                                    rules={[{ required: true, message: 'Product Name is required' }]}
                                >
                                    <Input placeholder="Enter Product Name" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="Category"
                                    name="categoryId"
                                    rules={[{ required: true, message: 'Category is required' }]}
                                >
                                    <Select placeholder='Select Category' loading={categoriesLoading}>
                                        {categories && categories?.data.map((category: Category) => (
                                            <Select.Option
                                                key={category._id}
                                                value={category._id.toString()}
                                            >
                                                {category.name}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    label="Description"
                                    name="description"

                                    rules={[{ required: true, message: 'Description is required' }]}
                                >
                                    <Input.TextArea
                                        rows={3}
                                        placeholder="Enter Product Description"
                                        style={{ resize: 'none' }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>
                    <Card title='Product Image'>
                        <Row gutter={12}>
                            <Col span={12}>
                                <Form.Item
                                    name="image"
                                    rules={[{ required: true, message: 'Product Image is required' }]}
                                >

                                    <Upload
                                        name="image"
                                        listType="picture-card"
                                        accept="image/*"
                                        multiple={false}
                                        showUploadList={false}
                                        fileList={[]}
                                        beforeUpload={(file) => {
                                            const reader = new FileReader();
                                            reader.readAsDataURL(file);
                                            reader.onload = () => {
                                                setImageUrl(reader.result as string);
                                            }
                                            return false
                                        }}
                                    >
                                        {image && imageUrl ? <img src={imageUrl} alt="Product" style={{ width: '100%' }} /> : 'Upload'}
                                    </Upload>

                                </Form.Item>
                            </Col>

                        </Row>
                    </Card>
                    {
                        user?.role === 'admin' &&
                        <Card title='Tenant Info'>
                            <Row gutter={12}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Select Tenant"
                                        name="tenantId"
                                        rules={[{ required: true, message: 'Tenant is required' }]}
                                    >
                                        <Select placeholder='Select Tenant' loading={tenantsLoading}>
                                            {tenants && tenants?.data?.tenants?.map((tenant: Tenant) => (
                                                <Select.Option
                                                    key={tenant.id}
                                                    value={tenant.id}
                                                >
                                                    {tenant.name}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>
                    }

                    {selectedCategory && <Pricing selectedCategory={selectedCategory} />}

                    {selectedCategory && <Attributes selectedCategory={selectedCategory} />}

                    <Card title='Other Properties'>
                        <Row gutter={12}>
                            <Col span={12}>
                                <Form.Item
                                    label="Published"
                                    name="isPublished"
                                    valuePropName="checked"
                                >
                                    <Switch
                                        defaultChecked={false}
                                        checkedChildren="Yes"
                                        unCheckedChildren="No" />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>
                </Space>
            </Col>
        </Row>
    )
}

export default ProductForm
