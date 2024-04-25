import { Card, Form, Radio, Switch } from "antd";
import { getCategory } from "../../../http/api";
import { useQuery } from "@tanstack/react-query";

interface AttributesProps {
    selectedCategory: string
}
const Attributes = ({ selectedCategory }: AttributesProps) => {

    const { data: category } = useQuery<Category | null>(
        {
            queryKey: ['category', selectedCategory],
            queryFn: () => getCategory(selectedCategory).then((res) => res.data),
            staleTime: 1000 * 60 * 5, // 5 minutes
        }
    )



    if (!category) return null;


    return (
        <Card title="Attributes">
            {category.attributes.map((attribute: Attribute) => (
                <Form.Item
                    label={attribute.name}
                    key={attribute.name}
                    name={['attributes', attribute.name]}
                    initialValue={attribute.defaultValue}

                >
                    {attribute.widgetType === 'radio' ? (
                        <Radio.Group>
                            {attribute.availableOptions.map((option: string) => (
                                <Radio.Button value={option} key={option}>{option}</Radio.Button>
                            ))}
                        </Radio.Group>
                    ) : (
                        <Switch checkedChildren="Yes" unCheckedChildren="No" defaultChecked={false} />
                    )}
                </Form.Item>

            ))}
        </Card>
    )
}

export default Attributes
