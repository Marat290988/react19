import { useState } from 'react';
import { AddPreOrders } from '../../shared/components/add-pre-orders/add-pre-orders';
import styles from './pre-orders.module.scss';
import { Button } from '@mantine/core';

export const PreOrders: React.FC = () => {

  const [isOpenModal, setIsOpenModal] = useState(false);

  const onCloseModal = () => {
    setIsOpenModal(false);
  }

  return (
    <div className={styles['pre-orders-content']}>
      <h2>Add Pre-orders Page</h2>
      <div>
        <Button variant="filled" onClick={() => setIsOpenModal(true)}>Add New Pre-order</Button>
      </div>
      <AddPreOrders
        isOpen={isOpenModal}
        onClose={onCloseModal}
      />
    </div>
  )
}