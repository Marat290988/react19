import { IPreOrder, PreOrderStatus } from '../../../../shared/model/pre-order.interface';
import styles from './pre-orders-status.module.scss';

export const PreOrdersStatus: React.FC<{
  status: PreOrderStatus, 
  preOrderItem: IPreOrder,
  changeStatus: (status: PreOrderStatus, preOrderItem: IPreOrder) => void
}> = ({ status, changeStatus, preOrderItem }) => {

  const onClickStatus = (status: PreOrderStatus) => {
    changeStatus(status, preOrderItem);
  }

  return (
    <div className={styles['pre-orders-status']}>
      <div 
        className={styles['status-item']}
        style={{
          backgroundColor: status === PreOrderStatus.UNDONE ? 'var(--warning)' : '',
          cursor: status === PreOrderStatus.UNDONE ? 'default' : ''
        }}
        onClick={() => status !== PreOrderStatus.UNDONE && onClickStatus(PreOrderStatus.UNDONE)}
      >
        Undone
      </div>
      <div 
        className={styles['status-item']}
        style={{
          backgroundColor: status === PreOrderStatus.DONE ? 'var(--green)' : '',
          cursor: status === PreOrderStatus.DONE ? 'default' : ''
        }}
        onClick={() => status !== PreOrderStatus.DONE && onClickStatus(PreOrderStatus.DONE)}
      >
        Done
      </div>
      <div 
        className={styles['status-item']}
        style={{
          backgroundColor: status === PreOrderStatus.CANCELED ? 'var(--red)' : '',
          cursor: status === PreOrderStatus.CANCELED ? 'default' : ''
        }}
        onClick={() => status !== PreOrderStatus.CANCELED && onClickStatus(PreOrderStatus.CANCELED)}
      >
        Canceled
      </div>
    </div>
  )
}