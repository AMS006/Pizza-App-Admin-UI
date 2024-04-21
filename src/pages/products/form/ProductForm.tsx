import { useQuery } from "@tanstack/react-query";
import { Card, Col, Form, Input, Row, Select, Space } from "antd"
import { getAllCategories, getAllTenants } from "../../../http/api";
import { useEffect, useState } from "react";


const ProductForm = ({ isEditing = false, role }: { isEditing: boolean, role?: string }) => {
    const { data, isLoading } = useQuery({
        queryKey: ['tenants'],
        queryFn: () => {
            return getAllTenants('');
        },
    });
    const [selectedRole, setSelectedRole] = useState<string>('');
    useEffect(() => {

        if (role) {
            setSelectedRole(role);
        }
    }, [role])
    const { data: categories } = useQuery(
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
                                    name="category"
                                    rules={[{ required: true, message: 'Category is required' }]}
                                >
                                    <Select placeholder='Select Category' loading={isLoading}>
                                        {categories && categories?.data.map((category: Category) => (
                                            <Select.Option
                                                key={category._id}
                                                value={category._id}
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

                    <Card title='Role'>
                        <Row gutter={12}>
                            <Col span={12}>
                                <Form.Item
                                    label="Role"
                                    name="role"
                                    rules={[{ required: true, message: 'Role is required' }]}
                                >
                                    <Select placeholder='Select Role' onChange={(value) => setSelectedRole(value)}>
                                        <Select.Option value="admin">Admin</Select.Option>
                                        <Select.Option value="manager">Manager</Select.Option>
                                        <Select.Option value="customer">Customer</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            {selectedRole === 'manager' && <Col span={12}>
                                <Form.Item
                                    label="Tenant"
                                    name="tenantId"
                                    rules={[{ required: true, message: 'Role is required' }]}
                                >
                                    <Select placeholder='Select Tenant' loading={isLoading}>
                                        {data?.data?.tenants.map((tenant: Tenant) => (
                                            <Select.Option
                                                key={tenant.id}
                                                value={tenant.id}
                                            >
                                                {tenant.name}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>}
                        </Row>
                    </Card>
                    {!isEditing && <Card title='Security Info'>
                        <Row gutter={12}>
                            <Col span={12}>
                                <Form.Item
                                    label="Password"
                                    name="password"
                                    rules={[{ required: true, message: 'Password is required' }, { min: 8, message: 'Password length must be atleast 8 characters' }]}
                                >
                                    <Input.Password />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>}
                </Space>
            </Col>
        </Row>
    )
}

export default ProductForm
