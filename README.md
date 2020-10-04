# Chakra-UI AutoComplete

> An Accessible Autocomplete Utility for Chakra UI that composes Downshift ComboBox

[![NPM](https://img.shields.io/npm/v/chakra-ui-autocomplete.svg)](https://www.npmjs.com/package/chakra-ui-autocomplete) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)


![demo-image](./demo.gif)

## Install

**Warning* This Package is still WIP at the Moment and there might be some missing features

```bash
npm install --save chakra-ui-autocomplete
```

## Usage

Usage Example with TSX/Typescript

```tsx
import React from 'react'
import { CUIAutoComplete } from 'chakra-ui-autocomplete'


export interface Item {
  label: string;
  value: string;
}
const countries = [
  { value: "ghana", label: "Ghana" },
  { value: "nigeria", label: "Nigeria" },
  { value: "kenya", label: "Kenya" },
  { value: "southAfrica", label: "South Africa" },
  { value: "unitedStates", label: "United States" },
  { value: "canada", label: "Canada" },
  { value: "germany", label: "Germany" }
];

export default function App() {
  const [pickerItems, setPickerItems] = React.useState(countries);
  const [selectedItems, setSelectedItems] = React.useState<Item[]>([]);

  const handleCreateItem = (item: Item) => {
    setPickerItems((curr) => [...curr, item]);
    setSelectedItems((curr) => [...curr, item]);
  };

  const handleSelectedItemsChange = (selectedItems?: Item[]) => {
    if (selectedItems) {
      setSelectedItems(selectedItems);
    }
  };

  return (
        <CUIAutoComplete
          label="Choose preferred work locations"
          placeholder="Type a Country"
          onCreateItem={handleCreateItem}
          items={pickerItems}
          selectedItems={selectedItems}
          onSelectedItemsChange={(changes) =>
            handleSelectedItemsChange(changes.selectedItems)
          }
        />
  );
}
```

---
Usage Example with JSX/Javascript

```jsx
import React from 'react'
import { CUIAutoComplete } from 'chakra-ui-autocomplete'

const countries = [
  { value: "ghana", label: "Ghana" },
  { value: "nigeria", label: "Nigeria" },
  { value: "kenya", label: "Kenya" },
  { value: "southAfrica", label: "South Africa" },
  { value: "unitedStates", label: "United States" },
  { value: "canada", label: "Canada" },
  { value: "germany", label: "Germany" }
];

export default function App() {
  const [pickerItems, setPickerItems] = React.useState(countries);
  const [selectedItems, setSelectedItems] = React.useState([]);

  const handleCreateItem = (item) => {
    setPickerItems((curr) => [...curr, item]);
    setSelectedItems((curr) => [...curr, item]);
  };

  const handleSelectedItemsChange = (selectedItems) => {
    if (selectedItems) {
      setSelectedItems(selectedItems);
    }
  };

  return (
        <CUIAutoComplete
          label="Choose preferred work locations"
          placeholder="Type a Country"
          onCreateItem={handleCreateItem}
          items={pickerItems}
          selectedItems={selectedItems}
          onSelectedItemsChange={(changes) =>
            handleSelectedItemsChange(changes.selectedItems)
          }
        />
  );
}
```

## Todo

- [ ] Add Combobox Support for Single Select [Downshift Combobox](https://downshift.netlify.app/use-combobox)
- [x] Multi Select Support
- [x] Feature to Create when not in list
- [ ] Ability to define `chakra-ui components` that will render in place of `Tags, MenuList, TextInput, Form Label` will check render props or headless UI patterns.

## License

MIT © [koolamusic](https://github.com/koolamusic)
