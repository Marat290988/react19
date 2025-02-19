import { useEffect, useState } from 'react';
import { AddPreOrders } from '../../shared/components/add-pre-orders/add-pre-orders';
import styles from './pre-orders.module.scss';
import { Button } from '@mantine/core';
import { PreOrdersService } from '../../api/preorders';
import { useLoadingStore } from '../../store/loading.store';
import { IPreOrder } from '../../shared/model/pre-order.interface';
import { PreOrdersGrid } from './pre-orders-grid/pre-orders-grid';

export const PreOrders: React.FC = () => {

  const [isOpenModal, setIsOpenModal] = useState(false);
  const { setLocalLoading } = useLoadingStore();
  const [preOrders, setPreOrders] = useState<IPreOrder[]>([]);

  useEffect(() => {
    setLocalLoading(true);
    PreOrdersService.getPreOrders().then(preOrders => {
      setPreOrders(preOrders);
      setLocalLoading(false);
    });
  }, []);

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
      <PreOrdersGrid 
        preOrders={preOrders} 
      />
    </div>
  )
}