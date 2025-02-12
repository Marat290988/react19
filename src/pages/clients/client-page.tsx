import { AddClient } from '../../shared/components/add-client/add-client';
import styles from './client-page.module.scss';

export const ClientPage: React.FC = () => {

  return (
    <div className={styles['client-page']}>
      <AddClient />
    </div>
  )
}