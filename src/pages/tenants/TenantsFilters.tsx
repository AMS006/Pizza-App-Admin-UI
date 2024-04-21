import { Card, Row, Col, Input, Form, } from 'antd'

type TenantsFiltersProps = {
    children: React.ReactNode
}
const TenantsFilters = ({ children }: TenantsFiltersProps) => {
    return (
        <Card style={{ marginBottom: '18px' }}>
            <Row justify={'space-between'} >
                <Col span={8}>
                    <Form.Item name='search' style={{ marginBottom: 0 }}>
                        <Input.Search
                            allowClear={true}
                            placeholder="Search..."
                        />
                    </Form.Item>
                </Col>
                <Col>
                    {children}
                </Col>
            </Row>
        </Card>
    )
}

export default TenantsFilters