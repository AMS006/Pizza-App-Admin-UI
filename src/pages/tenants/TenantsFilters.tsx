import { Card, Row, Col, Input, } from 'antd'

type TenantsFiltersProps = {
    children: React.ReactNode
}
const TenantsFilters = ({ children }: TenantsFiltersProps) => {
    return (
        <Card>
            <Row justify={'space-between'}>
                <Col span={8}>

                    <Input.Search
                        allowClear={true}
                        placeholder="Search..."
                    />

                </Col>
                <Col>
                    {children}
                </Col>
            </Row>
        </Card>
    )
}

export default TenantsFilters