import { useRef, useState } from 'react';
import { IClient } from '../../../../../../api/clients';
import useClientStore from '../../../../../../store/client.store';
import styles from './order-select-client.module.scss';

interface IOrderSelectClientProps {
  onSelect?: (client: IClient | string) => void;
  value: string;
}

export const OrderSelectClient: React.FC<IOrderSelectClientProps> = ({ onSelect, value: initValue }) => {

  const { clients } = useClientStore();
  const [value, setValue] = useState<string>(initValue || '');
  const [isSearch, setIsSearch] = useState<boolean>(false);
  const contRef = useRef<HTMLInputElement>(null);
  const clientRef = useRef<IClient | null>(null);

  let width = '';
  if (contRef.current) {
    width = (contRef.current.getBoundingClientRect().width) + 'px';
  }

  const searchedClients: IClient[] = value === '' ? [] : clients.filter(c => c.name.toLowerCase().includes(value.toLowerCase()));

  const onSelectClient = (client: IClient) => {
    setValue(client.name);
    clientRef.current = client;
    if (onSelect) {
      onSelect(client);
    }
  }

  const onBlurInput = () => {
    setTimeout(() => {
      setIsSearch(false);
      if (clientRef.current) {
        return;
      }
      onSelect && onSelect(value);
    }, 200)
  }

  return (
    <div className={styles['order-select-client']} ref={contRef}>
      <input
        value={value}
        onChange={e => { setValue(e.target.value); clientRef.current = null; }}
        style={{ backgroundColor: value === '' ? 'var(--red-light)' : '' }}
        onFocus={() => setIsSearch(true)}
        onBlur={() => onBlurInput()}
      />
      {(searchedClients.length > 0 && isSearch) && <>
        <ul style={{ width: width }}>
          {searchedClients.map(c => <li key={c.id} onClick={() => onSelectClient(c)}>{c.name}</li>)}
        </ul>
      </>}
    </div>
  )
}