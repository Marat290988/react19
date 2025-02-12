import { useDisclosure } from '@mantine/hooks';
import styles from './add-client.module.scss';
import { Button, Modal } from '@mantine/core';

export const AddClient: React.FC = () => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <div className={styles['add-client']}>
      <Modal
        title="Add / Edit Client"
        opened={opened}
        onClose={close}
        centered
      ></Modal>
      <Button variant="filled" onClick={open}>Add Client</Button>
    </div>
  )
}