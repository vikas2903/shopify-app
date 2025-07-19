import { Autocomplete, Icon } from '@shopify/polaris';
import { SearchIcon } from '@shopify/polaris-icons';  // Make sure you are importing the correct icon
import { useState, useCallback, useMemo } from 'react';

function AutocompleteExample() {
  // Define available options (tags)
  const deselectedOptions = useMemo(
    () => [
      { value: 'rustic', label: 'Rustic' },
      { value: 'antique', label: 'Antique' },
      { value: 'vinyl', label: 'Vinyl' },
      { value: 'vintage', label: 'Vintage' },
      { value: 'refurbished', label: 'Refurbished' },
    ],
    [],
  );

  // State to manage input value, selected options and available options
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState(deselectedOptions);

  // Function to update the text input and filter available options
  const updateText = useCallback(
    (value) => {
      setInputValue(value);

      if (value === '') {
        setOptions(deselectedOptions);
        return;
      }

      const filterRegex = new RegExp(value, 'i');
      const resultOptions = deselectedOptions.filter((option) =>
        option.label.match(filterRegex),
      );
      setOptions(resultOptions);
    },
    [deselectedOptions],
  );

  // Function to update the selected options when user selects an option
  const updateSelection = useCallback(
    (selected) => {
      const selectedLabels = selected.map((selectedItem) => {
        const matchedOption = options.find((option) => option.value === selectedItem);
        return matchedOption ? matchedOption.label : '';
      });

      setSelectedOptions(selected);
      setInputValue(selectedLabels.join(', '));  // Join all selected labels
      console.log('Selected options:', selectedLabels);  // Console log selected options
    },
    [options],
  );

  // The text field component used inside Autocomplete
  const textField = (
    <Autocomplete.TextField
      onChange={updateText}
      label="Tags"
      value={inputValue}
      prefix={<Icon source={SearchIcon} />}
      placeholder="Search"
      autoComplete="off"
    />
  );

  return (
    <div style={{ height: '225px' }}>
      <Autocomplete
        options={options}
        selected={selectedOptions}
        onSelect={updateSelection}
        textField={textField}
      />
    </div>
  );
}

export default AutocompleteExample;
