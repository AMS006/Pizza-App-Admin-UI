import { useState } from 'react';
import { Modal, message } from 'antd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteTopping } from '../../http/api';

interface DeleteToppingProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    topping: Topping;
}

const DeleteToppingModal = ({ open, setOpen, topping }: DeleteToppingProps) => {

    const queryClient = useQueryClient();
    const [modalText, setModalText] = useState('Are you sure you want to delete this topping? This action cannot be undone.');

    const { mutate, isPending } = useMutation({
        mutationKey: ['deleteTopping'],
        mutationFn: async (data: Topping) => deleteTopping(data._id).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['toppings'] });
            setOpen(false);
        },
        onError: () => {
            message.error("Unable to delete topping")
        }
    })

    const handleOk = () => {
        console.log(topping);
        setModalText('Deleting topping...');
        mutate(topping);
    };

    const handleCancel = () => {
        console.log('Clicked cancel button');
        setOpen(false);
    };

    return (
        <>

            <Modal
                title="Delete Topping"
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

export default DeleteToppingModal;