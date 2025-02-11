import { Button, Modal } from '@mantine/core';
import styles from './are-you-sure.module.scss';
import { useDisclosure } from '@mantine/hooks';

export const AreYouSure: React.FC<{ onConfirm: () => Promise<any>}> = ({ onConfirm }) => {

  const [opened, { close }] = useDisclosure(false);

  const yeasHandler = () => {
    onConfirm().finally(() => {
      close();
    })
  }

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        centered
      >
        <div className="are-you-sure-content">
          <p className={styles['are-you-sure-content__text']}>Are you sure?</p>
          <div className={styles['are-you-sure-content__buttons']}>
            <Button onClick={yeasHandler} color="red">Yes</Button>
            <Button onClick={() => close()} color="gray">No</Button>
          </div>
        </div>
      </Modal>
    </>
  )
}