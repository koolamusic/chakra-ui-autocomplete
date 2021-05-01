import React from 'react';
import { Story, Meta } from '@storybook/react';

import { CUIAutoComplete, CUIAutoCompleteProps, Item } from '../src';

export default {
  title: 'Documentation/CUIAutoComplete',
  component: CUIAutoComplete,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta;

const Template: Story<CUIAutoCompleteProps<Item>> = (args) => <CUIAutoComplete {...args} />;

export const Default = Template.bind({});
Default.args = {
  items: []
}
