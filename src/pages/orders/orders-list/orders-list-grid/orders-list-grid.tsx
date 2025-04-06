import { IOrder } from '@shared/model/order.interface';
import styles from './orders-list-grid.module.scss';
import { OrdersListGridRow } from './orders-list-grid-row/orders-list-grid-row';

const gridTemplateColumns = 'minmax(200px, auto) 200px 200px 200px 200px';

interface IOrdersListGridProps {
  orders: IOrder[],
}

export const OrdersListGrid: React.FC<IOrdersListGridProps> = ({ orders }) => {

  const sortedOrder = orders.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  return (
    <>
      {
        sortedOrder.length > 0 && (
          <>
            <div className={styles['orders-list-grid']}>
              <div
                style={{ gridTemplateColumns: gridTemplateColumns }}
                className={styles['orders-list-grid__header']}
              >
                <div className={styles['orders-list-grid__header-cell']}>Date</div>
                <div className={styles['orders-list-grid__header-cell']}>Cost</div>
                <div className={styles['orders-list-grid__header-cell']}>Sale</div>
                <div className={styles['orders-list-grid__header-cell']}>Profit</div>
                <div className={styles['orders-list-grid__header-cell']}>%</div>
              </div>
              {sortedOrder.map(o => (
                <OrdersListGridRow order={o} gridTemplateColumns={gridTemplateColumns} key={o.fbId} />
              ))}
            </div>
          </>

        )
      }
      {sortedOrder.length === 0 && <p className={styles['no-orders']}>There are no orders</p>}
    </>
  )
}