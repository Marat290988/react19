import { IOrder } from "@shared/model/order.interface";
import styles from './total-info.module.scss';
import { formatNumberWithSpaces } from "@shared/utils/convert";

export const TotalInfo: React.FC<{order: IOrder}> = ({ order }) => {

  const sumOrderPurchase = order.productOrder.reduce((acc, cur) => acc + (cur.purchasePrice !== '' ? 
    order.purchaseCurrencyName !== '' ? +cur.purchasePrice / +order.purchaseCurrencyRateToUSD : +cur.purchasePrice : 0) 
    * +cur.quantity, 0);

  const sumExpanse = 
    order.expenses.length > 0 ? 
    (order.expenses.reduce((acc, cur) => acc + (cur.currencyName !== '' ? 
      (+cur.price / +cur.currencyRate) : +cur.price), 0) - (order.discount.price !== '' ? 
        (order.discount.currencyName !== '' ? (+order.discount.price / + order.discount.currencyRate) : +order.discount.price) 
        : 0)) 
    : 0;

  const saleSum = (order.productOrder.reduce((acc, cur) => acc + (cur.sellPrice !== '' ? +cur.sellPrice : 0) * +cur.quantity, 0));
  const saleSumUSD = saleSum / (order.currencyRateUZSToUSD !== '' ? +order.currencyRateUZSToUSD : 1); 

  const sumCostPrice = sumOrderPurchase + sumExpanse;

  return (
    <div className={styles['total-info']}>
      <div className={styles['total-info-item']}>
        <div className={styles['total-info-item__name']}>
          PURCHASE TOTAL
        </div>
        <div className={styles['total-info-item__price']}>
          {formatNumberWithSpaces(sumOrderPurchase, 2)} $
        </div>
      </div>
      <div className={styles['total-info-item']}>
        <div className={styles['total-info-item__name']}>
            COST TOTAL
          </div>
          <div className={styles['total-info-item__price']}>
            {formatNumberWithSpaces(sumCostPrice, 2)} $
          </div>
      </div>
      <div className={styles['total-info-item']}>
        <div className={styles['total-info-item__name']}>
            SALE TOTAL
          </div>
          <div className={styles['total-info-item__price']}>
            {formatNumberWithSpaces(saleSumUSD, 2)} $
          </div>
      </div>
      <div className={styles['total-info-item']}>
        <div className={styles['total-info-item__name']}>
            PROFIT
          </div>
          <div className={styles['total-info-item__price']}>
            {formatNumberWithSpaces((saleSumUSD / sumCostPrice - 1) * 100, 2)} %
          </div>
      </div>
    </div>
  )
}