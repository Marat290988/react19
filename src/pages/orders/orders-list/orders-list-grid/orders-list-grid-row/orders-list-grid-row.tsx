import { IOrder } from '@shared/model/order.interface';
import styles from './orders-list-grid-row.module.scss';
import { formatDate, formatNumberWithSpaces } from '@shared/utils/convert';
import { Link } from 'react-router-dom';
import { Path, PathOrder } from '@shared/model/path.enum';

interface IOrdersListGridRowProps {
  order: IOrder,
  gridTemplateColumns: string,
}

export const OrdersListGridRow: React.FC<IOrdersListGridRowProps> = ({ order, gridTemplateColumns }) => {

  if (!order.expenses) {
    order.expenses = [];
  }

  const sumOrderPurchase = order.productOrder.reduce((acc, cur) => acc + (cur.purchasePrice !== '' ?
    order.purchaseCurrencyName !== '' ? +cur.purchasePrice / +order.purchaseCurrencyRateToUSD : +cur.purchasePrice : 0)
    * +cur.quantity, 0);
  const sumExpanse =
    order.expenses.length > 0 ?
      (order.expenses.reduce((acc, cur) => acc + (cur.currencyName !== '' ?
        (+cur.price / +cur.currencyRate) : +cur.price), 0) - (order.discount.price !== '' ?
          (order.discount.currencyName !== '' ? (+order.discount.price / + order.discount.currencyRate) : +order.discount.price)
          : 0))
      : (order.discount.currencyName !== '' ? -(+order.discount.price / + order.discount.currencyRate) : +order.discount.price);
  const costSum = sumOrderPurchase + sumExpanse;
  const saleSum = order.productOrder.reduce((acc, curr) => acc + (+curr.sellPrice * +curr.quantity) / +order.currencyRateUZSToUSD, 0);
  const profit = saleSum - costSum;
  const profitPercent = (saleSum / costSum - 1) * 100;

  return (
    <div
      className={styles['row']}
      style={{ gridTemplateColumns: gridTemplateColumns }}
    >
      <div className={`${styles['row-cell']}`}>
        <Link to={'/' + Path.ORDERS + '/' + PathOrder.WATCH + '/' + order.fbId}>
          Order From {formatDate(new Date(order.createdAt))}
        </Link>

      </div>
      <div className={`${styles['row-cell']} ${styles['right']}`}>
        {order.allValid ? formatNumberWithSpaces(costSum, 2) : '-'}
      </div>
      <div className={`${styles['row-cell']} ${styles['right']}`}>
        {order.allValid ? formatNumberWithSpaces(saleSum, 2) : '-'}
      </div>
      <div className={`${styles['row-cell']} ${styles['right']}`}>
        {order.allValid ? formatNumberWithSpaces(profit, 2) : '-'}
      </div>
      <div className={`${styles['row-cell']} ${styles['right']}`}>
        {order.allValid ? `${formatNumberWithSpaces(profitPercent, 2)}%` : '-'}
      </div>
    </div>
  )
}