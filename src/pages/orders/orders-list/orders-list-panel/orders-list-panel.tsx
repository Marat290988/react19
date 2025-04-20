import { useEffect, useMemo, useState } from 'react';
import styles from './orders-list-panel.module.scss';
import { Button, Select } from '@mantine/core';
import { useSearchParams } from "react-router-dom";

interface IOrdersListPanelProps {
  getOrdersByYearMonth: (dateKey: string, isAll?: boolean) => void,
}

export const OrdersListPanel: React.FC<IOrdersListPanelProps> = ({ getOrdersByYearMonth }) => {

  const [selectedYear, setSelectedYear] = useState<string | null>(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState<string | null>(new Date(2000, new Date().getMonth()).toLocaleString('en-US', { month: 'long' }));
  const [searchParams, setSearchParams] = useSearchParams();

  const setQuery = (date: { year: string, month: string }) => {
    setSearchParams({ year: date.year, month: date.month });
  };
  
  const yearsList = useMemo<string[]>(() => {
    return getYearsFrom2024();
  }, []);

  const monthsList = useMemo<string[]>(() => {
    return ['All', ...getMonthNames()]
  }, []);

  useEffect(() => {
    if (
      validQueryParams(searchParams.get('year')!, searchParams.get('month')!) 
    ) {
      const queryMonth = searchParams.get('month');
      const queryYear = searchParams.get('year');
      const searchKey = queryMonth === 'All' ? queryYear : `${queryMonth}${queryYear}`;

      getOrdersByYearMonth(`${searchKey}`, queryMonth === 'All' ? true : false);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!searchParams.get('month') || !searchParams.get('year')) {
      setQuery({ year: selectedYear!, month: months[selectedMonth as string] });
    } else if (validQueryParams(searchParams.get('year')!, searchParams.get('month')!)) {
      setSelectedYear(searchParams.get('year')!);
      setSelectedMonth(monthsReverse[searchParams.get('month')!]);
    }
  }, []);

  const onSearch = () => {
    setQuery({ year: selectedYear!, month: selectedMonth === 'All' ? 'All' : months[selectedMonth as string] });
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

function validQueryParams(year: string, month: string): boolean {
  if (
    (month === 'All' ||
    (month && Object.values(months).includes(month))) &&
    (year && Number.isInteger(+year) && +year >= 2024)
  ) {
    return true;
  }
  return false;
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

const monthsReverse: {[key: string]: string} = {
  '01': 'January',
  '02': 'February',
  '03': 'March',
  '04': 'April',
  '05': 'May',
  '06': 'June',
  '07': 'July',
  '08': 'August',
  '09': 'September',
  '10': 'October',
  '11': 'November',
  '12': 'December',
  'All': 'All',
}