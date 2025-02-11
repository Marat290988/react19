import { dataBase } from "./firebaseConfig";
import { ref, get, push } from "firebase/database";

interface IProduct {
  name: string,
}

interface IProductFromOrder extends IProduct {
  quantity: number,
  buyPrice: number,
  sellPrice: number,
}

interface IOrder {
  dateCreated: number,
  dateUpdated: number,
  products: IProductFromOrder[],
}

const path = 'orders';
const dataRef = ref(dataBase, path);

export const OrdersService = {
  saveOrder: (order: IOrder) => {
    return push(dataRef, order);
  },
  getOrders: async (): Promise<any> => {
    try {
      const snapshot = await get(dataRef);
      if (snapshot.exists()) {
        return snapshot.val(); // Возвращаем данные
      } else {
        console.log("No data available");
        return null;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }
}