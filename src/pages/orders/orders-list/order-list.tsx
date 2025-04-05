import { useLoadingStore } from '../../../store/loading.store';
import { OrderService } from '../../../api/orders';
import { OrdersListPanel } from './orders-list-panel/orders-list-panel';
import styles from './orders-list.module.scss';
import { useState } from 'react';
import { IOrder } from '@shared/model/order.interface';
import { OrdersListGrid } from './orders-list-grid/orders-list-grid';
import { OrdersListTotal } from './orders-litst-total/orders-list-total';

export const OrderList: React.FC = () => {

  const { setLocalLoading } = useLoadingStore();
  const [orders, setOrders] = useState<IOrder[]>([]);

  const getOrdersByYearMonth = (dateKey: string) => {
    setLocalLoading(true);
    OrderService.getOrdersByYearMonth(dateKey).then(resOrders => {
      setOrders(resOrders);
    }).finally(() => {
      setLocalLoading(false);
    })
  }

  return (
    <div className={styles['orders-list']}>
      <OrdersListPanel getOrdersByYearMonth={getOrdersByYearMonth} />
      <OrdersListGrid orders={orders} />
      <OrdersListTotal orders={orders} />
    </div>
  )
}