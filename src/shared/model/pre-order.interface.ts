
export enum PreOrderStatus {
  DONE = 'done',
  UNDONE = 'undone',
  CANCELED = 'canceled',
}

export interface IPreOrderBase {
  desc: string,
  salePrice: string,
  status: PreOrderStatus,
  createdAt: string,
  clientName: string,
  clientContacts: string,
  clientfbId: string,
}

export interface IPreOrder extends IPreOrderBase {
  id: string,
  fbId: string,
}