import { useState } from 'react';
import { Modal, message } from 'antd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCategory } from '../../http/api';

interface DeleteCategoryProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    category: Category;
    setSelectedCategory: (product: Category | null) => void;
}

const DeleteCategory = ({ open, setOpen, category, setSelectedCategory }: DeleteCategoryProps) => {

    const queryClient = useQueryClient();
    const [modalText, setModalText] = useState('Are you sure you want to delete this category? This action cannot be undone.');

    const { mutate, isPending } = useMutation({
        mutationKey: ['deleteCategory'],
        mutationFn: async (data: Category) => deleteCategory(data._id).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            setOpen(false);
            setSelectedCategory(null);
        },
        onError: () => {
            message.error("Unable to delete category");

        }
    })

    const handleOk = () => {
        setModalText('Deleting category...');
        mutate(category);
    };

    const handleCancel = () => {
        console.log('Clicked cancel button');
        setOpen(false);
    };

    return (
        <>

            <Modal
                title="Delete Categgoy"
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

export default DeleteCategory;