import { Card, Row, Col, Flex, Input, Select, Form, } from 'antd'
const roles = [
    {
        value: "admin",
        label: "Admin"
    },
    {
        value: "manager",
        label: "Manager"
    },
    {
        value: "customer",
        label: "Customer"
    }
]

type UserFiltersProps = {
    children: React.ReactNode
}
const UserFilters = ({ children }: UserFiltersProps) => {
    return (
        <Card>
            <Row justify={'space-between'} >
                <Col>
                    <Flex gap={6}>
                        <Form.Item name={'search'}>
                            <Input.Search
                                allowClear={true}
                                placeholder="Search..."
                            />
                        </Form.Item>
                        <Form.Item name={'role'}>
                            <Select
                                allowClear={true}
                                style={{ width: '100%' }}
                                options={roles}
                                placeholder='Select Role'
                            />
                        </Form.Item>
                    </Flex>
                </Col>
                <Col>
                    {children}
                </Col>
            </Row>
        </Card>
    )
}

export default UserFilters