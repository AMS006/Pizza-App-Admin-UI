import { useQuery } from "@tanstack/react-query";
import { Card, Col, Form, Input, Row, Select, Space, Upload } from "antd"
import { useEffect, useState } from "react";
import { getAllTenants } from "../../../http/api";
import { useAuth } from "../../../store";

const ToppingForm = () => {

    const { user } = useAuth();
    const { data: tenants, isLoading: tenantsLoading } = useQuery({
        queryKey: ['tenants'],
        queryFn: () => {
            return getAllTenants('');
        },
    });

    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const image = Form.useWatch('image');
    console.log(image)
    useEffect(() => {
        if (image) {
            setImageUrl(image)
        }
    }, [image])


    return (
        <Row gutter={24}>

            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                <Card title='Basic Info'>
                    <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Name is required' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Price" name="price" rules={[{ required: true, message: 'Price is required' }]}>
                        <Input type="number" />
                    </Form.Item>
                    {
                        user?.role === 'admin' &&
                        <Form.Item
                            label="Select Tenant"
                            name="tenantId"
                            rules={[{ required: true, message: 'Tenant is required' }]}
                        >
                            <Select placeholder='Select Tenant' loading={tenantsLoading}>
                                {tenants && tenants?.data?.tenants?.map((tenant: Tenant) => (
                                    <Select.Option
                                        key={tenant.id}
                                        value={tenant.id}
                                    >
                                        {tenant.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    }

                </Card>



                <Card title='Topping Image'>
                    <Row gutter={12}>
                        <Col span={12}>
                            <Form.Item
                                name="image"
                                rules={[{ required: true, message: 'Topping Image is required' }]}
                            >

                                <Upload
                                    name="image"
                                    listType="picture-card"
                                    accept="image/*"
                                    multiple={false}
                                    showUploadList={false}
                                    fileList={[]}
                                    beforeUpload={(file) => {
                                        const reader = new FileReader();
                                        reader.readAsDataURL(file);
                                        reader.onload = () => {
                                            setImageUrl(reader.result as string);
                                        }
                                        return false
                                    }}
                                >
                                    {image && imageUrl ? <img src={imageUrl} alt="Topping" style={{ width: '100%' }} /> : 'Upload'}
                                </Upload>

                            </Form.Item>
                        </Col>

                    </Row>
                </Card>


            </Space>


        </Row>
    )
}

export default ToppingForm
