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
  const [editedPreOrderItem, setEditedPreOrderItem] = useState<IPreOrder | null>(null);

  useEffect(() => {
    setLocalLoading(true);
    PreOrdersService.getPreOrders().then(preOrders => {
      setPreOrders(preOrders);
      setLocalLoading(false);
    });
  }, []);

  const onCloseModal = (preOrderItem?: IPreOrder) => {
    setIsOpenModal(false);
    setEditedPreOrderItem(null);
    if (preOrderItem) {
      const findIndex = preOrders.findIndex(item => item.fbId === preOrderItem.fbId);
      if (findIndex > -1) {
        setPreOrders(prevState => {
          prevState[findIndex] = preOrderItem;
          return [...prevState];
        })
      } else {
        setPreOrders([...preOrders, preOrderItem]);
      }
    }
  }

  const openEditModal = (preOrderItem: IPreOrder) => {
    setEditedPreOrderItem(preOrderItem);
    setIsOpenModal(true);
  }

  const updatePreOrder = (preOrderItem: IPreOrder) => {
    PreOrdersService.updatePreOrder(preOrderItem).then(res => {
      if (res && res === 'OK') {
        setPreOrders(prevState => {
          const findIndex = prevState.findIndex(item => item.fbId === preOrderItem.fbId);
          if (findIndex > -1) {
            prevState[findIndex] = preOrderItem;
          }
          return [...prevState];
        })
      }
    })
  }

  const removePreOrder = (preOrderItem: IPreOrder) => {
    return PreOrdersService.removeClients(preOrderItem).then(res => {
      if (res && res === 'OK') {
        setPreOrders(prevState => {
          return prevState.filter(item => item.fbId !== preOrderItem.fbId);
        })
      }
    })
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
        preOrderItem={editedPreOrderItem}
      />
      <PreOrdersGrid 
        preOrders={preOrders} 
        updatePreOrder={updatePreOrder}
        openEditModal={openEditModal}
        removePreOrder={removePreOrder}
      />
    </div>
  )
}