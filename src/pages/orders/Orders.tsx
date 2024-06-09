import { Breadcrumb, Form, Row, Spin, Table, Tag, } from "antd"
import { Link } from "react-router-dom"
import { RightOutlined } from '@ant-design/icons';
import OrderFilter from "./OrderFilter";
import { useMemo, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getAllOrders, } from "../../http/api";
import { debounce } from "lodash";
import { useAuth } from "../../store";

const columns = [
    {
        title: 'Order Id',
        dataIndex: 'orderId',
        key: 'orderId',
        render: (text: string) => {
            const id = text.split('ORD-')[1];
            return <Link to={`/orders/${id}`}>{text}</Link>
        }
    },
    {
        title: 'Customer Name',
        dataIndex: 'customerName',
        key: 'customerName',

    },
    {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
        render: (address: AddressType) => {
            return (
                <p>{address.addressLine1}</p>
            )
        }

    },
    {
        title: 'Order Status',
        dataIndex: 'orderStatus',
        key: 'orderStatus',
        render: (text: string) => {
            if (text === 'Ordered') {
                return <Tag color="blue">Ordered</Tag>
            }
            if (text === 'Prepared') {
                return <Tag color="purple">Prepared</Tag>
            }
            if (text === 'Delivered') {
                return <Tag color="green">Delivered</Tag>
            }
            if (text === 'Out for delivery') {
                return <Tag color="orange">Out for delivery</Tag>
            }
            if (text === 'Cancelled') {
                return <Tag color="red">Cancelled</Tag>
            }

        }

    },
    {
        title: "Restaurant name",
        dataIndex: "restaurantName",
        key: "restaurantName",
    },
    {
        title: "Placed Time",
        dataIndex: "orderDate",
        key: "orderDate",
        render: (text: string) => new Date(text).toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
        })
    }
]

const OrdersPage = () => {

    const { user } = useAuth();

    const [queryParams, setQueryParams] = useState({
        page: '1',
        limit: '6',
        search: '',
        tenantId: user?.role === 'manager' ? String(user.tenant.id) : '',
    })



    const { data: orders, isFetching } = useQuery({
        queryKey: ['orders', queryParams],
        queryFn: () => {
            const query = new URLSearchParams(queryParams);
            return getAllOrders(query.toString());
        },
        placeholderData: keepPreviousData
    });


    const debouncedQUpdate = useMemo(() => {
        return debounce((value: string) => {
            setQueryParams((prev) => ({ ...prev, search: value, page: '1' }));
        }, 500);
    }, []);

    const onFilterChange = (value: FilterValues) => {
        debouncedQUpdate(value.search || '');
        console.log(value);
        if (value?.tenantId === undefined) {
            setQueryParams((prev) => ({ ...prev, tenantId: '' }));
        }
        if (value?.orderStatus) {
            setQueryParams((prev) => ({ ...prev, orderStatus: value.orderStatus }));
        }
        if (value?.tenantId) {
            setQueryParams((prev) => ({ ...prev, tenantId: value.tenantId || '' }));
        }
    }

    return (
        <div>
            <Row justify={'space-between'}>
                <Breadcrumb
                    separator={<RightOutlined />}
                    items={[{ title: <Link to="/">Dashboard</Link> }, { title: 'Coupons' }]}
                    style={{ margin: '12px 0px' }}
                />
                <Spin spinning={isFetching} />
            </Row>
            <Form onValuesChange={(value: FilterValues) => onFilterChange(value)}>
                <OrderFilter />
            </Form>
            <Table
                dataSource={orders?.data?.data || []}
                columns={columns}

                rowKey="id"
                pagination={{
                    current: parseInt(queryParams.page),
                    pageSize: parseInt(queryParams.limit),
                    total: orders?.data?.total,
                    pageSizeOptions: ['6', '12', '24'],
                    showSizeChanger: true,
                    onChange: (page, limit) => setQueryParams({ ...queryParams, page: page.toString(), limit: limit.toString() })

                }}
            />


        </div>
    )
}

export default OrdersPage
