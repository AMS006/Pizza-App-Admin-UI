import { Card, Row, Col, Input, Form, Space, } from 'antd'


type ToppingFilterProps = {
    children: React.ReactNode
}
const ToppingFilters = ({ children }: ToppingFilterProps) => {

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