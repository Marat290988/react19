import { useDisclosure } from '@mantine/hooks';
import styles from './add-pre-orders.module.scss';
import { Modal, Textarea } from '@mantine/core';
import { useEffect, useState } from 'react';
import { IPreOrder, PreOrderStatus } from '../../model/pre-order.interface';
import { SelectClient } from '../select-client/select-client';

interface AddPreOrdersProps {
  isOpen: boolean,
  onClose: () => void,
  preOrder?: IPreOrder
}

export const AddPreOrders: React.FC<AddPreOrdersProps> = ({ isOpen, onClose }) => {

  const [opened, { open, close }] = useDisclosure(false);
  const [preOrder, setPreOrder] = useState<IPreOrder & { 
    isTouchedDesc: boolean, 
    isTouchedSalePrice: boolean, 
    isTouchedClientName: boolean 
  }>({
    desc: '',
    salePrice: '',
    status: PreOrderStatus.UNDONE,
    createdAt: '',
    clientName: '',
    clientContacts: '',
    clientfbId: '',
    id: '',
    fbId: '',
    isTouchedDesc: false,
    isTouchedSalePrice: false,
    isTouchedClientName: false,
  });

  useEffect(() => {
    if (isOpen) {
      open();
    }
  }, [isOpen])

  const closeModal = () => {
    close();
    onClose();
  }

  return (
    <div className={styles['add-pre-orders']}>
      <Modal
        title="Add / Edit Pre-order"
        opened={opened}
        onClose={closeModal}
        centered
      >
        <div className={styles['add-pre-orders__body']}>
          <Textarea
            value={preOrder.desc}
            label="Pre-ordered item"
            placeholder="Pre-ordered item"
            onInput={(e) => setPreOrder(prevVal => ({ ...prevVal, desc: (e.target as any).value }))}
            onBlur={() => setPreOrder(prevVal => ({ ...prevVal, isTouchedDesc: true }))}
            error={preOrder.isTouchedDesc && preOrder.desc === ''}
          />
          <SelectClient />
        </div>
      </Modal>
    </div>
  )
}