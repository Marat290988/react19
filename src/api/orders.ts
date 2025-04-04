import { get, push, ref } from "firebase/database";
import { dataBase } from "./firebaseConfig";
import { IOrder } from "@shared/model/order.interface";

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
  }
}