import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { OrdersNav } from './orders-nav/orders-nav';
import styles from './orders.module.scss';
import { Path, PathOrder } from '../../shared/model/path.enum';
import { NewOrder, WatchOrder } from './new-order/new-order';
import { OrderList } from './orders-list/order-list';

export const Orders: React.FC = () => {

  return (
    <div className={styles['orders-page']}>
      <OrdersNav />
      <Routes>
        <Route path={PathOrder.NEW} element={<NewOrder />} />
        <Route path={PathOrder.WATCH + '/:id'} element={<WatchOrder />} />
        <Route path={PathOrder.ORDERSLIST} element={<OrderList />} />
        <Route path={'*'} element={<Navigate to={'/' + Path.ORDERS + '/' + PathOrder.NEW} />} />
      </Routes>
      <Outlet />
    </div>
  )
}