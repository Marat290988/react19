import { useEffect, useState } from 'react';
import { IExpense, IOrder } from '../../../shared/model/order.interface';
import styles from './new-order.module.scss';
import { Currency } from './currency/currency';
import { OrdersGrid } from '../orders-grid/orders-grid';
import { Button } from '@mantine/core';
import { Expenses } from './expenses/expenses';
import { TotalInfo } from './total-info/total-info';
import { formatDate, getMonthYear } from '@shared/utils/convert';
import { OrderService } from '../../../api/orders';
import { useNavigate, useParams } from 'react-router-dom';
import { Path, PathOrder } from '@shared/model/path.enum';
import { useLoadingStore } from '../../../store/loading.store';
import { ButtonSure } from '@shared/components/custom-grid/sure-button/sure-button';
import { showNotification } from '@shared/utils/notification';
import { DateInput } from '@mantine/dates';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';

const getInitState = (): IOrder => {
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
    discount: {
      price: '',
      currencyName: '',
      currencyRate: '',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    allValid: false,
    keyForSearch: getMonthYear(),
  }
}

export const NewOrder: React.FC = () => {

  const [order, setOrder] = useState<IOrder>(getInitState());
  const [disabled, setDisabled] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { setLocalLoading } = useLoadingStore();
  const [isEdit, setIsEdit] = useState(id ? false : true);

  useEffect(() => {
    if (id) {
      setLocalLoading(true);
      OrderService.getOrder(id).then(order => {
        if (order) {
          if (!order.expenses) {
            order.expenses = [];
          }
          if (!order.productOrder) {
            order.productOrder = [];
          }
          setOrder(order);
          setLocalLoading(false);
        } else {
          setLocalLoading(false);
          navigate('/' + Path.ORDERS + '/' + PathOrder.NEW);
        }
      })
    } else {
      fetch('https://cbu.uz/ru/arkhiv-kursov-valyut/json/')
        .then(response => response.json())
        .then(
          (data: { Rate: string, Ccy: string }[]) => {
            const findUsdCurrency = data.find(item => item.Ccy === 'USD');
            if (findUsdCurrency) {
              setOrder(prevVal => ({ ...prevVal, currencyRateUZSToUSD: findUsdCurrency.Rate }));
            }
          })
        .catch(error => console.error('Error:', error));
    }

  }, []);

  const updateOrder = (order: IOrder) => {
    setOrder({ ...order });
  }

  const addNewProduct = () => {
    setOrder(prevVal => {
      return {
        ...prevVal,
        productOrder: [...prevVal.productOrder, getInitState().productOrder[0]]
      };
    })
  }

  const addExpense = (expense: IExpense) => {
    setOrder(prevVal => {
      return {
        ...prevVal,
        expenses: [...prevVal.expenses, expense],
      }
    });
  }

  const saveOrder = () => {
    let isValid = true;
    order.productOrder.forEach(p => {
      if (p.name === '' || p.purchasePrice === '' || p.sellPrice === '' || p.clientName === '') {
        isValid = false;
      }
    });
    order.allValid = isValid;
    setDisabled(true);
    OrderService.saveOrder({ ...order }).then(key => {
      setDisabled(false);
      navigate('/' + Path.ORDERS + '/' + PathOrder.WATCH + '/' + key);
    })
  }

  const updatePrder = () => {
    setDisabled(true);
    OrderService.updateOrder(order).finally(() => {
      showNotification('Order has been updated');
      setDisabled(false);
      setIsEdit(false);
    });
  }

  const deleteOrder = () => {
    return OrderService.removeOrder(order.fbId!).then(res => {
      if (res && res === 'OK') {
        navigate('/' + Path.ORDERS + '/' + PathOrder.ORDERSLIST);
      }
    });
  }

  return (
    <div className={styles['new-order']}>
      <div className={styles['new-order__header']}>
        <h2>Order from {formatDate(new Date(order.createdAt))}</h2>
        {isEdit && order.fbId && <ButtonSure
          onConfirm={() => deleteOrder()}
          btnConfig={{
            buttonTitle: 'Delete',
            typeAction: 'item',
            buttonColor: 'red',
            isSure: true,
          }}
          title={'Delete'}
        />}
        {isEdit && <DateInput 
          placeholder="Order from"
          value={new Date(order.createdAt)}
          onChange={date => setOrder({ ...order, keyForSearch: getMonthYear(date!), createdAt: date!.toISOString() })}
        />}
      </div>
      {isEdit ? (
        <Currency
          productOrder={order}
          updateOrder={updateOrder}
        />
      ) : (<div>
        <Button variant='filled'
          onClick={() => setIsEdit(true)}
        >
          Edit Order
        </Button>
      </div>)}

      <OrdersGrid
        order={order}
        updateOrder={updateOrder}
        isEditOrder={isEdit}
      />
      {isEdit && (
        <div>
          <Button variant='filled'
            onClick={addNewProduct}
          >
            Add new product row
          </Button>
        </div>
      )}
      <div className={styles['new-order__total']}>
        <Expenses
          order={order}
          addExpense={addExpense}
          updateOrder={updateOrder}
          isEditOrder={isEdit}
        />
        <TotalInfo order={order} />
      </div>
      {isEdit && (
        <div>
          <Button variant='filled'
            onClick={order.fbId ? updatePrder : saveOrder}
            disabled={disabled}
          >
            {order.fbId ? 'Update Order' : 'Save Order'}
          </Button>
        </div>
      )}
    </div>
  );
}

export const WatchOrder: React.FC = () => {
  return <NewOrder />;
}