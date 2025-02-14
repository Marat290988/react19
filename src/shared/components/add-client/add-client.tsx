import { useDisclosure } from '@mantine/hooks';
import styles from './add-client.module.scss';
import { Button, Modal, Textarea, TextInput } from '@mantine/core';
import { RefObject, useRef, useState } from 'react';
import { IconEdit } from '@tabler/icons-react';
import { ClientsService, IClient } from '../../../api/clients';
import useClientStore from '../../../store/client.store';

export interface AddClientProps {
  name: string,
  contacts: string,
  id?: string,
  fbId?: string,
  isTouched: boolean,
}

export interface AddProductRef {
  ref?: RefObject<{
    open: (client: IClient) => void,
    close: () => void,
  } | null>,
  onUpdate?: () => void
}

export const AddClient: React.FC<AddProductRef> = ({ ref, onUpdate }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [client, setClient] = useState<AddClientProps>({ name: '', contacts: '', isTouched: false });
  const isEdit = useRef(false);
  const [blockButton, setBlockButton] = useState(false);
  const { addClient, updateClients } = useClientStore();

  const closeModal = () => {
    isEdit.current = false;
    setClient({ name: '', contacts: '', isTouched: false });
    setBlockButton(false);
    close();
  }

  if (ref) {
    ref.current = {
      open: (client: IClient) => {
        isEdit.current = true;
        setClient({
          name: client.name,
          contacts: client.contacts,
          id: client.id,
          fbId: client.fbId,
          isTouched: true
        });
        open();
      },
      close: () => {
        closeModal();
      }
    }
  }

  const saveClient = () => {
    setBlockButton(true);
    ClientsService.saveClient({ name: client.name, contacts: client.contacts})
      .then((resClient) => {
        setBlockButton(false);
        if (resClient) {
          addClient(resClient);
          onUpdate && onUpdate();
          setBlockButton(false);
          closeModal();
        }
      });
  }

  const updateClient = () => {
    setBlockButton(true);
    ClientsService.updateClient({ name: client.name, contacts: client.contacts, id: client.id!, fbId: client.fbId!})
      .then((res => {
        if (res) {
          updateClients([{ name: client.name, contacts: client.contacts, id: client.id!, fbId: client.fbId!}]);
          onUpdate && onUpdate();
          setBlockButton(false);
          closeModal();
        }
      }))
  }

  return (
    <div className={styles['add-client']}>
      <Modal
        title="Add / Edit Client"
        opened={opened}
        onClose={closeModal}
        centered
      >
        <div className={styles['add-client__body']}>
          <TextInput
            value={client.name}
            label="Client name"
            placeholder="Client name"
            leftSection={<IconEdit size={16} />}
            onInput={(e) => setClient(prevVal => ({ ...prevVal, name: (e.target as any).value }))}
            onBlur={() => setClient(prevVal => ({ ...prevVal, isTouched: true }))}
            error={client.isTouched && client.name === ''}
          />
          <Textarea
            value={client.contacts && client.contacts.replace(/<br>/g, "\n")}
            placeholder="Contacts"
            label="Contacts"
            autosize
            minRows={2}
            onInput={(e) => setClient(prevVal => ({ ...prevVal, contacts: (e.target as any).value.replace(/\n/g, "<br>") }))}
            onBlur={() => setClient(prevVal => ({ ...prevVal, isTouched: true }))}
          />
          <div className={styles['add-product__body-buttons']}>
            <Button
              disabled={client.name === '' || blockButton}
              onClick={() => isEdit.current ? updateClient() : saveClient()}
            >
              Save
            </Button>
          </div>
        </div>
      </Modal>
      <Button variant="filled" onClick={open}>Add Client</Button>
    </div>
  )
}