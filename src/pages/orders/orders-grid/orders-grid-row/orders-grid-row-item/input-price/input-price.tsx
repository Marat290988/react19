import { useEffect, useRef, useState } from 'react';
import { IProductOrder } from '../../../../../../shared/model/order.interface';
import styles from './input-price.module.scss';

export enum InputPriceField {
  SELL_PRICE = 'sellPrice',
  PURCHASE_PRICE = 'purchasePrice',
}

interface IInputPriceProps {
  product: IProductOrder,
  onChangePrice: (product: IProductOrder) => void,
  field: 'sellPrice' | 'purchasePrice',
}

export const InputPriceOrder: React.FC<IInputPriceProps> = ({ product, onChangePrice, field }) => {

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [value, setValue] = useState(product[field]);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (inputRef.current) {
      Inputmask({
        placeholder: '',
        alias: 'numeric',
        digits: 2,
      }).mask(inputRef.current);
    }
  }, []);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      if (product![field] === value) {
        return;
      }
      product![field] = value;
      onChangePrice(product!);
    }, 500);
  }, [value])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  return (
    <input
      className={styles['input-price']}
      onChange={handleChange}
      ref={inputRef}
      value={value}
      style={{ backgroundColor: (value === '' || !!value === false ) ? 'var(--red-light)' : '' }}
    />
  )
}