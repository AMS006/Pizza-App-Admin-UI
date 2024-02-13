import { Card, Row, Col, Flex, Input, Select, } from 'antd'
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
const status = [
    {
        value: "active",
        label: "Active"
    },
    {
        value: "banned",
        label: "Banned"
    }
];
type UserFiltersProps = {
    children: React.ReactNode
}
const UserFilters = ({ children }: UserFiltersProps) => {
    return (
        <Card>
            <Row justify={'space-between'} >
                <Col>
                    <Flex gap={6}>
                        <Input.Search
                            allowClear={true}
                            placeholder="Search..."

                        // onChange={() => ()}
                        />
                        <Select
                            allowClear={true}
                            style={{ width: '100%' }}
                            options={roles}
                            placeholder='Select Role'

                        // onChange={(value) =>()}
                        />
                        <Select
                            allowClear={true}
                            style={{ width: '100%' }}
                            options={status}
                            placeholder='Select Status'

                        // onChange={(value) => onFilterChange('status', value)}
                        />
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