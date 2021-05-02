import React from 'react'
import { ThemeProvider, CSSReset, Flex } from '@chakra-ui/react'
import theme from './theme'
import { AutocompleteExample } from './AutocompleteExample';
import { MultipleAutocompleteExample } from './MultipleAutocompleteExample';


export interface Item {
  label: string;
  value: string;
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CSSReset />

      <Flex flexDir="column" flexWrap="wrap" px={6} pt={12} pb={20} bg="rgba(247,250,252)" justify="center" alignItems="center" borderRight="1px solid #ddd">
        <AutocompleteExample />
        <MultipleAutocompleteExample />
      </Flex>

    </ThemeProvider >
  );
}
