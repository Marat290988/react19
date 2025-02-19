import { DatabaseReference, get, push, ref } from "firebase/database";
import { IPreOrder } from "../shared/model/pre-order.interface";
import { dataBase } from "./firebaseConfig";
import { showNotification } from "../shared/utils/notification";

const path = "preorders";

export const PreOrdersService = {
  savePreOrder: async (preOrderData: IPreOrder) => {
    const savePreOrder: IPreOrder = {
      id: crypto.randomUUID(),
      desc: preOrderData.desc,
      salePrice: `${Number.parseInt(preOrderData.salePrice)}`,
      status: preOrderData.status,
      createdAt: new Date().toISOString(),
      clientName: preOrderData.clientName,
      clientContacts: preOrderData.clientContacts,
      clientfbId: preOrderData.clientfbId,
    };
    const dataRef = ref(dataBase, path);
    const res = await push(dataRef, savePreOrder).catch((error) => {
      console.error("Error saving preorder:", error);
      showNotification("Error saving preorder", "red");
    });
    savePreOrder.fbId = (res as DatabaseReference).key as string;
    return savePreOrder.fbId ? savePreOrder : null;
  },
  getPreOrders: async (): Promise<IPreOrder[]> => {
    const dataRef = ref(dataBase, path);
    const snapshot = await get(dataRef).catch((error) => {
      console.error("Error getting preorders:", error);
      showNotification("Error getting preorders", "red");
    });
    if (snapshot && snapshot.exists()) {
      const fireBaseData: { [key: string]: IPreOrder } = snapshot.val();
      const data: IPreOrder[] = [];
      for (const key in fireBaseData) {
        const preOrderItem: IPreOrder = fireBaseData[key];
        preOrderItem.fbId = key;
        data.push(preOrderItem);
      }
      return data;
    } else {
      console.log("No data available");
      return [];
    }
  },
};
