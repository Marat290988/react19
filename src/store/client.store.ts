import { create } from "zustand";
import { IClient } from "../api/clients";

interface ClientStore {
  clients: IClient[];
  setClients: (clients: IClient[]) => void;
  addClient: (client: IClient) => void;
  removeClient: (client: IClient) => void;
  updateClients: (clients: IClient[]) => void;
}

const useClientStore = create<ClientStore>((set) => ({
  clients: [],
  setClients: (clients: IClient[]) => set({ clients }),
  addClient: (client: IClient) =>
    set((state) => ({ clients: [...state.clients, client] })),
  removeClient: (client: IClient) =>
    set((state) => ({
      clients: state.clients.filter((c) => c.id !== client.id),
    })),
  updateClients: (clients: IClient[]) =>
    set((state) => {
      return {
        ...state,
        clients: state.clients.map((c) => {
          const findIndex = clients.findIndex((c2) => c2.id === c.id);
          return findIndex !== -1 ? clients[findIndex] : c;
        }),
      };
    }),
}));

export default useClientStore;
