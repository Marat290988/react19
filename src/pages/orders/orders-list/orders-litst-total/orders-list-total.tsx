import { IOrder } from '@shared/model/order.interface';
import styles from './orders-list-total.module.scss';
import { formatNumberWithSpaces } from '@shared/utils/convert';

export const OrdersListTotal: React.FC<{orders: IOrder[]}> = ({ orders }) => {

  if (orders.filter(order => order.allValid).length === 0) {
    return <></>;
  }

  let sumOrdersPurchase = 0;
  let sumOrdersExpanse = 0;
  let saleOrdersSum = 0;

  orders.forEach(order => {
    if (order.allValid) {
      if (!order.expenses) {
        order.expenses = [];
      }
      const purchase = order.productOrder.reduce((acc, cur) => acc + (cur.purchasePrice !== '' ?
        order.purchaseCurrencyName !== '' ? +cur.purchasePrice / +order.purchaseCurrencyRateToUSD : +cur.purchasePrice : 0)
        * +cur.quantity, 0);
      sumOrdersPurchase = sumOrdersPurchase + purchase;
      const expanses = order.expenses.length > 0 ?
        (order.expenses.reduce((acc, cur) => acc + (cur.currencyName !== '' ?
          (+cur.price / +cur.currencyRate) : +cur.price), 0) - (order.discount.price !== '' ?
            (order.discount.currencyName !== '' ? (+order.discount.price / + order.discount.currencyRate) : +order.discount.price)
            : 0))
        : (order.discount.currencyName !== '' ? -(+order.discount.price / + order.discount.currencyRate) : +order.discount.price);
      sumOrdersExpanse = sumOrdersExpanse + expanses;
      const saleSum = order.productOrder.reduce((acc, curr) => acc + (+curr.sellPrice * +curr.quantity) / +order.currencyRateUZSToUSD, 0);
      saleOrdersSum = saleOrdersSum + saleSum;
    }
  });

  const costPrice = sumOrdersPurchase + sumOrdersExpanse;
  const profit = saleOrdersSum - costPrice;
  const profitPercent = (saleOrdersSum / costPrice - 1) * 100;


  return (
    <div className={styles['orders-list-total']}>
      <div className={styles['orders-list-total__row']}>
        <div className={styles['orders-list-total__row-item']}>
          TOTAL COST
        </div>
        <div className={styles['orders-list-total__row-item']}>
          {formatNumberWithSpaces(costPrice, 2)} $
        </div>
      </div>
      <div className={styles['orders-list-total__row']}>
        <div className={styles['orders-list-total__row-item']}>
          TOTAL SALE
        </div>
        <div className={styles['orders-list-total__row-item']}>
          {formatNumberWithSpaces(saleOrdersSum, 2)} $
        </div>
      </div>
      <div className={styles['orders-list-total__row']}>
        <div className={styles['orders-list-total__row-item']}>
          PROFIT
        </div>
        <div className={styles['orders-list-total__row-item']}>
          {formatNumberWithSpaces(profit, 2)} $
        </div>
      </div>
      <div className={styles['orders-list-total__row']}>
        <div className={styles['orders-list-total__row-item']}>
          PROFIT, %
        </div>
        <div className={styles['orders-list-total__row-item']}>
          {formatNumberWithSpaces(profitPercent, 2)}%
        </div>
      </div>
    </div>
  )
}