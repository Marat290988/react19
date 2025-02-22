import { TextInput } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import Inputmask from 'inputmask';

interface PriceInputProps {
  onChangePrice?: (price: string) => void,
  hasError?: boolean,
  price?: string,
  label?: string,
}

export const PriceInput: React.FC<PriceInputProps> = ({ onChangePrice, hasError, price, label }) => {

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [value, setValue] = useState(price ? price :'');

  useEffect(() => {
    if (inputRef.current) {
      Inputmask({
        placeholder: '',
        alias: 'numeric',
        digits: 2,
      }).mask(inputRef.current);
    }
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    onChangePrice && onChangePrice(event.target.value);
  };

  return (
    <TextInput 
      label={label ? label : "Sale price"}
      value={value}
      onChange={handleChange}
      ref={inputRef}
      error={hasError}
    />
  );
}