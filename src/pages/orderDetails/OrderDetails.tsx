import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { confirmOrder, getOrder, updateOrderStatus } from "../../http/api";
import Loader from "../../layouts/Loader";
import { useParams } from "react-router-dom";
import OrderHeader from "./OrderHeader";
import { Button, Card, Col, Flex, Popconfirm, Row, Tag, Typography, notification } from "antd";
import OrderItemCard from "./OrderItemCard";
import { createContext, useMemo } from "react";
import type { NotificationArgsProps } from 'antd';

type NotificationPlacement = NotificationArgsProps['placement'];


const Context = createContext({ name: 'Default' });

const OrderDetailsPage = () => {

    const { id } = useParams();
    const [api, contextHolder] = notification.useNotification();


    const { data: orderData, isLoading } = useQuery({
        queryKey: ['order', id],
        queryFn: () => getOrder(id || ''),
        placeholderData: keepPreviousData,

    });

    const queryClient = useQueryClient();
    const { mutate, isPending } = useMutation({
        mutationKey: ['confirmOrder'],
        mutationFn: () => confirmOrder(id || ''),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['order', id] });

        },
        onError: () => {
        }
    });

    const { mutate: updateStatus, isPending: isUpdatingOrderStatus } = useMutation({
        mutationKey: ['updateOrderStatus'],
        mutationFn: (status: string) => updateOrderStatus(id || '', status),
        onSuccess: async () => {
            openNotification('topRight', "Order Status Updated", `Order status updated to ${getOrderStatusButtonText}`);
            queryClient.invalidateQueries({ queryKey: ['order', id] });
        },
        onError: () => {

        }
    })

    const getOrderStatusButtonText = useMemo(() => {
        if (orderData?.data?.orderStatus === 'Ordered') return 'Prepared';
        if (orderData?.data?.orderStatus === 'Prepared') return 'Out for Delivery';
        if (orderData?.data?.orderStatus === 'Out for Delivery') return 'Delivered';
        if (orderData?.data?.orderStatus === 'Delivered') return 'Order Delivered'
        return 'Cancelled';
    }, [orderData]);

    const getOrderStatusAlertText = useMemo(() => {
        if (orderData?.data?.orderStatus === 'Ordered') return 'Are you sure the order is prepared?';
        if (orderData?.data?.orderStatus === 'Prepared') return 'Are you sure the order is out for delivery?';
        if (orderData?.data?.orderStatus === 'Out for Delivery') return 'Are you sure the order is delivered?';

    }, [orderData]);



    const calculateTotalPrice = useMemo(() => {
        if (!orderData) return 0;
        return orderData.data.orderItems.reduce((acc: number, item: OrderItemType) => {
            return acc + item.totalPrice;
        }, 0)
    }, [orderData])

    const openNotification = (placement: NotificationPlacement, message: string, description: string) => {
        api.success({
            message: `${message}`,
            description: `${description}`,
            placement,
        });
    };

    const contextValue = useMemo(() => ({ name: 'Ant Design' }), []);



    if (isLoading) return <Loader />

    return (

        <Context.Provider value={contextValue}>
            {contextHolder}
            <div>
                <OrderHeader orderStatus={orderData?.data?.orderStatus} />

                <Flex gap={16} style={{ marginTop: '10px' }}>
                    {/* Order Details */}
                    <Card title="Order Details" style={{ width: '65%' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {
                                orderData?.data?.orderItems.map((item: OrderItemType) => (
                                    <OrderItemCard key={item._id} orderItem={item} />
                                ))
                            }

                            <Col>
                                <Row justify="end">
                                    <h3>Total: ₹{calculateTotalPrice}</h3>
                                </Row>
                            </Col>

                            {/* Order Confirmation Button */}
                            <Row justify="end">
                                {
                                    orderData?.data?.isConfirmed ? (
                                        <Button type="primary" disabled>Order Confirmed</Button>
                                    ) : (
                                        <Popconfirm
                                            title="Confirm Order?"
                                            description={`Are you sure you want to confirm this order?`}
                                            onConfirm={() => mutate()}
                                            onCancel={() => { }}
                                            okText="Confirm"
                                            cancelText="Cancel"
                                            okButtonProps={{ loading: isPending }}
                                        >
                                            <Button danger>
                                                Confirm
                                            </Button>
                                        </Popconfirm>

                                    )
                                }
                            </Row>

                            {/* Button to change the status of order after confiming order with popconfirm modal */}

                            {orderData?.data?.isConfirmed && <Row justify="end">
                                <Popconfirm
                                    title={getOrderStatusButtonText}
                                    description={getOrderStatusAlertText}
                                    onConfirm={() => updateStatus(getOrderStatusButtonText)}
                                    onCancel={() => { }}
                                    okText="Confirm"
                                    cancelText="Cancel"
                                    okButtonProps={{ loading: isUpdatingOrderStatus }}

                                >
                                    <Button danger disabled={getOrderStatusButtonText === 'Order Delivered' || getOrderStatusButtonText === 'Cancelled'}>
                                        {getOrderStatusButtonText}
                                    </Button>
                                </Popconfirm>
                            </Row>}

                            {/* If Order Delivered then show date and time of delivery */}
                            {orderData?.data?.isDelivered && <Row justify="end">
                                <Typography.Text strong>Delivered on&nbsp;&nbsp;</Typography.Text>
                                <Tag color="orange" >{new Date(orderData?.data?.updatedAt).toLocaleString()}</Tag>
                            </Row>}


                        </div>
                    </Card>

                    {/* Customer Details */}
                    <Flex vertical style={{ width: '35%' }}>
                        <Card title="Customer Details" >
                            <Row gutter={16}>
                                <Col span={12}>
                                    <h3>Customer Name</h3>
                                    <p>{orderData?.data?.addressId.name}</p>
                                </Col>
                                <Col span={12}>
                                    <h3>Phone Number</h3>
                                    <p>{orderData?.data?.addressId.mobile}</p>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={24}>
                                    <h3>Address</h3>
                                    <p>{orderData?.data?.addressId.addressLine1}</p>
                                    <p>{orderData?.data?.addressId?.addressLine2}</p>
                                </Col>
                            </Row>

                            {/* Payment Method  */}
                            <Row gutter={16}>
                                <Col span={24}>
                                    <h3>Payment Method</h3>
                                    <Tag style={{ textTransform: 'uppercase', }}>{orderData?.data?.paymentMethod}</Tag>
                                </Col>
                            </Row>
                        </Card>

                        {/* Display a comment cart if there is any comment */}

                        {
                            orderData?.data?.comment && (
                                <Card title="Comment" style={{ width: '35%', marginTop: '16px' }}>
                                    <p>{orderData?.data?.comment}</p>
                                </Card>
                            )
                        }
                    </Flex>
                </Flex>
            </div>
        </Context.Provider>
    )
}

export default OrderDetailsPage
