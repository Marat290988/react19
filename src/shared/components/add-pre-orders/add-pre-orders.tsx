import { useDisclosure } from '@mantine/hooks';
import styles from './add-pre-orders.module.scss';
import { Button, Modal, Textarea } from '@mantine/core';
import { useEffect, useState } from 'react';
import { IPreOrder, PreOrderStatus } from '../../model/pre-order.interface';
import { SelectClient } from '../select-client/select-client';
import { IClient } from '../../../api/clients';
import { PriceInput } from '../price-input/price-input';

interface AddPreOrdersProps {
  isOpen: boolean,
  onClose: () => void,
  preOrder?: IPreOrder
}

const initialPreOrder = {
  desc: '',
  salePrice: '',
  status: PreOrderStatus.UNDONE,
  createdAt: '',
  clientName: '',
  clientContacts: '',
  clientfbId: '',
  id: '',
  fbId: '',
  isTouchedDesc: false,
  isTouchedSalePrice: false,
  isTouchedClientName: false,
}

export const AddPreOrders: React.FC<AddPreOrdersProps> = ({ isOpen, onClose }) => {

  const [opened, { open, close }] = useDisclosure(false);
  const [preOrder, setPreOrder] = useState<IPreOrder & {
    isTouchedDesc: boolean,
    isTouchedSalePrice: boolean,
    isTouchedClientName: boolean
  }>({...initialPreOrder});

  useEffect(() => {
    if (isOpen) {
      open();
    }
  }, [isOpen])

  const closeModal = () => {
    setPreOrder({...initialPreOrder});
    close();
    onClose();
  }

  const onSelectClient = (client: IClient) => {
    setPreOrder(prevVal => ({ 
      ...prevVal, 
      clientName: client.name, 
      clientfbId: client.fbId, 
      clientContacts: client.contacts, 
      isTouchedClientName: true })
    );
  }

  const onChangeSalePrice = (salePrice: string) => {
    setPreOrder(prevVal => ({ ...prevVal, salePrice, isTouchedSalePrice: true }));
  }

  const isDisabled = preOrder.clientName === '' || preOrder.clientName === '' || preOrder.salePrice === '';

  return (
    <div className={styles['add-pre-orders']}>
      <Modal
        title="Add / Edit Pre-order"
        opened={opened}
        onClose={closeModal}
        centered
      >
        <div className={styles['add-pre-orders__body']}>
          <Textarea
            value={preOrder.desc}
            label="Pre-ordered item"
            placeholder="Pre-ordered item"
            onInput={(e) => setPreOrder(prevVal => ({ ...prevVal, desc: (e.target as any).value }))}
            onBlur={() => setPreOrder(prevVal => ({ ...prevVal, isTouchedDesc: true }))}
            error={preOrder.isTouchedDesc && preOrder.desc === ''}
          />
          <SelectClient onSelectClient={onSelectClient} hasError={preOrder.isTouchedClientName && preOrder.clientName === ''} />
          <PriceInput onChangePrice={onChangeSalePrice} hasError={preOrder.isTouchedSalePrice && preOrder.salePrice === ''} />
          <div className={styles['add-product__body-buttons']}>
            <Button
              disabled={isDisabled}
            >
              Save
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}