import React from 'react'
import { Story, Meta } from '@storybook/react'

const countries = [
  { value: "ghana", label: "Ghana" },
  { value: "nigeria", label: "Nigeria" },
  { value: "kenya", label: "Kenya" },
  { value: "southAfrica", label: "South Africa" },
  { value: "unitedStates", label: "United States" },
  { value: "canada", label: "Canada" },
  { value: "germany", label: "Germany" }
]

import { CUIMultipleAutocompleteProps, CUIMultipleAutocomplete, Item } from '../src'

export default {
  title: 'Documentation/CUIMultipleAutocomplete',
  component: CUIMultipleAutocomplete,
  argTypes: {
    highlightItemBg: { control: 'color' },
  },
} as Meta

const Template: Story<CUIMultipleAutocompleteProps<Item>> = (args) => <CUIMultipleAutocomplete {...args} />

export const SimpleExample = Template.bind({})

SimpleExample.args = {
  items: countries
}
