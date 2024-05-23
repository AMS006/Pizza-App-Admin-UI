import { useQuery } from "@tanstack/react-query";
import { Card, Form, InputNumber, Space, Typography } from "antd";
import { getCategory } from "../../../http/api";

interface PricingProps {
    selectedCategory: string
}
const Pricing = ({ selectedCategory }: PricingProps) => {

    const { data: category } = useQuery<Category | null>(
        {
            queryKey: ['category', selectedCategory],
            queryFn: () => getCategory(selectedCategory).then((res) => res.data),
            staleTime: 1000 * 60 * 5, // 5 minutes
        }
    )

    if (!category) return null;


    return (
        <Card
            title="Pricing"
        >
            {
                Object.entries(category.priceConfiguration).map(([key, value], index) => {
                    return (
                        <Space direction="vertical" key={index}>
                            <Typography.Text style={{ fontWeight: "bold" }} >{key} ({value.priceType})</Typography.Text>
                            <Space>
                                {
                                    value.availableOptions.map((option: string, index) => {
                                        return (
                                            <Form.Item
                                                label={option}
                                                key={index}
                                                name={['priceConfiguration',
                                                    JSON.stringify(
                                                        {
                                                            key: key,
                                                            priceType: value.priceType
                                                        }
                                                    ),
                                                    option
                                                ]}
                                                rules={[{ required: true, message: `${option} ${key} is Required` }]}
                                            >
                                                <InputNumber
                                                    style={{ width: '100%' }}
                                                    addonAfter="₹"
                                                />
                                            </Form.Item>
                                        )
                                    })
                                }
                            </Space>
                        </Space>
                    )
                })
            }
        </Card>
    )
}

export default Pricing
