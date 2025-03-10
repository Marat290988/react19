import { useEffect, useRef, useState } from "react";
import { IProductOrder } from "../../../../../../shared/model/order.interface";
import styles from './product-quantity.module.scss';

interface IProductQuantityProps {
  product?: IProductOrder,
  onChangeQuantity?: (product: IProductOrder) => void,
}

export const ProductQuantity: React.FC<IProductQuantityProps> = ({ product, onChangeQuantity }) => {

  const [currentQuantity, setCurrentQuantity] = useState(product?.quantity || 1);
  const min = 1;
  const max = 999;
  const timerRef = useRef<any>(null);

  const down = () => {
    if (currentQuantity > min) {
      setCurrentQuantity(prev => prev - 1);
    }
  }

  const up = () => {
    if (currentQuantity < max) {
      setCurrentQuantity(prev => prev + 1);
    }
  }

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      if (onChangeQuantity) {
        if (product!.quantity === currentQuantity) {
          return;
        }
        product!.quantity = currentQuantity;
        onChangeQuantity(product!);
      }
    }, 500);
  }, [currentQuantity])

  return (
    <>
      <div className={styles['product-quantity']}>
        <div className={styles['product-quantity__input']}>{currentQuantity}</div>
        <div className={styles['product-quantity__buttons']}>
          <div className={styles['product-quantity__buttons-item']} onClick={down}>
            <svg 
              viewBox="0 0 15 15" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg" 
              style={{ width: '0.8rem', height: '0.8rem' }}
            >
              <path 
                d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z" 
                fill="var(--text)" 
                fillRule="evenodd" 
                clipRule="evenodd">
              </path>
            </svg>
          </div>
          <div className={styles['product-quantity__buttons-item']} onClick={up}>
            <svg 
              viewBox="0 0 15 15" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg" 
              style={{ width: '0.8rem', height: '0.8rem', transform: 'rotate(180deg)' }}
            >
              <path 
                d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z" 
                fill="var(--text)" 
                fillRule="evenodd" 
                clipRule="evenodd">
              </path>
            </svg>
          </div>
        </div>
      </div>
    </>
  )
}