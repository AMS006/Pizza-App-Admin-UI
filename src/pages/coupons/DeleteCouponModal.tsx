import { useState } from 'react';
import { Modal, message } from 'antd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCoupon } from '../../http/api';

interface DeleteCouponModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    coupon: Coupon;
}

const DeleteCouponModal = ({ open, setOpen, coupon }: DeleteCouponModalProps) => {

    const queryClient = useQueryClient();
    const [modalText, setModalText] = useState('Are you sure you want to delete this coupon? This action cannot be undone.');

    const { mutate, isPending } = useMutation({
        mutationKey: ['deleteCoupon'],
        mutationFn: async (data: Coupon) => deleteCoupon(data._id).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['coupons'] });
            setOpen(false);
        },
        onError: () => {
            message.error("Unable to delete coupon")
        }
    })

    const handleOk = () => {
        console.log(coupon);
        setModalText('Deleting coupon...');
        mutate(coupon);
    };

    const handleCancel = () => {
        console.log('Clicked cancel button');
        setOpen(false);
    };

    return (
        <>

            <Modal
                title="Delete Coupon"
                open={open}
                onOk={handleOk}
                confirmLoading={isPending}
                onCancel={handleCancel}
            >
                <p>{modalText}</p>
            </Modal>
        </>
    );
};

export default DeleteCouponModal;