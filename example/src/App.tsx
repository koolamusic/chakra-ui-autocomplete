import React from 'react'
import { ThemeProvider, CSSReset, Flex } from '@chakra-ui/core'

import { ChakraMultipleCreate } from 'chakra-ui-autocomplete'


// import { CreateablePicker, Item } from "./CreateablePicker";

export interface Item {
  label: string;
  value: string;
}


const fruits = [
  { value: "ghana", label: "Ghana" },
  { value: "nigeria", label: "Nigeria" },
  { value: "kenya", label: "Kenya" },
  { value: "southAfrica", label: "South Africa" },
  { value: "unitedStates", label: "United States" },
  { value: "canada", label: "Canada" },
  { value: "germany", label: "Germany" }
];

export default function App() {
  const [pickerItems, setPickerItems] = React.useState(fruits);
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
    <ThemeProvider>
      <CSSReset />

      <Flex justify="center" width="100%">

        <ChakraMultipleCreate
          menuStyleProps={{
            color: "#333"
          }}
          label="Choose your Home Country"
          placeholder="Type a Country"
          onCreateItem={handleCreateItem}
          items={pickerItems}
          selectedItems={selectedItems}
          onSelectedItemsChange={(changes) =>
            handleSelectedItemsChange(changes.selectedItems)
          }
        />

      </Flex>
    </ThemeProvider >
  );
}