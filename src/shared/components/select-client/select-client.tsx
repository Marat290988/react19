import { Autocomplete, AutocompleteProps, Group } from "@mantine/core"
import useClientStore from "../../../store/client.store"
import { useEffect, useRef } from "react";
import { IClient } from "../../../api/clients";

interface SelectClientProps {
  onSelectClient?: (client: IClient) => void,
  hasError?: boolean
}

export const SelectClient: React.FC<SelectClientProps> = ({ onSelectClient, hasError }) => {

  const { clients } = useClientStore();
  const data: { value: string, label: string }[] = clients.map(client => ({ value: client.id, label: client.name }));
  const clientsData: Record<string, { label: string, value: string }> = {};
  clients.forEach(client => clientsData[client.id] = { label: client.name, value: client.id });

  const selectClient = (clientId: string) => {
    const findClient = clients.find(client => client.id === clientId);
    if (onSelectClient && findClient) {
      onSelectClient(findClient);
    }
  }

  const renderAutocompleteOption: AutocompleteProps['renderOption'] = ({ option }) => {

    const optionElement = useRef<HTMLDivElement | null>(null);
    const selector = 'mantine-Autocomplete-option';
    const selectorListining = 'listining';

    useEffect(() => {
      if (optionElement.current) {
        const parent = optionElement.current.closest('.' + selector);
        if (parent && !parent.classList.contains(selectorListining)) {
          parent.classList.add(selectorListining);
          parent.addEventListener('click', () => selectClient(clientsData[option.value].value));
        }
      }
    }, [optionElement])

    return (<Group>
      <div ref={optionElement}>
        {clientsData[option.value].label}
      </div>
    </Group>)
  };

  return (
    <Autocomplete 
      label="Client"
      placeholder="Pick client or enter"
      renderOption={renderAutocompleteOption}
      data={data}
      onInput={(e) => onSelectClient && onSelectClient({ id: '', name: (e.target as any).value as string, contacts: '', fbId: '' })}
      error={hasError}
    />
  )
}