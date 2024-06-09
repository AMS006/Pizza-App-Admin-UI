import { Col, Flex, Image, Typography } from "antd";


interface OrderItemCardProps {
    orderItem: OrderItemType;
}
const OrderItemCard = ({ orderItem }: OrderItemCardProps) => {
    return (
        <Flex justify="space-between">
            <Flex gap={16}>
                <Image src={orderItem.image} alt={orderItem.name} height={60} width={60} />
                <Flex vertical gap={0}>
                    <Typography.Text strong>{orderItem.name}</Typography.Text>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {
                            Object.entries(orderItem.chosenConfiguration.priceConfiguration)
                                .map(([key, value], index) => {
                                    return (
                                        <Typography.Text key={index}>
                                            {key} : {value}
                                        </Typography.Text>
                                    )
                                })
                        }
                        <Flex gap={2}>
                            <Typography.Text>
                                Toppings:
                            </Typography.Text>
                            {
                                orderItem.chosenConfiguration.selectedToppings.map((topping, index) => (
                                    <Typography.Text key={index}>
                                        {topping.name}
                                    </Typography.Text>
                                ))
                            }
                        </Flex>
                    </div>
                </Flex>
            </Flex>

            <Col>
                <Typography.Text strong>
                    {orderItem.qty} x ₹{(orderItem.totalPrice / orderItem.qty).toFixed(2)} = ₹{orderItem.totalPrice}
                </Typography.Text>
            </Col>

        </Flex>
    )
}

export default OrderItemCard
