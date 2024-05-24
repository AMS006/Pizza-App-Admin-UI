import { Button, Card, Col, Flex, Form, FormInstance, Input, Row, Select, Space, Typography } from "antd"

import { DeleteOutlined } from '@ant-design/icons';





const priceTypes = ['base', 'additional'];
const attributes = ['radio', 'switch'];

interface CategoryFormProps {
    form: FormInstance;
    addedPriceConfig: PriceConfigration[];
    setAddedPriceConfig: React.Dispatch<React.SetStateAction<PriceConfigration[]>>;
    addedAttributes: Attribute[];
    setAddedAttributes: React.Dispatch<React.SetStateAction<Attribute[]>>;
}

const CategoryForm = ({ form, addedAttributes, addedPriceConfig, setAddedAttributes, setAddedPriceConfig }: CategoryFormProps) => {


    const handleAddPriceConfiguration = async () => {
        await form.validateFields(['priceType', 'priceTypeName', 'availableOptions']);
        const values = form.getFieldsValue();
        const { priceType, priceTypeName, availableOptions } = values;

        const priceConfig = {
            [priceTypeName]: {
                priceType: priceType,
                availableOptions: availableOptions.split(',')
            }
        }

        setAddedPriceConfig((prev) => [...prev, priceConfig]);
        form.resetFields(['priceType', 'priceTypeName', 'availableOptions']);

    }

    const handleAddAttribute = async () => {
        await form.validateFields(['attributeName', 'widgetType', 'attributeAvailableOptions', 'defaultValue']);

        const values = form.getFieldsValue();
        const { attributeName, widgetType, attributeAvailableOptions, defaultValue } = values;

        const attribute = {
            name: attributeName,
            widgetType: widgetType,
            availableOptions: attributeAvailableOptions.split(','),
            defaultValue: defaultValue
        }

        setAddedAttributes((prev) => [...prev, attribute]);
        form.resetFields(['attributeName', 'widgetType', 'attributeAvailableOptions', 'defaultValue']);
    }




    return (
        <Row>
            <Col span={24}>
                <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                    <Card title='Category Info'>
                        <Row gutter={12}>
                            <Col span={12}>
                                <Form.Item
                                    label="Category Name"
                                    name="name"
                                    rules={[{ required: true, message: 'Category Name is required' }]}
                                >
                                    <Input placeholder="Enter Category Name" />
                                </Form.Item>
                            </Col>

                        </Row>
                    </Card>

                    <Card title="Price Configuration">
                        <Row gutter={12}>

                            {addedPriceConfig.map((config, index) => (
                                <Col span={24} key={index}>
                                    <Flex justify="space-between">
                                        {
                                            Object.entries(config).map(([key, value], index) => {
                                                return (
                                                    <Space direction="horizontal" key={index}>
                                                        <Typography.Text style={{ fontWeight: "bold" }} >{key} ({value.priceType})</Typography.Text>
                                                        <Space>
                                                            {
                                                                value.availableOptions.map((option: string, index) => {
                                                                    return (
                                                                        <Space key={index}>
                                                                            <Typography.Text >{option}</Typography.Text>
                                                                        </Space>
                                                                    )
                                                                })
                                                            }
                                                        </Space>
                                                    </Space>
                                                )
                                            })

                                        }
                                        <Button type="text" onClick={() => setAddedPriceConfig(addedPriceConfig.filter((_, i) => i !== index))}>
                                            <DeleteOutlined />
                                        </Button>
                                    </Flex>
                                </Col>
                                // Delete Button
                            ))}

                            <Col span={12}>
                                {/* Select Price Type */}
                                <Form.Item
                                    label="Price Type"
                                    name="priceType"
                                    rules={[{ required: true, message: 'Price Type is required' }]}
                                >
                                    <Select placeholder="Select Price Type">
                                        {priceTypes.map((priceType, index) => (
                                            <Select.Option key={index} value={priceType}>{priceType}</Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                {/* Enter Price Type Name */}
                                <Form.Item
                                    label="Price Type Name"
                                    name="priceTypeName"
                                    rules={[{ required: true, message: 'Price Type Name is required' }]}
                                >
                                    <Input placeholder="Enter Price Type Name" />
                                </Form.Item>
                            </Col>

                            <Col span={24}>
                                {/* Enter Available options , seprated */}
                                <Form.Item
                                    label="Available Option (Comma Seprated)"
                                    name="availableOptions"
                                    rules={[{ required: true, message: 'Available Options are required' }]}
                                >
                                    <Input placeholder="Enter Available Options" />
                                </Form.Item>
                            </Col>


                            {/* Button to add Price Configuration */}
                            <Space>
                                <Form.Item>
                                    <Button type="primary" onClick={handleAddPriceConfiguration}>Add Price Configuration</Button>
                                </Form.Item>
                            </Space>

                        </Row>
                    </Card>

                    <Card title="Attributes">
                        <Row gutter={12}>
                            {addedAttributes.map((attribute, index) => (
                                <Col span={24} key={index}>
                                    <Flex justify="space-between">
                                        <Space direction="horizontal">
                                            <Typography.Text style={{ fontWeight: "bold" }} >{attribute.name} ({attribute.widgetType})</Typography.Text>
                                            <Space>
                                                {
                                                    attribute.availableOptions.map((option: string, index) => {
                                                        return (
                                                            <Space key={index}>
                                                                <Typography.Text >{option}</Typography.Text>
                                                            </Space>
                                                        )
                                                    })
                                                }
                                            </Space>
                                        </Space>
                                        <Button type="text" onClick={() => setAddedAttributes(addedAttributes.filter((_, i) => i !== index))}>
                                            <DeleteOutlined />
                                        </Button>
                                    </Flex>
                                </Col>
                            ))}
                            <Col span={12}>
                                <Form.Item
                                    label="Attribute Name"
                                    name="attributeName"
                                    rules={[{ required: true, message: 'Attribute Name is required' }]}
                                >
                                    <Input placeholder="Enter Attribute Name" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="Widget Type"
                                    name="widgetType"
                                    rules={[{ required: true, message: 'Widget Type is required' }]}
                                >
                                    <Select placeholder="Select Widget Type">
                                        {attributes.map((attribute, index) => (
                                            <Select.Option key={index} value={attribute}>{attribute}</Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col span={24}>
                                <Form.Item
                                    label="Available Options (Comma Seprated)"
                                    name="attributeAvailableOptions"
                                    rules={[{ required: true, message: 'Available Options are required' }]}
                                >
                                    <Input placeholder="Enter Available Options" />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    label="Default Value"
                                    name="defaultValue"
                                    rules={[{ required: true, message: 'Default Value is required' }]}
                                >
                                    <Input placeholder="Enter Default Value" />
                                </Form.Item>
                            </Col>

                            <Space>
                                <Form.Item>
                                    <Button type="primary" onClick={handleAddAttribute}>Add Attribute</Button>
                                </Form.Item>
                            </Space>
                        </Row>

                    </Card>
                </Space>
            </Col>
        </Row>
    )
}

export default CategoryForm
