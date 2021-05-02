import React, { FC } from 'react'
import { Avatar, Flex, Heading, Text } from '@chakra-ui/react'
import { CUIAutoComplete } from 'chakra-ui-autocomplete'
import { countries } from './constants'
import { Item } from './App'

type Props = {
//
}

export const AutoCompleteExample: FC<Props> = () => {
  const [pickerItems, setPickerItems] = React.useState(countries);
  const [selectedItem, setSelectedItem] = React.useState<Item | undefined>(undefined);

  const handleCreateItem = (item: Item) => {
    setPickerItems((curr) => [...curr, item]);
    setSelectedItem(() => item);
  };

  const handleSelectedItemChange = (selectedItem?: Item | null) => {
    if (selectedItem) {
      setSelectedItem(selectedItem);
    }
  };

  const customRender = <T extends Item>(selected: T) => {
    return (
      <Flex flexDir="row" alignItems="center">
        <Avatar mr={2} size="sm" name={selected.label} />
        <Text>{selected.label}</Text>
      </Flex>
    )
  }
  
  return (
    <Flex minW="25rem" w="25rem" flexDirection="column" my={20}>
      <Heading mb={8} as="h1" size="lg" color="blue.600">AutoComplete.tsx</Heading>

      <Heading mb={3} as="h2" size="md">Basic Example with Style Props</Heading>

      <CUIAutoComplete
        label="Choose preferred work locations"
        placeholder="Type a Country"
        onCreateItem={handleCreateItem}
        items={pickerItems}
        selectedItem={selectedItem}
        onSelectedItemChange={(changes) => handleSelectedItemChange(changes.selectedItem)}
      />


      <Flex mt={6} />
      <Heading mb={3} as="h2" size="md">Basic Example with Custom Renderer</Heading>
      <CUIAutoComplete
        label="Choose preferred work locations"
        placeholder="Type a Country"
        onCreateItem={handleCreateItem}
        items={pickerItems}
        itemRenderer={customRender}
        selectedItem={selectedItem}
        onSelectedItemChange={(changes) => handleSelectedItemChange(changes.selectedItem)}
      />
    </Flex>
  )
}
