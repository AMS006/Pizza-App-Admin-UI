import { Breadcrumb, Button, Drawer, Form, Row, Space, Spin, Table, Tag, theme } from "antd"
import { Link } from "react-router-dom"
import { RightOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import CouponFilters from "./CouponFilter";
import { useMemo, useState } from "react";
import CouponForm from "./form/CouponForm";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createCoupon, getAllCoupons, updateCoupon } from "../../http/api";
import { useForm } from "antd/es/form/Form";
import { debounce } from "lodash";
import DeleteCouponModal from "./DeleteCouponModal";

const columns = [
    {
        title: 'Name',
        dataIndex: 'couponCode',
        key: 'couponCode',

    },
    {
        title: 'Discount (%)',
        dataIndex: 'discount',
        key: 'discount',
        render: (text: number) => {
            return <Tag color="blue">{text}%</Tag>
        }
    },
    {
        title: 'Min Order Amount',
        dataIndex: 'minOrderAmount',
        key: 'minOrderAmount',
        render: (text: number) => {
            return <Tag color="purple">₹{text}</Tag>
        }
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (text: string) => {
            if (text === 'active') {
                return <Tag color="green">Active</Tag>
            }
            if (text === 'inactive') {
                return <Tag color="red">In Active</Tag>
            }
        }

    },
    {
        title: "Valid From",
        dataIndex: "validFrom",
        key: "validFrom",
        render: (text: string) => new Date(text).toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
        })
    },
    {
        title: "Valid Till",
        dataIndex: "validTill",
        key: "validTill",
        render: (text: string) => new Date(text).toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
        })
    }
]

const CouponsPage = () => {
    const [form] = useForm();
    const queryClient = useQueryClient();
    const [deleteCouponModalOpen, setDeleteCouponModalOpen] = useState(false);
    const [deleteCoupon, setDeleteCoupon] = useState<Coupon | null>(null);
    const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
    const [title, setTitle] = useState('Create Coupon');
    const [queryParams, setQueryParams] = useState({
        page: '1',
        limit: '6',
        search: '',
    })



    const { data: coupons, isFetching } = useQuery({
        queryKey: ['coupons', queryParams],
        queryFn: () => {
            const query = new URLSearchParams(queryParams);
            return getAllCoupons(query.toString());
        },
        placeholderData: keepPreviousData
    });

    const { mutate: createCouponMutate, isPending: isCreatingCoupon } = useMutation({
        mutationKey: ['createCoupon'],
        mutationFn: async (data: Coupon) => createCoupon(data).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['coupons'] });
            setOpen(false);
            form.resetFields();
        }
    });

    const { mutate: updateCouponMutate, isPending: isUpdatingCoupon } = useMutation({
        mutationKey: ['updateCoupon'],
        mutationFn: async (data: Coupon) => {
            if (selectedCoupon) {
                return updateCoupon(data).then((res) => res.data);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['coupons'] });
            setOpen(false);
            setSelectedCoupon(null);
            form.resetFields();
        }
    });

    const [open, setOpen] = useState(false);
    const { token: { colorBgLayout } } = theme.useToken();

    const handleSubmit = async () => {
        const isEditing = !!selectedCoupon;

        if (isEditing) {
            await form.validateFields();
            updateCouponMutate({ ...form.getFieldsValue(), id: selectedCoupon?._id });
            return;
        }

        await form.validateFields();

        const data = form.getFieldsValue();

        createCouponMutate(data);
    }

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
        if (value?.tenantId) {
            setQueryParams((prev) => ({ ...prev, tenantId: value.tenantId }));
        }
    }

    return (
        <div>
            <DeleteCouponModal open={deleteCouponModalOpen} setOpen={setDeleteCouponModalOpen} coupon={deleteCoupon!} />
            <Row justify={'space-between'}>
                <Breadcrumb
                    separator={<RightOutlined />}
                    items={[{ title: <Link to="/">Dashboard</Link> }, { title: 'Coupons' }]}
                    style={{ margin: '12px 0px' }}
                />
                <Spin spinning={isFetching} />
            </Row>
            <Form onValuesChange={(value: FilterValues) => onFilterChange(value)}>
                <CouponFilters >
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => { setOpen(true); setTitle('Create Coupon') }}>Create Coupon</Button>
                </CouponFilters>
            </Form>
            <Table
                dataSource={coupons?.data?.data || []}
                columns={[...columns,
                {
                    title: "Action",
                    key: "action",
                    render: (_: string, row: Coupon) => {
                        return <Space>

                            <Button
                                onClick={() => {
                                    setDeleteCouponModalOpen(true);
                                    setDeleteCoupon(row);
                                }}
                                type="link"
                                style={{ color: "red" }}>
                                <DeleteOutlined />
                            </Button>
                        </Space>
                    }
                }
                ]}
                rowKey="id"
                pagination={{
                    current: parseInt(queryParams.page),
                    pageSize: parseInt(queryParams.limit),
                    total: coupons?.data?.total,
                    pageSizeOptions: ['6', '12', '24'],
                    showSizeChanger: true,
                    onChange: (page, limit) => setQueryParams({ ...queryParams, page: page.toString(), limit: limit.toString() })

                }}
            />

            <Drawer
                title={title}
                placement="right"
                closable={true}
                onClose={() => { setOpen(false); form.resetFields(); setSelectedCoupon(null) }}
                open={open}
                width={520}
                styles={{ body: { background: colorBgLayout } }}
                extra={
                    <Space>
                        <Button onClick={() => { setOpen(false); form.resetFields() }}>Cancel</Button>
                        <Button type="primary" loading={isCreatingCoupon || isUpdatingCoupon} onClick={handleSubmit}>Submit</Button>
                    </Space>
                }
            >
                <Form layout="vertical" form={form}>
                    <CouponForm />
                </Form>
            </Drawer>
        </div>
    )
}

export default CouponsPage
