import { useQuery } from '@tanstack/react-query';
import { Card, Row, Col, Input, Form, Select, Space, } from 'antd'
import { getAllTenants } from '../../http/api';
import { useAuth } from '../../store';

type ToppingFilterProps = {
    children: React.ReactNode
}
const ToppingFilters = ({ children }: ToppingFilterProps) => {
    const { data: tenants, isLoading: tenantsLoading } = useQuery({
        queryKey: ['tenants'],
        queryFn: () => {
            return getAllTenants('');
        },
    });
    const { user } = useAuth();
    return (
        <Card style={{ marginBottom: '18px' }}>
            <Row justify={'space-between'} >
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
                    </Space>
                </Col>

                <Col>
                    {children}
                </Col>
            </Row>
        </Card>
    )
}

export default ToppingFilters