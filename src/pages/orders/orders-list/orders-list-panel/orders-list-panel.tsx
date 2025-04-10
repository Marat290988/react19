import { useEffect, useMemo, useState } from 'react';
import styles from './orders-list-panel.module.scss';
import { Button, Select } from '@mantine/core';
import { getMonthYear } from '@shared/utils/convert';

interface IOrdersListPanelProps {
  getOrdersByYearMonth: (dateKey: string, isAll?: boolean) => void,
}

export const OrdersListPanel: React.FC<IOrdersListPanelProps> = ({ getOrdersByYearMonth }) => {

  const [selectedYear, setSelectedYear] = useState<string | null>(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState<string | null>(new Date(2000, new Date().getMonth()).toLocaleString('en-US', { month: 'long' }));

  const yearsList = useMemo<string[]>(() => {
    return getYearsFrom2024();
  }, []);

  const monthsList = useMemo<string[]>(() => {
    return ['All', ...getMonthNames()]
  }, []);

  useEffect(() => {
    getOrdersByYearMonth(getMonthYear(new Date()));
  }, []);

  const onSearch = () => {
    const searchKey = selectedMonth === 'All' ? selectedYear : `${months[selectedMonth as string]}${selectedYear}`;
    getOrdersByYearMonth(`${searchKey}`, selectedMonth === 'All' ? true : false);
  }

  return (
    <div className={styles['orders-list-panel']}>
      <div className={styles['orders-list-panel__select']}>
        <Select 
          data={yearsList}
          placeholder='Year'
          value={selectedYear}
          onChange={(value) => setSelectedYear(value)}
        />
      </div>
      <div className={styles['orders-list-panel__select']}>
        <Select 
          data={monthsList}
          placeholder='Month'
          value={selectedMonth}
          onChange={(value) => setSelectedMonth(value)}
        />
      </div>
      <div className={styles['orders-list-panel__btn']}>
        <Button variant='filled' onClick={onSearch}>Search</Button>
      </div>
    </div>
  )
}

function getYearsFrom2024(): string[] {
  const currentYear = new Date().getFullYear();
  const years: string[] = [];

  for (let year = 2024; year <= currentYear; year++) {
    years.push(year.toString());
  }

  return years;
}

function getMonthNames(locale: string = 'en-US'): string[] {
  return Array.from({ length: 12 }, (_, i) => {
    return new Date(2000, i).toLocaleString(locale, { month: 'long' });
  });
}

const months: {[key: string]: string} = {
  'January': '01',
  'February': '02',
  'March': '03',
  'April': '04',
  'May': '05',
  'June': '06',
  'July': '07',
  'August': '08',
  'September': '09',
  'October': '10',
  'November': '11',
  'December': '12',
}