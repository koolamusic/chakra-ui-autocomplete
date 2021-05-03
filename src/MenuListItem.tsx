import React, { FC } from 'react'
import { ListItem, ListItemProps } from '@chakra-ui/react'

export const MenuListItem: FC<ListItemProps> = (props) => {
  return (
    <ListItem
      px={2}
      py={1}
      borderBottom='1px solid rgba(0,0,0,0.01)'
      {...props}
    />
  )
}