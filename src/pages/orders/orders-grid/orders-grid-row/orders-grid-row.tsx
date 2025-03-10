import { IOrder, IProductOrder } from '../../../../shared/model/order.interface';
import { OrdersGridRowItem } from './orders-grid-row-item/orders-grid-row-item';
import styles from './orders-grid-row.module.scss';

interface IOrdersGridRowProps {
  order : IOrder, 
  isEdit: boolean,
  updateOrder: (order: IOrder) => void,
}

export const OrdersGridRow: React.FC<IOrdersGridRowProps> = ({ order, isEdit, updateOrder }) => {

  const updateOrderProduct = (product: IProductOrder) => {
    const findIndex = order.productOrder.findIndex(p => p.id === product.id);
    if (findIndex !== -1) {
      order.productOrder[findIndex] = product;
      updateOrder(order);
    }
  }

  const removeProduct = (product: IProductOrder) => {
    order.productOrder = order.productOrder.filter(p => p.id !== product.id);
    updateOrder(order);
  }

  const gridTemplateColumns = order.purchaseCurrencyName !== '' ? 
    '50px minmax(200px, auto) 60px 100px 100px 100px 100px 100px 100px 150px 150px' :
    '50px minmax(200px, auto) 60px 100px 100px 100px 100px 150px 150px';

  return (
    <div 
      className={styles['orders-grid-row']}
      style={{ gridTemplateColumns: gridTemplateColumns }}
    >
      {order.productOrder.map((p, index) => (
        <OrdersGridRowItem 
          product={p}
          key={p.id}
          isEdit={isEdit} 
          order={order}
          isAdditionalColumn={order.purchaseCurrencyName !== ''} 
          updateOrderProduct={updateOrderProduct} 
          num={index + 1}
          removeProduct={removeProduct}
        />
      ))}
    </div>
  )
}