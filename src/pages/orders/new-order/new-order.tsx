import { useEffect, useState } from 'react';
import { IOrder } from '../../../shared/model/order.interface';
import styles from './new-order.module.scss';
import { Currency } from './currency/currency';

const getInitState = ():IOrder => {
  return {
    productOrder: [],
    expenses: [],
    currencyName: '$',
    currencyRate: '',
    purchaseCurrencyRateToUSD: '',
    discount: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

export const NewOrder: React.FC = () => {

  const [order, setOrder] = useState<IOrder>(getInitState());

  useEffect(() => {
    fetch('https://cbu.uz/ru/arkhiv-kursov-valyut/json/')
      .then(response => response.json())
      .then(
        (data: {Rate: string, Ccy: string}[]) => {
          const findUsdCurrency = data.find(item => item.Ccy === 'USD');
          if (findUsdCurrency) {
            setOrder(prevVal => ({...prevVal, currencyRate: findUsdCurrency.Rate, currencyName: '$'}));
          }
        })
        .catch(error => console.error('Error:', error));
  }, []);

  const updateOrder = (order: IOrder) => {
    setOrder(order);
  }

  return (
    <div className={styles['new-order']}>
      <Currency 
        productOrder={order} 
        updateOrder={updateOrder} 
      />
    </div>
  );
}