import { Link, useLocation } from 'react-router-dom';
import styles from './orders-nav.module.scss';
import { Path, PathOrder } from '../../../shared/model/path.enum';

export const OrdersNav: React.FC = () => {

  const location = useLocation();

  return (
    <div className={styles['orders-nav']}>
      <Link
        to={'/' + Path.ORDERS + '/' + PathOrder.NEW}
      >
        <div 
          className={`${location.pathname.includes('/' + Path.ORDERS + '/' + PathOrder.NEW) ? styles['active'] : ''} ${styles['orders-nav__item']}`}
        >
          New Order
        </div>
      </Link>
      <div>|</div>
      <div className={styles['orders-nav__item']}>Orders List</div>
      <div>|</div>
      <div className={styles['orders-nav__item']}>Reports</div>
    </div>
  )
}