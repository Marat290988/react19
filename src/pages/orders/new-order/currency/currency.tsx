import { Button, Menu, TextInput } from "@mantine/core"
import { IOrder } from "../../../../shared/model/order.interface"
import styles from './currency.module.scss';
import { PriceInput } from "../../../../shared/components/price-input/price-input";
import { useEffect, useRef, useState } from "react";

interface PreferencesProps {
  productOrder: IOrder,
  updateOrder: (order: IOrder) => void,
}

const USD = '$';

export const Currency: React.FC<PreferencesProps> = ({ productOrder, updateOrder }) => {

  const [currencyState, setCurrencyState] = useState({
    purchaseCurrencyName: productOrder.purchaseCurrencyName,
    currencyRateUZSToUSD: productOrder.currencyRateUZSToUSD,
    purchaseCurrencyRateToUSD: productOrder.purchaseCurrencyRateToUSD,
  });

  useEffect(() => {
    setCurrencyState({
      purchaseCurrencyName: productOrder.purchaseCurrencyName,
      currencyRateUZSToUSD: productOrder.currencyRateUZSToUSD,
      purchaseCurrencyRateToUSD: productOrder.purchaseCurrencyRateToUSD,
    });
  }, [productOrder]);

  const acceptCurrency = () => {
    productOrder.currencyRateUZSToUSD = currencyState.currencyRateUZSToUSD;
    productOrder.purchaseCurrencyRateToUSD = currencyState.purchaseCurrencyRateToUSD;
    productOrder.purchaseCurrencyName = currencyState.purchaseCurrencyName;
    updateOrder({ ...productOrder });
    if (elementRef.current) {
      const btn = elementRef.current.querySelector('button.mantine-Menu-item') as HTMLElement;
      if (btn) {
        btn.click();
      }
    }
  }

  const elementRef = useRef<HTMLDivElement>(null);

  return (
    <Menu shadow="md" width={250}>
      <Menu.Target>
        <Button variant="filled" style={{ width: 'fit-content' }} size="xs">Currency</Button>
      </Menu.Target>
      <Menu.Dropdown>
        <div className={styles['currency']}>
          <div className={styles['currency__row']}>
            <div style={{ width: 'calc(100% - 40px)' }}>
              <PriceInput
                label="Currency rate UZS to $"
                price={currencyState.currencyRateUZSToUSD}
                onChangePrice={(currency) => setCurrencyState(prevVal => ({ ...prevVal, currencyRateUZSToUSD: currency }))}
                hasError={currencyState.currencyRateUZSToUSD === ''}
              />
            </div>
            <div className={styles['currency__row-val']}>
              {USD}
            </div>
          </div>
          <div className={styles['currency__row']}>
            <div className={styles['currency__row']}>
              <div style={{ width: 'calc(100% - 40px)' }}>
                <PriceInput
                  label={`Currency * Currency rate = 1$`}
                  price={currencyState.purchaseCurrencyRateToUSD}
                  onChangePrice={(currency) => setCurrencyState(prevVal => ({ ...prevVal, purchaseCurrencyRateToUSD: currency }))}
                  hasError={currencyState.purchaseCurrencyRateToUSD === '' && currencyState.purchaseCurrencyName !== ''}
                />
              </div>
              <TextInput
                style={{ width: '40px' }}
                value={currencyState.purchaseCurrencyName}
                onChange={(e) => { setCurrencyState(prevVal => ({ ...prevVal, purchaseCurrencyName: (e.target as any).value })) }}
                error={currencyState.purchaseCurrencyRateToUSD !== '' && currencyState.purchaseCurrencyName === ''}
              />
            </div>
          </div>
          <div style={{ marginTop: '0.4rem' }}>
            <Button
              variant="filled"
              style={{ width: 'fit-content' }}
              size="xs"
              disabled={
                currencyState.currencyRateUZSToUSD === '' ||
                currencyState.purchaseCurrencyRateToUSD === '' && currencyState.purchaseCurrencyName !== '' ||
                currencyState.purchaseCurrencyRateToUSD !== '' && currencyState.purchaseCurrencyName === ''
              }
              onClick={acceptCurrency}
            >
              Accept
            </Button>
            <div ref={elementRef}>
              <Menu.Item style={{ display: 'none' }}>
                Accept
              </Menu.Item>
            </div>
          </div>
        </div>
      </Menu.Dropdown>
    </Menu>
  )
}