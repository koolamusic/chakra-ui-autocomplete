# Chakra-UI AutoComplete
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![Financial Contributors on Open Collective](https://opencollective.com/chakra-ui-autocomplete/all/badge.svg?label=financial+contributors)](https://opencollective.com/chakra-ui-autocomplete) [![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

> An Accessible Autocomplete Utility for [Chakra UI](github.com/chakra-ui/chakra-ui) that composes [Downshift](https://github.com/downshift-js/downshift) ComboBox

[![NPM](https://img.shields.io/npm/v/chakra-ui-autocomplete.svg)](https://www.npmjs.com/package/chakra-ui-autocomplete) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

![demo-image](./img/basic.gif)

## Install

**Warning* This Package is still WIP at the Moment and there might be some missing features

```bash
npm install --save chakra-ui-autocomplete
```

## Usage

- Usage Example with TSX/Typescript

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

- Usage Example with JSX/Javascript

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

[View on CodeSandbox](https://codesandbox.io/s/chakra-ui-autocomplete-example1-8uxbs)
[![109296467-3cdbe100-7828-11eb-9491-1bd069bf90a4](https://user-images.githubusercontent.com/587136/109479134-1922d000-7aa0-11eb-9a7f-14d3a5f0d63d.png)](https://codesandbox.io/s/chakra-ui-autocomplete-example1-8uxbs)

### Usage Example with Custom Item Renderer

![custom-render-image](./img/custom-example.gif)


```jsx
import React from 'react'
import { Text, Flex, Avatar } from '@chakra-ui/react'
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

  const customRender = (selected) => {
    return (
      <Flex flexDir="row" alignItems="center">
        <Avatar mr={2} size="sm" name={selected.label} />
        <Text>{selected.label}</Text>
      </Flex>
    )
  }

  const customCreateItemRender = (value) => {
    return (
      <Text>
        <Box as='span'>Create</Box>{' '}
        <Box as='span' bg='red.300' fontWeight='bold'>
          "{value}"
        </Box>
      </Text>
    )
  }



  return (
          <CUIAutoComplete
            tagStyleProps={{
              rounded: 'full'
            }}
            label="Choose preferred work locations"
            placeholder="Type a Country"
            onCreateItem={handleCreateItem}
            items={pickerItems}
            itemRenderer={customRender}
            createItemRenderer={customCreateItemRender}
            selectedItems={selectedItems}
            onSelectedItemsChange={(changes) =>
              handleSelectedItemsChange(changes.selectedItems)
            }
          />
  );
}

```

## Props

| Property               | Type     | Required | Decscription                                                                                                                                                     |
| ---------------------- | -------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| items                  | Array    | Yes      | An array of the items to be selected within the input field                                                                                                      |
| placeholder            | string   |          | The placeholder for the input field                                                                                                                              |
| label                  | string   | Yes      | Input Form Label to describe the activity or process                                                                                                             |
| highlightItemBg        | string   |          | For accessibility, you can define a custom color for the highlight color when user is typing also accept  props like `yellow.300` based on chakra theme provider |
| onCreateItem           | Function | Yes      | Function to handle creating new Item                                                                                                                             |
| optionFilterFunc       | Function |          | You can define a custom Function to handle filter logic                                                                                                          |
| itemRenderer           | Function |          | Custom Function that can either return a JSX Element or String, in order to control how the list items within the Dropdown is rendered                           |
| labelStyleProps        | Object   |          | Custom style props based on chakra-ui for labels, Example `{{ bg: 'gray.100', pt: '4'}}                                                                          |
| inputStyleProps        | Object   |          | Custom style props based on chakra-ui for input field, Example`{{ bg: 'gray.100', pt: '4'}}                                                                      |
| toggleButtonStyleProps | Object   |          | Custom style props based on chakra-ui for toggle button, Example `{{ bg: 'gray.100', pt: '4'}}                                                                   |
| tagStyleProps          | Object   |          | Custom style props based on chakra-ui for multi option tags, Example`{{ bg: 'gray.100', pt: '4'}}                                                                |
| listStyleProps         | Object   |          | Custom style props based on chakra-ui for dropdown list, Example `{{ bg: 'gray.100', pt: '4'}}                                                                   |
| listItemStyleProps     | Object   |          | Custom style props based on chakra-ui for single list item in dropdown, Example`{{ bg: 'gray.100', pt: '4'}}                                                     |
| selectedIconProps      | Object   |          | Custom style props based on chakra-ui for the green tick icon in dropdown list, Example `{{ bg: 'gray.100', pt: '4'}}                                            |
| icon      | Object   |   CheckCircleIcon       | @chakra-ui/icons Icon to be displayed instead of CheckCircleIcon                                            |
| hideToggleButton      | boolean   |          | Hide the toggle button                                         |
| disableCreateItem      | boolean   |          | Disable the "create new"  list Item. Default is `false`                                             |
| createItemRenderer      | Function   |          | Custom Function that can either return a JSX Element or String, in order to control how the create new item within the Dropdown is rendered. The input value is passed as the first function parameter, Example: ``` (value) => `Create ${value}` ```                                            |
| renderCustomInput         | Function    |       | Custom function to render input from outside chakra-ui-autocomplete. Receives input props for the input element and toggleButtonProps for the toggle button. Can use this to render chakra-ui's ```<InputGroup>```. Example: ```(inputProps) => (<InputGroup><InputLeftElement pointerEvents="none" children={<PhoneIcon color="gray.300" />} /><Input {...inputProps} /></InputGroup>)```

## Todo

- [ ] Add Combobox Support for Single Select [Downshift Combobox](https://downshift.netlify.app/use-combobox)
- [x] Multi Select Support
- [x] Feature to Create when not in list
- [x] Add prop for Items Renderer to enable rendering of React Element
- [ ] Ability to define `chakra-ui components` that will render in place of `Tags, MenuList, TextInput, Form Label` will check render props or headless UI patterns.

## Contributors

### Code Contributors
<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="http://kuasha.xyz"><img src="https://avatars.githubusercontent.com/u/6187401?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Arafat Zahan</b></sub></a><br /><a href="https://github.com/koolamusic/chakra-ui-autocomplete/commits?author=kuasha420" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/joaoviana"><img src="https://avatars.githubusercontent.com/u/7611706?v=4?s=100" width="100px;" alt=""/><br /><sub><b>João Viana</b></sub></a><br /><a href="https://github.com/koolamusic/chakra-ui-autocomplete/commits?author=joaoviana" title="Code">💻</a></td>
    <td align="center"><a href="https://demah.ir"><img src="https://avatars.githubusercontent.com/u/17513392?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Hamed Sedighi</b></sub></a><br /><a href="https://github.com/koolamusic/chakra-ui-autocomplete/commits?author=herol3oy" title="Code">💻</a></td>
    <td align="center"><a href="http://akashsingh.blog"><img src="https://avatars.githubusercontent.com/u/9202515?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Akash Singh</b></sub></a><br /><a href="https://github.com/koolamusic/chakra-ui-autocomplete/commits?author=akash4393" title="Code">💻</a></td>
    <td align="center"><a href="https://ifbmt.info"><img src="https://avatars.githubusercontent.com/u/2472115?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Anthony Master</b></sub></a><br /><a href="https://github.com/koolamusic/chakra-ui-autocomplete/commits?author=amaster507" title="Documentation">📖</a> <a href="https://github.com/koolamusic/chakra-ui-autocomplete/commits?author=amaster507" title="Tests">⚠️</a> <a href="https://github.com/koolamusic/chakra-ui-autocomplete/commits?author=amaster507" title="Code">💻</a></td>
    <td align="center"><a href="https://vidur.io"><img src="https://avatars.githubusercontent.com/u/587136?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Vidur Murali</b></sub></a><br /><a href="https://github.com/koolamusic/chakra-ui-autocomplete/commits?author=vyder" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/it-nalon"><img src="https://avatars.githubusercontent.com/u/8491676?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Marco Nalon</b></sub></a><br /><a href="https://github.com/koolamusic/chakra-ui-autocomplete/commits?author=it-nalon" title="Tests">⚠️</a> <a href="https://github.com/koolamusic/chakra-ui-autocomplete/commits?author=it-nalon" title="Code">💻</a> <a href="https://github.com/koolamusic/chakra-ui-autocomplete/commits?author=it-nalon" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/koolamusic"><img src="https://avatars.githubusercontent.com/u/8960757?v=4?s=100" width="100px;" alt=""/><br /><sub><b>U.M Andrew</b></sub></a><br /><a href="https://github.com/koolamusic/chakra-ui-autocomplete/commits?author=koolamusic" title="Documentation">📖</a> <a href="https://github.com/koolamusic/chakra-ui-autocomplete/commits?author=koolamusic" title="Tests">⚠️</a> <a href="https://github.com/koolamusic/chakra-ui-autocomplete/commits?author=koolamusic" title="Code">💻</a></td>
    <td align="center"><a href="https://believeplus.com/"><img src="https://avatars.githubusercontent.com/u/67389482?v=4?s=100" width="100px;" alt=""/><br /><sub><b>sr.cristofher</b></sub></a><br /><a href="https://github.com/koolamusic/chakra-ui-autocomplete/commits?author=srcristofher" title="Documentation">📖</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project exists thanks to all the people who contribute. [[Contribute](CONTRIBUTING.md)].
<a href="https://github.com/undefined/undefined/graphs/contributors"><img src="https://opencollective.com/chakra-ui-autocomplete/contributors.svg?width=890&button=false" /></a>

### Financial Contributors

Become a financial contributor and help us sustain our community. [[Contribute](https://opencollective.com/chakra-ui-autocomplete/contribute)]

#### Individuals

<a href="https://opencollective.com/chakra-ui-autocomplete"><img src="https://opencollective.com/chakra-ui-autocomplete/individuals.svg?width=890"></a>

#### Organizations

Support this project with your organization. Your logo will show up here with a link to your website. [[Contribute](https://opencollective.com/chakra-ui-autocomplete/contribute)]

<a href="https://opencollective.com/chakra-ui-autocomplete/organization/0/website"><img src="https://opencollective.com/chakra-ui-autocomplete/organization/0/avatar.svg"></a>
<a href="https://opencollective.com/chakra-ui-autocomplete/organization/1/website"><img src="https://opencollective.com/chakra-ui-autocomplete/organization/1/avatar.svg"></a>
<a href="https://opencollective.com/chakra-ui-autocomplete/organization/2/website"><img src="https://opencollective.com/chakra-ui-autocomplete/organization/2/avatar.svg"></a>
<a href="https://opencollective.com/chakra-ui-autocomplete/organization/3/website"><img src="https://opencollective.com/chakra-ui-autocomplete/organization/3/avatar.svg"></a>
<a href="https://opencollective.com/chakra-ui-autocomplete/organization/4/website"><img src="https://opencollective.com/chakra-ui-autocomplete/organization/4/avatar.svg"></a>
<a href="https://opencollective.com/chakra-ui-autocomplete/organization/5/website"><img src="https://opencollective.com/chakra-ui-autocomplete/organization/5/avatar.svg"></a>
<a href="https://opencollective.com/chakra-ui-autocomplete/organization/6/website"><img src="https://opencollective.com/chakra-ui-autocomplete/organization/6/avatar.svg"></a>
<a href="https://opencollective.com/chakra-ui-autocomplete/organization/7/website"><img src="https://opencollective.com/chakra-ui-autocomplete/organization/7/avatar.svg"></a>
<a href="https://opencollective.com/chakra-ui-autocomplete/organization/8/website"><img src="https://opencollective.com/chakra-ui-autocomplete/organization/8/avatar.svg"></a>
<a href="https://opencollective.com/chakra-ui-autocomplete/organization/9/website"><img src="https://opencollective.com/chakra-ui-autocomplete/organization/9/avatar.svg"></a>

## License

MIT © [koolamusic](https://github.com/koolamusic)
