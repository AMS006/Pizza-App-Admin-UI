import { useState } from 'react';
import { Modal, message } from 'antd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteUser } from '../../http/api';
import { AxiosError } from 'axios';

interface DeleteUserProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    user: User;
}

const DeleteUserModal = ({ open, setOpen, user }: DeleteUserProps) => {

    const queryClient = useQueryClient();


    const [modalText, setModalText] = useState('Are you sure you want to delete this User? This action cannot be undone.');


    const { mutate, isPending } = useMutation({
        mutationKey: ['deleteUser'],
        mutationFn: async (data: User) => deleteUser(data.id).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['allUsers'] });
            setOpen(false);
        },
        onError: (error: AxiosError) => {
            if (error instanceof AxiosError) {
                console.log(error.response?.data);
                setOpen(false);
                message.error("Unable to delete User")
            }
        }

    })

    const handleOk = () => {
        console.log(user);
        setModalText('Deleting User...');
        mutate(user);

    };

    const handleCancel = () => {
        console.log('Clicked cancel button');
        setOpen(false);
    };

    return (
        <>

            <Modal
                title="Delete User"
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

export default DeleteUserModal;