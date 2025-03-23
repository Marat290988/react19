import { IOrder } from '../../../../shared/model/order.interface';
import styles from './orders-grid-header.module.scss';

export const OrdersGridHeader: React.FC<{order : IOrder}> = ({ order }) => {

  let headerData: {
    headerGrigStyle: React.CSSProperties,
    childredStyles: {title: string, style: React.CSSProperties}[],
  } = {
    headerGrigStyle: {
      display: 'grid',
      gridTemplateColumns: '50px minmax(200px, auto) 60px 100px 100px 100px 100px 150px 150px 150px',
      gridTemplateRows: 'repeat(2, 1fr)',
      gridColumnGap: '0px',
      gridRowGap: '0px',
    },
    childredStyles: [
      {title: '', style: {gridArea: '1 / 1 / 2 / 4', border: 'none'}},
      {title: 'Purchase', style: {gridArea: '1 / 4 / 2 / 6', borderRight: 'none', borderBottom: 'none', textAlign: 'center'}},
      {title: 'Cost Price', style: {gridArea: '1 / 6 / 2 / 8', borderRight: 'none', borderBottom: 'none', textAlign: 'center'}},
      {title: 'Sale', style: {gridArea: '1 / 8 / 2 / 10', borderBottom: 'none', borderRight: 'none', textAlign: 'center'}},
      {title: 'Client', style: {gridArea: '1 / 10 / 3 / 11', display: 'flex', alignItems: 'center', justifyContent: 'center'}},
      {title: 'No.', style: {gridArea: '2 / 1 / 3 / 2', borderRight: 'none'}},
      {title: 'Product Name', style: {gridArea: '2 / 2 / 3 / 3', borderRight: 'none'}},
      {title: 'Q-ty', style: {gridArea: '2 / 3 / 3 / 4', borderRight: 'none'}},
      {title: 'Price, USD', style: {gridArea: '2 / 4 / 3 / 5', borderRight: 'none'}},
      {title: 'Amount, USD', style: {gridArea: '2 / 5 / 3 / 6', borderRight: 'none'}},
      {title: 'Price, USD', style: {gridArea: '2 / 6 / 3 / 7', borderRight: 'none'}},
      {title: 'Amount, USD', style: {gridArea: '2 / 7 / 3 / 8', borderRight: 'none'}},
      {title: 'Price, UZS', style: {gridArea: '2 / 8 / 3 / 9', borderRight: 'none'}},
      {title: 'Amount, UZS', style: {gridArea: '2 / 9 / 3 / 10', borderRight: 'none'}},
    ]
  }

  if (order.purchaseCurrencyName !== '') {
    headerData = {
      headerGrigStyle: {
        display: 'grid',
        gridTemplateColumns: '50px minmax(200px, auto) 60px 100px 100px 100px 100px 100px 100px 150px 150px 150px',
        gridTemplateRows: 'repeat(2, 1fr)',
        gridColumnGap: '0px',
        gridRowGap: '0px',
      },
      childredStyles: [
        {title: '', style: {gridArea: '1 / 1 / 2 / 4', border: 'none'}},
        {title: 'Purchase', style: {gridArea: '1 / 4 / 2 / 6', borderRight: 'none', borderBottom: 'none', textAlign: 'center'}},
        {title: 'Purchase', style: {gridArea: '1 / 6 / 2 / 8', borderRight: 'none', borderBottom: 'none', textAlign: 'center'}},
        {title: 'Cost Price', style: {gridArea: '1 / 8 / 2 / 10', borderRight: 'none', borderBottom: 'none', textAlign: 'center'}},
        {title: 'Sale', style: {gridArea: '1 / 10 / 2 / 12', borderBottom: 'none', borderRight: 'none', textAlign: 'center'}},
        {title: 'Client', style: {gridArea: '1 / 12 / 3 / 13', display: 'flex', alignItems: 'center', justifyContent: 'center'}},
        {title: 'No.', style: {gridArea: '2 / 1 / 3 / 2', borderRight: 'none'}},
        {title: 'Product Name', style: {gridArea: '2 / 2 / 3 / 3', borderRight: 'none'}},
        {title: 'Q-ty', style: {gridArea: '2 / 3 / 3 / 4', borderRight: 'none'}},
        {title: `Price, ${order.purchaseCurrencyName}`, style: {gridArea: '2 / 4 / 3 / 5', borderRight: 'none'}},
        {title: `Amount, ${order.purchaseCurrencyName}`, style: {gridArea: '2 / 5 / 3 / 6', borderRight: 'none'}},
        {title: 'Price, USD', style: {gridArea: '2 / 6 / 3 / 7', borderRight: 'none'}},
        {title: 'Amount, USD', style: {gridArea: '2 / 7 / 3 / 8', borderRight: 'none'}},
        {title: 'Price, USD', style: {gridArea: '2 / 8 / 3 / 9', borderRight: 'none'}},
        {title: 'Amount, USD', style: {gridArea: '2 / 9 / 3 / 10', borderRight: 'none'}},
        {title: 'Price, UZS', style: {gridArea: '2 / 10 / 3 / 11', borderRight: 'none'}},
        {title: 'Amount, UZS', style: {gridArea: '2 / 11 / 3 / 12', borderRight: 'none'}},
      ]
    }
  }

  return (
    <div className={styles['orders-grid-header']} style={headerData.headerGrigStyle}>
      {headerData.childredStyles.map((headerCell) => (
        <div
          key={headerCell.style.gridArea}
          style={headerCell.style}
          className={styles['orders-grid-header__cell']}
        >
          {headerCell.title}
        </div>
      ))}
    </div>
  )
}