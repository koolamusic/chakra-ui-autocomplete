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

import { CUIMultipleAutoCompleteProps, CUIMultipleAutoComplete, Item } from '../src'

export default {
  title: 'Documentation/CUIMultipleAutoComplete',
  component: CUIMultipleAutoComplete,
  argTypes: {
    highlightItemBg: { control: 'color' },
  },
} as Meta

const Template: Story<CUIMultipleAutoCompleteProps<Item>> = (args) => <CUIMultipleAutoComplete {...args} />

export const SimpleExample = Template.bind({})

SimpleExample.args = {
  items: countries
}
