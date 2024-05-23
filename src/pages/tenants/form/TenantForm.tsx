import { Card, Col, Form, Input, Row, } from "antd"

const TenantForm = () => {


    return (
        <Row>
            <Col span={24}>
                <Card title='Basic Info'>
                    <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Name is required' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Address" name="address" rules={[{ required: true, message: 'Address is required' }]}>
                        <Input />
                    </Form.Item>
                </Card>


            </Col>


        </Row>
    )
}

export default TenantForm
