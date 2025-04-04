import { IProduct } from '../../../../../api/product';
import styles from './orders-grid-row-item.module.scss';
import { IOrder, IProductOrder } from '../../../../../shared/model/order.interface';
import { ProductImage } from './product-image/product-image';
import { ProductQuantity } from './product-quantity/product-quantity';
import { InputPriceField, InputPriceOrder } from './input-price/input-price';
import { formatNumberWithSpaces } from '../../../../../shared/utils/convert';
import { OrderSelectClient } from './order-select-client/order-select-client';
import { IClient } from '../../../../../api/clients';
import { SelectProduct } from '@shared/components/select-product/select-product';
import { Popover } from '@mantine/core';
import DOMPurify from 'dompurify';

interface IOrdersGridRowItemProps {
  isEdit: boolean, 
  isAdditionalColumn: boolean,
  updateOrderProduct: (product: IProductOrder) => void,
  product: IProductOrder,
  order: IOrder,
  num: number,
  removeProduct: (product: IProductOrder) => void,
  sumOrderPurchase: number,
  expanse: number,
  isEditOrder: boolean,
}

export const OrdersGridRowItem: React.FC<IOrdersGridRowItemProps> = ({ 
  isAdditionalColumn, 
  updateOrderProduct,
  product,
  order,
  num,
  removeProduct,
  sumOrderPurchase,
  expanse,
  isEditOrder,
}) => {

  const onSelectProduct = (selectProduct: IProduct | string) => {
    if (typeof selectProduct === 'string') {
      product.name = selectProduct as string;
      product.productId = '';
    } else {
      const tempProduct = selectProduct as IProduct;
      product.name = tempProduct.name;
      product.productId = tempProduct.id;
    }
    updateOrderProduct({...product});
  } 

  const onSelectClient = (selectClient: IClient | string) => {
    if (typeof selectClient === 'string') {
      product.clientName = selectClient as string;
      product.clientId = '';
      product.clientContacts = '';
    } else {
      const tempClient = selectClient as IClient;
      product.clientName = tempClient.name;
      product.clientId = tempClient.fbId;
      product.clientContacts = tempClient.contacts;
    }
    updateOrderProduct({...product});
  }

  if (isAdditionalColumn) {
    const costPrice = sumOrderPurchase === 0 ? 0 : 
      (+product.purchasePrice / +order.purchaseCurrencyRateToUSD) / (+sumOrderPurchase / +order.purchaseCurrencyRateToUSD) * expanse + (+product.purchasePrice / +order.purchaseCurrencyRateToUSD);
    return (<>
      <div className={styles['grid-row-item']} style={{ textAlign: 'center'}}>
        <div className={styles['number-item']}>
          <p>{num}</p>
          {isEditOrder && (
            <p className={styles['number-item__svg']} onClick={() => removeProduct(product)}>
              <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 64 64">
                <ellipse cx="32" cy="61" opacity=".3" rx="20" ry="3"></ellipse><path fill="#fd3c4f" d="M42.963,30l8.136-8.135c1.562-1.562,1.562-4.095,0-5.657l-5.306-5.306	c-1.562-1.562-4.095-1.562-5.657,0L32,19.038l-8.136-8.136c-1.562-1.562-4.095-1.562-5.657,0l-5.306,5.306	c-1.562,1.562-1.562,4.095,0,5.657L21.037,30l-8.135,8.135c-1.562,1.562-1.562,4.095,0,5.657l5.305,5.306	c1.562,1.562,4.095,1.562,5.657,0L32,40.963l8.136,8.135c1.562,1.562,4.095,1.562,5.657,0l5.305-5.306	c1.562-1.562,1.562-4.095,0-5.657L42.963,30z"></path><path d="M40.135,49.098c1.562,1.562,4.095,1.562,5.657,0l5.306-5.306	c1.562-1.562,1.562-4.095,0-5.657l-8.136-8.135l3.535-3.535l0,0C45.521,25.488,44.242,25,42.962,25c-1.224,0-2.448,0.447-3.406,1.34	c-2.084,1.943-1.973,5.352,0.042,7.366l7.257,7.256l-3.892,3.892l-7.275-7.274c-1.847-1.847-4.846-2.146-6.86-0.484	c-2.31,1.907-2.432,5.334-0.365,7.402l3.536-3.536L40.135,49.098z" opacity=".15"></path><path fill="#fff" d="M23.864,10.902c-1.562-1.562-4.095-1.562-5.657,0	l-5.306,5.306c-1.562,1.562-1.562,4.095,0,5.657L21.037,30l-3.535,3.535l0,0C18.478,34.512,19.757,35,21.037,35	c1.224,0,2.448-0.447,3.406-1.34c2.084-1.943,1.973-5.352-0.042-7.366l-7.257-7.256l3.892-3.892l7.275,7.274	c1.847,1.846,4.846,2.146,6.86,0.484c2.31-1.907,2.432-5.334,0.365-7.402L32,19.038L23.864,10.902z" opacity=".3"></path><polyline fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="3" points="18.5,15.5 21,13 23.5,15.5"></polyline>
              </svg>
            </p>
          )}
        </div>
      </div>
      <div className={styles['grid-row-item']}>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <ProductImage productId={product.productId} />
          {isEditOrder ? (<SelectProduct value={product.name} onSelect={onSelectProduct} />) : product.name}
        </div>
      </div>
      <div className={styles['grid-row-item']} style={{ textAlign: 'center'}}>
        {isEditOrder ? <ProductQuantity product={product} onChangeQuantity={updateOrderProduct} /> : product.quantity}
      </div>
      <div className={styles['grid-row-item']} style={{ textAlign: 'right'}}>
        {isEditOrder ? <InputPriceOrder product={product} onChangePrice={updateOrderProduct} field={InputPriceField.PURCHASE_PRICE} /> : formatNumberWithSpaces(+product.purchasePrice, 2)}
      </div>
      <div className={styles['grid-row-item']} style={{ textAlign: 'right'}}>{formatNumberWithSpaces((+product.purchasePrice * product.quantity), 2)}</div>
      <div className={styles['grid-row-item']} style={{ textAlign: 'right'}}>{formatNumberWithSpaces((+product.purchasePrice / +order.purchaseCurrencyRateToUSD), 2)}</div>
      <div className={styles['grid-row-item']} style={{ textAlign: 'right'}}>{formatNumberWithSpaces((+product.purchasePrice / +order.purchaseCurrencyRateToUSD * product.quantity), 2)}</div>
      <div className={styles['grid-row-item']} style={{ textAlign: 'right'}}>{formatNumberWithSpaces((+costPrice), 2)}</div>
      <div className={styles['grid-row-item']} style={{ textAlign: 'right'}}>{formatNumberWithSpaces((+costPrice * product.quantity), 2)}</div>
      <div className={styles['grid-row-item']} style={{ textAlign: 'right'}}>
        {isEditOrder ? <InputPriceOrder product={product} onChangePrice={updateOrderProduct} field={InputPriceField.SELL_PRICE} /> : formatNumberWithSpaces(+product.sellPrice, 2)}
      </div>
      <div className={`${styles['grid-row-item']}`} style={{ textAlign: 'right'}}>
        {formatNumberWithSpaces((+product.sellPrice * product.quantity), 2)}
      </div>
      <div className={`${styles['grid-row-item']} ${styles['border-right']}`}>
        {isEditOrder ? <OrderSelectClient value={product.clientName} onSelect={onSelectClient} /> : <>
            {product.clientId !== '' ? <>
              <Popover width={200} position="bottom" shadow="md">
                <Popover.Target>
                  <div className={styles['pre-orders-grid_body__over-target']}>
                    {product.clientName}
                  </div>
                </Popover.Target>
                <Popover.Dropdown>
                  <div className={styles['pre-orders-grid_body__over']}>
                    <p className={styles['contacts']}>Contacts:</p>
                    <p
                      className={styles['contacts__list']}
                      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product.clientContacts) }}
                    ></p>
                  </div>
                </Popover.Dropdown>
              </Popover>
            </> : product.clientName}
          </>}
      </div>
    </>)
  } else {
    const costPrice = sumOrderPurchase === 0 ? 0 : +product.purchasePrice / +sumOrderPurchase * expanse + +product.purchasePrice;
    return (<>
      <div className={styles['grid-row-item']} style={{ textAlign: 'center'}}>
        <div className={styles['number-item']}>
          <p>{num}</p>
          {isEditOrder && (
            <p className={styles['number-item__svg']} onClick={() => removeProduct(product)}>
              <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 64 64">
                <ellipse cx="32" cy="61" opacity=".3" rx="20" ry="3"></ellipse><path fill="#fd3c4f" d="M42.963,30l8.136-8.135c1.562-1.562,1.562-4.095,0-5.657l-5.306-5.306	c-1.562-1.562-4.095-1.562-5.657,0L32,19.038l-8.136-8.136c-1.562-1.562-4.095-1.562-5.657,0l-5.306,5.306	c-1.562,1.562-1.562,4.095,0,5.657L21.037,30l-8.135,8.135c-1.562,1.562-1.562,4.095,0,5.657l5.305,5.306	c1.562,1.562,4.095,1.562,5.657,0L32,40.963l8.136,8.135c1.562,1.562,4.095,1.562,5.657,0l5.305-5.306	c1.562-1.562,1.562-4.095,0-5.657L42.963,30z"></path><path d="M40.135,49.098c1.562,1.562,4.095,1.562,5.657,0l5.306-5.306	c1.562-1.562,1.562-4.095,0-5.657l-8.136-8.135l3.535-3.535l0,0C45.521,25.488,44.242,25,42.962,25c-1.224,0-2.448,0.447-3.406,1.34	c-2.084,1.943-1.973,5.352,0.042,7.366l7.257,7.256l-3.892,3.892l-7.275-7.274c-1.847-1.847-4.846-2.146-6.86-0.484	c-2.31,1.907-2.432,5.334-0.365,7.402l3.536-3.536L40.135,49.098z" opacity=".15"></path><path fill="#fff" d="M23.864,10.902c-1.562-1.562-4.095-1.562-5.657,0	l-5.306,5.306c-1.562,1.562-1.562,4.095,0,5.657L21.037,30l-3.535,3.535l0,0C18.478,34.512,19.757,35,21.037,35	c1.224,0,2.448-0.447,3.406-1.34c2.084-1.943,1.973-5.352-0.042-7.366l-7.257-7.256l3.892-3.892l7.275,7.274	c1.847,1.846,4.846,2.146,6.86,0.484c2.31-1.907,2.432-5.334,0.365-7.402L32,19.038L23.864,10.902z" opacity=".3"></path><polyline fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="3" points="18.5,15.5 21,13 23.5,15.5"></polyline>
              </svg>
            </p>
          )}
        </div>
      </div>
      <div className={styles['grid-row-item']}>
        <div style={{display: 'flex', alignItems: 'flex-start'}}>
          <ProductImage productId={product.productId} />
          {isEditOrder ? (<SelectProduct value={product.name} onSelect={onSelectProduct} />) : product.name}
        </div>
      </div>
      <div className={styles['grid-row-item']} style={{ textAlign: 'center'}}>
        {isEditOrder ? <ProductQuantity product={product} onChangeQuantity={updateOrderProduct} /> : product.quantity}
      </div>
      <div className={styles['grid-row-item']} style={{ textAlign: 'right'}}>
      {isEditOrder ? <InputPriceOrder product={product} onChangePrice={updateOrderProduct} field={InputPriceField.PURCHASE_PRICE} /> : formatNumberWithSpaces(+product.purchasePrice, 2)}
      </div>
      <div className={styles['grid-row-item']} style={{ textAlign: 'right'}}>{formatNumberWithSpaces((+product.purchasePrice * product.quantity), 2)}</div>
      <div className={styles['grid-row-item']} style={{ textAlign: 'right'}}>{formatNumberWithSpaces((+costPrice), 2)}</div>
      <div className={styles['grid-row-item']} style={{ textAlign: 'right'}}>{formatNumberWithSpaces((+costPrice * product.quantity), 2)}</div>
      <div className={styles['grid-row-item']} style={{ textAlign: 'right'}}>
        {isEditOrder ? <InputPriceOrder product={product} onChangePrice={updateOrderProduct} field={InputPriceField.SELL_PRICE} /> : formatNumberWithSpaces(+product.sellPrice, 2)}
      </div>
      <div className={`${styles['grid-row-item']}`} style={{ textAlign: 'right'}}>
        {formatNumberWithSpaces((+product.sellPrice * product.quantity), 2)}
      </div>
      <div className={`${styles['grid-row-item']} ${styles['border-right']}`}>
        {isEditOrder ? <OrderSelectClient value={product.clientName} onSelect={onSelectClient} /> : <>
          {product.clientId !== '' ? <>
            <Popover width={200} position="bottom" shadow="md">
              <Popover.Target>
                <div className={styles['grid_body__over-target']}>
                  {product.clientName}
                </div>
              </Popover.Target>
              <Popover.Dropdown>
                <div className={styles['grid_body__over']}>
                  <p className={styles['contacts']}>Contacts:</p>
                  <p
                    className={styles['contacts__list']}
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product.clientContacts) }}
                  ></p>
                </div>
              </Popover.Dropdown>
            </Popover>
          </> : product.clientName}
        </>}
      </div>
    </>)
  }

}