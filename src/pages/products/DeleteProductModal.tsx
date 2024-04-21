import { useState } from 'react';
import { Modal, message } from 'antd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteProduct } from '../../http/api';

interface DeleteProductModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    product: Product;
}

const DeleteProductModal = ({ open, setOpen, product }: DeleteProductModalProps) => {

    const queryClient = useQueryClient();
    const [modalText, setModalText] = useState('Are you sure you want to delete this product? This action cannot be undone.');

    const { mutate, isPending } = useMutation({
        mutationKey: ['deleteProduct'],
        mutationFn: async (data: Product) => deleteProduct(data._id).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            setOpen(false);
        },
        onError: () => {
            message.error("Unable to delete product")
        }
    })

    const handleOk = () => {
        console.log(product);
        setModalText('Deleting product...');
        mutate(product);
    };

    const handleCancel = () => {
        console.log('Clicked cancel button');
        setOpen(false);
    };

    return (
        <>

            <Modal
                title="Delete Product"
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

export default DeleteProductModal;