import { useEffect, useRef, useState } from 'react';
import { AddClient } from '../../shared/components/add-client/add-client';
import { CustomGrid, IGrid } from '../../shared/components/custom-grid/custom-grid';
import useClientStore from '../../store/client.store';
import styles from './client-page.module.scss';
import { ClientsService, IClient } from '../../api/clients';
import { Pagination } from '@mantine/core';

const qtyElementOnPage = 10;

export const ClientPage: React.FC = () => {

  const { clients: storageClients, removeClient } = useClientStore();
  const [clients, setClients] = useState<IClient[]>([]);
  const [pageData, setPageData] = useState({
    currentPage: 1,
    totalPage: 0,
  });

  const getClientData = (page: number) => {
    const totalElementInPrev = (page - 1) * qtyElementOnPage;
    const leftPart = useClientStore.getState().clients.slice(totalElementInPrev, useClientStore.getState().clients.length);
    const nextPart = useClientStore.getState().clients
      .slice(
        totalElementInPrev,
        leftPart.length >= qtyElementOnPage ? totalElementInPrev + qtyElementOnPage : useClientStore.getState().clients.length
      );
    setClients(nextPart);
  }

  useEffect(() => {
    getClientData(pageData.currentPage);
  }, [pageData.currentPage]);

  useEffect(() => {
    setPageData(state => ({ ...state, totalPage: Math.ceil(storageClients.length / qtyElementOnPage) }));
  }, [storageClients]);

  const deleteClientHandler = (client: IClient): Promise<any> => {
    return ClientsService.removeClients(client).then(res => {
      if (res === 'OK') {
        removeClient(client);
        getClientData(pageData.currentPage);
      }
    })
  }

  const clientModal = useRef<{
    open: (client: IClient) => void,
    close: () => void,
  } | null>(null);

  const grid: IGrid = {
    headersName: ['', 'Name', 'Contacts'],
    gridSize: '50px minmax(200px, auto) minmax(200px, auto) 200px',
    data: clients,
    columns: [
      { name: 'name' },
      { name: 'contacts', isInnerHTML: true },
      {
        name: 'Edit',
        isAction: true,
        styles: { justifyContent: 'center' },
        buttons: [
          {
            buttonTitle: 'Edit',
            action: clientModal.current ? clientModal.current.open : null,
            typeAction: 'item',
          },
          {
            buttonTitle: 'Delete',
            action: deleteClientHandler,
            typeAction: 'item',
            buttonColor: 'red',
            isSure: true,
          },
        ]
      },
    ]
  }

  const onPageChange = (page: number) => {
    setPageData(state => ({ ...state, currentPage: page }));
  }

  const onUpdate = () => {
    getClientData(pageData.currentPage);
  }

  return (
    <div className={styles['client-page']}>
      <h2>Add / Edit Clients Page</h2>
      <AddClient ref={clientModal} onUpdate={onUpdate} />
      <CustomGrid gridValue={grid} currentPage={pageData.currentPage - 1} />
      {pageData.totalPage > 0 && <Pagination total={pageData.totalPage} onChange={onPageChange} />}
    </div>
  )
}