import { DatabaseReference, get, push, ref, remove, update } from "firebase/database";
import { dataBase } from "./firebaseConfig";
import { showNotification } from "../shared/utils/notification";

export interface IClientBase {
  id: string,
  name: string,
  contacts: string,
}

export interface IClient extends IClientBase {
  fbId: string,
}

const path = 'clients';

export const ClientsService = {
  saveClient: async (clientData: {name: string, contacts?: string}): Promise<IClient | null> => {
    const client: IClientBase = {
      id: crypto.randomUUID(),
      name: clientData.name,
      contacts: clientData.contacts ? clientData.contacts : '',
    };

    const dataRef = ref(dataBase, path);
    const res = await push(dataRef, client).catch(error => {
      console.error('Error saving client:', error);
      showNotification('Error saving client', 'red');
    });
    const savedClient = {
      ...client,
      fbId: (res as DatabaseReference).key as string,
    };
    return savedClient ? savedClient : null;
  },
  updateClient: async (client: IClient) => {
    const dataRef = ref(dataBase, `${path}/${client.fbId}`);
    const baseClient: IClientBase = {
      id: client.id, 
      name: client.name,
      contacts: client.contacts,
    };
    return update(dataRef, baseClient).then(() => true).catch(error => {
      console.error('Error updating client:', error);
      showNotification('Error updating client', 'red');
    });
  },
  removeClients: async (client: IClient): Promise<'OK'> => {
    const dataRef = ref(dataBase, `${path}/${client.fbId}`);
    await remove(dataRef).catch(error => {
      console.error('Error removing client:', error);
      showNotification('Error removing client', 'red');
    });
    return 'OK';
  },
  getClients: async (): Promise<IClient[]> => {
    const dataRef = ref(dataBase, path);
    const snapshot = await get(dataRef).catch(error => {
      console.error('Error getting clients:', error);
      showNotification('Error getting clients', 'red');
    });
    if (snapshot && snapshot.exists()) {
      const fireBaseData: { [key: string]: IClient } = snapshot.val();
      const data: IClient[] = [];
      for (const key in fireBaseData) {
        const product: IClient = fireBaseData[key];
        product.fbId = key;
        data.push(product);
      }
      return data;
    } else {
      console.log("No data available");
      return [];
    }
  }
}