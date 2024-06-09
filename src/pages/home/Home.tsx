import { Button, Card, Col, List, Row, Skeleton, Space, Statistic, Tag } from "antd";
import { useAuth } from "../../store";
import { Typography } from 'antd';
import React, { useMemo } from "react";

import { Link } from "react-router-dom";
import salesImg from '../../assets/sales.svg';
import ordersImg from '../../assets/orders.svg';
import recentOrdersImg from '../../assets/recent-orders.svg';
import { useQuery } from "@tanstack/react-query";
import { getRecentOrders, getTotalOrdersSales } from "../../http/api";
import SalesChart from "./SalesChart";
import { getTagColor } from "./utils";

const { Title, Text } = Typography;
interface CardTitleProps {
    title: string;
    PrefixIcon: React.ReactNode;
}





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

    const { data: totalOrders_Sales } = useQuery({
        queryKey: ['totalOrders&Sales'],
        queryFn: getTotalOrdersSales,
    });

    const { data: recentOrders, isFetching: fetchingRecentOrders } = useQuery({
        queryKey: ['recentOrders'],
        queryFn: getRecentOrders,
    });

    const generateRecentOrderArray = useMemo(() => {

        if (recentOrders && recentOrders?.data?.length > 0) {
            return recentOrders?.data.map((order: OrderType) => {
                return {
                    _id: order?._id,
                    OrderSummary: order?.orderItems?.map((item: OrderItemType) => item?.name).join(", "),
                    address: order?.address.addressLine1,
                    amount: order?.orderAmount,
                    status: order?.orderStatus,
                    loading: false,
                }
            })
        }

        return [];

    }, [recentOrders])



    return (
        <div>
            <Title level={4}>Welcome {user?.firstName}😎</Title>
            <Row gutter={16}>
                <Col span={12}>
                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <Card bordered={false}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: "10px" }}>
                                    <img src={ordersImg} alt="orders" />
                                    <Statistic title="Total orders" value={totalOrders_Sales?.data?.totalOrders || 0} />
                                </div>
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card bordered={false}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: "10px" }}>
                                    <img src={salesImg} alt="sales" />
                                    <Statistic
                                        title="Total sales"
                                        value={Number(totalOrders_Sales?.data?.totalSales || 0).toFixed(2)}
                                        precision={2}
                                        prefix="₹"
                                    />
                                </div>
                            </Card>
                        </Col>
                        <Col span={24}>
                            <Card
                                title={<CardTitle title="Sales" PrefixIcon={<img src={salesImg} alt="sales" />} />}
                                bordered={false}>

                                {/* <SalesChart /> */}
                                <SalesChart />
                            </Card>
                        </Col>
                    </Row>
                </Col>
                <Col span={12}>
                    <Card title={<CardTitle title="Recent Orders" PrefixIcon={<img src={recentOrdersImg} alt="orders" />} />} bordered={false}>
                        <List
                            itemLayout="horizontal"
                            dataSource={generateRecentOrderArray}
                            loadMore={true}
                            loading={fetchingRecentOrders}
                            renderItem={(item: RecentOrderType) => (
                                <List.Item>
                                    <Skeleton title={false} loading={false} active>
                                        <List.Item.Meta
                                            title={<Link to={`/orders/${item._id}`}>{item?.OrderSummary}</Link>}
                                            description={item.address}
                                        />
                                        <Row style={{ flex: 1 }} justify={'space-between'}>
                                            <Space>
                                                <Col>
                                                    <Text strong>₹{item.amount}</Text>
                                                </Col>
                                                <Col>
                                                    <Tag color={getTagColor(item.status)} style={{ textTransform: 'capitalize' }}>{item.status}</Tag>
                                                </Col>
                                            </Space>
                                        </Row>
                                    </Skeleton>
                                </List.Item>
                            )}
                        />
                        <div style={{ marginTop: 20 }}>
                            <Button type="link">
                                <Link to="/orders">See all orders</Link>
                            </Button>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default Homepage
