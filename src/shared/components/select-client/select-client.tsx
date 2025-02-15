import { Autocomplete } from "@mantine/core"
import useClientStore from "../../../store/client.store"

export const SelectClient: React.FC = () => {

  const { clients } = useClientStore();
  const data: { value: string, label: string }[] = clients.map(client => ({ value: client.id, label: client.name }));

  return (
    <Autocomplete 
      label="Client"
      placeholder="Pick client or enter"
      data={data}
    />
  )
}