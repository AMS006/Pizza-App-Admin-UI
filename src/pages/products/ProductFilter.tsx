import { useQuery } from '@tanstack/react-query'
import { Card, Row, Col, Input, Form, Select, Flex, } from 'antd'
import { getAllCategories } from '../../http/api'

type ProductFilterProps = {
    children: React.ReactNode
}
const ProductFilter = ({ children }: ProductFilterProps) => {

    // Fetch all categories

    const { data: categories } = useQuery(
        {
            queryKey: ['categories'],
            queryFn: () => getAllCategories()
        }
    )

    return (
        <Card style={{ marginBottom: '18px' }}>
            <Row justify={'space-between'}>
                <Col>
                    <Flex gap={6}>
                        <Form.Item name='search' style={{ marginBottom: 0 }}>
                            <Input.Search
                                allowClear={true}
                                placeholder="Search..."
                            />
                        </Form.Item>

                        <Form.Item name='category' style={{ marginBottom: 0 }}>
                            <Select placeholder={'Select Category'} allowClear>

                                {categories && categories.data?.map((category: Category) => (
                                    <Select.Option key={category._id} value={category._id}>{category.name}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Flex>
                </Col>
                <Col>
                    {children}
                </Col>
            </Row>
        </Card>
    )
}

export default ProductFilter