import { useState } from 'react';
import { Modal, message } from 'antd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { confirmOrder } from '../../http/api';

interface ConfirmOrderModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    id: string;
}

const ConfirmOrderModal = ({ open, setOpen, id }: ConfirmOrderModalProps) => {

    const queryClient = useQueryClient();
    const [modalText, setModalText] = useState('Are you sure you want to confirm this order? This action cannot be undone.');

    const { mutate, isPending } = useMutation({
        mutationKey: ['confirmOrder'],
        mutationFn: () => confirmOrder(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['order', id] });
            setOpen(false);
        },
        onError: () => {
            message.error("Unable to confirm order");
            setModalText('Unable to confirm order');

        }
    });

    const handleOk = () => {
        setModalText('Conforming Order...');
        mutate();
    };

    const handleCancel = () => {
        console.log('Clicked cancel button');
        setOpen(false);
    };

    return (
        <>

            <Modal
                title="Confirm Order"
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

export default ConfirmOrderModal;