import { useRef, useState } from 'react';
import { IProduct } from '../../../api/product';
import styles from './select-product.module.scss';
import useProductStore from '../../../store/product.store';

interface ISelectProduct {
  value: string;
  onSelect: (product: IProduct | string) => void;
}

export const SelectProduct: React.FC<ISelectProduct> = ({ onSelect, value: initValue }) => {

  const [value, setValue] = useState<string>(initValue || '');
  const [isSearch, setIsSearch] = useState<boolean>(false);
  const { products: storageProducts, } = useProductStore();
  const contRef = useRef<HTMLInputElement>(null);
  const productRef = useRef<IProduct | null>(null);

  let width = '';
  if (contRef.current) {
    width = (contRef.current.getBoundingClientRect().width) + 'px';
  }

  const searchedProducts: IProduct[] = value === '' ? [] : storageProducts.filter(p => p.name.toLowerCase().includes(value.toLowerCase()));

  const onSelectProduct = (product: IProduct) => {
    setValue(product.name);
    productRef.current = product;
    if (onSelect) {
      onSelect(product);
    }
  }

  const onBlurInput = () => {
    setTimeout(() => {
      setIsSearch(false);
      if (productRef.current) {
        return;
      }
      onSelect && onSelect(value);
    }, 200)
  }

  return (
    <div className={styles['select-product']} ref={contRef}>
      <input 
        value={value}
        onChange={e => {setValue(e.target.value); productRef.current = null;}}
        style={{ backgroundColor: value === '' ? 'var(--red-light)' : '' }}
        onFocus={() => setIsSearch(true)}
        onBlur={() => onBlurInput()}
      />
      {(searchedProducts.length > 0 && isSearch) && <>
        <ul style={{ width: width }}>
          {searchedProducts.map(p => <li key={p.id} onClick={() => onSelectProduct(p)}>{p.name}</li>)}
        </ul>
      </>}
    </div>
  );
}