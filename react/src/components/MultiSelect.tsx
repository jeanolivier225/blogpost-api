import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import type {SelectOption} from "../models/Others/SelectOption.ts";

const animatedComponents = makeAnimated();

interface SelectProps {
  options: SelectOption[];
  defaultValue?: SelectOption[];
  isMulti?: boolean;
  onChange?: () => void;
}

const MultiSelect = ({ options, defaultValue, isMulti = false, onChange }: SelectProps) => {
  return (
    <Select
      closeMenuOnSelect={!isMulti}
      components={animatedComponents}
      defaultValue={defaultValue}
      isMulti={isMulti}
      options={options}
      onChange={onChange}
    />
  );
};

export default MultiSelect;
