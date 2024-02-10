import { Card, Row, Col, Flex, Input, Select, Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
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
interface UserFiltersProps {
    onDrawerOpen: () => void
    onFilterChange: (filterName: string, filterValue: string) => void
}
const UserFilters = ({ onFilterChange, onDrawerOpen }: UserFiltersProps) => {
    return (
        <Card>
            <Row justify={'space-between'}>
                <Col>
                    <Flex gap={6}>
                        <Input.Search
                            allowClear={true}
                            placeholder="Search..."
                            onChange={(e) => onFilterChange('search', e.target.value)}
                        />
                        <Select
                            allowClear={true}
                            style={{ width: '100%' }}
                            options={roles}
                            placeholder='Select Role'
                            onChange={(value) => onFilterChange('role', value)}
                        />
                        <Select
                            allowClear={true}
                            style={{ width: '100%' }}
                            options={status}
                            placeholder='Select Status'
                            onChange={(value) => onFilterChange('status', value)}
                        />
                    </Flex>
                </Col>
                <Col>
                    <Button
                        onClick={onDrawerOpen}
                        type="primary"
                        icon={<PlusOutlined />}
                    >Create User</Button>
                </Col>
            </Row>
        </Card>
    )
}

export default UserFilters