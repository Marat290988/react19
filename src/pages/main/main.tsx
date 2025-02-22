import { Link, Outlet, useLocation } from 'react-router-dom';
import styles from './main.module.scss';
import { Path } from '../../shared/model/path.enum';

export const Main: React.FC = () => {

  const location = useLocation();

  return (
    <>
      <main className={styles.main}>
        <div className={styles['main-links']}>
          <div className={`${location.pathname === '/' + Path.PRODUCTS ? styles['main-links__item-active'] : styles['main-links__item']}`}>
            <Link to={'/' + Path.PRODUCTS}>Products</Link>
          </div>
          <div className={`${location.pathname === '/' + Path.CLIENTS ? styles['main-links__item-active'] : styles['main-links__item']}`}>
            <Link to={'/' + Path.CLIENTS}>Clients</Link>
          </div>
          <div className={`${location.pathname === '/' + Path.PREORDERS ? styles['main-links__item-active'] : styles['main-links__item']}`}>
            <Link to={'/' + Path.PREORDERS}>Pre-orders</Link>
          </div>
          <div className={`${location.pathname.includes('/' + Path.ORDERS) ? styles['main-links__item-active'] : styles['main-links__item']}`}>
            <Link to={'/' + Path.ORDERS}>Orders</Link>
          </div>
        </div>
        <Outlet />
      </main>
    </>
  )
}