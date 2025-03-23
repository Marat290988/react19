import { IExpense, IOrder } from '@shared/model/order.interface';
import styles from './expenses.module.scss';
import { useDisclosure } from '@mantine/hooks';
import { Button, Modal, TextInput } from '@mantine/core';
import { useRef, useState } from 'react';
import { PriceInput } from '@shared/components/price-input/price-input';
import { formatNumberWithSpaces } from '@shared/utils/convert';
import { EditIcon } from '@shared/components/icons/edit';
import { RemoveIcon } from '@shared/components/icons/remove';

interface IExpensesProps {
  order: IOrder,
  addExpense: (expense: IExpense) => void,
  updateOrder: (order: IOrder) => void,
}

export const Expenses: React.FC<IExpensesProps> = ({ order, addExpense, updateOrder }) => {

  const [opened, { open, close }] = useDisclosure(false);
  const [openedDiscount, { open: openDiscount, close: closeDiscount }] = useDisclosure(false);
  const [editedExpense, setEditedExpense] = useState<(IExpense & { nameTouched: boolean, priceTouched: boolean }) | null>(null);
  const [discount, setDiscount] = useState<IOrder['discount'] & { priceTouched?: boolean, }>({ ...order.discount, priceTouched: false });
  const isEdit = useRef(false);

  const openModal = (expanse?: IExpense) => {
    if (expanse) {
      isEdit.current = true;
      setEditedExpense({ ...expanse, nameTouched: true, priceTouched: true });
    } else {
      isEdit.current = false;
      setEditedExpense({
        name: '',
        price: '',
        currencyName: '',
        currencyRate: '',
        nameTouched: false,
        priceTouched: false,
        id: crypto.randomUUID(),
      });
    }
    open();
  }

  const onChangePrice = (price: string) => {
    setEditedExpense((prevVal: any) => {
      return { ...prevVal, price, priceTouched: true };
    });
  }

  const onChangeDiscount = (price: string) => {
    setDiscount((prevVal: any) => {
      return {...prevVal, price, priceTouched: true };
    })
  }

  const onChangeCurrency = (currencyRate: string) => {
    setEditedExpense((prevVal: any) => {
      return { ...prevVal, currencyRate };
    });
  }

  const onChangeCurrencyDiscount = (currencyRate: string) => {
    setDiscount((prevVal: any) => {
      return { ...prevVal, currencyRate };
    });
  }

  const add = () => {
    addExpense({
      currencyName: editedExpense!.currencyName,
      currencyRate: editedExpense!.currencyRate,
      name: editedExpense!.name,
      price: editedExpense!.price,
      id: editedExpense!.id
    })
    close();
  }

  const update = () => {
    const index = order.expenses.findIndex(item => item.id === editedExpense!.id);
    if (index === -1) return;
    order.expenses[index] = {
      ...order.expenses[index],
      name: editedExpense!.name,
      price: editedExpense!.price,
      currencyName: editedExpense!.currencyName,
      currencyRate: editedExpense!.currencyRate,
    }
    order.expenses = [...order.expenses];
    updateOrder(order);
    close();
  }

  const deleteItem = (index: number) => {
    order.expenses.splice(index, 1);
    updateOrder(order);
  }

  const saveDiscount = () => {
    const tempDiscount = {...discount};
    delete tempDiscount.priceTouched;
    order.discount = tempDiscount;
    updateOrder(order);
    closeDiscount();
  }

  const isDisabled = !!editedExpense === false ||
    editedExpense.name === '' ||
    editedExpense.price === '' ||
    (editedExpense.currencyName === '' && editedExpense.currencyRate !== '') ||
    (editedExpense.currencyName !== '' && editedExpense.currencyRate === '');
  const isDisabledDiscount =  
    (discount.currencyName === '' && discount.currencyRate !== '') ||
    (discount.currencyName !== '' && discount.currencyRate === '');

  return (
    <div className={styles['expenses']}>
      {order.expenses.length === 0 && <p>There are no expenses added yet.</p>}
      {order.expenses.map((exp, i) => (<div key={exp.id} className={styles['expenses__item']}>
        <div className={styles['expenses__item-name']}>{exp.name}</div>
        <div className={styles['expenses__item-price']}>{exp.currencyName !== '' ? formatNumberWithSpaces(+exp.price / +exp.currencyRate, 2) : formatNumberWithSpaces(+exp.price, 2)} $</div>
        <div
          className={styles['expenses__item-action']}
          onClick={() => openModal(exp)}
        >
          <EditIcon />
        </div>
        <div
          className={styles['expenses__item-action-remove']}
          onClick={() => deleteItem(i)}
        >
          <RemoveIcon />
        </div>
      </div>))}
      {order.discount.price !== '' && <div className={styles['expenses__item']}>
        <div className={styles['expenses__item-name']}>Discount</div>
        <div className={styles['expenses__item-price']}>{discount.currencyName !== '' ? formatNumberWithSpaces(+discount.price / +discount.currencyRate, 2) : formatNumberWithSpaces(+discount.price, 2)} $</div>
      </div>}
      <div className={styles['expenses__add-button']}>
        <button onClick={() => openModal()}>Add expense</button>
        <button onClick={() => openDiscount()}>Add / Edit discount</button>
      </div>
      <Modal
        title="Discount"
        opened={openedDiscount}
        onClose={closeDiscount}
        centered
      >
        <div className={styles['expenses__body']}>
          <PriceInput
            onChangePrice={onChangeDiscount}
            price={discount.price}
            label="Discoount"
          />
          <TextInput
            value={discount.currencyName}
            label="Currency name"
            placeholder="Currency name"
            onInput={(e) => setDiscount(prevVal => ({ ...prevVal!, currencyName: (e.target as any).value }))}
            error={discount.currencyRate !== '' && discount.currencyName === ''}
          />
          <PriceInput
            onChangePrice={onChangeCurrencyDiscount}
            hasError={discount.currencyRate === '' && discount.currencyName !== ''}
            price={discount.currencyRate}
            label="Currency / Currency rate = 1$"
          />
          <div className={styles['expenses__body-buttons']}>
            <Button
              disabled={isDisabledDiscount}
              onClick={saveDiscount}
            >
              Save
            </Button>
          </div>
        </div>
      </Modal>
      <Modal
        title="Add / Edit Expense"
        opened={opened}
        onClose={close}
        centered
      >
        {
          editedExpense && <>
            <div className={styles['expenses__body']}>
              <TextInput
                value={editedExpense.name}
                label="Expense name"
                placeholder="Expense name"
                onBlur={() => setEditedExpense(prevVal => ({ ...prevVal!, nameTouched: true }))}
                onInput={(e) => setEditedExpense(prevVal => ({ ...prevVal!, name: (e.target as any).value }))}
                error={editedExpense.nameTouched && editedExpense.name === ''}
              />
              <PriceInput
                onChangePrice={onChangePrice}
                hasError={editedExpense.priceTouched && editedExpense.price === ''}
                price={editedExpense.price}
                label="Expense price"
              />
              <TextInput
                value={editedExpense.currencyName}
                label="Currency name"
                placeholder="Currency name"
                onInput={(e) => setEditedExpense(prevVal => ({ ...prevVal!, currencyName: (e.target as any).value }))}
                error={editedExpense.currencyRate !== '' && editedExpense.currencyName === ''}
              />
              <PriceInput
                onChangePrice={onChangeCurrency}
                hasError={editedExpense.currencyRate === '' && editedExpense.currencyName !== ''}
                price={editedExpense.currencyRate}
                label="Currency / Currency rate = 1$"
              />
              <div className={styles['expenses__body-buttons']}>
                <Button
                  disabled={isDisabled}
                  onClick={isEdit.current ? update : add}
                >
                  Save
                </Button>
              </div>
            </div>
          </>
        }
      </Modal>
    </div>
  )
}