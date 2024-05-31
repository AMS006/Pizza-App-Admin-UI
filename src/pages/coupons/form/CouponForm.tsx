import { Card, Col, Form, Input, Row, Space } from "antd"


const CouponForm = () => {


    return (
        <Row gutter={24}>
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                <Card title='Basic Info'>
                    <Form.Item label="Coupon Code" name="couponCode" rules={[{ required: true, message: 'Coupon Code is required' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Min Order Amount" name="minOrderAmount" rules={[{ required: true, message: 'Min Order Amount is required' }]}>
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item label="Discount" name="discount" rules={[{ required: true, message: 'Discount is required' }]}>
                        <Input type="number" />
                    </Form.Item>

                </Card>
                <Card title='Validity Info'>
                    <Row gutter={12}>
                        <Col span={12}>
                            <Form.Item
                                name="validFrom"
                                label="Valid From"
                                rules={[{ required: true, message: 'Valid From is required' }]}
                            >
                                <Input type="datetime-local" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="validTill"
                                label="Valid Till"
                                rules={[{ required: true, message: 'Valid Till is required' }]}
                            >
                                <Input type="datetime-local" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>


            </Space>


        </Row>
    )
}

export default CouponForm
