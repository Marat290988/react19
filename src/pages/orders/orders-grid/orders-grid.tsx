import { useState } from 'react';
import { IOrder } from '../../../shared/model/order.interface';
import { OrdersGridHeader } from './orders-grid-header/orders-grid-header';
import { OrdersGridRow } from './orders-grid-row/orders-grid-row';
import styles from './orders-grid.module.scss';

interface IOrdersGridProps {
  order: IOrder,
  updateOrder: (order: IOrder) => void,
}

export const OrdersGrid: React.FC<IOrdersGridProps> = ({ order, updateOrder }) => {

  const [isEdit, _setIsEdit] = useState(true);

  return (
    <div className={styles['orders-grid']}>
      <OrdersGridHeader order={order} />
      <OrdersGridRow order={order} isEdit={isEdit} updateOrder={updateOrder} />
    </div>
  )
}