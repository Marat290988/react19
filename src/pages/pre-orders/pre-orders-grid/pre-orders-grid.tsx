import { Button, Popover } from '@mantine/core';
import { IPreOrder, PreOrderStatus } from '../../../shared/model/pre-order.interface';
import { formatDate, formatNumberWithSpaces } from '../../../shared/utils/convert';
import styles from './pre-orders-grid.module.scss';
import DOMPurify from 'dompurify';
import { PreOrdersStatus } from './pre-orders-status/pre-orders-status';
import { ButtonSure } from '../../../shared/components/custom-grid/sure-button/sure-button';

interface IPreOrdersGridProps {
  preOrders: IPreOrder[],
  updatePreOrder: (preOrderItem: IPreOrder) => void,
  openEditModal: (preOrderItem: IPreOrder) => void,
  removePreOrder: (preOrderItem: IPreOrder) => Promise<any>,
}

export const PreOrdersGrid: React.FC<IPreOrdersGridProps> = ({ preOrders, updatePreOrder, openEditModal, removePreOrder }) => {

  const updateStatus = (status: PreOrderStatus, preOrderItem: IPreOrder) => {
    preOrderItem.status = status;
    updatePreOrder(preOrderItem);
  }

  return (
    <div className={styles['pre-orders-grid']}>

      <div className={styles['pre-orders-grid_header']}>
        <div className={styles['pre-orders-grid_header__cell']}>No.</div>
        <div className={styles['pre-orders-grid_header__cell']}>Created at</div>
        <div className={styles['pre-orders-grid_header__cell']}>Pre-order products</div>
        <div className={styles['pre-orders-grid_header__cell']}>Client</div>
        <div className={styles['pre-orders-grid_header__cell']}>Change status</div>
        <div className={styles['pre-orders-grid_header__cell']}>Sale price</div>
        <div className={styles['pre-orders-grid_header__cell']}>Edit</div>
      </div>

      {preOrders.map((preOrderItem, index) => (
        <div className={styles['pre-orders-grid_body']} key={preOrderItem.id}>
          <div
            className={styles['pre-orders-grid_body__cell']}
            style={{ justifyContent: 'center' }}
          >
            {index + 1}
          </div>
          <div
            className={`${styles['pre-orders-grid_body__cell']} ${styles['grid-date']}`}
          >
            {formatDate(new Date(preOrderItem.createdAt))}
          </div>
          <div
            className={styles['pre-orders-grid_body__cell']}
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(preOrderItem.desc) }}
          ></div>
          <div className={styles['pre-orders-grid_body__cell']}>
            {preOrderItem.clientContacts.length > 0 && (
              <Popover width={200} position="bottom" shadow="md">
                <Popover.Target>
                  <div className={styles['pre-orders-grid_body__over-target']}>
                    {preOrderItem.clientName}
                  </div>
                </Popover.Target>
                <Popover.Dropdown>
                  <div className={styles['pre-orders-grid_body__over']}>
                    <p className={styles['contacts']}>Contacts:</p>
                    <p
                      className={styles['contacts__list']}
                      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(preOrderItem.clientContacts) }}
                    ></p>
                  </div>
                </Popover.Dropdown>
              </Popover>
            )}
            {preOrderItem.clientContacts.length === 0 && (<>{preOrderItem.clientName}</>)}
          </div>
          <div className={styles['pre-orders-grid_body__cell']}>
            <PreOrdersStatus status={preOrderItem.status} changeStatus={updateStatus} preOrderItem={preOrderItem} />
          </div>
          <div className={`${styles['pre-orders-grid_body__cell']} ${styles['price']}`}>
            {formatNumberWithSpaces(+preOrderItem.salePrice)}
          </div>
          <div className={styles['pre-orders-grid_body__cell']}>
            <div className={styles['buttons']}>
              <ButtonSure
                onConfirm={() => removePreOrder(preOrderItem)}
                btnConfig={{
                  buttonTitle: 'Delete',
                  typeAction: 'item',
                  buttonColor: 'red',
                  isSure: true,
                }}
                title={'Delete'}
              />
              <Button
                onClick={() => {
                  openEditModal(preOrderItem);
                }}
              >
                Edit
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}