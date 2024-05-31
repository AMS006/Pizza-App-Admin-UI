import { Breadcrumb, Row } from "antd"
import { Link } from "react-router-dom"
import { RightOutlined } from '@ant-design/icons'
import { Steps } from 'antd';
import { IoMdCart, IoMdPizza, IoMdCheckmark } from "react-icons/io";
import { RiEBike2Fill } from "react-icons/ri";


const OrderHeader = ({ orderStatus }: { orderStatus: string }) => {
    return (
        <Row justify="space-between" align={'middle'}>
            <Breadcrumb
                separator={<RightOutlined />}
                items={[{ title: <Link to="/">Dashboard</Link> }, { title: <Link to="/orders">Orders</Link> }, { title: 'Order Details' },]}
                style={{ margin: '12px 0px' }}
            />

            <div style={{ width: '60%' }}>
                <Steps
                    items={[
                        {
                            title: 'Ordered',
                            status: orderStatus === 'Ordered' ? 'process' : 'finish',
                            icon: <IoMdCart />,
                        },
                        {
                            title: 'Prepared',
                            status: orderStatus === 'Prepared' ? 'process' : orderStatus === 'Ordered' ? 'wait' : 'finish',
                            icon: <IoMdPizza />,
                        },
                        {
                            title: 'Out for Delivery',
                            status: orderStatus === 'Out for Delivery' ? 'process' : orderStatus === 'Delivered' ? 'finish' : 'wait',
                            icon: <RiEBike2Fill />,
                        },
                        {
                            title: 'Delivered',
                            status: orderStatus === 'Delivered' ? 'finish' : 'wait',
                            icon: <IoMdCheckmark />,
                        },
                    ]}
                />
            </div>

        </Row>
    )
}

export default OrderHeader
