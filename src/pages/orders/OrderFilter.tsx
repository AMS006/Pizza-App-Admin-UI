import { Card, Col, Input, Form, Space, Select } from 'antd'
import { getAllTenants } from '../../http/api';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../store';


const orderStatus = [
    "Ordered",
    "Prepared",
    "Out for delivery",
    "Delivered",
    "Cancelled"
]

const OrderFilter = () => {

    const { data: tenants, isLoading: tenantsLoading } = useQuery({
        queryKey: ['tenants'],
        queryFn: () => {
            return getAllTenants('');
        },
    });
    const { user } = useAuth();

    return (
        <Card style={{ marginBottom: '18px' }}>

            <Col span={8}>
                <Space>
                    <Form.Item name='search' style={{ marginBottom: 0 }}>
                        <Input.Search
                            allowClear={true}
                            placeholder="Search..."
                        />
                    </Form.Item>

                    {user?.role === 'admin' && <Form.Item
                        name='tenantId'
                        style={{ marginBottom: 0 }}
                    >
                        <Select placeholder='Select Tenant' allowClear loading={tenantsLoading}>
                            {tenants && tenants?.data?.tenants?.map((tenant: Tenant) => (
                                <Select.Option
                                    key={tenant.id}
                                    value={tenant.id}
                                >
                                    {tenant.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>}

                    <Form.Item
                        name='orderStatus'
                        style={{ marginBottom: 0 }}
                    >
                        <Select placeholder='Select Status' allowClear>
                            {orderStatus.map((status) => (
                                <Select.Option
                                    key={status}
                                    value={status}
                                >
                                    {status}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Space>
            </Col>


        </Card>
    )
}

export default OrderFilter