
export interface IOrder {
  productOrder: IProductOrder[];
  expenses: IExpense[];
  purchaseCurrencyName: string; // Default $
  currencyRateUZSToUSD: string; // Two numbers after the decimal point
  purchaseCurrencyRateToUSD: string; 
  discount: {
    price: string; // Two numbers after the decimal point in currency
    currencyName: string; // Default $
    currencyRate: string; // Two numbers after the decimal point
  }; // Two numbers after the decimal point in currency
  createdAt: string,
  updatedAt: string,
  id?: string,
  fbId?: string,
}

export interface IProductOrder {
  id: string;
  productId: string;
  name: string;
  purchasePrice: string; // Two numbers after the decimal point in currency
  sellPrice: string; // Whole number in UZS
  quantity: number;
  clientId: string;
  clientName: string;
  clientContacts: string;
}

export interface IExpense {
  name: string;
  price: string; // Two numbers after the decimal point in currency
  currencyName: string; // Default $
  currencyRate: string; // Two numbers after the decimal point
  id: string;
}
