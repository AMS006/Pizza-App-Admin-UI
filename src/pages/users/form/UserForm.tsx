import { useQuery } from "@tanstack/react-query";
import { Card, Col, Form, Input, Row, Select, Space } from "antd"
import { getAllTenants } from "../../../http/api";
import { useEffect, useState } from "react";


const UserForm = ({ isEditing = false, role }: { isEditing: boolean, role?: string }) => {
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

    return (
        <Row>
            <Col span={24}>
                <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                    <Card title='Basic Info'>
                        <Row gutter={12}>
                            <Col span={12}>
                                <Form.Item
                                    label="First Name"
                                    name="firstName"

                                    rules={[{ required: true, message: 'First Name is required' }]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="Last Name"
                                    name="lastName"
                                    rules={[{ required: true, message: 'Last Name is required' }]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            {!isEditing && <Col span={12}>
                                <Form.Item
                                    label="Email"
                                    name="email"

                                    rules={[{ required: true, message: 'Email is required' }, { type: 'email', message: 'Email is not valid' }]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>}
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

export default UserForm
