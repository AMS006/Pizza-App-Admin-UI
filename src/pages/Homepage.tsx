import { Button, Card, Col, List, Row, Skeleton, Space, Statistic, Tag } from "antd";
import { useAuth } from "../store";
import { Typography } from 'antd';
import React from "react";

import { BarChartOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";

const { Title, Text } = Typography;
interface CardTitleProps {
    title: string;
    PrefixIcon: React.ReactNode;
}
const list = [
    {
        OrderSummary: 'Peperoni, Margarita ...',
        address: 'Bandra, Mumbai',
        amount: 1200,
        status: 'preparing',
        loading: false,
    },
    {
        OrderSummary: 'Paneer, Chicken BBQ ...',
        address: 'Balurghat, West bengal',
        amount: 2000,
        status: 'on the way',
        loading: false,
    },
    {
        OrderSummary: 'Paneer, Chicken BBQ ...',
        address: 'Balurghat, West bengal',
        amount: 2000,
        status: 'on the way',
        loading: false,
    },
    {
        OrderSummary: 'Paneer, Chicken BBQ ...',
        address: 'Balurghat, West bengal',
        amount: 2000,
        status: 'on the way',
        loading: false,
    },
    {
        OrderSummary: 'Paneer, Chicken BBQ ...',
        address: 'Balurghat, West bengal',
        amount: 2000,
        status: 'on the way',
        loading: false,
    },
    {
        OrderSummary: 'Paneer, Chicken BBQ ...',
        address: 'Balurghat, West bengal',
        amount: 2000,
        status: 'on the way',
        loading: false,
    },
];

const CardTitle = ({ title, PrefixIcon }: CardTitleProps) => {
    return (
        <Space>
            {PrefixIcon}
            {title}
        </Space>
    );
};
const Homepage = () => {
    const { user } = useAuth();

    return (
        <div>
            <Title level={4}>Welcome {user?.firstName}😎</Title>
            <Row gutter={16}>
                <Col span={12}>
                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <Card bordered={false}>
                                <Statistic title="Total orders" value={52} />
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card bordered={false}>
                                <Statistic
                                    title="Total sale"
                                    value={70000}
                                    precision={2}
                                    prefix="₹"
                                />
                            </Card>
                        </Col>
                        <Col span={24}>
                            <Card
                                title={<CardTitle title="Sales" PrefixIcon={<BarChartOutlined />} />}
                                bordered={false}></Card>
                        </Col>
                    </Row>
                </Col>
                <Col span={12}>
                    <Card title={<CardTitle title="Recent Orders" PrefixIcon={<BarChartOutlined />} />} bordered={false}>
                        <List
                            itemLayout="horizontal"
                            dataSource={list}
                            loadMore={true}
                            loading={false}
                            renderItem={(item) => (
                                <List.Item>
                                    <Skeleton title={false} loading={item.loading} active>
                                        <List.Item.Meta
                                            title={<a href="https://ant.design">{item.OrderSummary}</a>}
                                            description={item.address}
                                        />
                                        <Row style={{ flex: 1 }} justify={'space-between'}>
                                            <Space>
                                                <Col>
                                                    <Text strong>₹{item.amount}</Text>
                                                </Col>
                                                <Col>
                                                    <Tag color="blue" style={{ textTransform: 'capitalize' }}>{item.status}</Tag>
                                                </Col>
                                            </Space>
                                        </Row>
                                    </Skeleton>
                                </List.Item>
                            )}
                        />
                        <div style={{ marginTop: 20 }}>
                            <Button type="link">
                                <Link to="/">See all orders</Link>
                            </Button>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default Homepage
