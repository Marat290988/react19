import { Button, Modal } from '@mantine/core';
import styles from './sure-button.module.scss';
import { useDisclosure } from '@mantine/hooks';
import { IGrid } from '../custom-grid';

type TypeGridButton = IGrid['columns'][number]['buttons'] extends undefined
? never
: NonNullable<IGrid['columns'][number]['buttons']>[number];

export const ButtonSure: React.FC<{ onConfirm: () => Promise<any>, btnConfig: TypeGridButton, title: string }> = ({ onConfirm, btnConfig }) => {

  const [opened, { open, close }] = useDisclosure(false);

  const yeasHandler = () => {
    onConfirm().finally(() => {
      close();
    })
  }

  return (
    <>
      <Button onClick={() => open()} color={btnConfig.buttonColor ? btnConfig.buttonColor : ''}>{btnConfig.buttonTitle}</Button>
      <Modal
        opened={opened}
        onClose={close}
        centered
        size="200px"
        styles={{
          header: {
            padding: '0 0.5rem',
            minHeight: '3rem',
          }
        }}
      >
        <div className={styles['are-you-sure-content']}>
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