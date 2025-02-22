import { Button, Menu, TextInput } from "@mantine/core"
import { IOrder } from "../../../../shared/model/order.interface"
import styles from './currency.module.scss';
import { PriceInput } from "../../../../shared/components/price-input/price-input";

interface PreferencesProps {
  productOrder: IOrder,
  updateOrder: (order: IOrder) => void,
}

export const Currency: React.FC<PreferencesProps> = ({ productOrder}) => {

  console.log(productOrder)

  return (
    <Menu shadow="md" width={250}>
      <Menu.Target>
        <Button variant="filled" style={{ width: 'fit-content' }} size="xs">Currency</Button>
      </Menu.Target>
      <Menu.Dropdown>
        <div className={styles['currency']}>
          <div className={styles['currency__row']}>
            <div style={{ width: '75%' }}>
              <PriceInput
                label="Purchase currency rate"
                price={productOrder.currencyRate}
              />
            </div>
            <TextInput
              style={{ width: '24%' }}
              value={productOrder.currencyName}
              onChange={() => {}}
            />
          </div>
        </div>
      </Menu.Dropdown>
    </Menu>
  )
}