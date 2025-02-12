import { get, push, ref, remove, update } from "firebase/database";
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
  saveClient: async (clientData: {name: string, contacts?: string}) => {
    const client: IClientBase = {
      id: crypto.randomUUID(),
      name: clientData.name,
      contacts: clientData.contacts ? clientData.contacts : '',
    };

    const dataRef = ref(dataBase, path);
    return push(dataRef, client).catch(error => {
      console.error('Error saving client:', error);
      showNotification('Error saving client', 'red');
    })
  },
  updateClient: async (client: IClient) => {
    const dataRef = ref(dataBase, `${path}/${client.fbId}`);
    const baseClient: IClientBase = {
      id: client.id, 
      name: client.name,
      contacts: client.contacts,
    };
    return update(dataRef, {baseClient}).catch(error => {
      console.error('Error updating client:', error);
      showNotification('Error updating client', 'red');
    });
  },
  removeClients: async (client: IClient) => {
    const dataRef = ref(dataBase, `${path}/${client.fbId}`);
    return remove(dataRef).catch(error => {
      console.error('Error removing client:', error);
      showNotification('Error removing client', 'red');
    });
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