import { Button, Card, Checkbox, Flex, Form, Input, Layout, Space } from "antd"
import { LockFilled, UserOutlined, LockOutlined } from "@ant-design/icons"

const LoginPage = () => {
    return (
        <>
            <Layout style={{ height: '100vh', display: 'grid', placeItems: 'center' }}>
                <Card
                    style={{ width: 350 }}
                    bordered={false}
                    title={<Space style={{ width: '100%', fontSize: 18, justifyContent: 'center' }}><LockFilled /> Sign In</Space>}
                >
                    <Form
                        initialValues={{ remember: true }}
                    >
                        <Form.Item name={'username'} rules={[{ required: true, message: "Username is required" }, { type: "email", message: "Email is not valid" }]} >
                            <Input placeholder="Username" prefix={<UserOutlined />} />
                        </Form.Item>
                        <Form.Item name={'password'} rules={[{ required: true, message: "Password is required" }]}>
                            <Input.Password placeholder="Password" prefix={<LockOutlined />} />
                        </Form.Item>
                        <Flex justify="space-between" >
                            <Form.Item name={'remember'} valuePropName="checked">
                                <Checkbox>Remember me</Checkbox>
                            </Form.Item>
                            <a href="" id="forgot-password-link">Forgot password?</a>
                        </Flex>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" style={{ width: '100%', }}>Log In</Button>
                        </Form.Item>
                    </Form>
                </Card>
            </Layout>
        </>
    )
}

export default LoginPage
