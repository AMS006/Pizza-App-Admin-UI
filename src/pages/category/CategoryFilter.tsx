import { Card, Row, Col, Input, Form } from 'antd'


type ProductFilterProps = {
    children: React.ReactNode
}
const CategoryFilter = ({ children }: ProductFilterProps) => {



    return (
        <Card style={{ marginBottom: '18px' }}>
            <Row justify={'space-between'}>
                <Col>

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

export default CategoryFilter