import { Link, Outlet, useLocation } from 'react-router-dom';
import styles from './main.module.scss';

export const Main: React.FC = () => {

  const location = useLocation();

  return (
    <>
      <main className={styles.main}>
        <div className={styles['main-links']}>
          <div className={`${location.pathname === '/products' ? styles['main-links__item-active'] : styles['main-links__item']}`}>
            <Link to="/products">Products</Link>
          </div>
        </div>
        <Outlet />
      </main>
    </>
  )
}