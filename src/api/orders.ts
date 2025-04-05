import { equalTo, get, orderByChild, push, query, ref, remove, update } from "firebase/database";
import { dataBase } from "./firebaseConfig";
import { IOrder } from "@shared/model/order.interface";
import { showNotification } from "../shared/utils/notification";

const path = 'orders';
const dataRef = ref(dataBase, path);

export const OrderService = {
  saveOrder: (order: IOrder): Promise<string> => {
    return push(dataRef, order).then(res => {
      return res.key as string;
    });
  },
  getOrder: (fbId: string): Promise<IOrder | null> => {
    const dataProductRef = ref(dataBase, `${path}/${fbId}`);
    return get(dataProductRef).then(snapshot => {
      if (snapshot.exists()) {
        const order: IOrder = snapshot.val();
        order.fbId = fbId;
        return order;
      } else {
        return null;
      }
    }).catch((error) => {
      console.error("Ошибка при получении объекта:", error);
      return null;
    });
  },
  updateOrder: (order: IOrder): Promise<string | void> => {
    const dataProductRef = ref(dataBase, `${path}/${order.fbId}`);
    order.updatedAt = new Date().toISOString();
    return update(dataProductRef, order).then(() => 'OK').catch((error) => {
      console.error('Error updating order:', error);
      showNotification('Error updating order', 'red');
    });
  },
  removeOrder: async (fbId: string): Promise<'OK'> => {
    const dataProductRef = ref(dataBase, `${path}/${fbId}`);
    await remove(dataProductRef).catch(error => {
      console.error('Error removing order:', error);
      showNotification('Error removing order', 'red');
    });
    return 'OK';
  },
  getOrdersByYearMonth: async (dateKey: string): Promise<IOrder[]> => {
    try {
      const q = query(dataRef, orderByChild('keyForSearch'), equalTo(dateKey));
      const snapshot = await get(q);
      if (snapshot.exists()) {
        const results: IOrder[] = [];
        snapshot.forEach((childSnapshot) => {
          results.push({ fbId: childSnapshot.key, ...childSnapshot.val() }); // Сохраняем данные вместе с ключом
        });
        return results;
      } else {
        console.log("Объект не найден");
        return [];
      }
    } catch (error) {
      showNotification('Error fetching orders', 'red');
      console.error("Ошибка при получении объекта:", error);
      throw error;
    }
  }
}