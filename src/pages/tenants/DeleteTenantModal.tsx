import { useState } from 'react';
import { Modal, message } from 'antd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteTenant } from '../../http/api';

interface DeleteTenantModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    tenant: Tenant;
}

const DeleteTenantModal = ({ open, setOpen, tenant }: DeleteTenantModalProps) => {

    const queryClient = useQueryClient();
    const [modalText, setModalText] = useState('Are you sure you want to delete this tenant? This action cannot be undone.');

    const { mutate, isPending } = useMutation({
        mutationKey: ['deleteTenant'],
        mutationFn: async (data: Tenant) => deleteTenant(data.id).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tenants'] });
            setOpen(false);
        },
        onError: () => {
            message.error("Unable to delete tenant")
        }
    })

    const handleOk = () => {
        console.log(tenant);
        setModalText('Deleting tenant...');
        mutate(tenant);
    };

    const handleCancel = () => {
        console.log('Clicked cancel button');
        setOpen(false);
    };

    return (
        <>

            <Modal
                title="Delete Tenant"
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

export default DeleteTenantModal;