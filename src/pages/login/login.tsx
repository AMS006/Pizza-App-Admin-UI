import { Alert, Button, Card, Checkbox, Flex, Form, Input, Layout, Space } from "antd";
import { LockFilled, UserOutlined, LockOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { login, self, logoutUser } from "../../http/api";
import { useAuth } from "../../store";
import { usePermission } from "../../hooks/usePermission";
import { AxiosError } from "axios";


const LoginPage = () => {
    const { setUser, logout } = useAuth();
    const { hasPermission } = usePermission();

    const { refetch } = useQuery({
        queryKey: ['self'],
        queryFn: self,
        enabled: false,

    });

    const { mutate: logoutMutate } = useMutation({
        mutationKey: ['logout'],
        mutationFn: logoutUser,
        onSuccess: () => {
            logout();
        }
    });

    const { mutate, isPending, isError, error } = useMutation({
        mutationKey: ['login'],
        mutationFn: login,
        onSuccess: async (data) => {
            const user = await refetch();
            if (!hasPermission(data)) {
                logoutMutate();
                return;
            }
            setUser(user.data);
        },

    });

    return (
        <>
            <Layout style={{ height: '100vh', display: 'grid', placeItems: 'center' }}>
                <Card
                    style={{ width: 350 }}
                    bordered={false}
                    title={<Space style={{ width: '100%', fontSize: 18, justifyContent: 'center' }}><LockFilled /> Sign In</Space>}
                >
                    {isError && error instanceof AxiosError && <Alert message={error.response?.data?.errors[0].message} type="error" showIcon style={{ marginBottom: '12px' }} />}
                    <Form
                        onFinish={(values) => {
                            mutate({ email: values.username, password: values.password })
                        }}
                        style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
                        initialValues={{ remember: true }}
                    >
                        <Form.Item name={'username'} rules={[{ required: true, message: "Username is required" }, { type: "email", message: "Email is not valid" }]} >
                            <Input placeholder="Username" prefix={<UserOutlined />} />
                        </Form.Item>
                        <Form.Item name={'password'} rules={[{ required: true, message: "Password is required" }, { min: 8, message: "Password length must be atleast 8 characters" }]}>
                            <Input.Password placeholder="Password" prefix={<LockOutlined />} />
                        </Form.Item>
                        <Flex justify="space-between" >
                            <Form.Item name={'remember'} valuePropName="checked">
                                <Checkbox>Remember me</Checkbox>
                            </Form.Item>
                            <a href="" id="forgot-password-link">Forgot password?</a>
                        </Flex>
                        <Form.Item>
                            <Button loading={isPending} type="primary" htmlType="submit" style={{ width: '100%', }}>Log In</Button>
                        </Form.Item>
                    </Form>
                </Card>
            </Layout>
        </>
    )
}

export default LoginPage
