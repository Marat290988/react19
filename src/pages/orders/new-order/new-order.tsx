import { useEffect, useState } from 'react';
import { IOrder } from '../../../shared/model/order.interface';
import styles from './new-order.module.scss';
import { Currency } from './currency/currency';
import { OrdersGrid } from '../orders-grid/orders-grid';
import { Button } from '@mantine/core';

const getInitState = ():IOrder => {
  return {
    productOrder: [{
      id: crypto.randomUUID(),
      name: '',
      clientContacts: '',
      clientId: '',
      clientName: '',
      productId: '',
      purchasePrice: '',
      quantity: 1,
      sellPrice: '',
    }],
    expenses: [],
    purchaseCurrencyName: '',
    currencyRateUZSToUSD: '',
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
            setOrder(prevVal => ({...prevVal, currencyRateUZSToUSD: findUsdCurrency.Rate}));
          }
        })
        .catch(error => console.error('Error:', error));
  }, []);

  const updateOrder = (order: IOrder) => {
    setOrder({...order});
  }

  const addNewProduct = () => {
    setOrder(prevVal => {
      return {
        ...prevVal,
        productOrder: [...prevVal.productOrder, getInitState().productOrder[0]]
      };
    })
  }

  return (
    <div className={styles['new-order']}>
      <Currency 
        productOrder={order} 
        updateOrder={updateOrder} 
      />
      <OrdersGrid 
        order={order}
        updateOrder={updateOrder}
      />
      <div>
        <Button variant='filled'
          onClick={addNewProduct}
        >
          Add new product row
        </Button>
      </div>
    </div>
  );
}